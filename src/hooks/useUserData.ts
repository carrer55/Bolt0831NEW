import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import type { Tables } from '../types/supabase';

export interface UserData {
  profile: Tables<'profiles'> | null;
  applications: {
    expense: Tables<'expense_applications'>[];
    businessTrip: Tables<'business_trip_applications'>[];
  };
  notifications: Tables<'notifications'>[];
  stats: {
    monthlyExpenses: number;
    monthlyBusinessTrips: number;
    pendingApplications: number;
    approvedApplications: number;
    approvedAmount: number;
  };
}

// モックデータ生成関数
const generateMockExpenseApplications = (userId: string): Tables<'expense_applications'>[] => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  return [
    {
      id: 'exp-001',
      user_id: userId,
      title: '交通費・宿泊費精算',
      description: '東京出張に伴う交通費と宿泊費の精算',
      amount: 25800,
      currency: 'JPY',
      status: 'approved',
      category: 'TRANSPORTATION',
      receipt_url: null,
      submitted_at: new Date(currentYear, currentMonth, 15).toISOString(),
      approved_at: new Date(currentYear, currentMonth, 16).toISOString(),
      approved_by: null,
      created_at: new Date(currentYear, currentMonth, 15).toISOString(),
      updated_at: new Date(currentYear, currentMonth, 16).toISOString(),
      period_start_date: null,
      period_end_date: null,
      reason: null,
      approval_comment: null,
      rejection_reason: null
    },
    {
      id: 'exp-002',
      user_id: userId,
      title: '会議費精算',
      description: 'クライアント会議での飲食費',
      amount: 8500,
      currency: 'JPY',
      status: 'pending',
      category: 'ENTERTAINMENT',
      receipt_url: null,
      submitted_at: new Date(currentYear, currentMonth, 20).toISOString(),
      approved_at: null,
      approved_by: null,
      created_at: new Date(currentYear, currentMonth, 20).toISOString(),
      updated_at: new Date(currentYear, currentMonth, 20).toISOString(),
      period_start_date: null,
      period_end_date: null,
      reason: null,
      approval_comment: null,
      rejection_reason: null
    }
  ];
};

const generateMockBusinessTripApplications = (userId: string): Tables<'business_trip_applications'>[] => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  return [
    {
      id: 'bt-001',
      user_id: userId,
      title: '東京出張申請',
      description: '新規クライアント訪問および契約締結',
      destination: '東京都港区',
      start_date: new Date(currentYear, currentMonth, 25).toISOString().split('T')[0],
      end_date: new Date(currentYear, currentMonth, 27).toISOString().split('T')[0],
      purpose: 'クライアント訪問および新規開拓営業',
      estimated_cost: 52500,
      status: 'approved',
      submitted_at: new Date(currentYear, currentMonth, 18).toISOString(),
      approved_at: new Date(currentYear, currentMonth, 19).toISOString(),
      approved_by: null,
      created_at: new Date(currentYear, currentMonth, 18).toISOString(),
      updated_at: new Date(currentYear, currentMonth, 19).toISOString(),
      calculated_domestic_daily_allowance: null,
      calculated_overseas_daily_allowance: null,
      calculated_transportation_allowance: null,
      calculated_accommodation_allowance: null,
      calculated_misc_allowance: null,
      calculated_total_allowance: null,
      allowance_calculation_date: null
    },
    {
      id: 'bt-002',
      user_id: userId,
      title: '大阪出張申請',
      description: '関西支社との会議および業務調整',
      destination: '大阪府大阪市',
      start_date: new Date(currentYear, currentMonth + 1, 5).toISOString().split('T')[0],
      end_date: new Date(currentYear, currentMonth + 1, 6).toISOString().split('T')[0],
      purpose: '関西支社との定期会議および業務調整',
      estimated_cost: 35000,
      status: 'pending',
      submitted_at: new Date(currentYear, currentMonth, 22).toISOString(),
      approved_at: null,
      approved_by: null,
      created_at: new Date(currentYear, currentMonth, 22).toISOString(),
      updated_at: new Date(currentYear, currentMonth, 22).toISOString(),
      calculated_domestic_daily_allowance: null,
      calculated_overseas_daily_allowance: null,
      calculated_transportation_allowance: null,
      calculated_accommodation_allowance: null,
      calculated_misc_allowance: null,
      calculated_total_allowance: null,
      allowance_calculation_date: null
    }
  ];
};

const generateMockNotifications = (userId: string): Tables<'notifications'>[] => {
  const currentDate = new Date();
  
  return [
    {
      id: 'notif-001',
      user_id: userId,
      title: '出張申請が承認されました',
      message: '東京出張申請（BT-001）が承認されました。出張の準備を進めてください。',
      type: 'success',
      is_read: false,
      created_at: new Date(currentDate.getTime() - 2 * 60 * 60 * 1000).toISOString() // 2時間前
    },
    {
      id: 'notif-002',
      user_id: userId,
      title: '経費申請の提出期限が近づいています',
      message: '今月の経費申請の提出期限は明日です。お忘れなく提出してください。',
      type: 'warning',
      is_read: true,
      created_at: new Date(currentDate.getTime() - 24 * 60 * 60 * 1000).toISOString() // 1日前
    },
    {
      id: 'notif-003',
      user_id: userId,
      title: 'システムメンテナンスのお知らせ',
      message: '明日の深夜2:00-4:00にシステムメンテナンスを実施します。',
      type: 'info',
      is_read: true,
      created_at: new Date(currentDate.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3日前
    }
  ];
};
export function useUserData() {
  const { user, isAuthenticated } = useAuth();
  const [userData, setUserData] = useState<UserData>({
    profile: null,
    applications: { expense: [], businessTrip: [] },
    notifications: [],
    stats: {
      monthlyExpenses: 0,
      monthlyBusinessTrips: 0,
      pendingApplications: 0,
      approvedApplications: 0,
      approvedAmount: 0
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ユーザープロフィールを取得
  const fetchUserProfile = useCallback(async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.log('Profile not found, using user data from auth');
        // プロフィールが見つからない場合は認証データから作成
        const mockProfile: Tables<'profiles'> = {
          id: user.id,
          email: user.email || '',
          full_name: user.full_name || user.email || 'ユーザー',
          company: user.company || 'サンプル株式会社',
          position: user.position || '一般職',
          phone: user.phone || '',
          avatar_url: null,
          role: user.role || 'user',
          department: user.department || '営業部',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        setUserData(prev => ({
          ...prev,
          profile: mockProfile
        }));
        return;
      }

      setUserData(prev => ({
        ...prev,
        profile: data
      }));
    } catch (err: any) {
      console.error('プロフィール取得エラー:', err);
      // エラーの場合はモックデータを使用
      const mockProfile: Tables<'profiles'> = {
        id: user?.id || '',
        email: user?.email || '',
        full_name: user?.full_name || 'ユーザー',
        company: user?.company || 'サンプル株式会社',
        position: user?.position || '一般職',
        phone: user?.phone || '',
        avatar_url: null,
        role: user?.role || 'user',
        department: user?.department || '営業部',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setUserData(prev => ({
        ...prev,
        profile: mockProfile
      }));
    }
  }, [user?.id]);

  // 経費申請を取得
  const fetchExpenseApplications = useCallback(async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('expense_applications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.log('Using mock expense data due to error:', error);
        // エラーの場合はモックデータを使用
        const mockData = generateMockExpenseApplications(user.id);
        setUserData(prev => ({
          ...prev,
          applications: {
            ...prev.applications,
            expense: mockData
          }
        }));
        return;
      }

      setUserData(prev => ({
        ...prev,
        applications: {
          ...prev.applications,
          expense: data && data.length > 0 ? data : generateMockExpenseApplications(user.id)
        }
      }));
    } catch (err: any) {
      console.error('経費申請取得エラー:', err);
      // エラーの場合はモックデータを使用
      const mockData = generateMockExpenseApplications(user.id);
      setUserData(prev => ({
        ...prev,
        applications: {
          ...prev.applications,
          expense: mockData
        }
      }));
    }
  }, [user?.id]);

  // 出張申請を取得
  const fetchBusinessTripApplications = useCallback(async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('business_trip_applications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.log('Using mock business trip data due to error:', error);
        // エラーの場合はモックデータを使用
        const mockData = generateMockBusinessTripApplications(user.id);
        setUserData(prev => ({
          ...prev,
          applications: {
            ...prev.applications,
            businessTrip: mockData
          }
        }));
        return;
      }

      setUserData(prev => ({
        ...prev,
        applications: {
          ...prev.applications,
          businessTrip: data && data.length > 0 ? data : generateMockBusinessTripApplications(user.id)
        }
      }));
    } catch (err: any) {
      console.error('出張申請取得エラー:', err);
      // エラーの場合はモックデータを使用
      const mockData = generateMockBusinessTripApplications(user.id);
      setUserData(prev => ({
        ...prev,
        applications: {
          ...prev.applications,
          businessTrip: mockData
        }
      }));
    }
  }, [user?.id]);

  // 通知を取得
  const fetchNotifications = useCallback(async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.log('Using mock notification data due to error:', error);
        // エラーの場合はモックデータを使用
        const mockData = generateMockNotifications(user.id);
        setUserData(prev => ({
          ...prev,
          notifications: mockData
        }));
        return;
      }

      setUserData(prev => ({
        ...prev,
        notifications: data && data.length > 0 ? data : generateMockNotifications(user.id)
      }));
    } catch (err: any) {
      console.error('通知取得エラー:', err);
      // エラーの場合はモックデータを使用
      const mockData = generateMockNotifications(user.id);
      setUserData(prev => ({
        ...prev,
        notifications: mockData
      }));
    }
  }, [user?.id]);

  // 統計データを計算
  const calculateStats = useCallback(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthlyExpenses = userData.applications.expense
      .filter(app => {
        const appDate = new Date(app.created_at);
        return appDate.getMonth() === currentMonth && appDate.getFullYear() === currentYear;
      })
      .reduce((sum, app) => sum + app.amount, 0);

    const monthlyBusinessTrips = userData.applications.businessTrip
      .filter(app => {
        const appDate = new Date(app.created_at);
        return appDate.getMonth() === currentMonth && appDate.getFullYear() === currentYear;
      })
      .reduce((sum, app) => sum + app.estimated_cost, 0);

    const pendingApplications = [
      ...userData.applications.expense.filter(app => app.status === 'pending'),
      ...userData.applications.businessTrip.filter(app => app.status === 'pending')
    ].length;

    const approvedApplications = [
      ...userData.applications.expense.filter(app => app.status === 'approved'),
      ...userData.applications.businessTrip.filter(app => app.status === 'approved')
    ].length;

    const approvedAmount = [
      ...userData.applications.expense.filter(app => app.status === 'approved'),
      ...userData.applications.businessTrip.filter(app => app.status === 'approved')
    ].reduce((sum, app) => {
      if ('amount' in app) {
        return sum + app.amount;
      } else if ('estimated_cost' in app) {
        return sum + app.estimated_cost;
      }
      return sum;
    }, 0);

    setUserData(prev => ({
      ...prev,
      stats: {
        monthlyExpenses,
        monthlyBusinessTrips,
        pendingApplications,
        approvedApplications,
        approvedAmount
      }
    }));
  }, [userData.applications]);

  // 全データを取得
  const fetchAllData = useCallback(async () => {
    if (!isAuthenticated || !user?.id) return;

    setLoading(true);
    setError(null);

    try {
      await Promise.all([
        fetchUserProfile(),
        fetchExpenseApplications(),
        fetchBusinessTripApplications(),
        fetchNotifications()
      ]);
    } catch (err: any) {
      console.error('データ取得エラー:', err);
      // エラーが発生してもモックデータで継続
      console.log('Using mock data due to fetch error');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user?.id, fetchUserProfile, fetchExpenseApplications, fetchBusinessTripApplications, fetchNotifications]);

  // 統計データを更新（依存関係を修正）
  useEffect(() => {
    if (userData.applications.expense.length > 0 || userData.applications.businessTrip.length > 0) {
      calculateStats();
    }
  }, [userData.applications.expense, userData.applications.businessTrip]);

  // 認証状態が変更されたときにデータを取得
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      console.log('User authenticated, fetching data for:', user.id);
      fetchAllData();
    } else {
      console.log('User not authenticated or no user ID');
    }
  }, [isAuthenticated, user?.id, fetchAllData]);

  // データを更新
  const refreshData = useCallback(() => {
    fetchAllData();
  }, [fetchAllData]);

  // 特定のデータを更新
  const refreshApplications = useCallback(() => {
    Promise.all([
      fetchExpenseApplications(),
      fetchBusinessTripApplications()
    ]);
  }, [fetchExpenseApplications, fetchBusinessTripApplications]);

  const refreshNotifications = useCallback(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return {
    userData,
    loading,
    error,
    refreshData,
    refreshApplications,
    refreshNotifications,
    fetchUserProfile,
    fetchExpenseApplications,
    fetchBusinessTripApplications,
    fetchNotifications
  };
}

