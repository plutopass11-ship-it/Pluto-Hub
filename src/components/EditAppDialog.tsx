import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { App } from "@/types/app";
import { toast } from "sonner";
import { uploadImageToStorage } from "@/utils/uploadToStorage";

interface EditAppDialogProps {
  app: App | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEditApp: (id: string, app: Omit<App, "id">) => void;
}

export const EditAppDialog = ({ app, open, onOpenChange, onEditApp }: EditAppDialogProps) => {
  const [formData, setFormData] = useState({
    name: "",
    icon: "",
    primary_link: "",
    fallback_link: "",
    category: "DevOps",
    tags: "",
    description: "",
  });
  const [iconPreview, setIconPreview] = useState<string>("");
  const [iconFile, setIconFile] = useState<File | null>(null);

  useEffect(() => {
    if (app) {
      setFormData({
        name: app.name,
        icon: app.icon,
        primary_link: app.primary_link,
        fallback_link: app.fallback_link || "",
        category: app.category,
        tags: app.tags.join(", "),
        description: app.description || "",
      });
      setIconPreview(app.icon);
    }
  }, [app]);

  const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be less than 5MB");
        return;
      }
      setIconFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setIconPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.primary_link || !formData.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!app) return;

    try {
      let iconUrl = formData.icon;
      if (iconFile) {
        iconUrl = await uploadImageToStorage(iconFile, "icons");
      }

      onEditApp(app.id, {
        name: formData.name,
        icon: iconUrl,
        primary_link: formData.primary_link,
        fallback_link: formData.fallback_link || undefined,
        category: formData.category,
        tags: formData.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
        description: formData.description || undefined,
      });

      setIconFile(null);
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to upload icon");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl border-border/50 bg-card/95 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Edit Application</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">
                Application Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Portainer"
                className="bg-background/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-icon">
                App Icon (512x512) (Optional)
              </Label>
              <div className="flex items-center gap-3">
                {iconPreview && (
                  <div className="h-16 w-16 rounded-lg overflow-hidden border-2 border-primary/30">
                    <img src={iconPreview} alt="Icon preview" className="h-full w-full object-cover" />
                  </div>
                )}
                <Input
                  id="edit-icon"
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
            <Label htmlFor="edit-primaryLink">
              Primary Link <span className="text-destructive">*</span>
            </Label>
            <Input
              id="edit-primaryLink"
              type="url"
              value={formData.primary_link}
              onChange={(e) => setFormData({ ...formData, primary_link: e.target.value })}
              placeholder="https://app.example.com"
              className="bg-background/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-fallbackLink">Fallback Link (Optional)</Label>
            <Input
              id="edit-fallbackLink"
              type="url"
              value={formData.fallback_link}
              onChange={(e) => setFormData({ ...formData, fallback_link: e.target.value })}
              placeholder="https://backup.example.com"
              className="bg-background/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-category">
                Category <span className="text-destructive">*</span>
              </Label>
              <select
                id="edit-category"
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
              <Label htmlFor="edit-tags">Tags (comma-separated)</Label>
              <Input
                id="edit-tags"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="docker, containers, monitoring"
                className="bg-background/50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Description (Optional)</Label>
            <Textarea
              id="edit-description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of the application..."
              className="bg-background/50 resize-none"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
