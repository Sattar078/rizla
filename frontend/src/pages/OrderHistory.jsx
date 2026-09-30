import { Link } from 'react-router-dom';
import { useMyOrders } from '../hooks/useOrder';

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

const OrderHistory = () => {
  const { data, isLoading, isError, refetch } = useMyOrders();
  const orders = data?.orders || [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="bg-red-100 rounded-full p-4 mb-6 inline-flex">
          <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M12 2a10 10 0 110 20A10 10 0 0112 2z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-3">Failed to Load Orders</h2>
        <p className="text-gray-500 mb-6">Something went wrong fetching your orders.</p>
        <button
          onClick={() => refetch()}
          className="bg-indigo-600 text-white px-6 py-2.5 rounded-md hover:bg-indigo-700 transition font-medium"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">

        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <Link to="/products" className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
            Continue Shopping →
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm text-center py-20 px-4">
            <div className="inline-flex items-center justify-center bg-indigo-50 rounded-full p-5 mb-5">
              <svg className="w-10 h-10 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No Orders Yet</h2>
            <p className="text-gray-500 mb-8 max-w-xs mx-auto">You haven't placed any orders. Start shopping and your orders will appear here.</p>
            <Link
              to="/products"
              className="inline-block bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-700 transition font-semibold"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const formattedDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric', month: 'short', year: 'numeric',
              });

              // Grab first item's image for preview
              const previewImage = order.items?.[0]?.image;
              const itemCount = order.items?.length || 0;

              return (
                <div
                  key={order._id}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition overflow-hidden"
                >
                  {/* Card Header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="text-xs text-gray-400 mb-0.5">Order ID</p>
                        <p className="font-mono text-xs font-semibold text-gray-700 truncate max-w-[160px]">{order._id}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${statusColors[order.orderStatus] || 'bg-gray-100 text-gray-600'}`}>
                        {order.orderStatus}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${paymentStatusColors[order.paymentStatus] || 'bg-gray-100 text-gray-600'}`}>
                        {order.paymentStatus}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="px-6 py-4 flex items-center gap-4">
                    {/* Preview Image */}
                    {previewImage ? (
                      <img
                        src={previewImage}
                        alt="Order item"
                        className="w-16 h-16 rounded-lg object-cover border border-gray-200 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 border border-gray-200">
                        <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-500">{itemCount} {itemCount === 1 ? 'item' : 'items'} · {formattedDate}</p>
                      <p className="text-sm font-semibold text-gray-800 mt-0.5 truncate">
                        {order.items?.[0]?.name}
                        {itemCount > 1 && ` + ${itemCount - 1} more`}
                      </p>
                      <p className="text-xs text-gray-400 capitalize mt-0.5">
                        {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                      </p>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <p className="text-lg font-bold text-gray-900">₹{order.totalAmount?.toFixed(2)}</p>
                      <Link
                        to={`/orders/${order._id}`}
                        className="inline-block mt-2 text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline"
                      >
                        View Details →
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

export default OrderHistory;
