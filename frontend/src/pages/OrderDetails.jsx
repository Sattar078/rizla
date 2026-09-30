import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useOrderById, useCancelOrder } from '../hooks/useOrder';

// Mirror the backend's CANCELLABLE_STATUSES exactly
const CANCELLABLE_STATUSES = ['pending', 'confirmed', 'packed'];

const statusColors = {
  pending:   'bg-yellow-100 text-yellow-800 border-yellow-200',
  confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
  packed:    'bg-indigo-100 text-indigo-800 border-indigo-200',
  shipped:   'bg-purple-100 text-purple-800 border-purple-200',
  delivered: 'bg-green-100 text-green-800 border-green-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
};

const paymentStatusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid:    'bg-green-100 text-green-800',
  failed:  'bg-red-100 text-red-800',
};

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError, error, refetch } = useOrderById(orderId);
  const cancelOrderMutation = useCancelOrder();
  const [cancelError, setCancelError] = useState('');

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="bg-red-100 rounded-full p-4 mb-6 inline-flex">
          <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M12 2a10 10 0 110 20A10 10 0 0112 2z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-3">Could Not Load Order</h2>
        <p className="text-gray-500 mb-6">{error?.response?.data?.message || 'Something went wrong.'}</p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => refetch()} className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition font-medium text-sm">
            Try Again
          </button>
          <Link to="/orders" className="bg-white border border-gray-300 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-50 transition font-medium text-sm">
            My Orders
          </Link>
        </div>
      </div>
    );
  }

  const order = data?.order;

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h2>
        <Link to="/orders" className="text-indigo-600 hover:underline font-medium">
          ← Back to My Orders
        </Link>
      </div>
    );
  }

  const isCancellable = CANCELLABLE_STATUSES.includes(order.orderStatus?.toLowerCase());

  const handleCancel = () => {
    if (!window.confirm('Are you sure you want to cancel this order? This cannot be undone.')) return;
    setCancelError('');
    cancelOrderMutation.mutate(orderId, {
      onSuccess: () => {
        // Cache is invalidated by the hook; refetch to show updated status
        refetch();
      },
      onError: (err) => {
        setCancelError(err?.response?.data?.message || 'Failed to cancel order. Please try again.');
      },
    });
  };

  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  const addr = order.shippingAddress;

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">

        {/* Breadcrumb + Header */}
        <div className="mb-8">
          <Link to="/orders" className="text-sm font-medium text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1 mb-3">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to My Orders
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
              <p className="text-sm text-gray-400 mt-1">Placed on {formattedDate}</p>
              <p className="text-xs font-mono text-gray-500 mt-0.5 break-all">#{order._id}</p>
            </div>
            <div className="flex flex-wrap gap-2 shrink-0">
              <Link
                to={`/orders/${orderId}/receipt`}
                className="inline-flex items-center gap-1.5 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition"
              >
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                View Receipt
              </Link>
              {isCancellable && (
                <button
                  onClick={handleCancel}
                  disabled={cancelOrderMutation.isPending}
                  className="inline-flex items-center gap-1.5 px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition disabled:opacity-50"
                >
                  {cancelOrderMutation.isPending ? 'Cancelling…' : 'Cancel Order'}
                </button>
              )}
            </div>
          </div>
        </div>

        {cancelError && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {cancelError}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left — Items + Status */}
          <div className="lg:col-span-2 space-y-6">

            {/* Status badges */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-6 py-5">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Status</h2>
              <div className="flex flex-wrap gap-3">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold capitalize border ${statusColors[order.orderStatus] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                  {order.orderStatus}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${paymentStatusColors[order.paymentStatus] || 'bg-gray-100 text-gray-700'}`}>
                  Payment: {order.paymentStatus}
                </span>
              </div>
              {order.orderStatus === 'cancelled' && order.cancellationReason && (
                <p className="mt-4 text-sm text-red-700 bg-red-50 rounded-lg px-4 py-3">
                  <span className="font-semibold">Reason: </span>{order.cancellationReason}
                </p>
              )}
            </div>

            {/* Items */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="font-semibold text-gray-900">Items Ordered ({order.items?.length || 0})</h2>
              </div>
              <ul className="divide-y divide-gray-100">
                {(order.items || []).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-4 px-6 py-5">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 rounded-lg object-cover border border-gray-200 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 border border-gray-200">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/products/${item.product}`}
                        className="font-semibold text-gray-900 hover:text-indigo-600 transition text-sm leading-tight line-clamp-2"
                      >
                        {item.name}
                      </Link>
                      <p className="text-xs text-gray-500 mt-1">{item.size} / {item.color}</p>
                      <p className="text-xs text-gray-400 mt-0.5">Qty: {item.quantity} × ₹{item.price?.toFixed(2)}</p>
                    </div>
                    <span className="text-sm font-bold text-gray-800 shrink-0">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Right — Summary + Address */}
          <div className="space-y-6">

            {/* Order Summary */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-6 py-5">
              <h2 className="font-semibold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">₹{order.subtotal?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-medium text-gray-900">Free</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-3 text-base font-bold text-gray-900">
                  <span>Total</span>
                  <span className="text-indigo-600">₹{order.totalAmount?.toFixed(2)}</span>
                </div>
              </div>
              <div className="border-t border-gray-100 mt-4 pt-4">
                <p className="text-xs text-gray-500 mb-1">Payment Method</p>
                <p className="text-sm font-medium text-gray-800 capitalize">
                  {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online (Razorpay)'}
                </p>
              </div>
            </div>

            {/* Delivery Address */}
            {addr && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-6 py-5">
                <h2 className="font-semibold text-gray-900 mb-4">Delivery Address</h2>
                <div className="text-sm text-gray-700 space-y-0.5">
                  <p className="font-semibold text-gray-900">{addr.fullName}</p>
                  <p>{addr.addressLine1}</p>
                  {addr.addressLine2 && <p>{addr.addressLine2}</p>}
                  <p>{addr.city}, {addr.state} – {addr.pincode}</p>
                  <p className="pt-1 font-medium">{addr.phone}</p>
                </div>
              </div>
            )}

            {/* Quick Nav */}
            <div className="flex flex-col gap-2">
              <Link
                to="/products"
                className="text-center w-full bg-indigo-600 text-white px-4 py-2.5 rounded-lg hover:bg-indigo-700 transition font-semibold text-sm"
              >
                Continue Shopping
              </Link>
              <Link
                to="/orders"
                className="text-center w-full bg-white border border-gray-300 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-50 transition font-semibold text-sm"
              >
                All My Orders
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
