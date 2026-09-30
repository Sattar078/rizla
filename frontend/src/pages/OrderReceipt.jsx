import { Link, useParams } from 'react-router-dom';
import { useOrderReceipt } from '../hooks/useOrder';

const fmt = (val) => `₹${Number(val || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

const OrderReceipt = () => {
  const { orderId } = useParams();
  const { data, isLoading, isError, refetch } = useOrderReceipt(orderId);

  // Backend returns { success, receipt, message }
  const receipt = data?.receipt;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
        <span className="ml-4 text-gray-500">Preparing your receipt…</span>
      </div>
    );
  }

  if (isError || !receipt) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="bg-red-100 rounded-full p-4 mb-6 inline-flex">
          <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M12 2a10 10 0 110 20A10 10 0 0112 2z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-3">Receipt Unavailable</h2>
        <p className="text-gray-500 mb-6">We could not load the receipt for this order.</p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => refetch()} className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition font-medium text-sm">
            Try Again
          </button>
          <Link to={`/orders/${orderId}`} className="bg-white border border-gray-300 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-50 transition font-medium text-sm">
            Back to Order
          </Link>
        </div>
      </div>
    );
  }

  const orderDateStr = receipt.orderDate
    ? new Date(receipt.orderDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : '—';

  const shortId = String(receipt.orderId || orderId).slice(-8).toUpperCase();

  return (
    <>
      {/* Print controls — hidden when printing */}
      <div className="print:hidden bg-gray-50 border-b border-gray-200 px-4 py-3">
        <div className="max-w-3xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              to={`/orders/${orderId}`}
              className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-800"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Order Details
            </Link>
            <span className="text-gray-300">|</span>
            <Link to="/orders" className="text-sm font-medium text-gray-600 hover:text-gray-800">
              My Orders
            </Link>
          </div>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print Receipt
          </button>
        </div>
      </div>

      {/* Receipt document */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 print:py-4">
        <article className="bg-white border border-gray-200 shadow-sm print:shadow-none print:border-0">

          {/* Store Header */}
          <div className="flex items-start justify-between border-b border-gray-200 px-8 py-8 print:px-6 print:py-6">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900">RIZLA</h1>
              <p className="text-xs uppercase tracking-[0.25em] text-gray-400 mt-0.5">Boutique</p>
            </div>
            <div className="text-right text-sm text-gray-600">
              <p className="font-semibold text-gray-800 text-base">Receipt #{shortId}</p>
              <p className="mt-1">{orderDateStr}</p>
              <span className={`inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${
                receipt.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                receipt.paymentStatus === 'failed' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {receipt.paymentStatus}
              </span>
            </div>
          </div>

          <div className="px-8 py-6 print:px-6 space-y-6">

            {/* Customer + Order info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-b border-gray-100 pb-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">Billed To</p>
                <p className="font-semibold text-gray-900">{receipt.customerName}</p>
                {receipt.customerEmail && <p className="text-sm text-gray-600">{receipt.customerEmail}</p>}
                {receipt.customerPhone && <p className="text-sm text-gray-600">{receipt.customerPhone}</p>}
              </div>
              <div className="sm:text-right">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">Order Info</p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Method: </span>
                  <span className="capitalize">{receipt.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</span>
                </p>
                <p className="text-sm text-gray-600 mt-0.5">
                  <span className="font-medium">Status: </span>
                  <span className="capitalize">{receipt.orderStatus}</span>
                </p>
              </div>
            </div>

            {/* Shipping address */}
            {receipt.shippingAddress && (
              <div className="border-b border-gray-100 pb-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">Shipping Address</p>
                <p className="text-sm text-gray-700">{receipt.shippingAddress.fullName}</p>
                <p className="text-sm text-gray-700">
                  {receipt.shippingAddress.addressLine1}
                  {receipt.shippingAddress.addressLine2 ? `, ${receipt.shippingAddress.addressLine2}` : ''}
                </p>
                <p className="text-sm text-gray-700">
                  {receipt.shippingAddress.city}, {receipt.shippingAddress.state} – {receipt.shippingAddress.pincode}
                </p>
              </div>
            )}

            {/* Items table */}
            <div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left pb-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Item</th>
                    <th className="text-left pb-3 font-semibold text-gray-600 text-xs uppercase tracking-wide hidden sm:table-cell">Variant</th>
                    <th className="text-right pb-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Qty</th>
                    <th className="text-right pb-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Price</th>
                    <th className="text-right pb-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {(receipt.items || []).map((item, idx) => (
                    <tr key={idx} className="border-b border-gray-50">
                      <td className="py-3 pr-4 font-medium text-gray-900">{item.productName}</td>
                      <td className="py-3 pr-4 text-gray-500 hidden sm:table-cell">{item.variant}</td>
                      <td className="py-3 text-right text-gray-700">{item.quantity}</td>
                      <td className="py-3 text-right text-gray-700">{fmt(item.price)}</td>
                      <td className="py-3 text-right font-semibold text-gray-900">{fmt(item.subtotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end">
              <div className="w-full sm:w-72 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium text-gray-800">{fmt(receipt.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Shipping</span>
                  <span className="font-medium text-gray-800">{fmt(receipt.shippingAmount)}</span>
                </div>
                {receipt.discount > 0 && (
                  <div className="flex justify-between text-green-700">
                    <span>Discount</span>
                    <span className="font-medium">−{fmt(receipt.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-gray-900 pt-3 text-base font-bold text-gray-900">
                  <span>Total</span>
                  <span>{fmt(receipt.totalAmount)}</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 pt-6 text-center text-xs text-gray-400">
              <p>Thank you for shopping with <span className="font-semibold text-gray-600">RIZLA BOUTIQUE</span>.</p>
              <p className="mt-1">This is a digitally generated receipt.</p>
            </div>

          </div>
        </article>
      </main>
    </>
  );
};

export default OrderReceipt;