import { getData } from "../../Apis.js";
import { showSuccess, showError } from "../../globalCss/toast.js";

const form = document.getElementById("loginForm");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// ─── Field references ───
const fields = {
  email: document.getElementById("email"),
  password: document.getElementById("password"),
};

// ─── Error message elements ───
const errors = {
  email: document.getElementById("emailError"),
  password: document.getElementById("passwordError"),
};

// Track which fields have been touched
const touched = {};

// ─── Validation functions per field ───
function validateField(name) {
  const value = fields[name].value.trim();
  let errorMsg = "";

  switch (name) {
    case "email":
      if (!value) errorMsg = "This field is required";
      else if (!emailRegex.test(value)) errorMsg = "Invalid email format";
      break;

    case "password":
      if (!value) errorMsg = "Password is required";
      break;
  }

  // Show / hide error
  if (errorMsg) {
    errors[name].textContent = errorMsg;
    errors[name].classList.add("show");
    fields[name].classList.add("invalid");
    fields[name].classList.remove("valid");
    return false;
  } else {
    errors[name].textContent = "";
    errors[name].classList.remove("show");
    fields[name].classList.remove("invalid");
    if (value) {
      fields[name].classList.add("valid");
    } else {
      fields[name].classList.remove("valid");
    }
    return true;
  }
}

// ─── Attach blur listeners (touch-based validation) ───
for (const name in fields) {
  const input = fields[name];

  input.addEventListener("focus", () => {
    touched[name] = true;
  });

  input.addEventListener("blur", () => {
    if (touched[name]) {
      validateField(name);
    }
  });
}

// ─── Form submit ───
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Mark all as touched
  for (const name in fields) {
    touched[name] = true;
  }

  // Validate all fields
  let allValid = true;
  for (const name in fields) {
    const isValid = validateField(name);
    if (!isValid) allValid = false;
  }

  if (!allValid) return;

  const { data, error } = await getData("http://localhost:3000/users");

  if (error) {
    showError("Server Error ❌");
    return;
  }

  const user = data.find((u) => {
    return (
      u.emailAddress === fields.email.value &&
      u.password === fields.password.value
    );
  });

  if (user) {
    showSuccess("Login Successful ✅");
    localStorage.setItem("user", JSON.stringify(user));
    window.location.replace("../../exams dashboard/index.html");
  } else {
    // Show inline error on email field
    errors.email.textContent = "Invalid Email or Password";
    errors.email.classList.add("show");
    fields.email.classList.add("invalid");
    fields.email.classList.remove("valid");
  }
});

const userString = localStorage.getItem("user");
if (userString) {
  window.location.replace("../../exams dashboard/index.html");
}

// ─── Show registration success toast if directed here from registration ───
if (sessionStorage.getItem("registrationSuccess")) {
  showSuccess("Account Created Successfully ✅");
  sessionStorage.removeItem("registrationSuccess");
}


