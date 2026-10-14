document.addEventListener("DOMContentLoaded", () => {
  function isStaffAccount() {
    try {
      const user = JSON.parse(localStorage.getItem("gpath_active_user") || "{}");
      const position = String(user.position || user.role || "").toLowerCase();
      if (position.includes("staff")) return true;
    } catch (e) {}

    const roleText = (document.getElementById("sidebarRole")?.textContent || document.getElementById("topRole")?.textContent || "").toLowerCase();
    return roleText.includes("staff");
  }

  if (!isStaffAccount()) return;

  const style = document.createElement("style");
  style.innerHTML = `
    .student-profile-delete-btn,
    .delete-file-btn,
    .delete-olsat-btn,
    .btn-decline {
      opacity: 0.4 !important;
      cursor: not-allowed !important;
      position: relative !important;
    }
    
    .student-profile-delete-btn:hover::after,
    .delete-file-btn:hover::after,
    .delete-olsat-btn:hover::after,
    .btn-decline:hover::after {
      font-size: 12px;
    }
  `;
  document.head.appendChild(style);

  document.addEventListener("click", (e) => {
    const target = e.target.closest("button, a, [role='button']");
    if (!target) return;

    const text = target.textContent.trim().toLowerCase();
    const className = target.className.toLowerCase();
    
    const isRestricted = 
      className.includes("delete") || 
      className.includes("decline") || 
      text.includes("delete") || 
      text.includes("decline");

    if (isRestricted) {
      e.preventDefault();
      e.stopImmediatePropagation();
      e.stopPropagation();

      if (typeof window.showToast === "function") {
        window.showToast("Access Denied: Staff accounts cannot delete or decline records.");
      } else {
        alert("Access Denied: Staff accounts cannot delete or decline records.");
      }
    }
  }, true);

  window.deleteStudent = function() {
    if (typeof window.showToast === "function") {
      window.showToast("Access Denied: Staff accounts cannot delete records.");
    } else {
      alert("Access Denied: Staff accounts cannot delete records.");
    }
    return false;
  };
});