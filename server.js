import express from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const STORAGE_FILE = path.join(DATA_DIR, 'storage.json');

// Standard JSON parsing with logging
app.use(express.json({ limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.url} [${req.headers['content-type']}]`);
    next();
});

const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');

// Ensure data and uploads directories exist
async function ensureDataDir() {
    try {
        await fs.access(DATA_DIR);
    } catch {
        await fs.mkdir(DATA_DIR, { recursive: true });
    }

    try {
        await fs.access(UPLOADS_DIR);
    } catch {
        await fs.mkdir(UPLOADS_DIR, { recursive: true });
    }
}

// Simple Mutex
class Mutex {
    constructor() {
        this._queue = Promise.resolve();
    }

    lock(callback) {
        const next = this._queue.then(() => callback());
        this._queue = next.catch(() => { }); // catch errors to keep queue alive
        return next;
    }
}

const storageMutex = new Mutex();

// Read storage file
async function readStorage() {
    try {
        await ensureDataDir();
        const data = await fs.readFile(STORAGE_FILE, 'utf-8');
        try {
            return JSON.parse(data);
        } catch (parseError) {
            console.error('JSON Parse error, resetting storage:', parseError);
            return {};
        }
    } catch (error) {
        if (error.code === 'ENOENT') {
            return {};
        }
        throw error;
    }
}

// Write storage file
async function writeStorage(data) {
    await ensureDataDir();
    // Atomic write attempt: write to temp file then rename? 
    // For now, relying on mutex + direct write since we are single instance
    await fs.writeFile(STORAGE_FILE, JSON.stringify(data, null, 2));
}

// API Routes
app.get('/api/storage/:key', async (req, res) => {
    try {
        const { key } = req.params;
        const storage = await readStorage(); // Read doesn't strictly need lock if we accept stale data, but consistency is better
        const value = storage[key];
        res.json(value === undefined ? null : value);
    } catch (error) {
        console.error('Error reading storage:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/storage/:key', async (req, res) => {
    try {
        const { key } = req.params;
        const { value } = req.body;

        // Critical section
        const result = await storageMutex.lock(async () => {
            const storage = await readStorage();
            storage[key] = value;
            await writeStorage(storage);
            return value;
        });

        res.json({ success: true, value: result });
    } catch (error) {
        console.error('Error writing storage:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/upload', async (req, res) => {
    try {
        const { filename, content } = req.body;
        if (!filename || !content) {
            return res.status(400).json({ error: 'Missing filename or content' });
        }

        const matches = content.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (!matches || matches.length !== 3) {
            return res.status(400).json({ error: 'Invalid base64 string' });
        }

        const buffer = Buffer.from(matches[2], 'base64');
        const uniqueName = `${Date.now()}-${filename.replace(/[^a-zA-Z0-9.-]/g, '')}`;
        const filePath = path.join(UPLOADS_DIR, uniqueName);

        await ensureDataDir(); // Ensure directory exists
        await fs.writeFile(filePath, buffer);

        res.json({ url: `/uploads/${uniqueName}` });
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.use('/uploads', express.static(path.join(__dirname, 'data', 'uploads')));

// Serve React App
app.use(express.static(path.join(__dirname, 'dist'), {
    setHeaders: (res, path) => {
        if (path.endsWith('.html')) {
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        } else {
            res.setHeader('Cache-Control', 'public, max-age=31536000');
        }
    }
}));

app.get('*', (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Data directory: ${DATA_DIR}`);
});
