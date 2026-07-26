import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { FiCheckCircle } from 'react-icons/fi';

const OrderSuccess = () => {
  const { id } = useParams();
  const location = useLocation();
  const order = location.state?.order;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center pt-28 pb-20 text-center">
      <FiCheckCircle size={80} className="mb-6 text-accent" />
      <h1 className="mb-4 font-playfair text-4xl font-bold text-white">Order Confirmed!</h1>
      <p className="mb-2 text-gray-300">Thank you for shopping with RIZLA Boutique.</p>
      <p className="mb-8 text-gray-400">
        Order #{id || order?.id} · Total: ${order?.total?.toFixed(2) || '—'}
      </p>
      <div className="flex gap-4">
        <Link
          to="/shop"
          className="rounded-full border border-accent px-8 py-3 font-montserrat text-sm font-bold uppercase tracking-wider text-accent hover:bg-accent hover:text-background"
        >
          Continue Shopping
        </Link>
        <Link
          to="/account"
          className="rounded-full bg-accent px-8 py-3 font-montserrat text-sm font-bold uppercase tracking-wider text-background hover:bg-green-600"
        >
          View Orders
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
