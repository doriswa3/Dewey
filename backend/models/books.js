import { pool } from '../db/index.js';

// Create a new book
export async function addBook({ title, author, genre, description, publish_date, isbn }) {
  const result = await pool.query(
    `INSERT INTO books (title, author, genre, description, publish_date, isbn)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [title, author, isbn, image_url]
  );
  return result.rows[0];
}

// Get all books
export async function getAllBooks() {
  const result = await pool.query(`SELECT * FROM books ORDER BY created_at DESC`);
  return result.rows;
}

// Get book by ID
export async function getBookById(book_id) {
  const result = await pool.query(
    `SELECT * FROM books WHERE book_id = $1`,
    [book_id]
  );
  return result.rows[0];
}

// Get books by title
export async function getBooksByTitle(title) {
    const result = await pool.query(
      `SELECT * FROM books WHERE title ILIKE $1 ORDER BY created_at DESC`, 
      [`%${title}%`] 
    );
    return result.rows;
  }
