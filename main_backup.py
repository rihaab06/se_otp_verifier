from fastapi import FastAPI, Form, Request
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from database import SessionLocal, engine
from models import User
from database import Base

import random
from sqlalchemy.orm import Session
from fastapi import HTTPException

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

def generate_otp():
    return str(random.randint(100000, 999999))
@app.post("/login/email")
def login_with_email(email: str = Form(...)):
    db: Session = SessionLocal()

    user = db.query(User).filter(User.email == email).first()

    if not user:
        db.close()
        raise HTTPException(status_code=404, detail="Email not registered")

    otp = generate_otp()
    user.otp = otp
    db.commit()
    db.close()

    # TEMP: print OTP (later replace with real email sending)
    print("OTP for", email, ":", otp)

    return RedirectResponse(
        url=f"/verify-otp?email={email}",
        status_code=303
    )

@app.get("/verify-otp", response_class=HTMLResponse)
def verify_otp_page(request: Request, email: str):
    return templates.TemplateResponse(
        "verify_otp.html",
        {"request": request, "email": email}
    )

@app.post("/verify-otp")
def verify_otp(email: str = Form(...), otp: str = Form(...)):
    db = SessionLocal()
    user = db.query(User).filter(User.email == email).first()

    if not user or user.otp != otp:
        db.close()
        raise HTTPException(status_code=400, detail="Invalid OTP")

    user.otp = None
    db.commit()
    db.close()

    return RedirectResponse("/dashboard", status_code=303)


@app.get("/dashboard", response_class=HTMLResponse)
def dashboard(request: Request):
    return HTMLResponse("<h1>Login Successful 🎉</h1>")
