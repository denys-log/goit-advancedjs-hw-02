import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const button = document.querySelector('[data-start]');
const input = document.getElementById('datetime-picker');
const timerElements = ['days', 'hours', 'minutes', 'seconds'];
let userSelectedDate;

flatpickr('#datetime-picker', {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (new Date() > selectedDates[0]) {
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
        position: 'topRight',
      });
      // window.alert('Please choose a date in the future');
    } else {
      userSelectedDate = selectedDates[0];
      button.removeAttribute('disabled');
    }
  },
});

button.addEventListener('click', () => {
  button.setAttribute('disabled', true);
  input.setAttribute('disabled', true);

  const userSelectedDateTimestamp = new Date(userSelectedDate).getTime();

  function updateTimer() {
    const diff = convertMs(userSelectedDateTimestamp - new Date().getTime());
    timerElements.forEach(element => {
      document.querySelector(`[data-${element}]`).textContent = addLeadingZero(
        diff[element]
      );
    });
  }

  updateTimer();
  setInterval(updateTimer, 1000);
});

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return value.toString().padStart(2, '0');
}
