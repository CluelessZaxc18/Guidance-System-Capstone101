document.addEventListener("DOMContentLoaded", () => {
  const activeUser = JSON.parse(localStorage.getItem('gpath_active_user'));

  if (activeUser) {
    const fullName = activeUser.name || "Staff Member";
    const role = activeUser.position || "Guidance Staff";
    
    const initials = fullName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);

    const topAvatar = document.getElementById('topAvatar');
    const topName = document.getElementById('topName');
    const topRole = document.getElementById('topRole');

    if (topAvatar) topAvatar.textContent = initials;
    if (topName) topName.textContent = fullName;
    if (topRole) topRole.textContent = role;

    const sidebarAvatar = document.getElementById('sidebarAvatar');
    const sidebarName = document.getElementById('sidebarName');
    const sidebarRole = document.getElementById('sidebarRole');

    if (sidebarAvatar) sidebarAvatar.textContent = initials;
    if (sidebarName) sidebarName.textContent = fullName;
    if (sidebarRole) sidebarRole.textContent = role;
  }

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('gpath_active_user');
      window.location.href = 'Login.html';
    });
  }
});