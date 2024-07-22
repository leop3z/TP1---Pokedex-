document.addEventListener("DOMContentLoaded", () => {
    // Función para cargar equipos con sus Pokémon en la página de detalles del entrenador
    function loadTeamsWithPokemons() {
        fetch(window.location.pathname + '/teams_with_pokemons')
        .then(response => response.json())
        .then(teams => {
            const teamsContainer = document.getElementById('teams-container');
            teamsContainer.innerHTML = '';
            teams.forEach(team => {
                const teamElement = document.createElement('div');
                teamElement.classList.add('team');

                const teamHeader = document.createElement('div');
                teamHeader.classList.add('team-header');

                const teamNameElement = document.createElement('h2');
                teamNameElement.textContent = team.name;

                const pokemonCount = document.createElement('span');
                pokemonCount.classList.add('pokemon-count');
                pokemonCount.textContent = `${team.pokemons.length}/6`;

                teamHeader.appendChild(teamNameElement);
                teamHeader.appendChild(pokemonCount);
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

                        const pokemonName = document.createElement('p');
                        pokemonName.textContent = pokemonData.name;

                        pokemonElement.appendChild(pokemonImg);
                        pokemonElement.appendChild(pokemonName);
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