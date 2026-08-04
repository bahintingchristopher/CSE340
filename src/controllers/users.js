import bcrypt from 'bcrypt';
import { createUser, authenticateUser, getAllUsers } from '../models/users.js';
import { getProjectsByVolunteer } from '../models/volunteers.js';

const showUserRegistrationForm = (req, res) => {
    res.render('register', { title: 'Register' });
};

const processUserRegistrationForm = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Hash the password before storing it
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Create the user in the database
        const userId = await createUser(name, email, passwordHash);

        // Redirect to the home page after successful registration
        req.flash('success', 'Registration successful! Please log in.');
        res.redirect('/');
    } catch (error) {
        console.error('Error registering user:', error);
        
        // Check if error is PostgreSQL code 23505 (Unique Constraint Violation)
        if (error.code === '23505') {
            req.flash('error', 'Email address has an existing record. Please try logging in.');
        } else {
            req.flash('error', 'An error occurred during registration. Please try again.');
        }

        res.redirect('/register');
    }
};

  // week4 - create controller functdions for login        
const showLoginForm = (req, res) => {
    res.render('login', { title: 'Login' });
};

const processLoginForm = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await authenticateUser(email, password);
        if (user) {
            // Store user info in session
            req.session.user = user;
            req.flash('success', 'Login successful!');

            if (res.locals.NODE_ENV === 'development') {
                console.log('User logged in:', user);
            }

            res.redirect('/dashboard');
        } else {
            req.flash('error', 'Invalid email or password.');
            res.redirect('/login');
        }
    } catch (error) {
        console.error('Error during login:', error);
        req.flash('error', 'An error occurred during login. Please try again.');
        res.redirect('/login');
    }
};

const processLogout = async (req, res) => {
    if (req.session.user) {
        delete req.session.user;
    }

    req.flash('success', 'Logout successful!');
    res.redirect('/login');
};

// create middleware to protect routes week5
const requireLogin = (req, res, next) => {
    if (!req.session || !req.session.user) {
        req.flash('error', 'You must be logged in to access that page.');
        return res.redirect('/login');
    }
    next();
};


// middleware to protect routes week5
const showDashboard = async (req, res, next) => {
    try {
        const user = req.session.user;

        // week6 final project - show projects the user has volunteered for
        const volunteeredProjects = await getProjectsByVolunteer(user.user_id);
        
        res.render('dashboard', { 
            title: 'Dashboard',
            name: user.first_name || user.username || user.name || 'User',
            email: user.email,
            projects: volunteeredProjects
        });
    } catch (error) {
        console.error('Error fetching dashboard projects:', error);
        next(error);
    }
};

// week5 team activity - Create the RequireRole Middleware Function
/**
 * Middleware factory to require specific role for route access
 * Returns middleware that checks if user has the required role
 * 
 * @param {string} role - The role name required (e.g., 'admin', 'user')
 * @returns {Function} Express middleware function
 */
const requireRole = (role) => {
    return (req, res, next) => {
        // Check if user is logged in first
        if (!req.session || !req.session.user) {
            req.flash('error', 'You must be logged in to access this page.');
            return res.redirect('/login');
        }

        // Check if user's role matches the required role
        if (req.session.user.role_name !== role) {
            req.flash('error', 'You do not have permission to access this page.');
            return res.redirect('/');
        }

        // User has required role, continue
        next();
    };
};

// week5 assignment: all users list
const showUsersList = async (req, res, next) => {
    try {
        const users = await getAllUsers();
        res.render('users-list', {
            title: 'Registered Users',
            users: users
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        req.flash('error', 'Unable to retrieve user list.');
        res.redirect('/dashboard');
    }
};

export { showUserRegistrationForm,
     processUserRegistrationForm,  
  showLoginForm, processLoginForm,
processLogout,
requireLogin ,
showDashboard,
requireRole,
showUsersList};