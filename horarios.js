document.addEventListener('DOMContentLoaded', () => {
    const courses = JSON.parse(localStorage.getItem('courses')) || [];
    const rooms = JSON.parse(localStorage.getItem('rooms')) || [];
    const coursesTableBody = document.getElementById('courses-table-body');
    const addCourseForm = document.getElementById('add-course-form');
    const aulaSelect = document.getElementById('aula');

    const saveCourses = () => localStorage.setItem('courses', JSON.stringify(courses));

    const renderRooms = () => {
        aulaSelect.innerHTML = '';
        rooms.forEach((room, index) => {
            const option = document.createElement('option');
            option.value = index + 1; 
            option.textContent = room;
            aulaSelect.appendChild(option);
        });
    };

    const renderCourses = () => {
        coursesTableBody.innerHTML = '';
        courses.forEach((course, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${course.name}</td>
                <td>${course.type}</td>
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

    addCourseForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const course = {
            name: document.getElementById('course-name').value.trim(),
            type: document.getElementById('course-type').value,
            day: document.getElementById('day').value,
            hour: parseInt(document.getElementById('hour').value, 10),
            aula: parseInt(aulaSelect.value, 10),
        };
        courses.push(course);
        renderCourses();
        saveCourses();
        addCourseForm.reset();
    });

    window.deleteCourse = (index) => {
        courses.splice(index, 1);
        renderCourses();
        saveCourses();
    };

    renderRooms();
    renderCourses();
});
