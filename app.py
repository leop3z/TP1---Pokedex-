from flask import Flask, jsonify, render_template, request
from flask_sqlalchemy import SQLAlchemy
import requests

app = Flask(__name__)

# Configuración de la base de datos
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://pokemon_user:password@localhost:5432/pokemon_teams'
db = SQLAlchemy(app)

# Ruta para la página principal
@app.route('/')
def index():
    return render_template('index.html')


# Ruta para obtener detalles de un Pokémon por ID
@app.route('/pokemon', methods=['GET'])
def get_pokemon():
    try:
        # Obtener el ID del Pokémon desde el parámetro de consulta
        pokemon_id = request.args.get('id')
        if not pokemon_id:
            return jsonify({"error": "ID de Pokémon no proporcionado."}), 400

        # URL base de la PokeAPI
        base_url = "https://pokeapi.co/api/v2/pokemon/"

        # Construir la URL completa para obtener detalles del Pokémon
        url = base_url + str(pokemon_id)

        # Realizar la solicitud GET a la PokeAPI
        response = requests.get(url)

        # Verificar el código de respuesta
        if response.status_code == 200:
            pokemon_data = response.json()

            # Extraer la información relevante del Pokémon
            pokemon_details = {
                "id": pokemon_data['id'],
                "name": pokemon_data['name']
            }

            # Renderizar el template pokemon.html con los detalles del Pokémon
            return render_template('pokemon.html', pokemon=pokemon_details)

        else:
            return jsonify({"error": "Pokémon no encontrado."}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Definición de los modelos

class PokemonTeam(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    pokemon_data = db.Column(db.JSON)

with app.app_context():
    db.create_all()

# Métodos CRUD
@app.route('/team', methods=['GET'])
def team():
    return render_template('team.html')

# POST = Crear
@app.route('/team', methods=['POST'])
def create_team():
    try:
        data = request.json
        new_team = PokemonTeam(name=data['name'], pokemon_data=data['pokemon_data'])
        db.session.add(new_team)
        db.session.commit()
        return jsonify(message='Team created successfully'), 201
    except Exception as e:
        return jsonify(message=f'Error creating team: {str(e)}'), 500
    
# GET = Obtener
@app.route('/team/<int:team_id>', methods=['GET'])
def get_team(team_id):
    team = PokemonTeam.query.get_or_404(team_id)
    return jsonify({
        'id': team.id,
        'name': team.name,
        'pokemons': [{'id': p['id'], 'name': p['name']} for p in team.pokemon_data]
    })

# Nueva ruta para obtener todos los equipos
@app.route('/teams', methods=['GET'])
def get_all_teams():
    try:
        teams = PokemonTeam.query.all()
        teams_list = []
        for team in teams:
            teams_list.append({
                'id': team.id,
                'name': team.name,
                'pokemons': [{'id': p['id'], 'name': p['name']} for p in team.pokemon_data]
            })
        return jsonify(teams_list), 200
    except Exception as e:
        return jsonify(message=f'Error fetching teams: {str(e)}'), 500

# PUT = Actualizar
@app.route('/team/<int:team_id>', methods=['PUT'])
def update_team(team_id):
    team = PokemonTeam.query.get_or_404(team_id)
    data = request.json
    team.name = data.get('name', team.name)
    team.pokemon_data = data.get('pokemon_data', team.pokemon_data)
    db.session.commit()
    return jsonify(message='Team updated successfully')

# DELETE = Borrar
@app.route('/team/<int:team_id>', methods=['DELETE'])
def delete_team(team_id):
    team = PokemonTeam.query.get_or_404(team_id)
    db.session.delete(team)
    db.session.commit()
    return jsonify(message='Team deleted successfully')

if __name__ == '__main__':
    app.run(debug=True)