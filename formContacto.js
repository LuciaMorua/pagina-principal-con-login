document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita que el formulario se envíe automáticamente

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();
    const feedback = document.getElementById('feedback');

    // Validación básica para verificar que los campos no estén vacíos
    if (name === '' || email === '' || subject === '' || message === '') {
        feedback.textContent = 'Por favor, completa todos los campos.';
        feedback.style.color = 'red';
    } else {
        feedback.textContent = '¡Mensaje enviado con éxito!';
        feedback.style.color = 'green';
        
        // Aquí puedes agregar una lógica para enviar los datos a un servidor

        // Limpia el formulario después de enviar
        document.getElementById('contactForm').reset();
    }
});
