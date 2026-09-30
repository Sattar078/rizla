import { Link, useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { orderApi } from "../../services/order.api";

const fmt = (val) =>
  '\u20B9' + Number(val || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 });


const AdminReceiptDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["admin-receipt", orderId],
    queryFn: () => orderApi.getOrderReceipt(orderId),
    enabled: !!orderId,
    retry: 1,
  });

  const receipt = data?.receipt;

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3" />
        <div className="h-64 bg-gray-200 rounded-2xl w-full" />
        <div className="h-48 bg-gray-200 rounded-2xl w-full" />
      </div>
    );
  }

  if (isError || !receipt) {
    return (
      <section>
        <Link
          to="/admin/receipts"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-800 hover:underline mb-6"
        >
          Back to Receipts
        </Link>
        <div className="mt-4 rounded-2xl border border-red-100 bg-red-50 p-8 text-center">
          <h2 className="text-lg font-semibold text-red-900 mb-2">Receipt Unavailable</h2>
          <p className="text-sm text-red-700 mb-6">
            The receipt for this order could not be loaded.
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => refetch()}
              className="px-5 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate("/admin/receipts")}
              className="px-5 py-2 bg-white border border-red-200 text-red-700 rounded-lg text-sm font-semibold hover:bg-red-50 transition"
            >
              Back to Receipts
            </button>
          </div>
        </div>
      </section>
    );
  }

  const shortId = String(receipt.orderId || orderId).slice(-8).toUpperCase();
  const orderDateStr = receipt.orderDate
    ? new Date(receipt.orderDate).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "N/A";

  return (
    <section>
      <div className="print:hidden mb-6 flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <Link
            to="/admin/receipts"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-800 hover:underline"
          >
            Back to Receipts
          </Link>
          <span className="text-gray-300">|</span>
          <Link
            to={`/admin/orders/${orderId}`}
            className="text-sm font-medium text-gray-600 hover:text-gray-800"
          >
            View Order Details
          </Link>
        </div>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 bg-primary-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-800 transition"
        >
          Print Receipt
        </button>
      </div>

      <article className="bg-white border border-gray-200 shadow-sm print:shadow-none print:border-0">
        <div className="flex items-start justify-between border-b border-gray-200 px-8 py-8 print:px-6 print:py-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">RIZLA</h1>
            <p className="text-xs uppercase tracking-widest text-gray-400 mt-0.5">Boutique</p>
          </div>
          <div className="text-right text-sm text-gray-600">
            <p className="font-semibold text-gray-800 text-base">Receipt #{shortId}</p>
            <p className="mt-1">{orderDateStr}</p>
            <span
              className={`inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${
                receipt.paymentStatus === "paid"
                  ? "bg-green-100 text-green-800"
                  : receipt.paymentStatus === "failed"
                  ? "bg-red-100 text-red-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {receipt.paymentStatus}
            </span>
          </div>
        </div>

        <div className="px-8 py-6 print:px-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-b border-gray-100 pb-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">
                Billed To
              </p>
              <p className="font-semibold text-gray-900">{receipt.customerName}</p>
              {receipt.customerEmail && (
                <p className="text-sm text-gray-600 mt-0.5">{receipt.customerEmail}</p>
              )}
              {receipt.customerPhone && (
                <p className="text-sm text-gray-600 mt-0.5">{receipt.customerPhone}</p>
              )}
            </div>
            <div className="sm:text-right">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">
                Order Info
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Method: </span>
                <span className="capitalize">
                  {receipt.paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment"}
                </span>
              </p>
              <p className="text-sm text-gray-600 mt-0.5">
                <span className="font-medium">Order Status: </span>
                <span className="capitalize">{receipt.orderStatus}</span>
              </p>
            </div>
          </div>

          {receipt.shippingAddress && (
            <div className="border-b border-gray-100 pb-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">
                Shipping Address
              </p>
              <p className="text-sm text-gray-700">{receipt.shippingAddress.fullName}</p>
              <p className="text-sm text-gray-700">
                {receipt.shippingAddress.addressLine1}
                {receipt.shippingAddress.addressLine2
                  ? `, ${receipt.shippingAddress.addressLine2}`
                  : ""}
              </p>
              <p className="text-sm text-gray-700">
                {receipt.shippingAddress.city}, {receipt.shippingAddress.state} -{" "}
                {receipt.shippingAddress.pincode}
              </p>
              {receipt.shippingAddress.phone && (
                <p className="text-sm text-gray-700 mt-0.5">
                  Phone: {receipt.shippingAddress.phone}
                </p>
              )}
            </div>
          )}

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
                  <span className="font-medium">-{fmt(receipt.discount)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-gray-900 pt-3 text-base font-bold text-gray-900">
                <span>Total</span>
                <span>{fmt(receipt.totalAmount)}</span>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6 text-center text-xs text-gray-400">
            <p>
              Receipt generated by{" "}
              <span className="font-semibold text-gray-600">RIZLA BOUTIQUE</span> Administration.
            </p>
            <p className="mt-1">This is a digitally generated receipt.</p>
          </div>
        </div>
      </article>
    </section>
  );
};

export default AdminReceiptDetails;
