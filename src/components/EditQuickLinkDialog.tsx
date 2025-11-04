import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QuickLink } from "@/types/app";
import { toast } from "sonner";

interface EditQuickLinkDialogProps {
  link: QuickLink | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEditLink: (id: string, link: Omit<QuickLink, "id">) => void;
}

export const EditQuickLinkDialog = ({ link, open, onOpenChange, onEditLink }: EditQuickLinkDialogProps) => {
  const [formData, setFormData] = useState({
    name: "",
    url: "",
    category: "General",
  });

  useEffect(() => {
    if (link) {
      setFormData({
        name: link.name,
        url: link.url,
        category: link.category,
      });
    }
  }, [link]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.url) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!link) return;

    onEditLink(link.id, {
      name: formData.name,
      url: formData.url,
      category: formData.category,
    });

    onOpenChange(false);
    toast.success("Quick link updated successfully!");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-border/50 bg-card/95 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Edit Quick Link</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-link-name">
              Link Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="edit-link-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Team Drive"
              className="bg-background/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-link-url">
              URL <span className="text-destructive">*</span>
            </Label>
            <Input
              id="edit-link-url"
              type="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="https://docs.google.com/spreadsheets/..."
              className="bg-background/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-link-category">Category</Label>
            <Input
              id="edit-link-category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="e.g., Docs, Sheets, Drive"
              className="bg-background/50"
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
