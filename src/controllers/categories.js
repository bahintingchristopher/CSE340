import { 
    getAllCategories, 
    getCategoriesByServiceProjectId, 
    updateCategoryAssignments, 
    createCategory,
    updateCategory 
} from '../models/categories.js';

import { 
    getCategoryById, 
    getProjectsByCategoryId, 
    getProjectDetails
} from '../models/projects.js';

import { body, validationResult } from 'express-validator';

// week4 individual activity - validation safety net 
const categoryValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Category name is required')
        .isLength({ min: 2, max: 100 }).withMessage('Category name shall only be between 2 and 100 characters')
];

const showCategoriesPage = async (req, res, next) => {
    try {
        const categories = await getAllCategories();
        const title = 'Service Categories';

        res.render('categories', { title, categories });
    } catch (error) {
        next(error);
    }
};

const showCategoryDetailsPage = async (req, res, next) => {
    try {
        const categoryId = req.params.id;

        const category = await getCategoryById(categoryId);

        if (!category) {
            return res.status(404).render('404', { title: 'Category Not Found' });
        }

        const projects = await getProjectsByCategoryId(categoryId);

        res.render('category', {
            title: category.name,
            projects,
            category, 
            flash: req.flash
        });
    } catch (error) {
        next(error);
    }
};

// assigning categories to project week4
const showAssignCategoriesForm = async (req, res, next) => {
    try {
        // Accepts both :projectId or :id from route params
        const projectId = req.params.projectId || req.params.id;

        // Fetch project details using getProjectDetails from projects.js model
        const project = await getProjectDetails(projectId); 

        if (!project) {
            return res.status(404).render('404', { title: 'Project Not Found' });
        }

        const categories = await getAllCategories();
        
        // Fetch categories and transform into an array of IDs
        const assignedCategories = await getCategoriesByServiceProjectId(projectId) || [];
        const assignedCategoryIds = assignedCategories.map(c => c.category_id || c);

        const title = 'Assign Categories to Project';

        res.render('assign-categories', { 
            title, 
            projectId, 
            project, 
            projectDetails: project,
            categories, 
            assignedCategories,
            assignedCategoryIds 
        });
    } catch (error) {
        next(error);
    }
};

const processAssignCategoriesForm = async (req, res, next) => {
    try {
        const projectId = req.params.projectId || req.params.id;
        const selectedCategoryIds = req.body.categoryIds || req.body.categories || [];
        
        const categoryIdsArray = Array.isArray(selectedCategoryIds) ? selectedCategoryIds : [selectedCategoryIds];
        await updateCategoryAssignments(projectId, categoryIdsArray);
        req.flash('success', 'Categories updated successfully.');
        res.redirect(`/project/${projectId}`);
    } catch (error) {
        next(error);
    }
};

// week4 individual activity - New Category
const showNewCategoryForm = (req, res) => {
    const title = 'Add New Category';
    res.render('new-category', { title });
};

const processNewCategoryForm = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.array().forEach((err) => req.flash('error', err.msg));
        return res.redirect('/new-category');
    }

    try {
        const { name } = req.body;
        const categoryId = await createCategory(name);
        req.flash('success', 'Category created successfully!');
        res.redirect(`/category/${categoryId}`);
    } catch (error) {
        console.error('Error creating category:', error);
        req.flash('error', 'There was an error creating the category.');
        res.redirect('/new-category');
    }
};

// week4 individual activity - Edit Category
const showEditCategoryForm = async (req, res, next) => {
    try {
        const categoryId = req.params.id;
        const category = await getCategoryById(categoryId);

        if (!category) {
            return res.status(404).render('404', { title: 'Category Not Found' });
        }

        const title = 'Edit Category';
        res.render('edit-category', { title, category });
    } catch (error) {
        next(error);
    }
};

// week 4 individual activity - process the edit category
const processEditCategoryForm = async (req, res, next) => {
    const categoryId = req.params.id;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.array().forEach((err) => req.flash('error', err.msg));
        return res.redirect(`/edit-category/${categoryId}`);
    }

    try {
        const { name } = req.body;
        await updateCategory(categoryId, name);
        req.flash('success', 'Category updated successfully!');
        res.redirect(`/category/${categoryId}`);
    } catch (error) {
        console.error('Error updating category:', error);
        req.flash('error', 'There was an error updating the category.');
        res.redirect(`/edit-category/${categoryId}`);
    }
};

export { 
    showCategoriesPage, 
    showCategoryDetailsPage,
    showAssignCategoriesForm,
    processAssignCategoriesForm,
    showNewCategoryForm,
    processNewCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm,
    categoryValidation
};