window.openAddOlsatModal = function() {
  document.getElementById("olsatModalOverlay")?.remove();

  // Fallback default student list so dropdown works instantly even after a hard reset
  const defaultStudents = [
    { id: "110187", name: "Ana Cruz", program: "BS Information Technology" },
    { id: "110638", name: "Miguel Santos", program: "BS Criminology" },
    { id: "110744", name: "Maria Lim", program: "BS Hospitality Management" },
    { id: "110859", name: "Joshua Reyes", program: "BS Tourism Management" },
    { id: "110963", name: "Sofia Mendoza", program: "BS Midwifery Education" },
    { id: "111074", name: "Liam Torres", program: "BS Information Technology" },
    { id: "110198", name: "Aris Villanueva", program: "BS Information Technology" },
    { id: "111530", name: "Daniel Garcia", program: "BS Criminology" },
    { id: "111419", name: "Camille Navarro", program: "BS Tourism Management" },
    { id: "111308", name: "Rafael Mendoza", program: "BS Hospitality Management" },
    { id: "111297", name: "Nicole Reyes", program: "BS Midwifery Education" },
    { id: "111186", name: "Ethan Flores", program: "BS Tourism Management" }
  ];

  const students = JSON.parse(localStorage.getItem("gpath_students")) || defaultStudents;
  const activeStudents = students.length > 0 ? students : defaultStudents;

  const studentOptions = activeStudents.length > 0
    ? activeStudents.map(s => `<option value="${s.id}">${s.name} (ID: ${s.id})</option>`).join("")
    : `<option value="" disabled selected>No students found. Add a student first.</option>`;

  const modalHtml = `
    <div class="olsat-modal-overlay" id="olsatModalOverlay">
      <div class="olsat-modal-card">
        <div class="olsat-modal-header">
          <h3>Record OLSAT Result</h3>
          <button type="button" class="olsat-modal-close" id="closeOlsatModal">✕</button>
        </div>
        <form id="olsatForm">
          <div class="olsat-modal-body">
            <div class="olsat-form-group">
              <label>Select Student</label>
              <select id="olsatStudentSelect" required>
                <option value="" disabled selected>Select a registered student</option>
                ${studentOptions}
              </select>
            </div>

            <div class="olsat-form-row">
              <div class="olsat-form-group">
                <label>Verbal Score</label>
                <input type="number" id="olsatVerbal" placeholder="e.g. 40" required min="0">
              </div>
              <div class="olsat-form-group">
                <label>Non-Verbal Score</label>
                <input type="number" id="olsatNonVerbal" placeholder="e.g. 42" required min="0">
              </div>
            </div>

            <div class="olsat-form-group">
              <label>Test Date</label>
              <input type="date" id="olsatDate" required>
            </div>
          </div>

          <div class="olsat-modal-footer">
            <button type="button" class="olsat-btn-cancel" id="cancelOlsatBtn">Cancel</button>
            <button type="submit" class="olsat-btn-submit">Save</button>
          </div>
        </form>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHtml);

  const today = new Date().toISOString().split("T")[0];
  document.getElementById("olsatDate").value = today;

  const closeModal = () => document.getElementById("olsatModalOverlay")?.remove();
  
  document.getElementById("closeOlsatModal").addEventListener("click", closeModal);
  document.getElementById("cancelOlsatBtn").addEventListener("click", closeModal);
  document.getElementById("olsatModalOverlay").addEventListener("click", e => {
    if (e.target.id === "olsatModalOverlay") closeModal();
  });

  document.getElementById("olsatForm").addEventListener("submit", e => {
    e.preventDefault();

    const selectedId = document.getElementById("olsatStudentSelect").value;
    const verbal = Number(document.getElementById("olsatVerbal").value);
    const nonVerbal = Number(document.getElementById("olsatNonVerbal").value);
    const dateInput = document.getElementById("olsatDate").value;

    const matchedStudent = activeStudents.find(s => String(s.id) === String(selectedId));
    if (!matchedStudent) return;

    const totalSai = verbal + nonVerbal;
    const formattedDate = new Date(dateInput).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

    const newResult = {
      id: Date.now(),
      studentId: matchedStudent.id,
      name: matchedStudent.name,
      verbal: verbal,
      nonVerbal: nonVerbal,
      sai: totalSai,
      date: formattedDate,
      remarks: totalSai >= 110 ? "Above Average" : "Average"
    };

    const existingResults = JSON.parse(localStorage.getItem("gpath_olsat_results")) || [];
    existingResults.unshift(newResult);
    localStorage.setItem("gpath_olsat_results", JSON.stringify(existingResults));

    // Log Activity for Recent Activity list
    const notifs = JSON.parse(localStorage.getItem("gpath_notifications")) || [];
    notifs.unshift({
      type: "green",
      title: "OLSAT Result Recorded",
      desc: `Added test score (SAI: ${totalSai}) for ${matchedStudent.name}.`,
      timestamp: Date.now()
    });
    localStorage.setItem("gpath_notifications", JSON.stringify(notifs));

    if (typeof showToast === "function") {
      showToast(`OLSAT result saved for ${matchedStudent.name}.`);
    }

    closeModal();

    // Redirect to Result.html so they can view the newly added record
    window.location.href = "Result.html";
  });
};