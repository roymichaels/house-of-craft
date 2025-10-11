import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, FolderTree, Eye, EyeOff } from 'lucide-react';
import BrandedLoader from '@/components/ui/BrandedLoader';
import AdminHeader from '@/components/admin/AdminHeader';
import { Switch } from '@/components/ui/switch';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parent_id: string | null;
  image_url: string | null;
  tagline: string | null;
  display_order: number;
  is_visible: boolean;
  product_count: number;
  created_at: string;
  parent?: {
    name: string;
  };
}

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [parentCategories, setParentCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    parent_id: '',
    image_url: '',
    tagline: '',
    display_order: 0,
    is_visible: true,
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;

      const allCategories = data || [];
      setCategories(allCategories);

      // Get only parent categories (no parent_id)
      setParentCategories(allCategories.filter(c => !c.parent_id));
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  };

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: generateSlug(name),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const categoryData = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description || null,
        parent_id: formData.parent_id || null,
        image_url: formData.image_url || null,
        tagline: formData.tagline || null,
        display_order: formData.display_order,
        is_visible: formData.is_visible,
      };

      if (editingCategory) {
        const { error } = await supabase
          .from('categories')
          .update(categoryData)
          .eq('id', editingCategory.id);

        if (error) throw error;
        toast({ title: 'Category updated successfully' });
      } else {
        const { error } = await supabase
          .from('categories')
          .insert(categoryData);

        if (error) throw error;
        toast({ title: 'Category created successfully' });
      }

      setIsDialogOpen(false);
      resetForm();
      loadCategories();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category? This will also delete all subcategories.')) return;

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: 'Category deleted successfully' });
      loadCategories();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const toggleVisibility = async (category: Category) => {
    try {
      const { error } = await supabase
        .from('categories')
        .update({ is_visible: !category.is_visible })
        .eq('id', category.id);

      if (error) throw error;
      toast({ title: `Category ${category.is_visible ? 'hidden' : 'shown'}` });
      loadCategories();
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
      slug: '',
      description: '',
      parent_id: '',
      image_url: '',
      tagline: '',
      display_order: 0,
      is_visible: true,
    });
    setEditingCategory(null);
  };

  const openEditDialog = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      parent_id: category.parent_id || '',
      image_url: category.image_url || '',
      tagline: category.tagline || '',
      display_order: category.display_order,
      is_visible: category.is_visible,
    });
    setIsDialogOpen(true);
  };

  const getParentName = (parentId: string | null) => {
    if (!parentId) return '-';
    const parent = categories.find(c => c.id === parentId);
    return parent?.name || '-';
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
        title="Categories"
        description="Manage product categories and subcategories"
      />

      <div className="flex justify-end mb-8">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={resetForm}
              className="bg-ancient-gold/10 border border-ancient-gold/30 hover:bg-ancient-gold/20 text-ancient-gold"
            >
              <Plus size={20} className="mr-2" />
              <span className="font-order uppercase tracking-wide">Add Category</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0A0404] border-ancient-gold/30">
            <DialogHeader>
              <DialogTitle className="font-ancient text-2xl text-ancient-gold tracking-wider">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-ancient-gold/80">Name*</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  required
                  className="bg-ancient-gold/5 border-ancient-gold/20 text-ancient-gold"
                />
              </div>
              <div>
                <Label htmlFor="slug" className="text-ancient-gold/80">Slug*</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  required
                  className="bg-ancient-gold/5 border-ancient-gold/20 text-ancient-gold"
                />
              </div>
              <div>
                <Label htmlFor="parent_id" className="text-ancient-gold/80">Parent Category</Label>
                <Select value={formData.parent_id} onValueChange={(value) => setFormData({ ...formData, parent_id: value })}>
                  <SelectTrigger className="bg-ancient-gold/5 border-ancient-gold/20 text-ancient-gold">
                    <SelectValue placeholder="None (Top Level)" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0A0404] border-ancient-gold/30">
                    <SelectItem value="">None (Top Level)</SelectItem>
                    {parentCategories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="tagline" className="text-ancient-gold/80">Tagline</Label>
                <Input
                  id="tagline"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="bg-ancient-gold/5 border-ancient-gold/20 text-ancient-gold"
                  placeholder="Marketing tagline"
                />
              </div>
              <div>
                <Label htmlFor="description" className="text-ancient-gold/80">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="bg-ancient-gold/5 border-ancient-gold/20 text-ancient-gold"
                />
              </div>
              <div>
                <Label htmlFor="image_url" className="text-ancient-gold/80">Image URL</Label>
                <Input
                  id="image_url"
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="bg-ancient-gold/5 border-ancient-gold/20 text-ancient-gold"
                />
              </div>
              <div>
                <Label htmlFor="display_order" className="text-ancient-gold/80">Display Order</Label>
                <Input
                  id="display_order"
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                  className="bg-ancient-gold/5 border-ancient-gold/20 text-ancient-gold"
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="is_visible"
                  checked={formData.is_visible}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_visible: checked })}
                />
                <Label htmlFor="is_visible" className="text-ancient-gold/80">Visible on site</Label>
              </div>
              <Button
                type="submit"
                className="w-full bg-ancient-gold/10 border border-ancient-gold/30 hover:bg-ancient-gold/20 text-ancient-gold font-order uppercase tracking-wider"
              >
                {editingCategory ? 'Confirm Changes' : 'Confirm Command'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-[#0A0404] rounded-lg border border-ancient-gold/20 overflow-hidden">
        <table className="w-full">
          <thead className="bg-ancient-gold/5 border-b border-ancient-gold/20">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-order uppercase tracking-wider text-ancient-gold">Name</th>
              <th className="px-4 py-3 text-left text-sm font-order uppercase tracking-wider text-ancient-gold">Slug</th>
              <th className="px-4 py-3 text-left text-sm font-order uppercase tracking-wider text-ancient-gold">Parent</th>
              <th className="px-4 py-3 text-left text-sm font-order uppercase tracking-wider text-ancient-gold">Products</th>
              <th className="px-4 py-3 text-left text-sm font-order uppercase tracking-wider text-ancient-gold">Order</th>
              <th className="px-4 py-3 text-left text-sm font-order uppercase tracking-wider text-ancient-gold">Visible</th>
              <th className="px-4 py-3 text-left text-sm font-order uppercase tracking-wider text-ancient-gold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id} className="border-t border-ancient-gold/10 hover:bg-ancient-gold/5 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {category.parent_id && <FolderTree size={16} className="text-ancient-gold/40" />}
                    <span className="text-sm text-ancient-gold/80 font-ancient">{category.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-ancient-gold/60 font-mono">{category.slug}</td>
                <td className="px-4 py-3 text-sm text-ancient-gold/60">{getParentName(category.parent_id)}</td>
                <td className="px-4 py-3 text-sm text-ancient-gold/80 font-ancient">{category.product_count}</td>
                <td className="px-4 py-3 text-sm text-ancient-gold/60">{category.display_order}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleVisibility(category)}
                    className="text-ancient-gold/60 hover:text-ancient-gold transition-colors"
                  >
                    {category.is_visible ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-ancient-gold/80 hover:text-ancient-gold hover:bg-ancient-gold/10"
                      onClick={() => openEditDialog(category)}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-vita-flame/80 hover:text-vita-flame hover:bg-vita-flame/10"
                      onClick={() => handleDelete(category.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {categories.length === 0 && (
        <div className="text-center py-12 bg-[#0A0404] rounded-lg border border-ancient-gold/20 mt-6">
          <FolderTree size={48} className="mx-auto mb-4 text-ancient-gold/40" />
          <p className="text-ancient-gold/60 font-order tracking-wide">No categories yet. Create your first category!</p>
        </div>
      )}
    </div>
  );
};

export default Categories;
