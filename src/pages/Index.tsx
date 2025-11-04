import { useState, useMemo, useEffect } from "react";
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

const Index = () => {
  const [apps, setApps] = useState<App[]>([]);
  const [quickLinks, setQuickLinks] = useState<QuickLink[]>([]);
  const [companySettings, setCompanySettings] = useState<CompanySettingsType>({
    name: "Flying Pluto",
    logo: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [editingApp, setEditingApp] = useState<App | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("apps");

  // Load data from localStorage
  useEffect(() => {
    const savedApps = localStorage.getItem("pluto-hub-apps");
    const savedLinks = localStorage.getItem("pluto-hub-quick-links");
    const savedSettings = localStorage.getItem("pluto-hub-settings");

    if (savedApps) {
      setApps(JSON.parse(savedApps));
    }
    if (savedLinks) {
      setQuickLinks(JSON.parse(savedLinks));
    }
    if (savedSettings) {
      setCompanySettings(JSON.parse(savedSettings));
    }
  }, []);

  // Save apps to localStorage
  useEffect(() => {
    localStorage.setItem("pluto-hub-apps", JSON.stringify(apps));
  }, [apps]);

  // Save quick links to localStorage
  useEffect(() => {
    localStorage.setItem("pluto-hub-quick-links", JSON.stringify(quickLinks));
  }, [quickLinks]);

  // Save company settings to localStorage
  useEffect(() => {
    localStorage.setItem("pluto-hub-settings", JSON.stringify(companySettings));
  }, [companySettings]);

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

  const handleAddApp = (newApp: Omit<App, "id">) => {
    setApps([...apps, { ...newApp, id: Date.now().toString() }]);
  };

  const handleEditApp = (id: string, updatedApp: Omit<App, "id">) => {
    setApps(apps.map((app) => (app.id === id ? { ...updatedApp, id } : app)));
  };

  const handleDeleteApp = (id: string) => {
    setApps(apps.filter((app) => app.id !== id));
  };

  const handleEditClick = (app: App) => {
    setEditingApp(app);
    setEditDialogOpen(true);
  };

  const handleAddQuickLink = (newLink: Omit<QuickLink, "id">) => {
    setQuickLinks([...quickLinks, { ...newLink, id: Date.now().toString() }]);
  };

  const handleEditQuickLink = (id: string, updatedLink: Omit<QuickLink, "id">) => {
    setQuickLinks(quickLinks.map((link) => (link.id === id ? { ...updatedLink, id } : link)));
  };

  const handleDeleteQuickLink = (id: string) => {
    setQuickLinks(quickLinks.filter((link) => link.id !== id));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header settings={companySettings} onUpdateSettings={setCompanySettings} />

      <main className="container mx-auto px-6 py-8 flex-1">
        <div className="mb-8 space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Pluto Hub</h2>
              <p className="text-muted-foreground">Access all your applications and links</p>
            </div>
            <AddAppDialog onAddApp={handleAddApp} />
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
                        onDelete={handleDeleteApp}
                        onEdit={handleEditClick}
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
            Powered by {companySettings.name} • Pluto Hub v1.0
          </p>
        </div>
      </footer>

      <EditAppDialog
        app={editingApp}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onEditApp={handleEditApp}
      />
    </div>
  );
};

export default Index;
