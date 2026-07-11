 import db from './db.js';
 
const getAllCategories = async () => {
    // We we will just dispay the name of the categories
    const query = `
        SELECT category_id, name 
        FROM categories 
        ORDER BY name ASC
    `;

    //  Run the query 
    const output = await db.query(query);
    return output.rows;
};

 
// call or export for the server js to import
export { getAllCategories };