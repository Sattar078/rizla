import { Link } from 'react-router-dom';
import { useWishlist, useRemoveFromWishlist } from '../hooks/useWishlist';

const Wishlist = () => {
  const { data, isLoading, isError, error } = useWishlist();
  const removeMutation = useRemoveFromWishlist();

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
          <h2 className="text-xl font-bold mb-2">Error Loading Wishlist</h2>
          <p>{error?.message || 'Something went wrong.'}</p>
        </div>
      </div>
    );
  }

  const wishlistItems = data?.wishlist || [];

  if (wishlistItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Wishlist is Empty</h2>
        <p className="text-gray-500 mb-8">Save items you love to your wishlist and review them later.</p>
        <Link to="/" className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-md font-medium hover:bg-indigo-700">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Wishlist</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlistItems.map((product) => {
          // It's possible the product was deleted from DB but still in wishlist (though backend usually filters them out).
          if (!product || !product._id) return null;
          const imageUrl = product.images?.length > 0 ? product.images[0].url : 'https://placehold.co/400x500?text=No+Image';

          return (
            <div key={product._id} className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
              <Link to={`/products/${product._id}`} className="block">
                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                  <img
                    src={imageUrl}
                    alt={product.name}
                    className="h-64 w-full object-cover object-center group-hover:opacity-75"
                  />
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
              </Link>
              <div className="px-4 pb-4 mt-auto">
                <button
                  onClick={() => removeMutation.mutate(product._id)}
                  disabled={removeMutation.isPending}
                  className="w-full text-center text-sm text-red-600 hover:text-red-800 font-medium border border-red-200 py-2 rounded-md hover:bg-red-50 disabled:opacity-50"
                >
                  {removeMutation.isPending ? 'Removing...' : 'Remove from Wishlist'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Wishlist;
