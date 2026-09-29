import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWishlist, useAddToWishlist, useRemoveFromWishlist } from '../hooks/useWishlist';
import { useAddToCart } from '../hooks/useCart';

const ProductCard = ({ product }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const { data: wishlistData } = useWishlist();
  const addWishlistMutation = useAddToWishlist();
  const removeWishlistMutation = useRemoveFromWishlist();
  const addToCartMutation = useAddToCart();

  const isWishlisted = wishlistData?.wishlist?.some(item => item._id === product._id);

  const handleWishlistToggle = (e) => {
    e.preventDefault(); // Prevent navigating to product details
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

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    // If product has variants, navigate to details to select them
    if (product.variants && product.variants.length > 0) {
      navigate(`/products/${product._id}`);
      return;
    }
    
    addToCartMutation.mutate({
      productId: product._id,
      quantity: 1
    });
  };

  const imageUrl = product.images?.length > 0 ? product.images[0].url : 'https://placehold.co/400x500?text=No+Image';

  return (
    <Link to={`/products/${product._id}`} className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="relative aspect-h-1 aspect-w-1 w-full overflow-hidden bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
        <img
          src={imageUrl}
          alt={product.name}
          className="h-64 w-full object-cover object-center group-hover:opacity-75"
        />
        {/* Wishlist Heart Button */}
        <button
          onClick={handleWishlistToggle}
          disabled={addWishlistMutation.isPending || removeWishlistMutation.isPending}
          className="absolute top-2 right-2 p-2 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 shadow-sm transition"
        >
          {isWishlisted ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 fill-current" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 hover:text-red-500 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          )}
        </button>
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-sm text-gray-700">{product.name}</h3>
        {product.category && (
          <p className="mt-1 text-xs text-gray-500">{product.category.name}</p>
        )}
        <div className="mt-2 flex items-center justify-between">
          <p className="text-lg font-medium text-gray-900">${product.price?.toFixed(2)}</p>
          {product.averageRating > 0 && (
            <div className="flex items-center text-sm text-gray-500">
              <span className="text-yellow-400 mr-1">★</span>
              {product.averageRating?.toFixed(1)}
            </div>
          )}
        </div>
      </div>
      <div className="px-4 pb-4 mt-auto">
        <button
          onClick={handleAddToCart}
          disabled={addToCartMutation.isPending}
          className="w-full text-center text-sm font-medium border border-indigo-600 text-indigo-600 hover:bg-indigo-50 py-2 rounded-md transition disabled:opacity-50"
        >
          {addToCartMutation.isPending && addToCartMutation.variables?.productId === product._id ? 'Adding...' : 'Add to Cart'}
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;
