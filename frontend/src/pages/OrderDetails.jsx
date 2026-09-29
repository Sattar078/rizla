import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useOrderById, useCancelOrder } from '../hooks/useOrder';
import ReceiptModal from '../components/ReceiptModal';

const CANCELLABLE_STATUSES = ['pending', 'confirmed', 'packed'];

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  
  const { data, isLoading, isError, error } = useOrderById(orderId);
  const cancelOrderMutation = useCancelOrder();

  const [showReceipt, setShowReceipt] = useState(false);
  const [cancelError, setCancelError] = useState('');

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 p-4 rounded-md text-red-700">
          <h2 className="text-xl font-bold mb-2">Error Loading Order</h2>
          <p>{error?.response?.data?.message || error?.message || 'Something went wrong.'}</p>
          <button onClick={() => navigate('/orders')} className="mt-4 text-indigo-600 hover:underline">
            &larr; Back to Orders
          </button>
        </div>
      </div>
    );
  }

  const order = data?.order;

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h2>
        <Link to="/orders" className="text-indigo-600 hover:underline">
          &larr; Back to Orders
        </Link>
      </div>
    );
  }

  const handleCancel = () => {
    setCancelError('');
    if (window.confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
      cancelOrderMutation.mutate(orderId, {
        onError: (err) => {
          setCancelError(err.response?.data?.message || 'Failed to cancel order.');
        }
      });
    }
  };

  const isCancellable = CANCELLABLE_STATUSES.includes(order.orderStatus.toLowerCase());

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <Link to="/orders" className="text-sm font-medium text-indigo-600 hover:text-indigo-800 mb-2 inline-block">
              &larr; Back to My Orders
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Order #{order._id}</h1>
            <p className="text-gray-500 mt-1">
              Placed on {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowReceipt(true)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg className="mr-2 -ml-1 h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              View Receipt
            </button>
            
            {isCancellable && (
              <button
                onClick={handleCancel}
                disabled={cancelOrderMutation.isPending}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                {cancelOrderMutation.isPending ? 'Cancelling...' : 'Cancel Order'}
              </button>
            )}
          </div>
        </div>

        {cancelError && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
            {cancelError}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Order Info */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Status Card */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-4 border-b pb-2">Status</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Order Status</p>
                  <p className="font-medium text-gray-900 uppercase">{order.orderStatus}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment Status</p>
                  <p className="font-medium text-gray-900 uppercase">{order.paymentStatus}</p>
                </div>
                {order.orderStatus === 'cancelled' && order.cancellationReason && (
                  <div className="sm:col-span-2 mt-2 bg-red-50 p-3 rounded text-sm text-red-700">
                    <span className="font-semibold">Cancellation Reason:</span> {order.cancellationReason}
                  </div>
                )}
              </div>
            </div>

            {/* Items Card */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-4 border-b pb-2">Items Ordered</h2>
              <ul className="divide-y divide-gray-200">
                {order.items.map((item, index) => (
                  <li key={`${item.product}-${index}`} className="py-4 flex">
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      <img
                        src={item.image || 'https://placehold.co/150x150?text=No+Image'}
                        alt={item.name}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                    <div className="ml-4 flex flex-1 flex-col justify-between">
                      <div>
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <h3>
                            <Link to={`/products/${item.product}`} className="hover:text-indigo-600 line-clamp-1">
                              {item.name}
                            </Link>
                          </h3>
                          <p className="ml-4 whitespace-nowrap">₹{(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                          {item.color} | Size: {item.size}
                        </p>
                      </div>
                      <div className="flex justify-between items-end text-sm">
                        <p className="text-gray-500">Qty: {item.quantity}</p>
                        <p className="text-gray-500">₹{item.price.toFixed(2)} each</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Right Column: Address & Summary */}
          <div className="space-y-8">
            
            {/* Payment & Summary */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-4 border-b pb-2">Summary</h2>
              <div className="space-y-3 text-sm text-gray-600 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">₹{order.subtotal?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-medium text-gray-900">₹0.00</span>
                </div>
                <div className="flex justify-between border-t pt-3 text-base font-bold text-gray-900">
                  <span>Total</span>
                  <span>₹{order.totalAmount?.toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-sm font-medium text-gray-900 mb-1">Payment Method</h3>
                <p className="text-sm text-gray-600 uppercase">{order.paymentMethod}</p>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-4 border-b pb-2">Delivery Address</h2>
              <div className="text-sm text-gray-600 space-y-1">
                <p className="font-medium text-gray-900">{order.shippingAddress?.fullName}</p>
                <p>{order.shippingAddress?.addressLine1}</p>
                {order.shippingAddress?.addressLine2 && <p>{order.shippingAddress?.addressLine2}</p>}
                <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.pincode}</p>
                <p className="pt-2 font-medium">Phone: {order.shippingAddress?.phone}</p>
              </div>
            </div>

          </div>

        </div>
      </div>

      {showReceipt && (
        <ReceiptModal orderId={order._id} onClose={() => setShowReceipt(false)} />
      )}
    </div>
  );
};

export default OrderDetails;
