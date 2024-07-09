from flask import Flask, jsonify, render_template, request, session
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import requests

app = Flask(__name__)
app.secret_key = 'your_secret_key'  # Cambia esto por una clave secreta fuerte

# Configuración de la base de datos
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://pokemon_user:password@localhost:5432/pokemon_teams'
db = SQLAlchemy(app)

# Definición de los modelos

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), nullable=False, unique=True)
    password = db.Column(db.String(200), nullable=False)
    teams = db.relationship('Team', backref='user', lazy=True)

class Team(db.Model):
    __tablename__ = 'teams'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    pokemons = db.relationship('Pokemon', backref='team', lazy=True)

class Pokemon(db.Model):
    __tablename__ = 'pokemons'
    id = db.Column(db.Integer, primary_key=True)
    pokemon_id = db.Column(db.Integer, nullable=False)
    team_id = db.Column(db.Integer, db.ForeignKey('teams.id'), nullable=False)

with app.app_context():
    db.create_all()

# Ruta para la nueva página de inicio
@app.route('/')
def home():
    return render_template('home.html')

# Ruta para la página de registro
@app.route('/register', methods=['GET'])
def register_page():
    return render_template('register.html')

# Ruta para la página de inicio de sesión
@app.route('/login', methods=['GET'])
def login_page():
    return render_template('login.html')

# Ruta para la página de equipos
@app.route('/team', methods=['GET'])
def create_team_page():
    return render_template('team.html')

@app.route('/pokemon', methods=['GET'])
def show_pokemon():
    return render_template('pokemon.html')

# Ruta para la página principal que contiene todos los Pokémon del PokeAPI
@app.route('/index', methods=['GET'])
def index():
    return render_template('index.html')

@app.route('/register', methods=['POST'])
def register_user():
    try:
        data = request.json
        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return jsonify(message='Username and password are required'), 400

        existing_user = User.query.filter_by(username=username).first()
        if existing_user:
            return jsonify(message='Username already exists'), 400

        hashed_password = generate_password_hash(password)
        new_user = User(username=username, password=hashed_password)
        db.session.add(new_user)
        db.session.commit()

        return jsonify(message='User registered successfully', success=True), 201
    except Exception as e:
        return jsonify(message=f'Error registering user: {str(e)}'), 500

@app.route('/login', methods=['POST'])
def login_user():
    try:
        data = request.json
        username = data.get('username')
        password = data.get('password')

        user = User.query.filter_by(username=username).first()
        if user and check_password_hash(user.password, password):
            session['user_id'] = user.id
            return jsonify(message='Login successful', success=True), 200
        else:
            return jsonify(message='Invalid username or password', success=False), 401
    except Exception as e:
        return jsonify(message=f'Error logging in: {str(e)}'), 500

@app.route('/team', methods=['POST'])
def create_team():
    try:
        if 'user_id' not in session:
            return jsonify(message='User not logged in'), 401

        data = request.json
        existing_team = Team.query.filter_by(name=data['name']).first()
        if existing_team:
            return jsonify(message='Team name already exists'), 400

        new_team = Team(name=data['name'], user_id=session['user_id'])
        db.session.add(new_team)
        db.session.commit()

        return jsonify(message='Team created successfully', team_id=new_team.id), 201
    except Exception as e:
        return jsonify(message=f'Error creating team: {str(e)}'), 500

@app.route('/team/<int:team_id>/pokemon', methods=['POST'])
def add_pokemon_to_team(team_id):
    try:
        if 'user_id' not in session:
            return jsonify(message='User not logged in'), 401

        team = Team.query.get_or_404(team_id)
        if team.user_id != session['user_id']:
            return jsonify(message='Unauthorized'), 403

        if len(team.pokemons) >= 6:
            return jsonify(message='Team already has 6 pokemons'), 400

        data = request.json
        new_pokemon = Pokemon(pokemon_id=data['pokemon_id'], team_id=team_id)
        db.session.add(new_pokemon)
        db.session.commit()

        return jsonify(message='Pokemon added to team successfully'), 201
    except Exception as e:
        return jsonify(message=f'Error adding pokemon to team: {str(e)}'), 500

@app.route('/team/<int:team_id>/pokemons', methods=['GET'])
def get_team_pokemons(team_id):
    try:
        team = Team.query.get_or_404(team_id)
        pokemons = Pokemon.query.filter_by(team_id=team.id).all()
        pokemon_list = [{"id": pokemon.id, "pokemon_id": pokemon.pokemon_id} for pokemon in pokemons]
        return jsonify(pokemon_list), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/teams', methods=['GET'])
def get_teams():
    try:
        if 'user_id' not in session:
            return jsonify(message='User not logged in'), 401

        teams = Team.query.filter_by(user_id=session['user_id']).all()
        team_list = [{"id": team.id, "name": team.name} for team in teams]
        return jsonify(team_list), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/teams_with_pokemons', methods=['GET'])
def get_teams_with_pokemons():
    try:
        if 'user_id' not in session:
            return jsonify(message='User not logged in'), 401

        teams = Team.query.filter_by(user_id=session['user_id']).all()
        teams_with_pokemons = []
        for team in teams:
            pokemons = Pokemon.query.filter_by(team_id=team.id).all()
            pokemon_list = [{"pokemon_id": pokemon.pokemon_id} for pokemon in pokemons]
            teams_with_pokemons.append({"id": team.id, "name": team.name, "pokemons": pokemon_list})
        return jsonify(teams_with_pokemons), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/team/<int:team_id>/pokemon/<int:pokemon_id>', methods=['DELETE'])
def delete_pokemon_from_team(team_id, pokemon_id):
    try:
        if 'user_id' not in session:
            return jsonify(message='User not logged in'), 401

        team = Team.query.get_or_404(team_id)
        if team.user_id != session['user_id']:
            return jsonify(message='Unauthorized'), 403

        pokemon = Pokemon.query.filter_by(team_id=team_id, pokemon_id=pokemon_id).first_or_404()
        db.session.delete(pokemon)
        db.session.commit()

        return jsonify(message='Pokemon removed from team successfully'), 200
    except Exception as e:
        return jsonify(message=f'Error removing pokemon from team: {str(e)}'), 500

@app.route('/team/<int:team_id>', methods=['DELETE'])
def delete_team(team_id):
    try:
        if 'user_id' not in session:
            return jsonify(message='User not logged in'), 401

        team = Team.query.get_or_404(team_id)
        if team.user_id != session['user_id']:
            return jsonify(message='Unauthorized'), 403

        pokemons = Pokemon.query.filter_by(team_id=team_id).all()
        for pokemon in pokemons:
            db.session.delete(pokemon)
        db.session.delete(team)
        db.session.commit()

        return jsonify(message='Team and its pokemons deleted successfully'), 200
    except Exception as e:
        return jsonify(message=f'Error deleting team: {str(e)}'), 500
    
@app.route('/team/<int:team_id>', methods=['PUT'])
def update_team_name(team_id):
    try:
        if 'user_id' not in session:
            return jsonify(message='User not logged in'), 401

        data = request.json
        team = Team.query.get_or_404(team_id)
        if team.user_id != session['user_id']:
            return jsonify(message='Unauthorized'), 403

        team.name = data['name']
        db.session.commit()

        return jsonify(message='Team name updated successfully'), 200
    except Exception as e:
        return jsonify(message=f'Error updating team name: {str(e)}'), 500

if __name__ == '__main__':
    app.run(debug=True)