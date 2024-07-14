document.addEventListener("DOMContentLoaded", () => {
    // Profile Section
    const profileForm = document.querySelector('#profile-section form');

    profileForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(profileForm);
        formData.append('action', 'update_profile');

        try {
            const response = await fetch('/trainer', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            if (data.message === 'Profile updated successfully') {
                alert('Profile updated successfully');
                window.location.reload();
                // Recargar la página o actualizar los datos según sea necesario
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Error updating profile. Please try again.');
        }
    });

    // Team Section
    const teamNameInput = document.getElementById('team-name');
    const createTeamButton = document.getElementById('create-team');
    const teamsContainer = document.getElementById('teams-container');

    createTeamButton.addEventListener('click', () => {
        const teamName = teamNameInput.value.trim();
        if (teamName) {
            fetch('/trainer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'create_team',
                    team_name: teamName
                }),
            })
            .then(response => response.json())
            .then(data => {
                if (data.message === 'Team created successfully') {
                    alert('Team created successfully');
                    loadTeamsWithPokemons(); // Cargar equipos después de crear uno nuevo
                } else if (data.message === 'Team name already exists') {
                    alert('Team name already exists. Please choose a different name.');
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

    // Función para cargar equipos con sus Pokémon en la página de perfil
    function loadTeamsWithPokemons() {
        fetch('/teams_with_pokemons')
        .then(response => response.json())
        .then(teams => {
            teamsContainer.innerHTML = '';
            teams.forEach(team => {
                const teamElement = document.createElement('div');
                teamElement.classList.add('team');

                const teamHeader = document.createElement('div');
                teamHeader.classList.add('team-header');

                const editTeamNameButton = document.createElement('button');
                editTeamNameButton.textContent = 'Edit Team Name';
                editTeamNameButton.classList.add('edit-team-name-button');
                editTeamNameButton.addEventListener('click', () => {
                    const newTeamName = prompt('Enter new team name:');
                    if (newTeamName) {
                        fetch(`/trainer/${team.id}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ name: newTeamName }),
                        })
                        .then(response => response.json())
                        .then(data => {
                            if (data.message === 'Team name updated successfully') {
                                alert('Team name updated successfully');
                                loadTeamsWithPokemons();
                            } else {
                                alert('Error updating team name');
                            }
                        })
                        .catch(error => {
                            console.error('Error updating team name:', error);
                            alert('Error updating team name. Please try again.');
                        });
                    }
                });
                
                const teamNameElement = document.createElement('h2');
                teamNameElement.textContent = team.name;

                const pokemonCount = document.createElement('span');
                pokemonCount.classList.add('pokemon-count');
                pokemonCount.textContent = `(${team.pokemons.length}/6)`;

                const deleteTeamButton = document.createElement('button');
                deleteTeamButton.textContent = 'Delete Team';
                deleteTeamButton.classList.add('delete-team-button');
                deleteTeamButton.addEventListener('click', () => {
                    fetch(`/trainer/${team.id}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.message === 'Team and its pokemons deleted successfully') {
                            alert('Team and its Pokémon deleted');
                            loadTeamsWithPokemons();
                        } else {
                            alert('Error deleting the team');
                        }
                    })
                    .catch(error => {
                        console.error('Error deleting the team:', error);
                        alert('Error deleting the team. Please try again.');
                    });
                });

                teamHeader.appendChild(teamNameElement);
                teamHeader.appendChild(pokemonCount);
                teamHeader.appendChild(editTeamNameButton);
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
                            fetch(`/trainer/${team.id}/pokemon/${pokemon.pokemon_id}`, {
                                method: 'DELETE',
                                headers: {
                                    'Content-Type': 'application/json',
                                }
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
                teamsContainer.appendChild(teamElement);
            });
        })
        .catch(err => alert('Error fetching teams with pokemons. Please try again.'));
    }

    loadTeamsWithPokemons(); // Cargar equipos cuando se carga la página por primera vez
});
