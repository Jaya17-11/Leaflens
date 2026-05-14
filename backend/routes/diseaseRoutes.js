const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const authMiddleware = require('../middleware/auth');
const DetectionHistory = require('../models/DetectionHistory');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) return cb(null, true);
    cb(new Error('Only image files are allowed'));
  }
});

const diseases = [
  { name: 'Leaf Rust', suggestion: 'Apply fungicides containing triazole or strobilurin. Remove infected leaves and ensure proper air circulation.' },
  { name: 'Powdery Mildew', suggestion: 'Apply sulfur or potassium bicarbonate based fungicides. Improve air circulation, avoid overhead watering.' },
  { name: 'Bacterial Leaf Spot', suggestion: 'Apply copper-based bactericides. Remove and destroy infected leaves.' },
  { name: 'Early Blight', suggestion: 'Apply chlorothalonil or copper fungicides. Remove lower leaves and ensure proper spacing.' },
  { name: 'Fusarium Wilt', suggestion: 'Remove and destroy infected plants. Solarize soil before replanting.' },
  { name: 'Downy Mildew', suggestion: 'Apply fungicides containing metalaxyl or mancozeb. Reduce humidity and improve drainage.' },
  { name: 'Anthracnose', suggestion: 'Apply fungicides containing chlorothalonil or mancozeb. Remove infected plant debris.' },
  { name: 'Mosaic Virus', suggestion: 'Remove infected plants immediately. Control aphids and use virus-free seeds.' }
];

// Detect disease
router.post('/detect', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Please upload an image' });
    
    const randomDisease = diseases[Math.floor(Math.random() * diseases.length)];
    const imageUrl = `/uploads/${req.file.filename}`;
    
    const history = new DetectionHistory({
      userId: req.user.userId,
      imageUrl: imageUrl,
      diseaseName: randomDisease.name,
      suggestion: randomDisease.suggestion,
      confidence: `${Math.floor(Math.random() * (95 - 70 + 1) + 70)}%`
    });
    
    await history.save();
    
    res.json({
      disease: randomDisease.name,
      suggestion: randomDisease.suggestion,
      confidence: history.confidence,
      imageUrl: imageUrl
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all history
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const history = await DetectionHistory.find({ userId: req.user.userId }).sort({ detectedAt: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE specific history record - ADD THIS ROUTE
router.delete('/history/:id', authMiddleware, async (req, res) => {
  try {
    const history = await DetectionHistory.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });
    
    if (!history) {
      return res.status(404).json({ message: 'Record not found' });
    }
    
    await DetectionHistory.deleteOne({ _id: req.params.id });
    
    res.json({ 
      success: true,
      message: 'Record deleted successfully' 
    });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;