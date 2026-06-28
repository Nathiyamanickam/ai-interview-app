import { useLocation, useNavigate } from 'react-router-dom';

const Report = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { report, questions, answers } = state || {};

  if (!report) return <div className="text-center py-20 text-gray-400">No report found.</div>;

  const scoreColor = (score) =>
    score >= 7 ? 'text-green-400' : score >= 5 ? 'text-yellow-400' : 'text-red-400';

  const scoreBg = (score) =>
    score >= 7 ? 'bg-green-500/20 border-green-500/50' : score >= 5 ? 'bg-yellow-500/20 border-yellow-500/50' : 'bg-red-500/20 border-red-500/50';

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-10 animate-slide-up">
        <div className="text-6xl mb-4">
          {report.overallScore >= 7 ? '🏆' : report.overallScore >= 5 ? '📈' : '💪'}
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">Interview Complete!</h1>
        <p className="text-gray-400">Here's your detailed performance report</p>
      </div>

      {/* Overall score */}
      <div className={`card border mb-6 animate-slide-up text-center py-8 ${scoreBg(report.overallScore)}`}>
        <p className="text-gray-400 mb-2">Overall Score</p>
        <div className={`text-7xl font-bold ${scoreColor(report.overallScore)}`}>
          {report.overallScore}
          <span className="text-3xl text-gray-500">/10</span>
        </div>
        <p className="text-gray-300 mt-4 max-w-lg mx-auto leading-relaxed">{report.summary}</p>
      </div>

      {/* Strengths & Improvements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="card animate-slide-up">
          <h3 className="text-green-400 font-semibold mb-3 flex items-center gap-2">
            <span>✅</span> Strengths
          </h3>
          <ul className="space-y-2">
            {report.strengths?.map((s, i) => (
              <li key={i} className="text-gray-300 text-sm flex items-start gap-2">
                <span className="text-green-400 mt-0.5">•</span> {s}
              </li>
            ))}
          </ul>
        </div>

        <div className="card animate-slide-up">
          <h3 className="text-yellow-400 font-semibold mb-3 flex items-center gap-2">
            <span>🎯</span> Areas to Improve
          </h3>
          <ul className="space-y-2">
            {report.improvements?.map((imp, i) => (
              <li key={i} className="text-gray-300 text-sm flex items-start gap-2">
                <span className="text-yellow-400 mt-0.5">•</span> {imp}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Q&A Review */}
      <div className="card mb-6 animate-slide-up">
        <h3 className="text-white font-semibold mb-4">📝 Question Review</h3>
        <div className="space-y-4">
          {questions?.map((q, i) => (
            <div key={i} className="border border-white/10 rounded-xl p-4 hover:border-indigo-500/30 transition-colors">
              <p className="text-indigo-300 text-sm font-medium mb-2">Q{i + 1}: {q}</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                {answers?.[i] || <span className="text-gray-600 italic">No answer given</span>}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button onClick={() => navigate('/dashboard')} className="btn-secondary flex-1">
          ← Dashboard
        </button>
        <button onClick={() => navigate('/role-select')} className="btn-primary flex-1">
          Try Again →
        </button>
      </div>
    </div>
  );
};

export default Report;