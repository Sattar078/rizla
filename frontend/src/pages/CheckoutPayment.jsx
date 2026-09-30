import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAddresses } from '../hooks/useUser';
import { 
  useCreateOrder, 
  useCreateRazorpayOrder, 
  useVerifyRazorpayPayment, 
  useHandlePaymentFailure 
} from '../hooks/useOrder';
import { loadRazorpayScript } from '../utils/razorpay';

const CheckoutPayment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedAddressId = location.state?.addressId;

  // Queries
  const { data: cartData, isLoading: isCartLoading } = useCart();
  const { data: addressData, isLoading: isAddressLoading } = useAddresses();

  // Mutations
  const createOrderMutation = useCreateOrder();
  const createRazorpayOrderMutation = useCreateRazorpayOrder();
  const verifyRazorpayMutation = useVerifyRazorpayPayment();
  const handlePaymentFailureMutation = useHandlePaymentFailure();

  // State
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [errorMsg, setErrorMsg] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!selectedAddressId && !isAddressLoading) {
      navigate('/checkout/address');
    }
  }, [selectedAddressId, isAddressLoading, navigate]);

  const cart = cartData?.cart;
  const addresses = addressData?.addresses || [];
  
  const selectedAddress = addresses.find((a) => a._id === selectedAddressId);

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

  if (!selectedAddress) {
      return null;
  }

  const handlePaymentSubmit = async () => {
    setErrorMsg('');

    if (!paymentMethod) {
      setErrorMsg('Please select a payment method');
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Create the base order
      const orderResponse = await createOrderMutation.mutateAsync({
        addressId: selectedAddressId,
        paymentMethod
      });

      const orderId = orderResponse.order._id;

      if (paymentMethod === 'cod') {
        // COD order placed successfully
        setIsProcessing(false);
        navigate(`/order-success/${orderId}`);
        return;
      }

      // 2. Razorpay Flow
      if (paymentMethod === 'razorpay') {
        const isScriptLoaded = await loadRazorpayScript();
        if (!isScriptLoaded) {
          setErrorMsg('Failed to load Razorpay SDK. Are you online?');
          setIsProcessing(false);
          return;
        }

        const rzpResponse = await createRazorpayOrderMutation.mutateAsync(orderId);
        
        const options = {
          key: rzpResponse.keyId,
          amount: rzpResponse.amount,
          currency: rzpResponse.currency,
          name: "Rizla Boutique",
          description: "Order Payment",
          order_id: rzpResponse.razorpayOrderId,
          handler: async function (response) {
            try {
              // Verify payment on backend
              await verifyRazorpayMutation.mutateAsync({
                orderId,
                data: {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }
              });
              setIsProcessing(false);
              navigate(`/order-success/${orderId}`);
            } catch (err) {
              console.error(err);
              setErrorMsg(err.response?.data?.message || 'Payment verification failed');
              setIsProcessing(false);
            }
          },
          prefill: {
            name: selectedAddress.fullName,
            contact: selectedAddress.phone
          },
          theme: {
            color: "#4f46e5", // Indigo 600
          },
          modal: {
            ondismiss: async function () {
              // User closed Razorpay modal
              try {
                await handlePaymentFailureMutation.mutateAsync(orderId);
              } catch (e) {
                console.error("Failed to mark order as failed", e);
              }
              setErrorMsg('Payment cancelled. Please try again.');
              setIsProcessing(false);
              navigate(`/payment-failed/${orderId}`);
            }
          }
        };

        const rzpWindow = new window.Razorpay(options);
        rzpWindow.on('payment.failed', async function (response) {
          try {
            await handlePaymentFailureMutation.mutateAsync(orderId);
          } catch (e) {
            console.error("Failed to mark order as failed", e);
          }
          setErrorMsg('Payment failed. ' + response.error.description);
          setIsProcessing(false);
        });

        rzpWindow.open();
      }

    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'An error occurred during checkout');
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Payment</h1>
          <Link to="/checkout/address" className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
            &larr; Back to Address
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column (Payment & Address Info) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Delivery Address Summary */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Delivery Address</h2>
                <Link to="/checkout/address" className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
                  Change
                </Link>
              </div>
              <div className="text-gray-700">
                <p className="font-medium text-gray-900">{selectedAddress.fullName}</p>
                <p className="mt-1">{selectedAddress.addressLine1} {selectedAddress.addressLine2 && `, ${selectedAddress.addressLine2}`}</p>
                <p>{selectedAddress.city}, {selectedAddress.state} {selectedAddress.pincode}</p>
                <p className="mt-1 font-medium">{selectedAddress.phone}</p>
              </div>
            </div>

            {/* Payment Method Section */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold mb-6">Payment Method</h2>
              
              <div className="space-y-4">
                <label className={`flex items-center p-4 border rounded-md cursor-pointer transition ${paymentMethod === 'razorpay' ? 'border-indigo-600 bg-indigo-50/30 ring-1 ring-indigo-600' : 'border-gray-200 hover:bg-gray-50'}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="razorpay"
                    checked={paymentMethod === 'razorpay'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                  />
                  <div className="ml-4 flex-1">
                    <span className="block font-medium text-gray-900">Online Payment (Razorpay)</span>
                    <span className="block text-sm text-gray-500 mt-0.5">Pay securely via UPI, Cards, NetBanking, etc.</span>
                  </div>
                </label>

                <label className={`flex items-center p-4 border rounded-md cursor-pointer transition ${paymentMethod === 'cod' ? 'border-indigo-600 bg-indigo-50/30 ring-1 ring-indigo-600' : 'border-gray-200 hover:bg-gray-50'}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                  />
                  <div className="ml-4 flex-1">
                    <span className="block font-medium text-gray-900">Cash on Delivery (COD)</span>
                    <span className="block text-sm text-gray-500 mt-0.5">Pay with cash when your order is delivered.</span>
                  </div>
                </label>
              </div>
            </div>

          </div>

          {/* Right Column (Order Summary & Submit) */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-6">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
              
              <div className="flow-root mb-6 max-h-[400px] overflow-y-auto pr-2">
                <ul className="-my-4 divide-y divide-gray-200">
                  {cart.items.map((item) => (
                    <li key={item._id} className="flex items-center py-4">
                      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                        <img
                          src={item.product?.images?.[0]?.url || 'https://via.placeholder.com/150'}
                          alt={item.product?.name}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                      <div className="ml-4 flex flex-1 flex-col">
                        <div>
                          <div className="flex justify-between text-sm font-medium text-gray-900">
                            <h3 className="line-clamp-2">{item.product?.name}</h3>
                            <p className="ml-4">₹{(item.product?.price * item.quantity).toFixed(2)}</p>
                          </div>
                          <p className="mt-1 text-sm text-gray-500">
                            {item.color} | Size: {item.size}
                          </p>
                        </div>
                        <div className="flex flex-1 items-end justify-between text-sm">
                          <p className="text-gray-500">Qty {item.quantity}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-4">
                <div className="flex items-center justify-between font-medium text-gray-900 text-lg">
                  <p>Total</p>
                  <p>₹{cart.totalPrice?.toFixed(2)}</p>
                </div>
                
                {errorMsg && (
                  <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm border border-red-200">
                    {errorMsg}
                  </div>
                )}

                <button
                  onClick={handlePaymentSubmit}
                  disabled={isProcessing || cart.items.length === 0}
                  className="w-full bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 rounded-md disabled:opacity-50 transition"
                >
                  {isProcessing ? 'Processing...' : `Place Order (₹${cart.totalPrice?.toFixed(2)})`}
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CheckoutPayment;
