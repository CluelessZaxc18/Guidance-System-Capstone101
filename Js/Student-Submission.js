document.addEventListener("DOMContentLoaded", () => {
  const defaultApprovedStudents = [
    {
      timestamp: 1720000001000,
      status: "Approved",
      firstName: "Ana",
      middleName: "Mae",
      lastName: "Cruz",
      name: "Ana Mae Cruz",
      id: "110187",
      lrn: "135402090112",
      program: "BS Information Technology",
      year: "3rd Year",
      gender: "Female",
      civilStatus: "Single",
      birthday: "2005-10-14",
      religion: "Catholic",
      contactNumber: "09514689924",
      gmail: "CruzAnamae@gmail.com",
      facebook: "Ana Cruz",
      currentAddress: "Purok 4, Ampayon, Butuan City, Agusan del Norte",
      preschool: "Butuan Faith Christian School",
      elementary: "Ampayon Central Elementary School",
      juniorHigh: "Caraga Regional Science High School",
      seniorHigh: "Caraga State University - SHS Dept",
      fatherName: "Roberto Cruz",
      fatherContact: "09123456789",
      motherMaidenName: "Elena Cruz",
      motherContact: "09187654321",
      guardianName: "Roberto Cruz",
      guardianContact: "09123456789"
    },
    {
      timestamp: 1720000002000,
      status: "Approved",
      firstName: "Miguel",
      middleName: "",
      lastName: "Santos",
      name: "Miguel Santos",
      id: "110638",
      lrn: "135405040188",
      program: "BS Criminology",
      year: "2nd Year",
      gender: "Male",
      civilStatus: "Single",
      birthday: "2006-03-22",
      religion: "Roman Catholic",
      contactNumber: "09481122334",
      gmail: "MiguelSantos06@gmail.com",
      facebook: "Miguel Santos",
      currentAddress: "National Highway, San Francisco, Agusan del Sur",
      preschool: "San Francisco Montessori Learning Center",
      elementary: "San Francisco Pilot Central Elementary School",
      juniorHigh: "Agusan del Sur National High School",
      seniorHigh: "Mt. Carmel College of San Francisco - SHS",
      fatherName: "Eduardo Santos",
      fatherContact: "09223344556",
      motherMaidenName: "Carmen Santos",
      motherContact: "09334455667",
      guardianName: "Eduardo Santos",
      guardianContact: "09223344556"
    },
    {
      timestamp: 1720000003000,
      status: "Approved",
      firstName: "Maria",
      middleName: "",
      lastName: "Lim",
      name: "Maria Lim",
      id: "110744",
      lrn: "135401120395",
      program: "BS Hospitality Management",
      year: "4th Year",
      gender: "Female",
      civilStatus: "Single",
      birthday: "2005-01-05",
      religion: "Iglesia ni Cristo",
      contactNumber: "09095544332",
      gmail: "MariaLim.hm@gmail.com",
      facebook: "Maria Lim",
      currentAddress: "Capitol Road, Tandag City, Surigao del Sur",
      preschool: "Tandag Early Childhood Learning Center",
      elementary: "Tandag Central Elementary School",
      juniorHigh: "Purisima National High School",
      seniorHigh: "Saint Theresa College of Tandag - SHS",
      fatherName: "George Lim",
      fatherContact: "09445566778",
      motherMaidenName: "Susan Lim",
      motherContact: "09556677889",
      guardianName: "Susan Lim",
      guardianContact: "09556677889"
    },
    {
      timestamp: 1720000004000,
      status: "Approved",
      firstName: "Joshua",
      middleName: "",
      lastName: "Reyes",
      name: "Joshua Reyes",
      id: "110859",
      lrn: "135403080214",
      program: "BS Tourism Management",
      year: "3rd Year",
      gender: "Male",
      civilStatus: "Single",
      birthday: "2005-07-19",
      religion: "Roman Catholic",
      contactNumber: "09367788990",
      gmail: "JoshuaReyes.tourism@gmail.com",
      facebook: "Joshua Reyes",
      currentAddress: "Rizal Street, Surigao City, Surigao del Norte",
      preschool: "Surigao Covenant Christian School",
      elementary: "Surigao City Pilot Elementary School",
      juniorHigh: "Surigao National High School",
      seniorHigh: "St. Paul University Surigao - SHS",
      fatherName: "Mario Reyes",
      fatherContact: "09667788990",
      motherMaidenName: "Linda Reyes",
      motherContact: "09778899001",
      guardianName: "Mario Reyes",
      guardianContact: "09667788990"
    },
    {
      timestamp: 1720000005000,
      status: "Approved",
      firstName: "Sofia",
      middleName: "",
      lastName: "Mendoza",
      name: "Sofia Mendoza",
      id: "110963",
      lrn: "135401030567",
      program: "BS Midwifery Education",
      year: "4th Year",
      gender: "Female",
      civilStatus: "Single",
      birthday: "2004-11-30",
      religion: "Seventh-day Adventist",
      contactNumber: "09293344556",
      gmail: "SofiaMendoza.mid@gmail.com",
      facebook: "Sofia Mendoza",
      currentAddress: "San Jose St., Butuan City, Agusan del Norte",
      preschool: "Butuan Little Gems Preschool",
      elementary: "Butuan Central Elementary School",
      juniorHigh: "Father Saturnino Urios University - JHS",
      seniorHigh: "Northern Mindanao School of Midwifery - SHS",
      fatherName: "Fernando Mendoza",
      fatherContact: "09889900112",
      motherMaidenName: "Rosa Mendoza",
      motherContact: "09990011223",
      guardianName: "Rosa Mendoza",
      guardianContact: "09990011223"
    },
    {
      timestamp: 1720000006000,
      status: "Approved",
      firstName: "Liam",
      middleName: "",
      lastName: "Torres",
      name: "Liam Torres",
      id: "111074",
      lrn: "135402110482",
      program: "BS Information Technology",
      year: "1st Year",
      gender: "Male",
      civilStatus: "Single",
      birthday: "2008-02-12",
      religion: "Roman Catholic",
      contactNumber: "09123344556",
      gmail: "LiamTorres.it@gmail.com",
      facebook: "Liam Torres",
      currentAddress: "J.C. Aquino Avenue, Butuan City, Agusan del Norte",
      preschool: "Kiddie Kollege Butuan",
      elementary: "West Butuan Central Elementary School",
      juniorHigh: "Saint Joseph Institute of Technology - High School",
      seniorHigh: "STI College Surigao - Butuan Learning Center",
      fatherName: "Victor Torres",
      fatherContact: "09112233445",
      motherMaidenName: "Clara Torres",
      motherContact: "09223344557",
      guardianName: "Victor Torres",
      guardianContact: "09112233445"
    },
    {
      timestamp: 1720000007000,
      status: "Approved",
      firstName: "Aris",
      middleName: "",
      lastName: "Villanueva",
      name: "Aris Villanueva",
      id: "110198",
      lrn: "135405020331",
      program: "BS Information Technology",
      year: "2nd Year",
      gender: "Male",
      civilStatus: "Single",
      birthday: "2006-08-25",
      religion: "Baptist",
      contactNumber: "09506677889",
      gmail: "ArisVillanueva@gmail.com",
      facebook: "Aris Villanueva",
      currentAddress: "Poblacion, Prosperidad, Agusan del Sur",
      preschool: "Prosperidad Christian Learning Center",
      elementary: "Prosperidad Central Elementary School",
      juniorHigh: "Agusan del Sur National High School",
      seniorHigh: "Agusan del Sur College - SHS",
      fatherName: "Danilo Villanueva",
      fatherContact: "09334455668",
      motherMaidenName: "Jocelyn Villanueva",
      motherContact: "09445566779",
      guardianName: "Danilo Villanueva",
      guardianContact: "09334455668"
    },
    {
      timestamp: 1720000008000,
      status: "Approved",
      firstName: "Daniel",
      middleName: "",
      lastName: "Garcia",
      name: "Daniel Garcia",
      id: "111530",
      lrn: "135403060719",
      program: "BS Criminology",
      year: "3rd Year",
      gender: "Male",
      civilStatus: "Single",
      birthday: "2005-04-03",
      religion: "Roman Catholic",
      contactNumber: "09612233445",
      gmail: "DanielGarcia.crim@gmail.com",
      facebook: "Daniel Garcia",
      currentAddress: "San Nicolas Street, Surigao City, Surigao del Norte",
      preschool: "Surigao Montessori School",
      elementary: "San Juan Elementary School",
      juniorHigh: "Surigao del Norte National High School",
      seniorHigh: "Surigao Education Center - SHS",
      fatherName: "Ramon Garcia",
      fatherContact: "09556677880",
      motherMaidenName: "Teresa Garcia",
      motherContact: "09667788991",
      guardianName: "Teresa Garcia",
      guardianContact: "09667788991"
    },
    {
      timestamp: 1720000009000,
      status: "Approved",
      firstName: "Camille",
      middleName: "",
      lastName: "Navarro",
      name: "Camille Navarro",
      id: "111419",
      lrn: "135401090240",
      program: "BS Tourism Management",
      year: "1st Year",
      gender: "Female",
      civilStatus: "Single",
      birthday: "2007-09-08",
      religion: "Roman Catholic",
      contactNumber: "09078899002",
      gmail: "CamilleNavarro@gmail.com",
      facebook: "Camille Navarro",
      currentAddress: "Mangagoy, Bislig City, Surigao del Sur",
      preschool: "Bislig Little Angels Learning Center",
      elementary: "Mangagoy Central Elementary School",
      juniorHigh: "Bislig National High School",
      seniorHigh: "Saint Vincent De Paul Diocesan College - SHS",
      fatherName: "Arturo Navarro",
      fatherContact: "09778899002",
      motherMaidenName: "Beatriz Navarro",
      motherContact: "09889900113",
      guardianName: "Arturo Navarro",
      guardianContact: "09778899002"
    },
    {
      timestamp: 1720000010000,
      status: "Approved",
      firstName: "Rafael",
      middleName: "",
      lastName: "Mendoza",
      name: "Rafael Mendoza",
      id: "111308",
      lrn: "135401020158",
      program: "BS Hospitality Management",
      year: "4th Year",
      gender: "Female",
      civilStatus: "Single",
      birthday: "2004-05-17",
      religion: "Roman Catholic",
      contactNumber: "09451122335",
      gmail: "RafaelMendoza.hm@gmail.com",
      facebook: "Rafael Mendoza",
      currentAddress: "Montilla Boulevard, Butuan City, Agusan del Norte",
      preschool: "Father Saturnino Urios University Preschool",
      elementary: "Butuan Central Elementary School",
      juniorHigh: "Father Saturnino Urios University - JHS",
      seniorHigh: "Father Saturnino Urios University - SHS",
      fatherName: "Gabriel Mendoza",
      fatherContact: "09122334456",
      motherMaidenName: "Gloria Mendoza",
      motherContact: "09233445567",
      guardianName: "Gabriel Mendoza",
      guardianContact: "09122334456"
    },
    {
      timestamp: 1720000011000,
      status: "Approved",
      firstName: "Nicole",
      middleName: "",
      lastName: "Reyes",
      name: "Nicole Reyes",
      id: "111297",
      lrn: "135404120883",
      program: "BS Midwifery Education",
      year: "3rd Year",
      gender: "Female",
      civilStatus: "Single",
      birthday: "2005-12-21",
      religion: "Roman Catholic",
      contactNumber: "09214455667",
      gmail: "NicoleReyes.mid@gmail.com",
      facebook: "Nicole Reyes",
      currentAddress: "San Jose, Dinagat Islands",
      preschool: "Dinagat Learning Tree Preschool",
      elementary: "San Jose Central Elementary School",
      juniorHigh: "Don Ruben Ecleo Sr. Memorial National High School",
      seniorHigh: "Don Jose Ecleo Memorial Foundation College of Science & Technology - SHS",
      fatherName: "Ernesto Reyes",
      fatherContact: "09344556678",
      motherMaidenName: "Marivic Reyes",
      motherContact: "09455667789",
      guardianName: "Marivic Reyes",
      guardianContact: "09455667789"
    },
    {
      timestamp: 1720000012000,
      status: "Approved",
      firstName: "Ethan",
      middleName: "",
      lastName: "Flores",
      name: "Ethan Flores",
      id: "111186",
      lrn: "135401080926",
      program: "BS Tourism Management",
      year: "2nd Year",
      gender: "Male",
      civilStatus: "Single",
      birthday: "2006-06-14",
      religion: "United Church of Christ in the Philippines (UCCP)",
      contactNumber: "09356677881",
      gmail: "EthanFlores.tourism@gmail.com",
      facebook: "Ethan Flores",
      currentAddress: "Cantilan, Surigao del Sur",
      preschool: "Cantilan Community Preschool",
      elementary: "Cantilan Pilot Elementary School",
      juniorHigh: "Cantilan National High School",
      seniorHigh: "Surigao del Sur State University - Cantilan Campus SHS",
      fatherName: "Samuel Flores",
      fatherContact: "09566778892",
      motherMaidenName: "Rowena Flores",
      motherContact: "09677889903",
      guardianName: "Samuel Flores",
      guardianContact: "09566778892"
    }
  ];

  let submissions = JSON.parse(localStorage.getItem("gpath_submissions")) || [];
  let submissionsChanged = false;
  defaultApprovedStudents.forEach(defaultItem => {
    const exists = submissions.some(s => String(s.id) === String(defaultItem.id));
    if (!exists) {
      submissions.push(defaultItem);
      submissionsChanged = true;
    }
  });
  if (submissionsChanged || submissions.length === 0) {
    localStorage.setItem("gpath_submissions", JSON.stringify(submissions));
  }

  let existingStudents = JSON.parse(localStorage.getItem("gpath_students")) || [];
  let studentsChanged = false;
  defaultApprovedStudents.forEach(defaultItem => {
    const exists = existingStudents.some(st => String(st.id) === String(defaultItem.id));
    if (!exists) {
      existingStudents.push({
        name: `${defaultItem.firstName} ${defaultItem.lastName}`,
        id: defaultItem.id,
        year: defaultItem.year,
        program: defaultItem.program,
        section: "Room 1",
        gender: defaultItem.gender || "N/A",
        birthday: defaultItem.birthday || "N/A",
        updated: "Just now",
        standing: "Regular",
        status: "Active"
      });
      studentsChanged = true;
    }
  });
  if (studentsChanged || existingStudents.length === 0) {
    localStorage.setItem("gpath_students", JSON.stringify(existingStudents));
  }

  const subTabsContainer = document.querySelector(".sub-tabs");
  if (subTabsContainer && !document.getElementById("submissionBackBtn")) {
    const backBtn = document.createElement("button");
    backBtn.type = "button";
    backBtn.id = "submissionBackBtn";
    backBtn.className = "sub-tab-btn";
    backBtn.textContent = "❮";
    backBtn.title = "Back to Students";
    backBtn.style.cssText = "font-weight: bold; cursor: pointer;";
    backBtn.addEventListener("click", () => {
      window.location.href = "Student.html";
    });
    subTabsContainer.prepend(backBtn);
  }

  const tabBtns = document.querySelectorAll(".sub-tab-btn:not(#submissionBackBtn)");
  const pendingSection = document.getElementById("pendingSection");
  const approvedSection = document.getElementById("approvedSection");
  const pendingList = document.getElementById("pendingList");
  const approvedList = document.getElementById("approvedList");
  const pendingBadge = document.getElementById("pendingBadge");
  const approvedBadge = document.getElementById("approvedBadge");

  if (pendingSection) pendingSection.classList.add("active");
  if (approvedSection) approvedSection.classList.remove("active");
  tabBtns.forEach(b => {
    if (b.dataset.tab === "pending") {
      b.classList.add("active");
    } else if (b.dataset.tab === "approved") {
      b.classList.remove("active");
    }
  });

  function getManualStudents() {
    const allStudents = JSON.parse(localStorage.getItem("gpath_students")) || [];
    const defaultIds = defaultApprovedStudents.map(d => String(d.id));
    return allStudents.filter(s => !defaultIds.includes(String(s.id)));
  }

  let approvedHeaderAction = document.getElementById("approvedHeaderAction");
  if (!approvedHeaderAction) {
    approvedHeaderAction = document.createElement("div");
    approvedHeaderAction.id = "approvedHeaderAction";
    approvedHeaderAction.style.cssText = "display: none; justify-content: flex-end; margin-bottom: 12px; margin-top: -8px;";
    
    const manualStudents = getManualStudents();
    const hasManualStudents = manualStudents.length > 0;
    
    approvedHeaderAction.innerHTML = `
      <button type="button" id="manualPreloadBtn" title="Add Student Record Details" style="background: #007bff; border: none; border-radius: 6px; width: 38px; height: 38px; display: flex; align-items: center; justify-content: center; cursor: ${hasManualStudents ? 'pointer' : 'not-allowed'}; opacity: ${hasManualStudents ? '1.0' : '0.3'}; transition: opacity 0.2s;">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="white"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
      </button>
    `;
    
    approvedSection.parentNode.insertBefore(approvedHeaderAction, approvedSection);

    document.getElementById("manualPreloadBtn").addEventListener("click", () => {
      const currentManual = getManualStudents();
      if (currentManual.length === 0) return;

      const latestManual = currentManual[0];
      
      let currentSubmissions = JSON.parse(localStorage.getItem("gpath_submissions")) || [];
      let targetSub = currentSubmissions.find(s => String(s.id) === String(latestManual.id));

      if (!targetSub) {
        targetSub = {
          timestamp: Date.now(),
          status: "Approved",
          firstName: latestManual.name.split(" ")[0] || "",
          middleName: "",
          lastName: latestManual.name.split(" ").slice(1).join(" ") || "",
          name: latestManual.name,
          id: latestManual.id,
          lrn: "",
          program: latestManual.program || "",
          year: latestManual.year || "",
          gender: latestManual.gender || "",
          civilStatus: "Single",
          birthday: latestManual.birthday || "",
          religion: "",
          contactNumber: "",
          gmail: "",
          facebook: "",
          currentAddress: "",
          preschool: "",
          elementary: "",
          juniorHigh: "",
          seniorHigh: "",
          fatherName: "",
          fatherContact: "",
          motherMaidenName: "",
          motherContact: "",
          guardianName: "",
          guardianContact: ""
        };
        currentSubmissions.unshift(targetSub);
        localStorage.setItem("gpath_submissions", JSON.stringify(currentSubmissions));
      }

      if (typeof window.viewSubmissionDetails === "function") {
        window.viewSubmissionDetails(targetSub.timestamp);
      }
    });
  }

  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      tabBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const target = btn.dataset.tab;
      if (target === "pending") {
        pendingSection.classList.add("active");
        approvedSection.classList.remove("active");
        if (approvedHeaderAction) approvedHeaderAction.style.display = "none";
      } else {
        approvedSection.classList.add("active");
        pendingSection.classList.remove("active");
        if (approvedHeaderAction) approvedHeaderAction.style.display = "flex";
      }
    });
  });

  function loadSubmissions() {
    const currentSubmissions = JSON.parse(localStorage.getItem("gpath_submissions")) || [];
    
    const pending = currentSubmissions.filter(s => s.status === "Pending");
    const approved = currentSubmissions.filter(s => s.status === "Approved");

    pendingBadge.textContent = pending.length;
    approvedBadge.textContent = approved.length;

    const manualStudents = getManualStudents();
    const preloadBtn = document.getElementById("manualPreloadBtn");
    if (preloadBtn) {
      const activeState = manualStudents.length > 0;
      preloadBtn.style.opacity = activeState ? "1.0" : "0.3";
      preloadBtn.style.cursor = activeState ? "pointer" : "not-allowed";
    }

    if (pending.length === 0) {
      pendingList.innerHTML = `<p class="empty-state">No pending student submissions.</p>`;
    } else {
      pendingList.innerHTML = pending.map(item => {
        const displayName = item.firstName && item.lastName 
          ? `${item.firstName} ${item.middleName ? item.middleName + ' ' : ''}${item.lastName}` 
          : (item.name || "Unnamed Student");

        return `
          <div class="sub-card">
            <div class="sub-card-info">
              <h3>${displayName}</h3>
              <p><strong>ID:</strong> ${item.id || "N/A"} | <strong>Course:</strong> ${item.program || "N/A"}</p>
              <p><strong>Email:</strong> ${item.gmail || "N/A"} | <strong>Contact:</strong> ${item.contactNumber || "N/A"}</p>
            </div>
            <div class="sub-card-actions">
              <button class="btn-view" onclick="viewSubmissionDetails('${item.timestamp}')">View Details</button>
              <button class="btn-approve" onclick="approveSubmission('${item.timestamp}')">Approve</button>
              <button class="btn-decline" onclick="handleAction('${item.timestamp}', 'Declined')">Decline</button>
            </div>
          </div>
        `;
      }).join("");
    }

    if (approved.length === 0) {
      approvedList.innerHTML = `<p class="empty-state">No approved student records yet.</p>`;
    } else {
      approvedList.innerHTML = approved.map(item => {
        const displayName = item.firstName && item.lastName 
          ? `${item.firstName} ${item.middleName ? item.middleName + ' ' : ''}${item.lastName}` 
          : (item.name || "Unnamed Student");

        return `
          <div class="sub-card approved-card">
            <div class="sub-card-info">
              <h3>${displayName}</h3>
              <p><strong>ID:</strong> ${item.id} | <strong>Course:</strong> ${item.program}</p>
              <span class="approved-tag">Approved & Archived</span>
            </div>
            <div class="sub-card-actions">
              <button class="btn-view" onclick="viewSubmissionDetails('${item.timestamp}')">View Details</button>
            </div>
          </div>
        `;
      }).join("");
    }
  }

  window.approveSubmission = function(timestamp) {
    let currentSubmissions = JSON.parse(localStorage.getItem("gpath_submissions")) || [];
    const index = currentSubmissions.findIndex(s => String(s.timestamp) === String(timestamp));
    
    if (index === -1) return;

    currentSubmissions[index].status = "Approved";
    localStorage.setItem("gpath_submissions", JSON.stringify(currentSubmissions));

    let students = JSON.parse(localStorage.getItem("gpath_students"));
    if (!Array.isArray(students)) students = [];

    const item = currentSubmissions[index];
    const existingIndex = students.findIndex(st => String(st.id) === String(item.id));
    
    const fName = item.firstName || item.name?.split(" ")[0] || "";
    const lName = item.lastName || item.name?.split(" ").pop() || "";
    const tableDisplayName = `${fName} ${lName}`.trim();

    const studentRecord = {
      name: tableDisplayName,
      id: item.id,
      year: item.year || "3rd Year",
      program: item.program || "BS Information Technology",
      section: "Room 1",
      gender: item.gender || "N/A",
      birthday: item.birthday || "N/A",
      updated: "Just now",
      standing: item.standing || "Regular",
      status: "Active"
    };

    if (existingIndex !== -1) {
      students[existingIndex] = studentRecord;
    } else {
      students.unshift(studentRecord);
    }

    localStorage.setItem("gpath_students", JSON.stringify(students));

    if (typeof window.addSystemNotification === "function") {
      window.addSystemNotification(
        "Student approved",
        `${tableDisplayName} (${item.id}) was approved from a submission.`,
        "green"
      );
    }

    sessionStorage.setItem("autoOpenStudentId", item.id);
    window.location.href = "Student.html";
  };

  window.viewSubmissionDetails = function(timestamp) {
    const currentSubmissions = JSON.parse(localStorage.getItem("gpath_submissions")) || [];
    const item = currentSubmissions.find(s => String(s.timestamp) === String(timestamp));
    if (!item) return;

    function renderModal(isEdit) {
      document.getElementById("submissionModal")?.remove();

      const modalHtml = `
        <div class="sub-modal-overlay" id="submissionModal">
          <div class="sub-modal-card" style="${isEdit ? 'border: 2px solid #007bff;' : ''}">
            <div class="sub-modal-header" style="${isEdit ? 'background: #007bff; color: white;' : ''}">
              <h3>${isEdit ? 'Edit Student Submission Details' : 'Student Submission Details'}</h3>
              <div style="display: flex; align-items: center; gap: 8px;">
                <button type="button" id="toggleEditMode" style="background: ${isEdit ? '#28a745' : '#6c757d'}; color: white; border: none; padding: 5px 12px; border-radius: 4px; cursor: pointer; font-size: 12px; font-weight: 600;">
                  ${isEdit ? '✧ Save Changes' : '✎ Edit'}
                </button>
                <button type="button" class="sub-modal-close" onclick="document.getElementById('submissionModal').remove()">✖</button>
              </div>
            </div>
            <div class="sub-modal-body">
              <div class="sub-info-grid">
                <div>
                  <label>First Name</label>
                  ${isEdit ? '<input type="text" id="edit_firstName" value="' + (item.firstName || '') + '" style="width:100%; padding:6px; border:1px solid #ccc; border-radius:4px;">' : '<strong>' + (item.firstName || 'N/A') + '</strong>'}
                </div>
                <div>
                  <label>Middle Name</label>
                  ${isEdit ? '<input type="text" id="edit_middleName" value="' + (item.middleName || '') + '" style="width:100%; padding:6px; border:1px solid #ccc; border-radius:4px;">' : '<strong>' + (item.middleName || 'N/A') + '</strong>'}
                </div>
                <div>
                  <label>Last Name</label>
                  ${isEdit ? '<input type="text" id="edit_lastName" value="' + (item.lastName || '') + '" style="width:100%; padding:6px; border:1px solid #ccc; border-radius:4px;">' : '<strong>' + (item.lastName || 'N/A') + '</strong>'}
                </div>
                <div>
                  <label>Student ID</label>
                  ${isEdit ? '<input type="text" id="edit_id" value="' + (item.id || '') + '" style="width:100%; padding:6px; border:1px solid #ccc; border-radius:4px;">' : '<strong>' + (item.id || 'N/A') + '</strong>'}
                </div>
                <div>
                  <label>LRN</label>
                  ${isEdit ? '<input type="text" id="edit_lrn" value="' + (item.lrn || '') + '" style="width:100%; padding:6px; border:1px solid #ccc; border-radius:4px;">' : '<strong>' + (item.lrn || 'N/A') + '</strong>'}
                </div>
                <div>
                  <label>Course / Program</label>
                  ${isEdit ? '<input type="text" id="edit_program" value="' + (item.program || '') + '" style="width:100%; padding:6px; border:1px solid #ccc; border-radius:4px;">' : '<strong>' + (item.program || 'N/A') + '</strong>'}
                </div>
                <div>
                  <label>Year Level</label>
                  ${isEdit ? '<input type="text" id="edit_year" value="' + (item.year || '') + '" style="width:100%; padding:6px; border:1px solid #ccc; border-radius:4px;">' : '<strong>' + (item.year || 'N/A') + '</strong>'}
                </div>
                <div>
                  <label>Gender</label>
                  ${isEdit ? '<input type="text" id="edit_gender" value="' + (item.gender || '') + '" style="width:100%; padding:6px; border:1px solid #ccc; border-radius:4px;">' : '<strong>' + (item.gender || 'N/A') + '</strong>'}
                </div>
                <div>
                  <label>Civil Status</label>
                  ${isEdit ? '<input type="text" id="edit_civilStatus" value="' + (item.civilStatus || '') + '" style="width:100%; padding:6px; border:1px solid #ccc; border-radius:4px;">' : '<strong>' + (item.civilStatus || 'N/A') + '</strong>'}
                </div>
                <div>
                  <label>Birthday</label>
                  ${isEdit ? '<input type="date" id="edit_birthday" value="' + (item.birthday || '') + '" style="width:100%; padding:6px; border:1px solid #ccc; border-radius:4px;">' : '<strong>' + (item.birthday || 'N/A') + '</strong>'}
                </div>
                <div>
                  <label>Religion</label>
                  ${isEdit ? '<input type="text" id="edit_religion" value="' + (item.religion || '') + '" style="width:100%; padding:6px; border:1px solid #ccc; border-radius:4px;">' : '<strong>' + (item.religion || 'N/A') + '</strong>'}
                </div>
                <div>
                  <label>Contact Number</label>
                  ${isEdit ? '<input type="text" id="edit_contactNumber" value="' + (item.contactNumber || '') + '" style="width:100%; padding:6px; border:1px solid #ccc; border-radius:4px;">' : '<strong>' + (item.contactNumber || 'N/A') + '</strong>'}
                </div>
                <div>
                  <label>Gmail</label>
                  ${isEdit ? '<input type="email" id="edit_gmail" value="' + (item.gmail || '') + '" style="width:100%; padding:6px; border:1px solid #ccc; border-radius:4px;">' : '<strong>' + (item.gmail || 'N/A') + '</strong>'}
                </div>
                <div>
                  <label>Facebook</label>
                  ${isEdit ? '<input type="text" id="edit_facebook" value="' + (item.facebook || '') + '" style="width:100%; padding:6px; border:1px solid #ccc; border-radius:4px;">' : '<strong>' + (item.facebook || 'N/A') + '</strong>'}
                </div>
                <div class="full-span">
                  <label>Current Address</label>
                  ${isEdit ? '<input type="text" id="edit_currentAddress" value="' + (item.currentAddress || '') + '" style="width:100%; padding:6px; border:1px solid #ccc; border-radius:4px;">' : '<strong>' + (item.currentAddress || 'N/A') + '</strong>'}
                </div>
                <div class="full-span">
                  <label>Educational Background</label>
                  ${isEdit ? '<div style="display: flex; gap: 6px; flex-wrap: wrap;"><input type="text" id="edit_preschool" placeholder="Preschool" value="' + (item.preschool || '') + '" style="flex:1; padding:6px; border:1px solid #ccc; border-radius:4px;"><input type="text" id="edit_elementary" placeholder="Elementary" value="' + (item.elementary || '') + '" style="flex:1; padding:6px; border:1px solid #ccc; border-radius:4px;"><input type="text" id="edit_juniorHigh" placeholder="Junior High" value="' + (item.juniorHigh || '') + '" style="flex:1; padding:6px; border:1px solid #ccc; border-radius:4px;"><input type="text" id="edit_seniorHigh" placeholder="Senior High" value="' + (item.seniorHigh || '') + '" style="flex:1; padding:6px; border:1px solid #ccc; border-radius:4px;"></div>' : '<strong>Preschool: ' + (item.preschool || 'N/A') + ' | Elem: ' + (item.elementary || 'N/A') + ' | JHS: ' + (item.juniorHigh || 'N/A') + ' | SHS: ' + (item.seniorHigh || 'N/A') + '</strong>'}
                </div>
                <div>
                  <label>Father's Name</label>
                  ${isEdit ? '<input type="text" id="edit_fatherName" placeholder="Father\'s Name" value="' + (item.fatherName || '') + '" style="width:100%; padding:6px; border:1px solid #ccc; border-radius:4px; margin-bottom:4px;"><input type="text" id="edit_fatherContact" placeholder="Contact Number" value="' + (item.fatherContact || '') + '" style="width:100%; padding:6px; border:1px solid #ccc; border-radius:4px;">' : '<strong>' + (item.fatherName || 'N/A') + ' (' + (item.fatherContact || 'No contact') + ')</strong>'}
                </div>
                <div>
                  <label>Mother's Name</label>
                  ${isEdit ? '<input type="text" id="edit_motherMaidenName" placeholder="Mother\'s Name" value="' + (item.motherMaidenName || '') + '" style="width:100%; padding:6px; border:1px solid #ccc; border-radius:4px; margin-bottom:4px;"><input type="text" id="edit_motherContact" placeholder="Contact Number" value="' + (item.motherContact || '') + '" style="width:100%; padding:6px; border:1px solid #ccc; border-radius:4px;">' : '<strong>' + (item.motherMaidenName || 'N/A') + ' (' + (item.motherContact || 'No contact') + ')</strong>'}
                </div>
                <div>
                  <label>Guardian's Name</label>
                  ${isEdit ? '<input type="text" id="edit_guardianName" placeholder="Guardian\'s Name" value="' + (item.guardianName || '') + '" style="width:100%; padding:6px; border:1px solid #ccc; border-radius:4px; margin-bottom:4px;"><input type="text" id="edit_guardianContact" placeholder="Contact Number" value="' + (item.guardianContact || '') + '" style="width:100%; padding:6px; border:1px solid #ccc; border-radius:4px;">' : '<strong>' + (item.guardianName || 'N/A') + ' (' + (item.guardianContact || 'No contact') + ')</strong>'}
                </div>
              </div>
            </div>
          </div>
        </div>
      `;

      document.body.insertAdjacentHTML("beforeend", modalHtml);

      document.getElementById("toggleEditMode").addEventListener("click", () => {
        if (!isEdit) {
          renderModal(true);
        } else {
          item.firstName = document.getElementById("edit_firstName").value.trim();
          item.middleName = document.getElementById("edit_middleName").value.trim();
          item.lastName = document.getElementById("edit_lastName").value.trim();
          item.name = `${item.firstName} ${item.middleName ? item.middleName + ' ' : ''}${item.lastName}`.trim();
          item.id = document.getElementById("edit_id").value.trim();
          item.lrn = document.getElementById("edit_lrn").value.trim();
          item.program = document.getElementById("edit_program").value.trim();
          item.year = document.getElementById("edit_year").value.trim();
          item.gender = document.getElementById("edit_gender").value.trim();
          item.civilStatus = document.getElementById("edit_civilStatus").value.trim();
          item.birthday = document.getElementById("edit_birthday").value.trim();
          item.religion = document.getElementById("edit_religion").value.trim();
          item.contactNumber = document.getElementById("edit_contactNumber").value.trim();
          item.gmail = document.getElementById("edit_gmail").value.trim();
          item.facebook = document.getElementById("edit_facebook").value.trim();
          item.currentAddress = document.getElementById("edit_currentAddress").value.trim();
          item.preschool = document.getElementById("edit_preschool").value.trim();
          item.elementary = document.getElementById("edit_elementary").value.trim();
          item.juniorHigh = document.getElementById("edit_juniorHigh").value.trim();
          item.seniorHigh = document.getElementById("edit_seniorHigh").value.trim();
          item.fatherName = document.getElementById("edit_fatherName").value.trim();
          item.fatherContact = document.getElementById("edit_fatherContact").value.trim();
          item.motherMaidenName = document.getElementById("edit_motherMaidenName").value.trim();
          item.motherContact = document.getElementById("edit_motherContact").value.trim();
          item.guardianName = document.getElementById("edit_guardianName").value.trim();
          item.guardianContact = document.getElementById("edit_guardianContact").value.trim();

          localStorage.setItem("gpath_submissions", JSON.stringify(currentSubmissions));

          let students = JSON.parse(localStorage.getItem("gpath_students")) || [];
          const studentIndex = students.findIndex(st => String(st.id) === String(item.id));
          if (studentIndex !== -1) {
            students[studentIndex].name = `${item.firstName} ${item.lastName}`.trim();
            students[studentIndex].year = item.year;
            students[studentIndex].program = item.program;
            students[studentIndex].gender = item.gender;
            students[studentIndex].birthday = item.birthday;
            localStorage.setItem("gpath_students", JSON.stringify(students));
          }

          if (typeof showToast === "function") {
            showToast("Submission updated successfully.");
          }

          loadSubmissions();
          renderModal(false);
        }
      });
    }

    renderModal(false);
  };

  window.handleAction = function(timestamp, action) {
    let currentSubmissions = JSON.parse(localStorage.getItem("gpath_submissions")) || [];
    const index = currentSubmissions.findIndex(s => String(s.timestamp) === String(timestamp));
    
    if (index === -1) return;

    if (action === "Declined") {
      currentSubmissions.splice(index, 1);
      localStorage.setItem("gpath_submissions", JSON.stringify(currentSubmissions));
      loadSubmissions();
    }
  };

  loadSubmissions();
});