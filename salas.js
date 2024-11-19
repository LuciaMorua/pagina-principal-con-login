document.addEventListener('DOMContentLoaded', () => {
    const rooms = JSON.parse(localStorage.getItem('rooms')) || [];
    const roomsTableBody = document.getElementById('rooms-table-body');
    const addRoomForm = document.getElementById('add-room-form');

    const saveRooms = () => localStorage.setItem('rooms', JSON.stringify(rooms));

    const renderRooms = () => {
        roomsTableBody.innerHTML = '';
        rooms.forEach((room, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${room}</td>
                <td>
                    <button onclick="deleteRoom(${index})">Eliminar</button>
                </td>
            `;
            roomsTableBody.appendChild(row);
        });
    };

    addRoomForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const roomName = document.getElementById('room-name').value.trim();
        if (roomName) {
            rooms.push(roomName);
            renderRooms();
            saveRooms();
            addRoomForm.reset();
        }
    });

    window.deleteRoom = (index) => {
        rooms.splice(index, 1);
        renderRooms();
        saveRooms();
    };

    renderRooms();
});
