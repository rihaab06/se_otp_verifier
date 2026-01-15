from fastapi import FastAPI, Form, Request
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from database import SessionLocal, engine
from models import User
from database import Base

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

Base.metadata.create_all(bind=engine)

@app.get("/", response_class=HTMLResponse)
def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.post("/register")
def register_user(
    name: str = Form(...),
    dob: str = Form(...),
    city: str = Form(...),
    email: str = Form(...),
    mobile: str = Form(...)
):
    db = SessionLocal()
    user = User(
        name=name,
        dob=dob,
        city=city,
        email=email,
        mobile=mobile
    )
    db.add(user)
    db.commit()
    db.close()

    return RedirectResponse("/success", status_code=303)

@app.get("/success", response_class=HTMLResponse)
def success(request: Request):
    return templates.TemplateResponse("regSuccess.html", {"request": request})
