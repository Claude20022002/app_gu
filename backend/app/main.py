# app/main.py
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from . import models, schemas
from .database import engine, get_db, Base

# Crée les tables si elles n'existent pas (fillet de sécurité au démarrage)
Base.metadata.create_all(bind=engine)

# Instancie l'application FastAPI
app = FastAPI(title="API Gestion d'utilisateurs", version="1.0.0")

#   CORS : autoris le frontend (autre origine) à l'appeler cette API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # en production, mettre l'URL exact du frontend
    allow_methods=["*"],
    allow_headers=["*"]
)

# Route de "santé" : permet de vérifier que l'API tourne
@app.get("/health")
def health():
    return {"status" : "Okayyy bro"}

# ============= READ: lister tous utilisateurs GET /users =============
@app.get("/users", response_model=list[schemas.UserOut])
def list_users(db: Session = Depends(get_db)):
    return db.query(models.User).order_by(models.User.id).all()

# ============= READ : un seul utilisateur GET /USERS/{id} =============
@app.get("/users/{user_id}", response_model=schemas.UserOut)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, details="Utilisateurs non trouvé")
    return user

# ============= CREATE : ajouter un utilisateur POST /users =============
@app.post("/users", response_model=schemas.UserOut, status_code=201)
def create_user(payload: schemas.UserCreate, db: Session = Depends(get_db)):
    user = models.User(nom=payload.nom, prenom = payload.prenom, email = payload.email)
    db.add(user)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail = "Cet email existe déjà")
    db.refresh(user)
    return user

#	============	UPDATE	:	modifier	un	utilisateur	(PUT	/users/{id})	============
@app.put("/users/{user_id}",	response_model=schemas.UserOut)
def	update_user(user_id:	int,	payload:	schemas.UserUpdate, db:	Session	=	Depends(get_db)):
	user	=	db.query(models.User).filter(models.User.id	==	user_id).first()
	if user is	None:
		raise	HTTPException(status_code=404,	detail="Utilisateur	introuvable")
	user.nom	=	payload.nom
	user.prenom	=	payload.prenom
	user.email	=	payload.email
	try:
		db.commit()
	except	IntegrityError:
		db.rollback()
		raise	HTTPException(status_code=409,	detail="Cet	email	existe	déjà")
	db.refresh(user)
	return	user

#	============	DELETE	:	supprimer	un	utilisateur	(DELETE	/users/{id})	======
@app.delete("/users/{user_id}",	status_code=204)
def	delete_user(user_id:	int,	db:	Session	=	Depends(get_db)):
	user = db.query(models.User).filter(models.User.id	==	user_id).first()
	if user	is	None:
		raise	HTTPException(status_code=404,	detail="Utilisateur	introuvable")
	db.delete(user)
	db.commit()
	return	None