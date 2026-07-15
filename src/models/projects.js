import db from './db.js'

// p.* means all projects columns
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

// Export the model functions
export { getAllProjects, getProjectsByOrganizationId };