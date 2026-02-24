import { getData, update } from "../Apis.js";

const emailForm = document.getElementById("emailForm");
const answerForm = document.getElementById("answerForm");
const emailInput = document.getElementById("emailInput");
const answerInput = document.getElementById("answerInput");
const questionText = document.getElementById("questionText");
const newPasswordForm = document.getElementById("newPasswordForm");
const newPasswordInput = document.getElementById("newPasswordInput");
const alertUI = document.querySelector(".alert");

let currentUser = null;

emailForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const { data, error } = await getData(`http://localhost:3000/users`);

  const user = data.find((u) => {
    return u.emailAddress.toLowerCase() === emailInput.value.toLowerCase();
  });

  if (!user) {
    showError("Email not found ❌");
    return;
  }
  currentUser = user;
  questionText.textContent = currentUser.question;
  emailForm.style.display = "none";
  answerForm.style.display = "flex";
});
answerForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (
    currentUser.answer.toLowerCase() === answerInput.value.trim().toLowerCase()
  ) {
    answerForm.style.display = "none";
    newPasswordForm.style.display = "flex";
  } else {
    showError("Wrong Answer ❌");
  }
});
newPasswordForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!newPasswordInput.value.trim()) {
    showError("Password cannot be empty ❌");
    return;
  }

  try {
    const res = await update(
      `http://localhost:3000/users/${currentUser.id}`,
      "password",
      newPasswordInput.value,
    );
    window.location.replace("http://127.0.0.1:5500/user%20login/index.html");
  } catch (err) {
    showError(err);
  }
});
function showError(message) {
  alertUI.textContent = message;
  alertUI.classList.add("error", "show");
}
const userString = localStorage.getItem("user");
if (userString) {
  window.location.replace("../../exams dashboard/index.html");
}