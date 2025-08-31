import React, { useState, useEffect } from 'react';
import { Save, Download, FileText, Calendar, MapPin, Calculator, Plus, Trash2 } from 'lucide-react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { supabase } from '../lib/supabase';
import { supabaseAuth } from '../lib/supabaseAuth';

interface TravelRegulationCreationProps {
  onNavigate: (view: 'dashboard' | 'business-trip' | 'expense' | 'tax-simulation' | 'travel-regulation-management' | 'travel-regulation-creation') => void;
}

interface Position {
  id: string;
  name: string;
  domesticDailyAllowance: number;
  domesticAccommodation: number;
  domesticTransportation: number;
  overseasDailyAllowance: number;
  overseasAccommodation: number;
  overseasPreparation: number;
  overseasTransportation: number;
}

interface CompanyInfo {
  name: string;
  address: string;
  representative: string;
  establishedDate: string;
  revision: number;
}

interface RegulationData {
  companyInfo: CompanyInfo;
  distanceThreshold: number; // 出張の定義（km）
  isTransportationRealExpense: boolean; // 交通費実費精算かどうか
  isAccommodationRealExpense: boolean; // 宿泊費実費精算かどうか
  positions: Position[];
  implementationDate: string; // 実施日
}

function TravelRegulationCreation({ onNavigate }: TravelRegulationCreationProps) {
  const authState = supabaseAuth.getAuthState();
  const { user } = authState;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [data, setData] = useState<RegulationData>({
    companyInfo: {
      name: '株式会社サンプル',
      address: '東京都千代田区丸の内1-1-1',
      representative: '代表取締役 山田太郎',
      establishedDate: new Date().toISOString().split('T')[0],
      revision: 1
    },
    distanceThreshold: 50,
    isTransportationRealExpense: false,
    isAccommodationRealExpense: false,
    positions: [
      { 
        id: '1', 
        name: '代表取締役', 
        domesticDailyAllowance: 8000, 
        domesticAccommodation: 15000, 
        domesticTransportation: 3000,
        overseasDailyAllowance: 15000, 
        overseasAccommodation: 25000, 
        overseasPreparation: 5000,
        overseasTransportation: 5000
      },
      { 
        id: '2', 
        name: '取締役', 
        domesticDailyAllowance: 7000, 
        domesticAccommodation: 12000, 
        domesticTransportation: 2500,
        overseasDailyAllowance: 12000, 
        overseasAccommodation: 20000, 
        overseasPreparation: 4000,
        overseasTransportation: 4000
      },
      { 
        id: '3', 
        name: '執行役員', 
        domesticDailyAllowance: 6000, 
        domesticAccommodation: 10000, 
        domesticTransportation: 2000,
        overseasDailyAllowance: 10000, 
        overseasAccommodation: 18000, 
        overseasPreparation: 3000,
        overseasTransportation: 3000
      },
      { 
        id: '4', 
        name: '従業員', 
        domesticDailyAllowance: 5000, 
        domesticAccommodation: 8000, 
        domesticTransportation: 2000,
        overseasDailyAllowance: 8000, 
        overseasAccommodation: 15000, 
        overseasPreparation: 2000,
        overseasTransportation: 2000
      }
    ],
    implementationDate: new Date().toISOString().split('T')[0]
  });

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const addPosition = () => {
    const newPosition: Position = {
      id: Date.now().toString(),
      name: '新しい役職',
      domesticDailyAllowance: 0,
      domesticAccommodation: 0,
      domesticTransportation: 0,
      overseasDailyAllowance: 0,
      overseasAccommodation: 0,
      overseasPreparation: 0,
      overseasTransportation: 0
    };
    setData(prev => ({
      ...prev,
      positions: [...prev.positions, newPosition]
    }));
  };

  const updatePosition = (id: string, field: keyof Position, value: any) => {
    setData(prev => ({
      ...prev,
      positions: prev.positions.map(pos => 
        pos.id === id ? { ...pos, [field]: value } : pos
      )
    }));
  };

  const removePosition = (id: string) => {
    if (data.positions.length > 1) {
      setData(prev => ({
        ...prev,
        positions: prev.positions.filter(pos => pos.id !== id)
      }));
    }
  };

  const generateRegulationText = () => {
    const implementationYear = new Date(data.implementationDate).getFullYear();
    const implementationMonth = new Date(data.implementationDate).getMonth() + 1;
    const implementationDay = new Date(data.implementationDate).getDate();

    return `出張旅費規程

（目的）
第１条　この規程は、役員または従業員が社命により、出張する場合の、旅費について定めたものである。

（適用範囲）
第２条　この規程は、役員及び全ての従業員について適用する。

（旅費の種類）
第３条　この規程に基づく旅費とは、出張日当、交通費、宿泊料、支度料の四種とし、その支給基準は第７条規定のとおりとする。ただし、交通費及び宿泊料についてはそれぞれ実費精算とすることができる。

（出張の定義）
第４条　出張とは、従業員が自宅または通常の勤務地を起点として、片道${data.distanceThreshold}ｋｍ以上の目的地に移動し、職務を遂行するものをいう。

（出張の承認）
第５条　従業員が出張を行う場合は、事前に所属長の承認を得なければならない。ただし、緊急の場合は事後承認とすることができる。

（出張の区分）
第６条　出張は、以下のとおり区分する。
　　　　１　国内出張
　　　　　国内出張とは、日本国内の用務先に赴く出張であり、所属長（または代表者）が認めたものとする。当日中に帰着することが可能なものは、日帰り出張として出張日当と交通費日当（実費精算可）、宿泊を伴う出張は、出張日当と交通費日当（実費精算可）、宿泊日当（実費精算可）を第７条に定める旅費を支給する。日帰り出張は1日、1泊2日は2日と日数を計算する。
　　　　２　海外出張
　　　　　海外出張とは、日本国外の地域への宿泊を伴う出張であり、所属長（または代表者）が認めたものとする。出張日当と交通費日当（実費精算可）、宿泊日当（実費精算可）に加えて、支度料を第７条に定める旅費を支給する。

（旅費一覧）
第７条　旅費は、以下のとおり役職に応じて支給する。（円）

【国内出張】
役職名	出張日当	宿泊料	交通費
${data.positions.map(pos => 
`${pos.name}	${pos.domesticDailyAllowance}円	${data.isAccommodationRealExpense ? '実費' : pos.domesticAccommodation + '円'}	${data.isTransportationRealExpense ? '実費' : pos.domesticTransportation + '円'}`
).join('\n')}

【海外出張】
役職名	出張日当	宿泊料	支度料	交通費
${data.positions.map(pos => 
`${pos.name}	${pos.overseasDailyAllowance}円	${data.isAccommodationRealExpense ? '実費' : pos.overseasAccommodation + '円'}	${pos.overseasPreparation}円	${data.isTransportationRealExpense ? '実費' : pos.overseasTransportation + '円'}`
).join('\n')}

（交通機関）
第８条　利用する交通手段は、原則として、鉄道、船舶、飛行機、バスとする。
　　　　２　前項に関わらず、会社が必要と認めた場合は、タクシーまたは社有の自動車を利用できるものとする。

（旅費の支給方法）
第９条　旅費は、原則として出張終了後に精算により支給する。ただし、必要に応じて概算払いを行うことができる。

（規程の改廃）
第１０条　本規程の改廃は、取締役会の決議により行う。

（附則）
第１１条　本規程は、令和${implementationYear - 2018}年${implementationMonth}月${implementationDay}日より実施する。

${data.companyInfo.name}
${data.companyInfo.representative}`;
  };

  const handleSave = async () => {
    if (!user) {
      setError('ユーザー情報が取得できません');
      return;
    }

    // 保存前の最終確認
    const confirmMessage = `以下の内容で出張規程を保存しますか？\n\n会社名: ${data.companyInfo.name}\n代表者: ${data.companyInfo.representative}\n改訂版: ${data.companyInfo.revision}\n実施日: ${data.implementationDate}\n\n保存を続行しますか？`;
    
    if (!confirm(confirmMessage)) {
      return;
    }

    // 入力値の検証
    if (!data.companyInfo.name.trim()) {
      setError('会社名を入力してください');
      return;
    }

    if (!data.companyInfo.representative.trim()) {
      setError('代表者名を入力してください');
      return;
    }

    if (!data.companyInfo.address.trim()) {
      setError('会社住所を入力してください');
      return;
    }

    if (data.positions.length === 0) {
      setError('少なくとも1つの役職を設定してください');
      return;
    }

    // 役職名の検証
    for (const position of data.positions) {
      if (!position.name.trim()) {
        setError('役職名を入力してください');
        return;
      }
    }

    setLoading(true);
    setError('');

    // タイムアウト処理を追加
    const timeoutId = setTimeout(() => {
      console.warn('保存処理がタイムアウトしました');
      setLoading(false);
      setError('保存処理がタイムアウトしました。再度お試しください。');
    }, 30000); // 30秒でタイムアウト

    try {
      // 編集モードかどうかを確認
      const editingId = localStorage.getItem('editingRegulationId');
      
      if (editingId) {
        // 既存の規程を更新
        const { error: updateError } = await supabase
          .from('travel_expense_regulations')
          .update({
            regulation_name: `${data.companyInfo.name} 出張旅費規程`,
            company_name: data.companyInfo.name,
            company_address: data.companyInfo.address,
            representative: data.companyInfo.representative,
            distance_threshold: data.distanceThreshold,
            implementation_date: data.implementationDate,
            revision_number: data.companyInfo.revision,
            is_transportation_real_expense: data.isTransportationRealExpense,
            is_accommodation_real_expense: data.isAccommodationRealExpense,
            regulation_full_text: generateRegulationText(),
            status: 'active',
            updated_at: new Date().toISOString()
          })
          .eq('id', editingId);

        if (updateError) {
          console.error('規程更新エラー:', updateError);
          throw updateError;
        }

        // 既存の役職設定を削除して新しいものを追加
        const { error: deletePositionsError } = await supabase
          .from('regulation_positions')
          .delete()
          .eq('regulation_id', editingId);

        if (deletePositionsError) {
          console.error('役職削除エラー:', deletePositionsError);
          throw deletePositionsError;
        }

        // 新しい役職設定を追加
        const positionsToInsert = data.positions.map(position => ({
          regulation_id: editingId,
          position_name: position.name,
          domestic_daily_allowance: position.domesticDailyAllowance,
          domestic_accommodation_allowance: position.domesticAccommodation,
          domestic_transportation_allowance: position.domesticTransportation,
          overseas_daily_allowance: position.overseasDailyAllowance,
          overseas_accommodation_allowance: position.overseasAccommodation,
          overseas_preparation_allowance: position.overseasPreparation,
          overseas_transportation_allowance: position.overseasTransportation
        }));

        const { error: positionsError } = await supabase
          .from('regulation_positions')
          .insert(positionsToInsert);

        if (positionsError) {
          console.error('役職挿入エラー:', positionsError);
          throw positionsError;
        }

        localStorage.removeItem('editingRegulationId');
        alert('出張規程が正常に更新されました！');
      } else {
        // 重複チェック: 同じ会社名で既存の規程があるかチェック
        const { data: existingRegulations, error: checkError } = await supabase
          .from('travel_expense_regulations')
          .select('id, regulation_name, company_name, revision_number')
          .eq('company_name', data.companyInfo.name.trim())
          .eq('user_id', user.id);

        if (checkError) {
          console.error('重複チェックエラー:', checkError);
          throw checkError;
        }

                 if (existingRegulations && existingRegulations.length > 0) {
           // 既存の規程がある場合、改訂版番号を自動設定
           const maxRevision = Math.max(...existingRegulations.map(r => r.revision_number || 1));
           const newRevision = maxRevision + 1;
           
           // 改訂版番号を自動設定
           setData(prev => ({
             ...prev,
             companyInfo: {
               ...prev.companyInfo,
               revision: newRevision
             }
           }));
           
           // 改訂版番号が自動設定されたことをアナウンス
           setError(`「${data.companyInfo.name}」の出張規程は既に存在します。改訂番号を新しく付与しました（改訂版${newRevision}）。改訂版として保存する場合は、再度保存ボタンをクリックしてください。`);
           setLoading(false);
           return;
         }
        
                 // 新規作成または改訂版作成
         let baseRegulationId = null;
         let parentRegulationId = null;
         
         // 既存の規程がある場合は、基本規程IDと親規程IDを設定
         if (existingRegulations && existingRegulations.length > 0) {
           const baseRegulation = existingRegulations.find(r => r.revision_number === 1) || existingRegulations[0];
           baseRegulationId = baseRegulation.id;
           parentRegulationId = existingRegulations[0].id; // 最新版を親とする
           
           // 既存の最新版を非最新版に更新
           await supabase
             .from('travel_expense_regulations')
             .update({ is_latest_version: false })
             .eq('id', parentRegulationId);
         }
         
         const { data: regulation, error: regulationError } = await supabase
           .from('travel_expense_regulations')
           .insert({
             user_id: user.id,
             regulation_name: `${data.companyInfo.name} 出張旅費規程`,
             regulation_type: 'domestic',
             company_name: data.companyInfo.name,
             company_address: data.companyInfo.address,
             representative: data.companyInfo.representative,
             distance_threshold: data.distanceThreshold,
             implementation_date: data.implementationDate,
             revision_number: data.companyInfo.revision,
             is_transportation_real_expense: data.isTransportationRealExpense,
             is_accommodation_real_expense: data.isAccommodationRealExpense,
             regulation_full_text: generateRegulationText(),
             status: 'active',
             base_regulation_id: baseRegulationId,
             parent_regulation_id: parentRegulationId,
             is_latest_version: true
           })
           .select()
           .single();

        if (regulationError) {
          console.error('規程作成エラー:', regulationError);
          throw regulationError;
        }

                // 役職別設定を保存
        const positionsToInsert = data.positions.map(position => ({
          regulation_id: regulation.id,
          position_name: position.name,
          domestic_daily_allowance: position.domesticDailyAllowance,
          domestic_accommodation_allowance: position.domesticAccommodation,
          domestic_transportation_allowance: position.domesticTransportation,
          overseas_daily_allowance: position.overseasDailyAllowance,
          overseas_accommodation_allowance: position.overseasAccommodation,
          overseas_preparation_allowance: position.overseasPreparation,
          overseas_transportation_allowance: position.overseasTransportation
        }));

        const { error: positionsError } = await supabase
          .from('regulation_positions')
          .insert(positionsToInsert);

        if (positionsError) {
          console.error('役職設定保存エラー:', positionsError);
          throw positionsError;
        }
         
                   // 改訂版履歴を保存
          if (baseRegulationId) {
            const { error: versionError } = await supabase
              .from('regulation_versions')
              .insert({
                base_regulation_id: baseRegulationId,
               version_number: data.companyInfo.revision,
               version_name: `第${data.companyInfo.revision}版`,
               company_name: data.companyInfo.name,
               company_address: data.companyInfo.address,
               representative: data.companyInfo.representative,
               distance_threshold: data.distanceThreshold,
               implementation_date: data.implementationDate,
               is_transportation_real_expense: data.isTransportationRealExpense,
               is_accommodation_real_expense: data.isAccommodationRealExpense,
               regulation_full_text: generateRegulationText(),
               status: 'active',
               change_summary: `改訂版${data.companyInfo.revision}として作成`,
               created_by: user.id
             });
           
                       if (versionError) {
              console.error('改訂版履歴保存エラー:', versionError);
            }
          }

          const successMessage = baseRegulationId 
            ? `出張規程の改訂版${data.companyInfo.revision}が正常に作成されました！`
            : '出張規程が正常に作成されました！';
          
          alert(successMessage);
        }
        
        onNavigate('travel-regulation-management');
      
    } catch (err: any) {
      console.error('出張規程の保存エラー:', err);
      
      // より詳細なエラーメッセージを表示
      let errorMessage = '出張規程の保存に失敗しました';
      
      if (err.code === '23505') {
        errorMessage += ': 重複するデータが存在します。既存の規程を確認してください。';
      } else if (err.code === '23503') {
        errorMessage += ': 関連するデータが見つかりません';
      } else if (err.code === '42P01') {
        errorMessage += ': テーブルが見つかりません';
      } else if (err.code === '42703') {
        errorMessage += ': 列が見つかりません';
      } else if (err.message) {
        errorMessage += ': ' + err.message;
      } else if (err.details) {
        errorMessage += ': ' + err.details;
      } else if (err.error) {
        errorMessage += ': ' + err.error;
      }
      
      setError(errorMessage);
      
      // エラーが発生した場合、編集モードをクリア
      if (localStorage.getItem('editingRegulationId')) {
        localStorage.removeItem('editingRegulationId');
      }
      
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
            }
    };

  // 編集モードの場合、既存データを読み込み
  useEffect(() => {
    const editingId = localStorage.getItem('editingRegulationId');
    if (editingId && user) {
      // 編集IDの形式を確認
      if (editingId && editingId.length > 0) {
        loadExistingRegulation(editingId);
      } else {
        localStorage.removeItem('editingRegulationId');
      }
    }

    // クリーンアップ処理
    return () => {
      // コンポーネントがアンマウントされる際にloading状態をリセット
      setLoading(false);
    };
  }, [user]);

  const loadExistingRegulation = async (regulationId: string) => {
    try {
      // 規程データを取得
      const { data: regulation, error: regulationError } = await supabase
        .from('travel_expense_regulations')
        .select('*')
        .eq('id', regulationId)
        .maybeSingle();

      if (regulationError) {
        console.error('規程データ取得エラー:', regulationError);
        throw regulationError;
      }

      if (!regulation) {
        console.error('規程データが見つかりません:', regulationId);
        setError('指定された規程が見つかりません');
        return;
      }

      // 役職データを取得
      const { data: positions, error: positionsError } = await supabase
        .from('regulation_positions')
        .select('*')
        .eq('regulation_id', regulationId)
        .order('sort_order', { ascending: true });

      if (positionsError) {
        console.error('役職データ取得エラー:', positionsError);
        throw positionsError;
      }

      // フォームデータを設定
      const formData = {
        companyInfo: {
          name: regulation.company_name || '',
          address: regulation.company_address || '',
          representative: regulation.representative || '',
          establishedDate: regulation.implementation_date || new Date().toISOString().split('T')[0],
          revision: regulation.revision_number || 1
        },
        distanceThreshold: regulation.distance_threshold || 50,
        isTransportationRealExpense: regulation.is_transportation_real_expense || false,
        isAccommodationRealExpense: regulation.is_accommodation_real_expense || false,
        positions: (positions || []).map(pos => ({
          id: pos.id,
          name: pos.position_name,
          domesticDailyAllowance: pos.domestic_daily_allowance || 0,
          domesticAccommodation: pos.domestic_accommodation_allowance || 0,
          domesticTransportation: pos.domestic_transportation_allowance || 0,
          overseasDailyAllowance: pos.overseas_daily_allowance || 0,
          overseasAccommodation: pos.overseas_accommodation_allowance || 0,
          overseasPreparation: pos.overseas_preparation_allowance || 0,
          overseasTransportation: pos.overseas_transportation_allowance || 0
        })),
        implementationDate: regulation.implementation_date || new Date().toISOString().split('T')[0]
      };

      setData(formData);
      
      // エラーをクリア
      setError('');
      
    } catch (err: any) {
      console.error('既存規程の読み込みエラー:', err);
      
      // より詳細なエラーメッセージを表示
      let errorMessage = '既存規程の読み込みに失敗しました';
      
      if (err.code === 'PGRST116') {
        errorMessage += ': 指定された規程が見つかりません';
      } else if (err.message) {
        errorMessage += ': ' + err.message;
      } else if (err.details) {
        errorMessage += ': ' + err.details;
      }
      
      setError(errorMessage);
      
      // エラーが発生した場合、編集モードをクリア
      localStorage.removeItem('editingRegulationId');
    }
  };

  const generateDocument = (format: 'word' | 'pdf') => {
    const regulationText = generateRegulationText();
    
    if (format === 'word') {
      // Word文書として保存
      const blob = new Blob([regulationText], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `出張旅費規程_${data.companyInfo.name}_v${data.companyInfo.revision}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else if (format === 'pdf') {
      // PDF生成（簡易版）
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>出張旅費規程</title>
              <style>
                body { font-family: 'MS Gothic', monospace; font-size: 12px; line-height: 1.6; margin: 20px; }
                h1 { text-align: center; font-size: 16px; margin-bottom: 30px; }
                .content { white-space: pre-line; }
              </style>
            </head>
            <body>
              <div class="content">${regulationText}</div>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23334155%22 fill-opacity=%220.03%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-100/20 via-transparent to-indigo-100/20"></div>

      <div className="flex h-screen relative">
        <div className="hidden lg:block">
          <Sidebar isOpen={true} onClose={() => {}} onNavigate={onNavigate} currentView="travel-regulation-creation" />
        </div>

        {isSidebarOpen && (
          <>
            <div 
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={toggleSidebar}
            />
            <div className="fixed left-0 top-0 h-full z-50 lg:hidden">
              <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} onNavigate={onNavigate} currentView="travel-regulation-creation" />
            </div>
          </>
        )}

        <div className="flex-1 flex flex-col min-w-0">
          <TopBar onMenuClick={toggleSidebar} onNavigate={onNavigate} />
          
          <div className="flex-1 overflow-auto p-4 lg:p-6 relative z-10">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">出張規程作成</h1>
                <div className="flex space-x-3">
                  <button
                    onClick={() => generateDocument('word')}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-900 transition-all duration-200"
                  >
                    <FileText className="w-4 h-4" />
                    <span>テキスト出力</span>
                  </button>
                  <button
                    onClick={() => generateDocument('pdf')}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-800 text-white rounded-lg font-medium hover:from-red-700 hover:to-red-900 transition-all duration-200"
                  >
                    <Download className="w-4 h-4" />
                    <span>PDF印刷</span>
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                {/* 会社情報 */}
                <div className="backdrop-blur-xl bg-white/20 rounded-xl p-6 border border-white/30 shadow-xl">
                  <h2 className="text-xl font-semibold text-slate-800 mb-4">会社情報</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                         <div>
                       <label className="block text-sm font-medium text-slate-700 mb-2">会社名</label>
                       <input
                         type="text"
                         value={data.companyInfo.name}
                         onChange={(e) => {
                           const newCompanyName = e.target.value;
                           setData(prev => {
                             // 会社名が変更された場合、改訂版番号を1にリセット
                             const shouldResetRevision = prev.companyInfo.name !== newCompanyName;
                             return {
                               ...prev,
                               companyInfo: {
                                 ...prev.companyInfo,
                                 name: newCompanyName,
                                 revision: shouldResetRevision ? 1 : prev.companyInfo.revision
                               }
                             };
                           });
                         }}
                         className="w-full px-3 py-2 bg-white/50 border border-white/40 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-navy-400 backdrop-blur-xl"
                       />
                       {data.companyInfo.revision === 1 && (
                         <p className="text-xs text-blue-600 mt-1">改訂版番号が1にリセットされました</p>
                       )}
                     </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">代表者</label>
                      <input
                        type="text"
                        value={data.companyInfo.representative}
                        onChange={(e) => setData(prev => ({ 
                          ...prev, 
                          companyInfo: { ...prev.companyInfo, representative: e.target.value }
                        }))}
                        className="w-full px-3 py-2 bg-white/50 border border-white/40 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-navy-400 backdrop-blur-xl"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-2">住所</label>
                      <input
                        type="text"
                        value={data.companyInfo.address}
                        onChange={(e) => setData(prev => ({ 
                          ...prev, 
                          companyInfo: { ...prev.companyInfo, address: e.target.value }
                        }))}
                        className="w-full px-3 py-2 bg-white/50 border border-white/40 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-navy-400 backdrop-blur-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">実施日</label>
                      <input
                        type="date"
                        value={data.implementationDate}
                        onChange={(e) => setData(prev => ({ ...prev, implementationDate: e.target.value }))}
                        className="w-full px-3 py-2 bg-white/50 border border-white/40 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-navy-400 backdrop-blur-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">改訂版</label>
                      <input
                        type="number"
                        value={data.companyInfo.revision}
                        onChange={(e) => setData(prev => ({ 
                          ...prev, 
                          companyInfo: { ...prev.companyInfo, revision: parseInt(e.target.value) || 1 }
                        }))}
                        className="w-full px-3 py-2 bg-white/50 border border-white/40 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-navy-400 backdrop-blur-xl"
                      />
                    </div>
                  </div>
                </div>

                {/* 出張の定義設定 */}
                <div className="backdrop-blur-xl bg-white/20 rounded-xl p-6 border border-white/30 shadow-xl">
                  <h2 className="text-xl font-semibold text-slate-800 mb-4">第４条（出張の定義）設定</h2>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-700 mb-2">出張の距離基準（km）</label>
                    <div className="flex items-center space-x-4">
                      <input
                        type="number"
                        value={data.distanceThreshold}
                        onChange={(e) => {
                          const value = parseInt(e.target.value) || 0;
                          setData(prev => ({ ...prev, distanceThreshold: value }));
                        }}
                        className="w-32 px-3 py-2 bg-white/50 border border-white/40 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-navy-400 backdrop-blur-xl"
                      />
                      <span className="text-slate-700">km以上</span>
                    </div>
                  </div>
                </div>

                {/* 実費精算設定 */}
                <div className="backdrop-blur-xl bg-white/20 rounded-xl p-6 border border-white/30 shadow-xl">
                  <h2 className="text-xl font-semibold text-slate-800 mb-4">実費精算設定</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={data.isTransportationRealExpense}
                        onChange={(e) => setData(prev => ({ ...prev, isTransportationRealExpense: e.target.checked }))}
                        className="w-5 h-5 text-navy-600 bg-white/50 border-white/40 rounded focus:ring-navy-400 focus:ring-2"
                      />
                      <span className="text-slate-700 font-medium">交通費を実費精算とする</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={data.isAccommodationRealExpense}
                        onChange={(e) => setData(prev => ({ ...prev, isAccommodationRealExpense: e.target.checked }))}
                        className="w-5 h-5 text-navy-600 bg-white/50 border-white/40 rounded focus:ring-navy-400 focus:ring-2"
                      />
                      <span className="text-slate-700 font-medium">宿泊料を実費精算とする</span>
                    </label>
                  </div>
                </div>

                {/* 第７条 旅費一覧設定 */}
                <div className="backdrop-blur-xl bg-white/20 rounded-xl p-6 border border-white/30 shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-slate-800">第７条（旅費一覧）設定</h2>
                    <button
                      type="button"
                      onClick={addPosition}
                      className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-navy-600 to-navy-800 text-white rounded-lg font-medium hover:from-navy-700 hover:to-navy-900 transition-all duration-200"
                    >
                      <Plus className="w-4 h-4" />
                      <span>役職追加</span>
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/30">
                          <th className="text-left py-3 px-2 font-medium text-slate-700">役職</th>
                          <th className="text-center py-3 px-2 font-medium text-slate-700 bg-blue-50/30">国内出張日当</th>
                          <th className="text-center py-3 px-2 font-medium text-slate-700 bg-blue-50/30">国内宿泊料</th>
                          <th className="text-center py-3 px-2 font-medium text-slate-700 bg-blue-50/30">国内交通費</th>
                          <th className="text-center py-3 px-2 font-medium text-slate-700 bg-green-50/30">海外出張日当</th>
                          <th className="text-center py-3 px-2 font-medium text-slate-700 bg-green-50/30">海外宿泊料</th>
                          <th className="text-center py-3 px-2 font-medium text-slate-700 bg-green-50/30">海外支度料</th>
                          <th className="text-center py-3 px-2 font-medium text-slate-700 bg-green-50/30">海外交通費</th>
                          <th className="text-center py-3 px-2 font-medium text-slate-700">操作</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.positions.map((position) => (
                          <tr key={position.id} className="border-b border-white/20">
                            <td className="py-3 px-2">
                              <input
                                type="text"
                                value={position.name}
                                onChange={(e) => updatePosition(position.id, 'name', e.target.value)}
                                className="w-full px-2 py-1 bg-white/50 border border-white/40 rounded text-slate-700 focus:outline-none focus:ring-1 focus:ring-navy-400 text-sm"
                              />
                            </td>
                            <td className="py-3 px-2 bg-blue-50/20">
                              <input
                                type="number"
                                value={position.domesticDailyAllowance}
                                onChange={(e) => updatePosition(position.id, 'domesticDailyAllowance', parseInt(e.target.value) || 0)}
                                className="w-full px-2 py-1 bg-white/50 border border-white/40 rounded text-slate-700 focus:outline-none focus:ring-1 focus:ring-navy-400 text-sm text-center"
                              />
                            </td>
                            <td className="py-3 px-2 bg-blue-50/20">
                              <input
                                type="number"
                                value={position.domesticAccommodation}
                                onChange={(e) => updatePosition(position.id, 'domesticAccommodation', parseInt(e.target.value) || 0)}
                                disabled={data.isAccommodationRealExpense}
                                className={`w-full px-2 py-1 border rounded text-sm text-center ${
                                  data.isAccommodationRealExpense 
                                    ? 'bg-slate-200 border-slate-300 text-slate-400 cursor-not-allowed' 
                                    : 'bg-white/50 border-white/40 text-slate-700 focus:outline-none focus:ring-1 focus:ring-navy-400'
                                }`}
                                placeholder={data.isAccommodationRealExpense ? '実費' : '0'}
                              />
                            </td>
                            <td className="py-3 px-2 bg-blue-50/20">
                              <input
                                type="number"
                                value={position.domesticTransportation}
                                onChange={(e) => updatePosition(position.id, 'domesticTransportation', parseInt(e.target.value) || 0)}
                                disabled={data.isTransportationRealExpense}
                                className={`w-full px-2 py-1 border rounded text-sm text-center ${
                                  data.isTransportationRealExpense 
                                    ? 'bg-slate-200 border-slate-300 text-slate-400 cursor-not-allowed' 
                                    : 'bg-white/50 border-white/40 text-slate-700 focus:outline-none focus:ring-1 focus:ring-navy-400'
                                }`}
                                placeholder={data.isTransportationRealExpense ? '実費' : '0'}
                              />
                            </td>
                            <td className="py-3 px-2 bg-green-50/20">
                              <input
                                type="number"
                                value={position.overseasDailyAllowance}
                                onChange={(e) => updatePosition(position.id, 'overseasDailyAllowance', parseInt(e.target.value) || 0)}
                                className="w-full px-2 py-1 bg-white/50 border border-white/40 rounded text-slate-700 focus:outline-none focus:ring-1 focus:ring-navy-400 text-sm text-center"
                              />
                            </td>
                            <td className="py-3 px-2 bg-green-50/20">
                              <input
                                type="number"
                                value={position.overseasAccommodation}
                                onChange={(e) => updatePosition(position.id, 'overseasAccommodation', parseInt(e.target.value) || 0)}
                                disabled={data.isAccommodationRealExpense}
                                className={`w-full px-2 py-1 border rounded text-sm text-center ${
                                  data.isAccommodationRealExpense 
                                    ? 'bg-slate-200 border-slate-300 text-slate-400 cursor-not-allowed' 
                                    : 'bg-white/50 border-white/40 text-slate-700 focus:outline-none focus:ring-1 focus:ring-navy-400'
                                }`}
                                placeholder={data.isAccommodationRealExpense ? '実費' : '0'}
                              />
                            </td>
                            <td className="py-3 px-2 bg-green-50/20">
                              <input
                                type="number"
                                value={position.overseasPreparation}
                                onChange={(e) => updatePosition(position.id, 'overseasPreparation', parseInt(e.target.value) || 0)}
                                className="w-full px-2 py-1 bg-white/50 border border-white/40 rounded text-slate-700 focus:outline-none focus:ring-1 focus:ring-navy-400 text-sm text-center"
                              />
                            </td>
                            <td className="py-3 px-2 bg-green-50/20">
                              <input
                                type="number"
                                value={position.overseasTransportation}
                                onChange={(e) => updatePosition(position.id, 'overseasTransportation', parseInt(e.target.value) || 0)}
                                disabled={data.isTransportationRealExpense}
                                className={`w-full px-2 py-1 border rounded text-sm text-center ${
                                  data.isTransportationRealExpense 
                                    ? 'bg-slate-200 border-slate-300 text-slate-400 cursor-not-allowed' 
                                    : 'bg-white/50 border-white/40 text-slate-700 focus:outline-none focus:ring-1 focus:ring-navy-400'
                                }`}
                                placeholder={data.isTransportationRealExpense ? '実費' : '0'}
                              />
                            </td>
                            <td className="py-3 px-2 text-center">
                              {data.positions.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removePosition(position.id)}
                                  className="p-1 text-red-500 hover:text-red-700 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                                 {/* プレビュー */}
                 <div className="backdrop-blur-xl bg-white/20 rounded-xl p-6 border border-white/30 shadow-xl">
                   <h2 className="text-xl font-semibold text-slate-800 mb-4">規程プレビュー</h2>
                   <div className="bg-white/50 rounded-lg p-6 max-h-96 overflow-y-auto">
                     <pre className="text-sm text-slate-800 whitespace-pre-line font-mono leading-relaxed">
                       {generateRegulationText()}
                     </pre>
                     
                     {/* 第7条の表形式表示 */}
                     <div className="mt-6 border-t border-gray-300 pt-6">
                       <h3 className="text-lg font-semibold text-slate-800 mb-4">第７条 旅費一覧（表形式）</h3>
                       <div className="overflow-x-auto">
                         <table className="w-full border-collapse border border-gray-300 text-sm">
                           <thead>
                             <tr className="bg-gray-100">
                               <th className="border border-gray-300 px-3 py-2 text-left font-medium">役職</th>
                               <th className="border border-gray-300 px-3 py-2 text-center font-medium" colSpan={3}>国内出張</th>
                               <th className="border border-gray-300 px-3 py-2 text-center font-medium" colSpan={4}>海外出張</th>
                             </tr>
                             <tr className="bg-gray-50">
                               <th className="border border-gray-300 px-3 py-2 text-left font-medium">役職名</th>
                               <th className="border border-gray-300 px-3 py-2 text-center font-medium">出張日当</th>
                               <th className="border border-gray-300 px-3 py-2 text-center font-medium">宿泊料</th>
                               <th className="border border-gray-300 px-3 py-2 text-center font-medium">交通費</th>
                               <th className="border border-gray-300 px-3 py-2 text-center font-medium">出張日当</th>
                               <th className="border border-gray-300 px-3 py-2 text-center font-medium">宿泊料</th>
                               <th className="border border-gray-300 px-3 py-2 text-center font-medium">支度料</th>
                               <th className="border border-gray-300 px-3 py-2 text-center font-medium">交通費</th>
                             </tr>
                           </thead>
                           <tbody>
                             {data.positions.map((position, index) => (
                               <tr key={position.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                 <td className="border border-gray-300 px-3 py-2 font-medium">{position.name}</td>
                                 <td className="border border-gray-300 px-3 py-2 text-center">¥{position.domesticDailyAllowance.toLocaleString()}</td>
                                 <td className="border border-gray-300 px-3 py-2 text-center">
                                   {data.isAccommodationRealExpense ? '実費' : `¥${position.domesticAccommodation.toLocaleString()}`}
                                 </td>
                                 <td className="border border-gray-300 px-3 py-2 text-center">
                                   {data.isTransportationRealExpense ? '実費' : `¥${position.domesticTransportation.toLocaleString()}`}
                                 </td>
                                 <td className="border border-gray-300 px-3 py-2 text-center">¥{position.overseasDailyAllowance.toLocaleString()}</td>
                                 <td className="border border-gray-300 px-3 py-2 text-center">
                                   {data.isAccommodationRealExpense ? '実費' : `¥${position.overseasAccommodation.toLocaleString()}`}
                                 </td>
                                 <td className="border border-gray-300 px-3 py-2 text-center">¥{position.overseasPreparation.toLocaleString()}</td>
                                 <td className="border border-gray-300 px-3 py-2 text-center">
                                   {data.isTransportationRealExpense ? '実費' : `¥${position.overseasTransportation.toLocaleString()}`}
                                 </td>
                               </tr>
                             ))}
                           </tbody>
                         </table>
                       </div>
                     </div>
                   </div>
                 </div>

                                                  {/* エラー表示 */}
                  {error && (
                    <div className="bg-red-50/50 border border-red-200/50 rounded-lg p-4 mb-6">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-red-800">エラーが発生しました</h3>
                          <p className="text-sm text-red-700 mt-1">{error}</p>
                          
                          {/* 重複エラーの場合の解決策を表示 */}
                          {error.includes('重複するデータが存在します') && (
                            <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                              <h4 className="text-sm font-medium text-blue-800 mb-2">解決方法：</h4>
                              <ul className="text-sm text-blue-700 space-y-1">
                                <li>• 既存の規程を編集する場合は、出張規定管理画面から該当規程を選択</li>
                                <li>• 新しい改訂版として作成する場合は、改訂版番号を変更</li>
                                <li>• 会社名を変更して新規作成</li>
                              </ul>
                            </div>
                          )}
                          
                          <div className="mt-3 flex space-x-2">
                            <button
                              onClick={() => {
                                setError('');
                                localStorage.removeItem('editingRegulationId');
                              }}
                              className="text-sm text-red-600 hover:text-red-500 underline"
                            >
                              エラーをクリアして新規作成に戻る
                            </button>
                            
                            {error.includes('重複するデータが存在します') && (
                              <button
                                onClick={() => onNavigate('travel-regulation-management')}
                                className="text-sm text-blue-600 hover:text-blue-500 underline"
                              >
                                既存規程を確認する
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                                 <div className="flex justify-end space-x-4">
                   <button
                     onClick={() => onNavigate('travel-regulation-management')}
                     disabled={loading}
                     className="px-6 py-3 bg-white/50 hover:bg-white/70 text-slate-700 rounded-lg font-medium transition-colors backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
                   >
                     キャンセル
                   </button>
                   
                   {/* エラーが発生した場合のリセットボタン */}
                   {error && (
                     <button
                       onClick={() => {
                         setError('');
                         setLoading(false);
                         if (localStorage.getItem('editingRegulationId')) {
                           localStorage.removeItem('editingRegulationId');
                         }
                       }}
                       className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium transition-colors"
                     >
                       エラーをリセット
                     </button>
                   )}
                   
                   <button
                     onClick={handleSave}
                     disabled={loading}
                     className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-navy-700 to-navy-900 hover:from-navy-800 hover:to-navy-950 text-white rounded-lg font-medium shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                   >
                     <Save className="w-5 h-5" />
                     <span>{loading ? '保存中...' : '規程を保存'}</span>
                   </button>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TravelRegulationCreation;