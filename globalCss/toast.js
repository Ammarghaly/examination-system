// ─── Global Toast Notification Module ───
// This module creates and manages a single global toast element.
// You do not need to add <div class="alert"></div> to your HTML.

let toastElement = null;
let toastTimeout = null;

/**
 * Creates the toast DOM element if it doesn't exist
 */
function createToastElement() {
  if (!toastElement) {
    toastElement = document.createElement("div");
    toastElement.className = "alert";
    
    // Add inner structure for icon and text
    toastElement.innerHTML = `
      <span class="alert-icon"></span>
      <span class="alert-text"></span>
    `;
    
    document.body.appendChild(toastElement);
  }
}

/**
 * Displays a toast message
 * @param {string} message - The message to display
 * @param {string} type - 'success' or 'error'
 */
function showToast(message, type) {
  createToastElement();

  // Clear any existing timeouts to prevent overlapping animations
  if (toastTimeout) {
    clearTimeout(toastTimeout);
  }

  const iconSpan = toastElement.querySelector(".alert-icon");
  const textSpan = toastElement.querySelector(".alert-text");

  // Reset classes
  toastElement.className = "alert";
  toastElement.classList.remove("show");

  // Set message and icon based on type
  textSpan.textContent = message;
  
  if (type === "success") {
    toastElement.classList.add("success");
    iconSpan.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
    `;
  } else if (type === "error") {
    toastElement.classList.add("error");
    iconSpan.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="15" y1="9" x2="9" y2="15"></line>
        <line x1="9" y1="9" x2="15" y2="15"></line>
      </svg>
    `;
  }

  // Force reflow to restart animation correctly if re-triggered quickly
  void toastElement.offsetWidth;

  // Show the toast
  setTimeout(() => {
    toastElement.classList.add("show");
  }, 10);

  // Hide it after 3 seconds
  toastTimeout = setTimeout(() => {
    toastElement.classList.remove("show");
  }, 3000);
}

/**
 * Display a green success toast
 * @param {string} message 
 */
export function showSuccess(message) {
  showToast(message, "success");
}

/**
 * Display a red error toast
 * @param {string} message 
 */
export function showError(message) {
  showToast(message, "error");
}
