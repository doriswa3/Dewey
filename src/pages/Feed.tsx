
import { useState } from "react";
import { Search, Filter } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FeedPost from "@/components/FeedPost";
import BookCard from "@/components/BookCard";
import { useGlobalContext } from "@/context";
import coverImg from "../images/cover_not_found.jpg";
import { useShelfContext } from "@/components/contexts/ShelfContext";
import { useFeedContext } from "@/components/contexts/FeedContext";

const Feed = () => {
  const {isOnShelf, removeFromShelf, addToShelf} = useShelfContext();
  const [activeTab, setActiveTab] = useState("forYou");
  const [searchQuery, setSearchQuery] = useState("");
  const { books, setSearchTerm } = useGlobalContext();
  const { feedPosts } = useFeedContext();
  
  
  
  const trendingBooks = [
    {
      cover: "https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=400&auto=format&fit=crop",
      title: "Beneath the Surface",
      author: "Sarah Chen",
      rating: 4,
    },
    {
      cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&auto=format&fit=crop",
      title: "The Silent Echo",
      author: "Amelia Blackwood",
      rating: 5,
    },
    {
      cover: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&auto=format&fit=crop",
      title: "Whispers in the Dark",
      author: "James Holden",
      rating: 4,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">

            {/* Main Feed Column */}
            <div className="w-full">
              
              
              {/* Feed Tabs */}
              <div className="flex border-b mb-6">
                <button
                  onClick={() => setActiveTab("forYou")}
                  className={`px-4 py-2 font-medium ${
                    activeTab === "forYou"
                      ? "text-dewey-green border-b-2 border-dewey-green"
                      : "text-gray-600 hover:text-dewey-green"
                  }`}
                >
                  For You
                </button>
                <button
                  onClick={() => setActiveTab("following")}
                  className={`px-4 py-2 font-medium ${
                    activeTab === "following"
                      ? "text-dewey-green border-b-2 border-dewey-green"
                      : "text-gray-600 hover:text-dewey-green"
                  }`}
                >
                  Following
                </button>
                <button
                  onClick={() => setActiveTab("trending")}
                  className={`px-4 py-2 font-medium ${
                    activeTab === "trending"
                      ? "text-dewey-green border-b-2 border-dewey-green"
                      : "text-gray-600 hover:text-dewey-green"
                  }`}
                >
                  Trending
                </button>
              </div>
              
              {/* Feed Posts */}
              <div className="flex">
                <div className="w-2/3 space-y-6">
                  {feedPosts.map((post, index) => (
                    <FeedPost key={index} {...post} />
                  ))}
                </div>
                <div className="w-1/3 pl-6">
                  {/* Trending Books */}
                  <div className="card mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-serif text-xl font-medium">Trending Now</h3>
                      <button className="text-sm text-dewey-green hover:text-dewey-light-green">
                        See All
                      </button>
                    </div>
                    <div className="space-y-4">
                      {trendingBooks.map((book, index) => (
                        <div key={index} className="flex items-center">
                          <img
                            src={book.cover}
                            alt={book.title}
                            className="w-16 h-20 object-cover rounded-md shadow-sm"
                          />
                          <div className="ml-3">
                            <h4 className="font-medium line-clamp-1">{book.title}</h4>
                            <p className="text-sm text-gray-600 mb-1">{book.author}</p>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                  key={star}
                                  className={`text-xs ${
                                    star <= book.rating ? "text-dewey-green" : "text-gray-300"
                                  }`}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Reading Challenges */}
                  <div className="card mb-6">
                    <h3 className="font-serif text-xl font-medium mb-4">Reading Challenge</h3>
                    <div className="bg-dewey-tan/30 rounded-lg p-4 mb-4">
                      <p className="font-medium mb-2">2025 Goal: 52 books</p>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                        <div
                          className="bg-dewey-green h-2.5 rounded-full"
                          style={{ width: "35%" }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-600">18 of 52 books read (35%)</p>
                    </div>
                    <button className="text-dewey-green hover:text-dewey-light-green text-sm font-medium">
                      Update Progress
                    </button>
                  </div>
                  {/* Reading Lists */}
                  <div className="card">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-serif text-xl font-medium">Your Reading Lists</h3>
                      <button className="text-sm text-dewey-green hover:text-dewey-light-green">
                        Create New
                      </button>
                    </div>
                    <ul className="space-y-2">
                      <li>
                        <a
                          href="#"
                          className="flex justify-between items-center p-2 hover:bg-dewey-tan/20 rounded-lg"
                        >
                          <span className="font-medium">Summer TBR</span>
                          <span className="text-sm text-gray-500">12 books</span>
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="flex justify-between items-center p-2 hover:bg-dewey-tan/20 rounded-lg"
                        >
                          <span className="font-medium">All-Time Favorites</span>
                          <span className="text-sm text-gray-500">8 books</span>
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="flex justify-between items-center p-2 hover:bg-dewey-tan/20 rounded-lg"
                        >
                          <span className="font-medium">Book Club Picks</span>
                          <span className="text-sm text-gray-500">5 books</span>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Feed;
