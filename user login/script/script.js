import { getData } from "../../Apis.js";

const inputEmail = document.querySelector('input[type="text"]');
const inputPassword = document.querySelector('input[type="password"]');
const loginBtn = document.querySelector("#login");
const alertUI = document.querySelector(".alert");


loginBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  alertUI.classList.remove("success", "error", "show");

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
    alertUI.classList.add("success");
    localStorage.setItem("user", JSON.stringify(user));
  } else {
    alertUI.innerHTML = "Invalid Email or Password ❌";
    alertUI.classList.add("error");
  }

  alertUI.classList.add("show");
});
