document.addEventListener("DOMContentLoaded", () => {
  const tabBtns = document.querySelectorAll(".sub-tab-btn");
  const pendingSection = document.getElementById("pendingSection");
  const approvedSection = document.getElementById("approvedSection");
  const pendingList = document.getElementById("pendingList");
  const approvedList = document.getElementById("approvedList");
  const pendingBadge = document.getElementById("pendingBadge");
  const approvedBadge = document.getElementById("approvedBadge");

  let currentApprovingTimestamp = null;

  // Tab Switching
  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      tabBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const target = btn.dataset.tab;
      if (target === "pending") {
        pendingSection.classList.add("active");
        approvedSection.classList.remove("active");
      } else {
        approvedSection.classList.add("active");
        pendingSection.classList.remove("active");
      }
    });
  });

  function loadSubmissions() {
    const submissions = JSON.parse(localStorage.getItem("gpath_submissions")) || [];
    
    const pending = submissions.filter(s => s.status === "Pending");
    const approved = submissions.filter(s => s.status === "Approved");

    pendingBadge.textContent = pending.length;
    approvedBadge.textContent = approved.length;

    // Render Pending
    if (pending.length === 0) {
      pendingList.innerHTML = `<p class="empty-state">No pending student submissions.</p>`;
    } else {
      pendingList.innerHTML = pending.map(item => `
        <div class="sub-card">
          <div class="sub-card-info">
            <h3>${item.name || "Unnamed Student"}</h3>
            <p><strong>ID:</strong> ${item.id} | <strong>Course:</strong> ${item.program}</p>
            <p><strong>Email:</strong> ${item.gmail || "N/A"} | <strong>Contact:</strong> ${item.contactNumber || "N/A"}</p>
          </div>
          <div class="sub-card-actions">
            <button class="btn-view" onclick="viewSubmissionDetails('${item.timestamp}')">View Details</button>
            <button class="btn-approve" onclick="openApprovalModal('${item.timestamp}')">Approve</button>
            <button class="btn-decline" onclick="handleAction('${item.timestamp}', 'Declined')">Decline</button>
          </div>
        </div>
      `).join("");
    }

    // Render Approved
    if (approved.length === 0) {
      approvedList.innerHTML = `<p class="empty-state">No approved student records yet.</p>`;
    } else {
      approvedList.innerHTML = approved.map(item => `
        <div class="sub-card approved-card">
          <div class="sub-card-info">
            <h3>${item.name}</h3>
            <p><strong>ID:</strong> ${item.id} | <strong>Course:</strong> ${item.program}</p>
            <span class="approved-tag">Approved & Archived</span>
          </div>
          <div class="sub-card-actions">
            <button class="btn-view" onclick="viewSubmissionDetails('${item.timestamp}')">View Details</button>
          </div>
        </div>
      `).join("");
    }
  }

  // Open Add Student Modal and Pre-fill with Submission Data
  window.openApprovalModal = function(timestamp) {
    const submissions = JSON.parse(localStorage.getItem("gpath_submissions")) || [];
    const item = submissions.find(s => String(s.timestamp) === String(timestamp));
    if (!item) return;

    currentApprovingTimestamp = timestamp;

    if (typeof window.openAddStudentModal === "function") {
      window.openAddStudentModal();
    }

    setTimeout(() => {
      const nameInput = document.getElementById("asFullName");
      const idInput = document.getElementById("asStudentId");
      const contactInput = document.getElementById("asContact");
      const yearSelect = document.getElementById("asYearLevel");
      const programSelect = document.getElementById("asProgram");
      const genderSelect = document.getElementById("asGender");
      const dobInput = document.getElementById("asDob");

      if (nameInput && item.name) nameInput.value = item.name;
      if (idInput && item.id) idInput.value = item.id;
      if (contactInput && item.contactNumber) contactInput.value = item.contactNumber;
      if (yearSelect && item.year) yearSelect.value = item.year;
      if (programSelect && item.program) programSelect.value = item.program;
      if (genderSelect && item.gender) genderSelect.value = item.gender;
      if (dobInput && item.birthday) dobInput.value = item.birthday;
    }, 150);
  };

  // Safe listener to handle approval form submission cleanly
  document.addEventListener("submit", (e) => {
    if (e.target && e.target.id === "addStudentForm" && currentApprovingTimestamp) {
      e.preventDefault();
      e.stopImmediatePropagation();

      let submissions = JSON.parse(localStorage.getItem("gpath_submissions")) || [];
      const index = submissions.findIndex(s => String(s.timestamp) === String(currentApprovingTimestamp));
      
      if (index !== -1) {
        submissions[index].status = "Approved";
        submissions[index].name = document.getElementById("asFullName")?.value || submissions[index].name;
        submissions[index].id = document.getElementById("asStudentId")?.value || submissions[index].id;
        submissions[index].program = document.getElementById("asProgram")?.value || submissions[index].program;
        submissions[index].year = document.getElementById("asYearLevel")?.value || submissions[index].year;
        submissions[index].gender = document.getElementById("asGender")?.value || submissions[index].gender;
        submissions[index].birthday = document.getElementById("asDob")?.value || submissions[index].birthday;
        submissions[index].standing = document.getElementById("asStanding")?.value || "Regular";

        localStorage.setItem("gpath_submissions", JSON.stringify(submissions));

        // Directly push into active student list for Student.html
        let students = JSON.parse(localStorage.getItem("gpath_students")) || [];
        const existingIndex = students.findIndex(st => String(st.id) === String(submissions[index].id));
        
        const studentRecord = {
          name: submissions[index].name,
          id: submissions[index].id,
          year: submissions[index].year,
          program: submissions[index].program,
          section: "Room 1",
          gender: submissions[index].gender || "N/A",
          birthday: submissions[index].birthday || "N/A",
          updated: "Just now",
          standing: submissions[index].standing,
          status: "Active"
        };

        if (existingIndex !== -1) {
          students[existingIndex] = studentRecord;
        } else {
          students.unshift(studentRecord);
        }

        localStorage.setItem("gpath_students", JSON.stringify(students));
      }

      currentApprovingTimestamp = null;
      if (typeof window.closeAddStudentModal === "function") {
        window.closeAddStudentModal();
      }
      e.target.reset();
      loadSubmissions();
    }
  }, true);

  window.viewSubmissionDetails = function(timestamp) {
    const submissions = JSON.parse(localStorage.getItem("gpath_submissions")) || [];
    const item = submissions.find(s => String(s.timestamp) === String(timestamp));
    if (!item) return;

    document.getElementById("submissionModal")?.remove();

    const modalHtml = `
      <div class="sub-modal-overlay" id="submissionModal">
        <div class="sub-modal-card">
          <div class="sub-modal-header">
            <h3>Student Submission Details</h3>
            <button type="button" class="sub-modal-close" onclick="document.getElementById('submissionModal').remove()">×</button>
          </div>
          <div class="sub-modal-body">
            <div class="sub-info-grid">
              <div><label>Full Name</label><strong>${item.name || "N/A"}</strong></div>
              <div><label>Student ID</label><strong>${item.id || "N/A"}</strong></div>
              <div><label>LRN</label><strong>${item.lrn || "N/A"}</strong></div>
              <div><label>Course / Program</label><strong>${item.program || "N/A"}</strong></div>
              <div><label>Year Level</label><strong>${item.year || "N/A"}</strong></div>
              <div><label>Gender</label><strong>${item.gender || "N/A"}</strong></div>
              <div><label>Civil Status</label><strong>${item.civilStatus || "N/A"}</strong></div>
              <div><label>Birthday</label><strong>${item.birthday || "N/A"}</strong></div>
              <div><label>Religion</label><strong>${item.religion === "Other" ? item.otherReligion : (item.religion || "N/A")}</strong></div>
              <div><label>Contact Number</label><strong>${item.contactNumber || "N/A"}</strong></div>
              <div><label>Gmail</label><strong>${item.gmail || "N/A"}</strong></div>
              <div><label>Facebook</label><strong>${item.facebook || "N/A"}</strong></div>
              <div class="full-span"><label>Current Address</label><strong>${item.currentAddress || "N/A"}</strong></div>
              <div class="full-span"><label>Educational Background</label><strong>Preschool: ${item.preschool || "N/A"} | Elem: ${item.elementary || "N/A"} | JHS: ${item.juniorHigh || "N/A"} | SHS: ${item.seniorHigh || "N/A"}</strong></div>
              <div><label>Father's Name</label><strong>${item.fatherName || "N/A"} (${item.fatherContact || "No contact"})</strong></div>
              <div><label>Mother's Name</label><strong>${item.motherMaidenName || "N/A"} (${item.motherContact || "No contact"})</strong></div>
              <div><label>Guardian's Name</label><strong>${item.guardianName || "N/A"} (${item.guardianContact || "No contact"})</strong></div>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML("beforeend", modalHtml);
  };

  window.handleAction = function(timestamp, action) {
    let submissions = JSON.parse(localStorage.getItem("gpath_submissions")) || [];
    const index = submissions.findIndex(s => String(s.timestamp) === String(timestamp));
    
    if (index === -1) return;

    if (action === "Declined") {
      submissions.splice(index, 1);
      localStorage.setItem("gpath_submissions", JSON.stringify(submissions));
      loadSubmissions();
    }
  };

  loadSubmissions();
});