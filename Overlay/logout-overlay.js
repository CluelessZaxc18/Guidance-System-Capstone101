document.addEventListener('DOMContentLoaded', () => {
   
    const moreBtn = document.querySelector('.more-btn');

    if (moreBtn) {
        moreBtn.addEventListener('click', async (e) => {
            e.stopPropagation();

          
            if (document.getElementById('logoutOverlay')) return;

            
            if (!document.getElementById('logoutCSS')) {
                const link = document.createElement('link');
                link.id = 'logoutCSS';
                link.rel = 'stylesheet';
                link.href = 'Overlay/logout-overlay.css';
                document.head.appendChild(link);
            }

            try {
               
                const response = await fetch('Overlay/logout-overlay.html');
                if (!response.ok) throw new Error('Could not load logout-overlay.html');
                const htmlContent = await response.text();

         
                const container = document.createElement('div');
                container.innerHTML = htmlContent;
                document.body.appendChild(container.firstElementChild);

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

            } catch (error) {
                console.error("Error loading logout overlay:", error);
            }
        });
    }
});