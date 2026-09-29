import { useLocation, Link, Navigate } from 'react-router-dom';

const CheckoutSuccess = () => {
  const location = useLocation();
  const orderId = location.state?.orderId;

  if (!orderId) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-[70vh] flex flex-col justify-center items-center px-4">
      <div className="bg-green-100 rounded-full p-4 mb-6">
        <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      
      <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">Order Confirmed!</h1>
      <p className="text-gray-600 mb-6 text-center max-w-md">
        Thank you for your purchase. Your order has been placed successfully and is now being processed.
      </p>

      <div className="bg-gray-50 border border-gray-200 rounded-md px-6 py-3 mb-8">
        <p className="text-sm text-gray-600 font-medium">
          Order ID: <span className="text-gray-900 font-bold">{orderId}</span>
        </p>
      </div>

      <div className="flex gap-4">
        <Link 
          to="/"
          className="bg-gray-800 text-white px-6 py-2 rounded-md hover:bg-gray-900 transition font-medium"
        >
          Continue Shopping
        </Link>
        <Link 
          to="/profile"
          className="bg-indigo-50 text-indigo-700 px-6 py-2 rounded-md hover:bg-indigo-100 transition font-medium"
        >
          View My Orders
        </Link>
      </div>
    </div>
  );
};

export default CheckoutSuccess;
