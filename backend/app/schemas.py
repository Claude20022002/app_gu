# app/schemas.py
from datetime import datetime
from pydantic import BaseModel, EmailStr, ConfigDict

# Champs communs fournis par le client lors d'une création/modification
class UserBase(BaseModel):
    nom: str
    prenom: str
    email: EmailStr # EmailStr valide automatiquement le format de l'email
    
# Données attendues pour CREER un utilisateur (POST)
class UserCreate(UserBase):
    pass

#Données attendues pour MODIFIER un utilisateur (PUT)
class UserUpdate(UserBase):
    pass
    
# DOnnées RENVOYEES par l'API (on ajoute id et la date_creation)
class UserOut(UserBase):
    id: int
    date_creation: datetime
    
    # Autorise Pydantic à lire directement un objet SQLAlchemy
    model_config = ConfigDict(from_attributes=True)