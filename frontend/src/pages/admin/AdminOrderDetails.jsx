import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { adminApi } from '../../services/admin.api';

const statuses = ['pending', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled'];

const AdminOrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [status, setStatus] = useState('');
  
  const { data, isLoading, isError } = useQuery({ 
    queryKey: ['adminOrder', orderId], 
    queryFn: () => adminApi.getOrder(orderId),
    retry: 1
  });
  
  const order = data?.order || data?.data?.order || data?.data;
  
  useEffect(() => {
    if (order && !status) {
        setStatus(order.orderStatus);
    }
  }, [order]);

  const mutation = useMutation({ 
    mutationFn: (orderStatus) => adminApi.updateOrderStatus({ orderId, data: { status: orderStatus } }), 
    onSuccess: () => { 
        queryClient.invalidateQueries({ queryKey: ['adminOrder', orderId] }); 
        queryClient.invalidateQueries({ queryKey: ['adminOrders'] }); 
        alert("Order status updated successfully");
    },
    onError: (err) => {
        alert(err.response?.data?.message || "Failed to update order status");
        setStatus(order?.orderStatus);
    }
  });

  return (
    <section>
      <Link to="/admin/orders" className="text-sm font-semibold text-primary-800 hover:underline">
        ← Back to Orders
      </Link>
      
      {isLoading ? (
        <div className="mt-8 space-y-6 animate-pulse">
            <div className="h-12 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded w-full"></div>
        </div>
      ) : isError || !order ? (
        <div className="mt-8 rounded-xl bg-red-50 p-6 text-red-700 border border-red-100 flex flex-col items-start gap-4">
            <p className="font-semibold">Order details could not be loaded or order not found.</p>
            <button onClick={() => navigate('/admin/orders')} className="bg-white px-4 py-2 rounded-lg text-sm font-medium border border-red-200 hover:bg-red-50">Go Back</button>
        </div>
      ) : (
        <>
          <div className="mb-7 mt-5 flex flex-wrap items-end justify-between gap-4 border-b border-gray-200 pb-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-700">
                Order #{String(order._id).slice(-8).toUpperCase()}
              </p>
              <h1 className="mt-2 font-display text-3xl font-semibold text-gray-900">
                Order Details
              </h1>
              <p className="text-sm text-gray-500 mt-2">Placed on {new Date(order.createdAt).toLocaleString('en-IN')}</p>
            </div>
            
            <form 
              onSubmit={(event) => { 
                event.preventDefault(); 
                if (status && status !== order.orderStatus) mutation.mutate(status); 
              }} 
              className="flex gap-2 items-center bg-white p-3 rounded-2xl border border-gray-200 shadow-sm"
            >
              <label htmlFor="order-status" className="text-sm font-medium text-gray-700 mr-2">Status:</label>
              <select 
                id="order-status" 
                value={status} 
                onChange={(event) => setStatus(event.target.value)} 
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 capitalize text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              >
                {statuses.map((value) => (
                  <option key={value} value={value}>{value}</option>
                ))}
              </select>
              <button 
                type="submit"
                disabled={mutation.isPending || status === order.orderStatus} 
                className="rounded-lg bg-primary-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-800 transition"
              >
                {mutation.isPending ? 'Updating...' : 'Update'}
              </button>
            </form>
          </div>
          
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
                <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <h2 className="font-semibold text-gray-900">Order Items</h2>
                </div>
                <div className="p-6 divide-y divide-gray-100">
                    {(order.items || []).map((item, index) => (
                    <div key={item._id || index} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                        {item.image && (
                            <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg bg-gray-100" />
                        )}
                        <div className="flex-1">
                            <p className="font-semibold text-gray-900">{item.name}</p>
                            <p className="mt-1 text-sm text-gray-500">
                                {item.size && item.color ? `${item.size} / ${item.color}` : 'Standard'}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="font-semibold text-gray-900">₹{Number(item.price).toLocaleString('en-IN')}</p>
                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                        <div className="text-right min-w-[100px]">
                            <p className="font-bold text-primary-900">₹{Number(item.price * item.quantity).toLocaleString('en-IN')}</p>
                        </div>
                    </div>
                    ))}
                    {order.items?.length === 0 && <p className="text-gray-500">No items found.</p>}
                </div>
                <div className="bg-gray-50 p-6 border-t border-gray-200 flex justify-between items-center text-lg">
                    <span className="font-medium text-gray-700">Total Amount</span>
                    <span className="font-display font-bold text-gray-900 text-xl">₹{Number(order.totalAmount || 0).toLocaleString('en-IN')}</span>
                </div>
                </div>
            </div>
            
            <div className="space-y-6">
              <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <h2 className="font-semibold text-gray-900">Customer Info</h2>
                </div>
                <div className="p-6 text-sm">
                    {order.user ? (
                        <div className="space-y-3">
                            <div>
                                <p className="text-gray-500 text-xs uppercase font-semibold">Name</p>
                                <p className="font-medium text-gray-900">{order.user.name}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs uppercase font-semibold">Email</p>
                                <p className="font-medium text-gray-900">{order.user.email}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs uppercase font-semibold">Phone</p>
                                <p className="font-medium text-gray-900">{order.user.phone || 'N/A'}</p>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-500">Guest Checkout or Deleted User</p>
                    )}
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <h2 className="font-semibold text-gray-900">Shipping Address</h2>
                </div>
                <div className="p-6 text-sm">
                    <p className="font-medium text-gray-900 mb-2">{order.shippingAddress?.fullName}</p>
                    <p className="text-gray-600 leading-relaxed">
                        {order.shippingAddress?.addressLine1}
                        {order.shippingAddress?.addressLine2 && <><br />{order.shippingAddress.addressLine2}</>}
                        <br />
                        {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.pincode}
                    </p>
                    <p className="mt-3 font-medium text-gray-900">Phone: {order.shippingAddress?.phone}</p>
                </div>
              </div>
              
              <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <h2 className="font-semibold text-gray-900">Payment Details</h2>
                </div>
                <div className="p-6 text-sm space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-500">Method</span>
                        <span className="font-medium uppercase text-gray-900 bg-gray-100 px-2 py-1 rounded">{order.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-500">Status</span>
                        <span className={`font-medium capitalize px-2 py-1 rounded ${
                            order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                            {order.paymentStatus}
                        </span>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default AdminOrderDetails;