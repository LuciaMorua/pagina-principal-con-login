document.addEventListener('DOMContentLoaded', () => {
    const courses = JSON.parse(localStorage.getItem('courses')) || [];
    const rooms = JSON.parse(localStorage.getItem('rooms')) || [];
    const coursesTableBody = document.getElementById('courses-table-body');
    const addCourseForm = document.getElementById('add-course-form');
    const aulaSelect = document.getElementById('aula');
    const cuatrimestreSelect = document.getElementById('cuatrimestre');
    const courseTypeSelect = document.getElementById('course-type');

    const saveCourses = () => localStorage.setItem('courses', JSON.stringify(courses));

    // Generar opciones dinámicas para las aulas en el select
    const renderRooms = () => {
        aulaSelect.innerHTML = '';
        rooms.forEach((room, index) => {
            const option = document.createElement('option');
            option.value = index + 1;  // Valor numérico del aula
            option.textContent = room;  // Nombre del aula
            aulaSelect.appendChild(option);
        });
    };

    // Renderizar la tabla de materias
    const renderCourses = () => {
        coursesTableBody.innerHTML = '';
        courses.forEach((course, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${course.name}</td>
                <td>${course.type}</td>
                <td>${course.type === 'cuatrimestral' ? course.cuatrimestre : 'Anual'}</td>
                <td>${course.day}</td>
                <td>${course.hour}:00</td>
                <td>Aula ${course.aula}</td>
                <td>
                    <button onclick="deleteCourse(${index})">Eliminar</button>
                </td>
            `;
            coursesTableBody.appendChild(row);
        });
    };

    // Manejar cambios en el tipo de curso (mostrar o esconder cuatrimestre)
    courseTypeSelect.addEventListener('change', () => {
        if (courseTypeSelect.value === 'cuatrimestral') {
            cuatrimestreSelect.style.display = 'block';
        } else {
            cuatrimestreSelect.style.display = 'none';
        }
    });

    // Agregar una nueva materia
    addCourseForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const course = {
            name: document.getElementById('course-name').value.trim(),
            type: courseTypeSelect.value,
            cuatrimestre: courseTypeSelect.value === 'cuatrimestral' ? cuatrimestreSelect.value : 'Anual',
            day: document.getElementById('day').value,
            hour: parseInt(document.getElementById('hour').value, 10),
            aula: parseInt(aulaSelect.value, 10),  // Guardar el número del aula seleccionada
        };
        courses.push(course);
        renderCourses();
        saveCourses();
        addCourseForm.reset();
    });

    // Eliminar una materia
    window.deleteCourse = (index) => {
        courses.splice(index, 1);
        renderCourses();
        saveCourses();
    };

    renderRooms();  // Cargar opciones de aulas al inicio
    renderCourses();  // Renderizar materias al inicio
});
