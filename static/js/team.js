document.addEventListener("DOMContentLoaded", () => {
    const team_name_input = document.getElementById('team-name');
    const create_team_button = document.getElementById('create-team');
    const teams_container = document.getElementById('teams-container');

    create_team_button.addEventListener('click', () => {
        const team_name = team_name_input.value.trim();
        if (team_name) {
            fetch('/team', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: team_name
                }),
            })
            .then(response => response.json())
            .then(data => {
                if (data.message === 'Team created successfully') {
                    alert('Team created successfully');
                    loadTeamsWithPokemons();
                } else {
                    alert('Error creating team. Please try again.');
                }
            })
            .catch(error => {
                console.error('Error creating team:', error);
                alert('Error creating team. Please try again.');
            });
        } else {
            alert('Please provide a team name');
        }
    });

    function loadTeamsWithPokemons() {
        fetch('/teams_with_pokemons')
            .then(response => response.json())
            .then(teams => {
                teams_container.innerHTML = '';
                teams.forEach(team => {
                    const teamElement = document.createElement('div');
                    teamElement.classList.add('team');

                    const teamNameElement = document.createElement('h2');
                    teamNameElement.textContent = team.name;
                    teamElement.appendChild(teamNameElement);

                    const pokemonsContainer = document.createElement('div');
                    pokemonsContainer.classList.add('pokemons-container');
                    team.pokemons.forEach(pokemon => {
                        fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.pokemon_id}`)
                            .then(response => response.json())
                            .then(pokemonData => {
                                const pokemonElement = document.createElement('div');
                                pokemonElement.classList.add('pokemon');

                                const pokemonImg = document.createElement('img');
                                pokemonImg.src = pokemonData.sprites.front_default;
                                pokemonImg.alt = pokemonData.name;

                                const pokemonName = document.createElement('p');
                                pokemonName.textContent = pokemonData.name;

                                pokemonElement.appendChild(pokemonImg);
                                pokemonElement.appendChild(pokemonName);
                                pokemonsContainer.appendChild(pokemonElement);
                            })
                            .catch(err => console.error('Error fetching Pokémon data:', err));
                    });
                    teamElement.appendChild(pokemonsContainer);
                    teams_container.appendChild(teamElement);
                });
            })
            .catch(err => console.error('Error fetching teams with pokemons:', err));
    }

    loadTeamsWithPokemons();
});
