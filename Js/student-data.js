const studentData = [
  { name: "Ana Cruz", id: "110187", year: "3rd Year", program: "BS Information Technology", section: "Room 5", gender: "Female", birthday: "October 14, 2005", updated: "2 hours ago", standing: "Regular", status: "Active" },
  { name: "Miguel Santos", id: "110638", year: "2nd Year", program: "BS Criminology", section: "Room 2", gender: "Male", birthday: "March 22, 2006", updated: "May 18, 2024", standing: "Regular", status: "Active" },
  { name: "Maria Lim", id: "110744", year: "4th Year", program: "BS Hospitality Management", section: "Room 9", gender: "Female", birthday: "January 05, 2005", updated: "May 15, 2024", standing: "Irregular", status: "Follow-up" },
  { name: "Joshua Reyes", id: "110859", year: "3rd Year", program: "BS Tourism Management", section: "Room 6", gender: "Male", birthday: "July 19, 2005", updated: "May 12, 2024", standing: "Regular", status: "Active" },
  { name: "Sofia Mendoza", id: "110963", year: "4th Year", program: "BS Midwifery Education", section: "Room 4", gender: "Female", birthday: "November 30, 2004", updated: "May 10, 2024", standing: "Regular", status: "Active" },
  { name: "Liam Torres", id: "111074", year: "1st Year", program: "BS Information Technology", section: "Room 13", gender: "Male", birthday: "February 12, 2008", updated: "May 8, 2024", standing: "Transferee", status: "Monitoring" },
  { name: "Aris Villanueva", id: "110198", year: "2nd Year", program: "BS Information Technology", section: "Room 14", gender: "Male", birthday: "August 25, 2006", updated: "June 12, 2026", standing: "Regular", status: "Active" },
  { name: "Daniel Garcia", id: "111530", year: "3rd Year", program: "BS Criminology", section: "Room 13", gender: "Male", birthday: "April 03, 2005", updated: "June 10, 2026", standing: "Irregular", status: "Active" },
  { name: "Camille Navarro", id: "111419", year: "1st Year", program: "BS Tourism Management", section: "Room 5", gender: "Female", birthday: "September 08, 2007", updated: "June 8, 2026", standing: "Transferee", status: "Monitoring" },
  { name: "Rafael Mendoza", id: "111308", year: "4th Year", program: "BS Hospitality Management", section: "Room 3", gender: "Female", birthday: "May 17, 2004", updated: "June 5, 2026", standing: "Regular", status: "Active" },
  { name: "Nicole Reyes", id: "111297", year: "3rd Year", program: "BS Midwifery Education", section: "7", gender: "Female", birthday: "December 21, 2005", updated: "June 3, 2026", standing: "Regular", status: "Follow-up" },
  { name: "Ethan Flores", id: "111186", year: "2nd Year", program: "BS Tourism Management", section: "9", gender: "Male", birthday: "June 14, 2006", updated: "May 30, 2026", standing: "Irregular", status: "Active" }
];

const avatarClasses = ["teal-bg", "green-bg", "violet-bg", "blue-bg"];

function initials(name) {
  return name.split(" ").map(part => part[0]).join("").slice(0, 2).toUpperCase();
}

function statusClass(status) {
  return status.toLowerCase().replace(/\s+/g, "");
}

function renderStudents(list = studentData) {
  const body = document.getElementById("studentTableBody");
  if (!body) return;

  if (!list.length) {
    body.innerHTML = `
      <tr>
        <td colspan="6" class="no-students">No students found.</td>
      </tr>
    `;
    return;
  }

  body.innerHTML = list.map((student, index) => `
    <tr>
      <td>
        <div class="table-user-info">
          <div class="table-avatar ${avatarClasses[index % avatarClasses.length]}">${initials(student.name)}</div>
          <span>${student.name}</span>
        </div>
      </td>
      <td>${student.id}</td>
      <td>${student.year}</td>
      <td>${student.updated}</td>
      <td>
        <span class="status-pill ${statusClass(student.status)}">
          <span class="pill-dot"></span> ${student.status}
        </span>
      </td>
      <td>
        <button class="view-profile-btn" data-student-id="${student.id}">
          View Information <span>›</span>
        </button>
      </td>
    </tr>
  `).join("");

  document.querySelectorAll(".view-profile-btn").forEach(button => {
    button.addEventListener("click", () => {
      const student = studentData.find(item => item.id === button.dataset.studentId);
      if (student && typeof openStudentProfile === "function") {
        openStudentProfile(student);
      }
    });
  });
}

function filterStudents() {
  const search = document.querySelector(".student-search-input")?.value.trim().toLowerCase() || "";
  const selects = document.querySelectorAll(".filter-select");
  const year = selects[0]?.value || "All Year Levels";
  const section = selects[1]?.value || "All Sections";
  const status = selects[2]?.value || "All Statuses";

  const filtered = studentData.filter(student => {
    const matchesSearch =
      student.name.toLowerCase().includes(search) ||
      student.id.toLowerCase().includes(search);

    const matchesYear = year === "All Year Levels" || student.year === year;
    const matchesSection = section === "All Sections" || student.section === section;
    const matchesStatus = status === "All Statuses" || student.status === status;

    return matchesSearch && matchesYear && matchesSection && matchesStatus;
  });

  renderStudents(filtered);
}

function addStudent(newStudent) {
  const alreadyExists = studentData.some(student => student.id === newStudent.id);

  if (alreadyExists) {
    if (typeof showToast === "function") {
      showToast(`Student ID ${newStudent.id} already exists.`);
    }
    return false;
  }

  studentData.unshift(newStudent);

  if (typeof filterStudents === "function") {
    filterStudents();
  } else {
    renderStudents();
  }

  if (typeof window.addSystemNotification === "function") {
    window.addSystemNotification(
      "Student added",
      `${newStudent.name} (${newStudent.id}) was added to the system.`,
      "green"
    );
  }

  return true;
}

function deleteStudent(studentId) {
  const index = studentData.findIndex(student => student.id === studentId);
  if (index === -1) return false;

  const [removed] = studentData.splice(index, 1);

  if (typeof filterStudents === "function") {
    filterStudents();
  } else {
    renderStudents();
  }

  if (typeof window.addSystemNotification === "function") {
    window.addSystemNotification(
      "Student deleted",
      `${removed.name} (${removed.id}) was removed from the system.`,
      "red"
    );
  }

  return true;
}

document.addEventListener("DOMContentLoaded", () => {
  renderStudents();

  document.querySelector(".student-search-input")?.addEventListener("input", filterStudents);
  document.querySelectorAll(".filter-select").forEach(select => {
    select.addEventListener("change", filterStudents);
  });

  const pendingRaw = sessionStorage.getItem("pendingNewStudent");
  if (pendingRaw) {
    sessionStorage.removeItem("pendingNewStudent");
    try {
      const pendingStudent = JSON.parse(pendingRaw);
      const wasAdded = addStudent(pendingStudent);
      if (wasAdded && typeof showToast === "function") {
        showToast(`${pendingStudent.name || "Student"} added successfully.`);
      }
    } catch (err) {
      console.error("Could not read the student added from Dashboard.html:", err);
    }
  }
});