
const religion = document.getElementById("religion");
const otherReligionWrap = document.getElementById("otherReligionWrap");
if (religion && otherReligionWrap) {
  religion.addEventListener("change", () => otherReligionWrap.classList.toggle("show", religion.value === "Other"));
}

document.querySelectorAll(".person-toggle").forEach(button => {
  button.addEventListener("click", () => {
    const target = document.getElementById(button.dataset.target);
    if (!target) return;
    const isOpen = target.classList.contains("open");
    document.querySelectorAll(".person-details").forEach(x => x.classList.remove("open"));
    document.querySelectorAll(".person-toggle").forEach(x => x.classList.remove("open"));
    if (!isOpen) { 
      target.classList.add("open"); 
      button.classList.add("open"); 
    }
  });
});

document.getElementById("studentForm").addEventListener("submit", e => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const studentObj = Object.fromEntries(formData.entries());

  // Store individual name components separately
  studentObj.firstName = studentObj.firstName ? studentObj.firstName.trim() : "";
  studentObj.middleName = studentObj.middleName ? studentObj.middleName.trim() : "";
  studentObj.lastName = studentObj.lastName ? studentObj.lastName.trim() : "";

  // Construct full name cleanly for reference
  studentObj.name = `${studentObj.firstName} ${studentObj.middleName ? studentObj.middleName + ' ' : ''}${studentObj.lastName}`.trim();

  studentObj.id = studentObj.idNumber && studentObj.idNumber.trim() !== "" ? studentObj.idNumber : "N/A";
  studentObj.year = studentObj.yearLevel || "1st Year";
  studentObj.program = studentObj.course && studentObj.course.trim() !== "" ? studentObj.course : "N/A";
  studentObj.status = "Pending";
  studentObj.updated = "Just now";
  studentObj.timestamp = Date.now();

  const submissions = JSON.parse(localStorage.getItem("gpath_submissions")) || [];
  submissions.unshift(studentObj);
  localStorage.setItem("gpath_submissions", JSON.stringify(submissions));

  const toast = document.getElementById("toast");
  toast.textContent = "Student submission sent successfully!";
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
    e.target.reset();
  }, 1800);
});