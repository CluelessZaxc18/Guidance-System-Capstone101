document.addEventListener('DOMContentLoaded', () => {
    const signUpBtn = document.querySelector('.btn-signup');

    if (signUpBtn) {
        signUpBtn.addEventListener('click', async (e) => {
            e.preventDefault();

            if (document.getElementById('signupOverlay')) return;

            // Load external CSS dynamically
            if (!document.getElementById('signupCSS')) {
                const link = document.createElement('link');
                link.id = 'signupCSS';
                link.rel = 'stylesheet';
                link.href = 'Sign-up.css';
                document.head.appendChild(link);
            }

            try {
                const response = await fetch('Sign-up.html');
                if (!response.ok) throw new Error('Could not load Sign-up.html');
                const htmlContent = await response.text();

                const overlayDiv = document.createElement('div');
                overlayDiv.id = 'signupOverlay';
                overlayDiv.className = 'signup-overlay-container';
                overlayDiv.innerHTML = htmlContent;
                document.body.appendChild(overlayDiv);

                // Close button handler
                const closeBtn = document.getElementById('closeSignup');
                if (closeBtn) {
                    closeBtn.addEventListener('click', () => {
                        overlayDiv.remove();
                    });
                }

                // Close when clicking outside modal
                overlayDiv.addEventListener('click', (event) => {
                    if (event.target === overlayDiv) {
                        overlayDiv.remove();
                    }
                });

                // --------------------------------------------------
                // Confirm button handler (Placed INSIDE try block)
                // --------------------------------------------------
                const confirmBtn = document.getElementById('confirmBtn');
                if (confirmBtn) {
                    confirmBtn.addEventListener('click', async (subEvent) => {
                        subEvent.preventDefault();

                        // 1. Hide the sign-up modal overlay first
                        const signupOverlay = document.getElementById('signupOverlay');
                        if (signupOverlay) {
                            signupOverlay.style.display = 'none';
                        }

                        // 2. Dynamically load and inject the loading2.css stylesheet
                        if (!document.getElementById('loadingCSS')) {
                            const link = document.createElement('link');
                            link.id = 'loadingCSS';
                            link.rel = 'stylesheet';
                            link.href = 'loading2.css';
                            document.head.appendChild(link);
                        }

                        try {
                            // 3. Fetch loading2.html and display it as an overlay
                            const loadResponse = await fetch('loading2.html');
                            if (!loadResponse.ok) throw new Error('Failed to load loading2.html');
                            
                            const loadingHtml = await loadResponse.text();

                            const loadContainer = document.createElement('div');
                            loadContainer.id = 'loadingWrapper';
                            loadContainer.innerHTML = loadingHtml;
                            document.body.appendChild(loadContainer);

                            // 4. Wait 2.5 seconds, then move to index.html
                            setTimeout(() => {
                                window.location.href = 'Login.html';
                            }, 2500);

                        } catch (error) {
                            console.error("Error loading loading screen:", error);
                            window.location.href = 'Sign-up.html';
                        }
                    });
                }

            } catch (error) {
                console.error("Error loading Sign-up modal:", error);
            }
        });
    }
});