from flask import Flask, jsonify, render_template, request
import requests

app = Flask(__name__)

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

if __name__ == '__main__':
    app.run(debug=True)
