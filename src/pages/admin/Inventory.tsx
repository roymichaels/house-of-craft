import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import BrandedLoader from '@/components/ui/BrandedLoader';
import AdminHeader from '@/components/admin/AdminHeader';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle, Package, TrendingUp, TrendingDown, History } from 'lucide-react';
import { format } from 'date-fns';

interface InventoryItem {
  id: string;
  product_id: string;
  quantity: number;
  reserved_quantity: number;
  reorder_point: number;
  reorder_quantity: number;
  location: string | null;
  last_restocked_at: string | null;
  products?: {
    name: string;
    price: number;
    category: string;
  };
}

interface InventoryHistory {
  id: string;
  change_type: string;
  quantity_change: number;
  quantity_before: number;
  quantity_after: number;
  reason: string | null;
  created_at: string;
}

const Inventory = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'low' | 'out'>('all');
  const [selectedProduct, setSelectedProduct] = useState<InventoryItem | null>(null);
  const [history, setHistory] = useState<InventoryHistory[]>([]);
  const [adjustmentDialog, setAdjustmentDialog] = useState(false);
  const [adjustmentForm, setAdjustmentForm] = useState({
    quantity_change: 0,
    reason: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      const { data, error } = await supabase
        .from('inventory')
        .select(`
          *,
          products (name, price, category)
        `)
        .order('quantity', { ascending: true });

      if (error) throw error;
      setInventory(data || []);
    } catch (error) {
      console.error('Error loading inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadHistory = async (productId: string) => {
    try {
      const { data, error } = await supabase
        .from('inventory_history')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setHistory(data || []);
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };

  const handleAdjustment = async () => {
    if (!selectedProduct || adjustmentForm.quantity_change === 0) return;

    try {
      const newQuantity = selectedProduct.quantity + adjustmentForm.quantity_change;

      if (newQuantity < 0) {
        toast({
          title: 'Error',
          description: 'Quantity cannot be negative',
          variant: 'destructive',
        });
        return;
      }

      // Update inventory
      const { error: invError } = await supabase
        .from('inventory')
        .update({ quantity: newQuantity })
        .eq('id', selectedProduct.id);

      if (invError) throw invError;

      // Create history record
      const { error: histError } = await supabase
        .from('inventory_history')
        .insert({
          product_id: selectedProduct.product_id,
          change_type: 'adjustment',
          quantity_change: adjustmentForm.quantity_change,
          quantity_before: selectedProduct.quantity,
          quantity_after: newQuantity,
          reason: adjustmentForm.reason || 'Manual adjustment',
        });

      if (histError) throw histError;

      toast({ title: 'Inventory updated successfully' });
      setAdjustmentDialog(false);
      setAdjustmentForm({ quantity_change: 0, reason: '' });
      loadInventory();
      if (selectedProduct) {
        loadHistory(selectedProduct.product_id);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const openAdjustment = (item: InventoryItem) => {
    setSelectedProduct(item);
    setAdjustmentDialog(true);
    loadHistory(item.product_id);
  };

  const getStockStatus = (item: InventoryItem) => {
    if (item.quantity === 0) return { label: 'Out of Stock', color: 'text-vita-flame' };
    if (item.quantity <= item.reorder_point) return { label: 'Low Stock', color: 'text-ancient-gold' };
    return { label: 'In Stock', color: 'text-laurel-green' };
  };

  const filteredInventory = inventory.filter((item) => {
    if (filter === 'low') return item.quantity > 0 && item.quantity <= item.reorder_point;
    if (filter === 'out') return item.quantity === 0;
    return true;
  });

  const stats = {
    total: inventory.length,
    lowStock: inventory.filter(i => i.quantity > 0 && i.quantity <= i.reorder_point).length,
    outOfStock: inventory.filter(i => i.quantity === 0).length,
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
        title="Inventory"
        description="Manage stock levels and track inventory movements"
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#0A0404] border border-ancient-gold/20 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-ancient-gold/60 text-sm font-order uppercase tracking-wider">Total Products</p>
              <p className="text-3xl font-ancient text-ancient-gold mt-2">{stats.total}</p>
            </div>
            <Package size={32} className="text-ancient-gold/40" />
          </div>
        </div>
        <div className="bg-[#0A0404] border border-ancient-gold/20 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-ancient-gold/60 text-sm font-order uppercase tracking-wider">Low Stock</p>
              <p className="text-3xl font-ancient text-ancient-gold mt-2">{stats.lowStock}</p>
            </div>
            <AlertTriangle size={32} className="text-ancient-gold/40" />
          </div>
        </div>
        <div className="bg-[#0A0404] border border-ancient-gold/20 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-ancient-gold/60 text-sm font-order uppercase tracking-wider">Out of Stock</p>
              <p className="text-3xl font-ancient text-vita-flame mt-2">{stats.outOfStock}</p>
            </div>
            <Package size={32} className="text-vita-flame/40" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
          className={filter === 'all' ? 'bg-ancient-gold/20 text-ancient-gold' : 'border-ancient-gold/30 text-ancient-gold/80'}
        >
          All Items
        </Button>
        <Button
          variant={filter === 'low' ? 'default' : 'outline'}
          onClick={() => setFilter('low')}
          className={filter === 'low' ? 'bg-ancient-gold/20 text-ancient-gold' : 'border-ancient-gold/30 text-ancient-gold/80'}
        >
          Low Stock ({stats.lowStock})
        </Button>
        <Button
          variant={filter === 'out' ? 'default' : 'outline'}
          onClick={() => setFilter('out')}
          className={filter === 'out' ? 'bg-vita-flame/20 text-vita-flame' : 'border-ancient-gold/30 text-ancient-gold/80'}
        >
          Out of Stock ({stats.outOfStock})
        </Button>
      </div>

      {/* Inventory Table */}
      <div className="bg-[#0A0404] rounded-lg border border-ancient-gold/20 overflow-hidden">
        <table className="w-full">
          <thead className="bg-ancient-gold/5 border-b border-ancient-gold/20">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-order uppercase tracking-wider text-ancient-gold">Product</th>
              <th className="px-4 py-3 text-left text-sm font-order uppercase tracking-wider text-ancient-gold">Location</th>
              <th className="px-4 py-3 text-left text-sm font-order uppercase tracking-wider text-ancient-gold">Quantity</th>
              <th className="px-4 py-3 text-left text-sm font-order uppercase tracking-wider text-ancient-gold">Reserved</th>
              <th className="px-4 py-3 text-left text-sm font-order uppercase tracking-wider text-ancient-gold">Status</th>
              <th className="px-4 py-3 text-left text-sm font-order uppercase tracking-wider text-ancient-gold">Reorder Point</th>
              <th className="px-4 py-3 text-left text-sm font-order uppercase tracking-wider text-ancient-gold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInventory.map((item) => {
              const status = getStockStatus(item);
              return (
                <tr key={item.id} className="border-t border-ancient-gold/10 hover:bg-ancient-gold/5 transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm font-ancient text-ancient-gold/90">{item.products?.name}</p>
                      <p className="text-xs text-ancient-gold/50 font-order mt-1">{item.products?.category}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-ancient-gold/70 font-order">{item.location || '-'}</td>
                  <td className="px-4 py-3">
                    <span className="text-lg font-ancient text-ancient-gold">{item.quantity}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-ancient-gold/60">{item.reserved_quantity}</td>
                  <td className="px-4 py-3">
                    <span className={`text-sm font-order uppercase tracking-wider ${status.color}`}>
                      {status.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-ancient-gold/60">{item.reorder_point}</td>
                  <td className="px-4 py-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openAdjustment(item)}
                      className="border-ancient-gold/30 text-ancient-gold/80 hover:bg-ancient-gold/10 hover:text-ancient-gold"
                    >
                      <History size={14} className="mr-1" />
                      <span className="font-order uppercase text-xs">Adjust</span>
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Adjustment Dialog */}
      {selectedProduct && (
        <Dialog open={adjustmentDialog} onOpenChange={setAdjustmentDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0A0404] border-ancient-gold/30">
            <DialogHeader>
              <DialogTitle className="font-ancient text-2xl text-ancient-gold tracking-wider">
                Adjust Inventory: {selectedProduct.products?.name}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              <div className="p-4 bg-ancient-gold/5 rounded-lg border border-ancient-gold/20">
                <p className="text-ancient-gold/80 font-order mb-2">Current Stock: <span className="text-ancient-gold font-ancient text-xl">{selectedProduct.quantity}</span></p>
                <p className="text-ancient-gold/60 text-sm font-order">Location: {selectedProduct.location || 'Not set'}</p>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleAdjustment(); }} className="space-y-4">
                <div>
                  <Label htmlFor="quantity_change" className="text-ancient-gold/80">Quantity Change</Label>
                  <div className="flex gap-2 mt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setAdjustmentForm({ ...adjustmentForm, quantity_change: adjustmentForm.quantity_change - 1 })}
                      className="border-ancient-gold/30 text-ancient-gold hover:bg-ancient-gold/10"
                    >
                      -1
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setAdjustmentForm({ ...adjustmentForm, quantity_change: adjustmentForm.quantity_change - 10 })}
                      className="border-ancient-gold/30 text-ancient-gold hover:bg-ancient-gold/10"
                    >
                      -10
                    </Button>
                    <Input
                      id="quantity_change"
                      type="number"
                      value={adjustmentForm.quantity_change}
                      onChange={(e) => setAdjustmentForm({ ...adjustmentForm, quantity_change: parseInt(e.target.value) || 0 })}
                      className="bg-ancient-gold/5 border-ancient-gold/20 text-ancient-gold text-center flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setAdjustmentForm({ ...adjustmentForm, quantity_change: adjustmentForm.quantity_change + 10 })}
                      className="border-ancient-gold/30 text-ancient-gold hover:bg-ancient-gold/10"
                    >
                      +10
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setAdjustmentForm({ ...adjustmentForm, quantity_change: adjustmentForm.quantity_change + 1 })}
                      className="border-ancient-gold/30 text-ancient-gold hover:bg-ancient-gold/10"
                    >
                      +1
                    </Button>
                  </div>
                  {adjustmentForm.quantity_change !== 0 && (
                    <p className="mt-2 text-sm text-ancient-gold/60">
                      New quantity will be: {selectedProduct.quantity + adjustmentForm.quantity_change}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="reason" className="text-ancient-gold/80">Reason</Label>
                  <Textarea
                    id="reason"
                    value={adjustmentForm.reason}
                    onChange={(e) => setAdjustmentForm({ ...adjustmentForm, reason: e.target.value })}
                    rows={2}
                    className="bg-ancient-gold/5 border-ancient-gold/20 text-ancient-gold"
                    placeholder="Reason for adjustment"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={adjustmentForm.quantity_change === 0}
                  className="w-full bg-ancient-gold/10 border border-ancient-gold/30 hover:bg-ancient-gold/20 text-ancient-gold font-order uppercase tracking-wider"
                >
                  Confirm Adjustment
                </Button>
              </form>

              {/* History */}
              <div className="border-t border-ancient-gold/20 pt-4">
                <h3 className="font-ancient text-lg text-ancient-gold mb-3 flex items-center gap-2">
                  <History size={20} />
                  Recent History
                </h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {history.length === 0 ? (
                    <p className="text-ancient-gold/60 text-sm font-order text-center py-4">No history yet</p>
                  ) : (
                    history.map((record) => (
                      <div key={record.id} className="p-3 bg-ancient-gold/5 rounded border border-ancient-gold/10">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-order uppercase tracking-wider text-ancient-gold/80">
                            {record.change_type}
                          </span>
                          <span className="text-xs text-ancient-gold/50">{format(new Date(record.created_at), 'PPp')}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          {record.quantity_change > 0 ? (
                            <TrendingUp size={16} className="text-laurel-green" />
                          ) : (
                            <TrendingDown size={16} className="text-vita-flame" />
                          )}
                          <span className="text-ancient-gold/70 font-order">
                            {record.quantity_before} → {record.quantity_after} ({record.quantity_change > 0 ? '+' : ''}{record.quantity_change})
                          </span>
                        </div>
                        {record.reason && (
                          <p className="text-xs text-ancient-gold/60 mt-1 font-order">{record.reason}</p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Inventory;
