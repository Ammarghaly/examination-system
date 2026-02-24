import { getData } from "../../Apis.js";

const inputEmail = document.querySelector('input[type="text"]');
const inputPassword = document.querySelector('input[type="password"]');
const loginBtn = document.querySelector("#login");
const alertUI = document.querySelector(".alert");


loginBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  alertUI.classList.remove("success", "error", "show");

  if (!inputEmail.value.trim() || !inputPassword.value.trim()) {
    alertUI.innerHTML = "Please fill in all fields ❌";
    alertUI.classList.add("error", "show");
    return;
  }

  const { data, error } = await getData("http://localhost:3000/users");

  if (error) {
    alertUI.innerHTML = "Server Error ❌";
    alertUI.classList.add("error", "show");
    return;
  }

  const user = data.find((user) => {
    return (
      user.emailAddress === inputEmail.value &&
      user.password === inputPassword.value
    );
  });

  if (user) {
    alertUI.innerHTML = "Login Successful ✅";
    alertUI.classList.add("success", "show");
    localStorage.setItem("user", JSON.stringify(user));
    window.location.replace("../../exams dashboard/index.html");
  } else {
    alertUI.innerHTML = "Invalid Email or Password ❌";
    alertUI.classList.add("error", "show");
  }
});

const userString = localStorage.getItem("user");
if (userString) {
  window.location.replace("../../exams dashboard/index.html");
}