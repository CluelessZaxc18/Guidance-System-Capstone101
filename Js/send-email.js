window.openSendEmailModal = function(resultId) {
  document.getElementById("emailModalOverlay")?.remove();

  const olsatResults = JSON.parse(localStorage.getItem("gpath_olsat_results")) || [];
  const record = olsatResults.find(i => String(i.id) === String(resultId));
  if (!record) return;

  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];
  const timeStr = String(now.getHours()).padStart(2, '0') + ":" + String(now.getMinutes()).padStart(2, '0');

  const modalHtml = `
    <div class="email-modal-overlay" id="emailModalOverlay">
      <div class="email-modal-card">
        <div class="email-modal-header">
          <h3>Send OLSAT Result via Email</h3>
          <button type="button" class="email-modal-close" id="closeEmailModal">✕</button>
        </div>
        <form id="emailDispatchForm">
          <div class="email-modal-body">
            <div class="email-form-group">
              <label>Message Review</label>
              <div class="email-preview-box" style="background: #f8fafc; padding: 14px; border-radius: 8px; border: 1px solid #e7ebf2; font-size: 13px; line-height: 1.5;">
                <p><strong>Subject:</strong> Your OLSAT Results Are Ready!</p>
                <p>Dear ${record.name.split(' ')[0]},</p>
                <p>Your OLSAT score has been officially processed.</p>
                <p>Please check your student portal to view your complete score report.</p>
                <br>
                <p>Best regards,<br>
                Guidance Counseling Office<br>
                Admin / Staff</p>
              </div>
            </div>

            <div id="scheduleInputsContainer" style="display: none; margin-top: 15px; padding: 12px; background: #f1f5f9; border-radius: 8px;">
              <p style="font-size: 12px; font-weight: 600; margin-bottom: 8px; color: #172033;">Set Schedule Date & Time:</p>
              <div style="display: flex; gap: 10px;">
                <div style="flex: 1;">
                  <label style="font-size: 10px; font-weight: 700; color: #788398; display: block; margin-bottom: 3px;">DATE</label>
                  <input type="date" id="scheduleDate" value="${todayStr}" style="width: 100%; padding: 8px; border: 1px solid #e7ebf2; border-radius: 6px; font-size: 12px;">
                </div>
                <div style="flex: 1;">
                  <label style="font-size: 10px; font-weight: 700; color: #788398; display: block; margin-bottom: 3px;">TIME</label>
                  <input type="time" id="scheduleTime" value="${timeStr}" style="width: 100%; padding: 8px; border: 1px solid #e7ebf2; border-radius: 6px; font-size: 12px;">
                </div>
              </div>
            </div>
          </div>

          <div class="email-modal-footer" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
            <button type="button" class="email-btn-cancel" id="cancelEmailBtn" style="padding: 10px 16px; border: 1px solid #e7ebf2; background: white; border-radius: 8px; cursor: pointer; font-weight: 600;">Cancel</button>
            
            <div style="display: flex; gap: 8px;">
              <button type="button" id="scheduleToggleBtn" style="padding: 10px 16px; background: #e2fbfe; color: #109a8c; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">Schedule for Later</button>
              <button type="submit" class="email-btn-submit" id="sendDirectBtn" style="padding: 10px 18px; background: #119cff; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">Send Directly</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHtml);

  const closeModal = () => document.getElementById("emailModalOverlay")?.remove();
  
  document.getElementById("closeEmailModal").addEventListener("click", closeModal);
  document.getElementById("cancelEmailBtn").addEventListener("click", closeModal);
  document.getElementById("emailModalOverlay").addEventListener("click", e => {
    if (e.target.id === "emailModalOverlay") closeModal();
  });

  let isScheduling = false;
  const scheduleContainer = document.getElementById("scheduleInputsContainer");
  const scheduleToggleBtn = document.getElementById("scheduleToggleBtn");
  const sendDirectBtn = document.getElementById("sendDirectBtn");

  scheduleToggleBtn.addEventListener("click", () => {
    isScheduling = !isScheduling;
    if (isScheduling) {
      scheduleContainer.style.display = "block";
      scheduleToggleBtn.textContent = "Cancel Schedule";
      sendDirectBtn.textContent = "Confirm Schedule";
    } else {
      scheduleContainer.style.display = "none";
      scheduleToggleBtn.textContent = "Schedule for Later";
      sendDirectBtn.textContent = "Send Directly";
    }
  });

  document.getElementById("emailDispatchForm").addEventListener("submit", e => {
    e.preventDefault();

    if (isScheduling) {
      const schedDate = document.getElementById("scheduleDate").value;
      const schedTime = document.getElementById("scheduleTime").value;

      if (typeof showToast === "function") {
        showToast(`Email scheduled for ${record.name} on ${schedDate} at ${schedTime}.`);
      }

      const notifs = JSON.parse(localStorage.getItem("gpath_notifications")) || [];
      notifs.unshift({
        type: "blue",
        title: "OLSAT Email Scheduled",
        desc: `Scheduled score report for ${record.name} on ${schedDate} at ${schedTime}.`,
        timestamp: Date.now()
      });
      localStorage.setItem("gpath_notifications", JSON.stringify(notifs));
    } else {
      const subject = encodeURIComponent("Your OLSAT Results Are Ready!");
      const body = encodeURIComponent(
        `Dear ${record.name},\n\n` +
        `Your OLSAT score (${record.score}) has been officially processed.\n\n` +
        `Please check your student portal to view your complete score report.\n\n` +
        `Best regards,\n` +
        `Guidance Counseling Office\n` +
        `Admin / Staff`
      );

      window.location.href = `mailto:?subject=${subject}&body=${body}`;

      if (typeof showToast === "function") {
        showToast(`Email draft dispatched for ${record.name}.`);
      }

      const notifs = JSON.parse(localStorage.getItem("gpath_notifications")) || [];
      notifs.unshift({
        type: "green",
        title: "OLSAT Email Dispatched",
        desc: `Sent result score report to ${record.name}.`,
        timestamp: Date.now()
      });
      localStorage.setItem("gpath_notifications", JSON.stringify(notifs));
    }

    closeModal();
  });
};

window.openBatchEmailModal = function(filteredStudents, filterDateLabel) {
  document.getElementById("batchEmailModalOverlay")?.remove();

  if (!filteredStudents || filteredStudents.length === 0) {
    if (typeof showToast === "function") showToast("No students found in the current filter batch.");
    return;
  }

  const submissions = JSON.parse(localStorage.getItem("gpath_submissions")) || [];

  const pastelColors = [
    { bg: "#fef3c7", text: "#92400e", border: "#fde68a" },
    { bg: "#e0f2fe", text: "#0369a1", border: "#bae6fd" },
    { bg: "#fce7f3", text: "#9d174d", border: "#fbcfe8" },
    { bg: "#d1fae5", text: "#065f46", border: "#a7f3d0" },
    { bg: "#ede9fe", text: "#5b21b6", border: "#ddd6fe" },
    { bg: "#ffedd5", text: "#9a3412", border: "#fed7aa" }
  ];

  const studentBadgesHtml = filteredStudents.map((s, idx) => {
    const col = pastelColors[idx % pastelColors.length];
    
    const subMatch = submissions.find(sub => String(sub.id) === String(s.studentId) || sub.name === s.name);
    const studentEmail = (subMatch && (subMatch.gmail || subMatch.email)) ? (subMatch.gmail || subMatch.email) : "No Email Provided";

    return `
      <span style="display: inline-flex; align-items: center; gap: 4px; background: ${col.bg}; color: ${col.text}; border: 1px solid ${col.border}; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 600;">
        <i class="fa-solid fa-user" style="font-size: 9px;"></i> ${s.name} <span style="opacity: 0.7; font-weight: 400;">(${studentEmail})</span>
      </span>
    `;
  }).join("");

  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];
  const timeStr = String(now.getHours()).padStart(2, '0') + ":" + String(now.getMinutes()).padStart(2, '0');

  const modalHtml = `
    <div class="email-modal-overlay" id="batchEmailModalOverlay">
      <div class="email-modal-card" style="max-width: 580px;">
        <div class="email-modal-header">
          <h3>Send Batch OLSAT Results (${filterDateLabel})</h3>
          <button type="button" class="email-modal-close" id="closeBatchModal">✕</button>
        </div>
        <form id="batchEmailDispatchForm">
          <div class="email-modal-body">
            
            <div class="email-form-group">
              <label>Recipients (${filteredStudents.length} Students)</label>
              <div style="display: flex; flex-wrap: wrap; gap: 6px; max-height: 110px; overflow-y: auto; padding: 10px; background: #f8fafc; border: 1px solid #e7ebf2; border-radius: 8px;">
                ${studentBadgesHtml}
              </div>
            </div>

            <div class="email-form-group">
              <label>Message Review</label>
              <div class="email-preview-box" style="background: #f8fafc; padding: 14px; border-radius: 8px; border: 1px solid #e7ebf2; font-size: 13px; line-height: 1.5;">
                <p><strong>Subject:</strong> Your OLSAT Results Are Ready!</p>
                <p>Dear Student,</p>
                <p>Your OLSAT results have been officially processed and sent to your registered email address.</p>
                <p>Please check your email to view your score report.</p>
                <br>
                <p>Best regards,<br>
                Guidance Counseling Office<br>
                Admin / Staff</p>
              </div>
            </div>

            <div id="batchScheduleInputsContainer" style="display: none; margin-top: 10px; padding: 12px; background: #f1f5f9; border-radius: 8px;">
              <p style="font-size: 12px; font-weight: 600; margin-bottom: 8px; color: #172033;">Set Batch Schedule Date & Time:</p>
              <div style="display: flex; gap: 10px;">
                <div style="flex: 1;">
                  <label style="font-size: 10px; font-weight: 700; color: #788398; display: block; margin-bottom: 3px;">DATE</label>
                  <input type="date" id="batchScheduleDate" value="${todayStr}" style="width: 100%; padding: 8px; border: 1px solid #e7ebf2; border-radius: 6px; font-size: 12px;">
                </div>
                <div style="flex: 1;">
                  <label style="font-size: 10px; font-weight: 700; color: #788398; display: block; margin-bottom: 3px;">TIME</label>
                  <input type="time" id="batchScheduleTime" value="${timeStr}" style="width: 100%; padding: 8px; border: 1px solid #e7ebf2; border-radius: 6px; font-size: 12px;">
                </div>
              </div>
            </div>

          </div>

          <div class="email-modal-footer" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
            <button type="button" class="email-btn-cancel" id="cancelBatchModalBtn" style="padding: 10px 16px; border: 1px solid #e7ebf2; background: white; border-radius: 8px; cursor: pointer; font-weight: 600;">Cancel</button>
            
            <div style="display: flex; gap: 8px;">
              <button type="button" id="batchScheduleToggleBtn" style="padding: 10px 16px; background: #e2fbfe; color: #213b8b; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">Schedule for Later</button>
              <button type="submit" class="email-btn-submit" id="batchSendDirectBtn" style="padding: 10px 18px; background: #1569ca; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">Send Batch</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHtml);

  const closeBatchModal = () => document.getElementById("batchEmailModalOverlay")?.remove();
  document.getElementById("closeBatchModal").addEventListener("click", closeBatchModal);
  document.getElementById("cancelBatchModalBtn").addEventListener("click", closeBatchModal);
  document.getElementById("batchEmailModalOverlay").addEventListener("click", e => {
    if (e.target.id === "batchEmailModalOverlay") closeBatchModal();
  });

  let isBatchScheduling = false;
  const batchScheduleContainer = document.getElementById("batchScheduleInputsContainer");
  const batchScheduleToggleBtn = document.getElementById("batchScheduleToggleBtn");
  const batchSendDirectBtn = document.getElementById("batchSendDirectBtn");

  batchScheduleToggleBtn.addEventListener("click", () => {
    isBatchScheduling = !isBatchScheduling;
    if (isBatchScheduling) {
      batchScheduleContainer.style.display = "block";
      batchScheduleToggleBtn.textContent = "Cancel Schedule";
      batchSendDirectBtn.textContent = "Confirm Batch Schedule";
    } else {
      batchScheduleContainer.style.display = "none";
      batchScheduleToggleBtn.textContent = "Schedule for Later";
      batchSendDirectBtn.textContent = "Send Batch";
    }
  });

  document.getElementById("batchEmailDispatchForm").addEventListener("submit", e => {
    e.preventDefault();

    if (isBatchScheduling) {
      const schedDate = document.getElementById("batchScheduleDate").value;
      const schedTime = document.getElementById("batchScheduleTime").value;

      if (typeof showToast === "function") {
        showToast(`Batch email scheduled for ${filteredStudents.length} students on ${schedDate} at ${schedTime}.`);
      }

      const notifs = JSON.parse(localStorage.getItem("gpath_notifications")) || [];
      notifs.unshift({
        type: "blue",
        title: "Batch OLSAT Email Scheduled",
        desc: `Scheduled score reports for ${filteredStudents.length} students (${filterDateLabel}) on ${schedDate} at ${schedTime}.`,
        timestamp: Date.now()
      });
      localStorage.setItem("gpath_notifications", JSON.stringify(notifs));
    } else {
      if (typeof showToast === "function") {
        showToast(`Successfully dispatched batch emails to ${filteredStudents.length} students!`);
      }

      const notifs = JSON.parse(localStorage.getItem("gpath_notifications")) || [];
      notifs.unshift({
        type: "green",
        title: "Batch OLSAT Emails Sent",
        desc: `Dispatched score reports to ${filteredStudents.length} recipients (${filterDateLabel}).`,
        timestamp: Date.now()
      });
      localStorage.setItem("gpath_notifications", JSON.stringify(notifs));
    }

    closeBatchModal();
  });
};