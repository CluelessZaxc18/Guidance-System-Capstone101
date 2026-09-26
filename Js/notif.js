document.addEventListener('DOMContentLoaded', () => {
    const notifBell = document.getElementById('notifBell');

    if (notifBell) {
        notifBell.addEventListener('click', async (e) => {
            e.stopPropagation(); // Prevent immediate closing

            // Check if overlay already exists
            if (document.getElementById('notifOverlay')) {
                document.getElementById('notifOverlay').remove();
                return;
            }

            // Dynamically load notifications.css if not present
            if (!document.getElementById('notifCSS')) {
                const link = document.createElement('link');
                link.id = 'notifCSS';
                link.rel = 'stylesheet';
                link.href = '../css/notif.css';
                document.head.appendChild(link);
            }

            try {
                // Fetch notifications.html content
                const response = await fetch('Overlay/notif.html');
                if (!response.ok) throw new Error('Could not load notifications.html');
                const htmlContent = await response.text();

                // Create overlay container and inject markup
                const overlayDiv = document.createElement('div');
                overlayDiv.id = 'notifOverlay';
                overlayDiv.className = 'notif-overlay-container';
                overlayDiv.innerHTML = htmlContent;
                document.body.appendChild(overlayDiv);

                // Close when clicking outside the notification card
                overlayDiv.addEventListener('click', (event) => {
                    if (event.target === overlayDiv) {
                        overlayDiv.remove();
                    }
                });

            } catch (error) {
                console.error("Error loading notification overlay:", error);
            }
        });
    }
});