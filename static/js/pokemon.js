document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const pokemonId = urlParams.get('id');

    const urlPokemons = `https://pokeapi.co/api/v2/pokemon/${pokemonId}`;
    const urlInfoPokemons = `https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`;

    function loadPokemonDetails() {
        fetch(urlPokemons)
            .then(response => response.json())
            .then(pokemon => {
                const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;
                document.getElementById('pokemon_image').src = imageUrl;
                document.getElementById('pokemon_name').innerText = pokemon.name;
                document.getElementById('pokemon_id').innerText = `ID: ${pokemon.id}`;
                document.getElementById('pokemon_height').innerText = `Height: ${pokemon.height / 10}m`;
                document.getElementById('pokemon_weight').innerText = `Weight: ${pokemon.weight / 10}kg`;

                const types = pokemon.types.map(type => type.type.name).join(' , ');
                document.getElementById('pokemon_types').innerText = 'Types: ' + types;

                createPokemonTable(pokemon);

                fetch(urlInfoPokemons)
                    .then(response => response.json())
                    .then(speciesData => {
                        const descriptionEntry = speciesData.flavor_text_entries.find(entry => entry.language.name === 'en');
                        const description = descriptionEntry ? descriptionEntry.flavor_text : 'No description available.';
                        document.getElementById('pokemon_description').innerText = description;
                    });
            });
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

    function addEventListeners() {
        document.getElementById('add-to-team').addEventListener('click', () => {
            const selectedTeamId = document.getElementById('team-dropdown').value;
            if (selectedTeamId) {
                fetch(`/team/${selectedTeamId}/pokemon`, {
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
                fetch(`/team/${selectedTeamId}/pokemon/${pokemonId}`, {
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

    // Cargar detalles del Pokémon y el dropdown de equipos
    loadPokemonDetails();
    loadTeamsDropdown();
    addEventListeners();
});