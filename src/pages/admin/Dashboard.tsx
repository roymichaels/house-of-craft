import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import AdminHeader from '@/components/admin/AdminHeader';
import StatCard from '@/components/admin/StatCard';
import BrandedLoader from '@/components/ui/BrandedLoader';
import { DollarSign, Package, ShoppingCart, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { format } from 'date-fns';

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  recentOrders: any[];
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    recentOrders: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [ordersRes, productsRes, usersRes] = await Promise.all([
        supabase.from('orders').select('total_amount, created_at, status, id'),
        supabase.from('products').select('id', { count: 'exact' }),
        supabase.from('profiles').select('id', { count: 'exact' }),
      ]);

      const orders = ordersRes.data || [];
      const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total_amount), 0);
      const recentOrders = orders
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5);

      setStats({
        totalRevenue,
        totalOrders: orders.length,
        totalProducts: productsRes.count || 0,
        totalUsers: usersRes.count || 0,
        recentOrders,
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
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
      <AdminHeader
        title="Command Center"
        description="Overview of your House operations"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toFixed(2)}`}
          icon={<DollarSign size={24} />}
          change={12.5}
          trend="up"
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={<ShoppingCart size={24} />}
          change={8.2}
          trend="up"
        />
        <StatCard
          title="Products"
          value={stats.totalProducts}
          icon={<Package size={24} />}
        />
        <StatCard
          title="Members"
          value={stats.totalUsers}
          icon={<Users size={24} />}
          change={5.3}
          trend="up"
        />
      </div>

      <Card className="bg-[#0A0404] border-ancient-gold/20 p-6">
        <h2 className="font-ancient text-2xl text-ancient-gold mb-4 tracking-wider">
          Recent Orders
        </h2>
        <div className="space-y-3">
          {stats.recentOrders.length === 0 ? (
            <p className="text-ancient-gold/60 text-center py-8 font-order">
              No orders yet
            </p>
          ) : (
            stats.recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 bg-ancient-gold/5 rounded-lg border border-ancient-gold/10 hover:border-ancient-gold/30 transition-all"
              >
                <div>
                  <p className="text-ancient-gold font-order tracking-wide">
                    Order #{order.id.slice(0, 8)}
                  </p>
                  <p className="text-ancient-gold/60 text-sm mt-1">
                    {format(new Date(order.created_at), 'PPp')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-ancient-gold font-ancient text-lg">
                    ${Number(order.total_amount).toFixed(2)}
                  </p>
                  <span
                    className={`inline-block px-2 py-1 text-xs rounded font-order uppercase tracking-wider mt-1 ${
                      order.status === 'delivered'
                        ? 'bg-laurel-green/20 text-laurel-green'
                        : order.status === 'pending'
                        ? 'bg-ancient-gold/20 text-ancient-gold'
                        : 'bg-ancient-gold/10 text-ancient-gold/60'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
