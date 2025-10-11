import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Tag as TagIcon } from 'lucide-react';
import BrandedLoader from '@/components/ui/BrandedLoader';
import AdminHeader from '@/components/admin/AdminHeader';

interface Tag {
  id: string;
  name: string;
  slug: string;
  color: string;
  description: string | null;
  usage_count: number;
  created_at: string;
}

const Tags = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    color: '#C8A882',
    description: '',
  });

  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    try {
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .order('usage_count', { ascending: false });

      if (error) throw error;
      setTags(data || []);
    } catch (error) {
      console.error('Error loading tags:', error);
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
      const tagData = {
        name: formData.name,
        slug: formData.slug,
        color: formData.color,
        description: formData.description || null,
      };

      if (editingTag) {
        const { error } = await supabase
          .from('tags')
          .update(tagData)
          .eq('id', editingTag.id);

        if (error) throw error;
        toast({ title: 'Tag updated successfully' });
      } else {
        const { error } = await supabase
          .from('tags')
          .insert(tagData);

        if (error) throw error;
        toast({ title: 'Tag created successfully' });
      }

      setIsDialogOpen(false);
      resetForm();
      loadTags();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tag? It will be removed from all products.')) return;

    try {
      const { error } = await supabase
        .from('tags')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: 'Tag deleted successfully' });
      loadTags();
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
      color: '#C8A882',
      description: '',
    });
    setEditingTag(null);
  };

  const openEditDialog = (tag: Tag) => {
    setEditingTag(tag);
    setFormData({
      name: tag.name,
      slug: tag.slug,
      color: tag.color,
      description: tag.description || '',
    });
    setIsDialogOpen(true);
  };

  const predefinedColors = [
    { name: 'Ancient Gold', value: '#C8A882' },
    { name: 'Imperial Bronze', value: '#8B7355' },
    { name: 'Deep Gold', value: '#D4AF37' },
    { name: 'Warm Stone', value: '#967969' },
    { name: 'Laurel Green', value: '#6B8E23' },
    { name: 'Vita Flame', value: '#DAA520' },
  ];

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
        title="Tags"
        description="Manage product tags and labels"
      />

      <div className="flex justify-end mb-8">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={resetForm}
              className="bg-ancient-gold/10 border border-ancient-gold/30 hover:bg-ancient-gold/20 text-ancient-gold"
            >
              <Plus size={20} className="mr-2" />
              <span className="font-order uppercase tracking-wide">Add Tag</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl bg-[#0A0404] border-ancient-gold/30">
            <DialogHeader>
              <DialogTitle className="font-ancient text-2xl text-ancient-gold tracking-wider">
                {editingTag ? 'Edit Tag' : 'Add New Tag'}
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
                  placeholder="e.g., New Arrival, Featured"
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
                <Label htmlFor="description" className="text-ancient-gold/80">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                  className="bg-ancient-gold/5 border-ancient-gold/20 text-ancient-gold"
                  placeholder="When to use this tag"
                />
              </div>
              <div>
                <Label className="text-ancient-gold/80 mb-3 block">Color</Label>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {predefinedColors.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, color: color.value })}
                      className={`p-3 rounded border-2 transition-all ${
                        formData.color === color.value
                          ? 'border-ancient-gold'
                          : 'border-ancient-gold/20 hover:border-ancient-gold/40'
                      }`}
                      style={{ backgroundColor: color.value }}
                    >
                      <span className="text-xs font-order text-black/70">{color.name}</span>
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="color" className="text-ancient-gold/80">Custom:</Label>
                  <input
                    type="color"
                    id="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="h-10 w-20 bg-ancient-gold/5 border border-ancient-gold/20 rounded cursor-pointer"
                  />
                  <span className="text-ancient-gold/60 font-mono text-sm">{formData.color}</span>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-ancient-gold/10 border border-ancient-gold/30 hover:bg-ancient-gold/20 text-ancient-gold font-order uppercase tracking-wider"
              >
                {editingTag ? 'Confirm Changes' : 'Confirm Command'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tags.map((tag) => (
          <div
            key={tag.id}
            className="bg-[#0A0404] rounded-lg border border-ancient-gold/20 hover:border-ancient-gold/40 p-5 transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: tag.color }}
                />
                <h3 className="font-ancient text-lg text-ancient-gold">{tag.name}</h3>
              </div>
              <span className="px-2 py-1 bg-ancient-gold/10 text-ancient-gold/80 rounded text-xs font-order">
                {tag.usage_count} {tag.usage_count === 1 ? 'use' : 'uses'}
              </span>
            </div>
            {tag.description && (
              <p className="text-ancient-gold/60 text-sm mb-3 font-order line-clamp-2">
                {tag.description}
              </p>
            )}
            <p className="text-ancient-gold/50 text-xs font-mono mb-4">{tag.slug}</p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 border-ancient-gold/30 hover:bg-ancient-gold/10 text-ancient-gold/80 hover:text-ancient-gold"
                onClick={() => openEditDialog(tag)}
              >
                <Edit size={16} className="mr-1" />
                <span className="font-order uppercase text-xs tracking-wider">Edit</span>
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="flex-1 bg-vita-flame/10 border-vita-flame/30 hover:bg-vita-flame/20 text-vita-flame"
                onClick={() => handleDelete(tag.id)}
              >
                <Trash2 size={16} className="mr-1" />
                <span className="font-order uppercase text-xs tracking-wider">Delete</span>
              </Button>
            </div>
          </div>
        ))}
      </div>

      {tags.length === 0 && (
        <div className="text-center py-12 bg-[#0A0404] rounded-lg border border-ancient-gold/20">
          <TagIcon size={48} className="mx-auto mb-4 text-ancient-gold/40" />
          <p className="text-ancient-gold/60 font-order tracking-wide">No tags yet. Create your first tag!</p>
        </div>
      )}
    </div>
  );
};

export default Tags;
