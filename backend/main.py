from typing import Optional

from fastapi import FastAPI, UploadFile, File, Form, Body, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from evaluation import evaluate_submission
from email_watcher.config import EmailSettings
from email_watcher.manager import worker_manager


app = FastAPI(title="NG SkillCheck Clean AI Engine - Optimized")


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://main.dtaell0zoz93v.amplifyapp.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# 5. The Main Core Route
@app.post("/api/evaluate")
async def handle_evaluation(
    track: str = Form(...),
    evaluation_type: str = Form(...),
    file: UploadFile = File(None),
    repo_url: str = Form(None)
):
    file_bytes = await file.read() if file else None
    return evaluate_submission(
        file_bytes=file_bytes,
        track=track,
        evaluation_type=evaluation_type,
        repo_url=repo_url,
    )


# Email intake worker controls (drives email_watcher as a background thread)
@app.get("/api/worker/status")
def worker_status():
    return worker_manager.status()


@app.post("/api/worker/start")
def worker_start(config: Optional[dict] = Body(default=None)):
    settings = EmailSettings.from_overrides(config)
    try:
        return worker_manager.start(settings)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/api/worker/stop")
def worker_stop():
    return worker_manager.stop()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
