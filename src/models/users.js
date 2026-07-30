import db from './db.js';
import bcrypt from 'bcrypt';

const createUser = async (name, email, passwordHash) => {
    const default_role = 'user';
    const query = `
        INSERT INTO users (name, email, password_hash, role_id) 
        VALUES ($1, $2, $3, (SELECT role_id FROM roles WHERE role_name = $4)) 
        RETURNING user_id
    `;
    const queryParams = [name, email, passwordHash, default_role];
    
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create user');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new user with ID:', result.rows[0].user_id);
    }

    return result.rows[0].user_id;
};

// Model function to find user by email (includes name and role_name)
const findUserByEmail = async (email) => {
    const query = `
        SELECT 
            u.user_id, 
            u.name, 
            u.email, 
            u.password_hash, 
            u.role_id,
            r.role_name 
        FROM users u
        LEFT JOIN roles r ON u.role_id = r.role_id
        WHERE u.email = $1
    `;
    const result = await db.query(query, [email]);
    
    if (result.rows.length === 0) {
        return null; // User not found
    }

    return result.rows[0];
};

const verifyPassword = async (password, passwordHash) => {
    return bcrypt.compare(password, passwordHash);
};

// Main authentication function
const authenticateUser = async (email, password) => {
    //  Look up user by email
    const user = await findUserByEmail(email);
    if (!user) {
        return null;
    }

    //  Verify password
    const isPasswordValid = await verifyPassword(password, user.password_hash);
    if (!isPasswordValid) {
        return null;
    }

    //  Remove password_hash before returning user object for security
    delete user.password_hash;
    return user;
};

export { createUser, authenticateUser, findUserByEmail };