// Js/profile-loader.js
document.addEventListener("DOMContentLoaded", () => {
  // 1. Grab active user from localStorage
  const activeUser = JSON.parse(localStorage.getItem('gpath_active_user'));

  if (activeUser) {
    const fullName = activeUser.name || "Staff Member";
    const role = activeUser.position || "Guidance Staff";
    
    // Generate initials (e.g., "Ana Cruz" -> "AC")
    const initials = fullName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);

    // 2. Update Top Header Profile via IDs
    const topAvatar = document.getElementById('topAvatar');
    const topName = document.getElementById('topName');
    const topRole = document.getElementById('topRole');

    if (topAvatar) topAvatar.textContent = initials;
    if (topName) topName.textContent = fullName;
    if (topRole) topRole.textContent = role;

    // 3. Update Sidebar Profile via IDs
    const sidebarAvatar = document.getElementById('sidebarAvatar');
    const sidebarName = document.getElementById('sidebarName');
    const sidebarRole = document.getElementById('sidebarRole');

    if (sidebarAvatar) sidebarAvatar.textContent = initials;
    if (sidebarName) sidebarName.textContent = fullName;
    if (sidebarRole) sidebarRole.textContent = role;
  }

  // 4. Handle Log-out Button functionality
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('gpath_active_user');
      window.location.href = 'Login.html'; // Adjust relative path if your main pages are in subfolders
    });
  }
});