const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  session: { type: mongoose.Schema.Types.ObjectId, ref: 'Session', required: true },
  overallScore: { type: Number },
  strengths: [{ type: String }],
  improvements: [{ type: String }],
  summary: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);