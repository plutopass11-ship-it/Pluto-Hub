import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings } from "lucide-react";
import { CompanySettings as CompanySettingsType } from "@/types/app";
import { toast } from "sonner";

interface CompanySettingsProps {
  settings: CompanySettingsType;
  onUpdate: (settings: CompanySettingsType) => void;
}

export const CompanySettings = ({ settings, onUpdate }: CompanySettingsProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(settings);
  const [logoPreview, setLogoPreview] = useState<string>(settings.logo || "");

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
    setOpen(false);
    toast.success("Company settings updated!");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="border-border/50 hover:border-primary/50 transition-colors">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="border-border/50 bg-card/95 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Company Settings</DialogTitle>
        </DialogHeader>
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
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-cosmic hover:opacity-90 transition-opacity">
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
