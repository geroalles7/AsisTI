
from pathlib import Path
from pypdf import PdfReader
from docx import Document


def load_document(file_path: str) -> str:
    path = Path(file_path)

    if not path.exists():
        raise FileNotFoundError(
            f"No se encontró el archivo: {file_path}"
        )

    extension = path.suffix.lower()

    if extension == ".txt":
        return path.read_text(encoding="utf-8")

    elif extension == ".pdf":
        reader = PdfReader(str(path))

        pages = []

        for page in reader.pages:
            text = page.extract_text() or ""
            pages.append(text)

        return "\n".join(pages)

    elif extension == ".docx":
        document = Document(str(path))

        paragraphs = [
            paragraph.text
            for paragraph in document.paragraphs
            if paragraph.text.strip()
        ]

        return "\n".join(paragraphs)

    else:
        raise ValueError(
            f"Formato no soportado: {extension}"
        )
