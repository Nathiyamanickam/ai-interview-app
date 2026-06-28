import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { submitAnswers, createReport } from '../services/api';
import VoiceRecorder from '../components/VoiceRecorder';
// import { useState, useCallback } from 'react';

const Interview = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { sessionId, questions, role, domain } = state || {};

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState(Array(questions?.length).fill(''));
  const [isRecording, setIsRecording] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

 const handleVoiceResult = (transcript) => {
  setAnswers(prev => {
    const updated = [...prev];
    updated[current] = transcript;
    return updated;
  });
};

  const handleNext = () => {
    if (current < questions.length - 1) setCurrent(current + 1);
  };

  const handlePrev = () => {
    if (current > 0) setCurrent(current - 1);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    try {
      await submitAnswers({ sessionId, answers });
      const { data: report } = await createReport({ sessionId });
      navigate('/report', { state: { report, questions, answers } });
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed');
      setSubmitting(false);
    }
  };

  if (!questions) return <div className="text-center py-20 text-gray-400">No interview data found.</div>;

  const progress = ((current + 1) / questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-gray-400 text-sm capitalize">{role} • {domain}</p>
          <p className="text-white font-semibold">Question {current + 1} of {questions.length}</p>
        </div>
        <div className="text-right">
          <p className="text-indigo-400 font-bold text-lg">{Math.round(progress)}%</p>
          <p className="text-gray-500 text-xs">Complete</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-white/10 rounded-full h-2 mb-8">
        <div
          className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Question card */}
      <div className="card glow-border mb-6 animate-slide-up">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-indigo-600/30 rounded-xl flex items-center justify-center shrink-0">
            <span className="text-indigo-400 font-bold">{current + 1}</span>
          </div>
          <p className="text-white text-lg leading-relaxed">{questions[current]}</p>
        </div>
      </div>

      {/* Answer area */}
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-3">
          <label className="text-gray-400 text-sm">Your Answer</label>
          <VoiceRecorder
            onResult={handleVoiceResult}
            isRecording={isRecording}
            setIsRecording={setIsRecording}
          />
        </div>
        <textarea
          className="input-field min-h-[160px] resize-none"
          placeholder="Type your answer here or use voice recording..."
          value={answers[current]}
          onChange={e => {
            const updated = [...answers];
            updated[current] = e.target.value;
            setAnswers(updated);
          }}
        />
        <p className="text-gray-500 text-xs mt-2 text-right">
          {answers[current].length} characters
        </p>
      </div>

      {/* Question dots */}
      <div className="flex justify-center gap-2 mb-6">
        {questions.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              i === current ? 'bg-indigo-500 scale-125' :
              answers[i] ? 'bg-green-500/60' : 'bg-white/20'
            }`}
          />
        ))}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl mb-4 text-sm">
          {error}
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-3">
        <button onClick={handlePrev} disabled={current === 0} className="btn-secondary flex-1 disabled:opacity-30">
          ← Previous
        </button>
        {current < questions.length - 1 ? (
          <button onClick={handleNext} className="btn-primary flex-1">
            Next →
          </button>
        ) : (
          <button onClick={handleSubmit} disabled={submitting} className="btn-primary flex-1 bg-green-600 hover:bg-green-500">
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Analysing answers...
              </span>
            ) : '✅ Submit Interview'}
          </button>
        )}
      </div>
    </div>
  );
};

export default Interview;