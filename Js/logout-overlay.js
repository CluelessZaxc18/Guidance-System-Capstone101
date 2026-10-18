document.addEventListener('DOMContentLoaded', () => {
    const moreBtns = document.querySelectorAll('.more-btn');

    moreBtns.forEach(moreBtn => {
        moreBtn.addEventListener('click', async (e) => {
            e.stopPropagation();

            if (document.getElementById('logoutOverlay')) return;

            if (!document.getElementById('logoutCSS')) {
                const link = document.createElement('link');
                link.id = 'logoutCSS';
                link.rel = 'stylesheet';
                link.href = window.location.pathname.includes('/pages/') ? '../css/logout-overlay.css' : 'css/logout-overlay.css';
                document.head.appendChild(link);
            }

            const htmlContent = `
                <div class="logout-overlay-container" id="logoutOverlay">
                    <div class="logout-card">
                        <div class="logout-header">
                            <h3>Notice!</h3>
                            <button class="close-logout-btn" id="closeLogoutBtn">&times;</button>
                        </div>
                        <div class="logout-body">
                            <p>Are you sure you want to log out?</p>
                        </div>
                        <div class="logout-footer">
                            <button class="logout-btn-cancel" id="cancelLogoutBtn">Cancel</button>
                            <a href="extra/Signout-load.html" class="logout-btn-confirm" id="confirmLogoutBtn">Log Out</a>
                        </div>
                    </div>
                </div>
            `;

            const container = document.createElement('div');
            container.innerHTML = htmlContent.trim();
            document.body.appendChild(container.firstChild);

            const overlay = document.getElementById('logoutOverlay');
            const closeBtn = document.getElementById('closeLogoutBtn');
            const cancelBtn = document.getElementById('cancelLogoutBtn');

            const closeOverlay = () => overlay.remove();

            closeBtn.addEventListener('click', closeOverlay);
            cancelBtn.addEventListener('click', closeOverlay);

            overlay.addEventListener('click', (event) => {
                if (event.target === overlay) {
                    closeOverlay();
                }
            });
        });
    });
});