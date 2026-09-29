const studentToggle = document.getElementById("studentToggle");
const studentMenu = document.getElementById("studentMenu");
const pageName = document.getElementById("pageName");
const pageTitle = document.getElementById("pageTitle");

studentToggle.addEventListener("click", () => {
  const isOpen = studentMenu.classList.toggle("open");
  studentToggle.classList.toggle("open", isOpen);
  studentToggle.setAttribute("aria-expanded", isOpen);
});

document.querySelectorAll("[data-page]").forEach(item => {
  item.addEventListener("click", () => {
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
    if (pageName) pageName.textContent = selectedPage;
    if (pageTitle) pageTitle.textContent = selectedPage;
  });
});


const studentToggle2 = document.getElementById("studentToggle2");
const studentMenu2 = document.getElementById("studentMenu2");

if (studentToggle2 && studentMenu2) {
  studentToggle2.addEventListener("click", () => {
    const isOpen = studentMenu2.classList.toggle("open");
    studentToggle2.classList.toggle("open", isOpen);
    studentToggle2.setAttribute("aria-expanded", isOpen);
  });
}


document.querySelectorAll("[data-page]").forEach(item => {
  item.addEventListener("click", () => {
    document.querySelectorAll(".nav-item, .submenu a").forEach(el => {
      el.classList.remove("active");
    });

    if (item.classList.contains("nav-item")) {
      item.classList.add("active");
    } else {
      item.classList.add("active");
      
      if (studentToggle2 && studentMenu2) {
        studentToggle2.classList.add("open");
        studentMenu2.classList.add("open");
      }
    }

    const selectedPage = item.dataset.page;
    if (pageName) pageName.textContent = selectedPage;
    if (pageTitle) pageTitle.textContent = selectedPage;
  });
});


const studentToggle3 = document.getElementById("studentToggle3");
const studentMenu3 = document.getElementById("studentMenu3");

if (studentToggle3 && studentMenu3) {
  studentToggle3.addEventListener("click", () => {
    const isOpen = studentMenu3.classList.toggle("open");
    studentToggle3.classList.toggle("open", isOpen);
    studentToggle3.setAttribute("aria-expanded", isOpen);
  });
}


document.querySelectorAll("[data-page]").forEach(item => {
  item.addEventListener("click", () => {
    document.querySelectorAll(".nav-item, .submenu a").forEach(el => {
      el.classList.remove("active");
    });

    if (item.classList.contains("nav-item")) {
      item.classList.add("active");
    } else {
      item.classList.add("active");
      
      if (studentToggle3 && studentMenu3) {
        studentToggle3.classList.add("open");
        studentMenu3.classList.add("open");
      }
    }

    const selectedPage = item.dataset.page;
    if (pageName) pageName.textContent = selectedPage;
    if (pageTitle) pageTitle.textContent = selectedPage;
  });
});


const studentToggle4 = document.getElementById("studentToggle4");
const studentMenu4 = document.getElementById("studentMenu4");

if (studentToggle4 && studentMenu4) {
  studentToggle4.addEventListener("click", () => {
    const isOpen = studentMenu4.classList.toggle("open");
    studentToggle4.classList.toggle("open", isOpen);
    studentToggle4.setAttribute("aria-expanded", isOpen);
  });
}


document.querySelectorAll("[data-page]").forEach(item => {
  item.addEventListener("click", () => {
    document.querySelectorAll(".nav-item, .submenu a").forEach(el => {
      el.classList.remove("active");
    });

    if (item.classList.contains("nav-item")) {
      item.classList.add("active");
    } else {
      item.classList.add("active");
      
      if (studentToggle4 && studentMenu4) {
        studentToggle4.classList.add("open");
        studentMenu4.classList.add("open");
      }
    }

    const selectedPage = item.dataset.page;
    if (pageName) pageName.textContent = selectedPage;
    if (pageTitle) pageTitle.textContent = selectedPage;
  });
});



const notifs = JSON.parse(localStorage.getItem('gpath_notifications')) || [];
notifs.unshift({ id: Date.now(), title: 'Student Record Updated', desc: 'Added or modified a student profile', type: 'purple', time: 'Just now', unread: true });
localStorage.setItem('gpath_notifications', JSON.stringify(notifs));