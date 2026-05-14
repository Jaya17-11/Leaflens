const mongoose = require('mongoose');

const detectionHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  imageUrl: { type: String, required: true },
  diseaseName: { type: String, required: true },
  suggestion: { type: String, required: true },
  confidence: { type: String, default: 'Random Detection' },
  detectedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DetectionHistory', detectionHistorySchema);