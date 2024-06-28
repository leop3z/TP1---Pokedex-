function create_pokemon(pokemons, clearList) {
    const pokemonList = document.querySelector(".list_pokemons");

    // Limpiar la lista de pokemones si clearList es true
    if (clearList) {
        pokemonList.innerHTML = '';
    }

    pokemons.results.forEach((pokemon) => {
        // Crear contenedor de la carta del Pokémon
        const container = document.createElement("div");
        container.setAttribute("class", "pokemon_container");

        const pokemon_content = document.createElement("div");
        pokemon_content.setAttribute("class", "pokemon_content");

        // Imagen de los pokemones
        const image_pokemon = document.createElement("div");
        image_pokemon.setAttribute("class", "pokemon_img");

        const img = document.createElement("img");
        img.setAttribute("class", "imagen_previa");
        img.setAttribute("src", `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`);
        img.setAttribute("alt", pokemon.name);

        // info de los pokes
        const info_pokemon = document.createElement("div");
        info_pokemon.setAttribute("class", "pokemon_info");

        const name_container = document.createElement("div");
        name_container.setAttribute("class", "name_container");

        const pokemon_id = document.createElement("p");
        pokemon_id.setAttribute("id", "pokemon_id");
        pokemon_id.textContent = `#${pokemon.id}`;

        const card_title = document.createElement("h3");
        card_title.setAttribute("id", "card_title");
        card_title.textContent = pokemon.name.toUpperCase();

        // Tipos de pokemones
        const pokemon_type = document.createElement("div");
        pokemon_type.setAttribute("class", "pokemon_types");

        const type = document.createElement("p");
        type.textContent = pokemon.types;

        // Creo los botones
        const pokemon_buttons = document.createElement("div");
        pokemon_buttons.setAttribute("class", "pokemon_buttons");

        const add_team = document.createElement("button");
        add_team.setAttribute("class", "btn agregar_equipo");
        add_team.textContent = 'Agregar al equipo';

        const stats = document.createElement("button");
        stats.setAttribute("class", "btn ver_estadisticas");
        stats.textContent = "Ver estadisticas";

        pokemon_buttons.append(add_team, stats);
        image_pokemon.append(img);
        pokemon_type.append(type);
        name_container.append(pokemon_id);
        name_container.append(card_title);
        info_pokemon.append(name_container);
        info_pokemon.append(pokemon_buttons, pokemon_type);
        pokemon_content.append(image_pokemon);
        pokemon_content.append(info_pokemon);
        container.append(pokemon_content);
        pokemonList.append(container);
    });
}


fetch('https://pokeapi.co/api/v2/pokemon?limit=151')
    .then(response => response.json())
    .then(data => {
        info_pokemon = data.results.map((pokemon, index) => ({ ...pokemon, id: index + 1 }));
        create_pokemon({ results: info_pokemon });
    })
    .catch(err => console.error(err));

const input = document.getElementById("search-id");
const button = document.querySelector(".search_id")

function search_pokemon(event) {
    event.preventDefault() //Previene que se recargue la pagina
    const search_id = parseInt(input.value)
    console.log(`El id obtenido es: ${search_id}`)
    const pokemon_filtered = info_pokemon.filter(pokemon => pokemon.id === search_id)
    create_pokemon({ results: pokemon_filtered }, true)
}

button.addEventListener("click", search_pokemon);
