import { App, CompanySettings, QuickLink } from "@/types/app";

const STORAGE_KEYS = {
    APPS: "pluto_hub_apps",
    LINKS: "pluto_hub_links",
    SETTINGS: "pluto_hub_settings",
};

const INITIAL_APPS: App[] = [
    {
        id: "1",
        name: "Router Admin",
        description: "Main network gateway configuration",
        icon: "https://api.iconify.design/material-symbols:router.svg",
        primary_link: "http://192.168.1.1",
        category: "Management",
        tags: ["network", "admin"],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
    {
        id: "2",
        name: "File Server",
        description: "Network Attached Storage",
        icon: "https://api.iconify.design/material-symbols:folder-shared.svg",
        primary_link: "http://192.168.1.100",
        fallback_link: null,
        category: "Management",
        tags: ["storage", "files"],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
    {
        id: "3",
        name: "Local Web Server",
        description: "Development environment",
        icon: "https://api.iconify.design/material-symbols:dns.svg",
        primary_link: "http://localhost:8080",
        fallback_link: null,
        category: "DevOps",
        tags: ["dev", "web"],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
];

const INITIAL_LINKS: QuickLink[] = [
    {
        id: "1",
        name: "GitHub",
        url: "https://github.com",
        category: "DevOps",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
    {
        id: "2",
        name: "Documentation",
        url: "https://docs.google.com",
        category: "Management",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
];

const INITIAL_SETTINGS: CompanySettings = {
    id: "1",
    name: "Pluto Hub",
    logo: null,
    updated_at: new Date().toISOString(),
};

// API Helper functions
async function apiGet<T>(key: string): Promise<T | null> {
    try {
        const response = await fetch(`/api/storage/${key}`);
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error(`Error fetching ${key}:`, error);
        return null;
    }
}

async function apiSave<T>(key: string, value: T): Promise<T> {
    try {
        const response = await fetch(`/api/storage/${key}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ value }),
        });
        if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error:', errorText);
            throw new Error(`Server Error: ${response.status} ${response.statusText} - ${errorText}`);
        }
        const data = await response.json();
        return data.value;
    } catch (error) {
        console.error(`Error saving ${key}:`, error);
        throw error;
    }
}

// Standalone functions to avoid 'this' context issues used in mutations
async function getApps(): Promise<App[]> {
    const stored = await apiGet<App[]>(STORAGE_KEYS.APPS);
    if (!stored) {
        await apiSave(STORAGE_KEYS.APPS, INITIAL_APPS);
        return INITIAL_APPS;
    }
    return stored;
}

async function addApp(app: Omit<App, "id">): Promise<App> {
    const apps = await getApps();
    const newApp: App = {
        ...app,
        id: Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    };
    const updatedApps = [newApp, ...apps];
    await apiSave(STORAGE_KEYS.APPS, updatedApps);
    return newApp;
}

async function updateApp(id: string, updates: Omit<App, "id">): Promise<App> {
    const apps = await getApps();
    const index = apps.findIndex((a) => a.id === id);
    if (index === -1) throw new Error("App not found");

    const updatedApp = {
        ...apps[index],
        ...updates,
        updated_at: new Date().toISOString(),
    };
    apps[index] = updatedApp;
    await apiSave(STORAGE_KEYS.APPS, apps);
    return updatedApp;
}

async function deleteApp(id: string): Promise<void> {
    const apps = await getApps();
    const filtered = apps.filter((a) => a.id !== id);
    await apiSave(STORAGE_KEYS.APPS, filtered);
}

// QUICK LINKS
async function getQuickLinks(): Promise<QuickLink[]> {
    const stored = await apiGet<QuickLink[]>(STORAGE_KEYS.LINKS);
    if (!stored) {
        await apiSave(STORAGE_KEYS.LINKS, INITIAL_LINKS);
        return INITIAL_LINKS;
    }
    return stored;
}

async function addQuickLink(link: Omit<QuickLink, "id">): Promise<QuickLink> {
    const links = await getQuickLinks();
    const newLink: QuickLink = {
        ...link,
        id: Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    };
    const updatedLinks = [newLink, ...links];
    await apiSave(STORAGE_KEYS.LINKS, updatedLinks);
    return newLink;
}

async function updateQuickLink(id: string, updates: Omit<QuickLink, "id">): Promise<QuickLink> {
    const links = await getQuickLinks();
    const index = links.findIndex((l) => l.id === id);
    if (index === -1) throw new Error("Link not found");

    const updatedLink = {
        ...links[index],
        ...updates,
        updated_at: new Date().toISOString(),
    };
    links[index] = updatedLink;
    await apiSave(STORAGE_KEYS.LINKS, links);
    return updatedLink;
}

async function deleteQuickLink(id: string): Promise<void> {
    const links = await getQuickLinks();
    const filtered = links.filter((l) => l.id !== id);
    await apiSave(STORAGE_KEYS.LINKS, filtered);
}

// SETTINGS
async function getSettings(): Promise<CompanySettings> {
    const stored = await apiGet<CompanySettings>(STORAGE_KEYS.SETTINGS);
    if (!stored) {
        await apiSave(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
        return INITIAL_SETTINGS;
    }
    return stored;
}

async function updateSettings(settings: CompanySettings): Promise<CompanySettings> {
    await apiSave(STORAGE_KEYS.SETTINGS, settings);
    return settings;
}

async function resetData(): Promise<void> {
    await apiSave(STORAGE_KEYS.APPS, INITIAL_APPS);
    await apiSave(STORAGE_KEYS.LINKS, INITIAL_LINKS);
    await apiSave(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
}

export const localData = {
    getApps,
    addApp,
    updateApp,
    deleteApp,
    getQuickLinks,
    addQuickLink,
    updateQuickLink,
    deleteQuickLink,
    getSettings,
    updateSettings,
    resetData,
};
