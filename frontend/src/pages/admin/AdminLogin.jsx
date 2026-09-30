import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authApi } from '../../services/auth.api';
import { useAuth } from '../../context/AuthContext';

const adminLoginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email address is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required'),
});

const AdminLogin = () => {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [authError, setAuthError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // If already authenticated as admin, redirect to admin dashboard
  useEffect(() => {
    if (user && user.role === 'admin') {
      const target = location.state?.from?.pathname || '/admin';
      navigate(target, { replace: true });
    }
  }, [user, navigate, location]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    setAuthError('');
    setIsSubmitting(true);

    try {
      // 1. Call existing backend login API
      const response = await authApi.login({
        email: data.email.trim(),
        password: data.password,
      });

      const { token, user: loggedInUser } = response;

      // 2. Authoritative role verification from backend response
      if (!loggedInUser || loggedInUser.role !== 'admin') {
        // Explicitly reject non-admin users
        setAuthError(
          'Access denied. This account does not possess administrator privileges. Only authorized personnel may access the administrative portal.'
        );
        setIsSubmitting(false);
        return;
      }

      // 3. User is verified admin: store token & user in existing auth context
      login(token, loggedInUser);

      // 4. Navigate to admin dashboard
      const target = location.state?.from?.pathname || '/admin';
      navigate(target, { replace: true });
    } catch (err) {
      setAuthError(
        err.response?.data?.message ||
          err.message ||
          'Authentication failed. Please verify your credentials and try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111915] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Branding */}
        <Link to="/" className="inline-block mb-4">
          <span className="font-display text-3xl font-semibold tracking-wider text-white block">
            RIZLA
          </span>
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#91b9a3] block mt-1">
            Administration Portal
          </span>
        </Link>
        <h2 className="text-xl font-medium text-gray-200 mt-2">
          Store Management Sign In
        </h2>
        <p className="mt-1 text-xs text-gray-400">
          Restricted access. Authorized Rizla Boutique personnel only.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#17231e] py-8 px-6 shadow-2xl rounded-2xl sm:px-10 border border-[#264c3d]/40">
          {/* Warning banner if current user is logged in as non-admin */}
          {user && user.role !== 'admin' && (
            <div className="mb-6 p-4 rounded-xl bg-amber-950/60 border border-amber-600/40 text-amber-200 text-xs flex flex-col gap-2">
              <div className="flex items-center gap-2 font-semibold">
                <svg className="w-4 h-4 text-amber-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>Logged in as Customer ({user.email})</span>
              </div>
              <p className="text-amber-300/90">
                Your current session lacks administrator privileges. Please sign in with an administrator account to continue.
              </p>
              <button
                type="button"
                onClick={logout}
                className="self-start text-[11px] underline font-bold text-amber-400 hover:text-amber-200"
              >
                Sign out of customer account
              </button>
            </div>
          )}

          {/* Error Banner */}
          {authError && (
            <div className="mb-6 p-4 rounded-xl bg-red-950/70 border border-red-800/60 text-red-200 text-xs flex items-start gap-2.5">
              <svg className="w-4 h-4 text-red-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="flex-1">
                <span className="font-semibold block mb-0.5">Authorization Error</span>
                <span className="text-red-300 leading-relaxed">{authError}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                Administrator Email *
              </label>
              <input
                {...register('email')}
                type="email"
                autoComplete="email"
                placeholder="sattaarkureshi87@gmail.com"
                className="w-full rounded-xl bg-[#0f1714] border border-[#264c3d] px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#61977d] focus:border-[#61977d] transition"
              />
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-400">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                Password *
              </label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter administrator password"
                  className="w-full rounded-xl bg-[#0f1714] border border-[#264c3d] px-3.5 py-2.5 pr-10 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#61977d] focus:border-[#61977d] transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 p-1"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-400">{errors.password.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-3 px-4 rounded-xl bg-[#40785f] hover:bg-[#305f4b] text-white text-sm font-semibold transition disabled:opacity-50 shadow-md"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-r-transparent rounded-full animate-spin" />
                    Verifying authorization...
                  </span>
                ) : (
                  'Sign In to Dashboard'
                )}
              </button>
            </div>
          </form>

          {/* Navigation Links */}
          <div className="mt-6 pt-5 border-t border-[#264c3d]/40 flex items-center justify-between text-xs text-gray-400">
            <Link to="/" className="hover:text-white transition">
              ← Return to Store
            </Link>
            <Link to="/login" className="hover:text-white transition">
              Customer Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
