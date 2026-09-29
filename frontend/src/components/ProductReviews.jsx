import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  useProductReviews, 
  useCreateReview, 
  useUpdateReview, 
  useDeleteReview 
} from '../hooks/useReview';

const StarRating = ({ rating, setRating, interactive = false }) => {
  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => interactive && setRating(star)}
          className={`focus:outline-none ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
          aria-label={`${star} Star${star > 1 ? 's' : ''}`}
        >
          <svg
            className={`w-6 h-6 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300 fill-current'}`}
            viewBox="0 0 24 24"
          >
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        </button>
      ))}
    </div>
  );
};

export default function ProductReviews({ productId }) {
  const { user } = useAuth();
  const { data, isLoading, isError, error } = useProductReviews(productId);
  const createMutation = useCreateReview();
  const updateMutation = useUpdateReview();
  const deleteMutation = useDeleteReview();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isEditing, setIsEditing] = useState(null); // stores review._id if editing
  const [formError, setFormError] = useState('');
  
  const reviews = data?.reviews || [];
  
  const userExistingReview = user ? reviews.find(r => r.user?._id === user._id || r.user === user._id) : null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    if (rating === 0) {
      setFormError('Please select a rating.');
      return;
    }
    if (!comment.trim() || comment.length < 3) {
      setFormError('Please write a review with at least 3 characters.');
      return;
    }

    if (isEditing) {
      updateMutation.mutate(
        { productId, reviewId: isEditing, data: { rating, comment } },
        {
          onSuccess: () => {
            setIsEditing(null);
            setRating(0);
            setComment('');
          },
          onError: (err) => setFormError(err.response?.data?.message || err.message)
        }
      );
    } else {
      createMutation.mutate(
        { productId, data: { rating, comment } },
        {
          onSuccess: () => {
            setRating(0);
            setComment('');
          },
          onError: (err) => setFormError(err.response?.data?.message || err.message)
        }
      );
    }
  };

  const handleEditInit = (review) => {
    setIsEditing(review._id);
    setRating(review.rating);
    setComment(review.comment);
    setFormError('');
  };

  const handleDelete = (reviewId) => {
    if (window.confirm('Are you sure you want to delete your review?')) {
      deleteMutation.mutate({ productId, reviewId }, {
        onSuccess: () => {
          if (isEditing === reviewId) {
            setIsEditing(null);
            setRating(0);
            setComment('');
          }
        },
        onError: (err) => alert(err.response?.data?.message || err.message)
      });
    }
  };

  const isFormLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="mt-12 border-t border-gray-200 pt-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Customer Reviews</h2>
      
      {isLoading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      )}

      {isError && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md mb-8">
          {error?.message || 'Failed to load reviews.'}
        </div>
      )}

      {/* Review Form */}
      {user && (!userExistingReview || isEditing) && (
        <div className="bg-gray-50 rounded-lg p-6 mb-10 border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {isEditing ? 'Update Your Review' : 'Write a Review'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            {formError && <div className="text-red-600 text-sm">{formError}</div>}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
              <StarRating rating={rating} setRating={setRating} interactive={true} />
            </div>

            <div>
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">Review</label>
              <textarea
                id="comment"
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                placeholder="Share your thoughts about this product..."
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={isFormLoading}
                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {isFormLoading ? 'Submitting...' : isEditing ? 'Update Review' : 'Submit Review'}
              </button>
              
              {isEditing && (
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(null);
                    setRating(0);
                    setComment('');
                    setFormError('');
                  }}
                  disabled={isFormLoading}
                  className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Review List */}
      {!isLoading && !isError && reviews.length === 0 && (
        <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <p>No reviews yet. Be the first to review this product!</p>
        </div>
      )}

      <div className="space-y-8">
        {reviews.map((review) => {
          // Identify if current review belongs to user
          const isOwner = user && (review.user?._id === user._id || review.user === user._id);
          // Review user can be populated object or just ID
          const reviewerName = review.user?.name || 'Customer';

          return (
            <div key={review._id} className="border-b border-gray-200 pb-8">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-lg mr-4">
                    {reviewerName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{reviewerName}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'long', day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                {isOwner && (
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleEditInit(review)}
                      className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(review._id)}
                      disabled={deleteMutation.isPending && deleteMutation.variables?.reviewId === review._id}
                      className="text-red-600 hover:text-red-900 text-sm font-medium disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
              <div className="mb-3">
                <StarRating rating={review.rating} />
              </div>
              <div className="prose prose-sm text-gray-700 max-w-none">
                <p>{review.comment}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
