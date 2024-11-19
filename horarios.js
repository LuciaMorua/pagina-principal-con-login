document.addEventListener('DOMContentLoaded', () => {
    const courseForm = document.getElementById('add-course-form');
    const coursesTableBody = document.getElementById('courses-table-body');
    const roomSelect = document.getElementById('aula');
    const searchInput = document.getElementById('search-course');

    const loadRoomsFromStorage = () => {
        const rooms = JSON.parse(localStorage.getItem('rooms')) || [];
        roomSelect.innerHTML = ''; 

        rooms.forEach(room => {
            const option = document.createElement('option');
            option.value = room;
            option.textContent = room;
            roomSelect.appendChild(option);
        });
    };

    const loadCoursesFromStorage = () => {
        const courses = JSON.parse(localStorage.getItem('courses')) || [];
        coursesTableBody.innerHTML = ''; 

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

        const deleteButtons = document.querySelectorAll('.delete-button');
        deleteButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index'); 
                deleteCourse(index);
            });
        });
    };

    const deleteCourse = (index) => {
        const courses = JSON.parse(localStorage.getItem('courses')) || [];

        courses.splice(index, 1);

        localStorage.setItem('courses', JSON.stringify(courses));

        loadCoursesFromStorage();
    };

    courseForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('course-name').value;
        const type = document.getElementById('course-type').value;
        const cuatrimestre = type === 'cuatrimestral' ? document.getElementById('cuatrimestre').value : 'Anual'; 
        const day = document.getElementById('day').value;
        const hour = document.getElementById('hour').value;
        const room = roomSelect.value; 


        if (!room) {
            alert("Por favor, selecciona un aula.");
            return; 
        }

        const newCourse = {
            name,
            type,
            cuatrimestre,
            day,
            hour,
            room
        };

        const courses = JSON.parse(localStorage.getItem('courses')) || [];
        courses.push(newCourse);

        localStorage.setItem('courses', JSON.stringify(courses));

        loadCoursesFromStorage();

        courseForm.reset();
    });

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();
        const rows = coursesTableBody.querySelectorAll('tr');
        rows.forEach(row => {
            const courseName = row.querySelector('td').innerText.toLowerCase();
            row.style.display = courseName.includes(query) ? '' : 'none';
        });
    });

    loadRoomsFromStorage();
    loadCoursesFromStorage();
});
