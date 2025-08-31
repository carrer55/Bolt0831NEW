import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';
import type { Tables } from '../types/supabase';

export interface AuthUser {
  id: string;
  email: string;
  full_name: string | null;
  company: string | null;
  position: string | null;
  phone: string | null;
  role: 'user' | 'admin' | 'manager';
  department: string | null;
  avatar_url: string | null;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  session: Session | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    session: null
  });

  // ユーザープロフィールを取得
  const fetchUserProfile = useCallback(async (userId: string): Promise<AuthUser | null> => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Profile fetch error:', error);
        return null;
      }

      return {
        id: profile.id,
        email: profile.email,
        full_name: profile.full_name,
        company: profile.company,
        position: profile.position,
        phone: profile.phone,
        role: profile.role,
        department: profile.department,
        avatar_url: profile.avatar_url
      };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }, []);

  // セッションからユーザー情報を設定
  const setUserFromSession = useCallback(async (session: Session | null) => {
    if (!session?.user) {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        session: null
      });
      return;
    }

    const userProfile = await fetchUserProfile(session.user.id);
    
    setAuthState({
      user: userProfile,
      isAuthenticated: true,
      isLoading: false,
      session
    });
  }, [fetchUserProfile]);

  // 認証状態を初期化
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // 現在のセッションを取得
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session fetch error:', error);
        }

        if (mounted) {
          await setUserFromSession(session);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setAuthState(prev => ({ ...prev, isLoading: false }));
        }
      }
    };

    initializeAuth();

    // 認証状態の変更を監視
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event);
      
      if (mounted) {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          await setUserFromSession(session);
        } else if (event === 'SIGNED_OUT') {
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            session: null
          });
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [setUserFromSession]);

  // ログイン
  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return { success: false, error: error.message };
      }

      // セッション設定は onAuthStateChange で処理される
      return { success: true };
    } catch (error: any) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { success: false, error: error.message || 'ログインに失敗しました' };
    }
  }, []);

  // 新規登録
  const register = useCallback(async (userData: {
    email: string;
    password: string;
    name: string;
    company: string;
    position: string;
    phone: string;
    department: string;
  }): Promise<{ success: boolean; error?: string }> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));

      // Supabase Authでユーザーを作成
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            full_name: userData.name,
            company: userData.company,
            position: userData.position,
            phone: userData.phone,
            department: userData.department
          }
        }
      });

      if (error) {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return { success: false, error: error.message };
      }

      if (data.user) {
        // プロフィールテーブルにユーザー情報を保存
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email: userData.email,
            full_name: userData.name,
            company: userData.company,
            position: userData.position,
            phone: userData.phone,
            department: userData.department,
            role: 'user'
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
        }

        // 自動ログイン処理は onAuthStateChange で処理される
        return { success: true };
      }

      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { success: false, error: '登録に失敗しました' };
    } catch (error: any) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { success: false, error: error.message || '登録に失敗しました' };
    }
  }, []);

  // ログアウト
  const logout = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        return { success: false, error: error.message };
      }

      // 状態クリアは onAuthStateChange で処理される
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'ログアウトに失敗しました' };
    }
  }, []);

  // プロフィール更新
  const updateProfile = useCallback(async (updates: Partial<AuthUser>): Promise<{ success: boolean; data?: AuthUser; error?: string }> => {
    try {
      const currentUser = authState.user;
      if (!currentUser) {
        return { success: false, error: 'ユーザーが見つかりません' };
      }

      const { data, error } = await supabase
        .from('profiles')
        .update({
          full_name: updates.full_name ?? currentUser.full_name,
          company: updates.company ?? currentUser.company,
          position: updates.position ?? currentUser.position,
          phone: updates.phone ?? currentUser.phone,
          role: updates.role ?? currentUser.role,
          department: updates.department ?? currentUser.department,
          avatar_url: updates.avatar_url ?? currentUser.avatar_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', currentUser.id)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      // ローカル状態を更新
      const updatedUser: AuthUser = {
        id: data.id,
        email: data.email,
        full_name: data.full_name,
        company: data.company,
        position: data.position,
        phone: data.phone,
        role: data.role,
        department: data.department,
        avatar_url: data.avatar_url
      };

      setAuthState(prev => ({
        ...prev,
        user: updatedUser
      }));

      return { success: true, data: updatedUser };
    } catch (error: any) {
      return { success: false, error: error.message || 'プロフィール更新に失敗しました' };
    }
  }, [authState.user]);

  // パスワードリセット
  const resetPassword = useCallback(async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'パスワードリセットに失敗しました' };
    }
  }, []);

  // セッション更新
  const refreshSession = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        return { success: false, error: error.message };
      }

      if (data.session) {
        await setUserFromSession(data.session);
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'セッション更新に失敗しました' };
    }
  }, [setUserFromSession]);

  return {
    ...authState,
    login,
    register,
    logout,
    updateProfile,
    resetPassword,
    refreshSession
  };
}