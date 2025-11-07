    // === Protección y bienvenida de usuario ===
    document.addEventListener('DOMContentLoaded', () => {
        const loggedIn = sessionStorage.getItem('loggedIn');
        if (loggedIn !== 'true') {
            alert('Debes iniciar sesión primero');
            window.location.href = 'registro.html';
            return;
        }

        const user = JSON.parse(sessionStorage.getItem('loggedUser'));

        // Mensaje en navbar
        const welcomeMsg = document.createElement('span');
        welcomeMsg.classList.add('navbar-user');
        welcomeMsg.style.marginRight = '10px';
        welcomeMsg.style.fontWeight = '600';
        welcomeMsg.style.color = '#fff';

        if (user && user.name) {
            welcomeMsg.textContent = `Bienvenido, ${user.name}`;
            document.getElementById('welcomeUser').textContent = `Bienvenido, ${user.name}`;
        } else {
            welcomeMsg.textContent = 'Bienvenido al panel';
            document.getElementById('welcomeUser').textContent = 'Bienvenido al panel';
        }

        // Botón de cerrar sesión (idéntico a los demás)
        const logoutBtn = document.createElement('a');
        logoutBtn.textContent = 'Cerrar sesión';
        logoutBtn.href = '#';
        logoutBtn.classList.add('navbar-button');
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            sessionStorage.removeItem('loggedIn');
            sessionStorage.removeItem('loggedUser');
            window.location.href = 'registro.html';
        });

        const navbarActions = document.querySelector('.navbar-actions');
        if (navbarActions) {
            navbarActions.innerHTML = '';
            navbarActions.appendChild(welcomeMsg);
            navbarActions.appendChild(logoutBtn);
        }
    });

    // === Función de pestañas ===
    function switchTab(tabName) {
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(tabName + '-tab').classList.add('active');
        document.querySelectorAll('.tab-btn').forEach(btn => {
            if (btn.textContent.toLowerCase().includes(tabName)) {
                btn.classList.add('active');
            }
        });
    }