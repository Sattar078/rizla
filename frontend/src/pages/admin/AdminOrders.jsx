import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../../services/admin.api';

const AdminOrders = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['adminOrders'],
    queryFn: adminApi.getOrders
  });
  const orders = data?.orders || data?.data?.orders || [];
  
  return (
    <section>
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-700">Fulfillment</p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-gray-900">Orders</h1>
      </div>
      
      {isLoading ? (
        <div className="py-10 text-gray-500 animate-pulse space-y-4">
            <div className="h-10 bg-gray-200 rounded w-full"></div>
            <div className="h-10 bg-gray-200 rounded w-full"></div>
            <div className="h-10 bg-gray-200 rounded w-full"></div>
        </div>
      ) : isError ? (
        <p role="alert" className="rounded-xl bg-red-50 p-5 text-red-700">
          Could not load orders. Please try again.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-5 py-4">Order ID</th>
                <th className="px-5 py-4">Customer</th>
                <th className="px-5 py-4">Date</th>
                <th className="px-5 py-4">Total Amount</th>
                <th className="px-5 py-4">Payment</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50/50 transition">
                  <td className="px-5 py-4 font-semibold text-gray-900">
                    #{String(order._id).slice(-8).toUpperCase()}
                  </td>
                  <td className="px-5 py-4 text-gray-700">
                    {order.user?.name || order.shippingAddress?.fullName || 'Guest'}
                  </td>
                  <td className="px-5 py-4 text-gray-600">
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN') : '—'}
                  </td>
                  <td className="px-5 py-4 font-semibold text-gray-900">
                    ₹{Number(order.totalAmount || 0).toLocaleString('en-IN')}
                  </td>
                  <td className="px-5 py-4 capitalize text-gray-600">
                    {order.paymentMethod} <br/><span className="text-xs text-gray-400">{order.paymentStatus}</span>
                  </td>
                  <td className="px-5 py-4 capitalize text-gray-600">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        order.orderStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                    }`}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link to={`/admin/orders/${order._id}`} className="font-semibold text-primary-800 hover:text-primary-900">
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && (
            <div className="p-12 text-center text-gray-500">
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p>No orders found.</p>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default AdminOrders;