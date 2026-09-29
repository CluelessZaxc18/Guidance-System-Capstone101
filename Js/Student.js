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

// New ==============================

// --- MENU ELEMENTS (Version 2) ---
const studentToggle2 = document.getElementById("studentToggle2");
const studentMenu2 = document.getElementById("studentMenu2");

// Handles opening and closing the sidebar sub-menu dropdown
if (studentToggle2 && studentMenu2) {
  studentToggle2.addEventListener("click", () => {
    const isOpen = studentMenu2.classList.toggle("open");
    studentToggle2.classList.toggle("open", isOpen);
    studentToggle2.setAttribute("aria-expanded", isOpen);
  });
}


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
      
      // Auto-opens the parent menu if an internal submenu link is clicked
      if (studentToggle2 && studentMenu2) {
        studentToggle2.classList.add("open");
        studentMenu2.classList.add("open");
      }
    }

    // Update text content in header layout instantly 
    const selectedPage = item.dataset.page;
    if (pageName) pageName.textContent = selectedPage;
    if (pageTitle) pageTitle.textContent = selectedPage;
  });
});

// New ==============================

// --- MENU ELEMENTS (Version 3) ---
const studentToggle3 = document.getElementById("studentToggle3");
const studentMenu3 = document.getElementById("studentMenu3");

// Handles opening and closing the sidebar sub-menu dropdown
if (studentToggle3 && studentMenu3) {
  studentToggle3.addEventListener("click", () => {
    const isOpen = studentMenu3.classList.toggle("open");
    studentToggle3.classList.toggle("open", isOpen);
    studentToggle3.setAttribute("aria-expanded", isOpen);
  });
}


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
      
      // Auto-opens the parent menu if an internal submenu link is clicked
      if (studentToggle3 && studentMenu3) {
        studentToggle3.classList.add("open");
        studentMenu3.classList.add("open");
      }
    }

    // Update text content in header layout instantly 
    const selectedPage = item.dataset.page;
    if (pageName) pageName.textContent = selectedPage;
    if (pageTitle) pageTitle.textContent = selectedPage;
  });
});

// New ==============================

// --- MENU ELEMENTS (Version 4) ---
const studentToggle4 = document.getElementById("studentToggle4");
const studentMenu4 = document.getElementById("studentMenu4");

// Handles opening and closing the sidebar sub-menu dropdown
if (studentToggle4 && studentMenu4) {
  studentToggle4.addEventListener("click", () => {
    const isOpen = studentMenu4.classList.toggle("open");
    studentToggle4.classList.toggle("open", isOpen);
    studentToggle4.setAttribute("aria-expanded", isOpen);
  });
}


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
      
      // Auto-opens the parent menu if an internal submenu link is clicked
      if (studentToggle4 && studentMenu4) {
        studentToggle4.classList.add("open");
        studentMenu4.classList.add("open");
      }
    }

    // Update text content in header layout instantly 
    const selectedPage = item.dataset.page;
    if (pageName) pageName.textContent = selectedPage;
    if (pageTitle) pageTitle.textContent = selectedPage;
  });
});


// =========== Notification =============

const notifs = JSON.parse(localStorage.getItem('gpath_notifications')) || [];
notifs.unshift({ id: Date.now(), title: 'Student Record Updated', desc: 'Added or modified a student profile', type: 'purple', time: 'Just now', unread: true });
localStorage.setItem('gpath_notifications', JSON.stringify(notifs));