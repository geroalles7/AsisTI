
def split_into_chunks(
    text: str,
    chunk_size: int = 500,
    overlap: int = 50
) -> list[str]:

    words = text.split()

    if not words:
        return []

    if overlap >= chunk_size:
        raise ValueError(
            "El solapamiento debe ser menor que el tamaño del fragmento."
        )

    chunks = []
    start = 0

    while start < len(words):
        end = start + chunk_size

        chunk = " ".join(words[start:end])

        if chunk.strip():
            chunks.append(chunk)

        start += chunk_size - overlap

    return chunks
