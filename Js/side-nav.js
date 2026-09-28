document.addEventListener("DOMContentLoaded", () => {
  const pageName = document.getElementById("pageName");
  const pageTitle = document.getElementById("pageTitle");

  // ---- Remember which dropdowns are open, across pages ----
  // Saved in sessionStorage, so the sidebar looks the same when you move
  // between Dashboard.html, Student.html, etc. in the same tab. Swap
  // sessionStorage for localStorage below to also remember it after the
  // tab is closed.
  const STORAGE_KEY = "gpath-sidebar-open";
  const store = window.sessionStorage;

  function readState() {
    try {
      return JSON.parse(store.getItem(STORAGE_KEY)) || {};
    } catch (err) {
      return {};
    }
  }

  // Every dropdown toggle that is immediately followed by its own
  // <div class="submenu">, at any nesting depth.
  const dropdowns = [...document.querySelectorAll(".nav-dropdown")]
    .map((toggle, index) => ({
      toggle,
      menu: toggle.nextElementSibling,
      key: toggle.id || `dropdown-${index}`,
    }))
    .filter(item => item.menu && item.menu.classList.contains("submenu"));

  function saveState() {
    // Merge instead of overwrite, so a page that only has some of the
    // dropdowns doesn't wipe the saved state of the ones it doesn't have.
    const state = readState();
    dropdowns.forEach(({ menu, key }) => {
      state[key] = menu.classList.contains("open");
    });
    try {
      store.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      // Storage unavailable — the sidebar just won't be remembered.
    }
  }

  function setOpen({ toggle, menu }, isOpen, animate = true) {
    const chevron = toggle.querySelector(".chevron");

    // When restoring on page load, skip the slide/rotate animation so the
    // menus simply appear already open instead of visibly re-opening.
    if (!animate) {
      menu.style.transition = "none";
      if (chevron) chevron.style.transition = "none";
    }

    menu.classList.toggle("open", isOpen);
    toggle.classList.toggle("open", isOpen);
    toggle.setAttribute("aria-expanded", isOpen);

    if (!animate) {
      void menu.offsetHeight; // apply the change before re-enabling transitions
      menu.style.transition = "";
      if (chevron) chevron.style.transition = "";
    }
  }

  // Restore the sidebar exactly as it was on the previous page.
  const saved = readState();
  dropdowns.forEach(item => {
    if (item.key in saved) setOpen(item, saved[item.key], false);
  });

  // ---- Open / close a dropdown when its toggle is clicked ----
  dropdowns.forEach(item => {
    item.toggle.addEventListener("click", () => {
      setOpen(item, !item.menu.classList.contains("open"));
      saveState();
    });
  });

  // ---- Handle link clicks: highlight the clicked item, open only its real
  // ancestor dropdown(s), and update the header text ----
  document.querySelectorAll("[data-page]").forEach(item => {
    item.addEventListener("click", () => {
      // Clear active state everywhere first
      document.querySelectorAll(".nav-item, .submenu a").forEach(el => {
        el.classList.remove("active");
      });

      item.classList.add("active");

      // Walk up through every ancestor .submenu the clicked item actually
      // sits inside — however many levels deep — and open each one plus
      // its toggle button. Unrelated dropdowns are never touched.
      let ancestorMenu = item.closest(".submenu");
      while (ancestorMenu) {
        ancestorMenu.classList.add("open");

        const parentToggle = ancestorMenu.previousElementSibling;
        if (parentToggle && parentToggle.classList.contains("nav-dropdown")) {
          parentToggle.classList.add("open");
          parentToggle.setAttribute("aria-expanded", "true");
        }

        // Move one level further up (a submenu nested inside another submenu)
        ancestorMenu = ancestorMenu.parentElement
          ? ancestorMenu.parentElement.closest(".submenu")
          : null;
      }

      // Save now — if this link goes to another page, the browser leaves
      // right after this handler runs.
      saveState();

      // Update header text
      const selectedPage = item.dataset.page;
      if (pageName) pageName.textContent = selectedPage;
      if (pageTitle) pageTitle.textContent = selectedPage;
    });
  });
});