import { useState, useEffect } from 'react';
import { UserProfile, BonusTransaction } from '../types';
import { supabase } from '../lib/supabase';

// Helper to determine tier level based on total spent
export const calculateLevel = (spent: number): 'Новичок' | 'Постоянный' | 'VIP' => {
  if (spent >= 5000) return 'VIP';
  if (spent >= 1000) return 'Постоянный';
  return 'Новичок';
};

export const useBonus = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Sync user state on mount
  useEffect(() => {
    const syncUser = async () => {
      setLoading(true);
      // Supabase Auth session check
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
        if (data && !error) {
          setUser(data);
        } else {
          // Profile does not exist, create it (e.g. Google OAuth sign-in)
          const metadata = session.user.user_metadata;
          const newProfile: UserProfile = {
            id: session.user.id,
            phone: session.user.phone || null,
            email: session.user.email || null,
            name: metadata?.full_name || metadata?.name || 'Гость Google',
            birthday: null,
            bonus_balance: 0,
            total_spent: 0,
            level: 'Новичок',
            created_at: new Date().toISOString()
          };
          const { data: inserted, error: insertErr } = await supabase
            .from('users')
            .upsert(newProfile)
            .select()
            .single();
          if (!insertErr && inserted) {
            setUser(inserted);
          }
        }
      }
      setLoading(false);
    };
    syncUser();
  }, []);

  const sendOTP = async (phone: string, name?: string, birthday?: string) => {
    const { error } = await supabase.auth.signInWithOtp({ phone });
    if (error) throw error;
    // Store registration fields for trigger after OTP verification
    if (name || birthday) {
      localStorage.setItem('eg_pending_registration', JSON.stringify({ phone, name, birthday }));
    }
    return { success: true };
  };

  const login = async (phone: string, code: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone,
        token: code,
        type: 'sms',
      });
      if (error) throw error;

      if (data.user) {
        // If metadata is pending, create/update record
        const pending = localStorage.getItem('eg_pending_registration');
        let name = 'Гость';
        let birthday = null;
        if (pending) {
          const parsed = JSON.parse(pending);
          if (parsed.phone === phone) {
            name = parsed.name || name;
            birthday = parsed.birthday || null;
          }
          localStorage.removeItem('eg_pending_registration');
        }

        // Fetch or upsert profile
        const { data: profile, error: profileErr } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profileErr || !profile) {
          const newProfile = {
            id: data.user.id,
            phone,
            name,
            birthday,
            bonus_balance: 0,
            total_spent: 0,
            level: 'Новичок',
          };
          const { data: upserted, error: upsertErr } = await supabase
            .from('users')
            .upsert(newProfile)
            .select()
            .single();
          if (upsertErr) throw upsertErr;
          setUser(upserted);
          return upserted;
        } else {
          setUser(profile);
          return profile;
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setLoading(false);
  };

  const processOrderLoyalty = async (orderTotal: number, bonusesUsed = 0) => {
    if (!user) return;

    // Calculate cashback (5% base, 10% if birthday today)
    let percent = 0.05;
    if (user.birthday) {
      const bday = new Date(user.birthday);
      const today = new Date();
      if (bday.getMonth() === today.getMonth() && bday.getDate() === today.getDate()) {
        percent = 0.10;
      }
    }

    const earned = Math.round((orderTotal - bonusesUsed) * percent);
    const balanceChange = earned - bonusesUsed;
    const newSpent = user.total_spent + (orderTotal - bonusesUsed);
    const newLevel = calculateLevel(newSpent);
    const newBalance = Math.max(0, user.bonus_balance + balanceChange);

    const updatedUser: UserProfile = {
      ...user,
      bonus_balance: newBalance,
      total_spent: newSpent,
      level: newLevel,
    };

    // Update db
    const { error: userErr } = await supabase
      .from('users')
      .update({
        bonus_balance: newBalance,
        total_spent: newSpent,
        level: newLevel,
      })
      .eq('id', user.id);

    if (userErr) throw userErr;

    // Insert transaction history
    const transactions = [];
    if (bonusesUsed > 0) {
      transactions.push({
        user_id: user.id,
        amount: bonusesUsed,
        type: 'spend',
        description: `Оплата заказа бонусами`,
      });
    }
    if (earned > 0) {
      transactions.push({
        user_id: user.id,
        amount: earned,
        type: 'earn',
        description: `Начисление бонусов за заказ`,
      });
    }
    if (transactions.length > 0) {
      await supabase.from('bonus_transactions').insert(transactions);
    }
    setUser(updatedUser);
  };

  const getTransactions = async (): Promise<BonusTransaction[]> => {
    if (!user) return [];
    const { data, error } = await supabase
      .from('bonus_transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
    if (error) throw error;
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updatedUser = { ...user, ...updates };
    const { error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', user.id);
    if (error) throw error;
    setUser(updatedUser as UserProfile);
  };

  return {
    user,
    loading,
    sendOTP,
    login,
    logout,
    processOrderLoyalty,
    getTransactions,
    signInWithGoogle,
    updateProfile,
  };
};
