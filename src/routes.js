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

const router = express.Router();

// 1. Core or Main Page Routes
router.get('/', showHomePage);
router.get('/organizations', showOrganizationsPage);
router.get('/projects', showProjectsPage);
router.get('/categories', showCategoriesPage);

// 2. Static Form Routes (MUST come BEFORE any dynamic :id routes)
router.get('/new-project', showNewProjectForm);
router.post('/new-project', projectValidation, processNewProjectForm);

router.get('/new-organization', showNewOrganizationForm);
router.post('/new-organization', organizationValidation, processNewOrganizationForm);

// Week 4 individual activity - Add Category
router.get('/new-category', showNewCategoryForm);
router.post('/new-category', categoryValidation, processNewCategoryForm);

// 3. Edit Form Routes
router.get('/edit-organization/:id', showEditOrganizationForm);
router.post('/edit-organization/:id', organizationValidation, processEditOrganizationForm);

// Routes to handle the assign categories to project form week4
router.get('/assign-categories/:projectId', showAssignCategoriesForm);
router.post('/assign-categories/:projectId', processAssignCategoriesForm);

// start team activity week4
router.get('/edit-project/:id', showEditProjectForm);
router.post('/edit-project/:id', projectValidation, processEditProjectForm);
// end team activity week4

// Week 4 individual activity - Edit Category
router.get('/edit-category/:id', showEditCategoryForm);
router.post('/edit-category/:id', categoryValidation, processEditCategoryForm);

// 4. Dynamic Parameterized Routes (:id)
router.get('/organization/:id', showOrganizationDetailsPage);
router.get('/project/:id', showProjectDetailsPage);
router.get('/category/:id', showCategoryDetailsPage);


// 5. Error Testing Route
router.get('/test-error', testErrorPage);

export default router;