document.addEventListener("DOMContentLoaded", () => {
  const docSections = [
    { type: "narrative", section: "testing" },
    { type: "narrative", section: "referrals" },
    { type: "narrative", section: "counseling" },
    { type: "forms", section: "referrals" },
    { type: "forms", section: "informed-consent" },
    { type: "forms", section: "referral-feedback" },
    { type: "forms", section: "case-notes" }
  ];

  docSections.forEach(item => {
    const key = `gpath_docs_${item.type}_${item.section}`;
    if (localStorage.getItem(key) === null) {
      const base = item.section.replace(/-/g, "_");
      const defaultDocs = [
        { id: 1, name: `${base}_assessment_summary.pdf`, type: "pdf", date: "Sept 26, 2026" },
        { id: 2, name: `${base}_evaluation_notes.docx`, type: "docx", date: "Sept 24, 2026" },
      ];
      localStorage.setItem(key, JSON.stringify(defaultDocs));
    }
  });
  // -------------------------------------------------------------------------

  const list = document.getElementById("activityList");
  if (!list) return;

  const MAX_ROWS = 4;

  const TYPE_STYLE = {
    green: { colorClass: "teal", icon: "+" },
    red: { colorClass: "red", icon: "−" },
    blue: { colorClass: "blue", icon: "↑" },
    purple: { colorClass: "violet", icon: "↓" },
    orange: { colorClass: "orange", icon: "!" },
  };
  const DEFAULT_STYLE = { colorClass: "teal", icon: "•" };

  const PLACEHOLDER_ROWS = [
    { colorClass: "teal", icon: "✓", title: "Welcome to G-PATH", desc: "Your guidance management system is ready to use." },
    { colorClass: "blue", icon: "+", title: "Get started", desc: "Add your first student or upload a document." },
    { colorClass: "violet", icon: "🔔", title: "Stay updated", desc: "Actions you take will appear here automatically." },
    { colorClass: "orange", icon: "⚙", title: "Tip", desc: "Visit Settings to update your profile and preferences." },
  ];

  function readNotifications() {
    try {
      return JSON.parse(localStorage.getItem("gpath_notifications")) || [];
    } catch (err) {
      return [];
    }
  }

  function timeAgo(timestamp) {
    if (!timestamp) return "";
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    return new Date(timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, ch => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    }[ch]));
  }

  function rowHtml(colorClass, icon, title, desc, timeText) {
    return `
      <div class="activity">
        <div class="activity-symbol ${colorClass}">${icon}</div>
        <div>
          <strong>${escapeHtml(title)}</strong>
          <p>${escapeHtml(desc)}</p>
        </div>
        <time>${escapeHtml(timeText)}</time>
      </div>
    `;
  }

  function render() {
    const notifs = readNotifications();

    if (notifs.length === 0) {
      list.innerHTML = PLACEHOLDER_ROWS
        .map(row => rowHtml(row.colorClass, row.icon, row.title, row.desc, ""))
        .join("");
      return;
    }

    list.innerHTML = notifs.slice(0, MAX_ROWS).map(n => {
      const style = TYPE_STYLE[n.type] || DEFAULT_STYLE;
      return rowHtml(style.colorClass, style.icon, n.title, n.desc, timeAgo(n.timestamp));
    }).join("");
  }

  render();

  function countTotalDocuments() {
    let total = 0;

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key || !key.startsWith("gpath_docs_")) continue;

      try {
        const docs = JSON.parse(localStorage.getItem(key));
        if (Array.isArray(docs)) total += docs.length;
      } catch (err) {
      }
    }

    return total;
  }

  function renderTotalDocuments() {
    const el = document.getElementById("totalDocsCount");
    if (!el) return;
    el.textContent = countTotalDocuments();
  }

  renderTotalDocuments();

  //=========================== Total Students count ===========================
  function countTotalStudents() {
    try {
      const stored = JSON.parse(localStorage.getItem("gpath_students"));
      if (Array.isArray(stored)) return stored.length;
    } catch (err) {}
    return 12;
  }

  function renderTotalStudents() {
    const el = document.getElementById("totalStudentsCount");
    if (!el) return;
    el.textContent = countTotalStudents();
  }

  renderTotalStudents();

  //=========================== Total Info Submission count ===========================
  function totalSubmissionCount() {
    try {
      const submissions = JSON.parse(localStorage.getItem("gpath_submissions"));
      if (Array.isArray(submissions)) {
        return submissions.filter(s => s.status === "Pending").length;
      }
    } catch (err) {}
    return 0; 
  }

  function renderTotalSubmissions() {
    const el = document.getElementById("totalSubmissionCount");
    if (!el) return;
    el.textContent = totalSubmissionCount();
  }

  renderTotalSubmissions();

  //=========================== Total Approved Submissions count ===========================
  function countTotalApproved() {
    try {
      const submissions = JSON.parse(localStorage.getItem("gpath_submissions"));
      if (Array.isArray(submissions)) {
        return submissions.filter(s => s.status === "Approved").length;
      }
    } catch (err) {}
    return 12;
  }

  function renderTotalApproved() {
    const el = document.getElementById("totalApprovedCount");
    if (!el) return;
    el.textContent = countTotalApproved();
  }

  renderTotalApproved();
});