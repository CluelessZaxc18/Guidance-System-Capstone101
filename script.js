const togglePassword = document.querySelector('#togglePassword');
const password = document.querySelector('#Password');

togglePassword.addEventListener('click', function () {
    // Toggle the type attribute between 'password' and 'text'
    const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
    password.setAttribute('type', type);
    
    // Toggle the eye icon between open and slashed state
    this.classList.toggle('fa-eye');
    this.classList.toggle('fa-eye-slash');
});