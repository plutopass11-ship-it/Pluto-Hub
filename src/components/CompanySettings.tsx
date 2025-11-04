import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Trash2, Pencil, Plus } from "lucide-react";
import { CompanySettings as CompanySettingsType, App } from "@/types/app";
import { toast } from "sonner";
import { AddAppDialog } from "./AddAppDialog";
import { EditAppDialog } from "./EditAppDialog";

interface CompanySettingsProps {
  settings: CompanySettingsType;
  onUpdate: (settings: CompanySettingsType) => void;
  apps: App[];
  onAddApp: (app: Omit<App, "id">) => void;
  onEditApp: (id: string, app: Omit<App, "id">) => void;
  onDeleteApp: (id: string) => void;
}

export const CompanySettings = ({ settings, onUpdate, apps, onAddApp, onEditApp, onDeleteApp }: CompanySettingsProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(settings);
  const [logoPreview, setLogoPreview] = useState<string>(settings.logo || "");
  const [editingApp, setEditingApp] = useState<App | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setLogoPreview(result);
        setFormData({ ...formData, logo: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
    toast.success("Company settings updated!");
  };

  const handleEditClick = (app: App) => {
    setEditingApp(app);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    if (window.confirm("Are you sure you want to delete this application?")) {
      onDeleteApp(id);
      toast.success("Application deleted successfully!");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="border-border/50 hover:border-primary/50 transition-colors">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl border-border/50 bg-card/95 backdrop-blur-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Settings</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="company" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="company">Company Info</TabsTrigger>
            <TabsTrigger value="apps">Manage Applications</TabsTrigger>
          </TabsList>

          <TabsContent value="company" className="space-y-4 mt-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your Company Name"
                  className="bg-background/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyLogo">Company Logo (512x512)</Label>
                <div className="flex items-center gap-3">
                  {logoPreview && (
                    <div className="h-16 w-16 rounded-lg overflow-hidden border-2 border-primary/30">
                      <img src={logoPreview} alt="Logo preview" className="h-full w-full object-cover" />
                    </div>
                  )}
                  <Input
                    id="companyLogo"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="bg-background/50"
                  />
                </div>
                <p className="text-xs text-muted-foreground">Recommended: 512x512px, max 5MB</p>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="submit" className="bg-gradient-cosmic hover:opacity-90 transition-opacity">
                  Save Changes
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="apps" className="space-y-4 mt-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">All Applications ({apps.length})</h3>
              <AddAppDialog onAddApp={onAddApp} />
            </div>

            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {apps.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p>No applications yet. Add your first one!</p>
                </div>
              ) : (
                apps.map((app) => (
                  <div
                    key={app.id}
                    className="flex items-center gap-4 p-4 rounded-lg border border-border/50 bg-card/30 hover:bg-card/50 transition-colors"
                  >
                    <div className="h-12 w-12 rounded-lg overflow-hidden border-2 border-primary/30 flex-shrink-0">
                      {app.icon ? (
                        <img src={app.icon} alt={app.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full bg-primary/5 flex items-center justify-center">
                          <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-foreground truncate">{app.name}</h4>
                      <p className="text-sm text-muted-foreground truncate">{app.primaryLink}</p>
                    </div>

                    <div className="flex gap-2 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-primary/10 text-primary"
                        onClick={() => handleEditClick(app)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDeleteClick(app.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
      
      <EditAppDialog
        app={editingApp}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onEditApp={onEditApp}
      />
    </Dialog>
  );
};
