import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  useAddresses,
  useAddAddress,
  useUpdateAddress,
  useDeleteAddress,
} from '../hooks/useUser';

// Backend-aligned validation schema
const addressSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, 'Full name must be at least 2 characters'),
  phone: z
    .string()
    .trim()
    .min(10, 'Please enter a valid phone number (at least 10 digits)'),
  addressLine1: z
    .string()
    .trim()
    .min(3, 'Address line 1 is required (at least 3 characters)'),
  addressLine2: z
    .string()
    .trim()
    .optional(),
  city: z
    .string()
    .trim()
    .min(2, 'City is required'),
  state: z
    .string()
    .trim()
    .min(2, 'State is required'),
  pincode: z
    .string()
    .trim()
    .min(4, 'Please enter a valid pincode (at least 4 digits)'),
  isDefault: z
    .boolean()
    .optional(),
});

const Addresses = () => {
  const { data: addressData, isLoading, isError, error, refetch } = useAddresses();
  const addAddressMutation = useAddAddress();
  const updateAddressMutation = useUpdateAddress();
  const deleteAddressMutation = useDeleteAddress();

  const [isAdding, setIsAdding] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [formError, setFormError] = useState('');
  const [successBanner, setSuccessBanner] = useState('');

  const addresses = addressData?.addresses || [];

  // Form handling
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      fullName: '',
      phone: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      pincode: '',
      isDefault: false,
    },
  });

  const openAddForm = () => {
    setEditingAddress(null);
    setIsAdding(true);
    setFormError('');
    reset({
      fullName: '',
      phone: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      pincode: '',
      isDefault: addresses.length === 0, // Auto-default if first address
    });
  };

  const openEditForm = (addr) => {
    setIsAdding(false);
    setEditingAddress(addr);
    setFormError('');
    reset({
      fullName: addr.fullName || '',
      phone: addr.phone || '',
      addressLine1: addr.addressLine1 || '',
      addressLine2: addr.addressLine2 || '',
      city: addr.city || '',
      state: addr.state || '',
      pincode: addr.pincode || '',
      isDefault: !!addr.isDefault,
    });
  };

  const closeForm = () => {
    setIsAdding(false);
    setEditingAddress(null);
    setFormError('');
  };

  const onSubmit = (data) => {
    setFormError('');
    setSuccessBanner('');

    if (editingAddress) {
      updateAddressMutation.mutate(
        { addressId: editingAddress._id, data },
        {
          onSuccess: () => {
            setSuccessBanner('Address updated successfully.');
            closeForm();
            setTimeout(() => setSuccessBanner(''), 4000);
          },
          onError: (err) => {
            setFormError(err.response?.data?.message || err.message || 'Failed to update address');
          },
        }
      );
    } else {
      addAddressMutation.mutate(data, {
        onSuccess: () => {
          setSuccessBanner('Address added successfully.');
          closeForm();
          setTimeout(() => setSuccessBanner(''), 4000);
        },
        onError: (err) => {
          setFormError(err.response?.data?.message || err.message || 'Failed to add address');
        },
      });
    }
  };

  const handleDelete = (addressId) => {
    if (deleteAddressMutation.isPending) return;
    if (window.confirm('Are you sure you want to remove this address?')) {
      setDeletingId(addressId);
      deleteAddressMutation.mutate(addressId, {
        onSuccess: () => {
          setDeletingId(null);
          setSuccessBanner('Address deleted successfully.');
          setTimeout(() => setSuccessBanner(''), 4000);
        },
        onError: (err) => {
          setDeletingId(null);
          alert(err.response?.data?.message || 'Failed to delete address');
        },
      });
    }
  };

  const handleSetDefault = (addressId) => {
    if (updateAddressMutation.isPending) return;
    updateAddressMutation.mutate(
      { addressId, data: { isDefault: true } },
      {
        onSuccess: () => {
          setSuccessBanner('Default address updated.');
          setTimeout(() => setSuccessBanner(''), 3000);
        },
        onError: (err) => {
          alert(err.response?.data?.message || 'Failed to set default address');
        },
      }
    );
  };

  const isSubmitting = addAddressMutation.isPending || updateAddressMutation.isPending;

  return (
    <div className="min-h-screen bg-[#fbfaf7] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Navigation Breadcrumbs / Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
              <Link to="/profile" className="hover:text-primary-900 transition-colors">
                Profile
              </Link>
              <span>/</span>
              <span className="text-primary-900">Saved Addresses</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-semibold text-primary-900">
              Manage Addresses
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Add and manage your shipping destinations for faster checkout.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/profile"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-gray-200 rounded-full text-xs font-semibold text-gray-700 bg-white hover:border-gray-400 transition shadow-sm"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Profile
            </Link>
            <Link
              to="/orders"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-gray-200 rounded-full text-xs font-semibold text-gray-700 bg-white hover:border-gray-400 transition shadow-sm"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              My Orders
            </Link>
          </div>
        </div>

        {/* Success Banner */}
        {successBanner && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>{successBanner}</span>
            </div>
            <button
              onClick={() => setSuccessBanner('')}
              className="text-emerald-700 hover:text-emerald-900 text-xs font-semibold"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="bg-white rounded-2xl border border-black/5 p-12 text-center shadow-sm">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-primary-900 border-r-transparent mb-3" />
            <p className="text-sm font-medium text-gray-500">Loading your addresses...</p>
          </div>
        )}

        {/* Error State */}
        {isError && !isLoading && (
          <div className="bg-white rounded-2xl border border-red-200 p-8 text-center shadow-sm">
            <p className="text-sm text-red-600 font-medium mb-3">
              {error?.response?.data?.message || 'Unable to fetch your addresses right now.'}
            </p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-primary-900 text-white rounded-full text-xs font-semibold hover:bg-primary-800 transition"
            >
              Retry
            </button>
          </div>
        )}

        {/* Add / Edit Form Card */}
        {(isAdding || editingAddress) && (
          <div className="mb-8 bg-white rounded-2xl border border-primary-200/60 p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-primary-900 font-display">
                {editingAddress ? 'Edit Address' : 'Add New Address'}
              </h2>
              <button
                type="button"
                onClick={closeForm}
                className="text-gray-400 hover:text-gray-600 text-sm p-1"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">
                    Full Name *
                  </label>
                  <input
                    {...register('fullName')}
                    type="text"
                    placeholder="Recipient's name"
                    className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900 transition"
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-xs text-red-600">{errors.fullName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">
                    Phone Number *
                  </label>
                  <input
                    {...register('phone')}
                    type="tel"
                    placeholder="10-digit mobile number"
                    className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900 transition"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">
                  Address Line 1 (House No., Building, Street) *
                </label>
                <input
                  {...register('addressLine1')}
                  type="text"
                  placeholder="Street address or P.O. Box"
                  className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900 transition"
                />
                {errors.addressLine1 && (
                  <p className="mt-1 text-xs text-red-600">{errors.addressLine1.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">
                  Address Line 2 (Apartment, Suite, Unit, Landmark - Optional)
                </label>
                <input
                  {...register('addressLine2')}
                  type="text"
                  placeholder="Apartment, suite, landmark, etc."
                  className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900 transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">
                    City *
                  </label>
                  <input
                    {...register('city')}
                    type="text"
                    placeholder="City"
                    className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900 transition"
                  />
                  {errors.city && (
                    <p className="mt-1 text-xs text-red-600">{errors.city.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">
                    State *
                  </label>
                  <input
                    {...register('state')}
                    type="text"
                    placeholder="State"
                    className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900 transition"
                  />
                  {errors.state && (
                    <p className="mt-1 text-xs text-red-600">{errors.state.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">
                    Pincode / ZIP *
                  </label>
                  <input
                    {...register('pincode')}
                    type="text"
                    placeholder="Pincode"
                    className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900 transition"
                  />
                  {errors.pincode && (
                    <p className="mt-1 text-xs text-red-600">{errors.pincode.message}</p>
                  )}
                </div>
              </div>

              <div className="pt-2">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    {...register('isDefault')}
                    type="checkbox"
                    className="rounded border-gray-300 text-primary-900 focus:ring-primary-900 h-4 w-4"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Set as default delivery address
                  </span>
                </label>
              </div>

              {formError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
                  {formError}
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-full border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-full bg-primary-900 text-white text-sm font-semibold hover:bg-primary-800 transition disabled:opacity-50 shadow-sm"
                >
                  {isSubmitting
                    ? 'Saving...'
                    : editingAddress
                    ? 'Update Address'
                    : 'Save Address'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Address Cards List */}
        {!isLoading && !isError && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-900">
                Saved Locations ({addresses.length})
              </h2>
              {!isAdding && !editingAddress && (
                <button
                  onClick={openAddForm}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-900 text-white rounded-full text-xs font-semibold hover:bg-primary-800 transition shadow-sm"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add New Address
                </button>
              )}
            </div>

            {/* Empty State */}
            {addresses.length === 0 && !isAdding && (
              <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center text-primary-900 mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-1">No addresses saved yet</h3>
                <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">
                  Add your shipping address so you can breeze through checkout when ordering.
                </p>
                <button
                  onClick={openAddForm}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-900 text-white rounded-full text-xs font-semibold hover:bg-primary-800 transition shadow-sm"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Your First Address
                </button>
              </div>
            )}

            {/* Grid of Address Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map((addr) => {
                const isItemDefault = !!addr.isDefault;
                const isItemDeleting = deletingId === addr._id;

                return (
                  <div
                    key={addr._id}
                    className={`bg-white rounded-2xl border p-5 transition relative flex flex-col justify-between ${
                      isItemDefault
                        ? 'border-primary-800/40 shadow-sm ring-1 ring-primary-900/10'
                        : 'border-black/5 hover:border-gray-300'
                    }`}
                  >
                    <div>
                      {/* Header with default badge */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-gray-900 text-base">
                            {addr.fullName}
                          </h3>
                          {isItemDefault && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary-50 text-primary-900 border border-primary-200">
                              Default
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Details */}
                      <div className="space-y-1 text-sm text-gray-600">
                        <p className="flex items-center gap-1.5 text-xs font-medium text-gray-700">
                          <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          {addr.phone}
                        </p>
                        <p className="pt-1">
                          {addr.addressLine1}
                          {addr.addressLine2 ? `, ${addr.addressLine2}` : ''}
                        </p>
                        <p className="font-medium text-gray-800">
                          {addr.city}, {addr.state} — {addr.pincode}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-semibold">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => openEditForm(addr)}
                          className="text-primary-900 hover:text-primary-700 transition"
                        >
                          Edit
                        </button>
                        <span className="text-gray-300">|</span>
                        <button
                          type="button"
                          onClick={() => handleDelete(addr._id)}
                          disabled={isItemDeleting}
                          className="text-red-600 hover:text-red-800 transition disabled:opacity-50"
                        >
                          {isItemDeleting ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>

                      {!isItemDefault && (
                        <button
                          type="button"
                          onClick={() => handleSetDefault(addr._id)}
                          disabled={updateAddressMutation.isPending}
                          className="text-gray-500 hover:text-primary-900 transition disabled:opacity-50"
                        >
                          Set as Default
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Addresses;
