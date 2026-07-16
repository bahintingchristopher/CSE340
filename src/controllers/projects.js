import { getUpcomingProjects, getProjectDetails, getCategoriesByProjectId} from '../models/projects.js';

// Constant to limit the number of projects displayed on the main page
const NUMBER_OF_UPCOMING_PROJECTS = 5;

// Renders the main projects page showing only the next 5 upcoming projects
const showProjectsPage = async (req, res, next) => {
    try {
        const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
        const title = 'Upcoming Service Projects';

        res.render('projects', { title, projects });
    } catch (error) {
        console.error("Error in showProjectsPage controller:", error);
        next(error); // Passes any SQL or system errors to global error handler
    }
};  

// Renders the details page for a single service project
const showProjectDetailsPage = async (req, res, next) => {
    try {
        const projectId = req.params.id;
        const project = await getProjectDetails(projectId);

        // If the project doesn't exist in the database, trigger a 404
        if (!project) {
            const err = new Error('Service Project Not Found');
            err.status = 404;
            return next(err);
        }
        // get the categories from the database
        const categories = await getCategoriesByProjectId(projectId);

        const title = project.title;

        res.render('project', { title, project, categories });
    } catch (error) {
        console.error("Error in showProjectDetailsPage controller:", error);
        next(error);
    }
};

// Export the controller functions
export { showProjectsPage, showProjectDetailsPage };