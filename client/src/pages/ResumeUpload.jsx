import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { startInterview } from '../services/api';

const ResumeUpload = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [drag, setDrag] = useState(false);
  const navigate = useNavigate();
  const { state } = useLocation();

  const handleStart = async () => {
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('role', state.role);
      formData.append('domain', state.domain);
      if (file) formData.append('resume', file);

      const { data } = await startInterview(formData);
      navigate('/interview', {
        state: { sessionId: data.sessionId, questions: data.questions, role: state.role, domain: state.domain }
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to start interview');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="text-center mb-10 animate-slide-up">
        <h1 className="text-4xl font-bold text-white mb-2">Upload Resume</h1>
        <p className="text-gray-400">We'll generate personalised questions based on your experience</p>
      </div>

      <div className="card mb-4 animate-slide-up">
        <div className="flex gap-3 mb-6">
          <span className="bg-indigo-600/20 text-indigo-400 px-3 py-1 rounded-full text-sm">{state?.role}</span>
          <span className="bg-purple-600/20 text-purple-400 px-3 py-1 rounded-full text-sm">{state?.domain}</span>
        </div>

        <div
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => { e.preventDefault(); setDrag(false); setFile(e.dataTransfer.files[0]); }}
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 cursor-pointer ${
            drag ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/20 hover:border-indigo-500/50'
          }`}
          onClick={() => document.getElementById('resume-input').click()}
        >
          <div className="text-5xl mb-4">{file ? '✅' : '📄'}</div>
          {file ? (
            <div>
              <p className="text-white font-medium">{file.name}</p>
              <p className="text-gray-400 text-sm mt-1">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
          ) : (
            <div>
              <p className="text-white font-medium">Drop your resume here</p>
              <p className="text-gray-400 text-sm mt-1">or click to browse — PDF only</p>
            </div>
          )}
          <input
            id="resume-input"
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={e => setFile(e.target.files[0])}
          />
        </div>

        {file && (
          <button onClick={() => setFile(null)} className="text-gray-500 text-sm mt-2 hover:text-red-400 transition-colors">
            Remove file
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl mb-4 text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-3">
        <button onClick={() => navigate('/role-select')} className="btn-secondary flex-1">
          ← Back
        </button>
        <button onClick={handleStart} disabled={loading} className="btn-primary flex-1">
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Generating questions...
            </span>
          ) : file ? 'Start with Resume →' : 'Start without Resume →'}
        </button>
      </div>
    </div>
  );
};

export default ResumeUpload;