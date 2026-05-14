const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const userRoutes = require('./routes/userRoutes');
const diseaseRoutes = require('./routes/diseaseRoutes');

app.use('/api/users', userRoutes);
app.use('/api/diseases', diseaseRoutes);

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/crop-disease')
  .then(() => {
    console.log('✅ MongoDB connected successfully!');
    console.log('📊 Database: crop-disease');
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});