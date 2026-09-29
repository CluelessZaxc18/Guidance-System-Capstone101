document.addEventListener("DOMContentLoaded", () => {
  const DOC_TYPES = {
    narrative: {
      page: "DM-Narrative-reports.html",
      titlePrefix: "Narrative Report",
      sections: ["testing", "referrals", "counseling"],
    },
    forms: {
      page: "DM-Forms.html",
      titlePrefix: "Forms",
      sections: ["referrals", "informed-consent", "referral-feedback", "case-notes"],
    },
  };

  let docType = document.body.dataset.docType;
  if (!DOC_TYPES[docType]) {
    docType = window.location.pathname.includes("DM-Forms") ? "forms" : "narrative";
  }
  const config = DOC_TYPES[docType];

  const requestedSection = new URLSearchParams(window.location.search).get("section");
  const currentSection = config.sections.includes(requestedSection)
    ? requestedSection
    : config.sections[0];

  const sectionLabel = currentSection
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const pageTitle = document.getElementById("pageTitle");
  if (pageTitle) pageTitle.textContent = `${config.titlePrefix} - ${sectionLabel}`;

  const activeHref = `${config.page}?section=${currentSection}`;
  document.querySelectorAll(".submenu a").forEach(link => {
    link.classList.toggle("active", link.getAttribute("href") === activeHref);
  });

  const storageKey = `gpath_docs_${docType}_${currentSection}`;

  function loadDocs() {
    try {
      return JSON.parse(localStorage.getItem(storageKey)) || [];
    } catch (err) {
      return [];
    }
  }

  function saveDocs(docs) {
    localStorage.setItem(storageKey, JSON.stringify(docs));
  }

  if (localStorage.getItem(storageKey) === null) {
    const base = currentSection.replace(/-/g, "_");
    saveDocs([
      { id: 1, name: `${base}_assessment_summary.pdf`, type: "pdf", date: "Sept 26, 2026" },
      { id: 2, name: `${base}_evaluation_notes.docx`, type: "docx", date: "Sept 24, 2026" },
    ]);
  }

  const tbody = document.getElementById("docTableBody");
  const emptyNotice = document.getElementById("emptyStateNotice");
  const searchInput = document.getElementById("docSearchInput");

  const LOGOS = {
    pdf: "img/pdf logo.png",
    docx: "img/docx logo.png",
    excel: "img/excel logo.png",
    powerpoint: "img/powerpoint logo.png",
    txt: "img/notes logo.png",
  };

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, ch => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    }[ch]));
  }

  function render() {
    if (!tbody) return;

    const query = (searchInput ? searchInput.value : "").trim().toLowerCase();
    const docs = loadDocs().filter(doc => doc.name.toLowerCase().includes(query));

    tbody.innerHTML = "";

    if (docs.length === 0) {
      if (emptyNotice) emptyNotice.style.display = "block";
      return;
    }
    if (emptyNotice) emptyNotice.style.display = "none";

    docs.forEach(doc => {
      const type = LOGOS[doc.type] ? doc.type : "pdf";
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><img src="${LOGOS[type]}" alt="${type}" class="file-logo" title="${type.toUpperCase()}"></td>
        <td><strong>${escapeHtml(doc.name)}</strong></td>
        <td>${escapeHtml(sectionLabel)}</td>
        <td>${escapeHtml(doc.date)}</td>
        <td>
          <div class="action-btn-group">
            <button class="view-file-btn" data-action="download" data-id="${doc.id}">Download</button>
            <button class="delete-file-btn" data-action="delete" data-id="${doc.id}">Delete</button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  function downloadDocument(doc) {
    const fileContent = `G-PATH Document Record\nFile Name: ${doc.name}\nCategory: ${sectionLabel}\nDate Stamped: ${doc.date}\nStatus: Official Record`;
    const blob = new Blob([fileContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    
    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = doc.name;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(url);
  }

  function showDeleteModal(docName, onConfirm) {
    const existingModal = document.getElementById("deleteConfirmModal");
    if (existingModal) existingModal.remove();

    const modalOverlay = document.createElement("div");
    modalOverlay.id = "deleteConfirmModal";
    modalOverlay.style.cssText = `
      position: fixed; inset: 0; background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(4px); display: grid; place-items: center;
      z-index: 9999; animation: fadeIn 0.2s ease;
    `;

    modalOverlay.innerHTML = `
      <div style="background: white; padding: 24px; border-radius: 14px; width: 100%; max-width: 400px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); text-align: center;">
        <div style="font-size: 36px; margin-bottom: 12px;">⚠️</div>
        <h3 style="font-size: 18px; color: #172033; margin-bottom: 8px;">Delete Document?</h3>
        <p style="font-size: 13px; color: #788398; margin-bottom: 20px;">
          Are you sure you want to delete <strong>"${escapeHtml(docName)}"</strong>? This action cannot be undone.
        </p>
        <div style="display: flex; gap: 10px; justify-content: center;">
          <button id="cancelDeleteBtn" style="padding: 10px 18px; border: 1px solid #e7ebf2; background: white; border-radius: 8px; font-weight: 600; cursor: pointer; color: #172033;">Cancel</button>
          <button id="confirmDeleteBtn" style="padding: 10px 18px; border: none; background: #dc2626; color: white; border-radius: 8px; font-weight: 600; cursor: pointer;">Delete</button>
        </div>
      </div>
    `;

    document.body.appendChild(modalOverlay);

    document.getElementById("cancelDeleteBtn").addEventListener("click", () => modalOverlay.remove());
    document.getElementById("confirmDeleteBtn").addEventListener("click", () => {
      onConfirm();
      modalOverlay.remove();
    });
    
    modalOverlay.addEventListener("click", (e) => {
      if (e.target === modalOverlay) modalOverlay.remove();
    });
  }

  if (tbody) {
    tbody.addEventListener("click", e => {
      const button = e.target.closest("button[data-action]");
      if (!button) return;

      const id = Number(button.dataset.id);
      const doc = loadDocs().find(item => item.id === id);
      if (!doc) return;

      if (button.dataset.action === "download") {
        downloadDocument(doc);
        if (typeof window.addSystemNotification === "function") {
          window.addSystemNotification(
            "Document downloaded",
            `${doc.name} was downloaded.`,
            "purple"
          );
        }
      } else if (button.dataset.action === "delete") {
        showDeleteModal(doc.name, () => {
          saveDocs(loadDocs().filter(item => item.id !== id));
          render();

          if (typeof window.addSystemNotification === "function") {
            window.addSystemNotification(
              "Document deleted",
              `${doc.name} was removed from ${config.titlePrefix} > ${sectionLabel}.`,
              "red"
            );
          }
        });
      }
    });
  }

  const addFileBtn = document.getElementById("addFileBtn");
  const hiddenFileInput = document.getElementById("hiddenFileInput");

  if (addFileBtn && hiddenFileInput) {
    addFileBtn.addEventListener("click", () => hiddenFileInput.click());

    hiddenFileInput.addEventListener("change", e => {
      const file = e.target.files[0];
      if (!file) return;

      const extension = file.name.split(".").pop().toLowerCase();
      let fileType = "pdf"; 
      if (["docx", "doc"].includes(extension)) fileType = "docx";
      else if (["xlsx", "xls"].includes(extension)) fileType = "excel";
      else if (["pptx", "ppt"].includes(extension)) fileType = "powerpoint";
      else if (["txt"].includes(extension)) fileType = "txt";

      const docs = loadDocs();
      docs.unshift({
        id: Date.now(),
        name: file.name,
        type: fileType,
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      });
      saveDocs(docs);

      if (typeof window.addSystemNotification === "function") {
        window.addSystemNotification(
          "Document uploaded",
          `${file.name} was added to ${config.titlePrefix} > ${sectionLabel}.`,
          "blue"
        );
      }

      if (searchInput) searchInput.value = "";
      hiddenFileInput.value = ""; 
      render();
    });
  }

  if (searchInput) searchInput.addEventListener("input", render);

  render();
});