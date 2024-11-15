document.addEventListener('DOMContentLoaded', () => {
    const horariosTableBody = document.getElementById('horarios-table-body');
    const startHour = 9;
    const endHour = 21;

    const loadFromStorage = (key) => JSON.parse(localStorage.getItem(key)) || [];
    const rooms = loadFromStorage('rooms'); 
    const courses = loadFromStorage('courses'); 
    const reservations = loadFromStorage('reservations'); 

    const renderScheduleTable = () => {
        horariosTableBody.innerHTML = ''; 

        for (let hour = startHour; hour < endHour; hour++) {
            const row = document.createElement('tr');

            const hourCell = document.createElement('td');
            hourCell.innerText = `${hour}:00`;
            row.appendChild(hourCell);

            rooms.forEach((room, roomIndex) => {
                const aulaCell = document.createElement('td');
                aulaCell.classList.add('horario-celda');

                const course = courses.find(
                    (c) =>
                        c.hour === hour &&
                        c.aula === roomIndex + 1 
                );

                const reservation = reservations.find(
                    (r) =>
                        r.hour === hour &&
                        r.room === room 
                );

                 if (course) {
                    aulaCell.innerText = `${course.name} (${course.type})`;
                    aulaCell.classList.add(
                        course.type === 'anual'
                            ? 'materia-anual'
                            : 'materia-cuatrimestral'
                    );
                } else if (reservation) {
                    aulaCell.innerText = `${reservation.name}`;
                    aulaCell.classList.add('materia-temporal');
                }

                row.appendChild(aulaCell);
            });

            horariosTableBody.appendChild(row);
        }
    };

    
    renderScheduleTable();
});
