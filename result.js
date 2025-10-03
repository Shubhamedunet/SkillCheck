// Redirect if no score found
if (!localStorage.getItem("quiz_score") || !localStorage.getItem("quiz_total") || !localStorage.getItem("quiz_review")) {
  window.location.href = "index.html";
}

const score = +localStorage.getItem("quiz_score");
const total = +localStorage.getItem("quiz_total");
const review = JSON.parse(localStorage.getItem("quiz_review"));

document.getElementById("finalScore").textContent = `Score: ${score}/${total} (${Math.round((score / total) * 100)}%)`;
document.getElementById("resultFeedback").textContent = score / total >= 0.7 ? "Great job!" : "Try again";

const list = document.getElementById("reviewList");
list.innerHTML = ""; // Clear before adding

// Helper to safely decode HTML entities
function decodeHtml(html) {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

// Populate review list
review.quizData.forEach((q, i) => {
  const li = document.createElement("li");
  const userCorrect = review.selectedAnswers[i] === q.correct_answer;
  li.innerHTML = `
    <strong>Q${i + 1}:</strong> ${decodeHtml(q.question)}<br>
    <span style="color:#4caf50;">Correct Answer: ${decodeHtml(q.correct_answer)}</span> | 
    <span style="color:${userCorrect ? "#4caf50" : "#e74c3c"};">
      Your Answer: ${decodeHtml(review.selectedAnswers[i] || "No answer")}
    </span>
  `;
  list.appendChild(li);
});
