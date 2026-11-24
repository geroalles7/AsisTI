
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from prometheus_fastapi_instrumentator import Instrumentator

from app.services.ollama_service import generate_response

app = FastAPI(
    title="AsisTI AI Service",
    description="Servicio de inteligencia artificial para el asistente AsisTI",
    version="1.0.0"
)
Instrumentator().instrument(app).expose(app)


class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    response: str


@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "asisti-ai-service"
    }


@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        response = await generate_response(request.message)

        return ChatResponse(response=response)

    except Exception as error:
        raise HTTPException(
            status_code=502,
            detail=f"Error al comunicarse con Ollama: {str(error)}"
        )
