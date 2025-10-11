import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import BrandedLoader from '@/components/ui/BrandedLoader';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield } from 'lucide-react';

interface UserWithRole {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  created_at: string;
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
        .select('id, email, full_name, role, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;
      toast({ title: `Role updated to ${newRole}` });
      loadUsers();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'superadmin':
        return 'bg-ancient-gold/20 text-ancient-gold border-ancient-gold/40';
      case 'admin':
        return 'bg-ancient-gold/10 text-ancient-gold/80 border-ancient-gold/30';
      case 'editor':
        return 'bg-imperial-bronze/20 text-imperial-bronze border-imperial-bronze/40';
      case 'support':
        return 'bg-laurel-green/20 text-laurel-green border-laurel-green/40';
      default:
        return 'bg-ancient-gold/5 text-ancient-gold/50 border-ancient-gold/20';
    }
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
      <div className="mb-8">
        <h1 className="font-ancient text-4xl text-ancient-gold tracking-wider mb-2">Users</h1>
        <p className="text-ancient-gold/60 font-order tracking-wide">Manage House members and roles</p>
      </div>

      <div className="bg-[#0A0404] rounded-lg border border-ancient-gold/20 overflow-hidden">
        <table className="w-full">
          <thead className="bg-ancient-gold/5 border-b border-ancient-gold/20">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-order uppercase tracking-wider text-ancient-gold">Email</th>
              <th className="px-4 py-3 text-left text-sm font-order uppercase tracking-wider text-ancient-gold">Name</th>
              <th className="px-4 py-3 text-left text-sm font-order uppercase tracking-wider text-ancient-gold">Role</th>
              <th className="px-4 py-3 text-left text-sm font-order uppercase tracking-wider text-ancient-gold">Joined</th>
              <th className="px-4 py-3 text-left text-sm font-order uppercase tracking-wider text-ancient-gold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t border-ancient-gold/10 hover:bg-ancient-gold/5 transition-colors">
                <td className="px-4 py-3 text-sm text-ancient-gold/80">{user.email}</td>
                <td className="px-4 py-3 text-sm text-ancient-gold/80">{user.full_name || 'N/A'}</td>
                <td className="px-4 py-3 text-sm">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-order uppercase tracking-wider border ${getRoleBadgeClass(user.role)}`}>
                    {(user.role === 'superadmin' || user.role === 'admin') && <Shield size={14} />}
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-ancient-gold/60">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-sm">
                  <Select value={user.role} onValueChange={(value) => updateUserRole(user.id, value)}>
                    <SelectTrigger className="w-32 bg-ancient-gold/5 border-ancient-gold/20 text-ancient-gold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0A0404] border-ancient-gold/30">
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="support">Support</SelectItem>
                      <SelectItem value="editor">Editor</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="superadmin">Superadmin</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && (
        <div className="text-center py-12 bg-[#0A0404] rounded-lg border border-ancient-gold/20 mt-6">
          <p className="text-ancient-gold/60 font-order tracking-wide">No members yet.</p>
        </div>
      )}
    </div>
  );
};

export default Users;