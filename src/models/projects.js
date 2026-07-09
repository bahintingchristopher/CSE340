import db from './db.js'

// p.* mean is that all projects columns
const getAllProjects = async() => {
    const query = `
        SELECT p.*, o.name AS organization_name 
        FROM projects p
        JOIN organization o ON p.organization_id = o.organization_id
        ORDER BY p.project_date ASC
    `;

    const output = await db.query(query);
    
    return output.rows;
}

export {getAllProjects}  