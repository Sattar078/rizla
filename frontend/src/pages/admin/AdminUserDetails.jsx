import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../services/admin.api';
import { useAuth } from '../../context/AuthContext';

const AdminUserDetails = () => {
  const { userId, id } = useParams();
  const effectiveUserId = userId || id;

  const queryClient = useQueryClient();
  const { user: currentUser } = useAuth();

  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Fetch single user from existing backend GET /api/users/admin/:userId
  const {
    data: response,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['adminUser', effectiveUserId],
    queryFn: () => adminApi.getUser(effectiveUserId),
    enabled: !!effectiveUserId,
  });

  const person = response?.user || response?.data?.user || response?.data;

  // Role update mutation using existing PATCH /api/users/admin/:userId/role
  const roleMutation = useMutation({
    mutationFn: ({ role }) =>
      adminApi.changeRole({ userId: effectiveUserId, data: { role } }),
    onSuccess: (data) => {
      setFeedback({
        type: 'success',
        message: data?.message || 'User role updated successfully.',
      });
      queryClient.invalidateQueries({ queryKey: ['adminUser', effectiveUserId] });
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      setTimeout(() => setFeedback({ type: '', message: '' }), 4000);
    },
    onError: (err) => {
      setFeedback({
        type: 'error',
        message:
          err.response?.data?.message ||
          err.message ||
          'Failed to change user role.',
      });
    },
  });

  const handleRoleChange = (newRole) => {
    if (!person || person.role === newRole) return;

    if (person._id === currentUser?._id && newRole !== 'admin') {
      alert('Security Protection: You cannot revoke your own administrator privileges.');
      return;
    }

    if (
      window.confirm(
        `Are you sure you want to change ${person.name || person.email}'s role to ${newRole.toUpperCase()}?`
      )
    ) {
      setFeedback({ type: '', message: '' });
      roleMutation.mutate({ role: newRole });
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
          <li>
            <Link to="/admin" className="hover:text-primary-900 transition-colors">
              Dashboard
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link to="/admin/users" className="hover:text-primary-900 transition-colors">
              Users
            </Link>
          </li>
          <li>/</li>
          <li className="text-primary-900 font-bold truncate max-w-[200px]">
            {person?.name || person?.email || effectiveUserId}
          </li>
        </ol>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#305f4b]">
            User Account Detail
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-semibold text-gray-900 mt-1">
            {person?.name || 'Customer Account'}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Detailed record of customer account information and activity history.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/users"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 rounded-full text-xs font-semibold text-gray-700 hover:border-gray-400 transition shadow-sm"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Users
          </Link>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback.message && (
        <div
          className={`p-4 rounded-xl text-sm flex items-center justify-between border ${
            feedback.type === 'error'
              ? 'bg-red-50 border-red-200 text-red-800'
              : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}
        >
          <span>{feedback.message}</span>
          <button
            onClick={() => setFeedback({ type: '', message: '' })}
            className="text-xs font-semibold hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ── State 1: Loading ── */}
      {isLoading && (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-primary-900 border-r-transparent mb-3" />
          <p className="text-sm font-medium text-gray-500">Loading customer profile...</p>
        </div>
      )}

      {/* ── State 2: Error / User Not Found ── */}
      {(isError || (!isLoading && !person)) && (
        <div className="bg-white rounded-2xl border border-red-200 p-8 text-center shadow-sm">
          <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-base font-semibold text-gray-900 mb-1">
            User Not Found
          </h2>
          <p className="text-xs text-gray-500 mb-4">
            {error?.response?.data?.message ||
              'The requested user account does not exist or could not be loaded.'}
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => refetch()}
              className="px-5 py-2 bg-primary-900 text-white rounded-full text-xs font-semibold hover:bg-primary-800 transition"
            >
              Retry
            </button>
            <Link
              to="/admin/users"
              className="px-5 py-2 border border-gray-300 rounded-full text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
            >
              Return to Users
            </Link>
          </div>
        </div>
      )}

      {/* ── State 3: User Details Display ── */}
      {!isLoading && !isError && person && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Profile Info Card */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
              <h2 className="text-base font-semibold text-gray-900 font-display mb-6 pb-4 border-b border-gray-100">
                General Information
              </h2>

              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <dt className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Full Name
                  </dt>
                  <dd className="mt-1.5 text-base font-semibold text-gray-900">
                    {person.name || 'Not provided'}
                  </dd>
                </div>

                <div>
                  <dt className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Email Address
                  </dt>
                  <dd className="mt-1.5 text-base font-semibold text-gray-900">
                    {person.email}
                  </dd>
                </div>

                <div>
                  <dt className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Contact Phone
                  </dt>
                  <dd className="mt-1.5 text-sm font-medium text-gray-700">
                    {person.phone || 'No phone number registered'}
                  </dd>
                </div>

                <div>
                  <dt className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Database ID
                  </dt>
                  <dd className="mt-1.5 text-xs font-mono text-gray-600 bg-gray-50 p-2 rounded-lg border border-gray-200 break-all">
                    {person._id}
                  </dd>
                </div>

                <div>
                  <dt className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Registration Date
                  </dt>
                  <dd className="mt-1.5 text-sm text-gray-700">
                    {person.createdAt
                      ? new Date(person.createdAt).toLocaleString('en-IN')
                      : '—'}
                  </dd>
                </div>

                <div>
                  <dt className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Last Profile Update
                  </dt>
                  <dd className="mt-1.5 text-sm text-gray-700">
                    {person.updatedAt
                      ? new Date(person.updatedAt).toLocaleString('en-IN')
                      : '—'}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Saved Addresses (Read-only) */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                <h2 className="text-base font-semibold text-gray-900 font-display">
                  Saved Delivery Addresses ({person.addresses?.length || 0})
                </h2>
                <span className="text-xs text-gray-400">Read-only record</span>
              </div>

              {(!person.addresses || person.addresses.length === 0) ? (
                <p className="text-xs text-gray-400 py-4 text-center">
                  This user has no saved addresses on file.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {person.addresses.map((addr) => (
                    <div
                      key={addr._id}
                      className={`p-4 rounded-xl border text-xs text-gray-700 space-y-1 ${
                        addr.isDefault
                          ? 'border-primary-800/40 bg-primary-50/20'
                          : 'border-gray-200 bg-gray-50/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-gray-900">{addr.fullName}</span>
                        {addr.isDefault && (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary-100 text-primary-900">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-gray-500">Phone: {addr.phone}</p>
                      <p className="pt-1">{addr.addressLine1}{addr.addressLine2 ? `, ${addr.addressLine2}` : ''}</p>
                      <p className="font-medium text-gray-800">
                        {addr.city}, {addr.state} — {addr.pincode}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Role & Activity Cards */}
          <div className="space-y-6">
            {/* Account Role Management */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">
                Access & Permissions
              </h3>

              <div className="mb-4">
                <span className="text-xs text-gray-400 block mb-1">Current Role:</span>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    person.role === 'admin'
                      ? 'bg-primary-900 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {person.role === 'admin' ? 'Administrator' : 'Customer Account'}
                </span>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Update Account Role
                </label>
                <div className="flex items-center gap-2">
                  <select
                    value={person.role || 'user'}
                    disabled={roleMutation.isPending}
                    onChange={(e) => handleRoleChange(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-900/20"
                  >
                    <option value="user">Customer (Standard)</option>
                    <option value="admin">Administrator (Full Access)</option>
                  </select>
                </div>
                <p className="text-[11px] text-gray-400 mt-2">
                  Administrators have full privileges across products, categories, orders, and customer records.
                </p>
              </div>
            </div>

            {/* Store Activity Metrics */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">
                Store Engagement
              </h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <span className="text-xs text-gray-600 font-medium">Orders Placed</span>
                  <span className="text-base font-bold text-gray-900 font-display">
                    {person.orderCount ?? 0}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <span className="text-xs text-gray-600 font-medium">Saved to Wishlist</span>
                  <span className="text-base font-bold text-gray-900 font-display">
                    {person.wishlist?.length || 0}
                  </span>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-gray-100">
                <Link
                  to="/admin/orders"
                  className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-primary-900 text-white rounded-xl text-xs font-semibold hover:bg-primary-800 transition"
                >
                  View Customer Orders →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserDetails;