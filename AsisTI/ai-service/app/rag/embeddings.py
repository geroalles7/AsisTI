
import httpx
import os

OLLAMA_URL = os.getenv("OLLAMA_URL", "http://ollama:11434")
EMBEDDING_MODEL = "nomic-embed-text"


async def generate_embedding(
    text: str,
    is_query: bool = False
) -> list[float]:

    prefix = "search_query: " if is_query else "search_document: "

    payload = {
        "model": EMBEDDING_MODEL,
        "input": prefix + text
    }

    async with httpx.AsyncClient(timeout=120.0) as client:
        response = await client.post(
            f"{OLLAMA_URL}/api/embed",
            json=payload
        )

        response.raise_for_status()

        data = response.json()

        embedding = data["embeddings"][0]

        if len(embedding) != 768:
            raise ValueError(
                f"Dimensión incorrecta: {len(embedding)}. "
                "Se esperaban 768 dimensiones."
            )

        return embedding
