from fastapi import FastAPI
from app.providers.model_loader import ModelLoader

app = FastAPI()


@app.on_event("startup")
async def startup_event():
    ModelLoader.get_model()


@app.post("/vectorize")
async def vectorize(data: dict):
    text = data.get("text")
    model = ModelLoader.get_model()
    embedding = model.encode([text])[0]
    return {"embedding": embedding.tolist()}
