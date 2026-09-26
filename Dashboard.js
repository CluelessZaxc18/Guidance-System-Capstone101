const studentToggle = document.getElementById("studentToggle");
const studentMenu = document.getElementById("studentMenu");
const pageName = document.getElementById("pageName");
const pageTitle = document.getElementById("pageTitle");
const toast = document.getElementById("toast");

studentToggle.addEventListener("click", () => {
  const isOpen = studentMenu.classList.toggle("open");
  studentToggle.classList.toggle("open", isOpen);
  studentToggle.setAttribute("aria-expanded", isOpen);
});

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

document.querySelectorAll("[data-page]").forEach(item => {
  item.addEventListener("click", event => {
    event.preventDefault();

    document.querySelectorAll(".nav-item, .submenu a").forEach(el => {
      el.classList.remove("active");
    });

    if (item.classList.contains("nav-item")) {
      item.classList.add("active");
    } else {
      item.classList.add("active");
      studentToggle.classList.add("open");
      studentMenu.classList.add("open");
    }

    const selectedPage = item.dataset.page;
    pageName.textContent = selectedPage;
    pageTitle.textContent = selectedPage;

    if (selectedPage !== "Dashboard") {
      showToast(`${selectedPage} selected — page can be connected next.`);
    }
  });
});

document.getElementById("addStudentBtn").addEventListener("click", () => {
  showToast("Add Student form can be connected next.");
});

document.getElementById("quickStudent").addEventListener("click", () => {
  showToast("Add Student form can be connected next.");
});

document.getElementById("quickDocument").addEventListener("click", () => {
  showToast("Document upload can be connected next.");
});

document.getElementById("quickReport").addEventListener("click", () => {
  showToast("Report generation can be connected next.");
});

document.getElementById("notificationBtn").addEventListener("click", () => {
  showToast("You have 3 new notifications.");
});
