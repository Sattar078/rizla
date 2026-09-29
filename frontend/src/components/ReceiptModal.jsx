import { useEffect } from 'react';
import { useOrderReceipt } from '../hooks/useOrder';

const ReceiptModal = ({ orderId, onClose }) => {
  const { data, isLoading, isError, error } = useOrderReceipt(orderId);

  // Print function
  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
        <div className="bg-white rounded-lg p-8 flex flex-col items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-4"></div>
          <p className="text-gray-600">Generating receipt...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
        <div className="bg-white rounded-lg p-6 max-w-sm w-full">
          <h3 className="text-lg font-bold text-red-600 mb-2">Error</h3>
          <p className="text-gray-700 mb-6">{error?.message || 'Failed to load receipt.'}</p>
          <div className="flex justify-end">
            <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Close</button>
          </div>
        </div>
      </div>
    );
  }

  const receipt = data?.receipt;

  if (!receipt) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 sm:p-6 overflow-y-auto print:bg-white print:p-0 print:absolute print:inset-0">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full my-auto flex flex-col max-h-[90vh] print:max-h-none print:shadow-none print:w-full print:max-w-none">
        
        {/* Header - Hidden when printing */}
        <div className="flex justify-between items-center p-4 border-b print:hidden">
          <h2 className="text-xl font-semibold">Digital Receipt</h2>
          <div className="flex space-x-2">
            <button onClick={handlePrint} className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700">
              Print
            </button>
            <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
        </div>

        {/* Printable Content */}
        <div className="p-8 overflow-y-auto flex-1 print:p-4 text-gray-800" id="printable-receipt">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{receipt.storeName}</h1>
            <p className="text-sm text-gray-500 mt-1">Order Receipt</p>
          </div>

          <div className="flex flex-col sm:flex-row justify-between border-b pb-6 mb-6 gap-4">
            <div>
              <p className="text-sm text-gray-500 font-medium">Billed To:</p>
              <p className="font-semibold">{receipt.customerName}</p>
              <p className="text-sm">{receipt.customerEmail}</p>
              <p className="text-sm">{receipt.customerPhone}</p>
            </div>
            <div className="sm:text-right">
              <p className="text-sm text-gray-500 font-medium">Order Details:</p>
              <p className="text-sm font-medium">ID: #{receipt.orderId}</p>
              <p className="text-sm">Date: {new Date(receipt.orderDate).toLocaleString()}</p>
              <p className="text-sm mt-1 uppercase"><span className="font-medium">Status:</span> {receipt.orderStatus}</p>
              <p className="text-sm uppercase"><span className="font-medium">Payment:</span> {receipt.paymentMethod} ({receipt.paymentStatus})</p>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-sm text-gray-500 font-medium mb-2">Shipping Address:</p>
            <p className="text-sm">{receipt.shippingAddress?.addressLine1} {receipt.shippingAddress?.addressLine2}</p>
            <p className="text-sm">{receipt.shippingAddress?.city}, {receipt.shippingAddress?.state} {receipt.shippingAddress?.pincode}</p>
          </div>

          <table className="w-full text-left mb-6">
            <thead>
              <tr className="border-b text-sm font-medium text-gray-600">
                <th className="py-2">Item</th>
                <th className="py-2">Variant</th>
                <th className="py-2 text-right">Qty</th>
                <th className="py-2 text-right">Price</th>
                <th className="py-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {receipt.items.map((item, index) => (
                <tr key={index} className="border-b border-gray-100 text-sm">
                  <td className="py-3 font-medium">{item.productName}</td>
                  <td className="py-3 text-gray-500">{item.variant}</td>
                  <td className="py-3 text-right">{item.quantity}</td>
                  <td className="py-3 text-right">₹{item.price.toFixed(2)}</td>
                  <td className="py-3 text-right">₹{item.subtotal.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end">
            <div className="w-full sm:w-1/2 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal:</span>
                <span className="font-medium">₹{receipt.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Shipping:</span>
                <span className="font-medium">₹{receipt.shippingAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-gray-900 pt-2 text-base font-bold">
                <span>Total Amount:</span>
                <span>₹{receipt.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-12 text-center text-xs text-gray-500 border-t pt-4">
            <p>Thank you for shopping with RIZLA BOUTIQUE.</p>
            <p className="mt-1">This is a digitally generated receipt.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;
