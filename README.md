# TP1---Pokemones-

# Crear un entorno virtual
python -m venv venv

# Activar el entorno virtual
# En Windows
venv\Scripts\activate
# En macOS/Linux
source venv/bin/activate

# Dependencias
pip install -r requirements.txt

# Base de Datos
# Accede a la consola de PostgreSQL
psql

# Crea un usuario
CREATE USER pokemon_user WITH PASSWORD 'password';

# Crea la base de datos
CREATE DATABASE pokemon_teams;

# Otorga permisos al usuario en la base de datos
GRANT ALL PRIVILEGES ON DATABASE pokemon_teams TO pokemon_user;

# Iniciar la aplicación
python app.py