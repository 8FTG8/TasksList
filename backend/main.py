from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import uuid

app = FastAPI()

# Configuração CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class Task(BaseModel):
    id: str
    title: str
    completed: bool

class TaskInput(BaseModel):
    title: str

class TaskUpdate(BaseModel):
    completed: bool

tasks_db: List[Task] = []

@app.get("/tasks", response_model=List[Task])
async def get_tasks():
    return tasks_db

@app.post("/tasks", response_model=Task)
async def create_task(data: TaskInput):
    task = Task(id=str(uuid.uuid4()), title=data.title, completed=False)
    tasks_db.append(task)
    return task

@app.put("/tasks/{task_id}", response_model=Task)
async def update_task(task_id: str, data: TaskUpdate):
    for task in tasks_db:
        if task.id == task_id:
            task.completed = data.completed
            return task
    raise HTTPException(status_code=404, detail="Task not found")

@app.delete("/tasks/{task_id}", response_model=Task)
async def delete_task(task_id: str):
    for i, task in enumerate(tasks_db):
        if task.id == task_id:
            return tasks_db.pop(i)
    raise HTTPException(status_code=404, detail="Task not found")