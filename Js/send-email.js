window.openSendEmailModal = function(resultId) {
  document.getElementById("emailModalOverlay")?.remove();

  // Load the specific OLSAT result
  const olsatResults = JSON.parse(localStorage.getItem("gpath_olsat_results")) || [];
  const record = olsatResults.find(i => String(i.id) === String(resultId));
  if (!record) return;

  // Try to find matching student email from gpath_students or submissions
  const students = JSON.parse(localStorage.getItem("gpath_students")) || [];
  const submissions = JSON.parse(localStorage.getItem("gpath_submissions")) || [];

  let studentEmail = "";
  const matchedSub = submissions.find(s => String(s.id) === String(record.studentId) || s.name === record.name);
  if (matchedSub && matchedSub.gmail) {
    studentEmail = matchedSub.gmail;
  }

  // Get current date/time to set default min values for scheduler
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
              <label>Student Name</label>
              <input type="text" id="emailStudentName" value="${record.name}" required>
            </div>

            <div class="email-form-group">
              <label>Student Gmail Address</label>
              <input type="email" id="emailStudentAddress" value="${studentEmail}" placeholder="e.g. student@gmail.com">
            </div>

            <div class="email-form-group">
              <label>Message Preview</label>
              <div class="email-preview-box">
                <p><strong>Subject:</strong> Your OLSAT Results Are Ready!</p>
                <p>Dear <span id="previewName">${record.name.split(' ')[0]}</span>,</p>
                <p>Your OLSAT results have been officially processed and sent to your registered email address.</p>
                <p>Please check your Inbox to view your score report.</p>
                <br>
                <p>Best regards,<br>
                [Guidance Counseling Office]<br>
                [Guidance Counselor - Admin]</p>
              </div>
            </div>
          </div>

          <div class="email-modal-footer" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
            <!-- Schedule inputs placed on the lower left part of the footer -->
            <div style="display: flex; gap: 6px; align-items: center;">
              <div style="display: flex; flex-direction: column;">
                <label style="font-size: 9px; font-weight: 700; color: #788398; margin-bottom: 2px;">SCHEDULE DATE</label>
                <input type="date" id="scheduleDate" value="${todayStr}" style="padding: 6px 8px; border: 1px solid #e7ebf2; border-radius: 6px; font-size: 11px;">
              </div>
              <div style="display: flex; flex-direction: column;">
                <label style="font-size: 9px; font-weight: 700; color: #788398; margin-bottom: 2px;">TIME</label>
                <input type="time" id="scheduleTime" value="${timeStr}" style="padding: 6px 8px; border: 1px solid #e7ebf2; border-radius: 6px; font-size: 11px;">
              </div>
            </div>

            <div style="display: flex; gap: 8px;">
              <button type="button" class="email-btn-cancel" id="cancelEmailBtn">Cancel</button>
              <button type="submit" class="email-btn-submit" id="submitEmailBtn">Send Now</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHtml);

  // Live update preview name when editable name changes
  const nameInput = document.getElementById("emailStudentName");
  const previewSpan = document.getElementById("previewName");
  nameInput.addEventListener("input", () => {
    previewSpan.textContent = nameInput.value.trim() || "[Student Name]";
  });

  const closeModal = () => document.getElementById("emailModalOverlay")?.remove();
  
  document.getElementById("closeEmailModal").addEventListener("click", closeModal);
  document.getElementById("cancelEmailBtn").addEventListener("click", closeModal);
  document.getElementById("emailModalOverlay").addEventListener("click", e => {
    if (e.target.id === "emailModalOverlay") closeModal();
  });

  // Handle email dispatch or scheduling
  document.getElementById("emailDispatchForm").addEventListener("submit", e => {
    e.preventDefault();

    const recipientName = nameInput.value.trim();
    const recipientEmail = document.getElementById("emailStudentAddress").value.trim();
    const schedDate = document.getElementById("scheduleDate").value;
    const schedTime = document.getElementById("scheduleTime").value;

    const subject = encodeURIComponent("Your OLSAT Results Are Ready!");
    const body = encodeURIComponent(
      `Dear ${recipientName},\n\n` +
      `Your OLSAT results have been officially processed and sent to your registered email address.\n\n` +
      `Please check your Inbox to view your score report.\n\n` +
      `Best regards,\n` +
      `[Guidance Counseling Office]\n` +
      `[Guidance Counselor - Admin]`
    );

    const targetEmail = recipientEmail || "";

    if (schedDate && schedTime) {
      if (typeof showToast === "function") {
        showToast(`Email scheduled for ${recipientName} on ${schedDate} at ${schedTime}.`);
      }
    } else {
      window.location.href = `mailto:${targetEmail}?subject=${subject}&body=${body}`;
      if (typeof showToast === "function") {
        showToast(`Email draft generated for ${recipientName}.`);
      }
    }

    // Log Email Activity Notification
    const notifs = JSON.parse(localStorage.getItem("gpath_notifications")) || [];
    notifs.unshift({
      type: "blue",
      title: "OLSAT Email Notification",
      desc: `Sent result score report to ${recipientName} (${recipientEmail || "No Email"}).`,
      timestamp: Date.now()
    });
    localStorage.setItem("gpath_notifications", JSON.stringify(notifs));

    closeModal();
  });
};