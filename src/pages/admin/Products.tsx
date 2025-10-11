import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2 } from 'lucide-react';
import BrandedLoader from '@/components/ui/BrandedLoader';

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: string | null;
  subcategory: string | null;
  in_stock: boolean;
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image_url: '',
    category: '',
    subcategory: '',
    in_stock: true,
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const productData = {
        name: formData.name,
        description: formData.description || null,
        price: parseFloat(formData.price),
        image_url: formData.image_url || null,
        category: formData.category || null,
        subcategory: formData.subcategory || null,
        in_stock: formData.in_stock,
      };

      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id);

        if (error) throw error;
        toast({ title: 'Product updated successfully' });
      } else {
        const { error } = await supabase
          .from('products')
          .insert(productData);

        if (error) throw error;
        toast({ title: 'Product created successfully' });
      }

      setIsDialogOpen(false);
      resetForm();
      loadProducts();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: 'Product deleted successfully' });
      loadProducts();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      image_url: '',
      category: '',
      subcategory: '',
      in_stock: true,
    });
    setEditingProduct(null);
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      image_url: product.image_url || '',
      category: product.category || '',
      subcategory: product.subcategory || '',
      in_stock: product.in_stock,
    });
    setIsDialogOpen(true);
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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-ancient text-4xl text-ancient-gold tracking-wider mb-2">Products</h1>
          <p className="text-ancient-gold/60 font-order tracking-wide">Manage your catalog of artifacts</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={resetForm}
              className="bg-ancient-gold/10 border border-ancient-gold/30 hover:bg-ancient-gold/20 text-ancient-gold"
            >
              <Plus size={20} className="mr-2" />
              <span className="font-order uppercase tracking-wide">Add Product</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0A0404] border-ancient-gold/30">
            <DialogHeader>
              <DialogTitle className="font-ancient text-2xl text-ancient-gold tracking-wider">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name*</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="price">Price*</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="subcategory">Subcategory</Label>
                  <Input
                    id="subcategory"
                    value={formData.subcategory}
                    onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="in_stock"
                  checked={formData.in_stock}
                  onChange={(e) => setFormData({ ...formData, in_stock: e.target.checked })}
                />
                <Label htmlFor="in_stock">In Stock</Label>
              </div>
              <Button
                type="submit"
                className="w-full bg-ancient-gold/10 border border-ancient-gold/30 hover:bg-ancient-gold/20 text-ancient-gold font-order uppercase tracking-wider"
              >
                {editingProduct ? 'Confirm Changes' : 'Confirm Command'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-[#0A0404] rounded-lg border border-ancient-gold/20 hover:border-ancient-gold/40 overflow-hidden transition-all">
            {product.image_url && (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="font-ancient text-xl text-ancient-gold mb-2 tracking-wide">{product.name}</h3>
              <p className="text-ancient-gold/60 text-sm mb-3 line-clamp-2 font-order">
                {product.description}
              </p>
              <div className="flex justify-between items-center mb-3">
                <span className="font-ancient text-lg text-ancient-gold">${product.price}</span>
                <span className={`px-2 py-1 rounded text-xs font-order uppercase tracking-wider ${
                  product.in_stock ? 'bg-laurel-green/20 text-laurel-green' : 'bg-vita-flame/20 text-vita-flame'
                }`}>
                  {product.in_stock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-ancient-gold/30 hover:bg-ancient-gold/10 text-ancient-gold/80 hover:text-ancient-gold"
                  onClick={() => openEditDialog(product)}
                >
                  <Edit size={16} className="mr-1" />
                  <span className="font-order uppercase text-xs tracking-wider">Edit</span>
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="flex-1 bg-vita-flame/10 border-vita-flame/30 hover:bg-vita-flame/20 text-vita-flame"
                  onClick={() => handleDelete(product.id)}
                >
                  <Trash2 size={16} className="mr-1" />
                  <span className="font-order uppercase text-xs tracking-wider">Delete</span>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12 bg-[#0A0404] rounded-lg border border-ancient-gold/20">
          <p className="text-ancient-gold/60 font-order tracking-wide">No products yet. Create your first artifact!</p>
        </div>
      )}
    </div>
  );
};

export default Products;