import express from 'express';
// Import book-related model functions
import { addBook, getAllBooks, getBookById } from '../models/books.js';

const router = express.Router();

/**
 * Route: POST /
 * Description: Adds a new book to the database.
 * Request body should include: title, author, isbn, image_url
 */
router.post('/', async (req, res) => {
  const { title, author, isbn, image_url } = req.body;
  try {
    // Add book using model function
    const book = await addBook({ title, author, isbn, image_url });
    // Respond with the created book and status 201 (Created)
    res.status(201).json(book);
  } catch (err) {
    // Handle errors and respond with 500 status
    res.status(500).json({ message: 'Error adding book', error: err });
  }
});

/**
 * Route: GET /
 * Description: Retrieves a list of all books from the database.
 */
router.get('/', async (_req, res) => {
  try {
    // Get all books from the model
    const books = await getAllBooks();
    // Respond with the list of books
    res.json(books);
  } catch (err) {
    // Handle errors and respond with 500 status
    res.status(500).json({ message: 'Error retrieving books', error: err });
  }
});

/**
 * Route: GET /:id
 * Description: Retrieves a single book by its ID.
 */
router.get('/:id', async (req, res) => {
  try {
    // Fetch the book by ID using model function
    const book = await getBookById(req.params.id);
    // If not found, send a 404 response
    if (!book) return res.status(404).json({ message: 'Book not found' });
    // Otherwise, send the book data
    res.json(book);
  } catch (err) {
    // Handle errors and respond with 500 status
    res.status(500).json({ message: 'Error retrieving book', error: err });
  }
});

/**
 * Route: GET /search?title=someTitle
 * Description: Searches for books by title.
 */
router.get('/search', async (req, res) => {
  const { title } = req.query; // Extract title from query parameters

  // If title is missing, return 400 Bad Request
  if (!title) {
    return res.status(400).json({ message: 'Title query parameter is required' });
  }

  try {
    // Search for books using title 
    const books = await getBooksByTitle(title);
    // If no books are found, return 404
    if (books.length === 0) {
      return res.status(404).json({ message: 'No books found matching the title' });
    }
    // Otherwise, return the found books
    res.json(books);
  } catch (err) {
    // Handle errors and respond with 500 status
    res.status(500).json({ message: 'Error retrieving books', error: err });
  }
});

export default router;
