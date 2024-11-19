document.addEventListener('DOMContentLoaded', () => {
    const reservations = JSON.parse(localStorage.getItem('reservations')) || [];
    const rooms = JSON.parse(localStorage.getItem('rooms')) || [];
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
                <td>${reservation.hour}</td>
                <td>${reservation.room}</td>
                <td>
                    <button onclick="deleteReservation(${index})">Eliminar</button>
                </td>
            `;
            reservationsTableBody.appendChild(row);
        });
    };

    addReservationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const reservation = {
            name: document.getElementById('reservation-name').value.trim(),
            date: document.getElementById('reservation-date').value,
            hour: document.getElementById('reservation-hour').value.trim(),
            room: roomSelect.value,
        };
        reservations.push(reservation);
        renderReservations();
        saveReservations();
        addReservationForm.reset();
    });

    window.deleteReservation = (index) => {
        reservations.splice(index, 1);
        renderReservations();
        saveReservations();
    };

    renderRooms();
    renderReservations();
});
