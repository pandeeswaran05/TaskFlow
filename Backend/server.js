require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// ✅ Use clear, consistent naming
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');

const { authenticate } = require('./middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.static("dist"));

// ✅ Connect DB
(async () => {
  try {
    await connectDB();
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ DB connection failed:', err.message);
    process.exit(1);
  }
})();


// ✅ Middleware
app.use(cors({
  origin: ['http://localhost:5173'],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// ✅ Routes
app.use('/api/auth', authRoutes);

// Protected routes
app.use('/api/users', authenticate, userRoutes);
app.use('/api/tasks', authenticate, taskRoutes); // ✅ main feature


// ✅ Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Task Management API running',
    timestamp: new Date().toISOString(),
  });
});


// ✅ 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.url} not found`,
  });
});


// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error('🔥 Unhandled error:', err.stack);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});


// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
