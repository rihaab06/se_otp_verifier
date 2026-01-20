from fastapi import FastAPI, Form, Request, HTTPException
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session
from starlette.middleware.sessions import SessionMiddleware
import random

from database import SessionLocal, engine, Base
from models import User

from utils.email import send_otp_email

# ---------------- APP SETUP ----------------

app = FastAPI()

# 🔐 Session middleware (required for login persistence)
app.add_middleware(
    SessionMiddleware,
    secret_key="super-secret-key-change-this"
)

# Static & templates
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

# Create tables
Base.metadata.create_all(bind=engine)

# ---------------- HOME ----------------

@app.get("/", response_class=HTMLResponse)
def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

# ---------------- REGISTER ----------------

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

# ---------------- REGISTRATION SUCCESS ----------------

@app.get("/success", response_class=HTMLResponse)
def success(request: Request):
    return templates.TemplateResponse("regSuccess.html", {"request": request})

# ---------------- OTP HELPERS ----------------

def generate_otp():
    return str(random.randint(100000, 999999))

# ---------------- LOGIN (EMAIL OTP) ----------------

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

    # TEMP: print OTP (replace with email service later)
    send_otp_email(email, otp)


    return RedirectResponse(f"/verify-otp?email={email}", status_code=303)

# ---------------- OTP PAGE ----------------

@app.get("/verify-otp", response_class=HTMLResponse)
def verify_otp_page(request: Request, email: str):
    return templates.TemplateResponse(
        "verify_otp.html",
        {"request": request, "email": email}
    )

# ---------------- OTP VERIFY ----------------

@app.post("/verify-otp")
def verify_otp(
    request: Request,
    email: str = Form(...),
    otp: str = Form(...)
):
    db = SessionLocal()
    user = db.query(User).filter(User.email == email).first()

    if not user or user.otp != otp:
        db.close()
        raise HTTPException(status_code=400, detail="Invalid OTP")

    # ✅ Clear OTP
    user.otp = None

    # ✅ Store login session
    request.session["user_email"] = user.email

    db.commit()
    db.close()

    return RedirectResponse("/dashboard", status_code=303)

# ---------------- DASHBOARD ----------------

@app.get("/dashboard", response_class=HTMLResponse)
def dashboard(request: Request):
    email = request.session.get("user_email")

    if not email:
        return RedirectResponse("/", status_code=303)

    db = SessionLocal()
    user = db.query(User).filter(User.email == email).first()
    db.close()

    if not user:
        return RedirectResponse("/", status_code=303)

    return templates.TemplateResponse(
        "dashboard.html",
        {
            "request": request,
            "user": user
        }
    )

# ---------------- LOGOUT ----------------

@app.get("/logout")
def logout(request: Request):
    request.session.clear()
    return RedirectResponse("/", status_code=303)

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

    # 🔍 SHOW OTP IN TERMINAL (DEV ONLY)
    print(f"[DEV OTP] OTP for {email} → {otp}")

    # 📧 SEND OTP TO EMAIL
    send_otp_email(email, otp)

    return RedirectResponse(f"/verify-otp?email={email}", status_code=303)

@app.get("/test-email")
def test_email():
    send_otp_email("your_other_email@gmail.com", "123456")
    return "Email sent"
