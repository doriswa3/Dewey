
import { useState } from "react";
import { Search, Filter } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FeedPost from "@/components/FeedPost";
import BookCard from "@/components/BookCard";
import { useGlobalContext } from "@/context";
import coverImg from "../images/cover_not_found.jpg";
import { useShelfContext } from "@/components/contexts/ShelfContext";

const SearchPage = () => {
  const {isOnShelf, removeFromShelf, addToShelf} = useShelfContext();
  const [activeTab, setActiveTab] = useState("forYou");
  const [searchQuery, setSearchQuery] = useState("");
  const { books, loading, resultTitle, setSearchTerm } = useGlobalContext();
  const booksWithCovers = books.map((singleBook) => {
    return {
      ...singleBook,
      // removing /works/ to get only id
      id: (singleBook.id).replace("/works/", ""),
      cover: singleBook.cover_id ? `https://covers.openlibrary.org/b/id/${singleBook.cover_id}-L.jpg` : coverImg
    }
  });
  

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16 flex justify-center">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row gap-6 justify-center">
            {/* Main Feed Column */}
            <div className="w-full md:w-2/3">
              {/* Header */}
              <div className="text-center mb-8 bg-dewey-green p-6 rounded-lg animate-fade-in">
                <h1 className="text-3xl font-bold text-white">Search for Users, Books, Posts</h1>
                <p className="text-white mt-2">Find what you're looking for in our community</p>
              </div>

              {/* Search Bar */}
              <div className="mb-6 flex justify-center">
                <div className="relative w-full max-w-2xl">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
                  <input
                    type="text"
                    placeholder="Search books, reviews, or users..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setSearchTerm(e.target.value);
                    }}
                    className="w-full pl-14 pr-6 py-4 text-lg border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-dewey-green focus:border-dewey-green"
                  />
                </div>
              </div>
              
              {/* Feed Tabs */}
              <div className="flex justify-center border-b mb-6">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 justify-center">
                {
                  booksWithCovers.slice(0, 30).map((item, index) => {
                    return (
                      <BookCard key={index} id={item.id} cover={item.cover} title={item.title} author={item.author?.join(", ")}
                        isOnShelf={isOnShelf(item.title)}
                        onToggleShelf={() => {
                          isOnShelf(item.title)
                            ? removeFromShelf(item.title)
                            : addToShelf({
                                cover: item.cover,
                                id: item.id,
                                title: item.title,
                                author: item.author?.join(", "),
                                rating: 0,
                                liked: false,
                              });
                        }}
                      />
                    )
                  })
                }
                
                <div className="text-center py-6">
                  <button className="btn-secondary">Load More</button>
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

export default SearchPage;
