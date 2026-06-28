const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, required: true },
  domain: { type: String, required: true },
  questions: [{ type: String }],
  answers: [{ type: String }],
  feedback: [{ type: String }],
  scores: [{ type: Number }],
  resumeText: { type: String },
  completed: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);