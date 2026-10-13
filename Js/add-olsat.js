window.openAddOlsatModal = function() {
  document.getElementById("olsatModalOverlay")?.remove();

  const students = JSON.parse(localStorage.getItem("gpath_students")) || [];

  const studentOptions = students.length > 0
    ? students.map(s => `<option value="${s.id}">${s.name} (ID: ${s.id})</option>`).join("")
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
            <button type="submit" class="olsat-btn-submit">Save & View Results</button>
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

    const matchedStudent = students.find(s => String(s.id) === String(selectedId));
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