document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("addStudentOverlay");
  const form = document.getElementById("addStudentForm");
  const cancelBtn = document.getElementById("asCancelBtn");

  if (!overlay) return; // modal markup not on this page

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
  // dashboard.js already attaches a toast listener to #quickStudent;
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
});