// Selección de elementos
const calendar = document.querySelector(".calendar"),
  date = document.querySelector(".date"),
  daysContainer = document.querySelector(".days"),
  prev = document.querySelector(".prev"),
  next = document.querySelector(".next"),
  todayBtn = document.querySelector(".today-btn"),
  gotoBtn = document.querySelector(".goto-btn"),
  dateInput = document.querySelector(".date-input"),
  eventDay = document.querySelector(".event-day"),
  eventDate = document.querySelector(".event-date"),
  eventsContainer = document.querySelector(".events"),
  addEventBtn = document.querySelector(".add-event"),
  addEventWrapper = document.querySelector(".add-event-wrapper"),
  addEventCloseBtn = document.querySelector(".close"),
  addEventTitle = document.querySelector(".event-name"),
  addEventFrom = document.querySelector(".event-time-from"),
  addEventTo = document.querySelector(".event-time-to"),
  addEventSubmit = document.querySelector(".add-event-btn");

let today = new Date();
let activeDay;
let month = today.getMonth();
let year = today.getFullYear();

const months = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const eventsArr = [];
getEvents(); // Cargar eventos desde el almacenamiento local
initCalendar(); // Inicializar el calendario

// Abrir y cerrar el formulario de agregar evento
addEventBtn.addEventListener("click", () => {
  addEventWrapper.classList.toggle("active");
  resetForm();
});
addEventCloseBtn.addEventListener("click", () => {
  addEventWrapper.classList.remove("active");
  resetForm();
});

// Inicializar y poblar días en el calendario
function initCalendar() {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const prevLastDay = new Date(year, month, 0);
  const prevDays = prevLastDay.getDate();
  const lastDate = lastDay.getDate();
  const day = firstDay.getDay();
  const nextDays = 7 - lastDay.getDay() - 1;

  date.innerHTML = `${months[month]} ${year}`;

  let days = "";
  for (let x = day; x > 0; x--) {
    days += `<div class="day prev-date">${prevDays - x + 1}</div>`;
  }

  for (let i = 1; i <= lastDate; i++) {
    let event = eventsArr.some(event => event.day === i && event.month === month + 1 && event.year === year);
    let dayClass = i === today.getDate() && month === today.getMonth() && year === today.getFullYear() ? "today" : "";
    dayClass += event ? " event" : "";
    dayClass += i === activeDay ? " active" : "";
    days += `<div class="day ${dayClass}">${i}</div>`;
  }

  for (let j = 1; j <= nextDays; j++) {
    days += `<div class="day next-date">${j}</div>`;
  }
  daysContainer.innerHTML = days;
  addDayListeners();
}

// Actualizar eventos mostrados cuando se selecciona un día
function updateEvents(date) {
  const events = eventsArr
    .filter(event => event.day === date && event.month === month + 1 && event.year === year)
    .flatMap(event => event.events);

  if (events.length === 0) {
    eventsContainer.innerHTML = `<div class="no-event"><h3>No Events</h3></div>`;
  } else {
    eventsContainer.innerHTML = events.map((event, index) => `
      <div class="event">
        <div class="title">
          <i class="fas fa-circle"></i>
          <h3 class="event-title">${event.title}</h3>
        </div>
        <div class="event-time">${event.time}</div>
        <button class="edit-event-btn update-btn" onclick="editEvent(${date}, ${index})">Actualizar</button>
        <button class="delete-event-btn delete-btn" onclick="deleteEvent(${date}, ${index})">Eliminar</button>
      </div>
    `).join("");
  }
  saveEvents(); // Guardar actualizaciones en el almacenamiento local
}

// Agregar oyentes a los días
function addDayListeners() {
  document.querySelectorAll(".day").forEach(day => {
    day.addEventListener("click", () => {
      activeDay = parseInt(day.innerText);
      initCalendar();
      updateEvents(activeDay);
    });
  });
}

// Botón para volver al día de hoy
todayBtn.addEventListener("click", () => {
  today = new Date();
  month = today.getMonth();
  year = today.getFullYear();
  initCalendar();
});

// Función para cargar los datos de un evento en el formulario para editarlo
function editEvent(day, eventIndex) {
  const eventObj = eventsArr.find(event => event.day === day && event.month === month + 1 && event.year === year);
  if (eventObj && eventObj.events[eventIndex]) {
    const event = eventObj.events[eventIndex];

    // Cargar datos del evento en el formulario
    addEventTitle.value = event.title;
    const [timeFrom, timeTo] = event.time.split(" - ");
    addEventFrom.value = timeFrom;
    addEventTo.value = timeTo;

    // Mostrar el formulario
    addEventWrapper.classList.add("active");

    // Cambiar el texto del botón a "Actualizar evento"
    addEventSubmit.textContent = "Actualizar evento";

    // Actualizar el evento al hacer clic en "Actualizar evento"
    addEventSubmit.onclick = () => {
      event.title = addEventTitle.value;
      event.time = `${convertTime(addEventFrom.value)} - ${convertTime(addEventTo.value)}`;

      // Guardar cambios y actualizar la lista de eventos
      saveEvents();
      updateEvents(day);

      // Restaurar el botón al texto original y limpiar el formulario
      addEventSubmit.textContent = "Guardar evento";
      addEventSubmit.onclick = saveNewEvent; // Restablecer a la función de guardado inicial
      addEventWrapper.classList.remove("active");
      resetForm();
    };
  }
}

// Función para eliminar un evento
function deleteEvent(day, eventIndex) {
  const eventObj = eventsArr.find(event => event.day === day && event.month === month + 1 && event.year === year);
  if (eventObj) {
    eventObj.events.splice(eventIndex, 1);
    if (eventObj.events.length === 0) {
      eventsArr.splice(eventsArr.indexOf(eventObj), 1);
    }
    saveEvents();
    updateEvents(day);
  }
}

// Función inicial para guardar un nuevo evento
function saveNewEvent(event) {
  event.preventDefault(); // Evita el envío automático del formulario si está dentro de un <form>

  const title = addEventTitle.value.trim();
  const timeFrom = addEventFrom.value.trim();
  const timeTo = addEventTo.value.trim();

  // Debugging: Verificar que los campos tengan valores
  console.log("Título:", title);
  console.log("Hora de inicio:", timeFrom);
  console.log("Hora de fin:", timeTo);

  // Verificación de formato de hora usando expresión regular para validar "HH:MM"
  const timeFormatRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

  if (!title || !timeFrom.match(timeFormatRegex) || !timeTo.match(timeFormatRegex)) {
    alert("Por favor, completa todos los campos con el formato adecuado.");
    return;
  }

  const timeFormat = `${convertTime(timeFrom)} - ${convertTime(timeTo)}`;

  const eventObj = eventsArr.find(event =>
    event.day === activeDay &&
    event.month === month + 1 &&
    event.year === year
  );

  if (eventObj) {
    eventObj.events.push({ title, time: timeFormat });
  } else {
    eventsArr.push({
      day: activeDay,
      month: month + 1,
      year: year,
      events: [{ title, time: timeFormat }]
    });
  }

  addEventWrapper.classList.remove("active");
  resetForm();
  updateEvents(activeDay);
  saveEvents();
}

// Asigna la función `saveNewEvent` al botón para guardar nuevos eventos
addEventSubmit.addEventListener("click", saveNewEvent);

// Función para reiniciar el formulario
function resetForm() {
  addEventTitle.value = "";
  addEventFrom.value = "";
  addEventTo.value = "";
  addEventSubmit.textContent = "Guardar evento";
  addEventSubmit.onclick = saveNewEvent; // Restablecer la función de guardar
}

// Guardar eventos en localStorage
function saveEvents() {
  localStorage.setItem("events", JSON.stringify(eventsArr));
}

// Cargar eventos de localStorage
function getEvents() {
  if (localStorage.getItem("events")) {
    eventsArr.push(...JSON.parse(localStorage.getItem("events")));
  }
}

// Convertir hora a formato 12 horas
function convertTime(time) {
  const [hour, minute] = time.split(":").map(Number);
  const suffix = hour >= 12 ? "PM" : "AM";
  const adjustedHour = hour % 12 || 12;
  return `${adjustedHour}:${minute.toString().padStart(2, "0")} ${suffix}`;
}
