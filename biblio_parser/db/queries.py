CREATE_TABLE_FACULTIES = """
CREATE TABLE IF NOT EXISTS faculties (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    url TEXT NOT NULL UNIQUE
);
"""

CREATE_TABLE_DEPARTMENTS = """
-- Связь: 1 Факультет имеет М Кафедр
CREATE TABLE IF NOT EXISTS departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    url TEXT NOT NULL UNIQUE,
    faculty_id INTEGER NOT NULL,
    CONSTRAINT fk_faculty
        FOREIGN KEY (faculty_id)
        REFERENCES faculties(id)
        ON DELETE CASCADE
);
"""

CREATE_TABLE_AUTHORS = """
CREATE TABLE IF NOT EXISTS authors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);
"""

CREATE_TABLE_KEYWORDS = """
CREATE TABLE IF NOT EXISTS keywords (
    id SERIAL PRIMARY KEY,
    word VARCHAR(100) UNIQUE NOT NULL
);
"""

CREATE_TABLE_SPECIALTIES = """
CREATE TABLE IF NOT EXISTS specialties (
    spec_code VARCHAR(30) PRIMARY KEY,
    spec_name TEXT NOT NULL
);
"""

CREATE_TABLE_TYPES = """
CREATE TABLE IF NOT EXISTS types (
    id SERIAL PRIMARY KEY,
    type_name VARCHAR(100) UNIQUE NOT NULL
);
"""

CREATE_TABLE_UDC_CODES = """
CREATE TABLE IF NOT EXISTS udc_codes (
    code TEXT PRIMARY KEY,      
    title TEXT
);
"""

CREATE_TABLE_MATERIALS = """
-- Связи 1:М с departments
CREATE TABLE IF NOT EXISTS materials (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    alternative_title TEXT,
    abstract_text TEXT,
    language_code VARCHAR(10) DEFAULT 'ru',
    publisher TEXT,
    citation TEXT,
    uri TEXT NOT NULL UNIQUE,
    available_date TIMESTAMP,
    issued_year INTEGER,
    document_uri TEXT NOT NULL UNIQUE,
    department_id INTEGER NOT NULL,

    CONSTRAINT fk_department
        FOREIGN KEY (department_id)
        REFERENCES departments(id)
        ON DELETE CASCADE,
);
"""

CREATE_TABLE_MATERIAL_AUTHORS = """
-- Связь автор - материал
CREATE TABLE IF NOT EXISTS material_authors (
    material_id INTEGER NOT NULL,
    author_id INTEGER NOT NULL,
    PRIMARY KEY (material_id, author_id),
    CONSTRAINT fk_material_ma
        FOREIGN KEY (material_id)
        REFERENCES materials(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_author_ma
        FOREIGN KEY (author_id)
        REFERENCES authors(id)
        ON DELETE CASCADE
);
"""

CREATE_TABLE_MATERIAL_KEYWORDS = """
-- Связь ключевое_слово - материал
CREATE TABLE IF NOT EXISTS material_keywords (
    material_id INTEGER NOT NULL,
    keyword_id INTEGER NOT NULL,
    PRIMARY KEY (material_id, keyword_id),
    CONSTRAINT fk_material_mk
        FOREIGN KEY (material_id)
        REFERENCES materials(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_keyword_mk
        FOREIGN KEY (keyword_id)
        REFERENCES keywords(id)
        ON DELETE CASCADE
);
"""

CREATE_TABLE_MATERIAL_SPECIALTIES = """
-- Связь специальность - материал
CREATE TABLE IF NOT EXISTS material_specialties (
    material_id INTEGER NOT NULL,
    spec_code VARCHAR(30) NOT NULL,
    PRIMARY KEY (material_id, spec_code),
    CONSTRAINT fk_material_ms
        FOREIGN KEY (material_id)
        REFERENCES materials(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_specialty_ms
        FOREIGN KEY (spec_code)
        REFERENCES specialties(spec_code)
        ON DELETE CASCADE
);
"""

CREATE_TABLE_MATERIAL_TYPES = """
-- Связь тип - материал
CREATE TABLE IF NOT EXISTS material_types (
    material_id INTEGER NOT NULL,
    type_id INTEGER NOT NULL,
    PRIMARY KEY (material_id, type_id),
    CONSTRAINT fk_material_mt
        FOREIGN KEY (material_id)
        REFERENCES materials(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_specialty_mt
        FOREIGN KEY (type_id)
        REFERENCES types(id)
        ON DELETE CASCADE
);
"""

CREATE_TABLE_MATERIAL_UDC = """
-- Связь УДК код - материал
CREATE TABLE IF NOT EXISTS material_udcCodes (
    material_id INTEGER NOT NULL,
    code_udc TEXT NOT NULL,
    PRIMARY KEY (material_id, code_udc),
    CONSTRAINT fk_material_mu
        FOREIGN KEY (material_id)
        REFERENCES materials(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_udcCodes_mu
        FOREIGN KEY (code_udc)
        REFERENCES udc_codes(code)
        ON DELETE CASCADE
);
"""

CREATE_TABLE_MATERIAL_EMBEDDINGS = """
-- Основная таблица для векторных представлений материалов
CREATE TABLE IF NOT EXISTS material_embeddings (
    material_id INTEGER PRIMARY KEY,
    
    title_embedding vector(384),           -- Для поиска по названию
    abstract_embedding vector(384),        -- Для поиска по аннотации
    
    CONSTRAINT fk_material_embedding
        FOREIGN KEY (material_id)
        REFERENCES materials(id)
        ON DELETE CASCADE
);
"""

CREATE_TABLE_ROLES = """
CREATE TABLE IF NOT EXISTS roles (
    id INTEGER PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);
"""

CREATE_TABLE_USERS = """
CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    login VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    faculty_id INTEGER,
    department_id INTEGER,
    role_id INTEGER NOT NULL,
    
    CONSTRAINT fk_faculty
        FOREIGN KEY (faculty_id)
        REFERENCES faculties(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_department
        FOREIGN KEY (department_id)
        REFERENCES departments(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_role
        FOREIGN KEY (role_id)
        REFERENCES roles(id)
        ON DELETE CASCADE,
);
"""

INIT_DB_COMMANDS = [
    CREATE_TABLE_FACULTIES,
    CREATE_TABLE_DEPARTMENTS,
    CREATE_TABLE_AUTHORS,
    CREATE_TABLE_KEYWORDS,
    CREATE_TABLE_SPECIALTIES,
    CREATE_TABLE_TYPES,
    CREATE_TABLE_UDC_CODES,
    CREATE_TABLE_MATERIALS,
    CREATE_TABLE_MATERIAL_AUTHORS,
    CREATE_TABLE_MATERIAL_KEYWORDS,
    CREATE_TABLE_MATERIAL_SPECIALTIES,
    CREATE_TABLE_MATERIAL_TYPES,
    CREATE_TABLE_MATERIAL_UDC,
    CREATE_TABLE_MATERIAL_EMBEDDINGS,
]

# TO DO: Добавить вставку в CREATE_TABLE_UDC_CODES и в CREATE_TABLE_MATERIAL_UDC

INSERT_FACULTY = """
    INSERT INTO faculties (name, url) 
    VALUES (%s, %s) 
    ON CONFLICT (url) DO UPDATE 
    SET name=EXCLUDED.name 
    RETURNING id;
"""

INSERT_DEPARTMENT = """
    INSERT INTO departments (name, url, faculty_id) 
    VALUES (%s, %s, %s) 
    ON CONFLICT (url) DO UPDATE 
    SET name=EXCLUDED.name, faculty_id=EXCLUDED.faculty_id 
    RETURNING id;
"""

INSERT_AUTHOR = """
    INSERT INTO authors (name) 
    VALUES (%s) 
    ON CONFLICT (name) DO NOTHING 
    RETURNING id;
"""

INSERT_KEYWORD = """
    INSERT INTO keywords (word) 
    VALUES (%s) 
    ON CONFLICT (word) DO NOTHING 
    RETURNING id;
"""

INSERT_SPECIALTY = """
    INSERT INTO specialties (spec_code, spec_name) 
    VALUES (%s, %s) 
    ON CONFLICT (spec_code, spec_name) DO NOTHING 
    RETURNING id;
"""

INSERT_TYPE = """
    INSERT INTO types (type_name) 
    VALUES (%s) 
    ON CONFLICT (type_name) DO NOTHING 
    RETURNING id;
"""

INSERT_MATERIAL = """
    INSERT INTO materials (
        title, 
        alternative_title, 
        abstract_text, 
        language_code, 
        publisher, 
        citation, 
        uri, 
        available_date, 
        issued_year, 
        page,
        department_id
    ) VALUES (
        %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
    ) 
    RETURNING id;
"""

INSERT_MATERIAL_AUTHOR = """
    INSERT INTO material_authors (material_id, author_id) 
    VALUES (%s, %s) 
    ON CONFLICT (material_id, author_id) DO NOTHING;
"""

INSERT_MATERIAL_KEYWORD = """
    INSERT INTO material_keywords (material_id, keyword_id) 
    VALUES (%s, %s) 
    ON CONFLICT (material_id, keyword_id) DO NOTHING;
"""

INSERT_MATERIAL_SPECIALTY = """
    INSERT INTO material_specialties (material_id, specialty_id) 
    VALUES (%s, %s) 
    ON CONFLICT (material_id, specialty_id) DO NOTHING;
"""

