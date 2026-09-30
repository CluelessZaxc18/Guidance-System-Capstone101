function studentInitials(name) {
  return name.split(" ").map(part => part[0]).join("").slice(0, 2).toUpperCase();
}

// Maps a student's gender to their avatar picture. Returns null for any
// gender not covered here (blank, "Other", a typo, etc.), so the caller
// can fall back to the plain initials avatar instead of a broken image.
function studentAvatarImage(gender) {
  const normalized = String(gender || "").trim().toLowerCase();
  if (normalized === "male") return "img/male.png";
  if (normalized === "female") return "img/female.png";
  return null;
}

function profileMarkup(student) {
  return `
    <div class="student-profile-overlay" id="studentProfileOverlay" role="dialog" aria-modal="true" aria-label="Student profile">
      <aside class="student-profile-panel">
        <header class="student-profile-header">
          <div class="student-profile-header-left">
            <button class="student-profile-back" id="closeStudentProfile" type="button" aria-label="Close profile">❮</button>
            <div>
              <div class="student-profile-header-label">STUDENT PROFILE</div>
              <div class="student-profile-header-title">Student Information</div>
            </div>
          </div>
        </header>

        <div class="student-profile-body">
          <section class="student-profile-hero">
            <div class="student-profile-avatar">
              ${studentAvatarImage(student.gender)
                ? `<img src="${studentAvatarImage(student.gender)}" alt="${student.gender} avatar" class="student-profile-avatar-img">`
                : studentInitials(student.name)}
            </div>
            <div>
              <h2 class="student-profile-name">${student.name}</h2>
              <div class="student-profile-id">Student ID: ${student.id}</div>
            </div>
            <span class="student-profile-status">${student.status}</span>
          </section>

          <section class="student-profile-section">
            <h3 class="student-profile-section-title">Basic Information</h3>
            <div class="student-profile-grid">
              <div class="student-profile-field">
                <label>Student Name</label>
                <strong>${student.name}</strong>
              </div>
              <div class="student-profile-field">
                <label>Student ID</label>
                <strong>${student.id}</strong>
              </div>
              <div class="student-profile-field">
                <label>Year Level</label>
                <strong>${student.year}</strong>
              </div>
              <div class="student-profile-field">
                <label>Section</label>
                <strong>${student.section}</strong>
              </div>
              <div class="student-profile-field">
                <label>Gender</label>
                <strong>${student.gender}</strong>
              </div>
              <div class="student-profile-field">
                <label>Birthday</label>
                <strong>${student.birthday}</strong>
              </div>
            </div>
          </section>

          <section class="student-profile-section">
            <h3 class="student-profile-section-title">Academic Information</h3>
            <div class="student-profile-grid">
              <div class="student-profile-field">
                <label>Program</label>
                <strong>${student.program}</strong>
              </div>
              <div class="student-profile-field">
                <label>Record Status</label>
                <strong>${student.status}</strong>
              </div>
              <div class="student-profile-field">
                <label>Last Updated</label>
                <strong>${student.updated}</strong>
              </div>
              <div class="student-profile-field">
                <label>Academic Standing</label>
                <strong>${student.standing}</strong>
              </div>
            </div>
          </section>
        </div>

        <div class="student-profile-footer">
          <button class="student-profile-delete-btn" id="deleteStudentBtn" type="button">
            Delete Student
          </button>
        </div>
      </aside>
    </div>
  `;
}

function confirmDeleteMarkup(student) {
  return `
    <div class="confirm-delete-overlay" id="confirmDeleteOverlay">
      <div class="confirm-delete-card">
        <div class="confirm-delete-icon">!</div>
        <h3>Delete this student?</h3>
        <p>This will permanently remove <strong>${student.name}</strong>'s record. This action cannot be undone.</p>
        <div class="confirm-delete-actions">
          <button class="confirm-delete-cancel" id="confirmDeleteCancel" type="button">Cancel</button>
          <button class="confirm-delete-confirm" id="confirmDeleteConfirm" type="button">Delete</button>
        </div>
      </div>
    </div>
  `;
}

function openStudentProfile(student) {
  const mount = document.getElementById("studentProfileMount");
  if (!mount) return;

  mount.innerHTML = profileMarkup(student);

  requestAnimationFrame(() => {
    document.getElementById("studentProfileOverlay")?.classList.add("show");
  });

  document.getElementById("closeStudentProfile").addEventListener("click", closeStudentProfile);

  document.getElementById("studentProfileOverlay").addEventListener("click", event => {
    if (event.target.id === "studentProfileOverlay") {
      closeStudentProfile();
    }
  });

  document.getElementById("deleteStudentBtn")?.addEventListener("click", () => {
    openDeleteConfirm(student);
  });

  document.addEventListener("keydown", handleProfileEscape);
  document.body.style.overflow = "hidden";
}

function openDeleteConfirm(student) {
  // Defensive: remove any leftover confirm dialog before adding a new one
  document.getElementById("confirmDeleteOverlay")?.remove();

  document.body.insertAdjacentHTML("beforeend", confirmDeleteMarkup(student));

  const confirmOverlay = document.getElementById("confirmDeleteOverlay");
  requestAnimationFrame(() => confirmOverlay.classList.add("show"));

  function closeConfirm() {
    confirmOverlay.classList.remove("show");
    document.removeEventListener("keydown", handleConfirmEscape);
    setTimeout(() => confirmOverlay.remove(), 220);
  }

  function handleConfirmEscape(event) {
    if (event.key === "Escape") closeConfirm();
  }

  document.getElementById("confirmDeleteCancel").addEventListener("click", closeConfirm);

  confirmOverlay.addEventListener("click", event => {
    if (event.target === confirmOverlay) closeConfirm();
  });

  document.addEventListener("keydown", handleConfirmEscape);

  document.getElementById("confirmDeleteConfirm").addEventListener("click", () => {
    closeConfirm();

    if (typeof deleteStudent === "function") {
      deleteStudent(student.id);
    }

    if (typeof showToast === "function") {
      showToast(`${student.name} was deleted.`);
    }

    closeStudentProfile();
  });
}

function closeStudentProfile() {
  const overlay = document.getElementById("studentProfileOverlay");
  if (!overlay) return;

  overlay.classList.remove("show");

  setTimeout(() => {
    const mount = document.getElementById("studentProfileMount");
    if (mount) mount.innerHTML = "";
  }, 340);

  document.removeEventListener("keydown", handleProfileEscape);
  document.body.style.overflow = "";
}

function handleProfileEscape(event) {
  if (event.key === "Escape") {
    closeStudentProfile();
  }
}