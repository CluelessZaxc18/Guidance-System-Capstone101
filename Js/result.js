document.addEventListener("DOMContentLoaded", () => {
  const OLSAT_STORAGE_KEY = "gpath_olsat_results";

  const DEFAULT_OLSAT_DATA = [
    { id: 1, studentId: "110187", name: "Ana Cruz", score: 115, date: "Sep 12, 2026", rawDate: "2026-09-12", remarks: "Above Average" },
    { id: 2, studentId: "110638", name: "Miguel Santos", score: 102, date: "Sep 15, 2026", rawDate: "2026-09-15", remarks: "Average" },
    { id: 3, studentId: "110744", name: "Maria Lim", score: 118, date: "Sep 18, 2026", rawDate: "2026-09-18", remarks: "Above Average" },
    { id: 4, studentId: "110859", name: "Joshua Reyes", score: 95, date: "Sep 20, 2026", rawDate: "2026-09-20", remarks: "Average" },
    { id: 5, studentId: "110963", name: "Sofia Mendoza", score: 108, date: "Sep 22, 2026", rawDate: "2026-09-22", remarks: "Average" },
    { id: 6, studentId: "111074", name: "Liam Torres", score: 124, date: "Sep 25, 2026", rawDate: "2026-09-25", remarks: "Above Average" },
    { id: 7, studentId: "110198", name: "Aris Villanueva", score: 101, date: "Sep 28, 2026", rawDate: "2026-09-28", remarks: "Average" },
    { id: 8, studentId: "111530", name: "Daniel Garcia", score: 112, date: "Oct 02, 2026", rawDate: "2026-10-02", remarks: "Above Average" },
    { id: 9, studentId: "111419", name: "Camille Navarro", score: 99, date: "Oct 05, 2026", rawDate: "2026-10-05", remarks: "Average" },
    { id: 10, studentId: "111308", name: "Rafael Mendoza", score: 110, date: "Oct 08, 2026", rawDate: "2026-10-08", remarks: "Above Average" },
    { id: 11, studentId: "111297", name: "Nicole Reyes", score: 104, date: "Oct 10, 2026", rawDate: "2026-10-10", remarks: "Average" },
    { id: 12, studentId: "111186", name: "Ethan Flores", score: 116, date: "Oct 12, 2026", rawDate: "2026-10-12", remarks: "Above Average" }
  ];

  function loadOlsatData() {
    try {
      const stored = JSON.parse(localStorage.getItem(OLSAT_STORAGE_KEY));
      if (Array.isArray(stored) && stored.length > 0) return stored;
    } catch (err) {}
    localStorage.setItem(OLSAT_STORAGE_KEY, JSON.stringify(DEFAULT_OLSAT_DATA));
    return DEFAULT_OLSAT_DATA;
  }

  const tbody = document.getElementById("olsatTableBody");
  const searchInput = document.getElementById("olsatSearchInput");
  const filterMenuBtn = document.getElementById("filterMenuBtn");
  const filterDropdownMenu = document.getElementById("filterDropdownMenu");
  let selectedDateFilter = "all";
  let activeFilteredList = loadOlsatData();

  if (filterMenuBtn && filterDropdownMenu) {
    filterMenuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isVisible = filterDropdownMenu.style.display === "block";
      filterDropdownMenu.style.display = isVisible ? "none" : "block";
    });

    document.addEventListener("click", (e) => {
      if (!filterMenuBtn.contains(e.target) && !filterDropdownMenu.contains(e.target)) {
        filterDropdownMenu.style.display = "none";
      }
    });
  }

  function populateDateFilterMenu() {
    if (!filterDropdownMenu) return;
    const allData = loadOlsatData();
    
    const uniqueDatesMap = {};
    allData.forEach(item => {
      if (item.rawDate && item.date) {
        uniqueDatesMap[item.rawDate] = item.date;
      }
    });

    let menuHtml = `
      <div style="padding: 8px 12px; font-size: 11px; font-weight: 700; color: #64748b; border-bottom: 1px solid #f1f5f9; margin-bottom: 4px;">FILTER BY TEST DATE</div>
      <div class="filter-option ${selectedDateFilter === 'all' ? 'active-filter' : ''}" data-date="all" style="padding: 8px 12px; font-size: 13px; font-weight: 600; color: #1e293b; border-radius: 6px; cursor: pointer;">All Test Dates</div>
    `;

    Object.keys(uniqueDatesMap).sort().forEach(rawDt => {
      const formattedDt = uniqueDatesMap[rawDt];
      const isActive = selectedDateFilter === rawDt ? 'active-filter' : '';
      menuHtml += `<div class="filter-option ${isActive}" data-date="${rawDt}" style="padding: 8px 12px; font-size: 13px; color: #334155; border-radius: 6px; cursor: pointer;">${formattedDt}</div>`;
    });

    filterDropdownMenu.innerHTML = menuHtml;

    filterDropdownMenu.querySelectorAll(".filter-option").forEach(option => {
      option.addEventListener("click", () => {
        filterDropdownMenu.querySelectorAll(".filter-option").forEach(o => o.classList.remove("active-filter"));
        option.classList.add("active-filter");
        selectedDateFilter = option.dataset.date;
        filterDropdownMenu.style.display = "none";
        applyFilters();
      });
    });
  }

  function showSendToAllConfirmModal(onConfirm) {
    document.getElementById("sendToAllModalOverlay")?.remove();

    const modalOverlay = document.createElement("div");
    modalOverlay.id = "sendToAllModalOverlay";
    modalOverlay.style.cssText = `
      position: fixed; inset: 0; background: rgba(23, 32, 51, 0.5);
      backdrop-filter: blur(4px); display: grid; place-items: center;
      z-index: 9999; animation: fadeIn 0.2s ease;
    `;

    modalOverlay.innerHTML = `
      <div style="background: white; padding: 24px; border-radius: 14px; width: 100%; max-width: 420px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); text-align: center;">
        <div style="font-size: 36px; margin-bottom: 12px;">⚠️</div>
        <h3 style="font-size: 18px; color: #172033; margin-bottom: 8px;">Send to All?</h3>
        <p style="font-size: 13px; color: #788398; margin-bottom: 20px;">
          You currently have <strong>All Test Dates</strong> selected. This will dispatch batch score reports to <strong>all registered students</strong> across all schedules. Are you sure you wish to proceed?
        </p>
        <div style="display: flex; gap: 10px; justify-content: center;">
          <button id="cancelSendToAllBtn" style="padding: 10px 18px; border: 1px solid #e7ebf2; background: white; border-radius: 8px; font-weight: 600; cursor: pointer; color: #172033;">Cancel</button>
          <button id="confirmSendToAllBtn" style="padding: 10px 18px; border: none; background: #1b36eb; color: white; border-radius: 8px; font-weight: 600; cursor: pointer;">Yes, Send to All</button>
        </div>
      </div>
    `;

    document.body.appendChild(modalOverlay);

    document.getElementById("cancelSendToAllBtn").addEventListener("click", () => modalOverlay.remove());
    document.getElementById("confirmSendToAllBtn").addEventListener("click", () => {
      onConfirm();
      modalOverlay.remove();
    });

    modalOverlay.addEventListener("click", (e) => {
      if (e.target === modalOverlay) modalOverlay.remove();
    });
  }

  function bindBatchButton() {
    const sendBatchBtn = document.getElementById("sendBatchBtn");
    if (!sendBatchBtn) return;

    if (activeFilteredList.length <= 1) {
      sendBatchBtn.style.opacity = "0.35";
    } else {
      sendBatchBtn.style.opacity = "1";
    }

    sendBatchBtn.onclick = (e) => {
      e.stopPropagation();
      if (activeFilteredList.length <= 1) return;

      if (selectedDateFilter === "all") {
        showSendToAllConfirmModal(() => {
          if (typeof window.openBatchEmailModal === "function") {
            window.openBatchEmailModal(activeFilteredList, "All Test Dates");
          }
        });
      } else {
        let dateLabel = selectedDateFilter;
        const activeOption = filterDropdownMenu?.querySelector(`[data-date="${selectedDateFilter}"]`);
        if (activeOption) dateLabel = activeOption.textContent.trim();

        if (typeof window.openBatchEmailModal === "function") {
          window.openBatchEmailModal(activeFilteredList, dateLabel);
        }
      }
    };
  }

  function showDeleteConfirmModal(recordName, onConfirm) {
    document.getElementById("olsatDeleteModalOverlay")?.remove();

    const modalOverlay = document.createElement("div");
    modalOverlay.id = "olsatDeleteModalOverlay";
    modalOverlay.style.cssText = `
      position: fixed; inset: 0; background: rgba(23, 32, 51, 0.5);
      backdrop-filter: blur(4px); display: grid; place-items: center;
      z-index: 9999; animation: fadeIn 0.2s ease;
    `;

    modalOverlay.innerHTML = `
      <div style="background: white; padding: 24px; border-radius: 14px; width: 100%; max-width: 400px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); text-align: center;">
        <div style="font-size: 36px; margin-bottom: 12px;">⚠️</div>
        <h3 style="font-size: 18px; color: #172033; margin-bottom: 8px;">Delete OLSAT Record?</h3>
        <p style="font-size: 13px; color: #788398; margin-bottom: 20px;">
          Are you sure you want to delete the OLSAT result for <strong>"${recordName}"</strong>? This action cannot be undone.
        </p>
        <div style="display: flex; gap: 10px; justify-content: center;">
          <button id="cancelOlsatDeleteBtn" style="padding: 10px 18px; border: 1px solid #e7ebf2; background: white; border-radius: 8px; font-weight: 600; cursor: pointer; color: #172033;">Cancel</button>
          <button id="confirmOlsatDeleteBtn" style="padding: 10px 18px; border: none; background: #dc2626; color: white; border-radius: 8px; font-weight: 600; cursor: pointer;">Delete</button>
        </div>
      </div>
    `;

    document.body.appendChild(modalOverlay);

    document.getElementById("cancelOlsatDeleteBtn").addEventListener("click", () => modalOverlay.remove());
    document.getElementById("confirmOlsatDeleteBtn").addEventListener("click", () => {
      onConfirm();
      modalOverlay.remove();
    });

    modalOverlay.addEventListener("click", (e) => {
      if (e.target === modalOverlay) modalOverlay.remove();
    });
  }

  window.renderOlsatTable = function(customData = null) {
    const currentData = customData || loadOlsatData();
    activeFilteredList = currentData;

    if (!tbody) return;

    if (currentData.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 20px; color: var(--muted);">No OLSAT results found.</td></tr>`;
      bindBatchButton();
      return;
    }

    tbody.innerHTML = currentData.map(item => `
      <tr style="border-bottom: 1px solid var(--line);">
        <td style="padding: 14px 12px; font-weight: 600;">${item.name}</td>
        <td style="padding: 14px 12px; color: var(--muted);">${item.studentId}</td>
        <td style="padding: 14px 12px;"><strong style="color: var(--primary);">${item.score}</strong></td>
        <td style="padding: 14px 12px; color: var(--muted);">${item.date}</td>
        <td style="padding: 14px 12px; text-align: right;">
          <button class="send-email-btn" data-id="${item.id}" style="background: #e2fbfe; color: #109a8c; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 600; margin-right: 6px;">Send</button>
          <button class="delete-olsat-btn" data-id="${item.id}" data-name="${item.name}" style="background: #fee2e2; color: #dc2626; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 600;">Delete</button>
        </td>
      </tr>
    `).join("");

    bindBatchButton();

    document.querySelectorAll(".send-email-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        if (typeof window.openSendEmailModal === "function") {
          window.openSendEmailModal(id);
        }
      });
    });
    
    document.querySelectorAll(".delete-olsat-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = Number(btn.dataset.id);
        const recordName = btn.dataset.name;

        showDeleteConfirmModal(recordName, () => {
          let storedList = loadOlsatData();
          storedList = storedList.filter(i => i.id !== id);
          localStorage.setItem(OLSAT_STORAGE_KEY, JSON.stringify(storedList));
          populateDateFilterMenu();
          window.renderOlsatTable();

          let activeUser = null;
          try {
            activeUser = JSON.parse(localStorage.getItem('gpath_active_user'));
          } catch (e) {}
          const userRole = activeUser ? (activeUser.position || activeUser.role || 'Admin') : 'Admin';

          const notifs = JSON.parse(localStorage.getItem("gpath_notifications")) || [];
          notifs.unshift({
            type: "red",
            title: "OLSAT Result Deleted",
            desc: `Removed OLSAT test record for ${recordName}.`,
            role: userRole,
            timestamp: Date.now()
          });
          localStorage.setItem("gpath_notifications", JSON.stringify(notifs));

          if (typeof showToast === "function") showToast(`OLSAT result for ${recordName} deleted.`);
        });
      });
    });
  };

  function applyFilters() {
    const query = searchInput ? searchInput.value.trim().toLowerCase() : "";
    
    const allData = loadOlsatData();
    const filtered = allData.filter(i => {
      const matchesSearch = i.name.toLowerCase().includes(query) || i.studentId.toLowerCase().includes(query);
      const matchesDate = (selectedDateFilter === "all" || i.rawDate === selectedDateFilter);
      return matchesSearch && matchesDate;
    });

    window.renderOlsatTable(filtered);
  }

  if (searchInput) {
    searchInput.addEventListener("input", applyFilters);
  }

  populateDateFilterMenu();
  window.renderOlsatTable();
});