require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const submitRouter = require('./routes/submit');

const app = express();
const PORT = process.env.PORT || 3001;

// ── Trust Render's reverse proxy ────────────────────────────────────────────
app.set('trust proxy', 1);

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(cors({ origin: process.env.NODE_ENV === 'production' ? false : '*' }));
app.use(express.json({ limit: '10kb' }));

// ── API Routes ──────────────────────────────────────────────────────────────
app.use('/api', submitRouter);

// ── Serve React build in production ────────────────────────────────────────
if (process.env.NODE_ENV === 'production') {
  const clientDist = path.join(__dirname, '..', 'client', 'dist');
  app.use(express.static(clientDist));
  // SPA fallback
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
} else {
  app.get('/', (req, res) => res.json({ status: 'API server running in dev mode' }));
}

// ── Start ───────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
