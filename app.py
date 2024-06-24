from flask import Flask, jsonify, render_template
import requests

app = Flask(__name__)

# Ruta para la página principal
@app.route('/')
def index():
    return render_template('index.html')


# Ruta para obtener detalles de un Pokémon por ID
@app.route('/pokemon/<int:pokemon_id>', methods=['GET'])
def get_pokemon(pokemon_id):
    try:
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
                "name": pokemon_data['name'],
                "height": pokemon_data['height'],
                "weight": pokemon_data['weight'],
                "stats": pokemon_data['stats'],
                "types": [type_data['type']['name'] for type_data in pokemon_data['types']]
            }

            return jsonify(pokemon_details)

        else:
            return jsonify({"error": "Pokémon not found."}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
