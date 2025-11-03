import { useState, useMemo } from "react";
import { App, CompanySettings as CompanySettingsType } from "@/types/app";
import { Header } from "@/components/Header";
import { AppCard } from "@/components/AppCard";
import { AddAppDialog } from "@/components/AddAppDialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

const INITIAL_APPS: App[] = [
  {
    id: "1",
    name: "Portainer",
    icon: "🐳",
    primaryLink: "https://portainer.io",
    category: "DevOps",
    tags: ["docker", "containers"],
    description: "Container management platform",
  },
  {
    id: "2",
    name: "Grafana",
    icon: "📊",
    primaryLink: "https://grafana.com",
    category: "Monitoring",
    tags: ["analytics", "dashboards"],
    description: "Observability and monitoring",
  },
  {
    id: "3",
    name: "Jenkins",
    icon: "🔧",
    primaryLink: "https://jenkins.io",
    category: "CI/CD",
    tags: ["automation", "builds"],
    description: "Continuous integration server",
  },
];

const Index = () => {
  const [apps, setApps] = useState<App[]>(INITIAL_APPS);
  const [companySettings, setCompanySettings] = useState<CompanySettingsType>({
    name: "Flying Pluto",
    logo: "🪐",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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

  const handleDeleteApp = (id: string) => {
    setApps(apps.filter((app) => app.id !== id));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header settings={companySettings} onUpdateSettings={setCompanySettings} />

      <main className="container mx-auto px-6 py-8">
        <div className="mb-8 space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Pluto Hub</h2>
              <p className="text-muted-foreground">Access all your self-hosted applications</p>
            </div>
            <AddAppDialog onAddApp={handleAddApp} />
          </div>

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

          <div className="flex flex-wrap gap-2">
            <Badge
              variant={selectedCategory === null ? "default" : "outline"}
              className="cursor-pointer transition-all hover:scale-105"
              onClick={() => setSelectedCategory(null)}
            >
              All Apps ({apps.length})
            </Badge>
            {categories.map((category) => (
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
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredApps.map((app) => (
              <AppCard key={app.id} app={app} onDelete={handleDeleteApp} />
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-border/50 bg-card/30 backdrop-blur-xl mt-16">
        <div className="container mx-auto px-6 py-6 text-center text-sm text-muted-foreground">
          <p>
            Powered by {companySettings.logo} {companySettings.name} • Pluto Hub v1.0
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
