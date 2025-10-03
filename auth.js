// Navbar toggle
document.getElementById("navToggle").onclick = () =>
  document.querySelector(".nav-links").classList.toggle("show");

// Modal elements
const loginModal = document.getElementById("loginModal");
const signupModal = document.getElementById("signupModal");

const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");
const aboutBtn = document.getElementById("aboutBtn");

const closeLogin = document.getElementById("closeLogin");
const closeSignup = document.getElementById("closeSignup");

// Safely attach handlers if elements exist
if (loginBtn && loginModal && closeLogin) {
  loginBtn.onclick = () => {
    loginModal.style.display = "flex";
    loginModal.focus();
  };
  closeLogin.onclick = () => (loginModal.style.display = "none");
}

if (signupBtn && signupModal && closeSignup) {
  signupBtn.onclick = () => {
    signupModal.style.display = "flex";
    signupModal.focus();
  };
  closeSignup.onclick = () => (signupModal.style.display = "none");
}
// Scroll to About section

if (aboutBtn) {
  aboutBtn.onclick = (e) => {
    e.preventDefault();
    document.getElementById("about").scrollIntoView({ behavior: "smooth" });
  };
}

// Unified window click handler to close any modal if clicked outside modal-content
window.onclick = function (event) {
  if (loginModal && event.target === loginModal) {
    loginModal.style.display = "none";
  }
  if (signupModal && event.target === signupModal) {
    signupModal.style.display = "none";
  }
};

// User storage: users object stores usernames as keys with details objects
function getUsers() {
  return JSON.parse(localStorage.getItem("quiz_users") || "{}");
}
function saveUsers(users) {
  localStorage.setItem("quiz_users", JSON.stringify(users));
}

// LOGIN form handling
document.getElementById("loginForm").onsubmit = function (e) {
  e.preventDefault();
  const uname = document.getElementById("loginUsername").value.trim();
  const pwd = document.getElementById("loginPassword").value;

  const users = getUsers();

  if (!uname || !pwd) {
    document.getElementById("loginError").textContent =
      "Please enter all fields.";
    return;
  }
  if (users[uname] && users[uname].password === pwd) {
    localStorage.setItem("quiz_current_user", uname);
    document.getElementById("loginError").textContent = "";
    window.location.href = "profile.html";
  } else {
    document.getElementById("loginError").textContent =
      "Invalid username or password.";
  }
};

// SIGNUP form handling
document.getElementById("signupForm").onsubmit = function (e) {
  e.preventDefault();
  const fullname = document.getElementById("signupFullname").value.trim();
  const uname = document.getElementById("signupUsername").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const pwd = document.getElementById("signupPassword").value;

  if (!fullname || !uname || !email || !pwd) {
    document.getElementById("signupError").textContent = "Fill in all fields!";
    return;
  }
  if (!/\S+@\S+\.\S+/.test(email)) {
    document.getElementById("signupError").textContent = "Enter a valid email.";
    return;
  }
  if (pwd.length < 5) {
    document.getElementById("signupError").textContent =
      "Password must be at least 5 characters.";
    return;
  }

  let users = getUsers();

  if (users[uname]) {
    document.getElementById("signupError").textContent =
      "Username already taken.";
    return;
  }

  users[uname] = { fullname, email, password: pwd, highscore: 0 };
  saveUsers(users);
  localStorage.setItem("quiz_current_user", uname);
  document.getElementById("signupError").textContent = "";
  window.location.href = "profile.html";
};
