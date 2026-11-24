
import asyncio

from app.rag.retriever import search_documents


async def main():

    question = "Mi impresora no imprime los documentos"

    print(f"\nPregunta: {question}\n")

    results = await search_documents(question, limit=3)

    if not results:
        print("No se encontraron documentos.")
        return

    print("DOCUMENTOS RECUPERADOS")
    print("======================")

    for document in results:
        print(f"\nArchivo: {document['nombre_archivo']}")
        print(f"Fragmento: {document['numero_chunk']}")
        print(f"Similitud: {document['similitud']:.4f}")
        print(f"Contenido:\n{document['contenido']}")


if __name__ == "__main__":
    asyncio.run(main())
