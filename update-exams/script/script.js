import { getData, deleteData, update } from "../../Apis.js";

const cardsGrid = document.querySelector("#cardsGrid");
const alertUI = document.querySelector(".alert");
const searchInput = document.querySelector("#searchInput");
const userName = document.querySelector(".user-name");
const btnLogout = document.getElementById("btnLogout");
const mobileToggle = document.getElementById("mobileToggle");
const navLinks = document.getElementById("navLinks");

mobileToggle.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

const cardColors = [
  "card-purple",
  "card-orange",
  "card-red",
  "card-green",
  "card-blue",
];

const userString = localStorage.getItem("user");
const user = JSON.parse(userString);

userName.textContent = `${user.firstName} ${user.listName}`;

if (btnLogout) {
  btnLogout.addEventListener("click", () => {
    localStorage.removeItem("user");
    window.location.href = "../../user login/index.html";
  });
}

let allExams = [];
function renderExams(examsList) {
  cardsGrid.innerHTML = "";

  if (examsList.length === 0) {
    cardsGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #888;">No exams found matching your search.</p>`;
    return;
  }

  examsList.forEach((exam, i) => {
    const colorClass = cardColors[i % cardColors.length];

    const examHTML = `
     <div class="exam-card ${colorClass}" data-id="${exam.id}">
  
  <div class="card-header">
    <span class="status-badge ${exam.isActive ? "status-active" : "status-inactive"}">
      ${exam.isActive ? "🟢 available" : "🔴 Not available"}
    </span>
  </div>

  <div class="card-body">
    <h3 class="exam-title">${exam.title}</h3>
    <div class="exam-meta">
      <div class="meta-pill">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#555" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
        <span>${exam.time} mins</span>
      </div>
    </div>
  </div>

  <div class="card-footer">
    <div class="admin-actions">
      <button class="btn-toggle ${exam.isActive ? "btn-disable" : "btn-enable"}" 
              onclick="toggleExam('${exam.id}', ${exam.isActive})">
        ${exam.isActive ? "🔴 Disable" : "🟢 Active"}
      </button>
      <button class="btn-timer" onclick="editTimer('${exam.id}')">
        ⏱ Time update
      </button>
      <button class="btn-delete" onclick="deleteExam('${exam.id}')">
    ❌
      </button>
    </div>
  </div>

</div>`;
    cardsGrid.insertAdjacentHTML("beforeend", examHTML);
  });
}
searchInput.addEventListener("input", (e) => {
  const searchTerm = e.target.value.toLowerCase().trim();
  const filteredExams = allExams.filter((exam) =>
    exam.title.toLowerCase().includes(searchTerm),
  );
  renderExams(filteredExams);
});

document.addEventListener("DOMContentLoaded", async () => {
  const { data, error } = await getData(`http://localhost:3000/exams`);

  if (error) {
    showError("Error fetching data: " + error);
    return;
  }
  allExams = data;
  renderExams(allExams);
});

function showError(message) {
  alertUI.textContent = message;
  alertUI.classList.add("error", "show");
}

window.deleteExam = async (id) => {
  if (!confirm("Are you sure you want to delete this exam?")) return;

  const { error } = await deleteData(`http://localhost:3000/exams/${id}`);

  if (error) {
    showError("Exam deletion failed❌");
    return;
  }

  location.reload();
};
window.editTimer = editTimer;
window.toggleExam = toggleExam;

async function editTimer(id) {
  const Time = prompt();
  const { data, error } = await update(
    `http://localhost:3000/exams/${id}`,
    "time",
    Number(Time),
  );
}
async function toggleExam(id, isActive) {
  const { data, error } = await update(
    `http://localhost:3000/exams/${id}`,
    "isActive",
    !isActive,
  );
}
