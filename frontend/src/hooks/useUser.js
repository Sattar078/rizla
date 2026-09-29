import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '../services/user.api';
import { authApi } from '../services/auth.api';
import { useAuth } from '../context/AuthContext';

export const useProfile = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => userApi.getProfile(),
    enabled: !!user,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { setUser } = useAuth();
  
  return useMutation({
    mutationFn: (data) => userApi.updateProfile(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      // Update global user context immediately for responsiveness
      if (data?.user) {
        setUser(data.user);
      }
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data) => authApi.changePassword(data),
  });
};

export const useAddresses = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['addresses'],
    queryFn: () => userApi.getAddresses(),
    enabled: !!user,
  });
};

export const useAddAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => userApi.addAddress(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    },
  });
};

export const useUpdateAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (args) => userApi.updateAddress(args),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    },
  });
};

export const useDeleteAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (addressId) => userApi.deleteAddress(addressId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    },
  });
};
