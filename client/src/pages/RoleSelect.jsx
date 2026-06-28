import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const roles = ['Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Data Scientist', 'Product Manager'];
const domains = ['Web Development', 'Machine Learning', 'Data Analytics', 'DevOps', 'Mobile Development', 'Cybersecurity'];

const RoleSelect = () => {
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('');
  const navigate = useNavigate();

  const handleNext = () => {
    if (!selectedRole || !selectedDomain) return;
    navigate('/upload-resume', { state: { role: selectedRole, domain: selectedDomain } });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="text-center mb-10 animate-slide-up">
        <h1 className="text-4xl font-bold text-white mb-2">Choose Your Path</h1>
        <p className="text-gray-400">Select your target role and domain for personalised questions</p>
      </div>

      <div className="card mb-6 animate-slide-up">
        <h2 className="text-lg font-semibold text-white mb-4">🎯 Target Role</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {roles.map(role => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`p-3 rounded-xl text-sm font-medium transition-all duration-300 border ${
                selectedRole === role
                  ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:border-indigo-500/50 hover:text-white'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      <div className="card mb-8 animate-slide-up">
        <h2 className="text-lg font-semibold text-white mb-4">🌐 Domain</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {domains.map(domain => (
            <button
              key={domain}
              onClick={() => setSelectedDomain(domain)}
              className={`p-3 rounded-xl text-sm font-medium transition-all duration-300 border ${
                selectedDomain === domain
                  ? 'bg-purple-600/30 border-purple-500 text-purple-300'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:border-purple-500/50 hover:text-white'
              }`}
            >
              {domain}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleNext}
        disabled={!selectedRole || !selectedDomain}
        className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
          selectedRole && selectedDomain
            ? 'btn-primary'
            : 'bg-white/5 text-gray-500 cursor-not-allowed border border-white/10'
        }`}
      >
        Continue to Resume Upload →
      </button>
    </div>
  );
};

export default RoleSelect;