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
          <h3>via Email</h3>
          <button type="button" class="email-modal-close" id="closeEmailModal">✕</button>
        </div>
        <form id="emailDispatchForm">
          <div class="email-modal-body">
            <div class="email-form-group">
              <label>Message Review</label>
              <div class="email-preview-box" style="background: #f8fafc; padding: 14px; border-radius: 8px; border: 1px solid #e7ebf2; font-size: 13px; line-height: 1.5;">
                <p><strong>Subject:</strong> Your OLSAT Results Are Ready!</p>
                <p>Dear ${record.name.split(' ')[0]},</p>
                <p>Your OLSAT results have been officially processed and sent to your registered email address.</p>
                <p>Please check your email to view your score report.</p>
                <br>
                <p>Best regards,<br>
                Guidance Counseling Office<br>
                Admin / Staff</p>
              </div>
            </div>

            <!-- Schedule inputs container (hidden by default until Schedule button clicked) -->
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