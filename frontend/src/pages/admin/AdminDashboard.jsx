import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../../services/admin.api';

const AdminDashboard = () => {
  const {
    data: response,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['adminDashboard'],
    queryFn: adminApi.getDashboard,
  });

  const stats = response?.data || {};

  // Extract real backend fields
  const totalRevenue = stats.revenue?.totalRevenue ?? 0;
  const totalOrders = stats.orders?.totalOrders ?? 0;
  const totalProducts = stats.products?.totalProducts ?? 0;
  const totalCategories = stats.products?.totalCategories ?? 0;
  const totalUsers = stats.users?.totalUsers ?? 0;
  const totalReviews = stats.reviews?.totalReviews ?? 0;
  const orderStatusCounts = stats.orders?.orderStatusCounts || {};
  const codOrders = stats.payments?.codOrdersCount ?? 0;
  const razorpayOrders = stats.payments?.razorpayOrdersCount ?? 0;

  const formatCurrency = (val) =>
    `₹${Number(val || 0).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const formatNumber = (val) => Number(val || 0).toLocaleString('en-IN');

  return (
    <div className="space-y-8">
      {/* Dashboard Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#305f4b]">
            Store Administration
          </span>
          <h1 className="text-3xl font-display font-semibold text-gray-900 mt-1">
            Executive Overview
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Real-time analytics and store performance indicators from your database.
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
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh Data
          </button>
        </div>
      </div>

      {/* ── State 1: Error State ── */}
      {isError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 flex items-start gap-4">
          <div className="p-2 bg-red-100 rounded-full text-red-600 shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-red-900">
              Could not load store statistics
            </h3>
            <p className="text-xs text-red-700 mt-1">
              {error?.response?.data?.message ||
                error?.message ||
                'Failed to communicate with the administrative API. Please verify network access.'}
            </p>
            <button
              onClick={() => refetch()}
              className="mt-3 px-4 py-1.5 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700 transition"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* ── State 2: Loading State ── */}
      {isLoading && (
        <div className="space-y-6 animate-pulse">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-white rounded-2xl border border-gray-200 p-6" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-64 bg-white rounded-2xl border border-gray-200 p-6" />
            <div className="h-64 bg-white rounded-2xl border border-gray-200 p-6" />
          </div>
        </div>
      )}

      {/* ── State 3: Populated Dashboard ── */}
      {!isLoading && !isError && (
        <div className="space-y-8">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Revenue */}
            <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between text-gray-500">
                <span className="text-xs font-bold uppercase tracking-wider">Delivered Revenue</span>
                <span className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
              </div>
              <div className="mt-4">
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 font-display">
                  {formatCurrency(totalRevenue)}
                </p>
                <p className="text-xs text-gray-400 mt-1">From fulfilled orders</p>
              </div>
            </div>

            {/* Total Orders */}
            <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between text-gray-500">
                <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
                <span className="p-2 rounded-xl bg-blue-50 text-blue-700">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </span>
              </div>
              <div className="mt-4">
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 font-display">
                  {formatNumber(totalOrders)}
                </p>
                <Link
                  to="/admin/orders"
                  className="text-xs font-semibold text-primary-800 hover:underline mt-1 inline-block"
                >
                  Manage Orders →
                </Link>
              </div>
            </div>

            {/* Products & Categories */}
            <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between text-gray-500">
                <span className="text-xs font-bold uppercase tracking-wider">Products & Catalog</span>
                <span className="p-2 rounded-xl bg-purple-50 text-purple-700">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </span>
              </div>
              <div className="mt-4">
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 font-display">
                  {formatNumber(totalProducts)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Across <span className="font-semibold text-gray-700">{totalCategories}</span> categories
                </p>
              </div>
            </div>

            {/* Customers & Reviews */}
            <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between text-gray-500">
                <span className="text-xs font-bold uppercase tracking-wider">Customers</span>
                <span className="p-2 rounded-xl bg-amber-50 text-amber-700">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </span>
              </div>
              <div className="mt-4">
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 font-display">
                  {formatNumber(totalUsers)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  <span className="font-semibold text-gray-700">{totalReviews}</span> customer reviews submitted
                </p>
              </div>
            </div>
          </div>

          {/* Operational Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Orders By Status */}
            <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-base font-semibold text-gray-900 font-display">
                    Order Status Breakdown
                  </h2>
                  <p className="text-xs text-gray-500">
                    Distribution of all incoming and fulfilled customer purchases.
                  </p>
                </div>
                <Link
                  to="/admin/orders"
                  className="text-xs font-semibold text-primary-900 hover:underline"
                >
                  View All
                </Link>
              </div>

              <div className="space-y-3">
                {[
                  { key: 'pending', label: 'Pending', color: 'bg-amber-100 text-amber-800 border-amber-200' },
                  { key: 'processing', label: 'Processing', color: 'bg-blue-100 text-blue-800 border-blue-200' },
                  { key: 'shipped', label: 'Shipped', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
                  { key: 'delivered', label: 'Delivered', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
                  { key: 'cancelled', label: 'Cancelled', color: 'bg-rose-100 text-rose-800 border-rose-200' },
                ].map(({ key, label, color }) => {
                  const count = orderStatusCounts[key] ?? 0;
                  const percentage = totalOrders > 0 ? Math.round((count / totalOrders) * 100) : 0;

                  return (
                    <div key={key} className="flex items-center justify-between p-3 rounded-xl bg-gray-50/70 border border-gray-100">
                      <div className="flex items-center gap-2.5">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border ${color}`}>
                          {label}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-400">{percentage}%</span>
                        <span className="font-bold text-gray-900 text-sm">{count}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Payment Methods & Quick Operations */}
            <div className="space-y-6">
              {/* Payment Methods */}
              <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-sm">
                <h2 className="text-base font-semibold text-gray-900 font-display mb-1">
                  Payment Channels
                </h2>
                <p className="text-xs text-gray-500 mb-4">
                  Breakdown by customer payment preference.
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-200/60">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Cash on Delivery (COD)
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-2 font-display">
                      {formatNumber(codOrders)}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5">Pay upon handover</p>
                  </div>

                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-200/60">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Razorpay Online
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-2 font-display">
                      {formatNumber(razorpayOrders)}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5">Instant online payment</p>
                  </div>
                </div>
              </div>

              {/* Quick Administrative Shortcuts */}
              <div className="bg-[#17231e] rounded-2xl p-6 text-white shadow-md">
                <h3 className="font-display text-lg font-semibold text-white mb-1">
                  Store Management Navigation
                </h3>
                <p className="text-xs text-gray-400 mb-4">
                  Quick access to administrative departments.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-semibold">
                  <Link
                    to="/admin/products"
                    className="p-2.5 rounded-xl bg-[#264c3d]/60 hover:bg-[#264c3d] text-center text-gray-200 hover:text-white transition"
                  >
                    Products
                  </Link>
                  <Link
                    to="/admin/categories"
                    className="p-2.5 rounded-xl bg-[#264c3d]/60 hover:bg-[#264c3d] text-center text-gray-200 hover:text-white transition"
                  >
                    Categories
                  </Link>
                  <Link
                    to="/admin/orders"
                    className="p-2.5 rounded-xl bg-[#264c3d]/60 hover:bg-[#264c3d] text-center text-gray-200 hover:text-white transition"
                  >
                    Orders
                  </Link>
                  <Link
                    to="/admin/receipts"
                    className="p-2.5 rounded-xl bg-[#264c3d]/60 hover:bg-[#264c3d] text-center text-gray-200 hover:text-white transition"
                  >
                    Receipts
                  </Link>
                  <Link
                    to="/admin/users"
                    className="p-2.5 rounded-xl bg-[#264c3d]/60 hover:bg-[#264c3d] text-center text-gray-200 hover:text-white transition"
                  >
                    Customers
                  </Link>
                  <Link
                    to="/"
                    className="p-2.5 rounded-xl bg-[#305f4b] hover:bg-[#40785f] text-center text-white transition"
                  >
                    View Store ↗
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;