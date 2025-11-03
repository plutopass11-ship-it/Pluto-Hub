import { CompanySettings as CompanySettingsType } from "@/types/app";
import { CompanySettings } from "./CompanySettings";

interface HeaderProps {
  settings: CompanySettingsType;
  onUpdateSettings: (settings: CompanySettingsType) => void;
}

export const Header = ({ settings, onUpdateSettings }: HeaderProps) => {
  return (
    <header className="border-b border-border/50 bg-card/30 backdrop-blur-xl">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          {settings.logo && (
            <div className="text-3xl animate-float">{settings.logo}</div>
          )}
          <div>
            <h1 className="text-2xl font-bold bg-gradient-stellar bg-clip-text text-transparent">
              {settings.name}
            </h1>
            <p className="text-sm text-muted-foreground">Application Hub</p>
          </div>
        </div>
        <CompanySettings settings={settings} onUpdate={onUpdateSettings} />
      </div>
    </header>
  );
};
