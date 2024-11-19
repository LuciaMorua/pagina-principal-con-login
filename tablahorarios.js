document.addEventListener('DOMContentLoaded', () => {
    const horariosTableBody = document.getElementById('horarios-table-body');
    const tableHeader = document.getElementById('table-header');
    const startHour = 7.5; // Hora de inicio (7:30 AM)
    const endHour = 21.5;  // Hora de fin (9:30 PM)

    // Cargar los datos desde localStorage
    const loadFromStorage = (key) => JSON.parse(localStorage.getItem(key)) || [];

    const rooms = loadFromStorage('rooms');
    const courses = loadFromStorage('courses');
    const reservations = loadFromStorage('reservations');

    // Convertir una hora en formato "HH:MM" a formato decimal (por ejemplo: "7:30" -> 7.5)
    const convertTimeToDecimal = (time) => {
        const [hour, minute] = time.split(":").map(Number);
        return hour + minute / 60;
    };

    // Renderizar los encabezados de las aulas
    const renderRoomHeaders = () => {
        tableHeader.innerHTML = '<th>Horas / Aulas</th>';

        rooms.forEach((room) => {
            const th = document.createElement('th');
            th.textContent = room;
            tableHeader.appendChild(th);
        });
    };

    // Función para renderizar la tabla con los horarios
    const renderScheduleTable = () => {
        horariosTableBody.innerHTML = ''; // Limpiar la tabla antes de renderizar

        // Recorrer las horas del día y agregar filas
        for (let hour = startHour; hour <= endHour; hour += 0.5) {  // Incrementar de 0.5 en 0.5 (7:30, 8:00, etc.)
            const row = document.createElement('tr');
            const hourCell = document.createElement('td');
            const hourText = hour % 1 === 0 ? `${Math.floor(hour)}:00` : `${Math.floor(hour)}:30`;
            hourCell.innerText = hourText;
            row.appendChild(hourCell);

            // Para cada aula, revisar si tiene un curso o una reserva en la hora actual
            rooms.forEach((room) => {
                const aulaCell = document.createElement('td');
                aulaCell.classList.add('horario-celda');

                // Buscar el curso o la reserva que coincida con la hora y el aula
                const course = courses.find((c) => convertTimeToDecimal(c.hour) === hour && c.room === room);
                const reservation = reservations.find((r) => convertTimeToDecimal(r.hour) === hour && r.room === room);

                // Verificar si se encontró el curso o la reserva
                if (course) {
                    aulaCell.innerText = `${course.name} (${course.type})`;
                    aulaCell.classList.add(course.type === 'anual' ? 'materia-anual' : 'materia-cuatrimestral');
                } else if (reservation) {
                    aulaCell.innerText = `${reservation.name}`;
                    aulaCell.classList.add('materia-temporal');
                } else {
                    aulaCell.innerText = '';  // Dejar vacía la celda si no hay curso ni reserva
                }

                row.appendChild(aulaCell);
            });

            horariosTableBody.appendChild(row);
        }
    };

    // Llamar a las funciones de renderizado
    renderRoomHeaders();
    renderScheduleTable();
});
