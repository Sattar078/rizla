import { Link, useParams, Navigate } from 'react-router-dom';
import { useOrderById } from '../hooks/useOrder';

const PaymentFailed = () => {
  const { orderId } = useParams();
  const { data, isLoading, isError } = useOrderById(orderId);

  if (!orderId) return <Navigate to="/" replace />;

  const order = data?.order;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500" />
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
        <p className="text-gray-500 mb-8">We could not load your order details.</p>
        <Link to="/orders" className="inline-block bg-indigo-600 text-white px-6 py-2.5 rounded-md hover:bg-indigo-700 transition font-medium">
          View My Orders
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  // The payment is already verified/failed on backend — this page only communicates failure.
  // We do NOT retry payment here to prevent duplicate orders.
  const isAlreadyPaid = order.paymentStatus === 'paid';

  if (isAlreadyPaid) {
    // Guard: if backend says paid, redirect to success
    return <Navigate to={`/order-success/${order._id}`} replace />;
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">

        {/* Failure Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center bg-red-100 rounded-full p-5 mb-5">
            <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Unsuccessful</h1>
          <p className="text-gray-500 max-w-sm mx-auto">
            Your payment could not be processed. Your cart has not been charged and no order has been confirmed.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Order Details</h2>
            <span className="text-xs text-gray-400">{formattedDate}</span>
          </div>

          <div className="px-6 py-5 space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Order ID</span>
              <span className="font-mono font-medium text-gray-800 break-all text-right max-w-[60%]">{order._id}</span>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Payment Status</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800 capitalize">
                {order.paymentStatus}
              </span>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Order Status</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 capitalize">
                {order.orderStatus}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Payment Method</span>
              <span className="font-medium text-gray-800 capitalize">
                {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online (Razorpay)'}
              </span>
            </div>

            <div className="flex justify-between text-sm border-t border-gray-100 pt-4 mt-2">
              <span className="font-semibold text-gray-900">Order Total</span>
              <span className="font-bold text-gray-800 text-base">₹{order.totalAmount?.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* What Happened */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-6 py-5 mb-8">
          <h3 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 110 20A10 10 0 0112 2z" />
            </svg>
            What happened?
          </h3>
          <p className="text-sm text-amber-800">
            The payment was not completed or was declined by the payment provider. Your order has been recorded with a
            failed payment status. Please contact your bank or try a different payment method.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to="/cart"
            className="flex-1 text-center bg-indigo-600 text-white px-5 py-3 rounded-lg hover:bg-indigo-700 transition font-semibold text-sm"
          >
            Return to Cart
          </Link>
          <Link
            to={`/orders/${order._id}`}
            className="flex-1 text-center bg-white text-gray-700 border border-gray-300 px-5 py-3 rounded-lg hover:bg-gray-50 transition font-semibold text-sm"
          >
            View Order
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

export default PaymentFailed;
