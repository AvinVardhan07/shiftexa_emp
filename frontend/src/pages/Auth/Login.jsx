import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ArrowRight, Lock, Mail, ShieldCheck } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('demo@shiftexa.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, loginDemo } = useAuth();
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

  const handleDemoLogin = () => {
    loginDemo();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#1F1F1F] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      <div className="w-full max-w-md bg-white border border-[#E3E3E3] rounded-3xl p-8 sm:p-10 shadow-sm relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <span className="font-brand text-5xl font-bold text-[#1F1F1F] tracking-tight">Shiftexa</span>
          </Link>
          <h2 className="text-base font-bold text-[#1F1F1F] mt-2">Sign In to Dashboard</h2>
          <p className="text-xs text-[#5F6368] mt-1 font-normal">Manage autonomous representatives and enterprise lead queues</p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-[#D93025] text-xs text-center font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#1F1F1F] mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#5F6368] absolute left-3.5 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#747775] text-xs text-[#1F1F1F] focus:outline-none focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/20 bg-white"
                placeholder="admin@abcproperties.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1F1F1F] mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#5F6368] absolute left-3.5 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#747775] text-xs text-[#1F1F1F] focus:outline-none focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/20 bg-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-[#1A73E8] hover:bg-[#1557B0] text-white font-semibold text-xs shadow-none flex items-center justify-center gap-2 transition"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#E3E3E3]"></div>
          </div>
          <span className="relative bg-white px-3 text-xs text-[#5F6368] font-normal">OR</span>
        </div>

        <button
          onClick={handleDemoLogin}
          className="w-full py-2.5 rounded-full bg-[#F0F4F9] hover:bg-[#E8F0FE] text-[#1A73E8] border border-[#D2E3FC] font-semibold text-xs transition flex items-center justify-center"
        >
          <span>Launch Demo Dashboard Session</span>
        </button>

        <div className="mt-8 text-center text-xs text-[#5F6368] font-normal">
          Don't have an account?{' '}
          <Link to="/signup" className="text-[#1A73E8] font-semibold hover:underline">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}

