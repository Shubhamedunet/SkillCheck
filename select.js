if (!localStorage.getItem('quiz_current_user')) {
  window.location.href = 'index.html';
}

// Fetch categories from Open Trivia DB and populate select
fetch('https://opentdb.com/api_category.php')
  .then(res => res.json())
  .then(data => {
    const categorySelect = document.getElementById('category');
    data.trivia_categories.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat.id;
      option.textContent = cat.name;
      categorySelect.appendChild(option);
    });
  })
  .catch(() => {
    const categorySelect = document.getElementById('category');
    categorySelect.innerHTML = '<option disabled>Failed to load categories</option>';
  });

document.getElementById('selectForm').onsubmit = function(e) {
  e.preventDefault();
  const category = document.getElementById('category').value;
  const difficulty = document.getElementById('difficulty').value;
  localStorage.setItem('quiz_category', category);
  localStorage.setItem('quiz_difficulty', difficulty);
  window.location.href = 'quiz.html';
};
