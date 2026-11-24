
import os
import asyncio
from pathlib import Path

import psycopg
from psycopg.types.json import Jsonb

from app.rag.document_loader import load_document
from app.rag.chunker import split_into_chunks
from app.rag.embeddings import generate_embedding


DOCUMENTS_DIR = Path("/app/documents")

DB_CONFIG = {
    "host": os.getenv("DB_HOST", "postgres-asisti"),
    "port": int(os.getenv("DB_PORT", "5432")),
    "dbname": os.getenv("DB_NAME", "asisti"),
    "user": os.getenv("DB_USER", "asisti_user"),
    "password": os.getenv("DB_PASSWORD"),
}


async def index_document(file_path: Path, connection):
    print(f"\nProcesando: {file_path.name}")

    text = load_document(str(file_path))

    if not text.strip():
        print("Documento vacío. Se omite.")
        return 0

    chunks = split_into_chunks(text)

    # Eliminar fragmentos anteriores del mismo documento.
    with connection.cursor() as cursor:
        cursor.execute(
            "DELETE FROM documentos WHERE nombre_archivo = %s",
            (file_path.name,)
        )

    indexed_count = 0

    for number, chunk in enumerate(chunks, start=1):
        embedding = await generate_embedding(
            chunk,
            is_query=False
        )

        metadata = {
            "extension": file_path.suffix.lower(),
            "ruta": file_path.name
        }

        with connection.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO documentos (
                    nombre_archivo,
                    contenido,
                    embedding,
                    numero_chunk,
                    metadatos
                )
                VALUES (%s, %s, %s::vector, %s, %s)
                """,
                (
                    file_path.name,
                    chunk,
                    str(embedding),
                    number,
                    Jsonb(metadata)
                )
            )

        indexed_count += 1
        print(f"Fragmento {number} almacenado.")

    connection.commit()

    print(
        f"Documento indexado: {file_path.name} "
        f"({indexed_count} fragmentos)"
    )

    return indexed_count


async def main():
    if not DB_CONFIG["password"]:
        raise ValueError("No está configurada DB_PASSWORD.")

    if not DOCUMENTS_DIR.exists():
        raise FileNotFoundError(
            f"No existe la carpeta {DOCUMENTS_DIR}"
        )

    extensions = {".txt", ".pdf", ".docx"}

    files = [
        path for path in DOCUMENTS_DIR.iterdir()
        if path.is_file() and path.suffix.lower() in extensions
    ]

    if not files:
        print("No se encontraron documentos.")
        return

    total_chunks = 0

    with psycopg.connect(**DB_CONFIG) as connection:
        for file_path in files:
            try:
                total_chunks += await index_document(
                    file_path,
                    connection
                )
            except Exception:
                connection.rollback()
                raise

    print("\n========== INDEXACIÓN FINALIZADA ==========")
    print(f"Documentos procesados: {len(files)}")
    print(f"Fragmentos almacenados: {total_chunks}")


if __name__ == "__main__":
    asyncio.run(main())
