document.addEventListener("DOMContentLoaded", () => {
  const pageName = document.getElementById("pageName");
  const pageTitle = document.getElementById("pageTitle");

  // --- Wire up every dropdown toggle + its submenu, at any nesting depth ---
  // Each toggle button is expected to be immediately followed by its own
  // <div class="submenu">. This replaces having one hardcoded block per
  // level (studentToggle, studentToggle2, studentToggle3, ...).
  document.querySelectorAll(".nav-dropdown").forEach(toggle => {
    const menu = toggle.nextElementSibling;
    if (!menu || !menu.classList.contains("submenu")) return;

    toggle.addEventListener("click", () => {
      const isOpen = menu.classList.toggle("open");
      toggle.classList.toggle("open", isOpen);
      toggle.setAttribute("aria-expanded", isOpen);
    });
  });

  // --- Handle link clicks: highlight the clicked item, open only its real
  // ancestor dropdown(s), and update the header text ---
  document.querySelectorAll("[data-page]").forEach(item => {
    item.addEventListener("click", () => {
      // Clear active state everywhere first
      document.querySelectorAll(".nav-item, .submenu a").forEach(el => {
        el.classList.remove("active");
      });

      item.classList.add("active");

      // Walk up through every ancestor .submenu the clicked item actually
      // sits inside — however many levels deep — and open each one plus
      // its toggle button. Unrelated dropdowns elsewhere in the sidebar
      // are never touched.
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

      // Update header text
      const selectedPage = item.dataset.page;
      if (pageName) pageName.textContent = selectedPage;
      if (pageTitle) pageTitle.textContent = selectedPage;
    });
  });
});