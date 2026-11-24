
-- ==========================================
-- ASISTI - Inicialización de PostgreSQL
-- ==========================================

-- Habilitar extensión de vectores
CREATE EXTENSION IF NOT EXISTS vector;

-- ==========================================
-- TABLA: documentos
-- ==========================================

CREATE TABLE IF NOT EXISTS documentos (
    id BIGSERIAL PRIMARY KEY,
    nombre_archivo VARCHAR(255) NOT NULL,
    contenido TEXT NOT NULL,
    embedding VECTOR(768) NOT NULL,
    numero_chunk INTEGER NOT NULL,
    metadatos JSONB DEFAULT '{}'::jsonb,
    fecha_indexacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- TABLA: contactos
-- ==========================================

CREATE TABLE IF NOT EXISTS contactos (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    tipo_inconveniente VARCHAR(255) NOT NULL,
    descripcion TEXT NOT NULL,
    estado VARCHAR(50) NOT NULL DEFAULT 'Pendiente',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
