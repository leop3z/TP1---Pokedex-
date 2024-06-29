document.addEventListener("DOMContentLoaded", () => {
    // Obtener el ID(Nombre o n° pokedex) del Pokemon de los parámetros de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const pokemonId = urlParams.get('id');

    // URL para obtener los datos del Pokémon
    const urlPokemons = `https://pokeapi.co/api/v2/pokemon/${pokemonId}`;
    const urlInfoPokemons = `https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`;

    // Hacer la solicitud a la POKEAPI para obtener los datos del Pokémon
    fetch(urlPokemons)
        .then(response => response.json())
        .then(pokemon => {
            // Construir la URL completa de la imagen del Pokémon
            const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;

            // Asignar la URL de la imagen al elemento de la imagen
            document.getElementById('pokemon_image').src = imageUrl;

            // Asignar otros detalles del Pokemon
            document.getElementById('pokemon_name').innerText = pokemon.name;
            document.getElementById('pokemon_height').innerText = `Height: ${pokemon.height / 10}m`;
            document.getElementById('pokemon_weight').innerText = `Weight: ${pokemon.weight / 10}kg`;

            // Mostrar los tipos del Pokemon
            const types = pokemon.types.map(type => type.type.name).join(', ');
            document.getElementById('pokemon_types').innerText = types;

            // Crear una tabla con los detalles de las estadísticas del Pokémon
            createPokemonTable(pokemon);

            // Obtener la descripción del Pokémon desde la POKEAPI de especies
            fetch(urlInfoPokemons)
                .then(response => response.json())
                .then(speciesData => {
                    const descriptionEntry = speciesData.flavor_text_entries.find(entry => entry.language.name === 'en');
                    const description = descriptionEntry ? descriptionEntry.flavor_text : 'No description available.';
                    document.getElementById('pokemon_description').innerText = description;
                });
        })
    
    // Ayuda extrema de videos, tutoriales y chat (explote con ese JS en general)
    function createPokemonTable(pokemon) {
        const table = document.getElementById('pokemon_table');
        const tableHTML = `
            <table>
                <tr>
                    <th>Stats</th>
                    <th>Base Stat</th>
                </tr>
                ${pokemon.stats.map(stat => `
                    <tr>
                        <td>${stat.stat.name}</td>
                        <td>${stat.base_stat}</td>
                    </tr>
                `).join('')}
            </table>
        `;
        table.innerHTML = tableHTML;
    }
});
