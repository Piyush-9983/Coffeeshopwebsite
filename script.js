// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Functionality
    const menuOpenButton = document.querySelector("#menu-open-button");
    const menuCloseButton = document.querySelector("#menu-close-button");
    const navMenu = document.querySelector(".nav-menu");

    if (menuOpenButton && menuCloseButton && navMenu) {
        menuOpenButton.addEventListener("click", () => {
            document.body.classList.toggle("show-mobile-menu");
            navMenu.classList.toggle("active");
        });
    }

    // Login Modal Functionality
    const loginLink = document.getElementById('login-link');
    const modal = document.getElementById('login-modal');
    const closeModal = document.querySelector('.close-modal');
    const showRegister = document.getElementById('show-register');
    const showLogin = document.getElementById('show-login');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const loginFormElement = document.getElementById('login-form-element');
    const registerFormElement = document.getElementById('register-form-element');

// Local Storage Functions
function saveUser(userData) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    users.push(userData);
    localStorage.setItem('users', JSON.stringify(users));
}

function getUserByEmail(email) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    return users.find(user => user.email === email);
}

function setCurrentUser(userData) {
    localStorage.setItem('currentUser', JSON.stringify(userData));
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser'));
}

function logout() {
    localStorage.removeItem('currentUser');
    updateLoginButton();
}

function updateLoginButton() {
    const currentUser = getCurrentUser();
    if (currentUser) {
        loginLink.textContent = `Welcome, ${currentUser.name}`;
        loginLink.onclick = (e) => {
            e.preventDefault();
            if (confirm('Do you want to logout?')) {
                logout();
            }
        };
    } else {
        loginLink.textContent = 'Login';
        loginLink.onclick = (e) => {
            e.preventDefault();
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        };
    }
}

// Show/Hide Message Function
function showMessage(message, type = 'success') {
    // Remove existing messages
    const existingMessage = document.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;

    const activeForm = loginForm.style.display === 'none' ? registerForm : loginForm;
    activeForm.insertBefore(messageDiv, activeForm.firstChild);

    // Auto remove message after 3 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 3000);
}

// Open modal when login link is clicked
if (loginLink) {
    loginLink.addEventListener('click', (e) => {
        e.preventDefault();
        const currentUser = getCurrentUser();
        if (currentUser) {
            if (confirm('Do you want to logout?')) {
                logout();
            }
        } else {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    });
}

// Close modal when X is clicked
if (closeModal) {
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        // Clear forms
        loginFormElement.reset();
        registerFormElement.reset();
        // Remove any messages
        const messages = document.querySelectorAll('.message');
        messages.forEach(msg => msg.remove());
    });
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        // Clear forms
        loginFormElement.reset();
        registerFormElement.reset();
        // Remove any messages
        const messages = document.querySelectorAll('.message');
        messages.forEach(msg => msg.remove());
    }
});

// Switch to register form
if (showRegister) {
    showRegister.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        // Remove any messages
        const messages = document.querySelectorAll('.message');
        messages.forEach(msg => msg.remove());
    });
}

// Switch to login form
if (showLogin) {
    showLogin.addEventListener('click', (e) => {
        e.preventDefault();
        registerForm.style.display = 'none';
        loginForm.style.display = 'block';
        // Remove any messages
        const messages = document.querySelectorAll('.message');
        messages.forEach(msg => msg.remove());
    });
}

// Handle login form submission
if (loginFormElement) {
    loginFormElement.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        const user = getUserByEmail(email);
        
        if (!user) {
            showMessage('User not found. Please register first.', 'error');
            return;
        }
        
        if (user.password !== password) {
            showMessage('Incorrect password.', 'error');
            return;
        }
        
        // Login successful
        setCurrentUser(user);
        showMessage('Login successful! Welcome back!', 'success');
        
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
            loginFormElement.reset();
            updateLoginButton();
        }, 1500);
    });
}

// Handle register form submission
if (registerFormElement) {
    registerFormElement.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm').value;
        
        if (password !== confirmPassword) {
            showMessage('Passwords do not match!', 'error');
            return;
        }
        
        if (password.length < 6) {
            showMessage('Password must be at least 6 characters long.', 'error');
            return;
        }
        
        // Check if user already exists
        const existingUser = getUserByEmail(email);
        if (existingUser) {
            showMessage('User with this email already exists.', 'error');
            return;
        }
        
        // Create new user
        const newUser = {
            name: name,
            email: email,
            password: password,
            registeredAt: new Date().toISOString()
        };
        
        saveUser(newUser);
        showMessage('Registration successful! Please login.', 'success');
        
        // Switch to login form and pre-fill email
        setTimeout(() => {
            registerForm.style.display = 'none';
            loginForm.style.display = 'block';
            document.getElementById('login-email').value = email;
            registerFormElement.reset();
        }, 1500);
    });
}

// Initialize Swiper for testimonials
if (typeof Swiper !== 'undefined') {
    const swiper = new Swiper('.swiper', {
        loop: true,
        autoplay: {
            delay: 5000,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
    });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        // Skip if it's the login link
        if (href === '#login') {
            return;
        }
        
        e.preventDefault();
        const targetElement = document.querySelector(href);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        if (navMenu) {
            document.body.classList.remove('show-mobile-menu');
            navMenu.classList.remove('active');
        }
    });
});

    // Initialize login button state on page load
    updateLoginButton();

    // Handle contact form submission
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = contactForm.querySelector('input[type="text"]').value;
            const email = contactForm.querySelector('input[type="email"]').value;
            const message = contactForm.querySelector('textarea').value;
            
            // Store contact form data in localStorage
            const contactData = {
                name: name,
                email: email,
                message: message,
                submittedAt: new Date().toISOString()
            };
            
            const contacts = JSON.parse(localStorage.getItem('contacts') || '[]');
            contacts.push(contactData);
            localStorage.setItem('contacts', JSON.stringify(contacts));
            
            // Show success message
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
        });
    }
});