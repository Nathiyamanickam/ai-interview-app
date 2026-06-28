const Session = require('../models/Session');
const { generateQuestions, generateFeedback } = require('../utils/openai');
const pdfParse = require('pdf-parse');
const fs = require('fs');

const startSession = async (req, res) => {
  const { role, domain } = req.body;
  let resumeText = '';

  try {
    if (req.file) {
      const dataBuffer = fs.readFileSync(req.file.path);
      const pdfData = await pdfParse(dataBuffer);
      resumeText = pdfData.text;
      fs.unlinkSync(req.file.path);
    }

    const questions = await generateQuestions(role, domain, resumeText);

    const session = await Session.create({
      user: req.user._id,
      role,
      domain,
      questions,
      resumeText: resumeText.slice(0, 1000),
    });

    res.status(201).json({ sessionId: session._id, questions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const submitAnswers = async (req, res) => {
  const { sessionId, answers } = req.body;
  try {
    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ message: 'Session not found' });

    const feedbackList = [];
    const scoreList = [];

    for (let i = 0; i < session.questions.length; i++) {
      const result = await generateFeedback(session.questions[i], answers[i] || '');
      feedbackList.push(result.feedback);
      scoreList.push(result.score);
    }

    session.answers = answers;
    session.feedback = feedbackList;
    session.scores = scoreList;
    session.completed = true;
    await session.save();

    res.json({ feedback: feedbackList, scores: scoreList });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { startSession, submitAnswers };