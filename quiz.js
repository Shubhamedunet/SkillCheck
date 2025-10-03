const themeToggle = document.getElementById("theme-toggle");

themeToggle.onclick = () => {
  document.body.classList.toggle("dark-mode");
  const isDark = document.body.classList.contains("dark-mode");
  localStorage.setItem("quiz_theme", isDark ? "dark" : "light");
  themeToggle.textContent = isDark ? "🌞" : "🌙";
};

window.onload = () => {
  const savedTheme = localStorage.getItem("quiz_theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    themeToggle.textContent = "🌞";
  } else {
    document.body.classList.remove("dark-mode");
    themeToggle.textContent = "🌙";
  }
  loadQuiz();
};

// Quiz variables
const totalQuestions = 10;
const timePerQuestion = 20;
const username = localStorage.getItem("quiz_current_user");
if (!username) window.location.href = "index.html";

const category = localStorage.getItem("quiz_category");

let quizData = [];
let currentQ = 0;
let score = 0;
let selectedAnswers = [];
let correctAnswers = [];
let timer, timeLeft;

const questionContainer = document.getElementById("question-container");
const optionsDiv = document.getElementById("options");
const feedback = document.getElementById("feedback");
const nextBtn = document.getElementById("nextBtn");
const restartBtn = document.getElementById("restartBtn");
const timerDiv = document.getElementById("timer");
const progressBarFill = document.getElementById("progress-fill");

function updateProgressBar() {
  const percent = ((currentQ + 1) / totalQuestions) * 100;
  progressBarFill.style.width = percent + "%";
}

function startTimer() {
  timeLeft = timePerQuestion;
  timerDiv.textContent = `Time Left: ${timeLeft}s`;
  progressBarFill.style.transition = "width 1s linear";
  // Use CSS variable directly for progress fill color
  progressBarFill.style.backgroundColor = getComputedStyle(document.body).getPropertyValue('--progress-fill').trim() || '#00bcd4';
  clearInterval(timer);
  timer = setInterval(() => {
    timeLeft--;
    timerDiv.textContent = `Time Left: ${timeLeft}s`;
    progressBarFill.style.width = ((timeLeft / timePerQuestion) * 100).toFixed(2) + "%";
    if (timeLeft <= 0) {
      clearInterval(timer);
      disableOptions();
      feedback.textContent = "Time's up!";
      nextBtn.disabled = false;
    }
  }, 1000);
}

function decodeHtml(html) {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function disableOptions() {
  Array.from(optionsDiv.children).forEach(btn => (btn.disabled = true));
}

function showQuestion() {
  updateProgressBar();
  feedback.textContent = "";
  nextBtn.disabled = true;
  startTimer();

  const q = quizData[currentQ];
  questionContainer.textContent = `Q${currentQ + 1}/${totalQuestions}: ${decodeHtml(q.question)}`;

  let opts = [...q.incorrect_answers, q.correct_answer];
  shuffle(opts);

  optionsDiv.innerHTML = "";
  opts.forEach(option => {
    const btn = document.createElement("button");
    btn.className = "option";
    btn.textContent = decodeHtml(option);
    btn.onclick = () => checkAnswer(option);
    optionsDiv.appendChild(btn);
  });
}

function checkAnswer(selected) {
  clearInterval(timer);
  selectedAnswers[currentQ] = selected;
  nextBtn.disabled = false;
  disableOptions();

  const correct = quizData[currentQ].correct_answer;
  correctAnswers[currentQ] = correct;

  Array.from(optionsDiv.children).forEach(btn => {
    if (decodeHtml(btn.textContent) === correct) btn.classList.add("correct");
    if (decodeHtml(btn.textContent) === selected && selected !== correct) btn.classList.add("incorrect");
  });

  if (selected === correct) {
    score++;
    feedback.textContent = "Correct!";
  } else {
    feedback.textContent = "Wrong!";
  }
}

function finishQuiz() {
  const users = JSON.parse(localStorage.getItem("quiz_users") || "{}");
  if (score > (users[username]?.highscore || 0)) {
    users[username].highscore = score;
    localStorage.setItem("quiz_users", JSON.stringify(users));
  }

  localStorage.setItem("quiz_score", score);
  localStorage.setItem("quiz_total", totalQuestions);
  localStorage.setItem("quiz_review", JSON.stringify({ selectedAnswers, correctAnswers, quizData }));

  window.location.href = "result.html";
}

async function loadQuiz() {
  try {
    const res = await fetch(`https://opentdb.com/api.php?amount=${totalQuestions}&category=${category}&type=multiple`);
    const data = await res.json();
    quizData = data.results;
    showQuestion();
  } catch (e) {
    questionContainer.textContent = "Error loading quiz questions. Please try again later.";
    nextBtn.disabled = true;
  }
}

nextBtn.onclick = () => {
  currentQ++;
  if (currentQ >= totalQuestions) {
    finishQuiz();
  } else {
    showQuestion();
  }
};

restartBtn.onclick = () => window.location.reload();
