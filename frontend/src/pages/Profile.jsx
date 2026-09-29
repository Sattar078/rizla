import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../context/AuthContext';
import { useProfile, useUpdateProfile, useChangePassword, useAddresses, useAddAddress, useUpdateAddress, useDeleteAddress } from '../hooks/useUser';
import AddressForm from '../components/AddressForm';

// Schemas
const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(6, 'Must be at least 6 characters'),
  newPassword: z.string().min(6, 'Must be at least 6 characters'),
});

const Profile = () => {
  const { logout } = useAuth();
  
  // Queries
  const { data: profileData, isLoading: isProfileLoading } = useProfile();
  const { data: addressData, isLoading: isAddressLoading } = useAddresses();
  
  // Mutations
  const updateProfileMutation = useUpdateProfile();
  const changePasswordMutation = useChangePassword();
  const deleteAddressMutation = useDeleteAddress();

  // State
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' });
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [isAddingAddress, setIsAddingAddress] = useState(false);

  // Profile Form
  const { register: registerProfile, handleSubmit: handleProfileSubmit, formState: { errors: profileErrors }, reset: resetProfile } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      phone: '',
    }
  });

  // Set default values when profile loads
  useEffect(() => {
    if (profileData?.user) {
      resetProfile({
        name: profileData.user.name || '',
        phone: profileData.user.phone || '',
      });
    }
  }, [profileData, resetProfile]);

  // Password Form
  const { register: registerPassword, handleSubmit: handlePasswordSubmit, formState: { errors: passwordErrors }, reset: resetPassword } = useForm({
    resolver: zodResolver(passwordSchema)
  });

  const onProfileSubmit = (data) => {
    setProfileMsg({ type: '', text: '' });
    updateProfileMutation.mutate(data, {
      onSuccess: () => setProfileMsg({ type: 'success', text: 'Profile updated successfully.' }),
      onError: (err) => setProfileMsg({ type: 'error', text: err.response?.data?.message || err.message })
    });
  };

  const onPasswordSubmit = (data) => {
    setPasswordMsg({ type: '', text: '' });
    changePasswordMutation.mutate(data, {
      onSuccess: () => {
        setPasswordMsg({ type: 'success', text: 'Password changed successfully.' });
        resetPassword();
      },
      onError: (err) => setPasswordMsg({ type: 'error', text: err.response?.data?.message || err.message })
    });
  };

  const handleDeleteAddress = (id) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      deleteAddressMutation.mutate(id);
    }
  };

  if (isProfileLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const user = profileData?.user;
  const addresses = addressData?.addresses || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
        <button
          onClick={() => logout()}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition text-sm font-medium"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Profile & Password */}
        <div className="lg:col-span-1 space-y-12">
          
          {/* Profile Section */}
          <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-6">Profile Details</h2>
            <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email (Read Only)</label>
                <input type="text" disabled value={user?.email || ''} className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 p-2 border" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input {...registerProfile('name')} type="text" className="mt-1 block w-full rounded-md border-gray-300 p-2 border focus:ring-indigo-500 focus:border-indigo-500" />
                {profileErrors.name && <p className="mt-1 text-sm text-red-600">{profileErrors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input {...registerProfile('phone')} type="text" className="mt-1 block w-full rounded-md border-gray-300 p-2 border focus:ring-indigo-500 focus:border-indigo-500" />
                {profileErrors.phone && <p className="mt-1 text-sm text-red-600">{profileErrors.phone.message}</p>}
              </div>

              {profileMsg.text && (
                <p className={`text-sm ${profileMsg.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>
                  {profileMsg.text}
                </p>
              )}

              <button
                type="submit"
                disabled={updateProfileMutation.isPending}
                className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition disabled:opacity-50"
              >
                {updateProfileMutation.isPending ? 'Saving...' : 'Update Profile'}
              </button>
            </form>
          </section>

          {/* Password Section */}
          <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-6">Change Password</h2>
            <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Current Password</label>
                <input {...registerPassword('currentPassword')} type="password" className="mt-1 block w-full rounded-md border-gray-300 p-2 border focus:ring-indigo-500 focus:border-indigo-500" />
                {passwordErrors.currentPassword && <p className="mt-1 text-sm text-red-600">{passwordErrors.currentPassword.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">New Password</label>
                <input {...registerPassword('newPassword')} type="password" className="mt-1 block w-full rounded-md border-gray-300 p-2 border focus:ring-indigo-500 focus:border-indigo-500" />
                {passwordErrors.newPassword && <p className="mt-1 text-sm text-red-600">{passwordErrors.newPassword.message}</p>}
              </div>

              {passwordMsg.text && (
                <p className={`text-sm ${passwordMsg.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>
                  {passwordMsg.text}
                </p>
              )}

              <button
                type="submit"
                disabled={changePasswordMutation.isPending}
                className="w-full bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-900 transition disabled:opacity-50"
              >
                {changePasswordMutation.isPending ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </section>

        </div>

        {/* Right Column: Addresses */}
        <div className="lg:col-span-2">
          <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h2 className="text-xl font-semibold">Saved Addresses</h2>
              {!isAddingAddress && (
                <button
                  onClick={() => {
                    setIsAddingAddress(true);
                    setEditingAddressId(null);
                  }}
                  className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-md hover:bg-indigo-100 transition text-sm font-medium"
                >
                  + Add New Address
                </button>
              )}
            </div>

            {isAddressLoading && (
              <div className="py-8 text-center text-gray-500">Loading addresses...</div>
            )}

            {!isAddressLoading && addresses.length === 0 && !isAddingAddress && (
              <div className="py-12 text-center text-gray-500 bg-gray-50 rounded-lg">
                You haven't saved any addresses yet.
              </div>
            )}

            {isAddingAddress && (
              <div className="mb-8 p-4 border rounded-md border-indigo-200 bg-indigo-50/30">
                <h3 className="font-medium text-lg mb-4">Add New Address</h3>
                <AddressForm 
                  onCancel={() => setIsAddingAddress(false)} 
                  onSuccess={() => setIsAddingAddress(false)} 
                />
              </div>
            )}

            <div className="space-y-4">
              {addresses.map((addr) => (
                <div key={addr._id} className={`p-4 border rounded-md ${addr.isDefault ? 'border-indigo-300 bg-indigo-50/10' : 'border-gray-200'}`}>
                  {editingAddressId === addr._id ? (
                    <div className="pt-2">
                      <h3 className="font-medium text-lg mb-4">Edit Address</h3>
                      <AddressForm 
                        initialData={addr} 
                        onCancel={() => setEditingAddressId(null)} 
                        onSuccess={() => setEditingAddressId(null)} 
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900">{addr.fullName}</span>
                          {addr.isDefault && (
                            <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-0.5 rounded-full font-medium">Default</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{addr.phone}</p>
                        <p className="text-sm text-gray-600 mt-1">{addr.addressLine1}</p>
                        {addr.addressLine2 && <p className="text-sm text-gray-600">{addr.addressLine2}</p>}
                        <p className="text-sm text-gray-600">{addr.city}, {addr.state} {addr.pincode}</p>
                      </div>
                      <div className="flex sm:flex-col gap-2">
                        <button
                          onClick={() => {
                            setEditingAddressId(addr._id);
                            setIsAddingAddress(false);
                          }}
                          className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteAddress(addr._id)}
                          disabled={deleteAddressMutation.isPending}
                          className="text-sm text-red-600 hover:text-red-800 font-medium"
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
  );
};

export default Profile;
