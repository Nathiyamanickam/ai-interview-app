import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyReports } from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyReports()
      .then(({ data }) => setReports(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const avgScore = reports.length
    ? (reports.reduce((a, r) => a + r.overallScore, 0) / reports.length).toFixed(1)
    : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 animate-slide-up">
        <h1 className="text-4xl font-bold text-white">
          Hello, <span className="text-indigo-400">{user?.name}</span> 👋
        </h1>
        <p className="text-gray-400 mt-2">Ready to ace your next interview?</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Sessions', value: reports.length, icon: '🎯', color: 'indigo' },
          { label: 'Avg Score', value: `${avgScore}/10`, icon: '⭐', color: 'purple' },
          { label: 'Best Score', value: reports.length ? `${Math.max(...reports.map(r => r.overallScore))}/10` : '0/10', icon: '🏆', color: 'yellow' },
        ].map((stat, i) => (
          <div key={i} className="card animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
            <div className="flex items-center gap-4">
              <span className="text-4xl">{stat.icon}</span>
              <div>
                <p className="text-gray-400 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Start Interview CTA */}
      <div className="card glow-border mb-8 text-center py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-purple-600/10"></div>
        <div className="relative z-10">
          <div className="text-6xl mb-4 animate-float">🤖</div>
          <h2 className="text-2xl font-bold text-white mb-2">Start a New Interview</h2>
          <p className="text-gray-400 mb-6">Upload your resume and get personalised AI questions</p>
          <button
            onClick={() => navigate('/role-select')}
            className="btn-primary text-lg px-8 py-4"
          >
            Start Interview →
          </button>
        </div>
      </div>

      {/* Past Reports */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Past Sessions</h2>
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : reports.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-400">No sessions yet. Start your first interview!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reports.map((report, i) => (
              <div key={i} className="card hover:glow-border cursor-pointer">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-white font-semibold capitalize">{report.session?.role}</p>
                    <p className="text-gray-400 text-sm capitalize">{report.session?.domain}</p>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${report.overallScore >= 7 ? 'text-green-400' : report.overallScore >= 5 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {report.overallScore}/10
                    </div>
                  </div>
                </div>
                <p className="text-gray-400 text-sm line-clamp-2">{report.summary}</p>
                <p className="text-gray-500 text-xs mt-3">
                  {new Date(report.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;