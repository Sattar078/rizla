import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';

const Checkout = () => {
  const navigate = useNavigate();
  const { data: cartData, isLoading: isCartLoading } = useCart();

  const cart = cartData?.cart;

  if (isCartLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Cart is Empty</h2>
        <p className="text-gray-600 mb-8">You need items in your cart to checkout.</p>
        <Link to="/cart" className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Checkout Summary</h1>
          <Link to="/cart" className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
            &larr; Back to Cart
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-6">Review Your Items</h2>
          
          <div className="flow-root mb-6">
            <ul className="-my-4 divide-y divide-gray-200">
              {cart.items.map((item) => (
                <li key={item._id} className="flex items-center py-4">
                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                    <img
                      src={item.product?.images?.[0]?.url || 'https://via.placeholder.com/150'}
                      alt={item.product?.name}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <div className="ml-4 flex flex-1 flex-col">
                    <div>
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <h3 className="line-clamp-2">{item.product?.name}</h3>
                        <p className="ml-4">₹{(item.product?.price * item.quantity).toFixed(2)}</p>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        {item.color} | Size: {item.size}
                      </p>
                    </div>
                    <div className="flex flex-1 items-end justify-between text-sm mt-2">
                      <p className="text-gray-500 font-medium">Qty {item.quantity}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between font-bold text-gray-900 text-xl mb-6">
              <p>Total</p>
              <p>₹{cart.totalPrice?.toFixed(2)}</p>
            </div>
            
            <button
              onClick={() => navigate('/checkout/address')}
              className="w-full bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 rounded-md transition"
            >
              Continue to Address
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;
