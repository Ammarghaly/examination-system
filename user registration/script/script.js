import { getData, postForm } from "../../Apis.js";
import { showSuccess, showError } from "../../globalCss/toast.js";

const formReg = document.forms[0];

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// ─── Field references ───
const fields = {
  firstName: document.getElementById("firstName"),
  listName: document.getElementById("listName"),
  emailAddress: document.getElementById("emailAddress"),
  password: document.getElementById("password"),
  rePassword: document.getElementById("rePassword"),
  question: document.getElementById("question"),
  answer: document.getElementById("answer"),
};

// ─── Error message elements ───
const errors = {
  firstName: document.getElementById("firstNameError"),
  listName: document.getElementById("listNameError"),
  emailAddress: document.getElementById("emailAddressError"),
  password: document.getElementById("passwordError"),
  rePassword: document.getElementById("rePasswordError"),
  question: document.getElementById("questionError"),
  answer: document.getElementById("answerError"),
};

// ─── Password rule elements ───
const passwordRules = {
  length: document.querySelector('[data-rule="length"]'),
  uppercase: document.querySelector('[data-rule="uppercase"]'),
  lowercase: document.querySelector('[data-rule="lowercase"]'),
  number: document.querySelector('[data-rule="number"]'),
  special: document.querySelector('[data-rule="special"]'),
};

// Track which fields have been touched (focused then blurred)
const touched = {};

// ─── Validation functions per field ───
function validateField(name) {
  const value = fields[name].value.trim();
  let errorMsg = "";

  switch (name) {
    case "firstName":
    case "listName":
    case "question":
    case "answer":
      if (!value) errorMsg = "This field is required";
      break;

    case "emailAddress":
      if (!value) errorMsg = "This field is required";
      else if (!emailRegex.test(value)) errorMsg = "Invalid email format";
      break;

    case "password":
      if (!value) errorMsg = "Password is required";
      break;

    case "rePassword":
      if (!value) errorMsg = "This field is required";
      else if (value !== fields.password.value)
        errorMsg = "Passwords do not match";
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
    // Only mark valid if the field has a value
    if (value) {
      fields[name].classList.add("valid");
    } else {
      fields[name].classList.remove("valid");
    }
    return true;
  }
}

// ─── Password rules live check ───
function updatePasswordRules() {
  const val = fields.password.value;

  const checks = {
    length: val.length >= 6,
    uppercase: /[A-Z]/.test(val),
    lowercase: /[a-z]/.test(val),
    number: /\d/.test(val),
    special: /[^a-zA-Z0-9]/.test(val),
  };

  for (const rule in checks) {
    const li = passwordRules[rule];
    const bullet = li.querySelector(".bullet");
    if (checks[rule]) {
      li.classList.add("met");
      bullet.textContent = "✓";
    } else {
      li.classList.remove("met");
      bullet.textContent = "●";
    }
  }

  return Object.values(checks).every(Boolean);
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
      // Also update password rules on password blur
      if (name === "password") {
        updatePasswordRules();
      }
    }
  });
}

// ─── Live password rules update on input ───
fields.password.addEventListener("input", () => {
  updatePasswordRules();
  // If the field has been touched and blurred before, re-validate on input too
  if (touched.password) {
    validateField("password");
  }
});

// ─── Re-validate rePassword when password changes (if rePassword was touched) ───
fields.password.addEventListener("input", () => {
  if (touched.rePassword && fields.rePassword.value) {
    validateField("rePassword");
  }
});

// ─── Form submit ───
formReg.addEventListener("submit", async (e) => {
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

  // Check password rules
  const passwordRulesOk = updatePasswordRules();
  if (!passwordRulesOk) {
    allValid = false;
    errors.password.textContent =
      "Password must meet all requirements above";
    errors.password.classList.add("show");
    fields.password.classList.add("invalid");
    fields.password.classList.remove("valid");
  }

  if (!allValid) {
    showError("Please fill in all fields correctly ❌");
    return;
  }

  const formData = Object.fromEntries(new FormData(formReg));

  const { data } = await getData(
    `http://localhost:3000/users?emailAddress=${formData.emailAddress}`
  );

  if (data.length > 0) {
    errors.emailAddress.textContent = "Email already registered";
    errors.emailAddress.classList.add("show");
    fields.emailAddress.classList.add("invalid");
    fields.emailAddress.classList.remove("valid");
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
  
  // Set flag for login page to show toast
  sessionStorage.setItem("registrationSuccess", "true");
  
  window.location.href = "../user login/index.html";

});
