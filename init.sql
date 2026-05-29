-- =======================================================
-- REASONS DB SCHEMA
-- =======================================================

-- 1. Tabla users (Administradores/Editores)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'ADMIN',
    token TEXT,
    
    -- Auditoría
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT,
    modified_at TIMESTAMP,
    modified_by INT,
    deleted_at TIMESTAMP
);

-- 2. Tabla researchers
CREATE TABLE IF NOT EXISTS researchers (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    second_name VARCHAR(100),
    first_lastname VARCHAR(100) NOT NULL,
    second_lastname VARCHAR(100),
    orcid_link VARCHAR(255),
    institutional_email VARCHAR(255) UNIQUE,
    biography TEXT,
    position VARCHAR(100),
    
    -- Auditoría
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT REFERENCES users(id),
    modified_at TIMESTAMP,
    modified_by INT REFERENCES users(id),
    deleted_at TIMESTAMP
);

-- 3. Tabla projects
CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'ACTIVE', -- ACTIVE, COMPLETED
    start_date DATE,
    end_date DATE,
    
    -- Auditoría
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT REFERENCES users(id),
    modified_at TIMESTAMP,
    modified_by INT REFERENCES users(id),
    deleted_at TIMESTAMP
);

-- 4. Tabla publications
CREATE TABLE IF NOT EXISTS publications (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    abstract TEXT,
    doi_link VARCHAR(255),
    publication_date DATE,
    
    -- Auditoría
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT REFERENCES users(id),
    modified_at TIMESTAMP,
    modified_by INT REFERENCES users(id),
    deleted_at TIMESTAMP
);

-- 5. Many-to-Many: researchers_projects
CREATE TABLE IF NOT EXISTS researchers_projects (
    researcher_id INT REFERENCES researchers(id) ON DELETE CASCADE,
    project_id INT REFERENCES projects(id) ON DELETE CASCADE,
    PRIMARY KEY (researcher_id, project_id)
);

-- 6. Many-to-Many: researchers_publications
CREATE TABLE IF NOT EXISTS researchers_publications (
    researcher_id INT REFERENCES researchers(id) ON DELETE CASCADE,
    publication_id INT REFERENCES publications(id) ON DELETE CASCADE,
    PRIMARY KEY (researcher_id, publication_id)
);

-- Alter users table to add self-referencing FK for audit
ALTER TABLE users ADD CONSTRAINT fk_users_created_by FOREIGN KEY (created_by) REFERENCES users(id);
ALTER TABLE users ADD CONSTRAINT fk_users_modified_by FOREIGN KEY (modified_by) REFERENCES users(id);

-- Insert a default admin user (password 'admin123' hashed by bcrypt)
INSERT INTO users (name, email, password, role) 
VALUES ('Super Admin', 'admin@reasons.uta.edu.ec', '$2b$10$G2aVG8sjrSicplep3m8zQeO6AnUlb9fWuru7fMfQNejMyGFhAJF4C', 'SUPER_ADMIN')
ON CONFLICT (email) DO NOTHING;
