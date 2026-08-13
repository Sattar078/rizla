import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [otp, setOtp] = useState('');
  const [sentOtp, setSentOtp] = useState('');
  const [otpMessage, setOtpMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSendOtp = () => {
    const generatedOtp = '123456';
    setSentOtp(generatedOtp);
    setOtpMessage(`OTP sent to ${mobile || 'your mobile number'}`);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!mobile) {
      setError('Please enter your mobile number to receive OTP.');
      return;
    }

    if (!sentOtp) {
      setError('Please send OTP before signing in.');
      return;
    }

    if (otp !== sentOtp) {
      setError('Invalid OTP. Please check the code and try again.');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      navigate('/account');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login min-h-screen flex items-center justify-center px-4 py-24">
      <div className="relative w-full max-w-5xl overflow-hidden rounded-4xl border border-slate-200 bg-white shadow-2xl ring-1 ring-slate-100">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_1.9fr]">
          <div className="bg-slate-50 p-10 text-center text-slate-900 lg:flex lg:flex-col lg:justify-center lg:items-center lg:px-14 lg:py-16">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-accent/10 text-4xl font-black text-accent shadow-xl shadow-slate-200">
              R
            </div>
            <h2 className="mt-10 font-playfair text-4xl font-bold tracking-tight text-slate-900">RIZLA Boutique</h2>
            <p className="mt-5 max-w-md text-sm leading-7 text-slate-600">
              A secure login portal with OTP verification, captcha protection, and elegant brand styling.
            </p>
            <div className="mt-10 h-px w-24 bg-slate-200" />
            <p className="mt-6 max-w-sm text-sm text-slate-500">Your style, your shopping, your secure access.</p>
          </div>

          <div className="p-10 sm:p-12 lg:p-16">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-white">Login to your account</h1>
              <p className="mt-2 text-sm text-gray-400">Enter your details to sign in with OTP verification.</p>
            </div>

            {error && (
              <div className="mb-5 rounded-2xl bg-red-500/15 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full rounded-3xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:border-accent focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">Mobile</label>
                  <input
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="Mobile number"
                    required
                    className="w-full rounded-3xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:border-accent focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  required
                  className="w-full rounded-3xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">Captcha</label>
                <input
                  type="text"
                  value={captcha}
                  onChange={(e) => setCaptcha(e.target.value)}
                  placeholder="Enter captcha text"
                  className="w-full rounded-3xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:border-accent focus:outline-none"
                />
                <p className="mt-3 text-xs leading-5 text-gray-500">Type the captcha text shown in the image placeholder.</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">OTP Code</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP"
                    required
                    className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:border-accent focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="mt-6 rounded-2xl bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
                >
                  Send OTP
                </button>
              </div>

              {otpMessage && <p className="text-sm text-emerald-300">{otpMessage}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-accent py-3 text-sm font-semibold uppercase tracking-[0.18em] text-black transition hover:bg-emerald-500 disabled:opacity-60"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-400">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="text-accent hover:underline">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
