import { getData } from "../../Apis.js";

const inputEmail = document.querySelector('input[type="text"]');
const inputPassword = document.querySelector('input[type="password"]');
const loginBtn = document.querySelector("#login");
const alertUI = document.querySelector(".alert");

loginBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  alertUI.classList.remove("success", "error", "show");

  if (!inputEmail.value.trim() || !inputPassword.value.trim()) {
    showError("Please fill in all fields ❌");
    return;
  }

  const { data, error } = await getData("http://localhost:3000/users");

  if (error) {
   showError("Server Error ❌");
    return;
  }

  const user = data.find((user) => {
    return (
      user.emailAddress === inputEmail.value &&
      user.password === inputPassword.value
    );
  });

  if (user) {
   showSuccess("Login Successful ✅");

    localStorage.setItem("user", JSON.stringify(user));
    window.location.replace("../../exams dashboard/index.html");
  } else {
    showError("Invalid Email or Password ❌");
  }
});

const userString = localStorage.getItem("user");
if (userString) {
  window.location.replace("../../exams dashboard/index.html");
}

function showError(message) {
  alertUI.textContent = message;
  alertUI.classList.add("error", "show");
}
function showSuccess(message) {
  alertUI.textContent = message;
  alertUI.classList.add("success", "show");
}
