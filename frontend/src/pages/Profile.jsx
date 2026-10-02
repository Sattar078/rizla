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
  <div className="relative">
    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2 ml-1">{label}</label>
    {children}
    {error && <p className="mt-1.5 ml-1 text-xs font-bold text-red-500">{error}</p>}
  </div>
);

const inputCls = 'block w-full rounded-2xl bg-gray-50/50 border border-gray-200 px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900 transition-all font-semibold text-gray-900 placeholder-gray-400';
const inputDisabledCls = `${inputCls} bg-gray-100/50 text-gray-400 cursor-not-allowed border-gray-100`;

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
    <div className="bg-[#fbfaf7] min-h-screen pb-24">
      {/* Premium Header Profile Banner */}
      <div className="bg-primary-900 text-white pt-16 pb-16 px-4 sm:px-6 rounded-b-[3rem] shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-96 h-96 bg-primary-800 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/3 w-64 h-64 bg-primary-800 rounded-full blur-3xl opacity-50"></div>
        
        <div className="max-w-5xl mx-auto relative z-10 flex flex-col md:flex-row items-center md:items-end justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center md:items-center gap-6 text-center md:text-left">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white/10 backdrop-blur border-2 border-white/20 flex items-center justify-center text-3xl sm:text-4xl font-display font-bold shadow-xl">
              {user?.name ? user.name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight">{user?.name || 'Welcome Back'}</h1>
              <p className="text-primary-200 mt-1 font-medium">{user?.email}</p>
              <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-[10px] font-bold uppercase tracking-[0.2em] backdrop-blur border border-white/10 shadow-sm">
                Premium Member
              </div>
            </div>
          </div>
          <button
            onClick={logout}
            className="px-6 py-3 rounded-full bg-white/10 hover:bg-red-500 hover:text-white hover:border-red-500 border border-white/20 transition-all text-xs font-bold tracking-widest uppercase text-white shadow-sm"
          >
            Sign Out
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-8 relative z-20">
        
        {/* Quick Nav Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <Link to="/orders" className="bg-white/90 backdrop-blur rounded-[2rem] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all group flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-primary-50 text-primary-900 flex items-center justify-center mb-3 group-hover:bg-primary-900 group-hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            </div>
            <h3 className="font-bold text-gray-900 text-sm">My Orders</h3>
            <p className="text-xs text-gray-500 mt-1 font-medium">Track & return</p>
          </Link>
          <Link to="/wishlist" className="bg-white/90 backdrop-blur rounded-[2rem] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all group flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-primary-50 text-primary-900 flex items-center justify-center mb-3 group-hover:bg-primary-900 group-hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
            </div>
            <h3 className="font-bold text-gray-900 text-sm">Wishlist</h3>
            <p className="text-xs text-gray-500 mt-1 font-medium">Saved items</p>
          </Link>
          <Link to="/profile/addresses" className="bg-white/90 backdrop-blur rounded-[2rem] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all group flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-primary-50 text-primary-900 flex items-center justify-center mb-3 group-hover:bg-primary-900 group-hover:text-white transition-colors">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </div>
            <h3 className="font-bold text-gray-900 text-sm">Addresses</h3>
            <p className="text-xs text-gray-500 mt-1 font-medium">Manage locations</p>
          </Link>
          <Link to="/profile/change-password" className="bg-white/90 backdrop-blur rounded-[2rem] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all group flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-primary-50 text-primary-900 flex items-center justify-center mb-3 group-hover:bg-primary-900 group-hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
            </div>
            <h3 className="font-bold text-gray-900 text-sm">Security</h3>
            <p className="text-xs text-gray-500 mt-1 font-medium">Password & auth</p>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Left Column ─────────────────────────────────────────────────── */}
          <div className="space-y-8">

            {/* Profile Details */}
            <section className="bg-white/90 backdrop-blur rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white p-6 sm:p-8">
              <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3 tracking-tight">
                <span className="w-1.5 h-6 bg-primary-900 rounded-full"></span> Profile Details
              </h2>
              <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-5">
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
                  <div className={`p-4 rounded-2xl text-sm font-bold flex items-center gap-2 ${profileMsg.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}`}>
                    <span>{profileMsg.type === 'error' ? '!' : '✓'}</span> {profileMsg.text}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={updateProfileMutation.isPending}
                  className="w-full bg-primary-900 text-white px-4 py-4 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-primary-800 transition shadow-lg shadow-primary-900/20 disabled:opacity-50 mt-2"
                >
                  {updateProfileMutation.isPending ? 'Saving…' : 'Save Changes'}
                </button>
              </form>
            </section>

            {/* Change Password */}
            <section className="bg-white/90 backdrop-blur rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white p-6 sm:p-8">
              <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3 tracking-tight">
                <span className="w-1.5 h-6 bg-gray-900 rounded-full"></span> Change Password
              </h2>
              <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-5">
                <Field label="Current Password" error={passwordErrors.currentPassword?.message}>
                  <input {...regPassword('currentPassword')} type="password" className={inputCls} placeholder="••••••••" />
                </Field>
                <Field label="New Password" error={passwordErrors.newPassword?.message}>
                  <input {...regPassword('newPassword')} type="password" className={inputCls} placeholder="••••••••" />
                </Field>

                {passwordMsg.text && (
                  <div className={`p-4 rounded-2xl text-sm font-bold flex items-center gap-2 ${passwordMsg.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}`}>
                    <span>{passwordMsg.type === 'error' ? '!' : '✓'}</span> {passwordMsg.text}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={changePasswordMutation.isPending}
                  className="w-full bg-gray-900 text-white px-4 py-4 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-gray-800 transition shadow-lg shadow-gray-900/20 disabled:opacity-50 mt-2"
                >
                  {changePasswordMutation.isPending ? 'Updating…' : 'Update Password'}
                </button>
              </form>
            </section>
          </div>

          {/* ── Right Column — Addresses ─────────────────────────────────── */}
          <div className="lg:col-span-2">
            <section className="bg-white/90 backdrop-blur rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white p-6 sm:p-8 h-full">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                <h2 className="text-xl font-black text-gray-900 flex items-center gap-3 tracking-tight">
                  <span className="w-1.5 h-6 bg-primary-500 rounded-full"></span> Saved Addresses
                </h2>
                {!isAddingAddress && (
                  <button
                    onClick={() => { setIsAddingAddress(true); setEditingAddressId(null); }}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-primary-50 text-primary-900 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-primary-100 transition"
                  >
                    + Add New
                  </button>
                )}
              </div>

              {/* Add new address form */}
              {isAddingAddress && (
                <div className="mb-8 p-6 rounded-[2rem] border border-primary-100 bg-primary-50/30 relative">
                  <button onClick={() => setIsAddingAddress(false)} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white text-gray-500 shadow-sm hover:text-red-500 transition">✕</button>
                  <h3 className="font-black text-gray-900 mb-6 text-lg tracking-tight">Add New Address</h3>
                  <AddressForm
                    onCancel={() => setIsAddingAddress(false)}
                    onSuccess={() => setIsAddingAddress(false)}
                  />
                </div>
              )}

              {/* Loading */}
              {isAddressLoading && (
                <div className="py-16 text-center">
                  <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-primary-900" />
                  <p className="mt-4 font-bold text-gray-500">Loading your addresses...</p>
                </div>
              )}

              {/* Empty */}
              {!isAddressLoading && addresses.length === 0 && !isAddingAddress && (
                <div className="py-20 text-center rounded-[2rem] bg-gray-50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-300 mb-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">No addresses saved</h3>
                  <p className="text-sm font-medium text-gray-500 mt-1 max-w-xs mx-auto">Add an address for faster checkout and deliveries.</p>
                </div>
              )}

              {/* Address list */}
              <div className="space-y-5">
                {addresses.map((addr) => (
                  <div
                    key={addr._id}
                    className={`rounded-[2rem] border p-6 transition-all relative overflow-hidden group ${addr.isDefault ? 'border-primary-200 bg-primary-50/20 shadow-sm' : 'border-gray-100 hover:border-gray-300'}`}
                  >
                    {addr.isDefault && (
                      <div className="absolute top-0 right-0 bg-primary-900 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-bl-xl">
                        Default
                      </div>
                    )}
                    
                    {editingAddressId === addr._id ? (
                      <div>
                        <h3 className="font-black text-gray-900 mb-6 text-lg tracking-tight">Edit Address</h3>
                        <AddressForm
                          initialData={addr}
                          onCancel={() => setEditingAddressId(null)}
                          onSuccess={() => setEditingAddressId(null)}
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pt-2">
                        <div className="text-[13px] font-medium text-gray-600 space-y-1">
                          <p className="text-lg font-black text-gray-900 mb-2">{addr.fullName}</p>
                          <p className="flex items-center gap-2"><svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg> {addr.phone}</p>
                          <p className="flex items-start gap-2 mt-2"><svg className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg> <span>{addr.addressLine1}{addr.addressLine2 ? `, ${addr.addressLine2}` : ''}<br/>{addr.city}, {addr.state} {addr.pincode}</span></p>
                        </div>
                        <div className="flex gap-2 sm:flex-col sm:items-end mt-4 sm:mt-0">
                          <button
                            onClick={() => { setEditingAddressId(addr._id); setIsAddingAddress(false); }}
                            className="px-4 py-2 rounded-full bg-gray-100 text-gray-900 text-xs font-bold uppercase tracking-wider hover:bg-gray-200 transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteAddress(addr._id)}
                            disabled={deleteAddressMutation.isPending}
                            className="px-4 py-2 rounded-full bg-red-50 text-red-600 text-xs font-bold uppercase tracking-wider hover:bg-red-100 transition disabled:opacity-50"
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
