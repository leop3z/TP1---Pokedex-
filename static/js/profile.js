document.addEventListener("DOMContentLoaded", () => {
    const profileForm = document.getElementById('profile-form');

    profileForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(profileForm);

        try {
            const response = await fetch('/profile', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            if (data.success) {
                alert('Profile updated successfully');
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Error updating profile. Please try again.');
        }
    });
});