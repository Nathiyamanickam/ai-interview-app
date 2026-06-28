const Session = require('../models/Session');
const Report = require('../models/Report');
const { generateReport } = require('../utils/openai');

const createReport = async (req, res) => {
  const { sessionId } = req.body;
  try {
    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ message: 'Session not found' });

    const reportData = await generateReport(session.questions, session.answers, session.scores);

    const report = await Report.create({
      user: req.user._id,
      session: sessionId,
      overallScore: reportData.overallScore,
      strengths: reportData.strengths,
      improvements: reportData.improvements,
      summary: reportData.summary,
    });

    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserReports = async (req, res) => {
  try {
    const reports = await Report.find({ user: req.user._id })
      .populate('session', 'role domain createdAt')
      .sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createReport, getUserReports };