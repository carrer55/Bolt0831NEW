-- 改訂版管理の表示問題を解決するためのデータベース設計修正

-- 1. 既存のテーブル構造を確認・修正
-- travel_expense_regulationsテーブルの改善
ALTER TABLE travel_expense_regulations 
ADD COLUMN IF NOT EXISTS base_regulation_id UUID,
ADD COLUMN IF NOT EXISTS is_latest_version BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS parent_regulation_id UUID;

-- 2. 改訂版履歴テーブルの作成（既存のものを削除して再作成）
DROP TABLE IF EXISTS regulation_versions CASCADE;

CREATE TABLE regulation_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  base_regulation_id UUID NOT NULL,
  version_number INTEGER NOT NULL,
  version_name TEXT NOT NULL,
  company_name TEXT NOT NULL,
  company_address TEXT,
  representative TEXT,
  distance_threshold INTEGER DEFAULT 50,
  implementation_date DATE,
  is_transportation_real_expense BOOLEAN DEFAULT false,
  is_accommodation_real_expense BOOLEAN DEFAULT false,
  regulation_full_text TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'archived')),
  change_summary TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  -- 同一基本規程内での改訂版番号の一意性を保証
  UNIQUE(base_regulation_id, version_number)
);

-- 3. 改訂版役職設定テーブルの作成
CREATE TABLE regulation_version_positions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  regulation_version_id UUID NOT NULL REFERENCES regulation_versions(id) ON DELETE CASCADE,
  position_name TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  domestic_daily_allowance NUMERIC DEFAULT 0,
  domestic_accommodation_allowance NUMERIC DEFAULT 0,
  domestic_transportation_allowance NUMERIC DEFAULT 0,
  overseas_daily_allowance NUMERIC DEFAULT 0,
  overseas_accommodation_allowance NUMERIC DEFAULT 0,
  overseas_preparation_allowance NUMERIC DEFAULT 0,
  overseas_transportation_allowance NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. インデックスの作成
CREATE INDEX idx_regulation_versions_base_id ON regulation_versions(base_regulation_id);
CREATE INDEX idx_regulation_versions_company_name ON regulation_versions(company_name);
CREATE INDEX idx_regulation_versions_version_number ON regulation_versions(version_number);
CREATE INDEX idx_regulation_version_positions_version_id ON regulation_version_positions(regulation_version_id);

-- 5. 既存データの移行
-- 既存のtravel_expense_regulationsデータをregulation_versionsに移行
INSERT INTO regulation_versions (
  base_regulation_id,
  version_number,
  version_name,
  company_name,
  company_address,
  representative,
  distance_threshold,
  implementation_date,
  is_transportation_real_expense,
  is_accommodation_real_expense,
  regulation_full_text,
  status,
  change_summary,
  created_by
)
SELECT 
  id as base_regulation_id,
  COALESCE(revision_number, 1) as version_number,
  CASE 
    WHEN revision_number = 1 THEN '初版'
    ELSE '第' || COALESCE(revision_number, 1) || '版'
  END as version_name,
  company_name,
  company_address,
  representative,
  distance_threshold,
  implementation_date,
  is_transportation_real_expense,
  is_accommodation_real_expense,
  regulation_full_text,
  status,
  CASE 
    WHEN revision_number = 1 THEN '初版作成'
    ELSE '改訂版' || COALESCE(revision_number, 1) || 'として作成'
  END as change_summary,
  user_id as created_by
FROM travel_expense_regulations
WHERE id NOT IN (SELECT base_regulation_id FROM regulation_versions);

-- 6. 既存の役職データを改訂版役職設定テーブルに移行
INSERT INTO regulation_version_positions (
  regulation_version_id,
  position_name,
  sort_order,
  domestic_daily_allowance,
  domestic_accommodation_allowance,
  domestic_transportation_allowance,
  overseas_daily_allowance,
  overseas_accommodation_allowance,
  overseas_preparation_allowance,
  overseas_transportation_allowance
)
SELECT 
  rv.id as regulation_version_id,
  rp.position_name,
  COALESCE(rp.sort_order, 0) as sort_order,
  COALESCE(rp.domestic_daily_allowance, 0) as domestic_daily_allowance,
  COALESCE(rp.domestic_accommodation_allowance, 0) as domestic_accommodation_allowance,
  COALESCE(rp.domestic_transportation_allowance, 0) as domestic_transportation_allowance,
  COALESCE(rp.overseas_daily_allowance, 0) as overseas_daily_allowance,
  COALESCE(rp.overseas_accommodation_allowance, 0) as overseas_accommodation_allowance,
  COALESCE(rp.overseas_preparation_allowance, 0) as overseas_preparation_allowance,
  COALESCE(rp.overseas_transportation_allowance, 0) as overseas_transportation_allowance
FROM regulation_positions rp
JOIN regulation_versions rv ON rv.base_regulation_id = rp.regulation_id
WHERE rv.id NOT IN (SELECT regulation_version_id FROM regulation_version_positions);

-- 7. 基本規程IDの設定
UPDATE travel_expense_regulations 
SET base_regulation_id = id 
WHERE base_regulation_id IS NULL;

-- 8. 最新版フラグの設定
UPDATE travel_expense_regulations 
SET is_latest_version = true 
WHERE id IN (
  SELECT DISTINCT ON (company_name) id 
  FROM travel_expense_regulations 
  ORDER BY company_name, revision_number DESC
);

-- 9. 親規程IDの設定（改訂版の場合）
UPDATE travel_expense_regulations 
SET parent_regulation_id = (
  SELECT id 
  FROM travel_expense_regulations t2 
  WHERE t2.company_name = travel_expense_regulations.company_name 
    AND t2.revision_number = travel_expense_regulations.revision_number - 1
  LIMIT 1
)
WHERE revision_number > 1;

-- 10. RLSポリシーの設定
ALTER TABLE regulation_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE regulation_version_positions ENABLE ROW LEVEL SECURITY;

-- ユーザーは自分の作成した規程のみアクセス可能
CREATE POLICY "Users can view their own regulation versions" ON regulation_versions
  FOR SELECT USING (created_by = auth.uid());

CREATE POLICY "Users can insert their own regulation versions" ON regulation_versions
  FOR INSERT WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update their own regulation versions" ON regulation_versions
  FOR UPDATE USING (created_by = auth.uid());

CREATE POLICY "Users can delete their own regulation versions" ON regulation_versions
  FOR DELETE USING (created_by = auth.uid());

-- 役職設定のポリシー
CREATE POLICY "Users can view positions for their regulations" ON regulation_version_positions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM regulation_versions rv 
      WHERE rv.id = regulation_version_positions.regulation_version_id 
        AND rv.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can manage positions for their regulations" ON regulation_version_positions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM regulation_versions rv 
      WHERE rv.id = regulation_version_positions.regulation_version_id 
        AND rv.created_by = auth.uid()
    )
  );
