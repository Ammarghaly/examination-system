import { getData } from "../../Apis.js";

const timerElement = document.getElementById("timer");
const alertUI = document.querySelector(".alert");
const circle = document.querySelector(".progress-ring__circle");

let totalSeconds;
let originalSeconds;
let timerInterval;

const radius = 90;
const circumference = 2 * Math.PI * radius;

circle.style.strokeDasharray = circumference;
circle.style.strokeDashoffset = 0;
startExamTimer(10)
function startExamTimer(minutes) {
  originalSeconds = minutes * 60;
  totalSeconds = originalSeconds;

  updateTimer();

  timerInterval = setInterval(() => {
    totalSeconds--;

    updateTimer();

    if (totalSeconds <= 0) {
      clearInterval(timerInterval);
      showError("Time is up ⏳");
    }
  }, 1000);
}

function updateTimer() {
  let minutes = Math.floor(totalSeconds / 60);
  let seconds = totalSeconds % 60;

  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  timerElement.textContent = `${minutes}:${seconds}`;
  const percent = totalSeconds / originalSeconds;
  const offset = circumference - percent * circumference;
  circle.style.strokeDashoffset = offset;
  if (percent <= 0.5) {
    circle.style.stroke = "orange";
    timerElement.color = "orange";
  }

  if (percent <= 0.25) {
    circle.style.stroke = "red";
    timerElement.color = "red";
  }
}
function showError(message) {
  alertUI.textContent = message;
  alertUI.classList.add("error", "show");
}

function showSuccess(message) {
  alertUI.textContent = message;
  alertUI.classList.add("success", "show");
}

/////////////////////////////////////////////////////////////////////////


