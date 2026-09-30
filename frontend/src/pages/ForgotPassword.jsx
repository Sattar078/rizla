import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '../services/auth.api';

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email address is required')
    .email('Please enter a valid email address'),
});

const ForgotPassword = () => {
  const [apiError, setApiError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const mutation = useMutation({
    mutationFn: authApi.forgotPassword,
    onSuccess: (_, variables) => {
      setSubmittedEmail(variables.email);
      setIsSuccess(true);
      setApiError('');
    },
    onError: (error) => {
      setApiError(error.message || 'Unable to process password reset request. Please try again.');
    },
  });

  const onSubmit = (data) => {
    setApiError('');
    mutation.mutate(data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-8 sm:p-10 rounded-3xl shadow-sm border border-gray-100">
        <div className="text-center">
          <Link to="/" className="inline-block text-primary-900 mb-2">
            <span className="font-display text-2xl font-bold tracking-tight">RIZLA</span>
            <span className="block text-[9px] font-bold uppercase tracking-[0.25em] text-gray-400">Boutique</span>
          </Link>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-gray-900">
            Forgot password?
          </h2>
          <p className="mt-2 text-sm text-gray-500 font-medium">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {isSuccess ? (
          <div className="rounded-2xl bg-green-50/80 border border-green-200 p-6 text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-700">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-bold text-green-900">Reset link sent!</h3>
              <p className="mt-1 text-sm text-green-700">
                If an account exists for <span className="font-semibold text-green-900">{submittedEmail}</span>, a password reset link has been dispatched.
              </p>
              <p className="mt-2 text-xs text-green-600">The link will expire in 15 minutes.</p>
            </div>
            <div className="pt-2">
              <Link
                to="/login"
                className="inline-flex w-full justify-center rounded-full bg-primary-900 py-3 px-4 text-sm font-bold text-white hover:bg-primary-800 transition-colors shadow"
              >
                Back to sign in
              </Link>
            </div>
          </div>
        ) : (
          <form className="mt-6 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className="relative block w-full rounded-xl border-0 py-3 px-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-900 sm:text-sm font-medium bg-gray-50/50"
                placeholder="you@example.com"
                {...register('email')}
              />
              {errors.email && (
                <p className="mt-1.5 text-xs font-semibold text-red-600">{errors.email.message}</p>
              )}
            </div>

            {apiError && (
              <div role="alert" className="text-sm font-medium text-red-600 bg-red-50 border border-red-100 p-3 rounded-xl text-center">
                {apiError}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={mutation.isPending}
                className="group relative flex w-full justify-center rounded-full bg-primary-900 py-3.5 px-4 text-sm font-bold text-white hover:bg-primary-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-900 disabled:opacity-50 transition-colors shadow-lg"
              >
                {mutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending reset link...
                  </span>
                ) : (
                  'Send reset link'
                )}
              </button>
            </div>

            <div className="text-center pt-2">
              <Link
                to="/login"
                className="text-xs font-semibold text-gray-500 hover:text-primary-900 transition-colors inline-flex items-center gap-1.5"
              >
                <span>&larr;</span> Back to sign in
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
