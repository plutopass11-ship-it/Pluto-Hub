export interface App {
  id: string;
  name: string;
  icon: string;
  primaryLink: string;
  fallbackLink?: string;
  category: string;
  tags: string[];
  description?: string;
}

export interface QuickLink {
  id: string;
  name: string;
  url: string;
  category: string;
}

export interface CompanySettings {
  name: string;
  logo?: string;
}
