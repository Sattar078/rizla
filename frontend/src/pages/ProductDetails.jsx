import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { useProduct } from '../hooks/useProducts';
import { useAuth } from '../context/AuthContext';
import { useWishlist, useAddToWishlist, useRemoveFromWishlist } from '../hooks/useWishlist';
import { useAddToCart } from '../hooks/useCart';
import ProductReviews from '../components/ProductReviews';

const ProductDetails = () => {
  const { productId, id } = useParams();
  const currentProductId = productId || id;

  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const { data, isLoading, isError, error, refetch } = useProduct(currentProductId);
  const { data: wishlistData } = useWishlist();

  const addWishlistMutation = useAddToWishlist();
  const removeWishlistMutation = useRemoveFromWishlist();
  const addToCartMutation = useAddToCart();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [cartError, setCartError] = useState('');
  const [addedSuccess, setAddedSuccess] = useState(false);

  const product = data?.product;
  const isWishlisted = Boolean(
    wishlistData?.wishlist?.some((item) => (item._id || item) === currentProductId)
  );

  const variants = useMemo(() => product?.variants || [], [product]);
  const hasVariants = variants.length > 0;

  // Auto-select first in-stock variant if none selected
  React.useEffect(() => {
    if (hasVariants && !selectedVariant) {
      const firstInStock = variants.find((v) => v.stock > 0) || variants[0];
      if (firstInStock) {
        setSelectedVariant(firstInStock);
      }
    }
  }, [hasVariants, variants, selectedVariant]);

  const currentMaxStock = hasVariants
    ? selectedVariant ? selectedVariant.stock : 0
    : 0;

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login', { state: { from: location } });
      return;
    }
    if (isWishlisted) {
      removeWishlistMutation.mutate(currentProductId);
    } else {
      addWishlistMutation.mutate(currentProductId);
    }
  };

  const handleAddToCart = () => {
    setCartError('');
    setAddedSuccess(false);

    if (!user) {
      navigate('/login', { state: { from: location } });
      return;
    }

    if (hasVariants && !selectedVariant) {
      setCartError('Please select a variant (size & color) before adding to bag.');
      return;
    }

    if (currentMaxStock <= 0) {
      setCartError('Selected variant is currently out of stock.');
      return;
    }

    if (quantity > currentMaxStock) {
      setCartError(`Only ${currentMaxStock} item${currentMaxStock === 1 ? '' : 's'} available in stock.`);
      return;
    }

    addToCartMutation.mutate(
      {
        productId: currentProductId,
        size: selectedVariant ? selectedVariant.size : 'Standard',
        color: selectedVariant ? selectedVariant.color : 'Standard',
        quantity,
      },
      {
        onSuccess: () => {
          setAddedSuccess(true);
          setQuantity(1);
        },
        onError: (err) => {
          setCartError(err.message || 'Failed to add item to bag.');
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="aspect-[4/5] bg-gray-200 rounded-3xl animate-pulse" />
            <div className="grid grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-square bg-gray-200 rounded-2xl animate-pulse" />
              ))}
            </div>
          </div>
          <div className="space-y-6 pt-4">
            <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
            <div className="h-10 bg-gray-200 rounded-2xl w-3/4 animate-pulse" />
            <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse" />
            <div className="h-24 bg-gray-200 rounded-2xl animate-pulse" />
            <div className="h-14 bg-gray-200 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-red-50/80 border border-red-200 p-8 rounded-3xl text-center max-w-lg mx-auto space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900">Product Not Found</h2>
          <p className="text-sm text-red-700">
            {error?.message || 'This product does not exist or has been removed from our catalog.'}
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => refetch()}
              className="px-5 py-2.5 rounded-full border border-red-300 text-xs font-bold uppercase tracking-wider text-red-800 hover:bg-red-100 transition"
            >
              Retry
            </button>
            <Link
              to="/products"
              className="px-5 py-2.5 rounded-full bg-primary-900 text-xs font-bold uppercase tracking-wider text-white hover:bg-primary-800 transition"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const images = product.images?.length > 0
    ? product.images
    : [{ url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80' }];

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb Navigation */}
      <div className="border-b border-gray-100 bg-[#fbfaf7]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center text-xs font-semibold uppercase tracking-wider text-gray-400 space-x-2">
            <Link to="/" className="hover:text-primary-900 transition-colors">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-primary-900 transition-colors">Products</Link>
            <span>/</span>
            <span className="text-primary-900 truncate max-w-xs">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Image Gallery */}
          <div className="space-y-4 relative">
            {/* Wishlist Floating Button */}
            <button
              onClick={handleWishlistToggle}
              disabled={addWishlistMutation.isPending || removeWishlistMutation.isPending}
              aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              className="absolute top-4 right-4 z-10 p-3.5 rounded-full bg-white/90 backdrop-blur shadow-md hover:bg-white transition-all transform active:scale-95"
            >
              {isWishlisted ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500 fill-current" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400 hover:text-red-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              )}
            </button>

            {/* Main Stage Image */}
            <div className="aspect-[4/5] w-full rounded-3xl overflow-hidden bg-gray-100 border border-gray-100 shadow-sm relative group">
              <img
                src={images[selectedImage]?.url || images[0]?.url}
                alt={product.name}
                className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 pt-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`aspect-square rounded-2xl overflow-hidden bg-gray-100 border-2 transition-all ${
                      selectedImage === idx
                        ? 'border-primary-900 ring-2 ring-primary-900/20'
                        : 'border-transparent hover:border-gray-300 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img.url} alt="" className="h-full w-full object-cover object-center" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details & Ordering Section */}
          <div className="flex flex-col">
            {product.category?.name && (
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary-700 mb-2">
                {product.category.name}
              </span>
            )}

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight leading-tight">
              {product.name}
            </h1>

            {/* Price and Rating Bar */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-gray-100">
              <p className="text-2xl sm:text-3xl font-black text-primary-900">
                ₹{(product.price || 0).toLocaleString('en-IN')}
              </p>

              <div className="flex items-center gap-2">
                <div className="flex items-center text-amber-400">
                  <span className="text-lg">★</span>
                  <span className="ml-1 text-sm font-bold text-gray-900">
                    {(product.averageRating || 0).toFixed(1)}
                  </span>
                </div>
                <span className="text-xs font-medium text-gray-400">
                  ({product.totalReviews || 0} customer reviews)
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="mt-6 text-sm text-gray-600 leading-relaxed font-normal">
              <p>{product.description}</p>
            </div>

            {/* Variant Selector */}
            {hasVariants && (
              <div className="mt-8 pt-8 border-t border-gray-100 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900">
                    Select Variant
                  </h3>
                  {selectedVariant && (
                    <span className="text-xs font-semibold text-gray-500">
                      Selected: <strong className="text-gray-900">{selectedVariant.size} • {selectedVariant.color}</strong>
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {variants.map((v, i) => {
                    const isSelected =
                      selectedVariant &&
                      (selectedVariant._id ? selectedVariant._id === v._id : (selectedVariant.size === v.size && selectedVariant.color === v.color));
                    const isOut = v.stock <= 0;

                    return (
                      <button
                        key={v._id || i}
                        type="button"
                        disabled={isOut}
                        onClick={() => {
                          setSelectedVariant(v);
                          setQuantity(1);
                          setCartError('');
                        }}
                        className={`p-4 rounded-2xl border text-left transition-all relative ${
                          isSelected
                            ? 'border-primary-900 bg-primary-50/40 ring-2 ring-primary-900/20'
                            : 'border-gray-200 hover:border-gray-400 bg-white'
                        } ${isOut ? 'opacity-40 cursor-not-allowed bg-gray-50' : 'cursor-pointer'}`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-bold text-gray-900">
                              {v.size} <span className="font-normal text-gray-500">/ {v.color}</span>
                            </p>
                          </div>
                          <span
                            className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                              isOut
                                ? 'bg-red-50 text-red-600'
                                : v.stock < 5
                                ? 'bg-amber-50 text-amber-700'
                                : 'bg-green-50 text-green-700'
                            }`}
                          >
                            {isOut ? 'Sold out' : `${v.stock} in stock`}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity Selector & Add to Bag */}
            <div className="mt-8 pt-8 border-t border-gray-100 space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Quantity Controls */}
                <div className="flex items-center justify-between border border-gray-200 rounded-full h-14 px-2 w-full sm:w-36 bg-gray-50/50">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1 || currentMaxStock <= 0}
                    className="h-10 w-10 flex items-center justify-center rounded-full text-gray-600 hover:bg-white hover:shadow-sm disabled:opacity-30 transition font-bold"
                  >
                    −
                  </button>
                  <span className="font-bold text-gray-900 text-sm">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(currentMaxStock, q + 1))}
                    disabled={quantity >= currentMaxStock || currentMaxStock <= 0}
                    className="h-10 w-10 flex items-center justify-center rounded-full text-gray-600 hover:bg-white hover:shadow-sm disabled:opacity-30 transition font-bold"
                  >
                    +
                  </button>
                </div>

                {/* Primary Add To Bag Button */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={
                    addToCartMutation.isPending ||
                    currentMaxStock <= 0 ||
                    (hasVariants && !selectedVariant)
                  }
                  className="flex-1 h-14 rounded-full bg-primary-900 text-white font-bold text-sm uppercase tracking-wider hover:bg-primary-800 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2"
                >
                  {addToCartMutation.isPending ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Adding to Bag…
                    </>
                  ) : currentMaxStock <= 0 ? (
                    'Out of Stock'
                  ) : (
                    'Add to Bag'
                  )}
                </button>
              </div>

              {/* Added to Bag Success Banner */}
              {addedSuccess && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-2xl flex items-center justify-between animate-fadeIn">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-700">✓</span>
                    <p className="text-xs font-bold text-green-900">
                      Product added to your shopping bag!
                    </p>
                  </div>
                  <Link
                    to="/cart"
                    className="text-xs font-bold uppercase tracking-wider text-primary-900 hover:underline"
                  >
                    View Bag →
                  </Link>
                </div>
              )}

              {/* Error Alert */}
              {cartError && (
                <div role="alert" className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-semibold text-red-600 text-center">
                  {cartError}
                </div>
              )}
            </div>

            {/* Delivery & Boutique Promises */}
            <div className="mt-10 pt-8 border-t border-gray-100 grid grid-cols-2 gap-4 text-xs font-medium text-gray-500">
              <div className="flex items-center gap-3">
                <span className="text-lg">🚚</span>
                <span>Complimentary Delivery across India</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg">✨</span>
                <span>100% Authentic Rizla Guaranteed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="mt-20">
          <ProductReviews productId={currentProductId} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
