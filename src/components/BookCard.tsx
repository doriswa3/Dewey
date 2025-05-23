import React, { useState } from "react";
import { Heart, Star } from "lucide-react";
import { useRatingContext } from "./contexts/RatingContext";
import { useFeedContext } from "./contexts/FeedContext";
interface BookCardProps {
  id: string;
  cover: string;
  title: string;
  author: string;
  rating?: number;
  stars?: number;
  review?: string;
  liked?: boolean;
  onToggleShelf?: () => void;
  isOnShelf?: boolean;
}

const BookCard = ({ id, cover, title, author, isOnShelf = false, onToggleShelf }: BookCardProps) => {
  const { handleRatingCategory, ratings, setStars, setReview } = useRatingContext();
  const isLiked = !!ratings[id] && ratings[id].category !== "dnf";
  const starsFromContext = ratings[id]?.stars ?? 0;
  const reviewFromContext = ratings[id]?.review ?? "";
  const [review, setReviewLocal] = useState(reviewFromContext);
  const [stars, setStarsLocal] = useState(starsFromContext);
  const [showCategoryPopup, setShowCategoryPopup] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<"love" | "like" | "hate" | "dnf" | null>(null);
  const { addFeedPost } = useFeedContext();
  const book = { id, title, author, cover };

  const handleHeartClick = () => {
    if (!isLiked) {
      setShowCategoryPopup(true);
    }
  };

  const handlePostToFeed = () => {
    addFeedPost({
      username: "bookworm_emma", 
      userImage: "https://i.pravatar.cc/300?img=5",
      bookTitle: title,
      bookAuthor: author,
      bookCover: cover,
      content: review,
      rating: stars,
      likes: 0,
      comments: 0,
      timestamp: new Date().toLocaleString(),
    });
    setShowCategoryPopup(false);
  };

  const chooseCategory = (category: "love" | "like" | "hate" | "dnf") => {
    setSelectedCategory(category);
    handleRatingCategory(book, category);
  };


  const handleReviewSubmit = () => {
    if (selectedCategory !== "dnf") {
      setStars(id, stars); 
      setReview(id, review);
    }
    setShowCategoryPopup(false);
    setSelectedCategory(null);
  };
  

  return (
    <div className="card group w-64 flex flex-col hover:shadow-xl transition-shadow duration-300">
      <div className="relative overflow-hidden rounded-lg mb-4">
        <img
          src={cover}
          alt={`${title} by ${author}`}
          className="w-full h-56 object-contain object-center rounded-lg group-hover:scale-105 transition-transform duration-300"
          onError={(e) => (e.currentTarget.src = "/images/cover_not_found.jpg")}
        />
        <button
          className="absolute top-2 right-2 bg-white/80 hover:bg-white p-1.5 rounded-full"
          onClick={handleHeartClick}
        >
          <Heart
            size={18}
            fill={isLiked ? "#7d9b76" : "none"}
            stroke={isLiked ? "#7d9b76" : "currentColor"}
            className="text-dewey-green"
          />
        </button>
      </div>

      <div className="flex-1">
        <h3 className="font-serif font-medium text-lg mb-1 line-clamp-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-2">{author}</p>
      </div>

      <div className="flex items-center space-x-1 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
        key={star}
        size={20}
        className={`cursor-pointer ${starsFromContext >= star ? "text-yellow-500" : "text-gray-300"}`}
          />
        ))}
      </div>
      <div className="text-sm text-gray-600">
        {review ? (
          <p>{review}</p>
        ) : (
          <p className="italic text-gray-400">No review made yet.</p>
        )}
      </div>


      <button
        onClick={onToggleShelf}
        className={`mt-4 text-sm font-medium border rounded-md px-4 py-1 transition-colors ${
          isOnShelf
            ? "border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
            : "border-dewey-green text-dewey-green hover:bg-dewey-green hover:text-white"
        }`}
      >
        {isOnShelf ? "Remove from Shelf" : "Add to Shelf"}
      </button>

      {showCategoryPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl shadow-lg w-80">
            {!selectedCategory ? (
              <>
                <h3 className="font-serif text-lg font-semibold mb-4">
                  How do you feel about <strong>{title}</strong>?
                </h3>
                <div className="grid grid-cols-1 gap-3 mb-4">
                  <button
                    onClick={() => chooseCategory("love")}
                    className="border border-dewey-green text-dewey-green rounded-lg px-4 py-2 font-medium hover:bg-dewey-green hover:text-white transition-colors"
                  >
                    Love it
                  </button>
                  <button
                    onClick={() => chooseCategory("like")}
                    className="border border-dewey-green text-dewey-green rounded-lg px-4 py-2 font-medium hover:bg-dewey-green hover:text-white transition-colors"
                  >
                    Like it
                  </button>
                  <button
                    onClick={() => chooseCategory("hate")}
                    className="border border-dewey-green text-dewey-green rounded-lg px-4 py-2 font-medium hover:bg-dewey-green hover:text-white transition-colors"
                  >
                    Dislike it
                  </button>
                  <button
                    onClick={() => chooseCategory("dnf")}
                    className="border border-dewey-green text-dewey-green rounded-lg px-4 py-2 font-medium hover:bg-dewey-green hover:text-white transition-colors"
                  >
                    Didn't finish
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="mb-4">
                  <h4 className="font-serif text-md font-semibold mb-2">Rate this book:</h4>
                  <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                    key={star}
                    size={20}
                    className={`cursor-pointer ${stars >= star ? "text-yellow-500" : "text-gray-300"}`}
                    onClick={() => setStarsLocal(star)} 
                    />
                  ))}
                  </div>
                </div>
                <textarea
                  value={review}
                  onChange={(e) => setReviewLocal(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 mb-4"
                  rows={4}
                  placeholder="Write your review here..."
                />
                <button
                  onClick={() => { handleReviewSubmit(); handlePostToFeed(); }}

                  className="bg-dewey-green text-white rounded-lg px-4 py-2 font-medium hover:bg-dewey-green-dark transition-colors"
                >
                  Submit
                </button>
              
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookCard;
