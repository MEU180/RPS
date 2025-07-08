// თამაშის ლოგიკა
function play(userChoice) {
  const choices = ['rock', 'paper', 'scissors'];
  const computerChoice = choices[Math.floor(Math.random() * 3)];

  let resultText;
  let result;

  if (userChoice === computerChoice) {
    resultText = 'ფრეა!';
    result = 'draw';
  } else if (
    (userChoice === 'rock' && computerChoice === 'scissors') ||
    (userChoice === 'scissors' && computerChoice === 'paper') ||
    (userChoice === 'paper' && computerChoice === 'rock')
  ) {
    resultText = 'შენ მოიგე!';
    result = 'win';
  } else {
    resultText = 'კომპიუტერმა მოიგო!';
    result = 'lose';
  }

  document.getElementById('result').innerText =
    `შენ აირჩიე ${translate(userChoice)}, კომპიუტერმა - ${translate(computerChoice)}. ${resultText}`;

  updateStats(result);
}

// თარგმნა ქართულად
function translate(word) {
  return {
    rock: 'ქვა',
    paper: 'ქაღალდი',
    scissors: 'მაკრატელი'
  }[word];
}

// სტატისტიკის განახლება
function updateStats(result) {
  const currentUser = localStorage.getItem('currentUser');
  if (!currentUser) return;

  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const userIndex = users.findIndex(user => user.username === currentUser);
  if (userIndex === -1) return;

  users[userIndex].gamesPlayed += 1;
  if (result === 'win') users[userIndex].wins += 1;
  if (result === 'lose') users[userIndex].losses += 1;

  localStorage.setItem('users', JSON.stringify(users));
}

// რეგისტრაცია და ავტორიზაცია
document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('registerForm');
  const togglePassword = document.getElementById('togglePassword');
  const passwordInput = document.getElementById('regPassword');

  if (togglePassword && passwordInput) {
    togglePassword.addEventListener('click', () => {
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);
      togglePassword.textContent = type === 'text' ? '🙈' : '👁️';
    });
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const username = document.getElementById('regUsername').value.trim();
      const password = passwordInput.value.trim();

      const regexUser = /^[a-zA-Z0-9_]{3,}$/;
      const regexPass = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,}$/;

      if (!regexUser.test(username)) {
        alert('მომხმარებლის სახელი უნდა იყოს მინიმუმ 3 სიმბოლო, მხოლოდ ასოები და ციფრები');
        return;
      }

      if (!regexPass.test(password)) {
        alert('პაროლი უნდა იყოს მინიმუმ 5 სიმბოლო და შეიცავდეს ციფრსაც');
        return;
      }

      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const existingUser = users.find(user => user.username === username);

      if (existingUser) {
        if (existingUser.password === password) {
          localStorage.setItem('currentUser', username);
          alert('შესვლა წარმატებულია!');
          window.location.href = 'index.html';
        } else {
          alert('პაროლი არასწორია!');
        }
        return;
      }

      users.push({
        username,
        password,
        gamesPlayed: 0,
        wins: 0,
        losses: 0
      });

      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem('currentUser', username);
      alert('რეგისტრაცია წარმატებულია!');
      window.location.href = 'index.html';
    });
  }

  // გამოსვლის ღილაკი
  const logoutLink = document.getElementById('logout');
  if (logoutLink) {
    const user = localStorage.getItem('currentUser');
    logoutLink.style.display = user ? 'inline-block' : 'none';
    logoutLink.addEventListener('click', () => {
      localStorage.removeItem('currentUser');
      window.location.href = 'register.html';
    });
  }

  // სტატისტიკის გვერდის API ინფორმაცია
  const statsEl = document.getElementById("myStats");
  const apiList = document.getElementById("apiUsersList");

  if (statsEl) {
    const currentUser = localStorage.getItem("currentUser");
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find((u) => u.username === currentUser);
    if (user) {
      statsEl.innerText = `მომხმარებელი: ${user.username} | მოგებები: ${user.wins} | წაგებები: ${user.losses} | თამაშები: ${user.gamesPlayed}`;
    }
  }

  if (apiList) {
    fetch("https://randomuser.me/api/?results=5")
      .then((res) => res.json())
      .then((data) => {
        apiList.innerHTML = "";
        data.results.forEach((user, i) => {
          const li = document.createElement("li");
          li.innerText = `მოთამაშე ${i + 1}: ${user.name.first} ${user.name.last}`;
          apiList.appendChild(li);
        });
      })
      .catch(() => {
        apiList.innerText = "ვერ ჩაიტვირთა ინფორმაცია.";
      });
  }
});

// Scroll to Top Button
const scrollBtn = document.createElement("button");
scrollBtn.id = "scrollTopBtn";
scrollBtn.innerText = "↑";
document.body.appendChild(scrollBtn);

window.addEventListener("scroll", () => {
  scrollBtn.style.display = window.scrollY > 200 ? "block" : "none";
});

scrollBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

document.addEventListener("DOMContentLoaded", function () {
  const registerForm = document.getElementById('registerForm');
  const toggle = document.getElementById("togglePassword");
  const passwordInput = document.getElementById("regPassword");

  if (toggle && passwordInput) {
    toggle.addEventListener("change", () => {
      passwordInput.type = toggle.checked ? "text" : "password";
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const username = document.getElementById('regUsername').value.trim();
      const password = passwordInput.value.trim();
      const passwordRegex = /^(?=.*\d).{5,}$/; // მინ. 5 სიმბოლო და 1 ციფრი

      if (!username || !password) {
        alert("გთხოვ შეიყვანე ორივე ველი");
        return;
      }

      if (!passwordRegex.test(password)) {
        alert("პაროლი უნდა იყოს მინიმუმ 5 სიმბოლო და შეიცავდეს ერთ ციფრს!");
        return;
      }

      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const existingUser = users.find(user => user.username === username);

      if (existingUser) {
        if (existingUser.password === password) {
          localStorage.setItem('currentUser', username);
          alert('შესვლა წარმატებულია!');
          window.location.href = 'index.html';
        } else {
          alert('არასწორი პაროლი!');
        }
        return;
      }

      users.push({
        username,
        password,
        gamesPlayed: 0,
        wins: 0,
        losses: 0
      });

      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem('currentUser', username);
      alert('რეგისტრაცია წარმატებულია!');
      window.location.href = 'index.html';
    });
  }
});