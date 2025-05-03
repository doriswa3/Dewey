import express from 'express';
// Import user-related model functions
import { createUser, findUserByEmail } from '../models/users.js';
// Import bcrypt for password hashing and comparison
import bcrypt from 'bcrypt';

const router = express.Router();

/**
 * Route: POST /signup
 * Description: Registers a new user by creating a record in the database.
 * Expects: { username, email, password } in the request body
 */
router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // Check if a user with the given email already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'This email is already registered! Please log in.' });
    }

    // to-do: hashing in createUser() 
    const user = await createUser({ username, email, password });

    // Return the created user (excluding sensitive info like password hash)
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error signing up', error: err });
  }
});

/**
 * Route: POST /login
 * Description: Authenticates a user by comparing provided credentials with stored ones.
 * Expects: { email, password } in the request body
 */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // Retrieve user by email
    const user = await findUserByEmail(email);

    // If user doesn't exist, respond with an error
    if (!user) return res.status(400).json({ message: 'A user with this email does not exist, please create an account.' });

    // Compare provided password with the stored hash
    const match = await bcrypt.compare(password, user.password_hash);

    // If passwords don't match, respond with an error
    if (!match) return res.status(400).json({ message: 'Passwords do not match, please try again.' });

    // Respond with basic user info (excluding password)
    res.json({ user_id: user.user_id, username: user.username });
  } catch (err) {
    res.status(500).json({ message: 'Login error', error: err });
  }
});

// Route: PUT /reset-password/:token
// Description: Resets the user's password using the token
router.put('/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const { new_password } = req.body;
  
    try {
      // Find the user with the matching reset token and ensure it's not expired
      const result = await pool.query('SELECT * FROM users WHERE reset_token = $1', [token]);
      const user = result.rows[0];
  
      if (!user) {
        return res.status(400).json({ message: 'Invalid token.' });
      }
  
      if (user.reset_token_expiry < Date.now()) {
        return res.status(400).json({ message: 'Token has expired. Please request a new one.' });
      }
  
      // Hash the new password and update the user record
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(new_password, salt);
  
      // Update the user's password and clear the reset token
      await pool.query('UPDATE users SET password_hash = $1, reset_token = NULL, reset_token_expiry = NULL WHERE user_id = $2', [hashedPassword, user.user_id]);
  
      res.json({ message: 'Password has been successfully reset.' });
    } catch (err) {
      res.status(500).json({ message: 'Error resetting password.', error: err });
    }
  });

export default router;
