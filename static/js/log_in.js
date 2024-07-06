const user = document.getElementById('input_user')
const pass = document.getElementById('input_password')
const form = document.getElementById('form')
const warning = document.getElementById('error')


form.addEventListener('submit', event => {
    event.preventDefault()
    let error = ""
    let action = false
    warning.innerHTML = ""

    if (user.value.length < 4) {
        error += `El nombre es muy corto <br>`
        action = true
    }
    if (pass.value.length < 4) {
        error += `La contraseña es muy corta <br>`
        action = true
    }
    if(action){
        warning.innerHTML = error
    } else {
        window.location.href = 'index.html'
    }
})
