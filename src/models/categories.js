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

// week3 assignment --> NEW: Retrieve a single category by its ID for the category details page
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


// week3 assignment --> NEW: Retrieve all service projects associated with a category ID
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

// Export all three functions so they can be imported by your controller
export {getAllCategories, getCategoryById, getProjectsByCategoryId };