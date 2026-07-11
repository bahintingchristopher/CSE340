CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

SELECT * FROM organization;

-- ========================================================
-- 2. INSERT SAMPLE DATA
-- ========================================================
INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES
(
    'BrightFuture Builders', 
    'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 
    'info@brightfuturebuilders.org', 
    'brightfuture-logo.png'
),
(
    'GreenHarvest Growers', 
    'An urban farming collective promoting food sustainability and education in local neighborhoods.', 
    'contact@greenharvest.org', 
    'greenharvest-logo.png'
),
(
    'UnityServe Volunteers', 
    'A volunteer coordination group supporting local charities and service initiatives.', 
    'hello@unityserve.org', 
    'unityserve-logo.png'
);



-- Service Projects
-- ========================================================
-- 3. CREATE PROJECTS TABLE
-- ========================================================
CREATE TABLE IF NOT EXISTS projects (
    project_id SERIAL PRIMARY KEY,
    organization_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255) NOT NULL,
    project_date DATE NOT NULL,
    REFERENCES organization(organization_id) ON DELETE CASCADE
);

-- ========================================================
-- 4. INSERT SAMPLE PROJECTS (5 for each organization)
-- ========================================================
INSERT INTO projects (organization_id, title, description, location, project_date) VALUES
-- Projects for Organization 1 (BrightFuture Builders)
(1, 'Community Center Repair', 'Helping fix the roofing of the main center.', 'Brgy. Central Hub', '2026-07-15'),
(1, 'Eco-Friendly Park Benches', 'Building benches out of recycled plastics.', 'North Park', '2026-08-01'),
(1, 'Library Bookshelf Build', 'Constructing new wooden shelves for the kids section.', 'Downtown Library', '2026-08-10'),
(1, 'Pedestrian Ramp Install', 'Adding concrete ramps for wheelchair accessibility.', 'Public Health Clinic', '2026-08-22'),
(1, 'Shade Structure Painting', 'Sanding and painting the community stage canopy.', 'Town Plaza', '2026-09-05'),

-- Projects for Organization 2 (GreenHarvest Growers)
(2, 'Urban Garden Seed Planting', 'Planting seasonal vegetables in the raised beds.', 'East District Plot', '2026-07-20'),
(2, 'Compost Bin Setup', 'Building and initializing neighborhood compost stations.', 'Community Center', '2026-07-28'),
(2, 'Rainwater Collection Build', 'Installing barrels to collect roof runoff water.', 'Greenhouse Site A', '2026-08-15'),
(2, 'Hydroponics Basic Class', 'Setting up the demonstration kit for the youth workshop.', 'Tech Hub Room B', '2026-09-12'),
(2, 'Harvest and Pack Day', 'Gathering ripe produce and preparing boxes for distribution.', 'Main Garden Lot', '2026-09-25'),

-- Projects for Organization 3 (UnityServe Volunteers)
(3, 'Food Pantry Sorting', 'Organizing incoming canned goods and dry items.', 'Hope Warehouse', '2026-07-18'),
(3, 'Senior Citizen Outreach', 'Visiting and setting up a recreational game day.', 'Golden Years Home', '2026-08-05'),
(3, 'School Supply Packing', 'Sorting backpacks with donated notebooks and pens.', 'Unity Center Hall', '2026-08-19'),
(3, 'Street Cleanup Drive', 'Clearing litter and setting up waste sorting bins.', 'Rizal Avenue', '2026-09-02'),
(3, 'Disaster Kit Assembly', 'Pre-packing emergency medical and hygiene kits.', 'Red Cross Station', '2026-09-19');

-- ========================================================
-- 5. VERIFY PROJECT DATA
-- ========================================================
SELECT * FROM projects;


-- ========================================================
-- 6. CREATE CATEGORIES TABLE
-- ========================================================
CREATE TABLE IF NOT EXISTS categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- ========================================================
-- 7. CREATE JUNCTION TABLE (Many-to-Many Bridge)
-- ========================================================
CREATE TABLE IF NOT EXISTS project_categories (
    project_id INT NOT NULL,
    category_id INT NOT NULL,
    PRIMARY KEY (project_id, category_id),
    FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE CASCADE
);

-- ========================================================
-- 8. INSERT SAMPLE CATEGORIES (Matching your view theme)
-- ========================================================
INSERT INTO categories (name) VALUES  
('Environmental'),
('Educational'),
('Community Service'),
('Health and Wellness');

-- ========================================================
-- 9. ASSOCIATE PROJECTS WITH CUSTOM CATEGORIES
-- ========================================================
INSERT INTO project_categories (project_id, category_id) VALUES
-- Mapping Organization 1 Projects to Category 1 (Drafting/CAD)
(1, 1), (2, 1), (3, 1), (4, 1), (5, 1),

-- Mapping Organization 2 Projects to Category 2 (Optimization/Image Processing)
(6, 2), (7, 2), (8, 2), (9, 2), (10, 2),

-- Mapping Organization 3 Projects to Category 3 & 4 (Interface & Archiving)
(11, 3), (12, 3), (13, 3), 
(14, 4), (15, 4);

-- Verification Query
SELECT * FROM categories;



