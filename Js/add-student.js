document.addEventListener("DOMContentLoaded", () => {
  const mount = document.getElementById("addStudentMount");
  if (!mount) return; // this page doesn't have the modal mount point

  // add-student.html is fetched as plain text and dropped into the mount
  // div so the modal markup can live in its own file. This path is
  // relative to Dashboard.html's location, not this script's location —
  // it lives in the Overlay/ folder, alongside logout-overlay.html and
  // notif.html.
  fetch("Overlay/add-student.html", { cache: "no-store" })
    .then(res => {
      if (!res.ok) throw new Error(`Failed to load add-student.html (${res.status})`);
      return res.text();
    })
    .then(html => {
      // Parse the fetched document and pull out ONLY the modal element by
      // its id. This ignores anything else in the file — including the
      // <script> tag dev tools like Live Server auto-inject for reloading —
      // so it's safe regardless of where that injection lands.
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

    // --- Hook into the existing "Add Student" quick action button ---
    // Dashboard.js already attaches a toast listener to #quickStudent;
    // cloning the node strips that old listener so only the modal opens.
    const quickStudentBtn = document.getElementById("quickStudent");
    if (quickStudentBtn) {
      const freshBtn = quickStudentBtn.cloneNode(true);
      quickStudentBtn.parentNode.replaceChild(freshBtn, quickStudentBtn);
      freshBtn.addEventListener("click", openAddStudentModal);
    }

    // Also open it for any element explicitly marked for it, e.g.
    // <button data-open-modal="addStudent">
    document.querySelectorAll('[data-open-modal="addStudent"]').forEach(el => {
      el.addEventListener("click", openAddStudentModal);
    });

    // --- Closing interactions ---
    cancelBtn?.addEventListener("click", closeAddStudentModal);

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeAddStudentModal(); // click on backdrop
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && overlay.classList.contains("show")) {
        closeAddStudentModal();
      }
    });

    // --- Form submit ---
    form?.addEventListener("submit", (e) => {
      e.preventDefault();

      const student = {
        fullName: document.getElementById("asFullName").value.trim(),
        studentId: document.getElementById("asStudentId").value.trim(),
        contact: document.getElementById("asContact").value.trim(),
        yearLevel: document.getElementById("asYearLevel").value,
        program: document.getElementById("asProgram").value,
        gender: document.getElementById("asGender").value,
        dob: document.getElementById("asDob").value,
      };

      // Hook point: send `student` to your backend / data layer here.
      console.log("New student submitted:", student);

      if (typeof showToast === "function") {
        showToast(`${student.fullName || "Student"} added successfully.`);
      }

      form.reset();
      closeAddStudentModal();
    });

    // Expose for other scripts if needed
    window.openAddStudentModal = openAddStudentModal;
    window.closeAddStudentModal = closeAddStudentModal;
  }
});