from fastapi import FastAPI, Form, Request
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from sqlalchemy import Column, Integer, String, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# ---------------- APP ----------------
app = FastAPI()

# ---------------- STATIC & TEMPLATES ----------------
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

# ---------------- DATABASE ----------------
DATABASE_URL = "sqlite:///./users.db"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()

# ---------------- MODEL ----------------
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    dob = Column(String, nullable=False)
    city = Column(String, nullable=False)
    email = Column(String, nullable=False)
    mobile = Column(String, nullable=False)

# Create tables
Base.metadata.create_all(bind=engine)

# ---------------- ROUTES ----------------
@app.get("/", response_class=HTMLResponse)
def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

from typing import Optional

@app.post("/register")
def register_user(
    name: str = Form(...),
    dob: str = Form(...),
    city: str = Form(...),
    email: str = Form(...),
    mobile: str = Form(...),
   
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
