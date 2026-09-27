document.addEventListener("DOMContentLoaded", () => {
  const mount = document.getElementById("addStudentMount");

  // If the modal markup is already in the page — e.g. add-student.js got
  // included twice, or another copy's fetch already finished — don't
  // create a second copy. Duplicate ids break every getElementById() call
  // below, silently reading from the wrong (often empty) instance.
  if (document.getElementById("addStudentOverlay")) {
    initAddStudentModal();
    return;
  }

  if (!mount) return; // this page doesn't have the modal mount point

  // The Add Student form has no "Section" field, so a section is assigned
  // at random from the same pool used by Student.html's Section filter.
  const SECTION_POOL = [
    "Room 1", "Room 2", "Room 3", "Room 4", "Room 5",
    "Room 6", "Room 7", "Room 8", "Room 9", "Room 10",
    "Room 11", "Room 12", "Room 13", "Room 14", "Room 15",
  ];

  function randomSection() {
    return SECTION_POOL[Math.floor(Math.random() * SECTION_POOL.length)];
  }

  // Converts the <input type="date"> value ("YYYY-MM-DD") into the same
  // "Month Day, Year" style already used in studentData (e.g. "October 14,
  // 2005"). Parsed as local y/m/d parts (not `new Date(isoString)`) to
  // avoid a timezone off-by-one shifting the day.
  function formatDob(isoDate) {
    if (!isoDate) return "";
    const [year, month, day] = isoDate.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  }

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
      // Re-check here too: if a duplicate script inclusion's own fetch
      // already resolved and appended the modal while this one was still
      // in flight, don't append a second, id-clashing copy.
      if (document.getElementById("addStudentOverlay")) {
        initAddStudentModal();
        return;
      }

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

      const fullName = document.getElementById("asFullName").value.trim();
      const studentId = document.getElementById("asStudentId").value.trim();
      const yearLevel = document.getElementById("asYearLevel").value;
      const program = document.getElementById("asProgram").value;
      const gender = document.getElementById("asGender").value;
      const dobRaw = document.getElementById("asDob").value; // "YYYY-MM-DD" or ""
      const standing = document.getElementById("asStanding").value;
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

      // Hand off to student-data.js's addStudent() so it lands in the real
      // table — only present on pages that load student-data.js (e.g.
      // Student.html). On pages without it (e.g. Dashboard.html), this is
      // skipped and only the confirmation toast shows.
      if (typeof addStudent === "function") {
        const wasAdded = addStudent(newStudent);
        if (wasAdded === false) {
          // Duplicate Student ID — addStudent() already showed a toast
          // explaining why, so stop here and leave the form open to fix it.
          return;
        }
      }

      if (typeof showToast === "function") {
        showToast(`${newStudent.name || "Student"} added successfully.`);
      }

      form.reset();
      closeAddStudentModal();
    });

    // Expose for other scripts if needed
    window.openAddStudentModal = openAddStudentModal;
    window.closeAddStudentModal = closeAddStudentModal;
  }
});