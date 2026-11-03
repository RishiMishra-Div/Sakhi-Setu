import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import memberRoutes from './routes/memberRoutes.js';
import meetingRoutes from './routes/meetingRoutes.js';
import savingsRoutes from './routes/savingsRoutes.js';
import loanRoutes from './routes/loanRoutes.js';
import productRoutes from './routes/productRoutes.js';
import announcementRoutes from './routes/announcementRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import groupRoutes from './routes/groupRoutes.js';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    appName: 'SakhiSetu - Digital Management System for Mahila Bachat Gat',
    timestamp: new Date().toISOString()
  });
});

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('Database unavailable:', error);
    res.status(503).json({ message: 'Database unavailable. Please try again later.' });
  }
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/savings', savingsRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/products', productRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/group', groupRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {})
  });
});

export default app;

const PORT = process.env.PORT || 5000;

if (process.env.VERCEL !== '1') {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`🌸 SakhiSetu API Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
      console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
    });
  }).catch((error) => {
    console.error('Unable to start server:', error);
    process.exitCode = 1;
  });
}
