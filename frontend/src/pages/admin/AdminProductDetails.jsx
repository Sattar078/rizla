import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useProduct } from '../../hooks/useProducts';

// ── Small helper components ────────────────────────────────────────────────────
const DetailRow = ({ label, children }) => (
  <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 py-3 border-b border-gray-100 last:border-0">
    <dt className="text-xs font-semibold uppercase tracking-wider text-gray-500 shrink-0 sm:w-36">
      {label}
    </dt>
    <dd className="text-sm text-gray-900">{children}</dd>
  </div>
);

const Badge = ({ children, variant = 'default' }) => {
  const classes = {
    default: 'bg-gray-100 text-gray-700',
    success: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
    danger: 'bg-red-50 text-red-800 border border-red-200',
    info: 'bg-blue-50 text-blue-700 border border-blue-200',
  };
  return (
    <span
      className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${classes[variant]}`}
    >
      {children}
    </span>
  );
};

// ── Main page ──────────────────────────────────────────────────────────────────
const AdminProductDetails = () => {
  const { productId } = useParams();
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  // Use existing useProduct hook (queryKey: ['product', productId])
  const { data, isLoading, isError, error, refetch } = useProduct(productId);

  // Backend returns { success, product }
  const product = data?.product || data?.data?.product;

  // ── Loading ────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Breadcrumb skeleton */}
        <div className="h-4 w-56 bg-gray-200 animate-pulse rounded" />
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
          <div className="grid md:grid-cols-[320px_1fr] gap-8">
            <div className="space-y-3">
              <div className="w-full aspect-[3/4] bg-gray-200 animate-pulse rounded-2xl" />
              <div className="flex gap-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-16 h-20 bg-gray-200 animate-pulse rounded-xl" />
                ))}
              </div>
            </div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-5 bg-gray-200 animate-pulse rounded" style={{ width: `${70 - i * 10}%` }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (isError || !product) {
    return (
      <div className="space-y-6">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
            <li><Link to="/admin" className="hover:text-primary-900 transition-colors">Dashboard</Link></li>
            <li>/</li>
            <li><Link to="/admin/products" className="hover:text-primary-900 transition-colors">Products</Link></li>
            <li>/</li>
            <li className="text-red-500">Not Found</li>
          </ol>
        </nav>
        <div className="bg-white rounded-2xl border border-red-200 p-10 text-center shadow-sm">
          <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-base font-semibold text-gray-900 mb-1">Product Not Found</h2>
          <p className="text-sm text-gray-500 mb-6">
            {error?.message || 'This product could not be loaded. It may have been deleted.'}
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => refetch()}
              className="px-5 py-2 rounded-full border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
            >
              Retry
            </button>
            <Link
              to="/admin/products"
              className="px-5 py-2 bg-primary-900 text-white rounded-full text-xs font-semibold hover:bg-primary-800 transition"
            >
              Back to Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Derived data ───────────────────────────────────────────────────────────
  const images = product.images || [];
  const variants = product.variants || [];
  const totalStock = variants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0);
  const createdAt = product.createdAt
    ? new Date(product.createdAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null;
  const updatedAt = product.updatedAt
    ? new Date(product.updatedAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null;

  return (
    <div className="space-y-6">
      {/* ── Breadcrumb ─────────────────────────────────────────────────── */}
      <nav aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
          <li>
            <Link to="/admin" className="hover:text-primary-900 transition-colors">
              Dashboard
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link to="/admin/products" className="hover:text-primary-900 transition-colors">
              Products
            </Link>
          </li>
          <li>/</li>
          <li className="text-primary-900 font-bold truncate max-w-[200px]">
            {product.name}
          </li>
        </ol>
      </nav>

      {/* ── Page Header ────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#305f4b]">
            Product Details
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-semibold text-gray-900 mt-1 line-clamp-2">
            {product.name}
          </h1>
          <p className="text-xs text-gray-400 font-mono mt-1">ID: {product._id}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link
            to="/admin/products"
            className="inline-flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-full text-xs font-semibold text-gray-700 bg-white hover:border-gray-400 transition shadow-sm"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </Link>
          <Link
            to={`/admin/products/${productId}/edit`}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-900 text-white rounded-full text-xs font-semibold hover:bg-primary-800 transition shadow-sm"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Product
          </Link>
        </div>
      </div>

      {/* ── Main Content ───────────────────────────────────────────────── */}
      <div className="grid md:grid-cols-[340px_minmax(0,1fr)] gap-6">

        {/* ── Image Gallery ────────────────────────────────────────────── */}
        <div className="space-y-3">
          {/* Main Image */}
          <div className="w-full aspect-[4/5] rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 shadow-sm flex items-center justify-center">
            {images.length > 0 ? (
              <img
                src={images[activeImageIdx]?.url}
                alt={`${product.name} — image ${activeImageIdx + 1}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-gray-400">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-xs">No images</span>
              </div>
            )}
          </div>

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((img, idx) => (
                <button
                  key={img._id || img.publicId || idx}
                  type="button"
                  onClick={() => setActiveImageIdx(idx)}
                  aria-label={`View image ${idx + 1}`}
                  className={`shrink-0 w-16 h-20 rounded-xl overflow-hidden border-2 transition ${
                    activeImageIdx === idx
                      ? 'border-primary-900'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <img
                    src={img.url}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {images.length === 0 && (
            <p className="text-xs text-gray-400 text-center">
              No product images uploaded.
            </p>
          )}
        </div>

        {/* ── Details Panel ─────────────────────────────────────────────── */}
        <div className="space-y-4">

          {/* Core Info Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 pb-3 border-b border-gray-100">
              Product Information
            </h2>
            <dl>
              <DetailRow label="Name">{product.name}</DetailRow>
              <DetailRow label="Category">
                {product.category?.name ? (
                  <Badge variant="info">{product.category.name}</Badge>
                ) : (
                  <span className="text-gray-400">Uncategorized</span>
                )}
              </DetailRow>
              <DetailRow label="Price">
                <span className="text-lg font-display font-semibold text-gray-900">
                  ₹{Number(product.price || 0).toLocaleString('en-IN')}
                </span>
              </DetailRow>
              <DetailRow label="Status">
                <Badge variant={totalStock > 0 ? 'success' : 'danger'}>
                  {totalStock > 0 ? `${totalStock} In Stock` : 'Out of Stock'}
                </Badge>
              </DetailRow>
              {product.averageRating !== undefined && (
                <DetailRow label="Rating">
                  <span className="flex items-center gap-1.5 font-semibold text-gray-800">
                    <span className="text-amber-400">★</span>
                    {Number(product.averageRating).toFixed(1)}
                    <span className="text-gray-400 font-normal text-xs">
                      ({product.totalReviews || 0} review{product.totalReviews !== 1 ? 's' : ''})
                    </span>
                  </span>
                </DetailRow>
              )}
              {createdAt && <DetailRow label="Created">{createdAt}</DetailRow>}
              {updatedAt && <DetailRow label="Updated">{updatedAt}</DetailRow>}
            </dl>
          </div>

          {/* Description Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
              Description
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {product.description || <span className="text-gray-400 italic">No description provided.</span>}
            </p>
          </div>

          {/* Variants Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Variants ({variants.length})
              </h2>
              {variants.length > 0 && (
                <span className="text-xs text-gray-500">
                  Total: {totalStock} units
                </span>
              )}
            </div>

            {variants.length === 0 ? (
              <p className="text-sm text-gray-400 py-3">No variants defined.</p>
            ) : (
              <div className="overflow-hidden rounded-xl border border-gray-100">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                    <tr>
                      <th className="px-4 py-3">Size</th>
                      <th className="px-4 py-3">Color</th>
                      <th className="px-4 py-3">Stock</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {variants.map((v, idx) => (
                      <tr key={v._id || idx} className="hover:bg-gray-50/50">
                        <td className="px-4 py-3">
                          <Badge>{v.size}</Badge>
                        </td>
                        <td className="px-4 py-3 text-gray-700">{v.color}</td>
                        <td className="px-4 py-3">
                          <Badge variant={Number(v.stock) > 0 ? 'success' : 'danger'}>
                            {v.stock} units
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Quick Actions Footer ─────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-gray-200">
        <Link
          to="/admin/products/create"
          className="inline-flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-full text-xs font-semibold text-gray-700 bg-white hover:border-gray-400 transition shadow-sm"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New Product
        </Link>
        <Link
          to={`/admin/products/${productId}/edit`}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-900 text-white rounded-full text-xs font-semibold hover:bg-primary-800 transition shadow-sm"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit This Product
        </Link>
      </div>
    </div>
  );
};

export default AdminProductDetails;
