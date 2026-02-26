import { getData } from "../../Apis.js";

const cardsGrid = document.querySelector("#cardsGrid");
const alertUI = document.querySelector(".alert");
const searchInput = document.querySelector("#searchInput");
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

if (user) {
  userName.textContent = `${user.firstName} ${user.listName}`;
}

if (btnLogout) {
  btnLogout.addEventListener("click", () => {
    localStorage.removeItem("user");
    window.location.href = "../../user login/index.html";
  });
}

let allResults = [];
let allExams = [];
let allUsers = []; 

function renderResults(resultsList) {
  cardsGrid.innerHTML = "";

  if (resultsList.length === 0) {
    cardsGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #888;">No results found.</p>`;
    return;
  }

  resultsList.forEach((result, i) => {
    const colorClass = cardColors[i % cardColors.length];
    const percentage = Math.round((result.score / result.total) * 100) || 0; 
    const scoreColor = percentage >= 50 ? "#10b981" : "#ef4444";
    const dateObj = new Date(result.submittedAt);
    const dateStr = dateObj.toLocaleDateString();
    const timeStr = dateObj.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const resultHTML = `
      <div class="exam-card ${colorClass}" data-id="${result.id}">
        <div class="card-header">
          <span class="subject-tag" style="background-color: rgba(0,0,0,0.05); color: #333;">
             ${result.studentName}
          </span>
          <span style="font-size: 13px; color: ${scoreColor}; font-weight: bold; background: white; padding: 2px 8px; border-radius: 10px;">
            ${percentage}%
          </span>
        </div>

        <div class="card-body">
          <h3 class="exam-title" style="font-size: 16px;" >${result.examTitle}</h3>

          <div class="exam-meta">
            <div class="meta-pill" style="color: ${scoreColor}; font-weight: bold;">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <span>Score: ${result.score} / ${result.total}</span>
            </div>
          </div>
        </div>

        <div class="card-footer">
          <span class="added-label">SUBMITTED AT</span>
          <div class="teacher-info">
            <span class="teacher-name">${dateStr} - ${timeStr}</span> 
          </div>
        </div>
      </div>`;

    cardsGrid.insertAdjacentHTML("beforeend", resultHTML);
  });
}
searchInput.addEventListener("input", (e) => {
  const searchTerm = e.target.value.toLowerCase().trim();
  const filteredResults = allResults.filter(
    (result) =>
      result.examTitle.toLowerCase().includes(searchTerm) ||
      result.studentName.toLowerCase().includes(searchTerm),
  );
  renderResults(filteredResults);
});

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const examsResponse = await getData(`http://localhost:3000/exams`);
    if (examsResponse.error) throw new Error(examsResponse.error);
    allExams = examsResponse.data;
    const usersResponse = await getData(`http://localhost:3000/users`);
    if (usersResponse.error) throw new Error(usersResponse.error);
    allUsers = usersResponse.data;
    const resultsResponse = await getData(`http://localhost:3000/results`);
    if (resultsResponse.error) throw new Error(resultsResponse.error);

    allResults = resultsResponse.data.map((result) => {
      const examDetails = allExams.find((e) => e.id === result.examId);
      const studentDetails = allUsers.find(
        (u) => String(u.id) === String(result.userId),
      );

      return {
        ...result,
        examTitle: examDetails ? examDetails.title : "Unknown Exam",
        studentName: studentDetails
          ? `${studentDetails.firstName} ${studentDetails.listName}`
          : "Unknown Student",
      };
    });

    allResults.sort(
      (a, b) => new Date(b.submittedAt) - new Date(a.submittedAt),
    );

    renderResults(allResults);
  } catch (error) {
    showError("Error fetching data: " + error.message);
  }
});

function showError(message) {
  alertUI.textContent = message;
  alertUI.classList.add("error", "show");
  setTimeout(() => {
    alertUI.classList.remove("show");
  }, 3000);
}
