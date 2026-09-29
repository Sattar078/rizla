import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { orderApi } from '../services/order.api';

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => orderApi.createOrder(data),
    onSuccess: () => {
      // The backend clears the cart on successful order creation, so we invalidate it
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

export const useCreateRazorpayOrder = () => {
  return useMutation({
    mutationFn: (orderId) => orderApi.createRazorpayOrder(orderId),
  });
};

export const useVerifyRazorpayPayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, data }) => orderApi.verifyRazorpayPayment({ orderId, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

export const useHandlePaymentFailure = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderId) => orderApi.handlePaymentFailure(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

export const useMyOrders = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: () => orderApi.getMyOrders(),
  });
};

export const useOrderById = (orderId) => {
  return useQuery({
    queryKey: ['orders', orderId],
    queryFn: () => orderApi.getOrderById(orderId),
    enabled: !!orderId,
  });
};

export const useCancelOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderId) => orderApi.cancelOrder(orderId),
    onSuccess: (data, orderId) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['orders', orderId] });
    },
  });
};

export const useOrderReceipt = (orderId) => {
  return useQuery({
    queryKey: ['orders', orderId, 'receipt'],
    queryFn: () => orderApi.getOrderReceipt(orderId),
    enabled: !!orderId,
  });
};
