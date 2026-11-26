
import httpx
import os
import time

from app.agents.prompts import SYSTEM_PROMPT
from app.rag.retriever import search_documents

OLLAMA_URL = os.getenv("OLLAMA_URL", "http://ollama:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "qwen2.5:3b")

# Umbral mínimo de similitud para utilizar un documento.
MIN_SIMILARITY = 0.35


async def generate_response(message: str) -> str:

    total_start = time.perf_counter()

    # 1. Buscar información relevante en PostgreSQL
    retrieval_start = time.perf_counter()

    documents = await search_documents(message, limit=3)

    retrieval_time = time.perf_counter() - retrieval_start

    # 2. Filtrar resultados poco relevantes
    relevant_documents = [
        document
        for document in documents
        if document["similitud"] >= MIN_SIMILARITY
    ]

    # 3. Construir el contexto documental
    if relevant_documents:
        context = "\n\n".join(
            [
                f"""
Documento: {document['nombre_archivo']}
Contenido:
{document['contenido']}
"""
                for document in relevant_documents
            ]
        )
    else:
        context = "No se encontraron documentos relevantes."

    # 4. Preparar las instrucciones y la consulta
    user_message = f"""
DOCUMENTOS RELEVANTES:
{context}

CONSULTA DEL EMPLEADO:
{message}
"""

    # 5. Enviar la consulta a Ollama
    payload = {
        "model": OLLAMA_MODEL,
        "messages": [
            {
                "role": "system",
                "content": SYSTEM_PROMPT
            },
            {
                "role": "user",
                "content": user_message
            }
        ],
        "stream": False,
        "options": {
            "num_predict": 300
        }
    }

    generation_start = time.perf_counter()

    async with httpx.AsyncClient(timeout=180.0) as client:

        response = await client.post(
            f"{OLLAMA_URL}/api/chat",
            json=payload
        )

        response.raise_for_status()

        data = response.json()

    generation_time = time.perf_counter() - generation_start
    total_time = time.perf_counter() - total_start

    # 6. Preparar información de los documentos recuperados
    document_details = [
        {
            "documento": document["nombre_archivo"],
            "chunk": document["numero_chunk"],
            "similitud": round(document["similitud"], 4)
        }
        for document in documents
    ]

    # 7. Mostrar métricas de evaluación en los logs de Docker
    print(
        "\n========== EVALUACION RAG ==========",
        flush=True
    )

    print(
        f"Pregunta: {message}",
        flush=True
    )

    print(
        f"Documentos recuperados: {len(documents)}",
        flush=True
    )

    print(
        f"Documentos relevantes: {len(relevant_documents)}",
        flush=True
    )

    print(
        f"Documentos: {document_details}",
        flush=True
    )

    print(
        f"Tiempo recuperacion: {retrieval_time:.3f} segundos",
        flush=True
    )

    print(
        f"Tiempo generacion: {generation_time:.3f} segundos",
        flush=True
    )

    print(
        f"Tiempo total: {total_time:.3f} segundos",
        flush=True
    )

    print(
        "====================================\n",
        flush=True
    )

    return data["message"]["content"]
