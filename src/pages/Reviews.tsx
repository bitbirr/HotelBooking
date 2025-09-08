import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ArrowLeft, User, ThumbsUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
}

const Reviews: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: '1',
      userName: 'Sarah M.',
      rating: 5,
      comment: 'Absolutely amazing experience! The staff was incredibly welcoming and the location is perfect. The traditional coffee ceremony was a highlight of my stay.',
      date: '2024-01-15',
      helpful: 12
    },
    {
      id: '2',
      userName: 'David K.',
      rating: 4,
      comment: 'Great hotel with excellent amenities. The pool area is beautiful and the restaurant serves authentic Ethiopian cuisine. Room was clean and comfortable.',
      date: '2024-01-10',
      helpful: 8
    },
    {
      id: '3',
      userName: 'Maria L.',
      rating: 5,
      comment: 'Perfect location near Bole Airport. The shuttle service was punctual and the rooms are modern and spacious. Will definitely stay here again!',
      date: '2024-01-05',
      helpful: 15
    }
  ]);

  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: ''
  });

  const hotel = {
    id: id,
    name: 'Ethiopian Skylight Hotel',
    averageRating: 4.8,
    totalReviews: reviews.length
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (newReview.rating && newReview.comment && isAuthenticated) {
      const review: Review = {
        id: Date.now().toString(),
        userName: 'You',
        rating: newReview.rating,
        comment: newReview.comment,
        date: new Date().toISOString().split('T')[0],
        helpful: 0
      };
      
      setReviews(prev => [review, ...prev]);
      setNewReview({ rating: 0, comment: '' });
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
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{hotel.name}</h1>
            <div className="flex items-center space-x-2 mt-2">
              <div className="flex">
                {renderStars(Math.floor(hotel.averageRating))}
              </div>
              <span className="font-medium text-lg">{hotel.averageRating}</span>
              <span className="text-gray-600">({hotel.totalReviews} reviews)</span>
            </div>
          </div>
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
                      <h3 className="font-medium text-gray-800">{review.userName}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="flex">
                          {renderStars(review.rating)}
                        </div>
                        <span className="text-sm text-gray-600">{review.date}</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 leading-relaxed mb-3">{review.comment}</p>
                  
                  <div className="flex items-center space-x-4 text-sm">
                    <button className="flex items-center space-x-1 text-gray-600 hover:text-emerald-600 transition-colors">
                      <ThumbsUp className="h-4 w-4" />
                      <span>Helpful ({review.helpful})</span>
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