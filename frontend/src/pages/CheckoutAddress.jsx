import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAddresses } from '../hooks/useUser';
import AddressForm from '../components/AddressForm';

const CheckoutAddress = () => {
  const navigate = useNavigate();

  const { data: cartData, isLoading: isCartLoading } = useCart();
  const { data: addressData, isLoading: isAddressLoading } = useAddresses();

  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [showAddAddress, setShowAddAddress] = useState(false);

  const cart = cartData?.cart;
  const addresses = addressData?.addresses || [];

  // Set default address if none selected
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      const defaultAddr = addresses.find(a => a.isDefault) || addresses[0];
      setSelectedAddressId(defaultAddr._id);
    }
  }, [addresses, selectedAddressId]);

  if (isCartLoading || isAddressLoading) {
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
          Return to Cart
        </Link>
      </div>
    );
  }

  const handleContinue = () => {
    if (!selectedAddressId) return;
    navigate('/checkout/payment', { state: { addressId: selectedAddressId } });
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Select Delivery Address</h1>
          <Link to="/checkout" className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
            &larr; Back to Checkout
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Delivery Address</h2>
            <button 
              onClick={() => setShowAddAddress(!showAddAddress)}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
            >
              {showAddAddress ? 'Cancel' : '+ Add Address'}
            </button>
          </div>

          {showAddAddress && (
            <div className="mb-6 bg-gray-50 p-4 rounded-md border">
              <AddressForm 
                onCancel={() => setShowAddAddress(false)}
                onSuccess={() => setShowAddAddress(false)}
              />
            </div>
          )}

          {addresses.length === 0 && !showAddAddress ? (
            <div className="text-center py-6 text-gray-500">
              You have no saved addresses. Please add one.
            </div>
          ) : (
            <div className="space-y-4">
              {addresses.map((addr) => (
                <label 
                  key={addr._id} 
                  className={`flex items-start p-4 border rounded-md cursor-pointer transition ${selectedAddressId === addr._id ? 'border-indigo-600 bg-indigo-50/30 ring-1 ring-indigo-600' : 'border-gray-200 hover:bg-gray-50'}`}
                >
                  <div className="flex-shrink-0 mt-1">
                    <input
                      type="radio"
                      name="address"
                      value={addr._id}
                      checked={selectedAddressId === addr._id}
                      onChange={(e) => setSelectedAddressId(e.target.value)}
                      className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="ml-4">
                    <p className="font-medium text-gray-900">{addr.fullName} {addr.isDefault && <span className="ml-2 text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full font-medium">Default</span>}</p>
                    <p className="text-sm text-gray-600 mt-1">{addr.addressLine1} {addr.addressLine2 && `, ${addr.addressLine2}`}</p>
                    <p className="text-sm text-gray-600">{addr.city}, {addr.state} {addr.pincode}</p>
                    <p className="text-sm text-gray-600 mt-1 font-medium">{addr.phone}</p>
                  </div>
                </label>
              ))}
            </div>
          )}

          <div className="mt-8 flex justify-end">
             <button
                onClick={handleContinue}
                disabled={!selectedAddressId}
                className="bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 rounded-md disabled:opacity-50 transition"
              >
                Continue to Payment
              </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CheckoutAddress;
