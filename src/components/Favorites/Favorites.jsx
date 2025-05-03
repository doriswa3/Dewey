import "../Favorites/Favorites.css";
import {useFavoritesContext} from "../Favorites/FavoritesContext";
import Book from "../BookList/Book";
import {useState} from 'react'
import {useEffect} from 'react';


function Favorites() {

  
    const { favorites, ratings, setRating } = useFavoritesContext();

  const [pendingInsert, setPendingInsert] = useState(null);

  const handleRatingCategory = (book, category) => {
    const sorted = Object.entries(ratings)
      .filter(([_, r]) => r.category === category)
      .sort(([, a], [, b]) => a.position - b.position)
      .map(([id]) => id);

    if (sorted.length === 0) {
      setRating(book.id, category, 0);
      return;
    }

    setPendingInsert({ book, category, low: 0, high: sorted.length, sortedIds: sorted });
  };

  const resolveComparison = (preferred) => {
    const { book, category, low, high, sortedIds } = pendingInsert;
  
    if (low === high) {
      const newRatings = { ...ratings };
  
      // Shift other books down
      for (const [id, value] of Object.entries(newRatings)) {
        if (value.category === category && value.position >= low) {
          newRatings[id] = { ...value, position: value.position + 1 };
        }
      }
  
      // Insert current book
      newRatings[book.id] = { category, position: low };
  
      // Pass updated ratings to context
      setRating(book.id, category, low, newRatings);
      setPendingInsert(null);
      return;
    }
  
    const mid = Math.floor((low + high) / 2);
    const next = preferred === 'more' ? { low, high: mid } : { low: mid + 1, high };
    setPendingInsert({ ...pendingInsert, ...next });
  };
  

  const renderRankedCategory = (category, title) => {
    const books = Object.entries(ratings)
      .filter(([_, r]) => r.category === category)
      .sort(([, a], [, b]) => a.position - b.position)
      .map(([id]) => favorites.find((b) => b.id === id))
      .filter(Boolean);

    if (books.length === 0) return null;

    return (
      <div className="category-section">
        <h3>{title}</h3>
        <section className = "booklist">
            <div className = "container">
              <div className='booklist-content grid'>
                  {books.map((book) => (
                      <Book
                        key = {book.id}
                        book={book}
                        ratingCategory={category}
                        readOnly={true}
                      />
                  ))}
                </div>
            </div>
          </section>
      </div>
    );
  };

  const uncategorized = favorites.filter(book => !ratings[book.id]);

  return (
    <div className="favorites">
      <h2>Your Favorites</h2>
      <div className="profile-header">
      <img className="profile-avatar" src="user.png" alt="User avatar" />
      <div className="profile-info">
        <h2>Welcome, Bookworm!</h2>
        <p>You’ve saved {favorites.length} favorite books</p>
      </div>
    </div>
    
      {renderRankedCategory('love', 'Loved Books')}
      {renderRankedCategory('like', 'Liked Books')}
      {renderRankedCategory('hate', 'Hated Books')}

      {uncategorized.length > 0 && (
        
        <div className="category-section">
          <h3>Uncategorized Books</h3>
          <section className = "booklist">
            <div className = "container">
              <div className='booklist-content grid'>
                {uncategorized.map(book => (
                    <Book
                      key = {book.id}
                      book={book}
                      readOnly={false}
                      onRateCategory={(category) => handleRatingCategory(book, category)}
                    />
                ))}
              
            </div>
          </div>
          </section>
        </div>
      )}

      {pendingInsert && (
        <div className="tie-popup-overlay">
          <div className="tie-popup">
            <h3>Help us rank your {pendingInsert.category} books</h3>
            <p>
              Do you prefer <strong>{pendingInsert.book.title}</strong> over{' '}
              <strong>{
                favorites.find(
                  (b) => b.id === pendingInsert.sortedIds[Math.floor((pendingInsert.low + pendingInsert.high) / 2)]
                )?.title
              }</strong>?
            </p>
            <div className="tie-buttons">
              <button onClick={() => resolveComparison('more')}>More</button>
              <button onClick={() => resolveComparison('less')}>Less</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
    


export default Favorites

