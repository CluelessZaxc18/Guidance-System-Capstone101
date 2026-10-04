function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".settings-tab");
  const panels = document.querySelectorAll(".settings-panel");

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      panels.forEach(p => p.classList.remove("active"));

      tab.classList.add("active");
      const target = document.getElementById(`settings${capitalize(tab.dataset.tab)}`);
      target?.classList.add("active");
    });
  });

  document.querySelectorAll(".settings-toggle-password").forEach(btn => {
    btn.addEventListener("click", () => {
      const input = document.getElementById(btn.dataset.target);
      if (!input) return;

      const isHidden = input.type === "password";
      input.type = isHidden ? "text" : "password";
      btn.textContent = isHidden ? "👁" : "✖";
    });
  });

  const accountForm = document.getElementById("accountForm");

  accountForm?.addEventListener("submit", e => {
    e.preventDefault();

    const saveBtn = document.getElementById("saveAccountBtn");
    const original = saveBtn.textContent;
    saveBtn.disabled = true;
    saveBtn.textContent = "Saving...";

    setTimeout(() => {
      saveBtn.disabled = false;
      saveBtn.textContent = original;

      const name = document.getElementById("setName").value.trim();
      if (name) {
        document.querySelectorAll(".sidebar-profile strong, .top-profile strong").forEach(el => {
          el.textContent = name;
        });
      }

      showToast("Account information updated.");

      if (typeof window.addSystemNotification === "function") {
        window.addSystemNotification("Account updated", "Your account information was updated.", "blue");
      }
    }, 700);
  });

  const securityForm = document.getElementById("securityForm");
  const passwordError = document.getElementById("passwordError");

  securityForm?.addEventListener("submit", e => {
    e.preventDefault();

    const current = document.getElementById("currentPassword").value;
    const next = document.getElementById("newPassword").value;
    const confirm = document.getElementById("confirmPassword").value;

    if (!current || !next || !confirm) {
      passwordError.textContent = "Please fill in all password fields.";
      return;
    }
    if (next.length < 8) {
      passwordError.textContent = "New password must be at least 8 characters.";
      return;
    }
    if (next !== confirm) {
      passwordError.textContent = "New password and confirmation do not match.";
      return;
    }

    passwordError.textContent = "";

    const saveBtn = document.getElementById("saveSecurityBtn");
    const original = saveBtn.textContent;
    saveBtn.disabled = true;
    saveBtn.textContent = "Updating...";

    setTimeout(() => {
      saveBtn.disabled = false;
      saveBtn.textContent = original;
      securityForm.reset();

      showToast("Password updated successfully.");

      if (typeof window.addSystemNotification === "function") {
        window.addSystemNotification("Password changed", "Your account password was updated.", "orange");
      }
    }, 700);
  });

  const NOTIF_PREFS_KEY = "gpath_notification_prefs";
  const toggleIds = ["notifDocs", "notifStudents", "notifSystem"];

  function loadPrefs() {
    try {
      return JSON.parse(localStorage.getItem(NOTIF_PREFS_KEY)) || {};
    } catch (err) {
      return {};
    }
  }

  function savePrefs(prefs) {
    localStorage.setItem(NOTIF_PREFS_KEY, JSON.stringify(prefs));
  }

  const prefs = loadPrefs();
  toggleIds.forEach(id => {
    const input = document.getElementById(id);
    if (!input) return;

    if (id in prefs) input.checked = prefs[id];

    input.addEventListener("change", () => {
      const updated = loadPrefs();
      updated[id] = input.checked;
      savePrefs(updated);

      showToast(input.checked ? "Notification enabled." : "Notification disabled.");
    });
  });
});

//=========================== Hard Reset Script ===========================
document.addEventListener("DOMContentLoaded", () => {
  const resetBtn = document.getElementById("resetDataBtn");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to reset all student data back to default? This will overwrite any custom changes.")) {
       
        localStorage.removeItem("gpath_students");
        localStorage.removeItem("gpath_submissions");
        
        
        if (typeof showToast === "function") {
          showToast("System data reset successfully.");
        }
        
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    });
  }
});