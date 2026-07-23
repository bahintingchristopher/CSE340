import db from './db.js';

// Retrieve all categories for the main categories list page
const getAllCategories = async () => {
    const query = `
        SELECT category_id, name 
        FROM categories 
        ORDER BY name ASC
    `;
    const output = await db.query(query);
    return output.rows;
};

// Retrieve a single category by its ID for the category details page
const getCategoryById = async (id) => {
    const query = `
        SELECT category_id, name 
        FROM categories 
        WHERE category_id = $1;
    `;
    // Using parseInt ensures that even if Node receives the ID as a string, it gets sent as an integer
    const output = await db.query(query, [parseInt(id, 10)]);
    return output.rows[0] || null;
};

// Retrieve all service projects associated with a category ID
const getProjectsByCategoryId = async (categoryId) => {
    const query = `
        SELECT 
            p.project_id, 
            p.title, 
            p.description, 
            p.location, 
            p.project_date AS date
        FROM projects p
        JOIN project_categories pc ON p.project_id = pc.project_id
        WHERE pc.category_id = $1
        ORDER BY p.project_date ASC;
    `;
    const output = await db.query(query, [parseInt(categoryId, 10)]);
    return output.rows;
};

// Retrieve categories assigned to a specific project ID
const getCategoriesByServiceProjectId = async (projectId) => {
    const query = `
        SELECT c.category_id, c.name
        FROM categories c
        JOIN project_categories pc ON c.category_id = pc.category_id
        WHERE pc.project_id = $1;
    `;
    const output = await db.query(query, [parseInt(projectId, 10)]);
    return output.rows;
};

// Helper: Assign a single category to a project
const assignCategoryToProject = async (categoryId, projectId) => {
    const query = `
        INSERT INTO project_categories (category_id, project_id)
        VALUES ($1, $2);
    `;

    await db.query(query, [categoryId, projectId]);
};

// Replace existing category assignments for a project with a new set of category IDs
const updateCategoryAssignments = async (projectId, categoryIds) => {
    // First, remove existing category assignments for the project
    const deleteQuery = `
        DELETE FROM project_categories
        WHERE project_id = $1;
    `;
    await db.query(deleteQuery, [projectId]);

    // Next, add the new category assignments
    for (const categoryId of categoryIds) {
        await assignCategoryToProject(categoryId, projectId);
    }
};
// week4 individual activity - Create a new category and return its generated ID
const createCategory = async (name) => {
    const query = `
        INSERT INTO categories (name)
        VALUES ($1)
        RETURNING category_id;
    `;
    const output = await db.query(query, [name]);
    return output.rows[0].category_id;
};

// week4 individual activity -  Update an existing category by ID
const updateCategory = async (id, name) => {
    const query = `
        UPDATE categories
        SET name = $1
        WHERE category_id = $2;
    `;
    await db.query(query, [name, parseInt(id, 10)]);
};

// Export all model functions needed by controllers
export {
    getAllCategories,
    getCategoryById,
    getProjectsByCategoryId,
    getCategoriesByServiceProjectId,
    updateCategoryAssignments,
    createCategory,
    updateCategory
};