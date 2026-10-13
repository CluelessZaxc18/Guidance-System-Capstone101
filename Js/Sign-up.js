// Js/Sign-up.js
document.addEventListener('DOMContentLoaded', () => {
    const signUpBtn = document.querySelector('.btn-signup');

    if (signUpBtn) {
        signUpBtn.addEventListener('click', async (e) => {
            e.preventDefault();

            if (document.getElementById('signupOverlay')) return;

            // Inject CSS dynamically if not present
            if (!document.getElementById('signupCSS')) {
                const link = document.createElement('link');
                link.id = 'signupCSS';
                link.rel = 'stylesheet';
                link.href = 'css/Sign-up.css'; // Adjust path if needed (e.g. '../css/Sign-up.css')
                document.head.appendChild(link);
            }

            try {
                // Fetch the sign-up modal HTML template
                const response = await fetch('Overlay/Sign-up.html'); // Ensure path matches your folder structure
                if (!response.ok) throw new Error('Could not load Sign-up.html');
                const htmlContent = await response.text();

                const overlayDiv = document.createElement('div');
                overlayDiv.id = 'signupOverlay';
                overlayDiv.className = 'signup-overlay-container';
                overlayDiv.innerHTML = htmlContent;
                document.body.appendChild(overlayDiv);

                // --- EVENT LISTENERS INSIDE THE MODAL ---
                const closeBtn = document.getElementById('closeSignup');
                const fileUploadInput = document.getElementById('file-upload');
                const step1Form = document.getElementById('signupDataForm');
                const signupStep1 = document.getElementById('signupStep1');
                const signupStep2 = document.getElementById('signupStep2');
                const finishBtn = document.getElementById('finishSignupBtn');
                const copyBtn = document.getElementById('copyPinBtn');

                // 1. Close button
                if (closeBtn) {
                    closeBtn.addEventListener('click', () => {
                        overlayDiv.remove();
                    });
                }

                // 2. Click outside modal card to close
                overlayDiv.addEventListener('click', (event) => {
                    if (event.target === overlayDiv) {
                        overlayDiv.remove();
                    }
                });

                // 3. File upload preview logic
                if (fileUploadInput) {
                    fileUploadInput.addEventListener('change', function(event) {
                        const file = event.target.files[0];
                        if (file && file.type.startsWith('image/')) {
                            const reader = new FileReader();
                            reader.onload = function(e) {
                                const previewWrapper = document.getElementById('preview-wrapper');
                                const uploadLabel = document.getElementById('upload-label');
                                
                                if (uploadLabel) {
                                    uploadLabel.style.backgroundColor = 'transparent';
                                    uploadLabel.style.padding = '0';
                                    uploadLabel.style.border = 'none';
                                    uploadLabel.style.boxShadow = 'none';
                                }
                                if (previewWrapper) {
                                    previewWrapper.innerHTML = `
                                        <img src="${e.target.result}" alt="Uploaded Preview" class="id-card-full-img">
                                    `;
                                }
                            };
                            reader.readAsDataURL(file);
                        }
                    });
                }

                // 4. Handle Step 1 Form Submission (Loading + PIN Generation)
                if (step1Form) {
                    step1Form.addEventListener('submit', (submitEvent) => {
                        submitEvent.preventDefault();

                        const fullName = document.getElementById('regFullName').value.trim();
                        const email = document.getElementById('regEmail').value.trim();
                        const pass1 = document.getElementById('regPass1').value;
                        const pass2 = document.getElementById('regPass2').value;
                        const position = document.getElementById('regPosition').value;

                        if (pass1 !== pass2) {
                            alert("Passwords do not match.");
                            return;
                        }

                        // Show realistic processing loading state inside step 1
                        signupStep1.innerHTML = `
                            <div style="text-align: center; padding: 40px 20px;">
                                <div style="font-size: 32px; margin-bottom: 15px;">⏳</div>
                                <h3 style="font-size: 18px; color: #111; margin-bottom: 8px;">Processing Account Setup...</h3>
                                <p style="font-size: 13px; color: #666;">Securing credentials and generating authorized staff access PIN.</p>
                            </div>
                        `;

                        // Simulate 2-second processing delay before showing the PIN
                        setTimeout(() => {
                            // Generate random 6-digit PIN
                            const generatedPin = Math.floor(100000 + Math.random() * 900000).toString();

                            // Save account to localStorage so login can verify it
                            let accounts = JSON.parse(localStorage.getItem('gpath_staff_accounts')) || [];
                            
                            // Ensure default admin always exists
                            if (!accounts.some(acc => acc.email === "GuidanceCounselor@gmail.com")) {
                                accounts.push({
                                    name: "Guidance Counselor",
                                    email: "GuidanceCounselor@gmail.com",
                                    password: "135735",
                                    pin: "135735",
                                    position: "Guidance Counselor"
                                });
                            }

                            // Push new registered account
                            accounts.push({
                                name: fullName,
                                email: email,
                                password: pass1,
                                pin: generatedPin,
                                position: position
                            });

                            localStorage.setItem('gpath_staff_accounts', JSON.stringify(accounts));

                            // Switch views to Step 2
                            if (signupStep1 && signupStep2) {
                                signupStep1.style.display = 'none';
                                signupStep2.style.display = 'block';
                            }
                            
                            const pinDisplay = document.getElementById('generatedPinDisplay');
                            if (pinDisplay) {
                                pinDisplay.textContent = generatedPin;
                            }
                        }, 2000);
                    });
                }

                // 5. Copy PIN functionality
                if (copyBtn) {
                    copyBtn.addEventListener('click', () => {
                        const pinText = document.getElementById('generatedPinDisplay')?.textContent;
                        if (!pinText) return;

                        navigator.clipboard.writeText(pinText).then(() => {
                            const icon = copyBtn.querySelector('i');
                            if (icon) {
                                icon.className = 'fa-solid fa-check';
                                copyBtn.style.color = '#28a745';
                                setTimeout(() => {
                                    icon.className = 'fa-regular fa-clone';
                                    copyBtn.style.color = '';
                                }, 2000);
                            }
                        });
                    });
                }

                // 6. Finish button -> Close modal and return to login
                if (finishBtn) {
                    finishBtn.addEventListener('click', () => {
                        overlayDiv.remove();
                    });
                }

            } catch (error) {
                console.error("Error loading Sign-up modal:", error);
            }
        });
    }
});