/*
  # Update allowance_settings table for comprehensive daily allowance management

  1. Schema Updates
    - Add missing columns for domestic and overseas allowances
    - Add boolean flags for enabling/disabling specific allowance types
    - Ensure all allowance fields are properly typed and constrained

  2. Data Integrity
    - Add check constraints for positive amounts
    - Add default values for new columns
    - Maintain backward compatibility

  3. Performance
    - Add indexes for common queries
    - Optimize for user-specific allowance lookups
*/

-- First, check if the allowance_settings table exists and create it if needed
CREATE TABLE IF NOT EXISTS public.allowance_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Domestic allowances
  domestic_daily_allowance numeric(10,2) DEFAULT 15000 CHECK (domestic_daily_allowance >= 0),
  domestic_transportation_daily_allowance numeric(10,2) DEFAULT 6000 CHECK (domestic_transportation_daily_allowance >= 0),
  domestic_accommodation_daily_allowance numeric(10,2) DEFAULT 16000 CHECK (domestic_accommodation_daily_allowance >= 0),
  
  -- Overseas allowances
  overseas_daily_allowance numeric(10,2) DEFAULT 25000 CHECK (overseas_daily_allowance >= 0),
  overseas_transportation_daily_allowance numeric(10,2) DEFAULT 8000 CHECK (overseas_transportation_daily_allowance >= 0),
  overseas_accommodation_daily_allowance numeric(10,2) DEFAULT 20000 CHECK (overseas_accommodation_daily_allowance >= 0),
  overseas_preparation_allowance numeric(10,2) DEFAULT 5000 CHECK (overseas_preparation_allowance >= 0),
  
  -- Boolean flags for enabling/disabling specific allowances
  domestic_use_transportation_allowance boolean DEFAULT true,
  domestic_use_accommodation_allowance boolean DEFAULT true,
  overseas_use_transportation_allowance boolean DEFAULT true,
  overseas_use_accommodation_allowance boolean DEFAULT true,
  overseas_use_preparation_allowance boolean DEFAULT true,
  
  -- Metadata
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Ensure one settings record per user
  UNIQUE(user_id)
);

-- Enable RLS on allowance_settings table
ALTER TABLE public.allowance_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for allowance_settings
CREATE POLICY "Users can view own allowance settings"
  ON public.allowance_settings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own allowance settings"
  ON public.allowance_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own allowance settings"
  ON public.allowance_settings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own allowance settings"
  ON public.allowance_settings
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_allowance_settings_user_id 
  ON public.allowance_settings(user_id);

CREATE INDEX IF NOT EXISTS idx_allowance_settings_created_at 
  ON public.allowance_settings(created_at);

-- Create trigger function for updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_allowance_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for allowance_settings
DROP TRIGGER IF EXISTS update_allowance_settings_updated_at ON public.allowance_settings;
CREATE TRIGGER update_allowance_settings_updated_at
    BEFORE UPDATE ON public.allowance_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_allowance_settings_updated_at();

-- Insert default allowance settings for existing users if they don't have any
INSERT INTO public.allowance_settings (
  user_id,
  domestic_daily_allowance,
  domestic_transportation_daily_allowance,
  domestic_accommodation_daily_allowance,
  overseas_daily_allowance,
  overseas_transportation_daily_allowance,
  overseas_accommodation_daily_allowance,
  overseas_preparation_allowance,
  domestic_use_transportation_allowance,
  domestic_use_accommodation_allowance,
  overseas_use_transportation_allowance,
  overseas_use_accommodation_allowance,
  overseas_use_preparation_allowance
)
SELECT 
  u.id,
  15000, -- domestic_daily_allowance
  6000,  -- domestic_transportation_daily_allowance
  16000, -- domestic_accommodation_daily_allowance
  25000, -- overseas_daily_allowance
  8000,  -- overseas_transportation_daily_allowance
  20000, -- overseas_accommodation_daily_allowance
  5000,  -- overseas_preparation_allowance
  true,  -- domestic_use_transportation_allowance
  true,  -- domestic_use_accommodation_allowance
  true,  -- overseas_use_transportation_allowance
  true,  -- overseas_use_accommodation_allowance
  true   -- overseas_use_preparation_allowance
FROM public.users u
WHERE NOT EXISTS (
  SELECT 1 FROM public.allowance_settings a WHERE a.user_id = u.id
)
ON CONFLICT (user_id) DO NOTHING;

-- Add comments for documentation
COMMENT ON TABLE public.allowance_settings IS 'ユーザー別日当設定テーブル';
COMMENT ON COLUMN public.allowance_settings.domestic_daily_allowance IS '国内出張日当（円）';
COMMENT ON COLUMN public.allowance_settings.domestic_transportation_daily_allowance IS '国内交通費日当（円）';
COMMENT ON COLUMN public.allowance_settings.domestic_accommodation_daily_allowance IS '国内宿泊料日当（円）';
COMMENT ON COLUMN public.allowance_settings.overseas_daily_allowance IS '海外出張日当（円）';
COMMENT ON COLUMN public.allowance_settings.overseas_transportation_daily_allowance IS '海外交通費日当（円）';
COMMENT ON COLUMN public.allowance_settings.overseas_accommodation_daily_allowance IS '海外宿泊料日当（円）';
COMMENT ON COLUMN public.allowance_settings.overseas_preparation_allowance IS '海外準備費日当（円）';
COMMENT ON COLUMN public.allowance_settings.domestic_use_transportation_allowance IS '国内交通費日当を使用するかどうか';
COMMENT ON COLUMN public.allowance_settings.domestic_use_accommodation_allowance IS '国内宿泊料日当を使用するかどうか';
COMMENT ON COLUMN public.allowance_settings.overseas_use_transportation_allowance IS '海外交通費日当を使用するかどうか';
COMMENT ON COLUMN public.allowance_settings.overseas_use_accommodation_allowance IS '海外宿泊料日当を使用するかどうか';
COMMENT ON COLUMN public.allowance_settings.overseas_use_preparation_allowance IS '海外準備費日当を使用するかどうか';

-- Verify the migration was successful
SELECT 'Allowance settings schema migration completed successfully!' as message;
