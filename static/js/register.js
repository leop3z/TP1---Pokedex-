document.getElementById('register-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: username,
            password: password,
        }),
    })
    .then(response => response.json())
    .then(data => {
        const messageDiv = document.getElementById('message');
        if (data.message === 'User registered successfully') {
            messageDiv.style.color = 'green';
            messageDiv.textContent = 'User registered successfully';
        } else {
            messageDiv.style.color = 'red';
            messageDiv.textContent = data.message;
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});