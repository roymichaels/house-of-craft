import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  FileText,
  Settings,
  Crown,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { user, role, isSuperadmin, signOut } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'superadmin', 'editor', 'support'] },
    { path: '/admin/products', label: 'Products', icon: Package, roles: ['admin', 'superadmin', 'editor'] },
    { path: '/admin/orders', label: 'Orders', icon: ShoppingCart, roles: ['admin', 'superadmin', 'support'] },
    { path: '/admin/users', label: 'Users', icon: Users, roles: ['admin', 'superadmin'] },
    { path: '/admin/content', label: 'Content', icon: FileText, roles: ['admin', 'superadmin', 'editor'] },
    { path: '/admin/system', label: 'System', icon: Settings, roles: ['superadmin'] },
  ];

  const hasAccess = (itemRoles: string[]) => itemRoles.includes(role);

  return (
    <div className="min-h-screen bg-obsidian-core">
      <div className="flex h-screen">
        <aside className="w-72 bg-[#0A0404] border-r border-ancient-gold/10 flex flex-col">
          <div className="p-6 border-b border-ancient-gold/10">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="font-ancient text-2xl text-ancient-gold tracking-wider">
                APOLLO
              </h2>
              {isSuperadmin && (
                <Crown size={20} className="text-ancient-gold animate-pulse" />
              )}
            </div>
            <p className="text-xs text-ancient-gold/60 font-order uppercase tracking-widest">
              House of Order
            </p>
            <Separator className="my-3 bg-ancient-gold/20" />
            <div className="space-y-1">
              <p className="text-sm text-ancient-gold/80">{user?.email}</p>
              <p className="text-xs text-ancient-gold/50 font-order uppercase tracking-wider">
                {role}
              </p>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto momentum-scroll">
            {navItems.map((item) => {
              if (!hasAccess(item.roles)) return null;

              const active = isActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg
                    transition-all duration-200 group
                    ${active
                      ? 'bg-ancient-gold/10 text-ancient-gold border border-ancient-gold/30 shadow-lg shadow-ancient-gold/10'
                      : 'hover:bg-ancient-gold/5 text-ancient-gold/70 hover:text-ancient-gold border border-transparent hover:border-ancient-gold/10'
                    }
                  `}
                >
                  <item.icon
                    size={18}
                    className={active ? 'text-ancient-gold' : 'text-ancient-gold/60 group-hover:text-ancient-gold'}
                  />
                  <span className="font-order text-sm tracking-wide uppercase">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-ancient-gold/10">
            <Button
              variant="outline"
              className="w-full border-ancient-gold/20 hover:bg-ancient-gold/10 hover:border-ancient-gold/40 text-ancient-gold/70 hover:text-ancient-gold"
              onClick={signOut}
            >
              <LogOut size={16} className="mr-2" />
              <span className="font-order text-sm uppercase tracking-wide">Sign Out</span>
            </Button>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
