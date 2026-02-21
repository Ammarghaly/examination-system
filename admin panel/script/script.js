import { postForm } from "../../Apis.js";
const alertUI = document.querySelector(".alert");

const span = document.querySelector("span");
const ul = document.querySelector("ul");

span.addEventListener("click", () => {
  ul.classList.toggle("active");
});

///////////////////////////////////////////////////////
const addQuestion = document.getElementById("addQuestion");
const containerQuestion = document.getElementById("containerQuestion");

addQuestion.addEventListener("click", () => {
  const questionId = Date.now();
  const question = `<div class="container-question">
      <span class="remove-question">&#10006;</span>
      <div class="field">
        <label for="questionText">Text Question</label>
        <textarea class="questionText" name="question_${questionId}" rows="4" placeholder="Write the question here"></textarea>
      </div>

      <div class="question">
        <label class="question-label">Answer Option</label>

        <div class="options">
          <div class="option">
            <input id="opt1" name="answer_${questionId}" type="radio" value="1" />
            <input type="text"  name="answer_${questionId}" placeholder="Option 1" />
          </div>

          <div class="option">
            <input id="opt2" name="answer_${questionId}" type="radio" value="2" />
            <input type="text"  name="answer_${questionId}" placeholder="Option 2" />
          </div>

          <div class="option">
            <input id="opt3" name="answer_${questionId}" type="radio" value="3" />
            <input type="text"  name="answer_${questionId}" placeholder="Option 3" />
          </div>

          <div class="option">
            <input id="opt4" name="answer_${questionId}" type="radio" value="4" />
            <input type="text"  name="answer_${questionId}" placeholder="Option 4" />
          </div>
        </div>
      </div>
    </div>`;
  containerQuestion.insertAdjacentHTML("beforeend", question);
});

containerQuestion.addEventListener("click", (e) => {
  if (e.target.classList.contains("remove-question")) {
    e.target.closest(".container-question").remove();
  }
});

//////////////////////////////////////////////////////////////////////////////////////////

const form = document.getElementById("infoExams");
let newExam = {};
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  alertUI.classList.remove("success", "error", "show");
  const title = document.getElementById("examTitle").value;
  const time = document.getElementById("examTime").value;
  let questionElements = document.querySelectorAll(".container-question");
  let questions = [];
  let hasError = false;

  if (!title) {
    showError("Exam title is required ❌");
    return;
  }
  if (!time || isNaN(time) || Number(time) < 1) {
    showError("Exam time must be a valid number ❌");
    return;
  }

  for (let index = 0; index < questionElements.length; index++) {
    const que = questionElements[index];
    const questionText = que.querySelector(".questionText").value;
    const optionElements = que.querySelectorAll(".option");

    if (!questionText) {
      showError(`Question ${index + 1} text is required ❌`);
      hasError = true;
      break;
    }

    let options = [];
    let correctAnswer;
    for (let i = 0; i < optionElements.length; i++) {
      const op = optionElements[i];
      let text = op.querySelector('input[type="text"]').value;
      const radio = op.querySelector("input[type='radio']");

      if (!text) {
        showError(`Option ${i + 1} in Question ${index + 1} is empty ❌`);
        hasError = true;
        break;
      }

      options.push(text);
      if (radio.checked) correctAnswer = text;
    }

    if (hasError) break;
    if (!correctAnswer) {
      showError(`Select correct answer for Question ${index + 1} ❌`);
      hasError = true;
      break;
    }
    questions.push({
      id: "q" + Math.random().toString(36).substr(2, 9),
      question: questionText,
      options,
      correctAnswer,
    });
  }

  if (hasError) return;

  newExam = {
    id: "e" + Date.now(),
    teacherId: "t1",
    examCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
    isActive: false,
    title: title,
    time: time,
    questions: questions,
  };

  const { data, error } = await postForm(
    "http://localhost:3000/exams",
    newExam,
  );

  if (error) {
    showError("Server Error ❌");
    return;
  }

  showSuccess("Exam Created Successfully ✅");
  
  setTimeout(() => {
    form.reset();
    document.getElementById("containerQuestion").innerHTML = "";
    alertUI.classList.remove("show", "success");
    window.location.href='../../exams%20dashboard/index.html'
  }, 2000);
});
function showError(message) {
  alertUI.textContent = message;
  alertUI.classList.add("error", "show");
}

function showSuccess(message) {
  alertUI.textContent = message;
  alertUI.classList.add("success", "show");
}