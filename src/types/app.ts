export interface App {
  id: string;
  name: string;
  icon: string;
  primary_link: string;
  fallback_link?: string;
  category: string;
  tags: string[];
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CompanySettings {
  id?: string;
  name: string;
  logo?: string;
  updated_at?: string;
}

export interface QuickLink {
  id: string;
  name: string;
  url: string;
  category: string;
  created_at?: string;
  updated_at?: string;
}

