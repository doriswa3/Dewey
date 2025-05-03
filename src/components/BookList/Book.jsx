import React from 'react';
import { Link } from 'react-router-dom';
import "./BookList.css";
import { useFavoritesContext } from '../Favorites/FavoritesContext';
import {useState} from 'react';

const Book = ({ book, ratingCategory = '', onRateCategory = null, readOnly = false }) => {
  const {isFavorite, addToFavorites, removeFromFavorites, handleRatingCategory} = useFavoritesContext()
  const [showCategorySelect, setShowCategorySelect] = useState(false);
  const favorite = isFavorite(book.id)
    
  const onFavoriteClick = (e) => {
    e.preventDefault();
    if (!favorite) {
      addToFavorites(book);
      setShowCategorySelect(true);
    } else {
      removeFromFavorites(book.id);
    }
  };

  const handleCategoryChoice = (category) => {
    setShowCategorySelect(false);
    handleRatingCategory(book, category);
  };

  // const renderStars = () => {
  //   return Array.from({ length: 5 }, (_, i) => (
  //       <span
  //           key={i}
  //           className={`star ${i < rating ? "filled" : ""} ${readOnly ? "readonly" : ""}`}
  //           onClick={!readOnly && onRate ? () => onRate(i + 1) : undefined}
  //       >
  //           ★
  //       </span>
  //   ));
  // };  

  return (
    <div className='book-item flex flex-column flex-sb'>
      <button className = {`favorite-btn ${favorite ? "active" : ""}`} onClick={onFavoriteClick}>
        <i className={favorite ? "fas fa-bookmark" : "far fa-bookmark"}></i>
      </button>
      <div className='book-item-img'>
        <img src = {book.cover_img} alt = "cover" />
      </div>
      <div className='book-item-info text-center'>
        <Link to = {`/book/${book.id}`} {...book}>
          <div className='book-item-info-item title fw-7 fs-18'>
            <span>{book.title}</span>
          </div>
        </Link>
        <div className='book-item-info-item author fs-15'>
          <span className='text-capitalize fw-7'>Author: </span>
          <span>{book.author.join(", ")}</span>
        </div>

        <div className='book-item-info-item publish-year fs-15'>
          <span>{book.first_publish_year}</span>
        </div>
        {/* <div className="rating">{renderStars()}</div> */}
        {!readOnly && (
          <div className="rating-buttons">
            <button onClick={() => onRateCategory('love')}>love it</button>
            <button onClick={() => onRateCategory('like')}>like it</button>
            <button onClick={() => onRateCategory('hate')}>hate it</button>
          </div>
        )}
        {readOnly && ratingCategory && (
          <div className="rating-label">
            {ratingCategory === 'love' && 'loved it'}
            {ratingCategory === 'like' && 'liked it'}
            {ratingCategory === 'hate' && 'hated it'}
          </div>
        )}
        {showCategorySelect && (
          <div className="popup rating-buttons">
            <p>How do you feel about this book?</p>
            <button onClick={() => handleCategoryChoice('love')} >love it</button>
            <button onClick={() => handleCategoryChoice('like')}>like it</button>
            <button onClick={() => handleCategoryChoice('hate')}>hate it</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Book