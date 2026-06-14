# 1. Image de basse : Python 3.12 en version "slim" (légère).
FROM python:3.12-slim

# 2. Dossier de travail dans le conteneur. Tout se passera ici.
WORKDIR /code

# 3. Copie d'ABORD le fichier des dépendances (et lui seul).
#   Astuce de cache : tant qu'il ne change pas, Docker réutilise
#   l'étape d'installation sans tout réinstaller
COPY requirements.txt .

# 4. On installe les dépendances Python
#   --no-cache-dir : n'enregistre pas le cache pip (image plus légère)
RUN pip install --no-cache-dir -r requirements.txt

# 5. On copie ensuite tout le reste du code (le dossier app/)
COPY . .

# 6. On documente le port utilisé par l'API
EXPOSE 8000

# 7. Commande de démarrage : lance le serveur Uvicorn
#   --host 0.0.0.0 : écoute sur toutes les interfaces (obligatoire en conteneur)
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]