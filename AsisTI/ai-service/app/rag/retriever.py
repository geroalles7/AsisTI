
import os
import psycopg

from app.rag.embeddings import generate_embedding


DB_CONFIG = {
    "host": os.getenv("DB_HOST", "postgres-asisti"),
    "port": int(os.getenv("DB_PORT", "5432")),
    "dbname": os.getenv("DB_NAME", "asisti"),
    "user": os.getenv("DB_USER", "asisti_user"),
    "password": os.getenv("DB_PASSWORD"),
}


async def search_documents(
    query: str,
    limit: int = 3
) -> list[dict]:

    # Generar embedding de la consulta
    query_embedding = await generate_embedding(
        query,
        is_query=True
    )

    # Buscar los fragmentos más similares
    with psycopg.connect(**DB_CONFIG) as connection:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT
                    id,
                    nombre_archivo,
                    contenido,
                    numero_chunk,
                    1 - (embedding <=> %s::vector) AS similitud
                FROM documentos
                ORDER BY embedding <=> %s::vector
                LIMIT %s
                """,
                (
                    str(query_embedding),
                    str(query_embedding),
                    limit
                )
            )

            results = cursor.fetchall()

    documents = []

    for row in results:
        documents.append({
            "id": row[0],
            "nombre_archivo": row[1],
            "contenido": row[2],
            "numero_chunk": row[3],
            "similitud": float(row[4])
        })

    return documents
