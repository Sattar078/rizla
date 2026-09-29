import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAddAddress, useUpdateAddress } from '../hooks/useUser';
import { useState } from 'react';

const addressSchema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  addressLine1: z.string().min(5, 'Address line 1 is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pincode: z.string().min(5, 'Pincode is required'),
  isDefault: z.boolean().optional(),
});

const AddressForm = ({ initialData, onCancel, onSuccess }) => {
  const addAddressMutation = useAddAddress();
  const updateAddressMutation = useUpdateAddress();
  const isEditing = !!initialData;
  const [submitError, setSubmitError] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      fullName: initialData?.fullName || '',
      phone: initialData?.phone || '',
      addressLine1: initialData?.addressLine1 || '',
      addressLine2: initialData?.addressLine2 || '',
      city: initialData?.city || '',
      state: initialData?.state || '',
      pincode: initialData?.pincode || '',
      isDefault: initialData?.isDefault || false,
    }
  });

  const onSubmit = (data) => {
    setSubmitError('');
    if (isEditing) {
      updateAddressMutation.mutate(
        { addressId: initialData._id, data },
        {
          onSuccess: () => {
            if (onSuccess) onSuccess();
          },
          onError: (err) => {
            setSubmitError(err.response?.data?.message || err.message);
          }
        }
      );
    } else {
      addAddressMutation.mutate(data, {
        onSuccess: () => {
          if (onSuccess) onSuccess();
        },
        onError: (err) => {
          setSubmitError(err.response?.data?.message || err.message);
        }
      });
    }
  };

  const isPending = addAddressMutation.isPending || updateAddressMutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input {...register('fullName')} type="text" className="mt-1 block w-full rounded-md border-gray-300 p-2 border focus:border-indigo-500 focus:ring-indigo-500" />
          {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <input {...register('phone')} type="text" className="mt-1 block w-full rounded-md border-gray-300 p-2 border focus:border-indigo-500 focus:ring-indigo-500" />
          {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Address Line 1</label>
        <input {...register('addressLine1')} type="text" className="mt-1 block w-full rounded-md border-gray-300 p-2 border focus:border-indigo-500 focus:ring-indigo-500" />
        {errors.addressLine1 && <p className="mt-1 text-sm text-red-600">{errors.addressLine1.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Address Line 2 (Optional)</label>
        <input {...register('addressLine2')} type="text" className="mt-1 block w-full rounded-md border-gray-300 p-2 border focus:border-indigo-500 focus:ring-indigo-500" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">City</label>
          <input {...register('city')} type="text" className="mt-1 block w-full rounded-md border-gray-300 p-2 border focus:border-indigo-500 focus:ring-indigo-500" />
          {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">State</label>
          <input {...register('state')} type="text" className="mt-1 block w-full rounded-md border-gray-300 p-2 border focus:border-indigo-500 focus:ring-indigo-500" />
          {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Pincode</label>
          <input {...register('pincode')} type="text" className="mt-1 block w-full rounded-md border-gray-300 p-2 border focus:border-indigo-500 focus:ring-indigo-500" />
          {errors.pincode && <p className="mt-1 text-sm text-red-600">{errors.pincode.message}</p>}
        </div>
      </div>

      <div className="flex items-center mt-2">
        <input {...register('isDefault')} id="isDefault" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
        <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-900">
          Set as default address
        </label>
      </div>

      {submitError && (
        <p className="text-sm text-red-600 mt-2">{submitError}</p>
      )}

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={isPending}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
        >
          {isPending ? 'Saving...' : 'Save Address'}
        </button>
      </div>
    </form>
  );
};

export default AddressForm;
