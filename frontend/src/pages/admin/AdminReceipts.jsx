import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../../services/admin.api';

const AdminReceipts = () => {
  const { data, isLoading, isError } = useQuery({ 
    queryKey: ['adminOrders'], 
    queryFn: adminApi.getOrders 
  });
  
  const orders = data?.orders || data?.data?.orders || [];
  
  return (
    <section>
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-700">Records</p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-gray-900">Receipts</h1>
        <p className="mt-2 text-gray-500">Order payment and fulfillment records.</p>
      </div>
      
      {isLoading ? (
        <div className="py-10 text-gray-500 animate-pulse space-y-4">
            <div className="h-20 bg-gray-200 rounded-2xl w-full"></div>
            <div className="h-20 bg-gray-200 rounded-2xl w-full"></div>
        </div>
      ) : isError ? (
        <p role="alert" className="rounded-xl bg-red-50 p-5 text-red-700">
          Could not load receipts.
        </p>
      ) : (
        <div className="divide-y divide-gray-100 rounded-2xl border border-gray-200 bg-white">
          {orders.map((order) => (
            <div key={order._id} className="flex flex-wrap items-center justify-between gap-4 px-6 py-5 hover:bg-gray-50 transition">
              <div>
                <p className="font-semibold text-gray-900">
                  Receipt #{String(order._id).slice(-8).toUpperCase()}
                </p>
                <div className="mt-1.5 flex items-center gap-3 text-sm text-gray-500">
                    <span>{order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN') : '—'}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                    <span className="capitalize">{order.paymentMethod}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                    <span className={`capitalize font-medium ${order.paymentStatus === 'paid' ? 'text-green-600' : 'text-amber-600'}`}>{order.paymentStatus}</span>
                </div>
                <p className="mt-1 text-sm text-gray-600">
                  Customer: {order.user?.name || order.shippingAddress?.fullName || 'Guest'}
                </p>
              </div>
              
              <div className="flex items-center gap-6">
                <p className="font-display font-bold text-lg text-gray-900">
                  ₹{Number(order.totalAmount || 0).toLocaleString('en-IN')}
                </p>
                <Link 
                  to={`/admin/receipts/${order._id}`} 
                  className="px-4 py-2 bg-primary-50 text-primary-900 text-sm font-semibold rounded-lg hover:bg-primary-100 transition"
                >
                  View Receipt
                </Link>
              </div>
            </div>
          ))}
          {orders.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              <svg className="mx-auto h-12 w-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p>No receipts available.</p>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default AdminReceipts;