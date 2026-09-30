import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../context/AuthContext';
import {
  useProfile,
  useUpdateProfile,
  useChangePassword,
  useAddresses,
  useAddAddress,
  useDeleteAddress,
} from '../hooks/useUser';
import AddressForm from '../components/AddressForm';

// ── Schemas ──────────────────────────────────────────────────────────────────

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(6, 'Must be at least 6 characters'),
  newPassword: z.string().min(6, 'Must be at least 6 characters'),
});

// ── Reusable Field ────────────────────────────────────────────────────────────

const Field = ({ label, children, error }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    {children}
    {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
  </div>
);

const inputCls = 'block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition';
const inputDisabledCls = `${inputCls} bg-gray-50 text-gray-400 cursor-not-allowed`;

// ── Component ─────────────────────────────────────────────────────────────────

const Profile = () => {
  const { logout } = useAuth();

  const { data: profileData, isLoading: isProfileLoading } = useProfile();
  const { data: addressData, isLoading: isAddressLoading } = useAddresses();

  const updateProfileMutation = useUpdateProfile();
  const changePasswordMutation = useChangePassword();
  const deleteAddressMutation = useDeleteAddress();

  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' });
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [isAddingAddress, setIsAddingAddress] = useState(false);

  // Profile form
  const {
    register: regProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
    reset: resetProfile,
  } = useForm({ resolver: zodResolver(profileSchema) });

  // Populate form when data loads
  useEffect(() => {
    if (profileData?.user) {
      resetProfile({
        name: profileData.user.name || '',
        phone: profileData.user.phone || '',
      });
    }
  }, [profileData, resetProfile]);

  // Password form
  const {
    register: regPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm({ resolver: zodResolver(passwordSchema) });

  const onProfileSubmit = (data) => {
    setProfileMsg({ type: '', text: '' });
    updateProfileMutation.mutate(data, {
      onSuccess: () => setProfileMsg({ type: 'success', text: 'Profile updated successfully.' }),
      onError: (err) => setProfileMsg({ type: 'error', text: err?.response?.data?.message || err.message }),
    });
  };

  const onPasswordSubmit = (data) => {
    setPasswordMsg({ type: '', text: '' });
    changePasswordMutation.mutate(data, {
      onSuccess: () => {
        setPasswordMsg({ type: 'success', text: 'Password changed successfully.' });
        resetPassword();
      },
      onError: (err) => setPasswordMsg({ type: 'error', text: err?.response?.data?.message || err.message }),
    });
  };

  const handleDeleteAddress = (id) => {
    if (window.confirm('Delete this address? This cannot be undone.')) {
      deleteAddressMutation.mutate(id);
    }
  };

  // ── Loading ────────────────────────────────────────────────────────────────

  if (isProfileLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    );
  }

  const user = profileData?.user;
  const addresses = addressData?.addresses || [];

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">

        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Account</h1>
            <p className="text-sm text-gray-400 mt-0.5">{user?.email}</p>
          </div>
          <button
            onClick={logout}
            className="text-sm font-medium text-red-600 hover:text-red-800 transition"
          >
            Sign out
          </button>
        </div>

        {/* Quick Nav */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Link
            to="/profile/addresses"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:border-indigo-400 hover:text-indigo-600 transition shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Addresses
          </Link>
          <Link
            to="/profile/change-password"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:border-indigo-400 hover:text-indigo-600 transition shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
            Change Password
          </Link>
          <Link
            to="/orders"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:border-indigo-400 hover:text-indigo-600 transition shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            My Orders
          </Link>
          <Link
            to="/wishlist"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:border-indigo-400 hover:text-indigo-600 transition shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            Wishlist
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Left Column ─────────────────────────────────────────────────── */}
          <div className="space-y-6">

            {/* Profile Details */}
            <section className="bg-white rounded-xl border border-gray-200 shadow-sm px-6 py-6">
              <h2 className="text-base font-semibold text-gray-900 mb-5">Profile Details</h2>
              <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-4">
                <Field label="Email (read-only)">
                  <input type="text" disabled value={user?.email || ''} className={inputDisabledCls} />
                </Field>
                <Field label="Full Name" error={profileErrors.name?.message}>
                  <input {...regProfile('name')} type="text" className={inputCls} placeholder="Your full name" />
                </Field>
                <Field label="Phone" error={profileErrors.phone?.message}>
                  <input {...regProfile('phone')} type="text" className={inputCls} placeholder="Phone number" />
                </Field>

                {profileMsg.text && (
                  <p className={`text-sm ${profileMsg.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>
                    {profileMsg.text}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={updateProfileMutation.isPending}
                  className="w-full bg-indigo-600 text-white px-4 py-2.5 rounded-lg font-semibold text-sm hover:bg-indigo-700 transition disabled:opacity-50"
                >
                  {updateProfileMutation.isPending ? 'Saving…' : 'Update Profile'}
                </button>
              </form>
            </section>

            {/* Change Password */}
            <section className="bg-white rounded-xl border border-gray-200 shadow-sm px-6 py-6">
              <h2 className="text-base font-semibold text-gray-900 mb-5">Change Password</h2>
              <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
                <Field label="Current Password" error={passwordErrors.currentPassword?.message}>
                  <input {...regPassword('currentPassword')} type="password" className={inputCls} placeholder="••••••••" />
                </Field>
                <Field label="New Password" error={passwordErrors.newPassword?.message}>
                  <input {...regPassword('newPassword')} type="password" className={inputCls} placeholder="••••••••" />
                </Field>

                {passwordMsg.text && (
                  <p className={`text-sm ${passwordMsg.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>
                    {passwordMsg.text}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={changePasswordMutation.isPending}
                  className="w-full bg-gray-800 text-white px-4 py-2.5 rounded-lg font-semibold text-sm hover:bg-gray-900 transition disabled:opacity-50"
                >
                  {changePasswordMutation.isPending ? 'Updating…' : 'Update Password'}
                </button>
              </form>
            </section>
          </div>

          {/* ── Right Column — Addresses ─────────────────────────────────── */}
          <div className="lg:col-span-2">
            <section className="bg-white rounded-xl border border-gray-200 shadow-sm px-6 py-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-base font-semibold text-gray-900">Saved Addresses</h2>
                {!isAddingAddress && (
                  <button
                    onClick={() => { setIsAddingAddress(true); setEditingAddressId(null); }}
                    className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition"
                  >
                    + Add Address
                  </button>
                )}
              </div>

              {/* Add new address form */}
              {isAddingAddress && (
                <div className="mb-6 p-4 rounded-xl border border-indigo-200 bg-indigo-50/30">
                  <h3 className="font-semibold text-gray-900 mb-4 text-sm">New Address</h3>
                  <AddressForm
                    onCancel={() => setIsAddingAddress(false)}
                    onSuccess={() => setIsAddingAddress(false)}
                  />
                </div>
              )}

              {/* Loading */}
              {isAddressLoading && (
                <div className="py-10 text-center text-gray-400 text-sm">Loading addresses…</div>
              )}

              {/* Empty */}
              {!isAddressLoading && addresses.length === 0 && !isAddingAddress && (
                <div className="py-14 text-center rounded-xl bg-gray-50 border border-dashed border-gray-300">
                  <svg className="w-10 h-10 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p className="text-sm text-gray-400">No saved addresses yet.</p>
                </div>
              )}

              {/* Address list */}
              <div className="space-y-4">
                {addresses.map((addr) => (
                  <div
                    key={addr._id}
                    className={`rounded-xl border p-4 transition ${addr.isDefault ? 'border-indigo-300 bg-indigo-50/20' : 'border-gray-200'}`}
                  >
                    {editingAddressId === addr._id ? (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-4 text-sm">Edit Address</h3>
                        <AddressForm
                          initialData={addr}
                          onCancel={() => setEditingAddressId(null)}
                          onSuccess={() => setEditingAddressId(null)}
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div className="text-sm text-gray-700">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-semibold text-gray-900">{addr.fullName}</span>
                            {addr.isDefault && (
                              <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full font-medium">
                                Default
                              </span>
                            )}
                          </div>
                          <p>{addr.phone}</p>
                          <p className="mt-0.5">{addr.addressLine1}{addr.addressLine2 ? `, ${addr.addressLine2}` : ''}</p>
                          <p>{addr.city}, {addr.state} {addr.pincode}</p>
                        </div>
                        <div className="flex gap-3 sm:flex-col sm:items-end text-sm font-medium">
                          <button
                            onClick={() => { setEditingAddressId(addr._id); setIsAddingAddress(false); }}
                            className="text-indigo-600 hover:text-indigo-800 transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteAddress(addr._id)}
                            disabled={deleteAddressMutation.isPending}
                            className="text-red-600 hover:text-red-800 transition disabled:opacity-50"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
