document.addEventListener('DOMContentLoaded', () => {
    const courseForm = document.getElementById('add-course-form');
    const coursesTableBody = document.getElementById('courses-table-body');
    const roomSelect = document.getElementById('aula');
    const searchInput = document.getElementById('search-course');

    // Cargar las aulas desde localStorage y mostrarlas en el formulario
    const loadRoomsFromStorage = () => {
        const rooms = JSON.parse(localStorage.getItem('rooms')) || [];
        roomSelect.innerHTML = ''; // Limpiar las opciones existentes

        // Agregar aulas al select
        rooms.forEach(room => {
            const option = document.createElement('option');
            option.value = room;
            option.textContent = room;
            roomSelect.appendChild(option);
        });
    };

    // Cargar las materias desde localStorage y mostrarlas en la tabla
    const loadCoursesFromStorage = () => {
        const courses = JSON.parse(localStorage.getItem('courses')) || [];
        coursesTableBody.innerHTML = ''; // Limpiar las filas existentes

        // Mostrar las materias guardadas
        courses.forEach((course, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${course.name}</td>
                <td>${course.type}</td>
                <td>${course.type === 'anual' ? 'Anual' : (course.cuatrimestre || 'N/A')}</td> <!-- Mostrar 'Anual' si el tipo es anual -->
                <td>${course.day}</td>
                <td>${course.hour}</td>
                <td>${course.room || 'N/A'}</td>
                <td><button class="delete-button" data-index="${index}">Eliminar</button></td>
            `;
            coursesTableBody.appendChild(row);
        });

        // Agregar el evento de eliminación a cada botón
        const deleteButtons = document.querySelectorAll('.delete-button');
        deleteButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index'); // Obtener el índice del curso a eliminar
                deleteCourse(index);
            });
        });
    };

    // Eliminar un curso
    const deleteCourse = (index) => {
        // Obtener cursos actuales desde localStorage
        const courses = JSON.parse(localStorage.getItem('courses')) || [];

        // Eliminar el curso en el índice especificado
        courses.splice(index, 1);

        // Guardar la lista actualizada de cursos en localStorage
        localStorage.setItem('courses', JSON.stringify(courses));

        // Recargar la tabla de materias
        loadCoursesFromStorage();
    };

    // Agregar un nuevo curso
    courseForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('course-name').value;
        const type = document.getElementById('course-type').value;
        const cuatrimestre = type === 'cuatrimestral' ? document.getElementById('cuatrimestre').value : 'Anual'; // Si es anual, se asigna 'Anual'
        const day = document.getElementById('day').value;
        const hour = document.getElementById('hour').value;
        const room = roomSelect.value; // Asegurarse de que se obtenga correctamente el valor del aula

        // Verificación: Si no se selecciona un aula, se muestra un mensaje de alerta
        if (!room) {
            alert("Por favor, selecciona un aula.");
            return; // Si no se selecciona un aula, no guardamos el curso.
        }

        const newCourse = {
            name,
            type,
            cuatrimestre,
            day,
            hour,
            room
        };

        // Obtener cursos actuales
        const courses = JSON.parse(localStorage.getItem('courses')) || [];
        courses.push(newCourse);

        // Guardar en localStorage
        localStorage.setItem('courses', JSON.stringify(courses));

        // Recargar la tabla de materias
        loadCoursesFromStorage();

        // Limpiar el formulario
        courseForm.reset();
    });

    // Filtrar cursos por búsqueda
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();
        const rows = coursesTableBody.querySelectorAll('tr');
        rows.forEach(row => {
            const courseName = row.querySelector('td').innerText.toLowerCase();
            row.style.display = courseName.includes(query) ? '' : 'none';
        });
    });

    // Cargar los datos al cargar la página
    loadRoomsFromStorage();
    loadCoursesFromStorage();
});
