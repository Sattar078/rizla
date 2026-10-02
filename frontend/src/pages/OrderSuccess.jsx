import { Link, useParams, Navigate } from 'react-router-dom';
import { useOrderById } from '../hooks/useOrder';

const statusColors = {
  pending:   'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  packed:    'bg-indigo-100 text-indigo-800',
  shipped:   'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const paymentStatusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid:    'bg-green-100 text-green-800',
  failed:  'bg-red-100 text-red-800',
};

const OrderSuccess = () => {
  const { orderId } = useParams();
  const { data, isLoading, isError } = useOrderById(orderId);

  // Guard — if no orderId in URL redirect to home
  if (!orderId) return <Navigate to="/" replace />;

  const order = data?.order;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="bg-red-100 rounded-full p-4 mb-6 inline-flex">
          <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Order Not Found</h1>
        <p className="text-gray-500 mb-8">We could not load your order details. It may not exist or you may not have access.</p>
        <Link to="/orders" className="inline-block bg-indigo-600 text-white px-6 py-2.5 rounded-md hover:bg-indigo-700 transition font-medium">
          View My Orders
        </Link>
      </div>
    );
  }

  const addr = order.shippingAddress;
  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">

        {/* Success Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center bg-green-100 rounded-full p-5 mb-5">
            <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-500 max-w-sm mx-auto">
            Thank you for shopping with Rizla Boutique. Your order has been placed and is being processed.
          </p>
        </div>

        {/* Order Summary Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Order Summary</h2>
            <span className="text-xs text-gray-400">{formattedDate}</span>
          </div>

          <div className="px-6 py-5 space-y-4">
            {/* Order ID */}
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Order ID</span>
              <span className="font-mono font-medium text-gray-800 break-all text-right max-w-[60%]">{order._id}</span>
            </div>

            {/* Order Status */}
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Order Status</span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${statusColors[order.orderStatus] || 'bg-gray-100 text-gray-700'}`}>
                {order.orderStatus}
              </span>
            </div>

            {/* Payment Status */}
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Payment Status</span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${paymentStatusColors[order.paymentStatus] || 'bg-gray-100 text-gray-700'}`}>
                {order.paymentStatus}
              </span>
            </div>

            {/* Payment Method */}
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Payment Method</span>
              <span className="font-medium text-gray-800 capitalize">
                {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online (Razorpay)'}
              </span>
            </div>

            {/* Total */}
            <div className="flex justify-between text-sm border-t border-gray-100 pt-4 mt-2">
              <span className="font-semibold text-gray-900">Order Total</span>
              <span className="font-bold text-indigo-600 text-base">₹{order.totalAmount?.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Items Preview */}
        {order.items && order.items.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Items ({order.items.length})</h2>
            </div>
            <ul className="divide-y divide-gray-100">
              {order.items.map((item, idx) => (
                <li key={idx} className="flex items-center gap-4 px-6 py-4">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-14 h-14 rounded-lg object-cover border border-gray-200 flex-shrink-0" />
                  ) : (
                    <div className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">{item.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{item.size} / {item.color} · Qty {item.quantity}</p>
                  </div>
                  <span className="text-sm font-semibold text-gray-800">₹{(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Delivery Address */}
        {addr && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Delivery Address</h2>
            </div>
            <div className="px-6 py-5 text-sm text-gray-700 space-y-0.5">
              <p className="font-semibold text-gray-900">{addr.fullName}</p>
              <p>{addr.addressLine1}{addr.addressLine2 ? `, ${addr.addressLine2}` : ''}</p>
              <p>{addr.city}, {addr.state} – {addr.pincode}</p>
              <p className="pt-1 font-medium">{addr.phone}</p>
            </div>
          </div>
        )}

        {/* Navigation CTAs */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to={`/orders/${order._id}`}
            className="flex-1 text-center bg-indigo-600 text-white px-5 py-3 rounded-lg hover:bg-indigo-700 transition font-semibold text-sm"
          >
            View Order Details
          </Link>
          <Link
            to={`/orders/${order._id}/receipt`}
            className="flex-1 text-center bg-white text-indigo-600 border border-indigo-300 px-5 py-3 rounded-lg hover:bg-indigo-50 transition font-semibold text-sm"
          >
            Download Receipt
          </Link>
          <Link
            to="/orders"
            className="flex-1 text-center bg-white text-gray-700 border border-gray-300 px-5 py-3 rounded-lg hover:bg-gray-50 transition font-semibold text-sm"
          >
            My Orders
          </Link>
        </div>

        <div className="text-center mt-5">
          <Link to="/products" className="text-sm text-indigo-600 hover:underline font-medium">
            ← Continue Shopping
          </Link>
        </div>

      </div>
    </div>
  );
};

export default OrderSuccess;
