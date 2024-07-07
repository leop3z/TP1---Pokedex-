# TP1 Pokeden't 
<p>
Este proyecto de aplicación web permite a los usuarios crear y gestionar equipos de Pokémon.
</p>

## Configuración del Entorno Virtual

- Para configurar y activar un entorno virtual, sigue estos pasos según tu sistema operativo:

```
python -m venv venv
```
## Activar el entorno virtual

### En Windows
```
venv\Scripts\activate
```
### En macOS/Linux
```
source venv/bin/activate
```
### Dependencias
```
pip install -r requirements.txt
```
## Base de Datos 
## Accede a la consola de PostgreSQL

```
psql
```
> [!Nota]: Esto te hará acceder como usuario 'postgres' o el usuario que has establecido

### Crea la base de datos
```
CREATE DATABASE pokemon_teams;
```
### Cambia a la base de datos recién creada
```
\c pokemon_teams
```
> [!Nota]: Acá podrás ver los cambios al momento de crear equipos, en sus respectivas tablas 

## Iniciar la aplicación
```
python app.py
```