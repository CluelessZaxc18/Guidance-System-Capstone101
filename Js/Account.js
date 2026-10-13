// Js/Account.js
document.addEventListener("DOMContentLoaded", () => {
  const activeUser = JSON.parse(localStorage.getItem('gpath_active_user'));

  if (!activeUser) {
    // If no one is logged in, redirect back to login
    window.location.href = 'Login.html';
    return;
  }

  // 1. Populate Form Fields with Active User Data
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

  // Store actual PIN securely in a variable, but display masked version by default
  const userPin = activeUser.pin || '------';
  let isPinVisible = false;

  if (pinDisplay) {
    pinDisplay.textContent = '•'.repeat(userPin.length);
  }

  // Toggle PIN visibility handler
  if (togglePinBtn && pinDisplay) {
    togglePinBtn.addEventListener('click', () => {
      isPinVisible = !isPinVisible;
      if (isPinVisible) {
        pinDisplay.textContent = userPin;
        togglePinBtn.className = "fa-regular fa-eye"; // switch to open eye icon
      } else {
        pinDisplay.textContent = '•'.repeat(userPin.length);
        togglePinBtn.className = "fa-regular fa-eye-slash"; // switch to closed eye icon
      }
    });
  }

  // 2. Load ID Badge based on Account Type (Admin vs Staff)
  if (idDisplayImg) {
    if (activeUser.email.toLowerCase() === "guidancecounselor@gmail.com") {
      // Exclusive Admin Badge
      idDisplayImg.src = "img/emp_id102.png";
    } else {
      // Regular Staff Badge (Custom uploaded or default fallback)
      idDisplayImg.src = activeUser.idImage || "img/emp-id101.jpg";
    }
  }

  // 3. Handle Form Submission & Saving Updates
  const accountForm = document.getElementById('accountSettingsForm');
  const toast = document.getElementById('toast');

  if (accountForm) {
    accountForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const newName = nameInput.value.trim();
      const newPassword = passwordInput.value.trim();

      // Update active user object
      activeUser.name = newName;
      activeUser.password = newPassword;

      // Update localStorage active session
      localStorage.setItem('gpath_active_user', JSON.stringify(activeUser));

      // Update the master list of staff accounts in localStorage
      let accounts = JSON.parse(localStorage.getItem('gpath_staff_accounts')) || [];
      accounts = accounts.map(acc => {
        if (acc.email.toLowerCase() === activeUser.email.toLowerCase()) {
          return { ...acc, name: newName, password: newPassword };
        }
        return acc;
      });
      localStorage.setItem('gpath_staff_accounts', JSON.stringify(accounts));

      // Show success toast notification
      if (toast) {
        toast.textContent = "Account details successfully updated!";
        toast.classList.add('show');
        setTimeout(() => {
          toast.classList.remove('show');
        }, 3000);
      }

      // Refresh topbar/sidebar profile headers instantly
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    });
  }
});