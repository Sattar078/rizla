import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '../services/auth.api';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const signupSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().min(1, 'Phone is required'),
});

const Signup = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

  const signupMutation = useMutation({
    mutationFn: authApi.signup,
    onSuccess: (data) => {
      login(data.token, data.user);
      navigate('/');
    },
    onError: (error) => {
      setApiError(error.message || 'Signup failed. Please try again.');
    },
  });

  const onSubmit = (data) => {
    setApiError('');
    signupMutation.mutate(data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-4xl font-black tracking-tight text-gray-900">
            Create an account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="-space-y-px rounded-md shadow-sm">
            <div className="mb-4">
              <label htmlFor="name" className="sr-only">Name</label>
              <input
                id="name"
                type="text"
                className="relative block w-full rounded-t-xl border-0 py-3 px-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-primary-900 sm:text-sm sm:leading-6 font-medium bg-gray-50/50"
                placeholder="Full Name"
                {...register('name')}
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className="relative block w-full border-0 py-3 px-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-primary-900 sm:text-sm sm:leading-6 font-medium bg-gray-50/50"
                placeholder="Email address"
                {...register('email')}
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
            </div>
            <div className="mb-4">
              <label htmlFor="phone" className="sr-only">Phone Number</label>
              <input
                id="phone"
                type="text"
                className="relative block w-full border-0 py-3 px-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-primary-900 sm:text-sm sm:leading-6 font-medium bg-gray-50/50"
                placeholder="Phone Number"
                {...register('phone')}
              />
              {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                className="relative block w-full rounded-b-xl border-0 py-3 px-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-primary-900 sm:text-sm sm:leading-6 font-medium bg-gray-50/50"
                placeholder="Password"
                {...register('password')}
              />
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
            </div>
          </div>

          {apiError && (
            <div className="text-sm text-red-600 text-center bg-red-50 p-2 rounded">
              {apiError}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={signupMutation.isPending}
              className="group relative flex w-full justify-center rounded-full bg-primary-900 py-3 px-4 text-sm font-bold text-white hover:bg-primary-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-900 disabled:opacity-50 transition-colors shadow-lg mt-8"
            >
              {signupMutation.isPending ? 'Creating account...' : 'Sign up'}
            </button>
          </div>

          <div className="text-sm text-center">
             <span className="text-gray-600">Already have an account? </span>
             <Link to="/login" className="font-bold text-primary-900 hover:text-primary-700">Sign in</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
