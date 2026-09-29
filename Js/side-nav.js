document.addEventListener("DOMContentLoaded", () => {
  const pageName = document.getElementById("pageName");
  const pageTitle = document.getElementById("pageTitle");

  const STORAGE_KEY = "gpath-sidebar-open";
  const store = window.sessionStorage;

  function readState() {
    try {
      return JSON.parse(store.getItem(STORAGE_KEY)) || {};
    } catch (err) {
      return {};
    }
  }

  const dropdowns = [...document.querySelectorAll(".nav-dropdown")]
    .map((toggle, index) => ({
      toggle,
      menu: toggle.nextElementSibling,
      key: toggle.id || `dropdown-${index}`,
    }))
    .filter(item => item.menu && item.menu.classList.contains("submenu"));

  function saveState() {
    const state = readState();
    dropdowns.forEach(({ menu, key }) => {
      state[key] = menu.classList.contains("open");
    });
    try {
      store.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
    }
  }

  function setOpen({ toggle, menu }, isOpen, animate = true) {
    const chevron = toggle.querySelector(".chevron");

    if (!animate) {
      menu.style.transition = "none";
      if (chevron) chevron.style.transition = "none";
    }

    menu.classList.toggle("open", isOpen);
    toggle.classList.toggle("open", isOpen);
    toggle.setAttribute("aria-expanded", isOpen);

    if (!animate) {
      void menu.offsetHeight;
      menu.style.transition = "";
      if (chevron) chevron.style.transition = "";
    }
  }

  const saved = readState();
  dropdowns.forEach(item => {
    if (item.key in saved) setOpen(item, saved[item.key], false);
  });

  dropdowns.forEach(item => {
    item.toggle.addEventListener("click", () => {
      setOpen(item, !item.menu.classList.contains("open"));
      saveState();
    });
  });

  document.querySelectorAll("[data-page]").forEach(item => {
    item.addEventListener("click", () => {
      document.querySelectorAll(".nav-item, .submenu a").forEach(el => {
        el.classList.remove("active");
      });

      item.classList.add("active");

      let ancestorMenu = item.closest(".submenu");
      while (ancestorMenu) {
        ancestorMenu.classList.add("open");

        const parentToggle = ancestorMenu.previousElementSibling;
        if (parentToggle && parentToggle.classList.contains("nav-dropdown")) {
          parentToggle.classList.add("open");
          parentToggle.setAttribute("aria-expanded", "true");
        }

        ancestorMenu = ancestorMenu.parentElement
          ? ancestorMenu.parentElement.closest(".submenu")
          : null;
      }

      saveState();

      const selectedPage = item.dataset.page;
      if (pageName) pageName.textContent = selectedPage;
      if (pageTitle) pageTitle.textContent = selectedPage;
    });
  });
});