-- 1. Tabla users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    token TEXT,
    
    -- Campos de Auditoría y Borrado Lógico
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT,
    modified_at TIMESTAMP,
    modified_by INT,
    deleted_at TIMESTAMP
);

-- 2. Tabla researchers
CREATE TABLE researchers (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    second_name VARCHAR(100),
    first_lastname VARCHAR(100) NOT NULL,
    second_lastname VARCHAR(100),
    orcid_link VARCHAR(255),
    institutional_email VARCHAR(255) UNIQUE,
    biography TEXT,
    position VARCHAR(100),
    status VARCHAR(50),
    url_photo TEXT,
    
    -- Campos de Auditoría y Borrado Lógico
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT REFERENCES users(id),
    modified_at TIMESTAMP,
    modified_by INT REFERENCES users(id),
    deleted_at TIMESTAMP
);

-- 3. Tabla projects
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50),
    
    -- Campos de Auditoría y Borrado Lógico
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT REFERENCES users(id),
    modified_at TIMESTAMP,
    modified_by INT REFERENCES users(id),
    deleted_at TIMESTAMP
);

-- 4. Tabla articles
CREATE TABLE articles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    abstract TEXT,
    cite TEXT, 
    status VARCHAR(50),
    url_journal_cover TEXT,
    
    -- Campos de Auditoría y Borrado Lógico
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT REFERENCES users(id),
    modified_at TIMESTAMP,
    modified_by INT REFERENCES users(id),
    deleted_at TIMESTAMP
);

-- 5. Tablas de Detalle (Redes, Objetivos, Resultados)
CREATE TABLE social_networks (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    url_image TEXT,
    deleted_at TIMESTAMP
);

CREATE TABLE objectives (
    id SERIAL PRIMARY KEY,
    description TEXT NOT NULL,
    project_id INT REFERENCES projects(id) ON DELETE CASCADE,
    deleted_at TIMESTAMP
);

CREATE TABLE results (
    id SERIAL PRIMARY KEY,
    description TEXT NOT NULL,
    project_id INT REFERENCES projects(id) ON DELETE CASCADE,
    deleted_at TIMESTAMP
);

-- 6. Tablas Intermedias (Relaciones Muchos a Muchos)
CREATE TABLE researcher_projects (
    project_id INT REFERENCES projects(id) ON DELETE CASCADE,
    researcher_id INT REFERENCES researchers(id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, researcher_id)
);

CREATE TABLE researcher_articles (
    researcher_id INT REFERENCES researchers(id) ON DELETE CASCADE,
    article_id INT REFERENCES articles(id) ON DELETE CASCADE,
    PRIMARY KEY (researcher_id, article_id)
);

CREATE TABLE researcher_socials (
    researcher_id INT REFERENCES researchers(id) ON DELETE CASCADE,
    social_network_id INT REFERENCES social_networks(id) ON DELETE CASCADE,
    link_social TEXT NOT NULL,
    PRIMARY KEY (researcher_id, social_network_id)
);

-- 7. Tabla contact_messages
CREATE TABLE contact_messages (
    id SERIAL PRIMARY KEY, 
    sender_name VARCHAR(255) NOT NULL,
    sender_email VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    institution VARCHAR(255),
    message TEXT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 1. Tabla de información principal del Grupo (Tendrá un solo registro)
CREATE TABLE groups (
    id SERIAL PRIMARY KEY,
    description TEXT NOT NULL,
    general_objective TEXT NOT NULL,
    domain TEXT NOT NULL,
    email VARCHAR(255) NOT NULL,
    url_logo TEXT,
    address VARCHAR(255) NOT NULL,
    
    -- Campos de Auditoría y Borrado Lógico
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT REFERENCES users(id),
    modified_at TIMESTAMP,
    modified_by INT REFERENCES users(id),
    deleted_at TIMESTAMP
);

-- 1. Añadir las nuevas columnas con los datos reales por defecto
ALTER TABLE groups
ADD COLUMN acronym VARCHAR(50) NOT NULL DEFAULT 'REASONS',
ADD COLUMN name VARCHAR(255) NOT NULL DEFAULT 'Research in Engineering and Advanced Sustainable Operations, Nature, and Society';

-- 2. Limpiar el valor por defecto
ALTER TABLE groups 
ALTER COLUMN acronym DROP DEFAULT,
ALTER COLUMN name DROP DEFAULT;

-- 2. Tabla para los Objetivos Específicos (CORREGIDO)
CREATE TABLE specific_objectives (
    id SERIAL PRIMARY KEY,
    description TEXT NOT NULL,
    group_id INT REFERENCES groups(id) ON DELETE CASCADE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP -- Borrado lógico
);

-- 3. Tabla para las Líneas de Investigación
CREATE TABLE lines_of_research (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    group_id INT REFERENCES groups(id) ON DELETE CASCADE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP -- Borrado lógico
);



-- 8. Alter Tables finales para evitar dependencias circulares
ALTER TABLE users
ADD CONSTRAINT fk_user_creation FOREIGN KEY (created_by) REFERENCES users(id),
ADD CONSTRAINT fk_user_modification FOREIGN KEY (modified_by) REFERENCES users(id);
