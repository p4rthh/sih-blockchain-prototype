from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.endpoints import router as api_router

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description=(
        "Sovereign Blockchain Forensics Attribution Core for Indian Law Enforcement Agencies. "
        "Automates NCRP/SAHYOG complaint ingestion, multi-hop BFS tracing, GraphSAGE GNN classification, "
        "FIU-IND VASP attribution, bilingual evidence dossier generation, and Section 94 BNSS statutory dispatch."
    ),
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# Enable CORS for Next.js frontend and local demo environments
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API v1 router
app.include_router(api_router, prefix=settings.API_V1_PREFIX)

@app.get("/", tags=["Root"])
def read_root():
    return {
        "system": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "ONLINE",
        "docs_url": "/docs",
        "jurisdiction": "Republic of India (Bharatiya Nyaya Sanhita / BNSS / BSA compliant)",
        "api_v1_prefix": settings.API_V1_PREFIX
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)
