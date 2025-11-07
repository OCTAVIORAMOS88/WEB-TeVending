
        // Lógica para enviar formulario de contacto
        const contactForm = document.getElementById('contactForm');
        const contactSubmitBtn = document.getElementById('contactSubmitBtn');
        const contactMessage = document.getElementById('contactMessage');

        if (contactForm) {
            contactForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                // Limpiar mensajes anteriores
                contactMessage.style.display = 'none';
                contactMessage.className = 'contact-message';
                
                const formData = {
                    name: document.getElementById('name').value,
                    email: document.getElementById('email').value,
                    phone: document.getElementById('phone').value,
                    service: document.getElementById('service').value,
                    message: document.getElementById('message').value
                };

                try {
                    // Mostrar estado de carga
                    setLoading(contactSubmitBtn, true);
                    
                    const response = await fetch('http://localhost:3000/api/contact', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(formData)
                    });

                    const data = await response.json();

                    if (data.success) {
                        contactMessage.textContent = '¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.';
                        contactMessage.className = 'contact-message contact-success';
                        contactMessage.style.display = 'block';
                        contactForm.reset();
                    } else {
                        contactMessage.textContent = 'Error al enviar el mensaje. Inténtalo de nuevo.';
                        contactMessage.className = 'contact-message contact-error';
                        contactMessage.style.display = 'block';
                    }
                } catch (error) {
                    console.error('Error al enviar el formulario:', error);
                    contactMessage.textContent = 'Error de conexión con el servidor. Asegúrate de que el backend esté corriendo.';
                    contactMessage.className = 'contact-message contact-error';
                    contactMessage.style.display = 'block';
                } finally {
                    setLoading(contactSubmitBtn, false);
                }
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

        // Lógica de pestañas para productos
        const tabButtons = document.querySelectorAll('.tab-button');
        const tabContents = document.querySelectorAll('.tab-content');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.getAttribute('data-tab');
                
                // Remover clase active de todos los botones y contenidos
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                // Agregar clase active al botón clickeado y su contenido correspondiente
                button.classList.add('active');
                document.getElementById(tabId).classList.add('active');
            });
        });
