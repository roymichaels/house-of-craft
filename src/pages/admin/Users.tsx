import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import BrandedLoader from '@/components/ui/BrandedLoader';
import { Button } from '@/components/ui/button';
import { Shield, ShieldOff } from 'lucide-react';

interface UserWithRole {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
  user_roles: Array<{ role: string }>;
}

const Users = () => {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, full_name, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Fetch roles separately
      const usersWithRoles = await Promise.all(
        (data || []).map(async (profile) => {
          const { data: roles } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', profile.id);
          
          return { ...profile, user_roles: roles || [] };
        })
      );
      
      setUsers(usersWithRoles as any);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAdminRole = async (userId: string, isCurrentlyAdmin: boolean) => {
    try {
      if (isCurrentlyAdmin) {
        const { error } = await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', userId)
          .eq('role', 'admin');

        if (error) throw error;
        toast({ title: 'Admin role removed' });
      } else {
        const { error } = await supabase
          .from('user_roles')
          .insert({ user_id: userId, role: 'admin' });

        if (error) throw error;
        toast({ title: 'Admin role granted' });
      }

      loadUsers();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const isAdmin = (user: UserWithRole) => {
    return user.user_roles?.some((role) => role.role === 'admin') || false;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <BrandedLoader />
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-heading text-3xl text-foreground mb-6">Users</h1>

      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">Email</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Role</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Joined</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const userIsAdmin = isAdmin(user);
              return (
                <tr key={user.id} className="border-t border-border">
                  <td className="px-4 py-3 text-sm">{user.email}</td>
                  <td className="px-4 py-3 text-sm">{user.full_name || 'N/A'}</td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                        userIsAdmin
                          ? 'bg-primary/10 text-primary'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {userIsAdmin ? <Shield size={14} /> : null}
                      {userIsAdmin ? 'Admin' : 'Customer'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <Button
                      variant={userIsAdmin ? 'destructive' : 'default'}
                      size="sm"
                      onClick={() => toggleAdminRole(user.id, userIsAdmin)}
                    >
                      {userIsAdmin ? (
                        <>
                          <ShieldOff size={14} className="mr-1" />
                          Revoke Admin
                        </>
                      ) : (
                        <>
                          <Shield size={14} className="mr-1" />
                          Make Admin
                        </>
                      )}
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {users.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No users yet.</p>
        </div>
      )}
    </div>
  );
};

export default Users;