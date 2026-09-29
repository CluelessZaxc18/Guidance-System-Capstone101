document.addEventListener("DOMContentLoaded", () => {
  const mount = document.getElementById("addStudentMount");

  const SECTION_POOL = [
    "Room 1", "Room 2", "Room 3", "Room 4", "Room 5",
    "Room 6", "Room 7", "Room 8", "Room 9", "Room 10",
    "Room 11", "Room 12", "Room 13", "Room 14", "Room 15",
  ];

  function randomSection() {
    return SECTION_POOL[Math.floor(Math.random() * SECTION_POOL.length)];
  }

  function formatDob(isoDate) {
    if (!isoDate) return "";
    const [year, month, day] = isoDate.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  }

  if (document.getElementById("addStudentOverlay")) {
    initAddStudentModal();
    return;
  }

  if (!mount) return;

  fetch("Overlay/add-student.html", { cache: "no-store" })
    .then(res => {
      if (!res.ok) throw new Error(`Failed to load add-student.html (${res.status})`);
      return res.text();
    })
    .then(html => {
      if (document.getElementById("addStudentOverlay")) {
        initAddStudentModal();
        return;
      }

      const parser = new DOMParser();
      const parsedDoc = parser.parseFromString(html, "text/html");
      const modalEl = parsedDoc.getElementById("addStudentOverlay");

      if (!modalEl) {
        throw new Error('Could not find "#addStudentOverlay" inside add-student.html');
      }

      mount.appendChild(modalEl);
      initAddStudentModal();
    })
    .catch(err => {
      console.error(
        "Could not load the Add Student modal. If you opened this page " +
        "directly as a file (file://...), serve it through a local server " +
        "instead (e.g. VS Code's Live Server) — browsers block fetch() on " +
        "local files.",
        err
      );
    });

  function initAddStudentModal() {
    const overlay = document.getElementById("addStudentOverlay");
    const form = document.getElementById("addStudentForm");
    const cancelBtn = document.getElementById("asCancelBtn");

    if (!overlay) return;

    function openAddStudentModal() {
      overlay.classList.add("show");
      document.body.style.overflow = "hidden";
      const firstField = document.getElementById("asFullName");
      if (firstField) setTimeout(() => firstField.focus(), 200);
    }

    function closeAddStudentModal() {
      overlay.classList.remove("show");
      document.body.style.overflow = "";
    }

    function showAddingOverlay() {
      const modalBox = overlay.querySelector(".as-modal");
      if (!modalBox) return null;

      const loadingEl = document.createElement("div");
      loadingEl.className = "as-loading-overlay";
      loadingEl.innerHTML = `
        <div class="as-loading-spinner"></div>
        <p>Adding...</p>
      `;
      modalBox.appendChild(loadingEl);
      requestAnimationFrame(() => loadingEl.classList.add("show"));
      return loadingEl;
    }

    function hideAddingOverlay(loadingEl) {
      if (!loadingEl) return;
      loadingEl.classList.remove("show");
      setTimeout(() => loadingEl.remove(), 200);
    }

    const quickStudentBtn = document.getElementById("quickStudent");
    if (quickStudentBtn) {
      const freshBtn = quickStudentBtn.cloneNode(true);
      quickStudentBtn.parentNode.replaceChild(freshBtn, quickStudentBtn);
      freshBtn.addEventListener("click", openAddStudentModal);
    }

    document.querySelectorAll('[data-open-modal="addStudent"]').forEach(el => {
      el.addEventListener("click", openAddStudentModal);
    });

    cancelBtn?.addEventListener("click", closeAddStudentModal);

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeAddStudentModal();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && overlay.classList.contains("show")) {
        closeAddStudentModal();
      }
    });

    form?.addEventListener("submit", (e) => {
      e.preventDefault();

      const fullName = document.getElementById("asFullName").value.trim();
      const studentId = document.getElementById("asStudentId").value.trim();
      const yearLevel = document.getElementById("asYearLevel").value;
      const program = document.getElementById("asProgram").value;
      const gender = document.getElementById("asGender").value;
      const dobRaw = document.getElementById("asDob").value;
      const standing = document.getElementById("asStanding")?.value || "";

      const newStudent = {
        name: fullName,
        id: studentId,
        year: yearLevel,
        program: program,
        section: randomSection(),
        gender: gender,
        birthday: formatDob(dobRaw),
        updated: "Just now",
        status: "Active",
        standing: standing,
      };

      const saveBtn = document.getElementById("asSaveBtn");
      if (saveBtn) saveBtn.disabled = true;
      if (cancelBtn) cancelBtn.disabled = true;
      const loadingEl = showAddingOverlay();

      setTimeout(() => {
        hideAddingOverlay(loadingEl);
        if (saveBtn) saveBtn.disabled = false;
        if (cancelBtn) cancelBtn.disabled = false;

        if (typeof addStudent === "function") {
          const wasAdded = addStudent(newStudent);
          if (wasAdded === false) {
            return;
          }

          if (typeof showToast === "function") {
            showToast(`${newStudent.name || "Student"} added successfully.`);
          }

          form.reset();
          closeAddStudentModal();
        } else {
          sessionStorage.setItem("pendingNewStudent", JSON.stringify(newStudent));
          window.location.href = "Student.html";
        }
      }, 900);
    });

    window.openAddStudentModal = openAddStudentModal;
    window.closeAddStudentModal = closeAddStudentModal;
  }
});