document.addEventListener("DOMContentLoaded", () => {
  const quickDocBtn = document.getElementById("quickDocument");
  if (!quickDocBtn) return;

  const categories = {
    narrative: {
      label: "Narrative Report",
      page: "DM-Narrative-reports.html",
      sections: [
        { id: "testing", name: "Testing" },
        { id: "referrals", name: "Referrals" },
        { id: "counseling", name: "Counseling" }
      ]
    },
    forms: {
      label: "Forms",
      page: "DM-Forms.html",
      sections: [
        { id: "referrals", name: "Referrals" },
        { id: "informed-consent", name: "Informed Consent" },
        { id: "referral-feedback", name: "Referral Feedback" },
        { id: "case-notes", name: "Case Notes" }
      ]
    }
  };

  // Inject scoped styles including the loading spinner animation
  const styleEl = document.createElement("style");
  styleEl.innerHTML = `
    .gpath-wizard-overlay {
      position: fixed; inset: 0; background: rgba(0, 0, 0, 0.55);
      backdrop-filter: blur(5px); display: grid; place-items: center;
      z-index: 99999; animation: fadeIn 0.2s ease; font-family: inherit;
    }
    .gpath-wizard-card {
      background: white; width: 100%; max-width: 440px; border-radius: 16px;
      box-shadow: 0 15px 35px rgba(23, 32, 51, 0.15); padding: 28px;
      position: relative; animation: scaleUp 0.2s ease; text-align: left;
    }
    .gpath-wizard-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
    .gpath-wizard-header h3 { font-size: 18px; color: #172033; font-weight: 700; }
    .gpath-wizard-close { background: #f8fafc; border: 1px solid #e7ebf2; width: 32px; height: 32px; border-radius: 50%; font-size: 16px; cursor: pointer; display: grid; place-items: center; color: #788398; transition: 0.2s; }
    .gpath-wizard-close:hover { background: #fee2e2; color: #dc2626; border-color: #fca5a5; }
    .gpath-wizard-step { display: flex; flex-direction: column; gap: 10px; }
    .gpath-option-btn {
      display: flex; align-items: center; justify-content: space-between;
      padding: 14px 18px; border: 1px solid #e7ebf2; border-radius: 12px;
      background: #f8fafc; font-weight: 600; color: #172033; cursor: pointer;
      transition: all 0.2s ease; text-align: left;
    }
    .gpath-option-btn:hover { background: #e0f2fe; border-color: #38bdf8; color: #0369a1; transform: translateY(-1px); }
    .gpath-file-dropzone {
      border: 2px dashed #cbd5e1; border-radius: 12px; padding: 24px; text-align: center;
      background: #f8fafc; cursor: pointer; transition: 0.2s; margin-top: 5px;
    }
    .gpath-file-dropzone:hover { border-color: #0284c7; background: #f0f9ff; }
    .gpath-back-link { background: none; border: none; color: #0284c7; font-size: 13px; font-weight: 600; cursor: pointer; padding: 0; margin-bottom: 12px; display: inline-flex; align-items: center; gap: 4px; }
    
    /* Loading Spinner Styles */
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    .gpath-spinner {
      width: 36px; height: 36px; border: 3px solid #e2e8f0; border-top-color: #0e5c63;
      border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px auto;
    }
  `;
  document.head.appendChild(styleEl);

  quickDocBtn.addEventListener("click", () => openWizardStep1());

  function openWizardStep1() {
    closeWizard();
    const modal = createModalContainer();

    modal.innerHTML = `
      <div class="gpath-wizard-card">
        <div class="gpath-wizard-header">
          <h3>Upload Document</h3>
          <button class="gpath-wizard-close" id="wizClose">✕</button>
        </div>
        <div class="gpath-wizard-step">
          <p style="font-size: 13px; color: #788398; margin-bottom: 6px;">Select the document category type:</p>
          <button class="gpath-option-btn" data-type="narrative">
            <span>📁 Narrative Report</span>
            <span style="color: #cbd5e1;">›</span>
          </button>
          <button class="gpath-option-btn" data-type="forms">
            <span>📋 Forms</span>
            <span style="color: #cbd5e1;">›</span>
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    modal.querySelector("#wizClose").addEventListener("click", closeWizard);
    modal.addEventListener("click", (e) => { if (e.target === modal) closeWizard(); });

    modal.querySelectorAll(".gpath-option-btn").forEach(btn => {
      btn.addEventListener("click", () => openWizardStep2(btn.dataset.type));
    });
  }

  function openWizardStep2(docType) {
    const card = document.querySelector(".gpath-wizard-card");
    if (!card) return;

    const config = categories[docType];
    let sectionsHtml = config.sections.map(sec => `
      <button class="gpath-option-btn" data-section="${sec.id}">
        <span>↳ ${sec.name}</span>
        <span style="color: #cbd5e1;">›</span>
      </button>
    `).join("");

    card.innerHTML = `
      <div class="gpath-wizard-header">
        <h3>Select Section</h3>
        <button class="gpath-wizard-close" id="wizClose">✕</button>
      </div>
      <div class="gpath-wizard-step">
        <button class="gpath-back-link" id="wizBack">← Back to categories</button>
        <p style="font-size: 13px; color: #788398; margin-bottom: 6px;">Choose where to store this ${config.label}:</p>
        ${sectionsHtml}
      </div>
    `;

    card.querySelector("#wizClose").addEventListener("click", closeWizard);
    card.querySelector("#wizBack").addEventListener("click", openWizardStep1);

    card.querySelectorAll(".gpath-option-btn").forEach(btn => {
      btn.addEventListener("click", () => openWizardStep3(docType, btn.dataset.section));
    });
  }

  function openWizardStep3(docType, sectionId) {
    const card = document.querySelector(".gpath-wizard-card");
    if (!card) return;

    const config = categories[docType];
    const sectionObj = config.sections.find(s => s.id === sectionId);

    card.innerHTML = `
      <div class="gpath-wizard-header">
        <h3>Upload File</h3>
        <button class="gpath-wizard-close" id="wizClose">✕</button>
      </div>
      <div class="gpath-wizard-step" id="wizardStepBody">
        <button class="gpath-back-link" id="wizBack">← Back to sections</button>
        <div style="font-size: 12px; background: #f0fdf4; color: #166534; padding: 8px 12px; border-radius: 8px; margin-bottom: 8px;">
          Target: <strong>${config.label} > ${sectionObj.name}</strong>
        </div>
        
        <input type="file" id="wizFileInput" style="display: none;" accept=".pdf,.docx,.xlsx,.pptx,.txt">
        
        <div class="gpath-file-dropzone" id="wizDropzone">
          <div style="font-size: 28px; margin-bottom: 6px;">📄</div>
          <strong id="wizFileName" style="font-size: 13px; color: #172033; display: block; margin-bottom: 4px;">Click to browse file</strong>
          <small style="color: #788398; font-size: 11px;">Supports PDF, DOCX, XLSX, PPTX, TXT</small>
        </div>

        <button id="wizSubmitBtn" style="margin-top: 10px; width: 100%; padding: 12px; background:linear-gradient(135deg, #119cff, #034662); color: white; border: none; border-radius: 10px; font-weight: 600; cursor: pointer; opacity: 0.5; pointer-events: none; transition: 0.2s;">
          Upload & Open Section
        </button>
      </div>
    `;

    card.querySelector("#wizClose").addEventListener("click", closeWizard);
    card.querySelector("#wizBack").addEventListener("click", () => openWizardStep2(docType));

    const fileInput = card.querySelector("#wizFileInput");
    const dropzone = card.querySelector("#wizDropzone");
    const fileNameLabel = card.querySelector("#wizFileName");
    const submitBtn = card.querySelector("#wizSubmitBtn");

    let selectedFile = null;

    dropzone.addEventListener("click", () => fileInput.click());

    fileInput.addEventListener("change", (e) => {
      selectedFile = e.target.files[0];
      if (selectedFile) {
        fileNameLabel.textContent = selectedFile.name;
        fileNameLabel.style.color = "#0284c7";
        submitBtn.style.opacity = "1";
        submitBtn.style.pointerEvents = "auto";
      }
    });

    submitBtn.addEventListener("click", () => {
      if (!selectedFile) return;

      // ---- LOADING SPICE ANIMATION STATE ----
      const stepBody = card.querySelector("#wizardStepBody");
      stepBody.innerHTML = `
        <div style="text-align: center; padding: 30px 0;">
          <div class="gpath-spinner"></div>
          <h4 style="font-size: 15px; color: #172033; margin-bottom: 4px;">Uploading Document...</h4>
          <p style="font-size: 12px; color: #788398;">Encrypting and syncing to ${sectionObj.name} storage</p>
        </div>
      `;

      // Simulate a brief, smooth network delay for visual feedback
      setTimeout(() => {
        const extension = selectedFile.name.split(".").pop().toLowerCase();
        let fileType = "pdf";
        if (["docx", "doc"].includes(extension)) fileType = "docx";
        else if (["xlsx", "xls"].includes(extension)) fileType = "excel";
        else if (["pptx", "ppt"].includes(extension)) fileType = "powerpoint";
        else if (["txt"].includes(extension)) fileType = "txt";

        const storageKey = `gpath_docs_${docType}_${sectionId}`;
        let docs = [];
        try {
          docs = JSON.parse(localStorage.getItem(storageKey)) || [];
        } catch (err) {
          docs = [];
        }

        docs.unshift({
          id: Date.now(),
          name: selectedFile.name,
          type: fileType,
          date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
        });

        localStorage.setItem(storageKey, JSON.stringify(docs));

        // Redirect user right to that section page
        window.location.href = `${config.page}?section=${sectionId}`;
      }, 900); // 900ms delay gives the user a satisfying loading feedback loop
    });
  }

  function createModalContainer() {
    const modal = document.createElement("div");
    modal.id = "gpathWizardModal";
    modal.className = "gpath-wizard-overlay";
    return modal;
  }

  function closeWizard() {
    const existing = document.getElementById("gpathWizardModal");
    if (existing) existing.remove();
  }
});