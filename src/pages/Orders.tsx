import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import BrandedLoader from '@/components/ui/BrandedLoader';
import { format } from 'date-fns';

interface Order {
  id: string;
  total_amount: number;
  status: string;
  created_at: string;
  items: any;
  shipping_address: any;
}

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user]);

  const loadOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <BrandedLoader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-heading text-4xl text-foreground mb-8">Your Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">You haven't placed any orders yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-card p-6 rounded-lg border border-border"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Order #{order.id.slice(0, 8)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(order.created_at), 'PPP')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-lg">
                      ${order.total_amount.toFixed(2)}
                    </p>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      order.status === 'completed' ? 'bg-green-500/10 text-green-500' :
                      order.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                      'bg-red-500/10 text-red-500'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                {order.items && Array.isArray(order.items) && (
                  <div className="space-y-2 mb-4">
                    {order.items.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span>{item.name} × {item.quantity}</span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                )}

                {order.shipping_address && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground">Shipping Address:</p>
                    <p className="text-sm">
                      {order.shipping_address.line1}<br />
                      {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;