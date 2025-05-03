import {createContext, useState, useContext, useEffect} from "react"

const FavoritesContext = createContext()

export const useFavoritesContext = () => useContext(FavoritesContext)

export const BookProvider = ({children}) => {
    const [favorites, setFavorites] = useState([])
    const [ratings, setRatings] = useState({});
    const [pendingInsert, setPendingInsert] = useState(null);
    
    // const setRating = (id, newRating) => {
    //     setRatings((prev) => ({
    //       ...prev,
    //       [id]: newRating,
    //     }));
    //   };
    const setRating = (bookId, category, position, overrideRatings = null) => {
        setRatings((prev) => {
          const updated = overrideRatings ? { ...overrideRatings } : { ...prev };
          updated[bookId] = { category, position };
          return updated;
        });
      };
      

    useEffect(() => {
        const storedFavs = localStorage.getItem("favorites")
        if(storedFavs) setFavorites(JSON.parse(storedFavs))
    }, [])
        
    useEffect(() => {
        localStorage.setItem('favorites', JSON.stringify(favorites))
    }, [favorites])

    const addToFavorites = (book) => {
        setFavorites(prev => [...prev, book])
    }

    const removeFromFavorites = (bookId) => {
        setFavorites(prev => prev.filter(book => book.id !== bookId))
    }

    const isFavorite = (bookId) => {
        return favorites.some(book => book.id === bookId)
    }
    const handleRatingCategory = (book, category) => {
        const sorted = Object.entries(ratings)
          .filter(([_, r]) => r.category === category)
          .sort(([, a], [, b]) => a.position - b.position)
          .map(([id]) => id);
    
        if (sorted.length === 0) {
          setRating(book.id, category, 0);
        } else {
          setPendingInsert({ book, category, low: 0, high: sorted.length, sortedIds: sorted });
        }
      };
    
      const resolveComparison = (preferred) => {
        const { book, category, low, high, sortedIds } = pendingInsert;
    
        if (low === high) {
          const newRatings = { ...ratings };
          for (const [id, value] of Object.entries(newRatings)) {
            if (value.category === category && value.position >= low) {
              newRatings[id] = { ...value, position: value.position + 1 };
            }
          }
          newRatings[book.id] = { category, position: low };
          setRating(book.id, category, low, newRatings);
          setPendingInsert(null);
          return;
        }
    
        const mid = Math.floor((low + high) / 2);
        const next = preferred === "more" ? { low, high: mid } : { low: mid + 1, high };
        setPendingInsert({ ...pendingInsert, ...next });
      };
    
      const value = {
        favorites,
        ratings,
        setRating,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        pendingInsert,
        handleRatingCategory,
        resolveComparison,
      };

    return <FavoritesContext.Provider value = {value}>
        {children}
    </FavoritesContext.Provider>
}