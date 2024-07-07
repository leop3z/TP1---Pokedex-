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

                    const teamHeader = document.createElement('div');
                    teamHeader.classList.add('team-header');

                    const teamNameElement = document.createElement('h2');
                    teamNameElement.textContent = team.name;

                    const deleteTeamButton = document.createElement('button');
                    deleteTeamButton.textContent = 'Eliminar equipo';
                    deleteTeamButton.classList.add('delete-team-button');
                    deleteTeamButton.addEventListener('click', () => {
                        fetch(`/team/${team.id}`, {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        })
                        .then(response => response.json())
                        .then(data => {
                            if (data.message === 'Team and its pokemons deleted successfully') {
                                alert('Equipo y sus Pokémon eliminados');
                                loadTeamsWithPokemons();
                            } else {
                                alert('Error al eliminar el equipo');
                            }
                        })
                        .catch(error => {
                            console.error('Error al eliminar el equipo:', error);
                            alert('Error al eliminar el equipo. Intente de nuevo.');
                        });
                    });

                    teamHeader.appendChild(teamNameElement);
                    teamHeader.appendChild(deleteTeamButton);
                    teamElement.appendChild(teamHeader);

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
                                pokemonImg.classList.add('pokemon-img');
                                pokemonImg.addEventListener('click', () => {
                                    window.location.href = `/pokemon?id=${pokemon.pokemon_id}`;
                                });

                                const pokemonName = document.createElement('p');
                                pokemonName.textContent = pokemonData.name;

                                const removeButton = document.createElement('button');
                                removeButton.textContent = 'X';
                                removeButton.classList.add('remove-button');
                                removeButton.addEventListener('click', () => {
                                    fetch(`/team/${team.id}/pokemon/${pokemon.pokemon_id}`, {
                                        method: 'DELETE',
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                    })
                                    .then(response => response.json())
                                    .then(data => {
                                        if (data.message === 'Pokemon removed from team successfully') {
                                            alert('Pokémon removed from team');
                                            loadTeamsWithPokemons();
                                        } else {
                                            alert('Error removing Pokémon from team');
                                        }
                                    })
                                    .catch(error => {
                                        console.error('Error removing Pokémon from team:', error);
                                        alert('Error removing Pokémon from team. Please try again.');
                                    });
                                });

                                pokemonElement.appendChild(pokemonImg);
                                pokemonElement.appendChild(pokemonName);
                                pokemonElement.appendChild(removeButton);
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