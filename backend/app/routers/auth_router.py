from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field

from .. import models, schemas
from ..database import get_db
from ..auth import verify_password, create_access_token, hash_password

router = APIRouter(prefix="/api/auth", tags=["auth"])


class RegisterIn(BaseModel):
    username: str = Field(min_length=3, max_length=32)
    password: str = Field(min_length=6)


@router.post("/register-first", status_code=201)
def register_first(payload: RegisterIn, db: Session = Depends(get_db)):
    """Create the very first admin user. Blocked once any admin exists."""
    existing = db.query(models.AdminUser).first()
    if existing:
        raise HTTPException(status_code=403, detail="Admin already configured. Use login instead.")
    user = models.AdminUser(username=payload.username, hashed_password=hash_password(payload.password))
    db.add(user)
    db.commit()
    return {"ok": True, "message": f"Admin '{payload.username}' created. You can now log in."}


@router.get("/status")
def admin_status(db: Session = Depends(get_db)):
    """Returns whether an admin account exists (used by setup page)."""
    exists = db.query(models.AdminUser).first() is not None
    return {"configured": exists}


@router.post("/login", response_model=schemas.TokenOut)
def login(payload: schemas.LoginIn, db: Session = Depends(get_db)):
    user = db.query(models.AdminUser).filter(models.AdminUser.username == payload.username).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    token = create_access_token({"sub": user.username})
    return schemas.TokenOut(access_token=token)


@router.post("/user/register", response_model=schemas.UserOut, status_code=201)
def user_register(payload: schemas.UserRegisterIn, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(models.User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed = hash_password(payload.password)
    user = models.User(
        name=payload.name,
        email=payload.email,
        hashed_password=hashed,
        provider="credentials",
        avatar=f"https://api.dicebear.com/7.x/adventurer/svg?seed={payload.name}",
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.post("/user/login", response_model=schemas.UserOut)
def user_login(payload: schemas.UserLoginIn, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == payload.email).first()
    if not user or user.provider != "credentials" or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return user


import os
from google.oauth2 import id_token
from google.auth.transport import requests

class UserLoginOut(BaseModel):
    user: schemas.UserOut
    access_token: str
    token_type: str = "bearer"

@router.post("/user/google", response_model=UserLoginOut)
def user_google(payload: schemas.UserGoogleIn, db: Session = Depends(get_db)):
    GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
    if not GOOGLE_CLIENT_ID:
        raise HTTPException(status_code=500, detail="Google Client ID not configured on server")

    try:
        # Verify the token signature and audience
        id_info = id_token.verify_oauth2_token(
            payload.credential, 
            requests.Request(), 
            GOOGLE_CLIENT_ID
        )
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid Google token")

    email = id_info.get("email")
    name = id_info.get("name", "Google User")
    avatar = id_info.get("picture", "")

    if not email:
        raise HTTPException(status_code=400, detail="Google token missing email")

    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        user = models.User(name=name, email=email, avatar=avatar, provider="google")
        db.add(user)
        db.commit()
        db.refresh(user)
    else:
        if user.provider != "google":
            user.provider = "google"
        user.avatar = avatar
        db.commit()
        db.refresh(user)
    
    # Create session token for the user
    token = create_access_token({"sub": str(user.id)})
    
    return UserLoginOut(user=user, access_token=token)
