function data_pokemon(response) {
    return response.json();
}

function create_pokemon(pokemons) {
    const pokemonList = document.querySelector(".list_pokemons")

    pokemons.results.forEach((pokemon, i) => {
        // Crear contenedor de la carta del Pokémon

        const container = document.createElement("div")
        container.setAttribute("class", "pokemon_container")

        const pokemon_content = document.createElement("div")
        pokemon_content.setAttribute("class", "pokemon_content")

        // Imagen de los pokemones

        const imagen_pokemon = document.createElement("div")
        imagen_pokemon.setAttribute("class", "pokemon_img")

        const img = document.createElement("img")
        img.setAttribute("class", "imagen_previa")
        img.setAttribute("src", `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${i+1}.png`)
        img.setAttribute("alt", pokemon.name)

        // info de los pokes

        const info_pokemon = document.createElement("div")
        info_pokemon.setAttribute("class", "pokemon_info")
        
        const nombre_contenedor = document.createElement("div")
        nombre_contenedor.setAttribute("class", "nombre_contenedor")

        const pokemon_id = document.createElement("p")
        pokemon_id.setAttribute("id", "pokemon_id")
        pokemon_id.textContent = `#${i+1}`

        const card_title = document.createElement("h3")
        card_title.setAttribute("id", "card_title")
        card_title.textContent = pokemon.name.toUpperCase()

        //Tipos de pokemones

        const tipo_pokemon = document.createElement("div")
        tipo_pokemon.setAttribute("class","pokemon_tipos")
        
        const tipo = document.createElement("p")
        tipo.textContent = pokemon.types

        // Creo los botones
        const pokemon_buttons = document.createElement("div")
        pokemon_buttons.setAttribute("class", "pokemon_buttons")

        const agregar_equipo = document.createElement("button")
        agregar_equipo.setAttribute("class", "btn agregar_equipo")
        agregar_equipo.textContent = "Agregar al equipo"

        const ver_stats = document.createElement("button")
        ver_stats.setAttribute("class", "btn ver_estadisticas")
        ver_stats.textContent = "Ver estadisticas"
        
        // Agregamos el evento clic para redirigir al usuario
        // Forma más concisa de definir funciones en JS, utilizando:
        // la sintaxis (params) => { cuerpo de la función }
        // P.D: Intente definir una función afuera, pero no me funcionaba, buscando encontré esto
        // Funcionó así que así quedo
        ver_stats.addEventListener("click", () => {
            window.location.href = `/pokemon?id=${i + 1}`;
        });

        pokemon_buttons.append(agregar_equipo,ver_stats)
        imagen_pokemon.append(img)
        tipo_pokemon.append(tipo)
        nombre_contenedor.append(pokemon_id)
        nombre_contenedor.append(card_title)
        info_pokemon.append(nombre_contenedor)
        info_pokemon.append(pokemon_buttons, tipo_pokemon)
        pokemon_content.append(imagen_pokemon)
        pokemon_content.append(info_pokemon)
        container.append(pokemon_content)
        pokemonList.append(container)
    })
}
const info_pokemon = fetch('https://pokeapi.co/api/v2/pokemon?limit=151')
    .then(data => data.json())
    .then(create_pokemon)
    .catch(err => console.error(err));
