import { getData } from "../../Apis.js";

const timerElement = document.getElementById("timer");
const numbers = document.getElementById("numbers");
const alertUI = document.querySelector(".alert");
const circle = document.querySelector(".progress-ring__circle");
const questionText = document.querySelector("#questionText");
const radioInputs = document.querySelectorAll('input[name="answer"]');
const option = document.querySelectorAll(".option span");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const flagBtn = document.getElementById("flagBtn");
const optionsContainer = document.querySelector(".options");

const idExam =location.search;
const urlParams = new URLSearchParams(idExam);
const Id = urlParams.get("id");

let totalSeconds;
let originalSeconds;
let timerInterval;

const radius = 90;
const circumference = 2 * Math.PI * radius;

circle.style.strokeDasharray = circumference;
circle.style.strokeDashoffset = 0;

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
    timerElement.style.color = "orange";
  }

  if (percent <= 0.25) {
    circle.style.stroke = "red";
    timerElement.style.color = "red";
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
let index = 0;
let answers = [];
let questions = [];

window.addEventListener("DOMContentLoaded", async () => {
  try {
    const { data, error } = await getData(`http://localhost:3000/exams/${Id}`);
    if (data) {
      questions = [...data.questions];
      if (data.questions) {
        numbers.innerHTML = "";
        data.questions.forEach((ele, i) => {
          numbers.insertAdjacentHTML("beforeend", `<span>${i + 1}</span>`);
        });
      }

      if (data.time) {
        startExamTimer(data.time);
      }
      showQuestion();
    }
  } catch (err) {
    showError("Error connecting to server");
  }
});

nextBtn.addEventListener("click", () => {
  if (index < questions.length - 1) {
    index++;
    showQuestion();
  }
});

prevBtn.addEventListener("click", () => {
  if (index > 0) {
    index--;
    showQuestion();
  }
});

function showQuestion() {
  const currentQuestion = questions[index];
  const currentOptions = currentQuestion.options;

  questionText.textContent = currentQuestion.question;

  radioInputs.forEach((inp) => {
    inp.checked = false;
    if (answers[index] !== undefined && inp.value === answers[index]) {
      inp.checked = true;
    }
  });

  if (index === 0) {
    prevBtn.style.visibility = "hidden";
  } else {
    prevBtn.style.visibility = "visible";
  }

  if (index === questions.length - 1) {
    nextBtn.textContent = "Finish";
  } else {
    nextBtn.textContent = "Next";
    nextBtn.style.visibility = "visible";
  }
  option.forEach((ele, i) => {
    ele.textContent = currentOptions[i];
  });
  updateSpans();
}
flagBtn.addEventListener("click", () => {
  const spanNum = document.querySelectorAll("#numbers span")[index];
  spanNum.classList.toggle("flagged");
});

optionsContainer.addEventListener("change", (e) => {
  if (e.target.matches('input[name="answer"]')) {
    answers[index] = e.target.value;
    updateSpans();
  }
});

function updateSpans() {
  const spans = document.querySelectorAll("#numbers span");

  spans.forEach((span, i) => {
    span.classList.remove("active");
    if (i === index) {
      span.classList.add("active");
      span.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }

    if (answers[i] !== undefined) {
      span.classList.add("answered");
    }
  });
}

numbers.addEventListener("click", (e) => {
  if (e.target.matches("span")) {
    index = Number(e.target.textContent) - 1;
    showQuestion();
    updateSpans();
  }
});