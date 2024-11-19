const calendar = document.querySelector(".calendar"),
  daysContainer = document.querySelector("#days"), 
  currentDate = document.querySelector("#current-date"),
  monthSelector = document.querySelector("#month-selector"),
  todayBtn = document.querySelector(".today-btn"),
  addEventBtn = document.querySelector(".add-event"),
  addEventWrapper = document.querySelector(".add-event-wrapper"),
  addEventCloseBtn = document.querySelector(".close"),
  addEventTitle = document.querySelector(".event-name"),
  addEventFrom = document.querySelector(".event-time-from"),
  addEventTo = document.querySelector(".event-time-to"),
  addEventSubmit = document.querySelector(".add-event-btn"),
  eventsContainer = document.querySelector(".events");

let today = new Date();
let activeDay;
let month = today.getMonth();
let year = today.getFullYear();

const months = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const daysOfWeek = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

const eventsArr = [];
getEvents();
initCalendar();

function initCalendar() {
  updateCalendarHeader();
  generateDays();
}

function updateCalendarHeader() {
  currentDate.textContent = `${months[month]} ${year}`;
  monthSelector.value = month;
}

function generateDays() {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const lastDate = lastDay.getDate();

  daysContainer.innerHTML = "";

  for (let i = 1; i <= lastDate; i++) {
    const currentDate = new Date(year, month, i);
    const dayOfWeek = daysOfWeek[currentDate.getDay()]; 

    const dayButton = document.createElement('button');
    dayButton.classList.add('day');

    dayButton.textContent = `${dayOfWeek} ${i}`;

    dayButton.addEventListener("click", () => {
      console.log(`Día seleccionado: ${dayOfWeek} ${i}`);
      alert(`Día seleccionado: ${dayOfWeek} ${i}`);

      // Guardamos el día seleccionado en el localStorage
      localStorage.setItem('selectedDate', `${i} de ${months[month]}`);
    });

    if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
      dayButton.classList.add('today');
    }

    daysContainer.appendChild(dayButton);
  }
}

function changeMonth(direction) {
  month += direction;

  if (month < 0) {
    month = 11;
    year--;
  } else if (month > 11) {
    month = 0;
    year++;
  }

  initCalendar();
}

function updateMonth() {
  month = parseInt(monthSelector.value);
  initCalendar();
}

todayBtn.addEventListener("click", () => {
  today = new Date();
  month = today.getMonth();
  year = today.getFullYear();
  initCalendar();
});

function getEvents() {
  if (localStorage.getItem("events")) {
    eventsArr.push(...JSON.parse(localStorage.getItem("events")));
  }
}

function saveEvents() {
  localStorage.setItem("events", JSON.stringify(eventsArr));
}

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
}

function saveNewEvent(event) {
  event.preventDefault(); 

  const title = addEventTitle.value.trim();
  const timeFrom = addEventFrom.value.trim();
  const timeTo = addEventTo.value.trim();

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

function resetForm() {
  addEventTitle.value = "";
  addEventFrom.value = "";
  addEventTo.value = "";
  addEventSubmit.textContent = "Guardar evento";
  addEventSubmit.onclick = saveNewEvent;
}

function convertTime(time) {
  const [hour, minute] = time.split(":").map(Number);
  const suffix = hour >= 12 ? "PM" : "AM";
  const adjustedHour = hour % 12 || 12;
  return `${adjustedHour}:${minute.toString().padStart(2, "0")} ${suffix}`;
}

addEventSubmit.addEventListener("click", saveNewEvent);
