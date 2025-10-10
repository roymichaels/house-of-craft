import { Link, Routes, Route, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Products from './Products';
import AdminOrders from './AdminOrders';
import Users from './Users';
import { Package, ShoppingCart, Users as UsersIcon } from 'lucide-react';

const Admin = () => {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/admin/products', label: 'Products', icon: Package },
    { path: '/admin/orders', label: 'Orders', icon: ShoppingCart },
    { path: '/admin/users', label: 'Users', icon: UsersIcon },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-card border-r border-border min-h-screen p-6">
          <div className="mb-8">
            <h2 className="font-heading text-2xl text-foreground mb-2">Admin Panel</h2>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted text-muted-foreground'
                }`}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <Routes>
            <Route path="/products" element={<Products />} />
            <Route path="/orders" element={<AdminOrders />} />
            <Route path="/users" element={<Users />} />
            <Route path="/" element={<Products />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Admin;