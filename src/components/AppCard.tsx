import { Card, CardContent } from "@/components/ui/card";
import { App } from "@/types/app";
import { useState } from "react";
import { toast } from "sonner";

interface AppCardProps {
  app: App;
}

export const AppCard = ({ app }: AppCardProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleAppClick = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(app.primary_link, { method: "HEAD", mode: "no-cors" });
      window.open(app.primary_link, "_blank");
    } catch (error) {
      if (app.fallback_link) {
        toast.info("Primary link unavailable, trying fallback...");
        window.open(app.fallback_link, "_blank");
      } else {
        toast.error("Application is currently unavailable");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card 
      className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 cursor-pointer animate-fade-in"
      onClick={handleAppClick}
    >
      <CardContent className="p-6 flex flex-col items-center gap-3">
        <div className="flex items-center justify-center">
          {app.icon ? (
            <div className="h-20 w-20 rounded-xl overflow-hidden border-2 border-primary/30 shadow-lg">
              <img 
                src={app.icon} 
                alt={app.name} 
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.innerHTML = `
                    <svg class="h-full w-full p-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  `;
                }}
              />
            </div>
          ) : (
            <div className="h-20 w-20 rounded-xl border-2 border-primary/30 flex items-center justify-center bg-primary/5">
              <svg className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
          )}
        </div>
        <h3 className="text-center text-base font-semibold text-foreground line-clamp-2">
          {app.name}
        </h3>
      </CardContent>
    </Card>
  );
};
