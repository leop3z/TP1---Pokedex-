document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const pokemonId = urlParams.get('id');
    const urlPokemons = `https://pokeapi.co/api/v2/pokemon/${pokemonId}`;
    const urlInfoPokemons = `https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`;
    const urlImgPokemonFull = "https://assets.pokemon.com/assets/cms2/img/pokedex/full/";

    console.log("Fetching Pokémon data from URL:", urlPokemons);

    fetch(urlPokemons)
        .then(response => {
            console.log("API response status:", response.status);
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log("Pokémon data:", data);
            displayPokemonDetails(data);
            fetchPokemonDescription();
        })
        .catch(error => console.error('Error fetching Pokémon:', error));

    function displayPokemonDetails(pokemon) {
        console.log("Displaying Pokémon details for:", pokemon.name);
        document.getElementById('pokemon_name').innerText = pokemon.name;
        document.getElementById('pokemon_image').src = urlImgPokemonFull + pad(pokemon.id, 3) + '.png';
        document.getElementById('pokemon_height').innerText = `Height: ${pokemon.height / 10}m`;
        document.getElementById('pokemon_weight').innerText = `Weight: ${pokemon.weight / 10}kg`;

        const stats = pokemon.stats.map(stat => ({
            y: stat.base_stat,
            label: stat.stat.name
        }));

        const chart = new CanvasJS.Chart("chartContainer", {
            animationEnabled: true,
            theme: "light1",
            backgroundColor: "transparent",
            axisY: {
                title: "",
            },
            data: [
                {
                    type: "column",
                    dataPoints: stats,
                },
            ],
        });
        chart.render();
    }

    function fetchPokemonDescription() {
        console.log("Fetching Pokémon description from URL:", urlInfoPokemons);
        fetch(urlInfoPokemons)
            .then(response => {
                console.log("API response status:", response.status);
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                console.log("Pokémon description data:", data);
                const description = data.flavor_text_entries.find(entry => entry.language.name === 'en');
                document.getElementById('pokemon_description').innerText = description ? description.flavor_text : 'No description available.';
            })
            .catch(error => console.error('Error fetching Pokémon description:', error));
    }

    function pad(number, length) {
        let str = '' + number;
        while (str.length < length) {
            str = '0' + str;
        }
        return str;
    }
});
