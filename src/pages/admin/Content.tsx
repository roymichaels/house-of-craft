import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import BrandedLoader from '@/components/ui/BrandedLoader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, FileText } from 'lucide-react';

interface ContentBlock {
  id: string;
  slug: string;
  title: string;
  content_type: string;
  body: string | null;
  excerpt: string | null;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
}

const Content = () => {
  const [content, setContent] = useState<ContentBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<ContentBlock | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content_type: 'page',
    body: '',
    excerpt: '',
    is_published: false,
  });

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const { data, error } = await supabase
        .from('content_blocks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContent(data || []);
    } catch (error) {
      console.error('Error loading content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const contentData = {
        title: formData.title,
        slug: formData.slug,
        content_type: formData.content_type,
        body: formData.body || null,
        excerpt: formData.excerpt || null,
        is_published: formData.is_published,
        published_at: formData.is_published ? new Date().toISOString() : null,
      };

      if (editingContent) {
        const { error } = await supabase
          .from('content_blocks')
          .update(contentData)
          .eq('id', editingContent.id);

        if (error) throw error;
        toast({ title: 'Content updated successfully' });
      } else {
        const { error } = await supabase
          .from('content_blocks')
          .insert(contentData);

        if (error) throw error;
        toast({ title: 'Content created successfully' });
      }

      setIsDialogOpen(false);
      resetForm();
      loadContent();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this content?')) return;

    try {
      const { error } = await supabase
        .from('content_blocks')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: 'Content deleted successfully' });
      loadContent();
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
      title: '',
      slug: '',
      content_type: 'page',
      body: '',
      excerpt: '',
      is_published: false,
    });
    setEditingContent(null);
  };

  const openEditDialog = (item: ContentBlock) => {
    setEditingContent(item);
    setFormData({
      title: item.title,
      slug: item.slug,
      content_type: item.content_type,
      body: item.body || '',
      excerpt: item.excerpt || '',
      is_published: item.is_published,
    });
    setIsDialogOpen(true);
  };

  const getContentTypeLabel = (type: string) => {
    switch (type) {
      case 'page':
        return 'Page';
      case 'journal':
        return 'Journal';
      case 'philosophy':
        return 'Philosophy';
      case 'mission':
        return 'Mission';
      default:
        return type;
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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-ancient text-4xl text-ancient-gold tracking-wider mb-2">Content</h1>
          <p className="text-ancient-gold/60 font-order tracking-wide">Manage philosophy, mission, and journal</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={resetForm}
              className="bg-ancient-gold/10 border border-ancient-gold/30 hover:bg-ancient-gold/20 text-ancient-gold"
            >
              <Plus size={20} className="mr-2" />
              <span className="font-order uppercase tracking-wide">Add Content</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-[#0A0404] border-ancient-gold/30">
            <DialogHeader>
              <DialogTitle className="font-ancient text-2xl text-ancient-gold tracking-wider">
                {editingContent ? 'Edit Content' : 'Add New Content'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title" className="text-ancient-gold/80">Title*</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
              </div>
              <div>
                <Label htmlFor="content_type" className="text-ancient-gold/80">Content Type*</Label>
                <Select value={formData.content_type} onValueChange={(value) => setFormData({ ...formData, content_type: value })}>
                  <SelectTrigger className="bg-ancient-gold/5 border-ancient-gold/20 text-ancient-gold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0A0404] border-ancient-gold/30">
                    <SelectItem value="page">Page</SelectItem>
                    <SelectItem value="journal">Journal</SelectItem>
                    <SelectItem value="philosophy">Philosophy</SelectItem>
                    <SelectItem value="mission">Mission</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="excerpt" className="text-ancient-gold/80">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  rows={2}
                  className="bg-ancient-gold/5 border-ancient-gold/20 text-ancient-gold"
                />
              </div>
              <div>
                <Label htmlFor="body" className="text-ancient-gold/80">Body*</Label>
                <Textarea
                  id="body"
                  value={formData.body}
                  onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                  rows={10}
                  required
                  className="bg-ancient-gold/5 border-ancient-gold/20 text-ancient-gold font-mono text-sm"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_published"
                  checked={formData.is_published}
                  onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                  className="w-4 h-4"
                />
                <Label htmlFor="is_published" className="text-ancient-gold/80">Publish</Label>
              </div>
              <Button
                type="submit"
                className="w-full bg-ancient-gold/10 border border-ancient-gold/30 hover:bg-ancient-gold/20 text-ancient-gold font-order uppercase tracking-wider"
              >
                {editingContent ? 'Confirm Changes' : 'Confirm Command'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {content.map((item) => (
          <div key={item.id} className="bg-[#0A0404] rounded-lg border border-ancient-gold/20 hover:border-ancient-gold/40 p-6 transition-all">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <FileText size={20} className="text-ancient-gold/60" />
                  <h3 className="font-ancient text-xl text-ancient-gold tracking-wide">{item.title}</h3>
                  <span className="px-2 py-1 text-xs rounded font-order uppercase tracking-wider bg-imperial-bronze/20 text-imperial-bronze border border-imperial-bronze/40">
                    {getContentTypeLabel(item.content_type)}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded font-order uppercase tracking-wider ${
                    item.is_published
                      ? 'bg-laurel-green/20 text-laurel-green border border-laurel-green/40'
                      : 'bg-ancient-gold/10 text-ancient-gold/60 border border-ancient-gold/20'
                  }`}>
                    {item.is_published ? 'Published' : 'Draft'}
                  </span>
                </div>
                {item.excerpt && (
                  <p className="text-ancient-gold/60 text-sm mb-2 font-order line-clamp-2">
                    {item.excerpt}
                  </p>
                )}
                <p className="text-ancient-gold/50 text-xs font-order">
                  Slug: /{item.slug}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-ancient-gold/30 hover:bg-ancient-gold/10 text-ancient-gold/80 hover:text-ancient-gold"
                  onClick={() => openEditDialog(item)}
                >
                  <Edit size={16} className="mr-1" />
                  <span className="font-order uppercase text-xs tracking-wider">Edit</span>
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="bg-vita-flame/10 border-vita-flame/30 hover:bg-vita-flame/20 text-vita-flame"
                  onClick={() => handleDelete(item.id)}
                >
                  <Trash2 size={16} className="mr-1" />
                  <span className="font-order uppercase text-xs tracking-wider">Delete</span>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {content.length === 0 && (
        <div className="text-center py-12 bg-[#0A0404] rounded-lg border border-ancient-gold/20">
          <FileText size={48} className="mx-auto mb-4 text-ancient-gold/40" />
          <p className="text-ancient-gold/60 font-order tracking-wide">No content yet. Create your first piece!</p>
        </div>
      )}
    </div>
  );
};

export default Content;
