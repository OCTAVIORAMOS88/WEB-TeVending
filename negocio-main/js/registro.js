// registro.js
// Elementos del DOM
const tabLogin = document.getElementById('tabLogin');
const tabRegister = document.getElementById('tabRegister');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const loginSubmitBtn = document.getElementById('loginSubmitBtn');
const registerSubmitBtn = document.getElementById('registerSubmitBtn');

// Tabs
tabLogin.addEventListener('click', () => {
    tabLogin.classList.add('active');
    tabRegister.classList.remove('active');
    loginForm.classList.add('active');
    registerForm.classList.remove('active');
    clearMessages();
});

tabRegister.addEventListener('click', () => {
    tabRegister.classList.add('active');
    tabLogin.classList.remove('active');
    registerForm.classList.add('active');
    loginForm.classList.remove('active');
    clearMessages();
});

// Función para limpiar mensajes de error
function clearMessages() {
    const errorMessages = document.querySelectorAll('.error-message');
    const successMessages = document.querySelectorAll('.success-message');
    
    errorMessages.forEach(msg => {
        msg.style.display = 'none';
        msg.textContent = '';
    });
    
    successMessages.forEach(msg => {
        msg.style.display = 'none';
        msg.textContent = '';
    });
}

// Función para mostrar/ocultar loading
function setLoading(button, isLoading) {
    const btnText = button.querySelector('.btn-text');
    const btnLoading = button.querySelector('.btn-loading');

    if (isLoading) {
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline';
        button.classList.add('loading');
    } else {
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
        button.classList.remove('loading');
    }
}

// Registro - AHORA CON BACKEND (JSON)
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearMessages();

    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim().toLowerCase();
    const password = document.getElementById('regPassword').value;

    // Validación básica
    if (!name || !email || !password) {
        document.getElementById('registerGeneralError').textContent = 'Todos los campos son obligatorios';
        document.getElementById('registerGeneralError').style.display = 'block';
        return;
    }

    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        document.getElementById('regEmailError').textContent = 'Por favor ingresa un email válido';
        document.getElementById('regEmailError').style.display = 'block';
        return;
    }

    try {
        setLoading(registerSubmitBtn, true);

        const response = await fetch('http://localhost:3000/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (data.success) {
            document.getElementById('registerSuccess').textContent = 'Usuario registrado correctamente. ¡Ahora puedes iniciar sesión!';
            document.getElementById('registerSuccess').style.display = 'block';
            registerForm.reset();
            setTimeout(() => {
                tabLogin.click(); // Cambiar a Login después de un breve retraso
            }, 1500);
        } else {
            document.getElementById('registerGeneralError').textContent = 'Error en el registro: ' + data.message;
            document.getElementById('registerGeneralError').style.display = 'block';
        }
    } catch (error) {
        console.error('Error de red:', error);
        document.getElementById('registerGeneralError').textContent = 'Error de conexión con el servidor. Asegúrate de que el backend esté corriendo.';
        document.getElementById('registerGeneralError').style.display = 'block';
    } finally {
        setLoading(registerSubmitBtn, false);
    }
});

// Login + Redirección - AHORA CON BACKEND (JSON)
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearMessages();

    const email = document.getElementById('loginEmail').value.trim().toLowerCase();
    const password = document.getElementById('loginPassword').value;

    // Validación básica
    if (!email || !password) {
        document.getElementById('loginGeneralError').textContent = 'Todos los campos son obligatorios';
        document.getElementById('loginGeneralError').style.display = 'block';
        return;
    }

    try {
        setLoading(loginSubmitBtn, true);

        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (data.success) {
            // Guardar solo información básica en sessionStorage (no localStorage)
            sessionStorage.setItem('loggedIn', 'true');
            sessionStorage.setItem('loggedUser', JSON.stringify(data.user));
            document.getElementById('loginGeneralError').style.display = 'none';
            window.location.href = './dashboard.html';
        } else {
            document.getElementById('loginGeneralError').textContent = data.message;
            document.getElementById('loginGeneralError').style.display = 'block';
        }
    } catch (error) {
        console.error('Error de red:', error);
        document.getElementById('loginGeneralError').textContent = 'Error de conexión con el servidor. Asegúrate de que el backend esté corriendo.';
        document.getElementById('loginGeneralError').style.display = 'block';
    } finally {
        setLoading(loginSubmitBtn, false);
    }
});

// Verificar si ya está logueado
document.addEventListener('DOMContentLoaded', () => {
    const loggedIn = sessionStorage.getItem('loggedIn');
    if (loggedIn === 'true') {
        // Si ya está logueado, redirigir al dashboard
        window.location.href = './dashboard.html';
    }
});
