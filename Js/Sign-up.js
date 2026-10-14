document.addEventListener('DOMContentLoaded', () => {
    const signUpBtn = document.querySelector('.btn-signup');

    if (signUpBtn) {
        signUpBtn.addEventListener('click', async (e) => {
            e.preventDefault();

            if (document.getElementById('signupOverlay')) return;

            if (!document.getElementById('signupCSS')) {
                const link = document.createElement('link');
                link.id = 'signupCSS';
                link.rel = 'stylesheet';
                link.href = 'css/Sign-up.css';
                document.head.appendChild(link);
            }

            try {
                const response = await fetch('Overlay/Sign-up.html');
                if (!response.ok) throw new Error('Could not load Sign-up.html');
                const htmlContent = await response.text();

                const overlayDiv = document.createElement('div');
                overlayDiv.id = 'signupOverlay';
                overlayDiv.className = 'signup-overlay-container';
                overlayDiv.innerHTML = htmlContent;
                document.body.appendChild(overlayDiv);

                const closeBtn = document.getElementById('closeSignup');
                const fileUploadInput = document.getElementById('file-upload');
                const step1Form = document.getElementById('signupDataForm');
                const signupStep1 = document.getElementById('signupStep1');
                const signupStep2 = document.getElementById('signupStep2');
                const finishBtn = document.getElementById('finishSignupBtn');
                const copyBtn = document.getElementById('copyPinBtn');

                if (closeBtn) {
                    closeBtn.addEventListener('click', () => {
                        overlayDiv.remove();
                    });
                }

                overlayDiv.addEventListener('click', (event) => {
                    if (event.target === overlayDiv) {
                        overlayDiv.remove();
                    }
                });

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

                        signupStep1.innerHTML = `
                            <div style="text-align: center; padding: 40px 20px;">
                                <div style="font-size: 32px; margin-bottom: 15px;">⏳</div>
                                <h3 style="font-size: 18px; color: #111; margin-bottom: 8px;">Processing Account Setup...</h3>
                                <p style="font-size: 13px; color: #666;">Securing credentials and generating authorized staff access PIN.</p>
                            </div>
                        `;

                        setTimeout(() => {
                            const generatedPin = Math.floor(100000 + Math.random() * 900000).toString();

                            let accounts = JSON.parse(localStorage.getItem('gpath_staff_accounts')) || [];
                            
                            if (!accounts.some(acc => acc.email === "GuidanceCounselor@gmail.com")) {
                                accounts.push({
                                    name: "Guidance Counselor",
                                    email: "GuidanceCounselor@gmail.com",
                                    password: "admin",
                                    pin: "113734",
                                    position: "Admin",
                                    idImage: "../img/emp_id102.png"
                                });
                            }

                            let uploadedImageSrc = "../img/emp-id101.jpg";
                            fileUploadInput.addEventListener('change', function(event) {
                                const file = event.target.files[0];
                                if (file && file.type.startsWith('image/')) {
                                    const reader = new FileReader();
                                    reader.onload = function(e) {
                                        uploadedImageSrc = e.target.result;
                                    };
                                    reader.readAsDataURL(file);
                                }
                            });

                            accounts.push({
                                name: fullName,
                                email: email,
                                password: pass1,
                                pin: generatedPin,
                                position: position,
                                idImage: uploadedImageSrc
                            });

                            localStorage.setItem('gpath_staff_accounts', JSON.stringify(accounts));

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