import db from './db.js'

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

const getProjectsByOrganizationId = async (organizationId) => {
      const query = `
        SELECT
          project_id,
          organization_id,
          title,
          description,
          location,
          project_date  -- Fixed: Matches 'project_date' in setup.sql
        FROM projects   -- Fixed: Matches 'projects' (plural) in setup.sql
        WHERE organization_id = $1
        ORDER BY project_date; -- Fixed: Matches 'project_date' in setup.sql
      `;
      
      const queryParams = [organizationId];
      const result = await db.query(query, queryParams);

      return result.rows;
};

const getUpcomingProjects = async (number_of_projects) => {
    const query = `
        SELECT 
            p.project_id,
            p.title,
            p.description,
            p.project_date AS date,
            p.location,
            p.organization_id,
            o.name AS organization_name
        FROM projects p
        JOIN organization o ON p.organization_id = o.organization_id
        WHERE p.project_date >= CURRENT_DATE
        ORDER BY p.project_date ASC
        LIMIT $1;
    `;
    const result = await db.query(query, [number_of_projects]);
    return result.rows;
};


const getProjectDetails = async (id) => {
    const query = `
        SELECT 
            p.project_id,
            p.title,
            p.description,
            p.project_date AS date,
            p.location,
            p.organization_id,
            o.name AS organization_name
        FROM projects p
        JOIN organization o ON p.organization_id = o.organization_id
        WHERE p.project_id = $1;
    `;
    const result = await db.query(query, [id]);
    return result.rows[0] || null; // Return the single object or null if not found
};

// week 3 assignment for MVC, this is to add the model for categorydetials

 //Retrieve a single category by its ID for category details
async function getCategoryById(id) {
    const query = `
        SELECT category_id, name 
        FROM categories 
        WHERE category_id = $1;
    `;
    const result = await db.query(query, [parseInt(id, 10)]);
    return result.rows[0] || null;
}


//2. Retrieve all category tags associated with a given service project
async function getCategoriesByProjectId(projectId) {
    const query = `
        SELECT c.category_id, c.name 
        FROM categories c
        JOIN project_categories pc ON c.category_id = pc.category_id
        WHERE pc.project_id = $1;
    `;
    const result = await db.query(query, [projectId]);
    return result.rows;
}


//3. Retrieve all service projects in a given category
async function getProjectsByCategoryId(categoryId) {
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
    const result = await db.query(query, [categoryId]);
    return result.rows;
}

// model function to insert new service projects - week4
const createProject = async (title, description, location, date, organizationId) => {
    // Fixed: 'projects' table and 'project_date' column name
    const query = `
      INSERT INTO projects (title, description, location, project_date, organization_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING project_id;
    `;

    const queryParams = [title, description, location, date, organizationId];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create project');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new project with ID:', result.rows[0].project_id);
    }

    return result.rows[0].project_id;
};

// Update the export statement at the bottom of the file!
export {getAllProjects, getProjectsByOrganizationId, getUpcomingProjects, getProjectDetails, getCategoryById, getCategoriesByProjectId, getProjectsByCategoryId, createProject };