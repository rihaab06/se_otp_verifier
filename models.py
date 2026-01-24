from sqlalchemy import Column, Integer, String, DateTime
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    dob = Column(String, nullable=False)
    city = Column(String, nullable=False)
    email = Column(String, nullable=False, unique=True, index=True)
    mobile = Column(String, nullable=False)
    otp = Column(String, nullable=True)
    otp_expires_at = Column(DateTime, nullable=True)
