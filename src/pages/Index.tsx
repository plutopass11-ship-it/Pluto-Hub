import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { App, CompanySettings as CompanySettingsType, QuickLink } from "@/types/app";
import { Header } from "@/components/Header";
import { AppCard } from "@/components/AppCard";
import { AddAppDialog } from "@/components/AddAppDialog";
import { EditAppDialog } from "@/components/EditAppDialog";
import { QuickLinksTab } from "@/components/QuickLinksTab";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Index = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [editingApp, setEditingApp] = useState<App | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("apps");

  // Fetch apps from database
  const { data: apps = [] } = useQuery({
    queryKey: ['apps'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('apps')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as App[];
    },
  });

  // Fetch quick links from database
  const { data: quickLinks = [] } = useQuery({
    queryKey: ['quick_links'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quick_links')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as QuickLink[];
    },
  });

  // Fetch company settings from database
  const { data: companySettings } = useQuery({
    queryKey: ['company_settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('company_settings')
        .select('*')
        .limit(1)
        .single();
      
      if (error) throw error;
      return data as CompanySettingsType;
    },
  });

  const categories = useMemo(() => {
    const cats = new Set(apps.map((app) => app.category));
    return Array.from(cats);
  }, [apps]);

  const filteredApps = useMemo(() => {
    return apps.filter((app) => {
      const matchesSearch =
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        app.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = !selectedCategory || app.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [apps, searchQuery, selectedCategory]);

  const addAppMutation = useMutation({
    mutationFn: async (newApp: Omit<App, "id">) => {
      const { data, error } = await supabase
        .from('apps')
        .insert([newApp])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apps'] });
      toast.success("Application added successfully");
    },
    onError: () => {
      toast.error("Failed to add application");
    },
  });

  const editAppMutation = useMutation({
    mutationFn: async ({ id, app }: { id: string; app: Omit<App, "id"> }) => {
      const { data, error } = await supabase
        .from('apps')
        .update(app)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apps'] });
      toast.success("Application updated successfully");
    },
    onError: () => {
      toast.error("Failed to update application");
    },
  });

  const deleteAppMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('apps')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apps'] });
      toast.success("Application deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete application");
    },
  });

  const addQuickLinkMutation = useMutation({
    mutationFn: async (newLink: Omit<QuickLink, "id">) => {
      const { data, error } = await supabase
        .from('quick_links')
        .insert([newLink])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quick_links'] });
      toast.success("Quick link added successfully");
    },
    onError: () => {
      toast.error("Failed to add quick link");
    },
  });

  const editQuickLinkMutation = useMutation({
    mutationFn: async ({ id, link }: { id: string; link: Omit<QuickLink, "id"> }) => {
      const { data, error } = await supabase
        .from('quick_links')
        .update(link)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quick_links'] });
      toast.success("Quick link updated successfully");
    },
    onError: () => {
      toast.error("Failed to update quick link");
    },
  });

  const deleteQuickLinkMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('quick_links')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quick_links'] });
      toast.success("Quick link deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete quick link");
    },
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (settings: CompanySettingsType) => {
      const { data, error } = await supabase
        .from('company_settings')
        .update({ name: settings.name, logo: settings.logo })
        .eq('id', companySettings?.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company_settings'] });
      toast.success("Settings updated successfully");
    },
    onError: () => {
      toast.error("Failed to update settings");
    },
  });

  const handleAddApp = (newApp: Omit<App, "id">) => {
    addAppMutation.mutate(newApp);
  };

  const handleEditApp = (id: string, updatedApp: Omit<App, "id">) => {
    editAppMutation.mutate({ id, app: updatedApp });
  };

  const handleDeleteApp = (id: string) => {
    deleteAppMutation.mutate(id);
  };

  const handleEditClick = (app: App) => {
    setEditingApp(app);
    setEditDialogOpen(true);
  };

  const handleAddQuickLink = (newLink: Omit<QuickLink, "id">) => {
    addQuickLinkMutation.mutate(newLink);
  };

  const handleEditQuickLink = (id: string, updatedLink: Omit<QuickLink, "id">) => {
    editQuickLinkMutation.mutate({ id, link: updatedLink });
  };

  const handleDeleteQuickLink = (id: string) => {
    deleteQuickLinkMutation.mutate(id);
  };

  const handleUpdateSettings = (settings: CompanySettingsType) => {
    updateSettingsMutation.mutate(settings);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header 
        settings={companySettings || { name: "Pluto Hub", logo: "" }} 
        onUpdateSettings={handleUpdateSettings}
        apps={apps}
        onAddApp={handleAddApp}
        onEditApp={handleEditApp}
        onDeleteApp={handleDeleteApp}
      />

      <main className="container mx-auto px-6 py-8 flex-1">
        <div className="mb-8 space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Pluto Hub</h2>
              <p className="text-muted-foreground">Access all your applications and links</p>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
              <TabsTrigger value="apps">Applications</TabsTrigger>
              <TabsTrigger value="links">Quick Links</TabsTrigger>
            </TabsList>

            <TabsContent value="apps" className="space-y-6 mt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search applications, tags, or categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-card/50 border-border/50 focus:border-primary/50 transition-colors"
                />
              </div>

              <div className="flex flex-wrap gap-2 justify-center">
                <Badge
                  variant={selectedCategory === null ? "default" : "outline"}
                  className="cursor-pointer transition-all hover:scale-105"
                  onClick={() => setSelectedCategory(null)}
                >
                  All Apps ({apps.length})
                </Badge>
                {["DevOps", "Dashboards", "Monitoring", "Management"].map((category) => (
                  <Badge
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    className="cursor-pointer transition-all hover:scale-105"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category} ({apps.filter((app) => app.category === category).length})
                  </Badge>
                ))}
              </div>

              {filteredApps.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="text-6xl mb-4 opacity-50">🚀</div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">No applications found</h3>
                  <p className="text-muted-foreground text-center max-w-md">
                    {searchQuery || selectedCategory
                      ? "Try adjusting your filters or search query"
                      : "Get started by adding your first application"}
                  </p>
                </div>
              ) : (
                <div className="flex justify-center">
                  <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 max-w-7xl">
                    {filteredApps.map((app) => (
                      <AppCard 
                        key={app.id} 
                        app={app} 
                      />
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="links" className="mt-6">
              <QuickLinksTab
                links={quickLinks}
                onAddLink={handleAddQuickLink}
                onEditLink={handleEditQuickLink}
                onDeleteLink={handleDeleteQuickLink}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <footer className="border-t border-border/50 bg-card/30 backdrop-blur-xl mt-auto">
        <div className="container mx-auto px-6 py-6 text-center text-sm text-muted-foreground">
          <p>
            Powered by {companySettings?.name || "Pluto Hub"} • Pluto Hub v1.0
          </p>
        </div>
      </footer>

    </div>
  );
};

export default Index;
