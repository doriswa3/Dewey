import { useShelfContext } from "@/components/contexts/ShelfContext";
import { useState } from "react";
import { Book, Bookmark, Heart, Star, Edit, Settings, Users } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookCard from "@/components/BookCard";
import { useRatingContext } from "@/components/contexts/RatingContext";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("shelves");
  const {recentlyRead, isOnShelf, addToShelf, removeFromShelf} = useShelfContext();
  const {ratings, pendingInsert} = useRatingContext();
  const [showAllTopBooks, setShowAllTopBooks] = useState(false);


  const topBooks = [];
  ["love", "like", "hate"].forEach((category) => {
    const sorted = Object.values(ratings)
      .filter((r) => r.category === category)
      .sort((a, b) => a.position - b.position);

    topBooks.push(...sorted);
  });

  const displayedBooks = showAllTopBooks ? topBooks : topBooks.slice(0, 5);

  const ViewAllSorted = () => {
    return(
    <div>
       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
        {topBooks.map((rating, index) => (
          <div key={rating.book.id} className="relative">
            <span className="absolute -top-2 -left-2 bg-dewey-green text-white text-xs px-2 py-1 rounded-full z-10">
              #{index + 1}
            </span>
            <BookCard
              id={rating.book.id}
              cover={rating.book.cover}
              title={rating.book.title}
              author={rating.book.author}
              rating={rating.position}
              liked={false}
              isOnShelf={isOnShelf(rating.book.title)}
              onToggleShelf={() =>
                isOnShelf(rating.book.title)
                  ? removeFromShelf(rating.book.title)
                  : addToShelf(rating.book)
              }
            />
          </div>
        ))}
        </div>
    </div>
    )
  };

  const dnfBooks = Object.values(ratings)
    .filter(r => r.category === "dnf")
    .map(r => r.book);

  const userData = {
    username: "bookworm_emma",
    name: "Emma Thompson",
    bio: "Book lover, coffee addict, and aspiring writer. Fantasy and historical fiction enthusiast.",
    image: "https://i.pravatar.cc/300?img=5",
    booksRead: 127,
    booksRated: 98,
    following: 83,
    followers: 156,
    favoriteGenres: ["Fantasy", "Historical Fiction", "Mystery", "Sci-Fi"],
  };
  
  const currentlyReading = [
    {
      cover: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&auto=format&fit=crop",
      title: "The Invisible Life of Addie LaRue",
      author: "V.E. Schwab",
      progress: 65,
    },
    {
      cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&auto=format&fit=crop",
      title: "The Silent Patient",
      author: "Alex Michaelides",
      progress: 23,
    },
  ];
  

  const [nextReadShelf, setNextRead] = useState([recentlyRead]);
  const handleAddToShelf = (book) => {
    setNextRead((prev) => [{ ...book, rating: 0, liked: false }, ...prev]);
  };
  const [popupVisible, setPopupVisible] = useState({});
  const bookLists = [
    {
      name: "Want to Read",
      count: 37,
      books: recentlyRead.slice(0, 2),
    },
    {
      name: "Favorites",
      count: 16,
      books: recentlyRead.slice(1),
    },
    {
      name: "Summer Reading",
      count: 8,
      books: recentlyRead.slice(0, 3).reverse(),
    },
    {
      name: "Didn't Finish",
      count: dnfBooks.length,
      books: dnfBooks
    }
  ];

  

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          {/* Profile Header */}
          <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
            <div className="flex flex-col md:flex-row items-start">
              {/* Profile Picture */}
              <div className="relative mb-6 md:mb-0 mr-0 md:mr-8">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-dewey-green">
                  <img
                    src={userData.image}
                    alt={userData.username}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button className="absolute bottom-0 right-0 bg-dewey-green text-white p-1.5 rounded-full">
                  <Edit size={16} />
                </button>
              </div>
              
              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                  <div>
                    <h1 className="font-serif text-2xl md:text-3xl font-bold">{userData.name}</h1>
                    <p className="text-gray-600">@{userData.username}</p>
                  </div>
                  
                  <div className="flex space-x-3 mt-4 sm:mt-0">
                    <button className="btn-primary">Follow</button>
                    <button className="p-2 rounded-full border border-gray-300 hover:border-dewey-green hover:bg-dewey-tan/20 transition-colors">
                      <Settings size={20} className="text-gray-700" />
                    </button>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4">{userData.bio}</p>
                
                {/* Stats */}
                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center">
                    <Book className="text-dewey-green mr-2" size={18} />
                    <span className="text-gray-700">
                      <span className="font-medium">{userData.booksRead}</span> Books Read
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Star className="text-dewey-green mr-2" size={18} />
                    <span className="text-gray-700">
                      <span className="font-medium">{userData.booksRated}</span> Rated
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Users className="text-dewey-green mr-2" size={18} />
                    <span className="text-gray-700">
                      <span className="font-medium">{userData.following}</span> Following
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Users className="text-dewey-green mr-2" size={18} />
                    <span className="text-gray-700">
                      <span className="font-medium">{userData.followers}</span> Followers
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Favorite Genres */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="font-medium mb-3">Favorite Genres</h3>
              <div className="flex flex-wrap gap-2">
                {userData.favoriteGenres.map((genre) => (
                  <span
                    key={genre}
                    className="bg-dewey-tan px-3 py-1 rounded-full text-dewey-green text-sm"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          {/* Currently Reading */}
          <div className="mb-8">
            <h2 className="font-serif text-2xl font-bold mb-4">Currently Reading</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentlyReading.map((book, index) => (
                <div key={index} className="card flex">
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="w-24 h-36 object-cover rounded-lg shadow-sm"
                  />
                  <div className="ml-4 flex-1">
                    <h3 className="font-serif font-medium text-lg mb-1">{book.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{book.author}</p>
                    <div className="mb-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span>{book.progress}% complete</span>
                        <span>Page 156 of 400</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-dewey-green h-2 rounded-full"
                          style={{ width: `${book.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    <button className="text-sm font-medium text-dewey-green hover:text-dewey-light-green transition-colors">
                      Update Progress
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Profile Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <div className="flex flex-wrap -mb-px">
              <button
                onClick={() => setActiveTab("shelves")}
                className={`inline-block px-4 py-2 border-b-2 font-medium ${
                  activeTab === "shelves"
                    ? "border-dewey-green text-dewey-green"
                    : "border-transparent text-gray-500 hover:text-dewey-green"
                }`}
              >
                Bookshelves
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`inline-block px-4 py-2 border-b-2 font-medium ${
                  activeTab === "reviews"
                    ? "border-dewey-green text-dewey-green"
                    : "border-transparent text-gray-500 hover:text-dewey-green"
                }`}
              >
                Reviews
              </button>
              <button
                onClick={() => setActiveTab("activity")}
                className={`inline-block px-4 py-2 border-b-2 font-medium ${
                  activeTab === "activity"
                    ? "border-dewey-green text-dewey-green"
                    : "border-transparent text-gray-500 hover:text-dewey-green"
                }`}
              >
                Activity
              </button>
            </div>
          </div>
          
          {/* Tab Content */}
          <div>
            {activeTab === "shelves" && (
              <div>
              <div className="mb-10">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-serif text-2xl font-bold">Your Top Books</h2>
                  <button
                    className="text-dewey-green hover:text-dewey-light-green text-sm font-medium"
                    onClick={() => setShowAllTopBooks((prev) => (!prev))}
                  >
                    {showAllTopBooks ? "Show Only Top 5" : "View All"}
                  </button>
                </div>
          
              
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                    {displayedBooks.map((rating, index) => (
                      console.log(rating),
                      <div key={rating.book.id} className="relative">
                        <span className="absolute -top-2 -left-2 bg-dewey-green text-white text-xs px-2 py-1 rounded-full z-10">
                          #{index + 1}
                        </span>
                        <BookCard
                          id={rating.book.id}
                          cover={rating.book.cover}
                          title={rating.book.title}
                          author={rating.book.author}
                          rating={rating.position}
                          stars={rating.book.stars} 
                          review={rating.book.review || "No review available"} // Default message
                          liked={false}
                          isOnShelf={isOnShelf(rating.book.title)}
                          onToggleShelf={() =>
                            isOnShelf(rating.book.title)
                              ? removeFromShelf(rating.book.title)
                              : addToShelf(rating.book)
                          }
                        />
                      </div>
                    ))}
                  </div>
              </div>



                {/* Your Next Read */}
                <div className="mb-10">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="font-serif text-2xl font-bold">Your Next Read</h2>
                    <button className="text-dewey-green hover:text-dewey-light-green text-sm font-medium">
                      View All
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {recentlyRead.map((book, index) => (
                      <BookCard
                        key={index}
                        id = {book.id}
                        cover={book.cover}
                        title={book.title}
                        author={book.author}
                        rating={book.rating}
                        liked={book.liked}
                        isOnShelf={isOnShelf(book.title)}
                        onToggleShelf={() =>
                          isOnShelf(book.title)
                            ? removeFromShelf(book.title)
                            : addToShelf(book)
                        }
                      />
                    ))}
                  </div>
                </div>
                
                
                {/* Book Lists */}
                <div>
                  <h2 className="font-serif text-2xl font-bold mb-4">My Lists</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {bookLists.map((list, index) => (
                      <div key={index} className="card">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="font-serif text-xl font-medium">{list.name}</h3>
                          <span className="text-gray-500 text-sm">{list.count} books</span>
                        </div>
                        <div className="flex mb-4">
                          {list.books.slice(0, 5).map((book, i) => (
                            <img
                              key={i}
                              src={book.cover}
                              alt={book.title}
                              className="w-20 h-28 object-cover rounded-md shadow-md mr-3 last:mr-0"
                            />
                          ))}
                        <button
                          className="text-sm font-medium text-dewey-green hover:text-dewey-light-green transition-colors"
                          onClick={() => {
                            setPopupVisible((prev) => ({
                              ...prev,
                              [index]: !prev[index],
                            }));
                          }}
                        >
                          View List
                        </button>
                        {popupVisible[index] && (
                          <div
                            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                          >
                            <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md">
                              <h3 className="font-serif text-xl font-medium mb-4">{list.name}</h3>
                              <div className="grid grid-cols-1 gap-4">
                                {list.books.map((book, i) => (
                                  <div key={i} className="flex items-center">
                                    <img
                                      src={book.cover}
                                      alt={book.title}
                                      className="w-12 h-16 object-cover rounded-md shadow-md mr-3"
                                    />
                                    <div>
                                      <h4 className="font-medium">{book.title}</h4>
                                      <p className="text-sm text-gray-600">{book.author}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              <button
                                className="mt-4 btn-secondary w-full"
                                onClick={() => {
                                  setPopupVisible((prev) => ({
                                    ...prev,
                                    [index]: false,
                                  }));
                                }}
                              >
                                Close
                              </button>
                            </div>
                          </div>
                        )}
                        </div>
                      </div>
                    ))}
                    <div className="card flex flex-col items-center justify-center text-center h-48">
                      <div className="bg-dewey-tan/50 rounded-full p-3 mb-3">
                        <Bookmark className="text-dewey-green" />
                      </div>
                      <h3 className="font-serif text-xl font-medium mb-2">Create a New List</h3>
                      <p className="text-gray-600 mb-4">
                        Organize your books into custom lists
                      </p>
                      <button className="btn-secondary">Create List</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === "reviews" && (
              <div className="text-center py-12">
                <div className="mb-6">
                  <Star className="w-16 h-16 mx-auto text-dewey-green" />
                </div>
                <h2 className="font-serif text-2xl font-bold mb-2">No Reviews Yet</h2>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Share your thoughts on the books you've read to help others discover great reads!
                </p>
                <button className="btn-primary">Write a Review</button>
              </div>
            )}
            
            {activeTab === "activity" && (
              <div className="text-center py-12">
                <div className="mb-6">
                  <Heart className="w-16 h-16 mx-auto text-dewey-green" />
                </div>
                <h2 className="font-serif text-2xl font-bold mb-2">Activity Feed Coming Soon</h2>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  We're working on making it easier to see what your friends are reading and reviewing!
                </p>
                <button className="btn-primary">Find Friends</button>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
