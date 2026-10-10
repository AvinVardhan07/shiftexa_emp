import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ArrowRight, Lock, Mail, User, Building2 } from 'lucide-react';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('ABC Properties');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await signup(name, email, password, companyName);
    setLoading(false);
    if (res?.success) {
      navigate('/dashboard');
    } else {
      setError(res?.message || 'Signup failed.');
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-[#1F1F1F] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      <div className="w-full max-w-md bg-white/92 backdrop-blur-md border border-[#E3E3E3] rounded-3xl p-8 sm:p-10 shadow-sm relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <span className="font-brand text-5xl font-bold text-[#1F1F1F] tracking-tight">Shiftexa</span>
          </Link>
          <h2 className="text-base font-bold text-[#1F1F1F] mt-2">Create Account</h2>
          <p className="text-xs text-[#5F6368] mt-1 font-normal">Deploy your first digital representative in under 2 minutes</p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-[#D93025] text-xs text-center font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#1F1F1F] mb-1.5">Company / Business Name</label>
            <div className="relative">
              <Building2 className="w-4 h-4 text-[#5F6368] absolute left-3.5 top-3" />
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#747775] text-xs text-[#1F1F1F] focus:outline-none focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/20 bg-white"
                placeholder="ABC Properties"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1F1F1F] mb-1.5">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-[#5F6368] absolute left-3.5 top-3" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#747775] text-xs text-[#1F1F1F] focus:outline-none focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/20 bg-white"
                placeholder="Rahul Admin"
              />
            </div>
          </div>

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
            className="btn-gemini-primary w-full py-3 text-xs font-semibold flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Creating Account...' : 'Get Started'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-[#5F6368] font-normal">
          Already have an account?{' '}
          <Link to="/login" className="text-[#1A73E8] font-semibold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

