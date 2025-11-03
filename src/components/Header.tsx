import { CompanySettings as CompanySettingsType } from "@/types/app";
import { CompanySettings } from "./CompanySettings";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface HeaderProps {
  settings: CompanySettingsType;
  onUpdateSettings: (settings: CompanySettingsType) => void;
}

export const Header = ({ settings, onUpdateSettings }: HeaderProps) => {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="border-b border-border/50 bg-card/30 backdrop-blur-xl">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          {settings.logo && (
            <div className="h-12 w-12 rounded-lg overflow-hidden animate-float">
              <img src={settings.logo} alt={settings.name} className="h-full w-full object-cover" />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold bg-gradient-stellar bg-clip-text text-transparent">
              {settings.name}
            </h1>
            <p className="text-sm text-muted-foreground">Application Hub</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className="border-border/50 hover:border-primary/50 transition-colors"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <CompanySettings settings={settings} onUpdate={onUpdateSettings} />
        </div>
      </div>
    </header>
  );
};
