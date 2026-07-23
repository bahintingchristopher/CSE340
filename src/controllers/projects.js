import { 
    getUpcomingProjects, 
    getProjectDetails, 
    getCategoriesByProjectId, 
    createProject,
    updateProject 
} from '../models/projects.js';

import { getAllOrganizations } from '../models/organizations.js';
import { body, validationResult } from 'express-validator';

const NUMBER_OF_UPCOMING_PROJECTS = 5;

// validation week4 create new project
const projectValidation = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),
    body('description')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
    body('location')
        .trim()
        .notEmpty().withMessage('Location is required')
        .isLength({ max: 200 }).withMessage('Location must be less than 200 characters'),
    body('date')
        .notEmpty().withMessage('Date is required')
        .isISO8601().withMessage('Date must be a valid date format'),
    body('organizationId')
        .notEmpty().withMessage('Organization is required')
        .isInt().withMessage('Organization must be a valid integer')
];

const showProjectsPage = async (req, res, next) => {
    try {
        const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
        const title = 'Upcoming Service Projects';

        res.render('projects', { title, projects });
    } catch (error) {
        console.error("Error in showProjectsPage controller:", error);
        next(error);
    }
};  

const showProjectDetailsPage = async (req, res, next) => {
    try {
        const projectId = req.params.id;
        const project = await getProjectDetails(projectId);

        if (!project) {
            const err = new Error('Service Project Not Found');
            err.status = 404;
            return next(err);
        }
        
        const categories = await getCategoriesByProjectId(projectId);
        const title = project.title;

        res.render('project', { title, project, categories });
    } catch (error) {
        console.error("Error in showProjectDetailsPage controller:", error);
        next(error);
    }
};

// Activity Instruction Function 1
const showNewProjectForm = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Add New Service Project';

    res.render('new-project', { title, organizations });
};

// Activity Instruction Function 2
const processNewProjectForm = async (req, res, next) => {
    const { title, description, location, date, organizationId } = req.body;

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Loop through validation errors and flash them
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        // Redirect back to the new project form
        return res.redirect('/new-project');
    }

    try {
        const newProjectId = await createProject(title, description, location, date, organizationId);

        req.flash('success', 'New service project created successfully!');
        res.redirect(`/project/${newProjectId}`);
    } catch (error) {
        console.error('Error creating new project:', error);
        req.flash('error', 'There was an error creating the service project.');
        res.redirect('/new-project');
    }
};

// team activity week4
// GET: Display edit form
const showEditProjectForm = async (req, res, next) => {
    try {
        const projectId = req.params.id;
        const project = await getProjectDetails(projectId); //you will need to get the project data from the model using the model function getProjectDetails. 
        const organizations = await getAllOrganizations(); // list of all the organizations to allow the user to assign the project to a different organization, 

        if (!project) {
            return res.status(404).render('404', { title: 'Project Not Found' });
        }

        // Format date to YYYY-MM-DD for HTML <input type="date">
        const formattedDate = new Date(project.date).toISOString().split('T')[0];

        res.render('edit-project', {
            title: `Edit Project: ${project.title}`,
            project: { ...project, date: formattedDate },
            organizations
        });
    } catch (error) {
        next(error);
    }
};

// POST: Process edit form
const processEditProjectForm = async (req, res, next) => {
    const projectId = req.params.id;
    const { title, description, location, date, organizationId } = req.body;

    // 1. Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });
        return res.redirect(`/edit-project/${projectId}`);
    }

    // 2. Perform database update
    try {
        await updateProject(projectId, title, description, location, date, organizationId);
        
        req.flash('success', 'Project updated successfully!');
        res.redirect(`/project/${projectId}`);
    } catch (error) {
        console.error('Error updating project:', error);
        req.flash('error', 'There was an error updating the service project.');
        res.redirect(`/edit-project/${projectId}`);
    }
};

export { showProjectsPage, 
    showProjectDetailsPage,
     showNewProjectForm, 
     processNewProjectForm,
    projectValidation,
    showEditProjectForm, 
    processEditProjectForm};