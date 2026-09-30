import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Layers, ArrowRight, Lock, Mail } from 'lucide-react';
import PixelParticles from '../../components/common/PixelParticles';

export default function Login() {
  const [email, setEmail] = useState('demo@shiftexa.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await login(email, password);
    setLoading(false);
    if (res?.success) {
      navigate('/dashboard');
    } else {
      setError(res?.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-slate-900 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      <PixelParticles />
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-8 shadow-xl relative z-10">
        <div className="text-center mb-8">
          <h1 className="font-brand text-5xl font-bold text-[#1F1F1F] mb-2 tracking-tight">Shiftexa</h1>
          <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Sign In to Dashboard</h2>
          <p className="text-xs text-slate-600 mt-1 font-normal">Manage your digital representatives and business leads</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs text-center font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-lg glass-input text-sm text-slate-900 placeholder-slate-400 font-normal"
                placeholder="demo@abcproperties.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-lg glass-input text-sm text-slate-900 placeholder-slate-400 font-normal"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-xs uppercase tracking-wider shadow-sm flex items-center justify-center gap-2 transition"
          >
            {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-600 font-normal">
          Don't have an account?{' '}
          <Link to="/signup" className="text-[#2563EB] font-semibold hover:underline uppercase tracking-wider">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
