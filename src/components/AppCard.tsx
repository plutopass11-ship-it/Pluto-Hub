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
    <Card className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:shadow-card hover:glow-primary cursor-pointer">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2 z-10 h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-destructive/20 hover:text-destructive"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(app.id);
        }}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>

      <div className="relative p-6 flex flex-col items-center text-center" onClick={handleAppClick}>
        <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-cosmic shadow-lg transition-transform duration-300 group-hover:scale-110 overflow-hidden">
          <img 
            src={app.icon} 
            alt={app.name}
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>';
            }}
          />
        </div>

        <div className="space-y-2 w-full">
          <h3 className="font-semibold text-base text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {app.name}
          </h3>
          
          <Badge variant="secondary" className="text-xs">
            {app.category}
          </Badge>

          {app.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 mt-2">{app.description}</p>
          )}

          {app.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 justify-center pt-1">
              {app.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs border-primary/30">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
