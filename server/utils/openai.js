const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const generateQuestions = async (role, domain, resumeText) => {
  const prompt = `You are an expert interviewer. Generate 5 interview questions for a ${role} role in the ${domain} domain.
${resumeText ? `The candidate's resume summary: ${resumeText.slice(0, 500)}` : ''}
Return ONLY a JSON array of 5 question strings. No explanation. No markdown. Example: ["Q1", "Q2", "Q3", "Q4", "Q5"]`;

  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
  });

  const text = response.choices[0].message.content.trim();
  const clean = text.replace(/```json|```/g, '').trim();
  return JSON.parse(clean);
};

const generateFeedback = async (question, answer) => {
  const prompt = `You are an expert interview coach.
Question: "${question}"
Candidate's answer: "${answer}"

Give feedback in this exact JSON format:
{
  "score": <number 1-10>,
  "feedback": "<2-3 sentence constructive feedback>",
  "strength": "<one strength>",
  "improvement": "<one area to improve>"
}
Return ONLY the JSON. No markdown. No extra text.`;

  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.5,
  });

  const text = response.choices[0].message.content.trim();
  const clean = text.replace(/```json|```/g, '').trim();
  return JSON.parse(clean);
};

const generateReport = async (questions, answers, scores) => {
  const prompt = `You are an expert interview coach. Based on this interview session:
Questions: ${JSON.stringify(questions)}
Answers: ${JSON.stringify(answers)}
Scores (out of 10): ${JSON.stringify(scores)}

Generate a final report in this exact JSON format:
{
  "overallScore": <average score as number>,
  "summary": "<3-4 sentence overall performance summary>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "improvements": ["<area 1>", "<area 2>", "<area 3>"]
}
Return ONLY the JSON. No markdown. No extra text.`;

  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.5,
  });

  const text = response.choices[0].message.content.trim();
  const clean = text.replace(/```json|```/g, '').trim();
  return JSON.parse(clean);
};

module.exports = { generateQuestions, generateFeedback, generateReport };