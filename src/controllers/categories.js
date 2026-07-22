import { 
    getAllCategories, 
    getCategoriesByServiceProjectId, 
    updateCategoryAssignments 
} from '../models/categories.js';

import { 
    getCategoryById, 
    getProjectsByCategoryId, 
    getProjectDetails 
} from '../models/projects.js';

const showCategoriesPage = async (req, res) => {
    const categories = await getAllCategories();
    const title = 'Service Categories';

    res.render('categories', { title, categories });
};  


// NEW: (WEEK3 ASSIGNMENT) Controller for the individual category details page (/category/[id])
const showCategoryDetailsPage = async (req, res, next) => {
    try {
        const categoryId = req.params.id;

        // Fetch the category information to get its name for the page heading
        const category = await getCategoryById(categoryId);

        // If the category doesn't exist, trigger a 404 error
        if (!category) {
            return res.status(404).render('404', { title: 'Category Not Found' });
        }

        // Fetch all service projects associated with this category
        const projects = await getProjectsByCategoryId(categoryId);

        // Render the brand-new 'category.ejs' view and pass the data
        res.render('category', {
            title: category.name, // Will display as the page title (ex:  "Disaster Response & Support")
            projects             // The list of projects belonging to this category
        });
    } catch (error) {
        next(error);
    }
};

// assigning categories to project week4
const showAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;

    const projectDetails = await getProjectDetails(projectId);
    const categories = await getAllCategories();
    const assignedCategories = await getCategoriesByServiceProjectId(projectId);

    const title = 'Assign Categories to Project';

    res.render('assign-categories', { title, projectId, projectDetails, categories, assignedCategories });
};

const processAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;
    const selectedCategoryIds = req.body.categoryIds || [];
    
    // Ensure selectedCategoryIds is an array
    const categoryIdsArray = Array.isArray(selectedCategoryIds) ? selectedCategoryIds : [selectedCategoryIds];
    await updateCategoryAssignments(projectId, categoryIdsArray);
    req.flash('success', 'Categories updated successfully.');
    res.redirect(`/project/${projectId}`);
};

// Export both functions
export { showCategoriesPage, 
    showCategoryDetailsPage,
    showAssignCategoriesForm,
    processAssignCategoriesForm };