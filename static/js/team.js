// Se ejecuta una vez cargado lo demás 
document.addEventListener("DOMContentLoaded", () => {
    const pokemon_select = document.getElementById('pokemon-select');
    const pokemon_details = document.getElementById('pokemon-details');
    const team_list = document.getElementById('team-list');
   
    const team_name_import = document.getElementById('team-name');
    const save_btn_team = document.getElementById('save-team');
    
    
    const MAX_TEAM_SIZE = 6;
    let team = [];


    // Recordar que => me ayuda a crear la función a continuación, si la creaba por fuera no funcionaba 

    // Obtener la lista de nombres de Pokemon desde la PokeAPI
    fetch('https://pokeapi.co/api/v2/pokemon?limit=151')
        .then(response => response.json())  // Lo paso a formato JSON
        .then(data => {
            // Iterar sobre los resultados y agregar opciones al selector
            data.results.forEach(pokemon => {
                const option = document.createElement('option');
                option.value = pokemon.name;
                // Nombre del pokemon, con la primera letra mayus, el resto normal (slice, desde la segunda letra hacia adelante)
                option.textContent = pokemon.name[0].toUpperCase() + pokemon.name.slice(1);
                pokemon_select.appendChild(option);
            });
        })

        pokemon_select.addEventListener('change', () => {
            const selected_pokemon = pokemon_select.value;
            // Confirma que tiene algún valor dentro
            if (selected_pokemon) {
                display_pokemon_details(selected_pokemon);
            } 
        }
    );

    // Mostrar Sprite del pokemon, nombre y boton para agregar al equipo
    function display_pokemon_details(pokemonName) {
        // Obtener detalles del Pokémon seleccionado
        fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
            .then(response => response.json())
            .then(pokemon => {
                // URL del sprite 
                const pokemon_image = pokemon.sprites.front_default;
                const pokemon_HTML = `
                    <p>Name: ${pokemon.name}</p>
                    <img src="${pokemon_image}" alt="${pokemon.name}">
                `;
                // Mostrar el HTML generado
                pokemon_details.innerHTML = pokemon_HTML;

                // Mostrar botón para agregar al equipo si aún no está en el equipo
                const add_team_button = document.createElement('button');
                add_team_button.textContent = 'Add to Team';
                add_team_button.addEventListener('click', () => add_to_team(pokemon)); // Aca se maneja distinto por el parametro
                pokemon_details.appendChild(add_team_button);
            }
        )
    }

    // Boton de agregar al equipo
    function add_to_team(pokemon) {
        if (team.length < MAX_TEAM_SIZE) {
            team.push(pokemon);
            display_team();
        }
        else {
            alert('Your team is full.');
        }
    }

    // Mostrar el equipo
    function display_team() {
        team_list.innerHTML = '';
        team.forEach(pokemon => {
            const list_item = document.createElement('li');
            list_item.textContent = pokemon.name.toUpperCase();

            // Btn para eliminar del equipo
            const remove_button = document.createElement('button');
            remove_button.textContent = 'Remove';
            remove_button.addEventListener('click', () => remove_from_team(pokemon.id));

            list_item.appendChild(remove_button);
            team_list.appendChild(list_item);
        });
    }

    // Btn remover
    function remove_from_team(pokemonId) {
        // Borra de acuerdo al id especificado
        team = team.filter(p => p.id !== pokemonId);
        display_team();
    }


    
    // Guardar el equipo en la base de datos
    save_btn_team.addEventListener('click', () => {
        const team_name = team_name_import.value.trim();
        if (team.length > 0 && team_name) {
            fetch('/team', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: team_name,
                    pokemon_data: team.map(pokemon => ({ id: pokemon.id, name: pokemon.name })),
                }),
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Team saved successfully');
                } else {
                    alert('Error saving team. Please try again.');
                }
            })
            .catch(error => {
                console.error('Error saving team:', error);
                alert('Error saving team. Please try again.');
            });
        } else {
            alert('Your team is empty or team name is not provided');
        }
    });

    function import_team() {
        const team_name = team_name_import.value.trim();
        if (team_name) {
            fetch(`/team?name=${team_name}`)
                .then(response => response.json())
                .then(data => {
                    if (data.pokemon_data) {
                        team = data.pokemon_data;
                        display_team();
                    } else {
                        alert('Team not found. Please try again.');
                    }
                })
                .catch(error => {
                    console.error('Error importing team:', error);
                    alert('Error importing team. Please try again.');
                });
        } else {
            alert('Please provide a team name to import');
        }
    }

    document.querySelector('.team-name button').addEventListener('click', import_team);
});
