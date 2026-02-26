import { getData } from "../../Apis.js";

const btnRetry = document.querySelector(".btn.retry");
const btnBack = document.querySelector(".btn.back");

const idExam = location.search;
const urlParams = new URLSearchParams(idExam);
const Id = urlParams.get("id");


window.history.pushState(null, null, window.location.href);
window.addEventListener("popstate", function (event) {
  window.location.replace("../../exams%20dashboard/index.html");
});

window.addEventListener("DOMContentLoaded", async () => {
  const { data, error } = await getData(`http://localhost:3000/results/${Id}`);

  let answeredQuestions = data.score;
  let totalQuestions = data.total;

  const percentage = Math.round((answeredQuestions / totalQuestions) * 100);

  const circle = document.querySelector(".progress");
  const percentageText = document.getElementById("percentage");

  const radius = 70;
  const circumference = 2 * Math.PI * radius;

  circle.style.strokeDasharray = circumference;

  const offset = circumference - (percentage / 100) * circumference;
  circle.style.strokeDashoffset = offset;

  percentageText.textContent = percentage + "%";

  if (percentage >= 80) {
    circle.style.stroke = "#10b981";
    percentageText.style.color = "#10b981";
  } else if (percentage >= 50) {
    circle.style.stroke = "#f59e0b";
    percentageText.style.color = "#f59e0b";
  } else {
    circle.style.stroke = "#ef4444";
    percentageText.style.color = "#ef4444";
  }

  btnRetry.addEventListener("click", () => {
    window.location.replace(`../../detailed results/index.html?id=${data.id}`);
  });

  btnBack.addEventListener("click", () => {
    window.location.href = "../../exams%20dashboard/index.html";
  });
});
