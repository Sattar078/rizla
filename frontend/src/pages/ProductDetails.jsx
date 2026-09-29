import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useProduct } from '../hooks/useProducts';
import { useAuth } from '../context/AuthContext';
import { useWishlist, useAddToWishlist, useRemoveFromWishlist } from '../hooks/useWishlist';
import { useAddToCart } from '../hooks/useCart';
import ProductReviews from '../components/ProductReviews';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const { data, isLoading, isError, error } = useProduct(id);
  const { data: wishlistData } = useWishlist();
  
  const addWishlistMutation = useAddToWishlist();
  const removeWishlistMutation = useRemoveFromWishlist();
  const addToCartMutation = useAddToCart();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [cartError, setCartError] = useState('');

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (isError || !data?.product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 p-4 rounded-md text-red-700 text-center">
          <h2 className="text-xl font-bold mb-2">Product Not Found</h2>
          <p>{error?.message || 'The product could not be loaded.'}</p>
          <Link to="/" className="mt-4 inline-block text-indigo-600 hover:text-indigo-800">
            &larr; Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const product = data.product;
  const isWishlisted = wishlistData?.wishlist?.some(item => item._id === product._id);
  const hasVariants = product.variants && product.variants.length > 0;
  
  // Calculate max available stock based on variant selection or general stock
  const currentMaxStock = hasVariants 
    ? (selectedVariant ? selectedVariant.stock : 0) 
    : (product.stock || 0);

  const handleWishlistToggle = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (isWishlisted) {
      removeWishlistMutation.mutate(product._id);
    } else {
      addWishlistMutation.mutate(product._id);
    }
  };

  const handleAddToCart = () => {
    setCartError('');
    if (!user) {
      navigate('/login');
      return;
    }
    if (hasVariants && !selectedVariant) {
      setCartError('Please select a variant before adding to cart.');
      return;
    }
    if (currentMaxStock < 1 || quantity > currentMaxStock) {
      setCartError('Not enough stock available.');
      return;
    }
    
    addToCartMutation.mutate(
      {
        productId: product._id,
        quantity,
        ...(selectedVariant && { variantId: selectedVariant._id })
      },
      {
        onSuccess: () => {
          // Reset quantity or show success if needed
          setQuantity(1);
          alert('Added to cart successfully!');
        },
        onError: (err) => {
          setCartError(err.message || 'Failed to add to cart');
        }
      }
    );
  };

  const images = product.images?.length > 0 ? product.images : [{ url: 'https://placehold.co/600x600?text=No+Image' }];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/" className="text-indigo-600 hover:text-indigo-800 mb-6 inline-block">
        &larr; Back to Shop
      </Link>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-4">
        {/* Image Gallery */}
        <div className="space-y-4 relative">
          <button
            onClick={handleWishlistToggle}
            disabled={addWishlistMutation.isPending || removeWishlistMutation.isPending}
            className="absolute top-4 right-4 z-10 p-3 rounded-full bg-white shadow-md hover:bg-gray-50 transition"
          >
            {isWishlisted ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500 fill-current" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400 hover:text-red-500 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            )}
          </button>
          
          <div className="aspect-h-1 aspect-w-1 w-full rounded-lg overflow-hidden bg-gray-100">
            <img 
              src={images[selectedImage]?.url} 
              alt={product.name} 
              className="h-full w-full object-cover object-center"
            />
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`aspect-h-1 aspect-w-1 rounded-md overflow-hidden bg-gray-100 ${selectedImage === idx ? 'ring-2 ring-indigo-500' : 'ring-1 ring-gray-200'}`}
                >
                  <img src={img.url} alt="" className="h-full w-full object-cover object-center" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">{product.name}</h1>
          <p className="mt-2 text-xl text-gray-900">${product.price?.toFixed(2)}</p>
          
          {/* Reviews Summary */}
          {product.totalReviews > 0 && (
            <div className="mt-4 flex items-center">
              <span className="text-yellow-400 text-lg mr-1">★</span>
              <span className="text-gray-700 font-medium">{product.averageRating?.toFixed(1)}</span>
              <span className="text-gray-500 ml-2">({product.totalReviews} reviews)</span>
            </div>
          )}

          <div className="mt-6 prose prose-sm text-gray-500">
            <p>{product.description}</p>
          </div>

          <div className="mt-8 border-t border-gray-200 pt-8">
            <h3 className="text-sm font-medium text-gray-900">Details</h3>
            <ul className="mt-4 space-y-2 text-sm text-gray-500">
              <li><span className="font-medium text-gray-900">Category:</span> {product.category?.name || 'Uncategorized'}</li>
              {!hasVariants && (
                <li>
                  <span className="font-medium text-gray-900">Stock Status:</span>{' '}
                  {product.stock > 0 ? <span className="text-green-600">In Stock ({product.stock})</span> : <span className="text-red-600">Out of Stock</span>}
                </li>
              )}
            </ul>
          </div>

          {/* Variants Selection */}
          {hasVariants && (
            <div className="mt-8 border-t border-gray-200 pt-8">
              <h3 className="text-sm font-medium text-gray-900 mb-4">Select Variant</h3>
              <div className="grid grid-cols-2 gap-4">
                {product.variants.map((variant) => {
                  const isSelected = selectedVariant?._id === variant._id;
                  const isOutOfStock = variant.stock <= 0;
                  return (
                    <button
                      key={variant._id}
                      disabled={isOutOfStock}
                      onClick={() => {
                        setSelectedVariant(variant);
                        setQuantity(1); // reset quantity on variant change
                      }}
                      className={`
                        p-3 border rounded-md text-left transition
                        ${isSelected ? 'border-indigo-600 ring-1 ring-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300'}
                        ${isOutOfStock ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''}
                      `}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-900">
                          {variant.size && <span className="mr-2">{variant.size}</span>}
                          {variant.color && <span>{variant.color}</span>}
                        </span>
                        {isOutOfStock ? (
                          <span className="text-xs text-red-500">Out of stock</span>
                        ) : (
                          <span className="text-xs text-green-600">{variant.stock} left</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity and Add to Cart */}
          <div className="mt-8 border-t border-gray-200 pt-8 flex items-center space-x-4">
            <div className="flex items-center border rounded-md h-12">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                className="px-4 h-full text-gray-600 hover:bg-gray-100 disabled:opacity-50"
              >
                -
              </button>
              <span className="px-4 font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(q => Math.min(currentMaxStock, q + 1))}
                disabled={quantity >= currentMaxStock || currentMaxStock === 0}
                className="px-4 h-full text-gray-600 hover:bg-gray-100 disabled:opacity-50"
              >
                +
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={addToCartMutation.isPending || currentMaxStock === 0 || (hasVariants && !selectedVariant)}
              className="flex-1 h-12 flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {addToCartMutation.isPending ? 'Adding to Cart...' : 'Add to Cart'}
            </button>
          </div>
          
          {cartError && (
            <p className="mt-2 text-sm text-red-600">{cartError}</p>
          )}
        </div>
      </div>
      
      {/* Product Reviews */}
      <ProductReviews productId={product._id} />
    </div>
  );
};

export default ProductDetails;
