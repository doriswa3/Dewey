import express from 'express';
import { authenticateJWT } from './auth.js';
import { 
  findUserById, 
  updateUserProfile, 
  updatePassword, 
  addBookToUserList, 
  getBooksForUser, 
  updateBookStatus 
} from '../models/users.js';  

const router = express.Router();

/*
4/23 Updates: 
- Worked on profile features (seeing profile info, updating username/email and password)
- Created a users table to store info about all users
- Added route to request a password reset (auth.js)
*/


// Route to view user profile
router.get('/profile', authenticateJWT, async (req, res) => {
  const userId = req.user.user_id;  // From JWT token

  try {
    const user = await findUserById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json({
      user_id: user.user_id,
      username: user.username,
      email: user.email,
      full_name: user.full_name,
      created_at: user.created_at,
      updated_at: user.updated_at
    });
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving profile.', error: err });
  }
});

// Route to update user profile (full name, email)
router.put('/profile', authenticateJWT, async (req, res) => {
  const { full_name, email } = req.body;
  const userId = req.user.user_id;  // From JWT token

  try {
    const user = await updateUserProfile(userId, { full_name, email });
    res.json({ message: 'Profile updated successfully.', user });
  } catch (err) {
    res.status(500).json({ message: 'Error updating profile.', error: err });
  }
});

// Route to change password
router.put('/profile/password', authenticateJWT, async (req, res) => {
  const { old_password, new_password } = req.body;
  const userId = req.user.user_id;  // From JWT token

  try {
    const user = await findUserById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const match = await bcrypt.compare(old_password, user.password_hash);
    if (!match) {
      return res.status(400).json({ message: 'Old password is incorrect.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(new_password, salt);

    await updatePassword(userId, hashedPassword);
    res.json({ message: 'Password updated successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Error changing password.', error: err });
  }
});

// Route to add book to user's list
router.post('/profile/books', authenticateJWT, async (req, res) => {
  const { book_id, status } = req.body;
  const userId = req.user.user_id;

  try {
    const book = await findBookById(book_id);  // Make sure the book exists
    if (!book) {
      return res.status(404).json({ message: 'Book not found.' });
    }

    await addBookToUserList(userId, book_id, status);
    res.json({ message: 'Book added to your list successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Error adding book to your list.', error: err });
  }
});

// Route to get user's book list
router.get('/profile/books', authenticateJWT, async (req, res) => {
  const userId = req.user.user_id;

  try {
    const books = await getBooksForUser(userId);
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user book list.', error: err });
  }
});

// Route to update book status (currently_reading, read, want_to_read)
router.put('/profile/books/status', authenticateJWT, async (req, res) => {
  const { book_id, status } = req.body;
  const userId = req.user.user_id;

  try {
    await updateBookStatus(userId, book_id, status);
    res.json({ message: 'Book status updated successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating book status.', error: err });
  }
});

export default router;
