document.addEventListener("DOMContentLoaded", () => {
  const OLSAT_STORAGE_KEY = "gpath_olsat_results";

  const DEFAULT_OLSAT_DATA = [
    { id: 1, studentId: "110187", name: "Ana Cruz", verbal: 42, nonVerbal: 45, sai: 115, date: "Sept 20, 2026", remarks: "Above Average Cognitive Aptitude" },
    { id: 2, studentId: "110638", name: "Miguel Santos", verbal: 35, nonVerbal: 38, sai: 102, date: "Sept 22, 2026", remarks: "Average Ability Range" }
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

    if (!tbody) return;

    if (currentData.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 20px; color: var(--muted);">No OLSAT results found.</td></tr>`;
      return;
    }

    tbody.innerHTML = currentData.map(item => `
      <tr style="border-bottom: 1px solid var(--line);">
        <td style="padding: 14px 12px; font-weight: 600;">${item.name}</td>
        <td style="padding: 14px 12px; color: var(--muted);">${item.studentId}</td>
        <td style="padding: 14px 12px;">${item.verbal}</td>
        <td style="padding: 14px 12px;">${item.nonVerbal}</td>
        <td style="padding: 14px 12px;"><strong style="color: var(--primary);">${item.sai}</strong></td>
        <td style="padding: 14px 12px; color: var(--muted);">${item.date}</td>
        <td style="padding: 14px 12px;">
          <button class="send-email-btn" data-id="${item.id}" style="background: #e2fbfe; color: #109a8c; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 600; margin-right: 6px;">Send</button>
          <button class="delete-olsat-btn" data-id="${item.id}" data-name="${item.name}" style="background: #fee2e2; color: #dc2626; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 600;">Delete</button>
        </td>
      </tr>
    `).join("");

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
          window.renderOlsatTable();

          const notifs = JSON.parse(localStorage.getItem("gpath_notifications")) || [];
          notifs.unshift({
            type: "red",
            title: "OLSAT Result Deleted",
            desc: `Removed OLSAT test record for ${recordName}.`,
            timestamp: Date.now()
          });
          localStorage.setItem("gpath_notifications", JSON.stringify(notifs));

          if (typeof showToast === "function") showToast(`OLSAT result for ${recordName} deleted.`);
        });
      });
    });
  };

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const query = searchInput.value.trim().toLowerCase();
      const allData = loadOlsatData();
      const filtered = allData.filter(i => 
        i.name.toLowerCase().includes(query) || i.studentId.toLowerCase().includes(query)
      );
      window.renderOlsatTable(filtered);
    });
  }

  window.renderOlsatTable();
});