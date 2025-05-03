import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  BrowserRouter, Routes, Route
} from 'react-router-dom';
import { AppProvider } from './context.';
import './index.css';
import Home from './pages/Home/Home';
import About from "./pages/About/About";
import BookList from "./components/BookList/BookList";
import BookDetails from "./components/BookDetails/BookDetails";
import Favorites from './components/Favorites/Favorites';
import { BookProvider, useFavoritesContext } from './components/Favorites/FavoritesContext';
import '@fortawesome/fontawesome-free/css/all.min.css';



function TiePopup() {
  const { pendingInsert, resolveComparison, favorites } = useFavoritesContext();

  if (!pendingInsert) return null;

  const midId = pendingInsert.sortedIds[Math.floor((pendingInsert.low + pendingInsert.high) / 2)];
  const midBook = favorites.find(b => b.id === midId);

  return (
    <div className="tie-popup-overlay">
      <div className="tie-popup">
        <h3>Help us rank your {pendingInsert.category} books</h3>
        <p>
          Do you prefer <strong>{pendingInsert.book.title}</strong> over <strong>{midBook?.title}</strong>?
        </p>
        <div className="tie-buttons">
          <button onClick={() => resolveComparison("more")}>More</button>
          <button onClick={() => resolveComparison("less")}>Less</button>
        </div>
      </div>
    </div>
  );
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AppProvider>
    <BookProvider>
    <BrowserRouter>
      <Routes>
        <Route path = "/" element = {<Home />}>
          <Route path = "about" element = {<About />} />
          <Route path = "book" element = {<BookList />} />
          <Route path = "/book/:id" element = {<BookDetails />} />
          <Route path = "/favorites" element = {<Favorites />}/>
        </Route>
      </Routes>
      <TiePopup/>
    </BrowserRouter>
    </BookProvider>
  </AppProvider>
);

