document.addEventListener('DOMContentLoaded', () => {
    const notifBell = document.getElementById('notifBell');
    if (!notifBell) return;

    // 1. Inject CSS styles
    if (!document.getElementById('gpathNotifStyles')) {
        const style = document.createElement('style');
        style.id = 'gpathNotifStyles';
        style.innerHTML = `
            .notif-overlay-container {
                position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                background-color: rgba(0, 0, 0, 0.2); backdrop-filter: blur(1px);
                display: flex; justify-content: flex-end; align-items: flex-start;
                padding: 75px 25px 20px 20px; z-index: 1500; animation: fadeIn 0.2s ease;
            }
            .notif-card {
                background-color: #ffffff; width: 100%; max-width: 420px; max-height: 85vh;
                overflow-y: auto; border-radius: 16px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
                border: 1px solid rgba(138, 43, 226, 0.15); padding: 18px 20px;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; text-align: left;
            }
            .notif-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
            .notif-header h2 { font-size: 1.25rem; font-weight: 700; color: #111; margin: 0; }
            .mark-read { font-size: 0.8rem; color: #555; cursor: pointer; font-weight: 500; }
            .mark-read:hover { color: #000; text-decoration: underline; }
            .notif-divider { height: 1px; background-color: #edf2f7; margin: 12px 0; }
            .notif-list { display: flex; flex-direction: column; gap: 8px; }
            .notif-item { display: flex; align-items: flex-start; gap: 12px; padding: 8px 10px; border-radius: 8px; transition: background 0.2s; position: relative; }
            .notif-item:hover { background-color: #f8fafc; }
            .notif-icon { width: 36px; height: 36px; border-radius: 8px; display: flex; justify-content: center; align-items: center; font-size: 0.9rem; flex-shrink: 0; }
            .notif-icon.green { background-color: #e6f4ea; color: #137333; }
            .notif-icon.purple { background-color: #f3e8ff; color: #7e22ce; }
            .notif-icon.orange { background-color: #fef3c7; color: #d97706; }
            .notif-icon.blue { background-color: #e0f2fe; color: #0284c7; }
            .notif-icon.red { background-color: #fee2e2; color: #dc2626; }
            .notif-content { flex-grow: 1; }
            .notif-title-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px; }
            .notif-title-row h4 { font-size: 0.88rem; font-weight: 600; color: #111; margin: 0; }
            .notif-time { font-size: 0.72rem; color: #64748b; }
            .notif-content p { font-size: 0.78rem; color: #475569; margin: 0; line-height: 1.25; }
            .unread-dot { width: 6px; height: 6px; background-color: #2563eb; border-radius: 50%; align-self: center; flex-shrink: 0; }
            .notif-footer { text-align: center; margin-top: 14px; padding-top: 10px; border-top: 1px solid #edf2f7; }
            .notif-footer a { font-size: 0.85rem; font-weight: 600; color: #1e293b; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; }
        `;
        document.head.appendChild(style);
    }

    function escapeHtml(value) {
        return String(value).replace(/[&<>"']/g, ch => ({
            "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
        }[ch]));
    }

    // Turns a stored timestamp into "Just now" / "5 minutes ago" / etc.,
    // computed fresh every time the list is rendered (not baked in once).
    function timeAgo(timestamp) {
        if (!timestamp) return '';
        const seconds = Math.floor((Date.now() - timestamp) / 1000);
        if (seconds < 60) return 'Just now';
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
        const days = Math.floor(hours / 24);
        if (days === 1) return 'Yesterday';
        if (days < 7) return `${days} days ago`;
        return new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    function readNotifs() {
        try {
            return JSON.parse(localStorage.getItem('gpath_notifications')) || [];
        } catch (e) {
            return [];
        }
    }

    function writeNotifs(notifs) {
        localStorage.setItem('gpath_notifications', JSON.stringify(notifs));
    }

    // Shows/hides the red dot based on whatever is actually stored, rather
    // than being flipped on/off ad hoc from multiple places.
    function syncBellDot() {
        const hasUnread = readNotifs().some(n => n.unread);
        const redDot = notifBell.querySelector('.dot');
        if (redDot) redDot.style.display = hasUnread ? 'block' : 'none';
    }

    // Helper other scripts call to log a real notification, e.g.:
    //   window.addSystemNotification('Student added', 'Ana Cruz was added.', 'green')
    window.addSystemNotification = function (title, description, type = 'green') {
        const notifs = readNotifs();

        notifs.unshift({
            id: Date.now(),
            title: title,
            desc: description,
            type: type, // green, purple, orange, blue, red
            timestamp: Date.now(),
            unread: true
        });

        // Keep last 15 items max
        if (notifs.length > 15) notifs.length = 15;
        writeNotifs(notifs);

        syncBellDot();
    };

    // Initialize empty notification storage if it doesn't exist yet.
    // (This used to be preceded by a line that wiped this key on every
    // page load, which meant nothing was ever actually remembered.)
    if (!localStorage.getItem('gpath_notifications')) {
        writeNotifs([]);
    }

    syncBellDot(); // reflect whatever's already stored as soon as this page loads

    // 2. Handle Bell Click
    notifBell.addEventListener('click', (e) => {
        e.stopPropagation();

        let existingOverlay = document.getElementById('notifOverlay');
        if (existingOverlay) {
            existingOverlay.remove();
            return;
        }

        const notifs = readNotifs();

        const listHtml = notifs.map(n => `
            <div class="notif-item ${n.unread ? 'unread' : ''}">
                <div class="notif-icon ${n.type}">
                    ${n.type === 'red' ? '🗑️' : n.type === 'orange' ? '⚠️' : n.type === 'purple' ? '✏️' : n.type === 'blue' ? '⬆️' : '📄'}
                </div>
                <div class="notif-content">
                    <div class="notif-title-row">
                        <h4>${escapeHtml(n.title)}</h4>
                        <span class="notif-time">${escapeHtml(n.timestamp ? timeAgo(n.timestamp) : (n.time || ''))}</span>
                    </div>
                    <p>${escapeHtml(n.desc)}</p>
                </div>
                ${n.unread ? '<span class="unread-dot"></span>' : ''}
            </div>
        `).join('');

        const overlayDiv = document.createElement('div');
        overlayDiv.id = 'notifOverlay';
        overlayDiv.className = 'notif-overlay-container';

        overlayDiv.innerHTML = `
            <div class="notif-card">
                <div class="notif-header">
                    <h2>Notifications</h2>
                    <span class="mark-read" id="markAllReadBtn">Mark all as read</span>
                </div>
                <div class="notif-list">
                    ${listHtml.length > 0 ? listHtml : '<p style="text-align:center; color:#788398; font-size:13px; padding:20px;">No notifications yet</p>'}
                </div>
                <div class="notif-footer">
                    <a href="#">Activity Logs →</a>
                </div>
            </div>
        `;

        document.body.appendChild(overlayDiv);

        // Mark all as read action
        const markReadBtn = overlayDiv.querySelector('#markAllReadBtn');
        if (markReadBtn) {
            markReadBtn.addEventListener('click', () => {
                const currentNotifs = readNotifs().map(n => ({ ...n, unread: false }));
                writeNotifs(currentNotifs);

                overlayDiv.querySelectorAll('.unread-dot').forEach(dot => dot.remove());
                syncBellDot();
            });
        }

        overlayDiv.addEventListener('click', (event) => {
            if (event.target === overlayDiv) overlayDiv.remove();
        });
    });
});