window.openAddOlsatModal = function() {
  document.getElementById("olsatModalOverlay")?.remove();

  const allStudents = [
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

  let students = [];
  try {
    students = JSON.parse(localStorage.getItem("gpath_students")) || [];
  } catch (err) {
    students = [];
  }
  if (!Array.isArray(students) || students.length === 0) {
    students = allStudents;
    localStorage.setItem("gpath_students", JSON.stringify(allStudents));
  }
  const activeStudents = students;

  const modalHtml = `
    <div class="olsat-modal-overlay" id="olsatModalOverlay">
      <div class="olsat-modal-card">
        <div class="olsat-modal-header">
          <h3>Record OLSAT Result</h3>
          <button type="button" class="olsat-modal-close" id="closeOlsatModal">✕</button>
        </div>
        <form id="olsatForm">
          <div class="olsat-modal-body">
            <div class="olsat-form-group" style="position: relative;">
              <label>Search Student</label>
              <input type="text" id="studentSearchFilter" placeholder="Type student name or ID..." autocomplete="off" style="width: 100%; padding: 10px; border: 1px solid #e7ebf2; border-radius: 8px; margin-bottom: 6px;" required>
              <div id="studentDropdownList" style="display: none; position: absolute; top: 75px; left: 0; right: 0; background: white; border: 1px solid #e7ebf2; border-radius: 8px; max-height: 150px; overflow-y: auto; z-index: 10; box-shadow: 0 4px 12px rgba(0,0,0,0.1);"></div>
              <input type="hidden" id="olsatSelectedStudentId" required>
            </div>

            <div class="olsat-form-group">
              <label>OLSAT Score</label>
              <input type="number" id="olsatScoreInput" placeholder="Enter score" required min="0" max="100" style="width: 100%; padding: 10px; border: 1px solid #e7ebf2; border-radius: 8px;">
            </div>

            <div class="olsat-form-group">
              <label>Test Date</label>
              <input type="date" id="olsatDate" required style="width: 100%; padding: 10px; border: 1px solid #e7ebf2; border-radius: 8px;">
            </div>
          </div>

          <div class="olsat-modal-footer">
            <button type="button" class="olsat-btn-cancel" id="cancelOlsatBtn">Cancel</button>
            <button type="submit" id="olsatSubmitBtn" class="olsat-btn-submit">Save Result</button>
          </div>
        </form>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHtml);

  const today = new Date().toISOString().split("T")[0];
  document.getElementById("olsatDate").value = today;

  const searchInput = document.getElementById("studentSearchFilter");
  const dropdownList = document.getElementById("studentDropdownList");
  const hiddenIdInput = document.getElementById("olsatSelectedStudentId");

  function renderDropdown(list) {
    if (list.length === 0) {
      dropdownList.innerHTML = `<div style="padding: 10px; color: #788398; font-size: 13px;">No students found</div>`;
      return;
    }
    dropdownList.innerHTML = list.map(s => `
      <div class="student-suggestion-item" data-id="${s.id}" data-name="${s.name}" style="padding: 10px 12px; cursor: pointer; border-bottom: 1px solid #f1f3f9; font-size: 13px;">
        <strong>${s.name}</strong> <span style="color: #788398;">(ID: ${s.id})</span>
      </div>
    `).join("");

    dropdownList.querySelectorAll(".student-suggestion-item").forEach(item => {
      item.addEventListener("click", () => {
        searchInput.value = `${item.dataset.name} (ID: ${item.dataset.id})`;
        hiddenIdInput.value = item.dataset.id;
        dropdownList.style.display = "none";
      });
    });
  }

  searchInput.addEventListener("focus", () => {
    dropdownList.style.display = "block";
    renderDropdown(activeStudents);
  });

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    const filtered = activeStudents.filter(s => s.name.toLowerCase().includes(query) || s.id.includes(query));
    dropdownList.style.display = "block";
    renderDropdown(filtered);
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest("#studentSearchFilter") && !e.target.closest("#studentDropdownList")) {
      if (dropdownList) dropdownList.style.display = "none";
    }
  });

  const closeModal = () => document.getElementById("olsatModalOverlay")?.remove();
  document.getElementById("closeOlsatModal").addEventListener("click", closeModal);
  document.getElementById("cancelOlsatBtn").addEventListener("click", closeModal);

  document.getElementById("olsatForm").addEventListener("submit", e => {
    e.preventDefault();

    const studentId = hiddenIdInput.value;
    const score = Number(document.getElementById("olsatScoreInput").value);
    const dateInput = document.getElementById("olsatDate").value;

    if (score > 100 || score < 0) {
      alert("OLSAT score must be between 0 and 100.");
      return;
    }

    const matchedStudent = activeStudents.find(s => String(s.id) === String(studentId));
    if (!matchedStudent) {
      alert("Please select a valid student from the search list.");
      return;
    }

    const submitBtn = document.getElementById("olsatSubmitBtn");
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Saving...`;

    setTimeout(() => {
      const formattedDate = new Date(dateInput).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

      const newResult = {
        id: Date.now(),
        studentId: matchedStudent.id,
        name: matchedStudent.name,
        score: score,
        date: formattedDate,
        rawDate: dateInput,
        remarks: score >= 75 ? "Above Average" : "Average"
      };

      const OLSAT_STORAGE_KEY = "gpath_olsat_results";
      let existingResults = JSON.parse(localStorage.getItem(OLSAT_STORAGE_KEY)) || [];
      
      existingResults.unshift(newResult);
      localStorage.setItem(OLSAT_STORAGE_KEY, JSON.stringify(existingResults));

      let activeUser = null;
      try {
        activeUser = JSON.parse(localStorage.getItem('gpath_active_user'));
      } catch (err) {}
      const userRole = activeUser ? (activeUser.position || activeUser.role || 'Admin') : 'Admin';

      const notifs = JSON.parse(localStorage.getItem("gpath_notifications")) || [];
      notifs.unshift({
        type: "green",
        title: "OLSAT Result Recorded",
        desc: `Added test score for ${matchedStudent.name} (${formattedDate}).`,
        role: userRole,
        timestamp: Date.now()
      });
      localStorage.setItem("gpath_notifications", JSON.stringify(notifs));

      if (typeof showToast === "function") {
        showToast(`OLSAT result saved for ${matchedStudent.name}.`);
      }

      closeModal();

      if (typeof window.renderOlsatTables === "function") {
        window.renderOlsatTables();
      } else {
        window.location.href = "Result.html";
      }
    }, 500);
  });
};