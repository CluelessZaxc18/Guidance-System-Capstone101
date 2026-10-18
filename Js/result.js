document.addEventListener("DOMContentLoaded", () => {
  const OLSAT_STORAGE_KEY = "gpath_olsat_results";

  const DEFAULT_OLSAT_DATA = [
    { id: 1, studentId: "110187", name: "Ana Cruz", score: 85, date: "Sep 12, 2026", rawDate: "2026-09-12", remarks: "Above Average" },
    { id: 2, studentId: "110638", name: "Miguel Santos", score: 72, date: "Sep 12, 2026", rawDate: "2026-09-12", remarks: "Average" },
    { id: 3, studentId: "110744", name: "Maria Lim", score: 90, date: "Sep 12, 2026", rawDate: "2026-09-12", remarks: "Above Average" },
    
    { id: 4, studentId: "110859", name: "Joshua Reyes", score: 68, date: "Sep 20, 2026", rawDate: "2026-09-20", remarks: "Average" },
    { id: 5, studentId: "110963", name: "Sofia Mendoza", score: 78, date: "Sep 20, 2026", rawDate: "2026-09-20", remarks: "Average" },
    { id: 6, studentId: "111074", name: "Liam Torres", score: 94, date: "Sep 20, 2026", rawDate: "2026-09-20", remarks: "Above Average" },
    { id: 7, studentId: "110198", name: "Aris Villanueva", score: 75, date: "Sep 20, 2026", rawDate: "2026-09-20", remarks: "Average" },

    { id: 8, studentId: "111530", name: "Daniel Garcia", score: 88, date: "Sep 28, 2026", rawDate: "2026-09-28", remarks: "Above Average" },
    { id: 9, studentId: "111419", name: "Camille Navarro", score: 65, date: "Sep 28, 2026", rawDate: "2026-09-28", remarks: "Average" },
    
    { id: 10, studentId: "111308", name: "Rafael Mendoza", score: 82, date: "Oct 12, 2026", rawDate: "2026-10-12", remarks: "Above Average" },
    { id: 11, studentId: "111297", name: "Nicole Reyes", score: 76, date: "Oct 12, 2026", rawDate: "2026-10-12", remarks: "Average" },
    { id: 12, studentId: "111186", name: "Ethan Flores", score: 89, date: "Oct 12, 2026", rawDate: "2026-10-12", remarks: "Above Average" }
  ];

  function loadOlsatData() {
    try {
      const stored = JSON.parse(localStorage.getItem(OLSAT_STORAGE_KEY));
      if (Array.isArray(stored) && stored.length > 0) return stored;
    } catch (err) {}
    localStorage.setItem(OLSAT_STORAGE_KEY, JSON.stringify(DEFAULT_OLSAT_DATA));
    return DEFAULT_OLSAT_DATA;
  }

  const container = document.getElementById("olsatTablesContainer");
  const searchInput = document.getElementById("olsatSearchInput");
  const filterMenuBtn = document.getElementById("filterMenuBtn");
  const filterDropdownMenu = document.getElementById("filterDropdownMenu");
  let selectedDateFilter = "all";

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
      <div style="padding: 8px 12px; font-size: 11px; font-weight: 700; color: #64748b; border-bottom: 1px solid #f1f5f9; margin-bottom: 4px;">FILTER DATE</div>
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
        renderOlsatTables();
      });
    });
  }

  function showDeleteTableConfirmModal(dateLabel, onConfirm) {
    document.getElementById("olsatTableDeleteModal")?.remove();
    const modalOverlay = document.createElement("div");
    modalOverlay.id = "olsatTableDeleteModal";
    modalOverlay.style.cssText = `
      position: fixed; inset: 0; background: rgba(23, 32, 51, 0.5);
      backdrop-filter: blur(4px); display: grid; place-items: center;
      z-index: 9999; animation: fadeIn 0.2s ease;
    `;
    modalOverlay.innerHTML = `
      <div style="background: white; padding: 24px; border-radius: 14px; width: 100%; max-width: 400px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); text-align: center;">
        <div style="font-size: 36px; margin-bottom: 12px;">⚠️</div>
        <h3 style="font-size: 18px; color: #172033; margin-bottom: 8px;">Delete Table?</h3>
        <p style="font-size: 13px; color: #788398; margin-bottom: 20px;">
          Are you sure you want to delete all OLSAT records for <strong>"${dateLabel}"</strong>? This table and all its student scores will be removed.
        </p>
        <div style="display: flex; gap: 10px; justify-content: center;">
          <button id="cancelTableDeleteBtn" style="padding: 10px 18px; border: 1px solid #e7ebf2; background: white; border-radius: 8px; font-weight: 600; cursor: pointer;">Cancel</button>
          <button id="confirmTableDeleteBtn" style="padding: 10px 18px; border: none; background: #dc2626; color: white; border-radius: 8px; font-weight: 600; cursor: pointer;">Delete Table</button>
        </div>
      </div>
    `;
    document.body.appendChild(modalOverlay);
    document.getElementById("cancelTableDeleteBtn").addEventListener("click", () => modalOverlay.remove());
    document.getElementById("confirmTableDeleteBtn").addEventListener("click", () => {
      onConfirm();
      modalOverlay.remove();
    });
    modalOverlay.addEventListener("click", (e) => {
      if (e.target === modalOverlay) modalOverlay.remove();
    });
  }

  function showDeleteRecordModal(recordName, onConfirm) {
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
          Are you sure you want to delete the OLSAT result for <strong>"${recordName}"</strong>?
        </p>
        <div style="display: flex; gap: 10px; justify-content: center;">
          <button id="cancelOlsatDeleteBtn" style="padding: 10px 18px; border: 1px solid #e7ebf2; background: white; border-radius: 8px; font-weight: 600; cursor: pointer;">Cancel</button>
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

  window.renderOlsatTables = function() {
    if (!container) return;
    const allData = loadOlsatData();
    const query = searchInput ? searchInput.value.trim().toLowerCase() : "";

    const groups = {};
    allData.forEach(item => {
      const matchesSearch = item.name.toLowerCase().includes(query) || item.studentId.toLowerCase().includes(query);
      const matchesDateFilter = (selectedDateFilter === "all" || item.rawDate === selectedDateFilter);

      if (matchesSearch && matchesDateFilter) {
        const key = item.rawDate || item.date;
        if (!groups[key]) {
          groups[key] = {
            dateDisplay: item.date,
            rawDate: item.rawDate,
            items: []
          };
        }
        groups[key].items.push(item);
      }
    });

    const sortedKeys = Object.keys(groups).sort().reverse();

    if (sortedKeys.length === 0) {
      container.innerHTML = `<div class="panel" style="text-align: center; padding: 30px; color: var(--muted);">No OLSAT results found matching your criteria.</div>`;
      return;
    }

    container.innerHTML = sortedKeys.map(key => {
      const group = groups[key];
      const count = group.items.length;
      const isSingleStudent = count <= 1;

      const rowsHtml = group.items.map(item => `
        <tr style="border-bottom: 1px solid var(--line);">
          <td style="padding: 14px 12px; font-weight: 600;">${item.name}</td>
          <td style="padding: 14px 12px; color: var(--muted);">${item.studentId}</td>
          <td style="padding: 14px 12px;"><strong style="color: var(--primary);">${item.score}</strong> / 100</td>
          <td style="padding: 14px 12px; color: var(--muted);">${item.date}</td>
          <td style="padding: 14px 12px; text-align: right;">
            <button class="send-email-btn" data-id="${item.id}" style="background: #e2fbfe; color: #109a8c; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 600; margin-right: 6px;">Send</button>
            <button class="delete-olsat-btn" data-id="${item.id}" data-name="${item.name}" style="background: #fee2e2; color: #dc2626; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 600;">Delete</button>
          </td>
        </tr>
      `).join("");

      return `
        <div class="panel student-table-panel" style="max-height: none; overflow: visible;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; padding-bottom: 10px; border-bottom: 2px solid var(--line);">
            <h4 style="font-size: 16px; color: #172033;"><i class="fa-solid fa-calendar-days" style="margin-right: 8px; color: #0e8bf8;"></i>Test Date: ${group.dateDisplay} (${count} Student${count === 1 ? '' : 's'})</h4>
            <div style="display: flex; gap: 8px;">
              <button class="send-batch-table-btn" data-rawdate="${group.rawDate}" ${isSingleStudent ? 'disabled' : ''} style="background: #0e8bf8; color: white; border: none; padding: 6px 12px; border-radius: 6px; font-weight: 600; font-size: 11px; cursor: ${isSingleStudent ? 'not-allowed' : 'pointer'}; opacity: ${isSingleStudent ? '0.4' : '1'}; display: inline-flex; align-items: center; gap: 5px;">
                <i class="fa-solid fa-paper-plane" style="font-size: 10px;"></i> Send as Batch
              </button>
              <button class="delete-table-btn" data-rawdate="${group.rawDate}" data-label="${group.dateDisplay}" style="background: #fee2e2; color: #dc2626; border: none; padding: 6px 12px; border-radius: 6px; font-weight: 600; font-size: 11px; cursor: pointer; display: inline-flex; align-items: center; gap: 5px;">
                <i class="fa-solid fa-trash" style="font-size: 10px;"></i> Delete Table
              </button>
            </div>
          </div>
          
          <table class="student-data-table" style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="text-align: left; border-bottom: 1px solid var(--line); color: var(--muted); font-size: 12px;">
                <th style="padding: 10px 12px;">Student Name</th>
                <th style="padding: 10px 12px;">Student ID</th>
                <th style="padding: 10px 12px;">OLSAT Score</th>
                <th style="padding: 10px 12px;">Test Date</th>
                <th style="padding: 10px 12px; text-align: right;">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
        </div>
      `;
    }).join("");

    container.querySelectorAll(".send-email-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        if (typeof window.openSendEmailModal === "function") {
          window.openSendEmailModal(btn.dataset.id);
        }
      });
    });

    container.querySelectorAll(".delete-olsat-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = Number(btn.dataset.id);
        const name = btn.dataset.name;
        showDeleteRecordModal(name, () => {
          let list = loadOlsatData();
          list = list.filter(i => i.id !== id);
          localStorage.setItem(OLSAT_STORAGE_KEY, JSON.stringify(list));
          populateDateFilterMenu();
          window.renderOlsatTables();
          if (typeof showToast === "function") showToast(`Deleted OLSAT result for ${name}.`);
        });
      });
    });

    container.querySelectorAll(".send-batch-table-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        if (btn.hasAttribute("disabled")) return;
        const rawDate = btn.dataset.rawdate;
        const allData = loadOlsatData();
        const batchList = allData.filter(i => i.rawDate === rawDate);
        const groupObj = groups[rawDate];
        if (typeof window.openBatchEmailModal === "function") {
          window.openBatchEmailModal(batchList, groupObj ? groupObj.dateDisplay : rawDate);
        }
      });
    });

    container.querySelectorAll(".delete-table-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const rawDate = btn.dataset.rawdate;
        const label = btn.dataset.label;
        showDeleteTableConfirmModal(label, () => {
          let list = loadOlsatData();
          list = list.filter(i => i.rawDate !== rawDate);
          localStorage.setItem(OLSAT_STORAGE_KEY, JSON.stringify(list));
          populateDateFilterMenu();
          window.renderOlsatTables();
          if (typeof showToast === "function") showToast(`Deleted table for ${label}.`);
        });
      });
    });
  };

  if (searchInput) {
    searchInput.addEventListener("input", renderOlsatTables);
  }

  populateDateFilterMenu();
  window.renderOlsatTables();
});