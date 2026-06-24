const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();

// Models
const User = require('./models/User');
const Artwork = require('./models/Artwork');

// Middleware
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'ar-art-gallery-secret-key-2024';
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ar-art-gallery';

// ── In-memory fallback stores (used when MongoDB is offline) ────────────────
let useMemoryStore = false;
const memoryUsers = [];
const memoryArtworks = [
    {
        id: 1,
        title: 'Cosmic Whispers',
        artist: 'Elena V.',
        price: '0.25 ETH',
        usd: '$450',
        img: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80',
        badge: 'Abstract',
        accent: '#8a2be2',
        description: 'A vivid exploration of emotional landscapes through spontaneous geometry and chromatic contrast.'
    },
    {
        id: 2,
        title: 'Neon Dreams',
        artist: 'Marco T.',
        price: '0.40 ETH',
        usd: '$720',
        img: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=800&q=80',
        badge: 'Digital',
        accent: '#3b82f6',
        description: 'An urban dreamscape painted with light.'
    }
];

// ── Health check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Immersive AR Art API running', dbMode: useMemoryStore ? 'memory' : 'mongodb' });
});

// ── Artworks API ─────────────────────────────────────────────────────────────
app.get('/api/artworks', async (req, res) => {
    try {
        if (useMemoryStore) {
            return res.json(memoryArtworks);
        }

        const artworks = await Artwork.find().populate('artist');

        // Shape data for frontend compatibility
        const formatted = artworks.map(art => ({
            id: art._id,
            title: art.title,
            artist: art.artist ? art.artist.name : 'Unknown Artist',
            price: `${art.price.value} ${art.price.currency}`,
            usd: `$${Math.round(art.price.value * 2000)}`, // Mock USD conversion
            img: art.images && art.images[0] ? art.images[0].url : '',
            badge: art.category,
            accent: '#8a2be2', // Default accent if not in DB
            likes: art.likes ? art.likes.length : 0,
            description: art.description,
            isTrending: art.isTrending
        }));

        res.json(formatted);
    } catch (err) {
        console.error('Fetch artworks error:', err);
        res.status(500).json({ message: 'Error fetching artworks' });
    }
});

app.get('/api/artworks/:id', async (req, res) => {
    try {
        if (useMemoryStore) {
            const art = memoryArtworks.find(a => a.id.toString() === req.params.id);
            return art ? res.json(art) : res.status(404).json({ message: 'Not found' });
        }

        const art = await Artwork.findById(req.params.id).populate('artist');
        if (!art) return res.status(404).json({ message: 'Artwork not found' });

        const formatted = {
            id: art._id,
            title: art.title,
            artist: art.artist ? art.artist.name : 'Unknown Artist',
            price: `${art.price.value} ${art.price.currency}`,
            usd: `$${Math.round(art.price.value * 2000)}`,
            img: art.images && art.images[0] ? art.images[0].url : '',
            badge: art.category,
            accent: '#8a2be2',
            likes: art.likes ? art.likes.length : 0,
            description: art.description,
            dimensions: `${art.dimensions.width} x ${art.dimensions.height} cm`,
            style: art.category,
            category: art.category
        };

        res.json(formatted);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching artwork details' });
    }
});

// ── Auth helpers ──────────────────────────────────────────────────────────────
async function findUserByEmail(email) {
    if (useMemoryStore) {
        return memoryUsers.find(u => u.email === email) || null;
    }
    return User.findOne({ email });
}

async function createUser({ name, email, password, role }) {
    if (useMemoryStore) {
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);
        const id = Date.now().toString();
        const user = { _id: id, id, name, email, password: hashed, role: role === 'artist' ? 'artist' : 'visitor' };
        memoryUsers.push(user);
        return user;
    }
    const schemaRole = role === 'artist' ? 'artist' : 'visitor';
    const user = new User({ name, email, password, role: schemaRole });
    await user.save();
    return user;
}

async function comparePassword(plain, hashed) {
    return bcrypt.compare(plain, hashed);
}

function signToken(user) {
    return jwt.sign(
        { id: user._id || user.id, email: user.email, name: user.name, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
    );
}

// ── Auth routes ──────────────────────────────────────────────────────────────
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password) return res.status(400).json({ message: 'Required fields missing' });

        const existing = await findUserByEmail(email.toLowerCase());
        if (existing) return res.status(409).json({ message: 'User already exists' });

        const user = await createUser({ name, email: email.toLowerCase(), password, role });
        const token = signToken(user);

        res.status(201).json({ token, user: { id: user._id || user.id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        res.status(500).json({ message: 'Registration failed' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await findUserByEmail(email.toLowerCase());
        if (!user || !(await comparePassword(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        res.json({ token: signToken(user), user: { id: user._id || user.id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        res.status(500).json({ message: 'Login failed' });
    }
});

app.get('/api/auth/me', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'No token' });
    try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        res.json({ user: decoded });
    } catch {
        res.status(401).json({ message: 'Invalid token' });
    }
});

// ── Start server ──────────────────────────────────────────────────────────────
mongoose.connect(MONGO_URI)
    .then(() => {
        useMemoryStore = false;
        console.log('✅ MongoDB connected');
        app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    })
    .catch(err => {
        useMemoryStore = true;
        console.warn('⚠️ MongoDB offline — using memory mode');
        app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT} (memory mode)`));
    });
