import { postForm, getData } from "../../Apis.js";

const form = document.getElementById("registerForm");
const alertUI = document.querySelector(".alert");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  alertUI.classList.remove("success", "error", "show");

  const formData = Object.fromEntries(new FormData(form));

  for (let key in formData) {
    if (!formData[key].trim()) {
      showError("All fields are required ❌");
      return;
    }
  }

  if (!emailRegex.test(formData.emailAddress)) {
    showError("Invalid Email Format ❌");
    return;
  }

  if (formData.password.length < 6) {
    showError("Password must be at least 6 characters ❌");
    return;
  }

  if (formData.password !== formData.rePassword) {
    showError("Passwords do not match ❌");
    return;
  }

  const { data: existingUsers } = await getData(
    `http://localhost:3000/users?emailAddress=${formData.emailAddress}`,
  );

  if (existingUsers.length > 0) {
    showError("Email already registered ❌");
    return;
  }

  delete formData.rePassword;
  formData.role = "student";

  const { error } = await postForm(`http://localhost:3000/users`, formData);

  if (error) {
    showError("Server Error ❌");
    return;
  }

  showSuccess("Account Created Successfully ✅");

  window.location.href = "../../user login/index.html";
});

function showError(message) {
  setTimeout(() => {
    alertUI.textContent = message;
    alertUI.classList.add("error", "show");
  }, 10);
}

function showSuccess(message) {
  setTimeout(() => {
    alertUI.textContent = message;
    alertUI.classList.add("success", "show");
  }, 10);
}
