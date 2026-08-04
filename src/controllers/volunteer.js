import { addVolunteer, removeVolunteer } from '../models/volunteers.js'; 

// Handling POST request when click by the user (Volunteer for this Project)
const processAddVolunteer = async (req, res, next) => {
    try {
        const projectId = req.params.id;
        const userId = req.session.user.user_id; 

        await addVolunteer(projectId, userId);

        req.flash('success', 'Successfully signed up for this project!');
        res.redirect(`/project/${projectId}`);
    } catch (error) {
        console.error('Error adding volunteer:', error);
        next(error);
    }
};

// Handling POST request when click by the user (Remove Volunteering)
const processRemoveVolunteer = async (req, res, next) => {
    try {
        const projectId = req.params.id;
        const userId = req.session.user.user_id;

        await removeVolunteer(projectId, userId);

        req.flash('success', 'Successfully removed from this project.');

        // Redirecting  back to Dashboard if clicked from Dashboard, or Project page if clicked from Project
        const redirectUrl = req.get('Referrer') || `/project/${projectId}`;
        res.redirect(redirectUrl);
    } catch (error) {
        console.error('Error removing volunteer:', error);
        next(error);
    }
};

export { processAddVolunteer, processRemoveVolunteer };