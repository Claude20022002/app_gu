# app/database.py
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# On lit l'URL de connexion depuis une variable d'environnement
# Format postgresql://user:password@host:PORT/NOM_BASE
# La valeur par défaut sert uniquement en cas d'oubli

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql:app_user:app_password@db:5432/app_db"
)

# engine = le moteur qui gère réellement la connexion à la base
engine = create_engine(DATABASE_URL, pool_pre_ping=True)

# SessionLocal = une usine qui fabrique des sessions
# Une session = une conversation temporaire avec la base de données
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base = la classe mère dont héritent tous nos modèles (tables)
Base = declarative_base()

# cette fonction fournit une session à chaque requête, puis la referme
# C'est une "dépendance" FastAPI
def get_db():
    db = SessionLocal()
    try:
        yield db # on prête la session à la route
    finally:
        db.close() # On referme même en cas d'erreur