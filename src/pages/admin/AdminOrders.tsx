import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import BrandedLoader from '@/components/ui/BrandedLoader';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status: string;
  created_at: string;
  items: any;
  shipping_address: any;
  profiles?: {
    email: string;
    full_name: string;
  };
}

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Fetch profiles separately
      const ordersWithProfiles = await Promise.all(
        (data || []).map(async (order) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('email, full_name')
            .eq('id', order.user_id)
            .single();
          
          return { ...order, profiles: profile };
        })
      );
      
      setOrders(ordersWithProfiles as any);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', orderId);

      if (error) throw error;

      toast({ title: 'Order status updated successfully' });
      loadOrders();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
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
        <h1 className="font-ancient text-4xl text-ancient-gold tracking-wider mb-2">Orders</h1>
        <p className="text-ancient-gold/60 font-order tracking-wide">Manage customer transactions</p>
      </div>

      <div className="bg-[#0A0404] rounded-lg border border-ancient-gold/20 overflow-hidden">
        <table className="w-full">
          <thead className="bg-ancient-gold/5 border-b border-ancient-gold/20">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-order uppercase tracking-wider text-ancient-gold">Order ID</th>
              <th className="px-4 py-3 text-left text-sm font-order uppercase tracking-wider text-ancient-gold">Customer</th>
              <th className="px-4 py-3 text-left text-sm font-order uppercase tracking-wider text-ancient-gold">Total</th>
              <th className="px-4 py-3 text-left text-sm font-order uppercase tracking-wider text-ancient-gold">Status</th>
              <th className="px-4 py-3 text-left text-sm font-order uppercase tracking-wider text-ancient-gold">Date</th>
              <th className="px-4 py-3 text-left text-sm font-order uppercase tracking-wider text-ancient-gold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t border-ancient-gold/10 hover:bg-ancient-gold/5 transition-colors">
                <td className="px-4 py-3 text-sm text-ancient-gold/80 font-order">#{order.id.slice(0, 8)}</td>
                <td className="px-4 py-3 text-sm text-ancient-gold/80">
                  {order.profiles?.full_name || order.profiles?.email || 'Unknown'}
                </td>
                <td className="px-4 py-3 text-sm font-ancient text-ancient-gold">
                  ${order.total_amount.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-sm">
                  <Select
                    value={order.status}
                    onValueChange={(value) => updateOrderStatus(order.id, value)}
                  >
                    <SelectTrigger className="w-32 bg-ancient-gold/5 border-ancient-gold/20 text-ancient-gold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0A0404] border-ancient-gold/30">
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
                <td className="px-4 py-3 text-sm text-ancient-gold/60">
                  {format(new Date(order.created_at), 'PP')}
                </td>
                <td className="px-4 py-3 text-sm">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="text-ancient-gold/80 hover:text-ancient-gold font-order uppercase tracking-wide text-xs hover:underline transition-colors"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {orders.length === 0 && (
        <div className="text-center py-12 bg-[#0A0404] rounded-lg border border-ancient-gold/20 mt-6">
          <p className="text-ancient-gold/60 font-order tracking-wide">No orders yet.</p>
        </div>
      )}

      {selectedOrder && (
        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="max-w-2xl bg-[#0A0404] border-ancient-gold/30">
            <DialogHeader>
              <DialogTitle className="font-ancient text-2xl text-ancient-gold tracking-wider">
                Order Details #{selectedOrder.id.slice(0, 8)}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="p-4 bg-ancient-gold/5 rounded-lg border border-ancient-gold/20">
                <h3 className="font-order uppercase tracking-wider text-sm text-ancient-gold mb-3">Customer Information</h3>
                <p className="text-sm text-ancient-gold/80 mb-1">
                  <span className="text-ancient-gold/60 font-order">Name: </span>
                  {selectedOrder.profiles?.full_name || 'N/A'}
                </p>
                <p className="text-sm text-ancient-gold/80">
                  <span className="text-ancient-gold/60 font-order">Email: </span>
                  {selectedOrder.profiles?.email || 'N/A'}
                </p>
              </div>

              {selectedOrder.items && (
                <div className="p-4 bg-ancient-gold/5 rounded-lg border border-ancient-gold/20">
                  <h3 className="font-order uppercase tracking-wider text-sm text-ancient-gold mb-3">Items</h3>
                  <div className="space-y-2">
                    {Array.isArray(selectedOrder.items) && selectedOrder.items.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between text-sm text-ancient-gold/80 py-2 border-b border-ancient-gold/10 last:border-0">
                        <span className="font-order">{item.name} × {item.quantity}</span>
                        <span className="font-ancient text-ancient-gold">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedOrder.shipping_address && (
                <div className="p-4 bg-ancient-gold/5 rounded-lg border border-ancient-gold/20">
                  <h3 className="font-order uppercase tracking-wider text-sm text-ancient-gold mb-3">Shipping Address</h3>
                  <p className="text-sm text-ancient-gold/80 leading-relaxed">
                    {selectedOrder.shipping_address.line1}<br />
                    {selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state}{' '}
                    {selectedOrder.shipping_address.postal_code}
                  </p>
                </div>
              )}

              <div className="pt-4 border-t border-ancient-gold/20">
                <div className="flex justify-between items-center">
                  <span className="font-order uppercase tracking-wider text-ancient-gold">Total:</span>
                  <span className="text-2xl font-ancient text-ancient-gold">
                    ${selectedOrder.total_amount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AdminOrders;