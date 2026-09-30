import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '../services/auth.api';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [apiError, setApiError] = useState('');

  // Default redirect is home, or wherever they were trying to go
  const from = location.state?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      login(data.token, data.user);
      navigate(from, { replace: true });
    },
    onError: (error) => {
      setApiError(error.message || 'Login failed. Please try again.');
    },
  });

  const onSubmit = (data) => {
    setApiError('');
    loginMutation.mutate(data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-4xl font-black tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="-space-y-px rounded-md shadow-sm">
            <div className="mb-4">
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className="relative block w-full rounded-t-xl border-0 py-3 px-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-primary-900 sm:text-sm sm:leading-6 font-medium bg-gray-50/50"
                placeholder="Email address"
                {...register('email')}
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                className="relative block w-full rounded-b-xl border-0 py-3 px-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-primary-900 sm:text-sm sm:leading-6 font-medium bg-gray-50/50"
                placeholder="Password"
                {...register('password')}
              />
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
            </div>
          </div>

          <div className="flex items-center justify-end">
            <Link
              to="/forgot-password"
              className="text-xs font-semibold text-primary-900 hover:text-primary-700 transition-colors"
            >
              Forgot your password?
            </Link>
          </div>

          {apiError && (
            <div className="text-sm text-red-600 text-center bg-red-50 p-2 rounded">
              {apiError}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="group relative flex w-full justify-center rounded-full bg-primary-900 py-3 px-4 text-sm font-bold text-white hover:bg-primary-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-900 disabled:opacity-50 transition-colors shadow-lg mt-8"
            >
              {loginMutation.isPending ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
          
          <div className="text-sm text-center">
             <span className="text-gray-600">Don't have an account? </span>
             <Link to="/signup" className="font-bold text-primary-900 hover:text-primary-700">Sign up</Link>
          </div>
          <div className="text-xs text-center text-gray-400 mt-2">
            <span>Admin? </span>
            <Link to="/admin/login" className="font-semibold text-gray-600 hover:text-gray-900 underline">Access Admin Portal</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
