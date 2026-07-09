import express from 'express';
import {fileURLToPath} from 'url';
import path from 'path';
import { testConnection } from './src/models/db.js';
import { getAllOrganizations } from './src/models/organizations.js';
import { getAllProjects } from './src/models/projects.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';
const PORT = process.env.PORT || 3000;

const app = express();

//set ejs as the templating engine
app.set('view engine', 'ejs');

//tell express where to find the ejs templates
app.set('views', path.join(__dirname, 'src/views'));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', async (req, res) => {
  const title = 'Home';
  res.render('home', { title });
});
 
// app.get('/organizations', async (req, res) => {
//     const title = 'Our Partner Organizations';
//     res.render('organizations', { title });
// });

// app.get('/projects', async (req, res) => {
//     const title = 'Service Projects';
//     res.render('projects', { title });
// });

//categories route
// app.get('/categories', async (req, res) => {
//     const title = 'Project Categories';
//     res.render('categories', { title });
// });


// with database connection
app.get('/organizations', async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Our Partner Organizations';

    res.render('organizations', { title, organizations });
});


// project database connection
app.get('/projects', async (req, res) => {
  const projects = await getAllProjects();
  const title = 'Our Service Projects';

  res.render('projects', {title, projects} )
})


// app.listen(PORT, () => {
//   console.log(`Server is running at http://127.0.0.1:${PORT}`);
//   console.log(`Environment: ${NODE_ENV}`);
// });

// 
app.listen(PORT, async () => {
  try {
    await testConnection();
    console.log(`Server is running at http://127.0.0.1:${PORT}`);
    console.log(`Environment: ${NODE_ENV}`);
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
});