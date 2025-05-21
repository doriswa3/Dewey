
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <img
              src="/lovable-uploads/ac2ebd7a-1bd4-42d0-8adf-09c17aa922dd.png"
              alt="Dewey Logo"
              className="h-10"
            />
            
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
          <Link
              to="/searchpage"
              className="text-gray-600 hover:text-dewey-green transition-colors"
            >
              Search
            </Link>
            <Link
              to="/feed"
              className="text-gray-600 hover:text-dewey-green transition-colors"
            >
              Feed
            </Link>
            <Link
              to="/profile"
              className="text-gray-600 hover:text-dewey-green transition-colors"
            >
              Profile
            </Link>
            <Link
              to="/about"
              className="text-gray-600 hover:text-dewey-green transition-colors"
            >
              About
            </Link>
            <Link to="/join" className="btn-primary">
              Join Now
            </Link>
          </div>

          {/* Mobile Navigation Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-dewey-green p-2"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="md:hidden bg-white absolute top-16 left-0 right-0 p-4 shadow-lg animate-fade-in">
            <div className="flex flex-col space-y-4">
              <Link
                to="/feed"
                className="text-gray-600 hover:text-dewey-green transition-colors p-2"
                onClick={() => setIsOpen(false)}
              >
                Feed
              </Link>
              <Link
                to="/profile"
                className="text-gray-600 hover:text-dewey-green transition-colors p-2"
                onClick={() => setIsOpen(false)}
              >
                Profile
              </Link>
              <Link
                to="/about"
                className="text-gray-600 hover:text-dewey-green transition-colors p-2"
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>
              <Link
                to="/join"
                className="btn-primary text-center"
                onClick={() => setIsOpen(false)}
              >
                Join Now
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
