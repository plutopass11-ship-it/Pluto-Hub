import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { App } from "@/types/app";
import { toast } from "sonner";

interface AddAppDialogProps {
  onAddApp: (app: Omit<App, "id">) => void;
}

export const AddAppDialog = ({ onAddApp }: AddAppDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    icon: "",
    primaryLink: "",
    fallbackLink: "",
    category: "DevOps",
    tags: "",
    description: "",
  });
  const [iconPreview, setIconPreview] = useState<string>("");

  const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setIconPreview(result);
        setFormData({ ...formData, icon: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.primaryLink || !formData.category || !formData.icon) {
      toast.error("Please fill in all required fields");
      return;
    }

    onAddApp({
      name: formData.name,
      icon: formData.icon,
      primaryLink: formData.primaryLink,
      fallbackLink: formData.fallbackLink || undefined,
      category: formData.category,
      tags: formData.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      description: formData.description || undefined,
    });

    setFormData({
      name: "",
      icon: "",
      primaryLink: "",
      fallbackLink: "",
      category: "DevOps",
      tags: "",
      description: "",
    });
    setIconPreview("");
    setOpen(false);
    toast.success("Application added successfully!");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-gradient-cosmic hover:opacity-90 transition-opacity shadow-lg glow-primary">
          <Plus className="h-4 w-4" />
          Add Application
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl border-border/50 bg-card/95 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Add New Application</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                Application Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Portainer"
                className="bg-background/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="icon">
                App Icon (512x512) <span className="text-destructive">*</span>
              </Label>
              <div className="flex items-center gap-3">
                {iconPreview && (
                  <div className="h-16 w-16 rounded-lg overflow-hidden border-2 border-primary/30">
                    <img src={iconPreview} alt="Icon preview" className="h-full w-full object-cover" />
                  </div>
                )}
                <Input
                  id="icon"
                  type="file"
                  accept="image/*"
                  onChange={handleIconUpload}
                  className="bg-background/50"
                />
              </div>
              <p className="text-xs text-muted-foreground">Recommended: 512x512px, max 5MB</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="primaryLink">
              Primary Link <span className="text-destructive">*</span>
            </Label>
            <Input
              id="primaryLink"
              type="url"
              value={formData.primaryLink}
              onChange={(e) => setFormData({ ...formData, primaryLink: e.target.value })}
              placeholder="https://app.example.com"
              className="bg-background/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fallbackLink">Fallback Link (Optional)</Label>
            <Input
              id="fallbackLink"
              type="url"
              value={formData.fallbackLink}
              onChange={(e) => setFormData({ ...formData, fallbackLink: e.target.value })}
              placeholder="https://backup.example.com"
              className="bg-background/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">
                Category <span className="text-destructive">*</span>
              </Label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="DevOps">DevOps</option>
                <option value="Dashboards">Dashboards</option>
                <option value="Monitoring">Monitoring</option>
                <option value="Management">Management</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="docker, containers, monitoring"
                className="bg-background/50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of the application..."
              className="bg-background/50 resize-none"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-cosmic hover:opacity-90 transition-opacity">
              Add Application
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
