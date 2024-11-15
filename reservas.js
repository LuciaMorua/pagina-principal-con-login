document.addEventListener('DOMContentLoaded', () => {
    const reservations = JSON.parse(localStorage.getItem('reservations')) || [];
    const rooms = JSON.parse(localStorage.getItem('rooms')) || [];
    const courses = JSON.parse(localStorage.getItem('courses')) || [];
    const reservationsTableBody = document.getElementById('reservations-table-body');
    const addReservationForm = document.getElementById('add-reservation-form');
    const roomSelect = document.getElementById('room');

    const saveReservations = () => localStorage.setItem('reservations', JSON.stringify(reservations));

    const renderRooms = () => {
        roomSelect.innerHTML = '';
        rooms.forEach((room) => {
            const option = document.createElement('option');
            option.value = room;
            option.textContent = room;
            roomSelect.appendChild(option);
        });
    };

    const renderReservations = () => {
        reservationsTableBody.innerHTML = '';
        reservations.forEach((reservation, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${reservation.name}</td>
                <td>${reservation.date}</td>
                <td>${reservation.hour}:00</td>
                <td>${reservation.room}</td>
                <td>
                    <button onclick="deleteReservation(${index})">Eliminar</button>
                </td>
            `;
            reservationsTableBody.appendChild(row);
        });
    };

    const isRoomAvailable = (date, hour, room) => {

        const roomIndex = rooms.indexOf(room) + 1;
        const conflictWithCourse = courses.some(
            (course) => course.hour === hour && course.aula === roomIndex && course.day === new Date(date).toLocaleDateString('es-ES', { weekday: 'long' })
        );

        const conflictWithReservation = reservations.some(
            (reservation) => reservation.date === date && reservation.hour === hour && reservation.room === room
        );

        return !conflictWithCourse && !conflictWithReservation;
    };

    addReservationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const reservation = {
            name: document.getElementById('reservation-name').value.trim(),
            date: document.getElementById('reservation-date').value,
            hour: parseInt(document.getElementById('reservation-hour').value, 10),
            room: roomSelect.value,
        };
        if (isRoomAvailable(reservation.date, reservation.hour, reservation.room)) {
            reservations.push(reservation);
            renderReservations();
            saveReservations();
            addReservationForm.reset();
        } else {
            alert('El aula seleccionada no está disponible en el horario especificado.');
        }
    });

    window.deleteReservation = (index) => {
        reservations.splice(index, 1);
        renderReservations();
        saveReservations();
    };

    renderRooms();
    renderReservations();
});
