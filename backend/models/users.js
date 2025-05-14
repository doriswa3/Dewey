import { pool } from '../db/index.js';
import bcrypt from 'bcrypt';


export async function createUser({ username, email, password }) {
    try {
        // Hash the password before saving it to the database
        const salt = await bcrypt.genSalt(10);  // Generate a salt
        const hashedPassword = await bcrypt.hash(password, salt);  // Hash the password
    
        // Insert the new user into the database
        const result = await pool.query(
          `INSERT INTO users (username, email, password_hash) 
           VALUES ($1, $2, $3) 
           RETURNING user_id, username, email`, 
          [username, email, hashedPassword]
        );
    
        return result.rows[0];  // Return the created user without the password hash
      } catch (err) {
        throw new Error('Error creating user: ' + err.message);
      }
}

export async function findUserByEmail(email) {
    try {
        const result = await pool.query(
          `SELECT * FROM users WHERE email = $1`, 
          [email]
        );
    
        return result.rows[0];  // Return the user if found, or undefined if not
      } catch (err) {
        throw new Error('Error fetching user: ' + err.message);
      }
}

// Function to update user profile (full_name, email)
export async function updateUserProfile(userId, { full_name, email }) {
    const query = 'UPDATE users SET full_name = $1, email = $2, updated_at = CURRENT_TIMESTAMP WHERE user_id = $3 RETURNING *';
    const result = await pool.query(query, [full_name, email, userId]);
    return result.rows[0];  // Return the updated user info
  }

// Function to update user password
export async function updatePassword(userId, newPassword) {
    const query = 'UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2';
    await pool.query(query, [newPassword, userId]);
  } 
