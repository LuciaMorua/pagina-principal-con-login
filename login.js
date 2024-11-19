document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('loginForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Previene el envío del formulario

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        const feedback = document.getElementById('loginFeedback');

        // Verificación básica de campos vacíos
        if (username === '' || password === '') {
            feedback.style.color = 'red';
            feedback.textContent = 'Por favor, completa todos los campos.';
        } else {
            // Simulación de autenticación
            if (username === 'admin' && password === '1234') {
                feedback.style.color = 'green';
                feedback.textContent = 'Iniciando sesión...';

                // Redirección a index.html después de autenticación correcta
                setTimeout(() => {
                    window.location.href = "index.html";
                }, 1000); // Retardo de 1 segundo para mostrar el mensaje antes de redirigir
            } else {
                feedback.style.color = 'red';
                feedback.textContent = 'Usuario o contraseña incorrectos.';
            }
        }
    });
});
