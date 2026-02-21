import { getData } from "../../Apis.js";

const cardsGrid = document.querySelector("#cardsGrid");
const alertUI = document.querySelector(".alert");
const searchInput = document.querySelector("#searchInput");
const addExamCard = document.querySelector(".add-exam-card");
const userName = document.querySelector(".user-name");
const btnLogout = document.getElementById("btnLogout");

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

if (userString) {
  if (user.role === "admin") {
    addExamCard.style.display = "block";
  }
}
addExamCard.addEventListener('click',()=>{
  window.location.href = "../../admin panel/index.html";
})

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
    const subjectName = exam.title || "EXAM";

    const examHTML = `
      <div class="exam-card ${colorClass}">
        <div class="card-header">
          <span class="subject-tag">${subjectName}</span>
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
            <div class="meta-pill">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#555" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
              <span>${exam.questions.length} Qs</span>
            </div>
          </div>
        </div>

        <div class="card-footer">
          <span class="added-label">ADDED BY</span>
          <div class="teacher-info">
            <img src="./images/unnamed (1).png" alt="Teacher" class="teacher-avatar" />
            <span class="teacher-name">Mr. Teacher</span> 
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
