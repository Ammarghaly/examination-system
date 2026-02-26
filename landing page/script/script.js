const userString = localStorage.getItem("user");
if (userString) {
  window.location.replace("../../exams dashboard/index.html");
}
