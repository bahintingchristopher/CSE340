import express from 'express';

// Import controller functions
import { showHomePage } from './controllers/index.js';
import { 
  showOrganizationsPage, 
  showOrganizationDetailsPage, 
  showNewOrganizationForm, 
  processNewOrganizationForm, 
  organizationValidation, 
  showEditOrganizationForm,
  processEditOrganizationForm,
} from './controllers/organizations.js';
import { 
  showProjectsPage, 
  showProjectDetailsPage, 
  showNewProjectForm, 
  processNewProjectForm, 
  projectValidation,
  showEditProjectForm, //week4 team activity
  processEditProjectForm //week4 team activity
} from './controllers/projects.js';
import { showCategoriesPage, 
  showCategoryDetailsPage,
  showAssignCategoriesForm,
  processAssignCategoriesForm,
  // week 4 individual activity categories
  showNewCategoryForm,
  processNewCategoryForm,
  showEditCategoryForm,
  processEditCategoryForm,
  categoryValidation
 } from './controllers/categories.js';

import { testErrorPage } from './controllers/errors.js';

import { requireLogin, showDashboard } from './controllers/users.js';

import { showUserRegistrationForm,
  processUserRegistrationForm,
  showLoginForm,
  processLoginForm,
  processLogout,
  requireRole,
  showUsersList
 } from './controllers/users.js';

const router = express.Router();

// 1. Core or Main Page Routes
router.get('/', showHomePage);
router.get('/organizations', showOrganizationsPage);
router.get('/projects', showProjectsPage);
router.get('/categories', showCategoriesPage);

// 2. Static Form Routes (MUST come before any dynamic :id routes)
router.get('/new-project', requireRole ('admin'), showNewProjectForm);
router.post('/new-project', requireRole ('admin'), projectValidation, processNewProjectForm);

router.get('/new-organization', requireRole('admin'), showNewOrganizationForm);
router.post('/new-organization', requireRole('admin'), organizationValidation, processNewOrganizationForm);

// Week 4 individual activity - Add Category
router.get('/new-category', requireRole('admin'), showNewCategoryForm);
router.post('/new-category', requireRole('admin'), categoryValidation, processNewCategoryForm);

// 3. Edit Form Routes
router.get('/edit-organization/:id', requireRole('admin'), showEditOrganizationForm);
router.post('/edit-organization/:id', requireRole('admin'), organizationValidation, processEditOrganizationForm);

// Routes to handle the assign categories to project form week4
router.get('/assign-categories/:projectId', requireRole('admin'), showAssignCategoriesForm);
router.post('/assign-categories/:projectId', requireRole('admin'), processAssignCategoriesForm);

// start team activity week4
router.get('/edit-project/:id', requireRole('admin'), showEditProjectForm);
router.post('/edit-project/:id', requireRole('admin'), projectValidation, processEditProjectForm);
// end team activity week4

// Week 4 individual activity - Edit Category
router.get('/edit-category/:id', requireRole('admin'), showEditCategoryForm);
router.post('/edit-category/:id', requireRole('admin'), categoryValidation, processEditCategoryForm);

// User registration routes
router.get('/register',  showUserRegistrationForm);
router.post('/register', processUserRegistrationForm);

// User login routes
router.get('/login', showLoginForm);
router.post('/login', processLoginForm);
router.get('/logout', processLogout);

// 4. Dynamic Parameterized Routes (:id)
router.get('/organization/:id', showOrganizationDetailsPage);
router.get('/project/:id', showProjectDetailsPage);
router.get('/category/:id', showCategoryDetailsPage);


// 5. Error Testing Route
router.get('/test-error', testErrorPage);

// week5 assignment: users list
router.get('/users', requireLogin, requireRole('admin'), showUsersList);

// Protected dashboard route week5
router.get('/dashboard', requireLogin, showDashboard);

export default router;