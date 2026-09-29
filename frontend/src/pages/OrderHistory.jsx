import { Link } from 'react-router-dom';
import { useMyOrders } from '../hooks/useOrder';

const OrderHistory = () => {
  const { data, isLoading, isError, error } = useMyOrders();

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
        <div className="bg-red-50 p-4 rounded-md text-red-700 text-center">
          <h2 className="text-xl font-bold mb-2">Error Loading Orders</h2>
          <p>{error?.message || 'Something went wrong while fetching your orders.'}</p>
        </div>
      </div>
    );
  }

  const orders = data?.orders || [];

  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">No Orders Found</h2>
        <p className="text-gray-500 mb-8">You haven't placed any orders yet.</p>
        <Link to="/" className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 font-medium transition">
          Start Shopping
        </Link>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'packed': return 'bg-indigo-100 text-indigo-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-4 sm:mb-0 w-full sm:w-auto">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Order Placed</p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric', month: 'short', day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Total</p>
                    <p className="text-sm font-medium text-gray-900">₹{order.totalAmount?.toFixed(2)}</p>
                  </div>
                  <div className="col-span-2 sm:col-span-2">
                    <p className="text-sm text-gray-500 font-medium">Order ID</p>
                    <p className="text-sm font-medium text-gray-900 truncate">#{order._id}</p>
                  </div>
                </div>
                
                <div className="flex justify-start sm:justify-end">
                  <Link 
                    to={`/orders/${order._id}`}
                    className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    View Details
                  </Link>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${getStatusColor(order.orderStatus)}`}>
                    {order.orderStatus}
                  </span>
                  <span className="ml-4 text-sm text-gray-500">
                    Payment: <span className="font-medium capitalize text-gray-900">{order.paymentMethod}</span> ({order.paymentStatus})
                  </span>
                </div>

                <div className="flow-root">
                  <ul className="-my-4 divide-y divide-gray-100">
                    {order.items.slice(0, 3).map((item) => (
                      <li key={`${order._id}-${item.product}`} className="flex items-center py-4">
                        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                          <img
                            src={item.image || 'https://placehold.co/150x150?text=No+Image'}
                            alt={item.name}
                            className="h-full w-full object-cover object-center"
                          />
                        </div>
                        <div className="ml-4 flex-1">
                          <p className="text-sm font-medium text-gray-900 line-clamp-1">{item.name}</p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity} | {item.size} / {item.color}</p>
                        </div>
                      </li>
                    ))}
                    {order.items.length > 3 && (
                      <li className="py-4 text-sm text-gray-500 font-medium">
                        + {order.items.length - 3} more item(s)
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
