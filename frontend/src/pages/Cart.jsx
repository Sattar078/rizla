import { Link } from 'react-router-dom';
import { useCart, useUpdateCartQuantity, useRemoveFromCart, useClearCart } from '../hooks/useCart';

const Cart = () => {
  const { data, isLoading, isError, error } = useCart();
  const updateQuantityMutation = useUpdateCartQuantity();
  const removeMutation = useRemoveFromCart();
  const clearMutation = useClearCart();

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
          <h2 className="text-xl font-bold mb-2">Error Loading Cart</h2>
          <p>{error?.message || 'Something went wrong.'}</p>
        </div>
      </div>
    );
  }

  const cart = data?.cart;
  const cartItems = cart?.items || [];

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Cart is Empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added anything yet.</p>
        <Link to="/" className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-md font-medium hover:bg-indigo-700">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
      
      <div className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12">
        {/* Cart Items */}
        <section className="lg:col-span-8">
          <ul className="divide-y divide-gray-200 border-t border-b border-gray-200">
            {cartItems.map((item) => {
              if (!item.product) return null; // Safe guard for deleted products
              const imageUrl = item.image || 'https://placehold.co/400x500?text=No+Image';

              return (
                <li key={item._id} className="flex py-6">
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                    <img
                      src={imageUrl}
                      alt={item.name}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>

                  <div className="ml-4 flex flex-1 flex-col">
                    <div>
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <h3>
                          <Link to={`/products/${item.product}`}>{item.name}</Link>
                        </h3>
                        <p className="ml-4">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        {item.size && <span className="mr-3">Size: {item.size}</span>}
                        {item.color && <span>Color: {item.color}</span>}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">Unit Price: ${item.price?.toFixed(2)}</p>
                    </div>
                    <div className="flex flex-1 items-end justify-between text-sm">
                      <div className="flex items-center border rounded-md">
                        <button
                          onClick={() => updateQuantityMutation.mutate({ itemId: item._id, quantity: item.quantity - 1 })}
                          disabled={item.quantity <= 1 || updateQuantityMutation.isPending}
                          className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 border-l border-r font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantityMutation.mutate({ itemId: item._id, quantity: item.quantity + 1 })}
                          disabled={updateQuantityMutation.isPending}
                          className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                        >
                          +
                        </button>
                      </div>

                      <div className="flex">
                        <button
                          type="button"
                          onClick={() => removeMutation.mutate(item._id)}
                          disabled={removeMutation.isPending}
                          className="font-medium text-red-600 hover:text-red-500 disabled:opacity-50"
                        >
                          {removeMutation.isPending && removeMutation.variables === item._id ? 'Removing...' : 'Remove'}
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
          
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => clearMutation.mutate()}
              disabled={clearMutation.isPending}
              className="text-sm font-medium text-gray-500 hover:text-gray-900 border px-4 py-2 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Clear Cart
            </button>
          </div>
        </section>

        {/* Order Summary */}
        <section className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-4 lg:mt-0 lg:p-8">
          <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
              <dt className="text-base font-medium text-gray-900">Subtotal</dt>
              <dd className="text-base font-medium text-gray-900">${cart.subtotal?.toFixed(2)}</dd>
            </div>
            {/* Note: Tax/Shipping are not specified yet, so keeping simple subtotal = total per backend */}
          </div>

          <div className="mt-6">
            <Link
              to="/checkout"
              className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
            >
              Proceed to Checkout
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Cart;
