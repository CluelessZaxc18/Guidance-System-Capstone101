document.addEventListener("DOMContentLoaded", () => {
  const activeUser = JSON.parse(localStorage.getItem('gpath_active_user'));

  if (!activeUser) {
    window.location.href = 'Login.html';
    return;
  }

  const nameInput = document.getElementById('accFullName');
  const emailInput = document.getElementById('accEmail');
  const positionInput = document.getElementById('accPosition');
  const passwordInput = document.getElementById('accPassword');
  const pinDisplay = document.getElementById('accPinDisplay');
  const togglePinBtn = document.getElementById('togglePinVisibility');
  const idDisplayImg = document.getElementById('accountIdDisplayImg');

  if (nameInput) nameInput.value = activeUser.name || '';
  if (emailInput) emailInput.value = activeUser.email || '';
  if (positionInput) positionInput.value = activeUser.position || 'Guidance Staff';
  if (passwordInput) passwordInput.value = activeUser.password || '';

  const userPin = activeUser.pin || '------';
  let isPinVisible = false;

  if (pinDisplay) {
    pinDisplay.textContent = '•'.repeat(userPin.length);
  }

  if (togglePinBtn && pinDisplay) {
    togglePinBtn.addEventListener('click', () => {
      isPinVisible = !isPinVisible;
      if (isPinVisible) {
        pinDisplay.textContent = userPin;
        togglePinBtn.className = "fa-regular fa-eye";
      } else {
        pinDisplay.textContent = '•'.repeat(userPin.length);
        togglePinBtn.className = "fa-regular fa-eye-slash";
      }
    });
  }

  if (idDisplayImg) {
    if (activeUser.email.toLowerCase() === "guidancecounselor@gmail.com") {
      idDisplayImg.src = "img/emp_id102.png";
    } else {
      idDisplayImg.src = activeUser.idImage || "img/emp-id101.jpg";
    }
  }

  const accountForm = document.getElementById('accountSettingsForm');
  const toast = document.getElementById('toast');

  if (accountForm) {
    accountForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const newName = nameInput.value.trim();
      const newPassword = passwordInput.value.trim();

      activeUser.name = newName;
      activeUser.password = newPassword;

      localStorage.setItem('gpath_active_user', JSON.stringify(activeUser));

      let accounts = JSON.parse(localStorage.getItem('gpath_staff_accounts')) || [];
      accounts = accounts.map(acc => {
        if (acc.email.toLowerCase() === activeUser.email.toLowerCase()) {
          return { ...acc, name: newName, password: newPassword };
        }
        return acc;
      });
      localStorage.setItem('gpath_staff_accounts', JSON.stringify(accounts));

      if (toast) {
        toast.textContent = "Account details successfully updated!";
        toast.classList.add('show');
        setTimeout(() => {
          toast.classList.remove('show');
        }, 3000);
      }

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    });
  }
});