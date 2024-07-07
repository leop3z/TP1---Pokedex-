document.addEventListener("DOMContentLoaded", () => {
    const team_name_input = document.getElementById('team-name');
    const create_team_button = document.getElementById('create-team');

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
});
