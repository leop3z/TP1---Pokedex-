// Obtener la lista de equipos y llenar el dropdown
fetch('/teams')
    .then(response => response.json())
    .then(teams => {
        const dropdown = document.getElementById('team-dropdown');
        dropdown.innerHTML = '';
        if (teams.length === 0) {
            const option = document.createElement('option');
            option.value = '';
            option.textContent = 'Create teams';
            dropdown.appendChild(option);
        } else {
            teams.forEach(team => {
                const option = document.createElement('option');
                option.value = team.id;
                option.textContent = team.name;
                dropdown.appendChild(option);
            });
        }
    })
    .catch(err => console.error('Error fetching teams:', err));

function data_pokemon(response) {
    return response.json();
}

function create_pokemon(pokemons) {
    const pokemonList = document.querySelector(".list_pokemons");

    pokemons.results.forEach((pokemon, i) => {
        const container = document.createElement("div");
        container.setAttribute("class", "pokemon_container");

        const pokemon_content = document.createElement("div");
        pokemon_content.setAttribute("class", "pokemon_content");

        const imagen_pokemon = document.createElement("div");
        imagen_pokemon.setAttribute("class", "pokemon_img");

        const img = document.createElement("img");
        img.setAttribute("class", "imagen_previa");
        img.setAttribute("src", `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${i + 1}.png`);
        img.setAttribute("alt", pokemon.name);

        const info_pokemon = document.createElement("div");
        info_pokemon.setAttribute("class", "pokemon_info");

        const nombre_contenedor = document.createElement("div");
        nombre_contenedor.setAttribute("class", "nombre_contenedor");

        const pokemon_id = document.createElement("p");
        pokemon_id.setAttribute("id", "pokemon_id");
        pokemon_id.textContent = `#${i + 1}`;

        const card_title = document.createElement("h3");
        card_title.setAttribute("id", "card_title");
        card_title.textContent = pokemon.name.toUpperCase();

        const pokemon_buttons = document.createElement("div");
        pokemon_buttons.setAttribute("class", "pokemon_buttons");

        const agregar_equipo = document.createElement("button");
        agregar_equipo.setAttribute("class", "btn agregar_equipo");
        agregar_equipo.textContent = "Add to the team";

        agregar_equipo.addEventListener("click", () => {
            const selected_team_id = document.getElementById('team-dropdown').value;
            if (selected_team_id) {
                fetch(`/team/${selected_team_id}/pokemon`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        pokemon_id: i + 1
                    }),
                })
                .then(response => response.json())
                .then(data => {
                    if (data.message === 'Pokemon added to team successfully') {
                        alert('Pokémon added to the team');
                    } else {
                        alert('Error adding Pokémon to the team');
                    }
                })
                .catch(error => {
                    console.error('Error adding Pokémon to the team: ', error);
                    alert('Error adding Pokémon to the team. Please try again.');
                });
            } else {
                alert('Select a team to add the Pokémon');
            }
        });

        const ver_stats = document.createElement("button");
        ver_stats.setAttribute("class", "btn ver_estadisticas");
        ver_stats.textContent = "View Stats";

        ver_stats.addEventListener("click", () => {
            window.location.href = `/pokemon?id=${i + 1}`;
        });

        pokemon_buttons.append(agregar_equipo, ver_stats);
        imagen_pokemon.append(img);
        nombre_contenedor.append(pokemon_id, card_title);
        info_pokemon.append(nombre_contenedor, pokemon_buttons);
        pokemon_content.append(imagen_pokemon, info_pokemon);
        container.append(pokemon_content);
        pokemonList.append(container);
    });
}

fetch('https://pokeapi.co/api/v2/pokemon?limit=151')
    .then(data_pokemon)
    .then(create_pokemon)
    .catch(err => console.error(err));

