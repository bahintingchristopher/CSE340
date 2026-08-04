import db from './db.js';

// Adding a volunteer
const addVolunteer = async (projectId, userId) => {
    const query = `
        INSERT INTO project_volunteers (project_id, user_id)
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING;
    `;
    return await db.query(query, [projectId, userId]);
};

// Removing a volunteer
const removeVolunteer = async (projectId, userId) => {
    const query = `
        DELETE FROM project_volunteers
        WHERE project_id = $1 AND user_id = $2;
    `;
    return await db.query(query, [projectId, userId]);
};

// Checking if user is already volunteering for a project
const isUserVolunteering = async (projectId, userId) => {
    const query = `
        SELECT 1 FROM project_volunteers
        WHERE project_id = $1 AND user_id = $2;
    `;
    const result = await db.query(query, [projectId, userId]);
    return result.rows.length > 0;
};

// Retrieving all projects a specific user has volunteered for
const getProjectsByVolunteer = async (userId) => {
    const query = `
        SELECT 
            p.project_id,
            p.title,
            p.description,
            p.location,
            p.project_date AS date
        FROM projects p
        INNER JOIN project_volunteers pv ON p.project_id = pv.project_id
        WHERE pv.user_id = $1;
    `;
    const result = await db.query(query, [userId]);
    return result.rows;
};

export { 
    addVolunteer, 
    removeVolunteer, 
    isUserVolunteering, 
    getProjectsByVolunteer 
};