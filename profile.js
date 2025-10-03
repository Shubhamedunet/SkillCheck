// Navbar toggle
document.getElementById("navToggle").onclick = () =>
  document.querySelector(".nav-links").classList.toggle("show");

// Load current user info from localStorage
const currentUser = localStorage.getItem("quiz_current_user");
const users = JSON.parse(localStorage.getItem("quiz_users") || "{}");

// Redirect if not logged in or user data missing
if (!currentUser || !users[currentUser]) {
  window.location.href = "index.html";
} else {
  const user = users[currentUser];
  document.getElementById("profileName").textContent =
    user.fullname || currentUser;
  document.getElementById("profileEmail").textContent =
    user.email || "Not provided";
  document.getElementById("profileHighscore").textContent =
    user.highscore + " ⭐";
}

// Logout logic
function logoutUser() {
  localStorage.removeItem("quiz_current_user");
  window.location.href = "index.html";
}
document.getElementById("logoutMainBtn").onclick = logoutUser;
const logoutLink = document.getElementById("logoutBtn");
if (logoutLink) logoutLink.onclick = logoutUser;

// Elements references
const profileSection = document.querySelector(".profile-section");
const quizSection = document.querySelector(".quiz-selection");
const profileBtn = document.getElementById("profileBtn");
const takeQuizBtn = document.getElementById("takeQuizBtn");

// Hide profile section, show quiz section initially
if (profileSection) profileSection.style.display = "none";
if (quizSection) quizSection.style.display = "block";

// Toggle profile/quiz sections on profileBtn click
if (profileBtn) {
  profileBtn.onclick = function (e) {
    e.preventDefault();
    if (!profileSection || !quizSection) return;

    if (profileSection.style.display === "none") {
      profileSection.style.display = "block";
      quizSection.style.display = "none";
      profileSection.scrollIntoView({ behavior: "smooth" });
    } else {
      profileSection.style.display = "none";
      quizSection.style.display = "block";
      quizSection.scrollIntoView({ behavior: "smooth" });
    }
  };
}

// Take Quiz button redirects to select.html
if (takeQuizBtn) {
  takeQuizBtn.onclick = function (e) {
    e.preventDefault();
    window.location.href = "select.html";
  };
}

// Load quiz categories dynamically from Open Trivia DB
async function loadCategories() {
  try {
    const res = await fetch("https://opentdb.com/api_category.php");
    if (!res.ok) throw new Error("Failed to load categories");
    const data = await res.json();
    const container = document.getElementById("categoryContainer");
    container.innerHTML = "";
    data.trivia_categories.forEach((cat, idx) => {
      const btn = document.createElement("button");
      btn.textContent = cat.name;
      btn.dataset.catId = cat.id;
      btn.title = "Start quiz in " + cat.name;
      btn.onclick = () => startQuiz(cat.id, cat.name);
      container.appendChild(btn);
    });
  } catch (err) {
    document.getElementById("categoryContainer").textContent =
      "Failed to load categories. Please refresh.";
    console.error(err);
  }
}

// Start quiz: set localStorage category and redirect to quiz page
function startQuiz(categoryId, categoryName) {
  localStorage.setItem("quiz_category", categoryId);
  localStorage.setItem("quiz_category_name", categoryName);
  window.location.href = "quiz.html";
}

window.onload = loadCategories;
