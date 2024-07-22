document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const param = urlParams.get('id');

    const urlPokemons = `https://pokeapi.co/api/v2/pokemon/${param}`;
    const urlInfoPokemons = `https://pokeapi.co/api/v2/pokemon-species/${param}`;

    function loadPokemonDetails() {
        fetch(urlPokemons)
            .then(response => response.json())
            .then(pokemon => {
                const pokemonId = pokemon.id;
                fetch(urlInfoPokemons)
                    .then(response => response.json())
                    .then(speciesData => {
                        const pokemonData = {
                            id: pokemon.id,
                            name: pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1),
                            imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`,
                            height: pokemon.height / 10,
                            weight: pokemon.weight / 10,
                            types: pokemon.types.map(type => type.type.name),
                            description: speciesData.flavor_text_entries.find(entry => entry.language.name === 'en').flavor_text,
                            stats: pokemon.stats.map(stat => ({ name: stat.stat.name, base_stat: stat.base_stat }))
                        };
                        createPokemon(pokemonData);
                        createPokemonTable(pokemonData);
                        addEventListeners(pokemonId);

                    })
                    .catch(error => {
                        console.error('Error fetching species data:', error);
                        alert('Failed to load Pokémon details. Please try again.');
                    });
            })
            .catch(error => {
                console.error('Error fetching Pokémon data:', error);
                alert('Failed to load Pokémon details. Please try again.');
            });   
    }

    function createPokemon(pokemon) {
        const container = document.getElementById('pokemon_container');
        if (!container) {
            console.error('Pokemon container not found.');
        }
        container.innerHTML = `
            <div class="container">
                <div class="pokemon_header">
                    <div class="pokemon_id">
                        <h2>#${pokemon.id}</h2>
                    </div>
                    <h1 class="pokemon_name">${pokemon.name}</h1>
                    <div class="pokemon_img">
                        <img id="pokemon_image" src="${pokemon.imageUrl}" alt="${pokemon.name}">
                    </div>
                </div>
                <div class="pokemon_content">
                    <div class="pokemon_description">${pokemon.description}</div>
                    <div class="pokemon_features">
                        <div class="pokemon_height">Height: ${pokemon.height}m</div>
                        <div class="pokemon_weight">Weight: ${pokemon.weight}kg</div>
                    </div>
                    
                    <div class="pokemon_types" id="pokemon_types">
                        <div clas="pokemon_type" >
                            ${pokemon.types.map(type => `<img class="type-icon ${type}" src="/static/img/types/${type}.svg" alt="${type}">`).join('')}
                        </div>
                    </div>
                    
                    <div class="table">
                        <div class="pokemon_table" id="pokemon_table">
                            <!-- Aquí va la tabla con más detalles  -->
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function createPokemonTable(pokemon) {
        const table = document.getElementById('pokemon_table');
        if (!table) {
            console.error('Pokemon table not found.');
        }
        const tableHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Stats</th>
                        <th>Base Stat</th>
                    </tr>
                </thead>
                <tbody>
                    ${pokemon.stats.map(stat => `
                        <tr>
                            <td>${stat.name}</td>
                            <td>${stat.base_stat}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        table.innerHTML = tableHTML;
    }
    
    function createPokemonTable(pokemon) {
        const table = document.getElementById('pokemon_table');
        if (!table) {
            console.error('Pokemon table not found.');
            return;
        }
        const tableHTML = `
            <table>
                <tr>
                    <th>Stats</th>
                    <th>Base Stat</th>
                </tr>
                ${pokemon.stats.map(stat => `
                    <tr>
                        <td>${stat.name}</td>
                        <td>${stat.base_stat}</td>
                    </tr>
                `).join('')}
            </table>
        `;
        table.innerHTML = tableHTML;
    }

    function loadTeamsDropdown() {
        fetch('/teams_with_pokemons')
            .then(response => response.json())
            .then(teams => {
                const dropdown = document.getElementById('team-dropdown');
                dropdown.innerHTML = '';
                if (teams.length === 0) {
                    const option = document.createElement('option');
                    option.value = '';
                    option.textContent = 'No teams available';
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
    }

    function addEventListeners(pokemonId) {
        document.getElementById('add-to-team').addEventListener('click', () => {
            const selectedTeamId = document.getElementById('team-dropdown').value;
            if (selectedTeamId) {
                fetch(`/trainer/${selectedTeamId}/pokemon`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        pokemon_id: pokemonId
                    }),
                })
                .then(response => response.json())
                .then(data => {
                    if (data.message === 'Pokemon added to team successfully') {
                        alert('Pokémon added to the team');
                    } else if (data.message === 'Team already has 6 pokemons') {
                        alert('The team already has 6 Pokémon. No more can be added.');
                    } else {
                        alert('Error adding Pokémon to the team');
                    }
                })
                .catch(error => {
                    console.error('Error adding Pokémon to the team:', error);
                    alert('Error adding Pokémon to the team. Please try again.');
                });
            } else {
                alert('Select a team to add the Pokémon');
            }
        });

        document.getElementById('remove-from-team').addEventListener('click', () => {
            const selectedTeamId = document.getElementById('team-dropdown').value;
            if (selectedTeamId) {
                fetch(`/trainer/${selectedTeamId}/pokemon/${pokemonId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                .then(response => response.json())
                .then(data => {
                    if (data.message === 'Pokemon removed from team successfully') {
                        alert('Pokémon removed from the team');
                    } else {
                        alert('Error removing Pokémon from the team');
                    }
                })
                .catch(error => {
                    console.error('Error removing Pokémon from the team:', error);
                    alert('Error removing Pokémon from the team. Please try again.');
                });
            } else {
                alert('Select a team to remove the Pokémon');
            }
        });
    }


    // Cargar detalles del Pokémon y el dropdown de equipos
    loadPokemonDetails();
    loadTeamsDropdown();
});