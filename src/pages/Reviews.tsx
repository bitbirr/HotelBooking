import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ArrowLeft, User, ThumbsUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';

interface Review {
  id: number;
  rating: number;
  comment: string;
  created_at: number;
  user_id: number;
  hotel_id: number;
  user?: {
    name: string;
    email: string;
  };
}

interface Hotel {
  id: number;
  name: string;
  rating: number;
}

const Reviews: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);

  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        const hotelId = parseInt(id);
        const hotelData = await apiService.getHotel(hotelId);
        setHotel(hotelData);

        const allReviews = await apiService.getReviews();
        const hotelReviews = allReviews.filter((review: any) => review.hotel_id === hotelId);
        setReviews(hotelReviews);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newReview.rating && newReview.comment && isAuthenticated && user && hotel) {
      try {
        const reviewData = {
          rating: newReview.rating,
          comment: newReview.comment,
          user_id: user.id,
          hotel_id: hotel.id
        };

        const createdReview = await apiService.createReview(reviewData);
        setReviews(prev => [createdReview, ...prev]);
        setNewReview({ rating: 0, comment: '' });
      } catch (error) {
        console.error('Error creating review:', error);
      }
    }
  };

  const renderStars = (rating: number, interactive: boolean = false, onRate?: (rating: number) => void) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${
          i < rating 
            ? 'text-amber-400 fill-current' 
            : interactive 
              ? 'text-gray-300 hover:text-amber-400 cursor-pointer' 
              : 'text-gray-300'
        } ${interactive ? 'transition-colors' : ''}`}
        onClick={() => interactive && onRate && onRate(i + 1)}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link
            to={`/hotel/${id}`}
            className="mr-4 p-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          {hotel && (
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{hotel.name}</h1>
              <div className="flex items-center space-x-2 mt-2">
                <div className="flex">
                  {renderStars(Math.floor(hotel.rating))}
                </div>
                <span className="font-medium text-lg">{hotel.rating}</span>
                <span className="text-gray-600">({reviews.length} reviews)</span>
              </div>
            </div>
          )}
        </div>

        {/* Write Review Section */}
        {isAuthenticated ? (
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
            <h2 className="text-xl font-semibold mb-4">Write a Review</h2>
            <form onSubmit={handleSubmitReview}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Rating
                </label>
                <div className="flex space-x-1">
                  {renderStars(newReview.rating, true, (rating) => 
                    setNewReview(prev => ({ ...prev, rating }))
                  )}
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Review
                </label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Share your experience at this hotel..."
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={!newReview.rating || !newReview.comment}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-md font-medium transition-colors"
              >
                Submit Review
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-8 text-center">
            <h2 className="text-xl font-semibold mb-2">Share Your Experience</h2>
            <p className="text-gray-600 mb-4">
              Sign in to write a review and help other travelers make informed decisions.
            </p>
            <Link 
              to="/login"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-md font-medium transition-colors inline-block"
            >
              Sign In to Review
            </Link>
          </div>
        )}

        {/* Reviews List */}
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="h-6 w-6 text-emerald-600" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="font-medium text-gray-800">
                        {review.user?.name || 'Anonymous User'}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="flex">
                          {renderStars(review.rating)}
                        </div>
                        <span className="text-sm text-gray-600">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-700 leading-relaxed mb-3">{review.comment}</p>

                  <div className="flex items-center space-x-4 text-sm">
                    <button className="flex items-center space-x-1 text-gray-600 hover:text-emerald-600 transition-colors">
                      <ThumbsUp className="h-4 w-4" />
                      <span>Helpful</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {reviews.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-4">No reviews yet</div>
            <p className="text-gray-600">Be the first to share your experience at this hotel!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;