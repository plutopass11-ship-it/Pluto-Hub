import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { QuickLink } from "@/types/app";
import { toast } from "sonner";

interface AddQuickLinkDialogProps {
  onAddLink: (link: Omit<QuickLink, "id">) => void;
}

export const AddQuickLinkDialog = ({ onAddLink }: AddQuickLinkDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    url: "",
    category: "General",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.url) {
      toast.error("Please fill in all required fields");
      return;
    }

    onAddLink({
      name: formData.name,
      url: formData.url,
      category: formData.category,
    });

    setFormData({
      name: "",
      url: "",
      category: "General",
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg">
          <Plus className="h-4 w-4" />
          Add Quick Link
        </Button>
      </DialogTrigger>
      <DialogContent className="border-border/50 bg-card/95 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Add Quick Link</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="link-name">
              Link Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="link-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Team Drive"
              className="bg-background/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="link-url">
              URL <span className="text-destructive">*</span>
            </Label>
            <Input
              id="link-url"
              type="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="https://docs.google.com/spreadsheets/..."
              className="bg-background/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="link-category">Category</Label>
            <Input
              id="link-category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="e.g., Docs, Sheets, Drive"
              className="bg-background/50"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              Add Link
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
