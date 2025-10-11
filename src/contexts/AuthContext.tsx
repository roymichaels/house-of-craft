import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type UserRole = 'user' | 'support' | 'editor' | 'admin' | 'superadmin';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  role: UserRole;
  isAdmin: boolean;
  isSuperadmin: boolean;
  isEditor: boolean;
  isSupport: boolean;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  checkUserRole: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<UserRole>('user');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const isAdmin = role === 'admin' || role === 'superadmin';
  const isSuperadmin = role === 'superadmin';
  const isEditor = role === 'editor' || role === 'admin' || role === 'superadmin';
  const isSupport = role === 'support' || role === 'admin' || role === 'superadmin';

  const checkUserRole = useCallback(async () => {
    const currentUser = await supabase.auth.getUser();
    const userId = currentUser.data.user?.id;

    if (!userId) {
      console.log('AuthContext: No user ID, setting role to user');
      setRole('user');
      return;
    }

    try {
      console.log('AuthContext: Fetching role for user ID:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .maybeSingle();

      console.log('AuthContext: Profile query result:', { data, error });

      if (error) {
        console.error('AuthContext: Query error:', error);
        throw error;
      }

      if (!data) {
        console.warn('AuthContext: No profile found for user');
        setRole('user');
        return;
      }

      const userRole = (data?.role as UserRole) || 'user';
      console.log('AuthContext: Setting role to:', userRole);
      setRole(userRole);
    } catch (error) {
      console.error('AuthContext: Error checking user role:', error);
      setRole('user');
    }
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('AuthContext: Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          checkUserRole();
        } else {
          setRole('user');
        }

        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('AuthContext: Initial session:', session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        checkUserRole();
      }

      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user?.id) {
      checkUserRole();
    }
  }, [user?.id]);

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        toast({
          title: "Sign up failed",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      toast({
        title: "Success!",
        description: "Account created successfully. You can now sign in.",
      });

      return { error: null };
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Sign in failed",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });

      return { error: null };
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      setSession(null);
      setRole('user');

      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        role,
        isAdmin,
        isSuperadmin,
        isEditor,
        isSupport,
        loading,
        signUp,
        signIn,
        signOut,
        checkUserRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};