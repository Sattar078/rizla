import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../services/admin.api';
import { useAuth } from '../../context/AuthContext';

const AdminUsers = () => {
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuth();

  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [updatingId, setUpdatingId] = useState(null);

  // Fetch users from existing backend GET /api/users/admin
  const {
    data: response,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: adminApi.getUsers,
  });

  const users = response?.users || response?.data?.users || [];

  // Role update mutation using existing PATCH /api/users/admin/:userId/role
  const roleMutation = useMutation({
    mutationFn: ({ userId, role }) =>
      adminApi.changeRole({ userId, data: { role } }),
    onSuccess: (data) => {
      setUpdatingId(null);
      setFeedback({
        type: 'success',
        message: data?.message || 'User role updated successfully.',
      });
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      setTimeout(() => setFeedback({ type: '', message: '' }), 4000);
    },
    onError: (err) => {
      setUpdatingId(null);
      setFeedback({
        type: 'error',
        message:
          err.response?.data?.message ||
          err.message ||
          'Failed to change user role.',
      });
    },
  });

  const handleRoleChange = (userId, currentRole, newRole) => {
    if (currentRole === newRole) return;

    if (userId === currentUser?._id && newRole !== 'admin') {
      alert('Security Protection: You cannot remove your own administrator privileges.');
      return;
    }

    const confirmMsg = `Are you sure you want to change this user's role to ${newRole.toUpperCase()}?`;
    if (window.confirm(confirmMsg)) {
      setUpdatingId(userId);
      setFeedback({ type: '', message: '' });
      roleMutation.mutate({ userId, role: newRole });
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <nav aria-label="Breadcrumb" className="mb-1">
            <ol className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
              <li>
                <Link to="/admin" className="hover:text-primary-900 transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>/</li>
              <li className="text-primary-900">Users</li>
            </ol>
          </nav>
          <h1 className="text-2xl sm:text-3xl font-display font-semibold text-gray-900">
            User Accounts ({users.length})
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            View customer profiles, contact records, and manage administrator access.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 rounded-full text-xs font-semibold text-gray-700 hover:border-gray-400 transition shadow-sm disabled:opacity-50"
          >
            <svg
              className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh List
          </button>
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
          <div className="flex items-center gap-2">
            {feedback.type === 'error' ? (
              <svg className="w-5 h-5 text-red-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            onClick={() => setFeedback({ type: '', message: '' })}
            className="text-xs font-semibold hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ── State 1: Loading State ── */}
      {isLoading && (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-primary-900 border-r-transparent mb-3" />
          <p className="text-sm font-medium text-gray-500">Loading user database...</p>
        </div>
      )}

      {/* ── State 2: Error State ── */}
      {isError && !isLoading && (
        <div className="bg-white rounded-2xl border border-red-200 p-8 text-center shadow-sm">
          <p className="text-sm text-red-600 font-medium mb-3">
            {error?.response?.data?.message || 'Unable to retrieve user records.'}
          </p>
          <button
            onClick={() => refetch()}
            className="px-5 py-2 bg-primary-900 text-white rounded-full text-xs font-semibold hover:bg-primary-800 transition"
          >
            Retry
          </button>
        </div>
      )}

      {/* ── State 3: Empty State ── */}
      {!isLoading && !isError && users.length === 0 && (
        <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3 text-gray-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h2 className="text-base font-semibold text-gray-900 mb-1">No users found</h2>
          <p className="text-xs text-gray-500">No registered accounts exist in the database yet.</p>
        </div>
      )}

      {/* ── State 4: Populated User Directory ── */}
      {!isLoading && !isError && users.length > 0 && (
        <div>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-[11px] font-bold uppercase tracking-wider text-gray-500 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Joined Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((item) => {
                  const isCurrent = item._id === currentUser?._id;
                  const isItemUpdating = updatingId === item._id;

                  return (
                    <tr key={item._id} className="hover:bg-gray-50/50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary-100 text-primary-900 flex items-center justify-center font-bold text-xs uppercase">
                            {item.name ? item.name.charAt(0) : 'U'}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 flex items-center gap-2">
                              <span>{item.name || 'Anonymous User'}</span>
                              {isCurrent && (
                                <span className="text-[10px] font-bold bg-primary-50 text-primary-900 px-2 py-0.5 rounded-full border border-primary-200">
                                  You
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-gray-400 block font-mono">
                              ID: {item._id}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        <div className="text-xs">
                          <p className="font-medium text-gray-800">{item.email}</p>
                          <p className="text-gray-400 mt-0.5">{item.phone || 'No phone'}</p>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <select
                            aria-label={`Role for ${item.email}`}
                            value={item.role || 'user'}
                            disabled={isItemUpdating}
                            onChange={(e) =>
                              handleRoleChange(item._id, item.role, e.target.value)
                            }
                            className={`rounded-lg border text-xs font-semibold px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-900/20 transition ${
                              item.role === 'admin'
                                ? 'bg-[#17332b] text-white border-[#17332b]'
                                : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            <option value="user">Customer</option>
                            <option value="admin">Administrator</option>
                          </select>
                          {isItemUpdating && (
                            <span className="w-3.5 h-3.5 border-2 border-primary-900 border-r-transparent rounded-full animate-spin" />
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4 text-xs text-gray-500 whitespace-nowrap">
                        {item.createdAt
                          ? new Date(item.createdAt).toLocaleDateString('en-IN', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })
                          : '—'}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <Link
                          to={`/admin/users/${item._id}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-primary-900 hover:text-primary-700 transition"
                        >
                          View Profile
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {users.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">
                      {item.name || 'Anonymous User'}
                    </h3>
                    <p className="text-xs text-gray-500">{item.email}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{item.phone || 'No phone'}</p>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      item.role === 'admin'
                        ? 'bg-primary-900 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {item.role === 'admin' ? 'Admin' : 'Customer'}
                  </span>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                  <div>
                    <label className="text-[11px] text-gray-400 font-medium block mb-1">
                      Change Role:
                    </label>
                    <select
                      value={item.role || 'user'}
                      disabled={updatingId === item._id}
                      onChange={(e) =>
                        handleRoleChange(item._id, item.role, e.target.value)
                      }
                      className="rounded-lg border border-gray-300 bg-white px-2 py-1 text-xs font-semibold text-gray-800"
                    >
                      <option value="user">Customer</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </div>

                  <Link
                    to={`/admin/users/${item._id}`}
                    className="font-semibold text-primary-900 hover:underline"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;