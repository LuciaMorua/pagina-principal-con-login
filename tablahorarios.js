document.addEventListener('DOMContentLoaded', () => {
    const horariosTableBody = document.getElementById('horarios-table-body');
    const tableHeader = document.getElementById('table-header');
    const selectedDateDisplay = document.createElement('h3');  // Crear un h3 para mostrar el día seleccionado
    const startHour = 7.5; 
    const endHour = 21.5;  

    const loadFromStorage = (key) => JSON.parse(localStorage.getItem(key)) || [];

    const rooms = loadFromStorage('rooms');
    const courses = loadFromStorage('courses');
    const reservations = loadFromStorage('reservations');
    const selectedDate = localStorage.getItem('selectedDate');  // Obtener la fecha seleccionada del localStorage

    const convertTimeToDecimal = (time) => {
        const [hour, minute] = time.split(":").map(Number);
        return hour + minute / 60;
    };

    const renderRoomHeaders = () => {
        tableHeader.innerHTML = '<th>Horas / Aulas</th>';

        rooms.forEach((room) => {
            const th = document.createElement('th');
            th.textContent = room;
            tableHeader.appendChild(th);
        });
    };

    const renderScheduleTable = () => {
        horariosTableBody.innerHTML = ''; 

        for (let hour = startHour; hour <= endHour; hour += 0.5) {  
            const row = document.createElement('tr');
            const hourCell = document.createElement('td');
            const hourText = hour % 1 === 0 ? `${Math.floor(hour)}:00` : `${Math.floor(hour)}:30`;
            hourCell.innerText = hourText;
            row.appendChild(hourCell);

            rooms.forEach((room) => {
                const aulaCell = document.createElement('td');
                aulaCell.classList.add('horario-celda');

                const course = courses.find((c) => convertTimeToDecimal(c.hour) === hour && c.room === room);
                const reservation = reservations.find((r) => convertTimeToDecimal(r.hour) === hour && r.room === room);

                if (course) {
                    aulaCell.innerText = `${course.name} (${course.type})`;
                    aulaCell.classList.add(course.type === 'anual' ? 'materia-anual' : 'materia-cuatrimestral');
                } else if (reservation) {
                    aulaCell.innerText = `${reservation.name}`;
                    aulaCell.classList.add('materia-temporal');
                } else {
                    aulaCell.innerText = '';  
                }

                row.appendChild(aulaCell);
            });

            horariosTableBody.appendChild(row);
        }
    };

    // Mostrar el día seleccionado arriba de la tabla
    if (selectedDate) {
        selectedDateDisplay.textContent = `Día seleccionado: ${selectedDate}`;
        document.querySelector('.content').insertBefore(selectedDateDisplay, horariosTableBody);
    }

    renderRoomHeaders();
    renderScheduleTable();
});
