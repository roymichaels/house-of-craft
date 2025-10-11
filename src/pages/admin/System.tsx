import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import BrandedLoader from '@/components/ui/BrandedLoader';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Shield, FileText, Database, Activity } from 'lucide-react';
import { format } from 'date-fns';

interface AuditLog {
  id: string;
  user_email: string | null;
  action: string;
  table_name: string;
  record_id: string | null;
  old_values: any;
  new_values: any;
  created_at: string;
}

const System = () => {
  const { isSuperadmin } = useAuth();
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTable, setFilterTable] = useState<string>('all');
  const [filterAction, setFilterAction] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!isSuperadmin) return;
    loadAuditLogs();
  }, [isSuperadmin]);

  const loadAuditLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setAuditLogs(data || []);
    } catch (error) {
      console.error('Error loading audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = auditLogs.filter((log) => {
    const matchesTable = filterTable === 'all' || log.table_name === filterTable;
    const matchesAction = filterAction === 'all' || log.action === filterAction;
    const matchesSearch =
      !searchQuery ||
      log.user_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.table_name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTable && matchesAction && matchesSearch;
  });

  const getActionColor = (action: string) => {
    switch (action.toUpperCase()) {
      case 'INSERT':
        return 'text-laurel-green';
      case 'UPDATE':
        return 'text-ancient-gold';
      case 'DELETE':
        return 'text-vita-flame';
      default:
        return 'text-ancient-gold/60';
    }
  };

  const getActionBadge = (action: string) => {
    switch (action.toUpperCase()) {
      case 'INSERT':
        return 'bg-laurel-green/20 text-laurel-green border-laurel-green/40';
      case 'UPDATE':
        return 'bg-ancient-gold/20 text-ancient-gold border-ancient-gold/40';
      case 'DELETE':
        return 'bg-vita-flame/20 text-vita-flame border-vita-flame/40';
      default:
        return 'bg-ancient-gold/10 text-ancient-gold/60 border-ancient-gold/20';
    }
  };

  if (!isSuperadmin) {
    return (
      <div className="text-center py-12">
        <Shield size={48} className="mx-auto mb-4 text-ancient-gold/40" />
        <p className="text-ancient-gold/60 font-order tracking-wide">
          Superadmin access required
        </p>
      </div>
    );
  }

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
        <h1 className="font-ancient text-4xl text-ancient-gold tracking-wider mb-2">System</h1>
        <p className="text-ancient-gold/60 font-order tracking-wide">
          System logs and administration
        </p>
      </div>

      <Tabs defaultValue="audit" className="space-y-6">
        <TabsList className="bg-[#0A0404] border border-ancient-gold/20">
          <TabsTrigger
            value="audit"
            className="data-[state=active]:bg-ancient-gold/10 data-[state=active]:text-ancient-gold font-order uppercase tracking-wider"
          >
            <Activity size={16} className="mr-2" />
            Audit Logs
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className="data-[state=active]:bg-ancient-gold/10 data-[state=active]:text-ancient-gold font-order uppercase tracking-wider"
          >
            <Database size={16} className="mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="audit" className="space-y-4">
          <Card className="bg-[#0A0404] border-ancient-gold/20 p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="text-ancient-gold/80 text-sm font-order uppercase tracking-wider mb-2 block">
                  Search
                </label>
                <Input
                  placeholder="Search logs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-ancient-gold/5 border-ancient-gold/20 text-ancient-gold"
                />
              </div>
              <div>
                <label className="text-ancient-gold/80 text-sm font-order uppercase tracking-wider mb-2 block">
                  Filter by Table
                </label>
                <Select value={filterTable} onValueChange={setFilterTable}>
                  <SelectTrigger className="bg-ancient-gold/5 border-ancient-gold/20 text-ancient-gold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0A0404] border-ancient-gold/30">
                    <SelectItem value="all">All Tables</SelectItem>
                    <SelectItem value="products">Products</SelectItem>
                    <SelectItem value="orders">Orders</SelectItem>
                    <SelectItem value="profiles">Profiles</SelectItem>
                    <SelectItem value="content_blocks">Content</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-ancient-gold/80 text-sm font-order uppercase tracking-wider mb-2 block">
                  Filter by Action
                </label>
                <Select value={filterAction} onValueChange={setFilterAction}>
                  <SelectTrigger className="bg-ancient-gold/5 border-ancient-gold/20 text-ancient-gold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0A0404] border-ancient-gold/30">
                    <SelectItem value="all">All Actions</SelectItem>
                    <SelectItem value="INSERT">Insert</SelectItem>
                    <SelectItem value="UPDATE">Update</SelectItem>
                    <SelectItem value="DELETE">Delete</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-3">
                {filteredLogs.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText size={48} className="mx-auto mb-4 text-ancient-gold/40" />
                    <p className="text-ancient-gold/60 font-order tracking-wide">
                      No audit logs found
                    </p>
                  </div>
                ) : (
                  filteredLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-4 bg-ancient-gold/5 rounded-lg border border-ancient-gold/20 hover:border-ancient-gold/40 transition-all"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-1 text-xs rounded font-order uppercase tracking-wider border ${getActionBadge(
                              log.action
                            )}`}
                          >
                            {log.action}
                          </span>
                          <span className="text-imperial-bronze/80 text-xs font-order uppercase tracking-wider px-2 py-1 bg-imperial-bronze/10 rounded border border-imperial-bronze/30">
                            {log.table_name}
                          </span>
                        </div>
                        <span className="text-ancient-gold/50 text-xs font-order">
                          {format(new Date(log.created_at), 'PPp')}
                        </span>
                      </div>
                      <div className="text-sm space-y-1">
                        {log.user_email && (
                          <p className="text-ancient-gold/80 font-order">
                            <span className="text-ancient-gold/60">User: </span>
                            {log.user_email}
                          </p>
                        )}
                        {log.record_id && (
                          <p className="text-ancient-gold/60 text-xs font-mono">
                            Record: {log.record_id.slice(0, 8)}...
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card className="bg-[#0A0404] border-ancient-gold/20 p-6">
            <h3 className="font-ancient text-2xl text-ancient-gold tracking-wider mb-4">
              System Settings
            </h3>
            <p className="text-ancient-gold/60 font-order tracking-wide">
              System configuration and settings coming soon...
            </p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default System;
