const studentToggle = document.getElementById("studentToggle");
const studentMenu = document.getElementById("studentMenu");
const pageName = document.getElementById("pageName");
const pageTitle = document.getElementById("pageTitle");

// Handles opening and closing the sidebar sub-menu dropdown
studentToggle.addEventListener("click", () => {
  const isOpen = studentMenu.classList.toggle("open");
  studentToggle.classList.toggle("open", isOpen);
  studentToggle.setAttribute("aria-expanded", isOpen);
});

// Handles sidebar visual active highlighting and header title updates
document.querySelectorAll("[data-page]").forEach(item => {
  item.addEventListener("click", () => {
    // Remove active styles from other elements
    document.querySelectorAll(".nav-item, .submenu a").forEach(el => {
      el.classList.remove("active");
    });

    // Add active layout highlights to current selection
    if (item.classList.contains("nav-item")) {
      item.classList.add("active");
    } else {
      item.classList.add("active");
      studentToggle.classList.add("open");
      studentMenu.classList.add("open");
    }

    // Update text content in header layout instantly 
    const selectedPage = item.dataset.page;
    if (pageName) pageName.textContent = selectedPage;
    if (pageTitle) pageTitle.textContent = selectedPage;
  });
});
