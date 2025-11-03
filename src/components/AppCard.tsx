import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, ExternalLink } from "lucide-react";
import { App } from "@/types/app";
import { useState } from "react";
import { toast } from "sonner";

interface AppCardProps {
  app: App;
  onDelete: (id: string) => void;
}

export const AppCard = ({ app, onDelete }: AppCardProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleAppClick = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(app.primaryLink, { method: "HEAD", mode: "no-cors" });
      window.open(app.primaryLink, "_blank");
    } catch (error) {
      if (app.fallbackLink) {
        toast.info("Primary link unavailable, trying fallback...");
        window.open(app.fallbackLink, "_blank");
      } else {
        toast.error("Application is currently unavailable");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:shadow-card hover:glow-primary">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      
      <div className="relative p-6">
        <div className="mb-4 flex items-start justify-between">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-cosmic text-2xl shadow-lg transition-transform duration-300 group-hover:scale-110 cursor-pointer"
            onClick={handleAppClick}
          >
            {app.icon}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-destructive/20 hover:text-destructive"
            onClick={() => onDelete(app.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors cursor-pointer" onClick={handleAppClick}>
            {app.name}
          </h3>
          {app.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">{app.description}</p>
          )}
          
          <div className="flex items-center gap-2 pt-2">
            <Badge variant="secondary" className="text-xs">
              {app.category}
            </Badge>
          </div>

          {app.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {app.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs border-primary/30">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="mt-4 w-full justify-start gap-2 opacity-0 transition-opacity group-hover:opacity-100"
          onClick={handleAppClick}
          disabled={isLoading}
        >
          <ExternalLink className="h-3.5 w-3.5" />
          <span className="text-xs">Open Application</span>
        </Button>
      </div>
    </Card>
  );
};
