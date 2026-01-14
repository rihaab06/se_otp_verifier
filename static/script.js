// Modal Functions
function openLogin() {
    document.getElementById('loginModal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
    resetLoginForm();
}

function closeLogin() {
    document.getElementById('loginModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function openRegister() {
    document.getElementById('registerModal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeRegister() {
    document.getElementById('registerModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Switch between modals
function switchToLogin() {
    closeRegister();
    setTimeout(openLogin, 300);
}

function switchToRegister() {
    closeLogin();
    setTimeout(openRegister, 300);
}

// Close modal when clicking outside
window.onclick = function(event) {
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    
    if (event.target === loginModal) {
        closeLogin();
    }
    
    if (event.target === registerModal) {
        closeRegister();
    }
}

// OTP Method Selection
let currentOTPMethod = 'email';

function selectOTPMethod(method) {
    currentOTPMethod = method;
    
    // Update UI for method selection
    const methodOptions = document.querySelectorAll('.method-option');
    methodOptions.forEach(option => {
        if (option.dataset.method === method) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });
    
    // Show/hide forms
    const emailForm = document.getElementById('emailOtpForm');
    const mobileForm = document.getElementById('mobileOtpForm');
    const otpVerification = document.getElementById('otpVerification');
    
    if (method === 'email') {
        emailForm.style.display = 'block';
        mobileForm.style.display = 'none';
    } else {
        emailForm.style.display = 'none';
        mobileForm.style.display = 'block';
    }
    
    // Hide OTP verification if it's showing
    otpVerification.style.display = 'none';
}

// Reset login form to initial state
function resetLoginForm() {
    selectOTPMethod('email');
    document.getElementById('loginEmail').value = '';
    document.getElementById('loginMobile').value = '';
    document.getElementById('otpCode').value = '';
}

// Send OTP via Email
function sendEmailOTP() {
    const email = document.getElementById('loginEmail').value.trim();
    
    if (!email) {
        alert('Please enter your email address');
        document.getElementById('loginEmail').focus();
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address');
        document.getElementById('loginEmail').focus();
        return;
    }
    
    // Show loading state
    const sendBtn = document.querySelector('#emailOtpForm .primary-btn');
    const originalText = sendBtn.innerHTML;
    sendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    sendBtn.disabled = true;
    
    // Simulate OTP sending (replace with actual API call)
    setTimeout(() => {
        sendBtn.innerHTML = originalText;
        sendBtn.disabled = false;
        
        // Show OTP verification form
        showOTPVerification();
        
        // Start resend timer
        startResendTimer();
        
        console.log(`OTP sent to email: ${email}`);
    }, 1500);
}

// Send OTP via Mobile
function sendMobileOTP() {
    const mobile = document.getElementById('loginMobile').value.trim();
    
    if (!mobile) {
        alert('Please enter your mobile number');
        document.getElementById('loginMobile').focus();
        return;
    }
    
    // Mobile number validation (simple check for at least 10 digits)
    const mobileRegex = /^[0-9]{10,}$/;
    if (!mobileRegex.test(mobile.replace(/\D/g, ''))) {
        alert('Please enter a valid mobile number (at least 10 digits)');
        document.getElementById('loginMobile').focus();
        return;
    }
    
    // Show loading state
    const sendBtn = document.querySelector('#mobileOtpForm .primary-btn');
    const originalText = sendBtn.innerHTML;
    sendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    sendBtn.disabled = true;
    
    // Simulate OTP sending (replace with actual API call)
    setTimeout(() => {
        sendBtn.innerHTML = originalText;
        sendBtn.disabled = false;
        
        // Show OTP verification form
        showOTPVerification();
        
        // Start resend timer
        startResendTimer();
        
        console.log(`OTP sent to mobile: ${mobile}`);
    }, 1500);
}

// Show OTP verification form
function showOTPVerification() {
    // Hide email/mobile forms
    document.getElementById('emailOtpForm').style.display = 'none';
    document.getElementById('mobileOtpForm').style.display = 'none';
    
    // Show OTP verification form
    const otpVerification = document.getElementById('otpVerification');
    otpVerification.style.display = 'block';
    
    // Update description
    const modalDescription = document.querySelector('#loginModal .modal-description');
    modalDescription.textContent = `Enter the 6-digit OTP sent to your ${currentOTPMethod === 'email' ? 'email' : 'mobile'}`;
    
    // Focus on OTP input
    setTimeout(() => {
        document.getElementById('otpCode').focus();
    }, 300);
}

// Verify OTP
function verifyOTP() {
    const otpCode = document.getElementById('otpCode').value.trim();
    
    if (!otpCode || otpCode.length !== 6) {
        alert('Please enter a valid 6-digit OTP code');
        document.getElementById('otpCode').focus();
        return;
    }
    
    // Show loading state
    const verifyBtn = document.querySelector('#otpVerification .primary-btn');
    const originalText = verifyBtn.innerHTML;
    verifyBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying...';
    verifyBtn.disabled = true;
    
    // Simulate OTP verification (replace with actual API call)
    setTimeout(() => {
        verifyBtn.innerHTML = originalText;
        verifyBtn.disabled = false;
        
        // Check if OTP is 123456 (demo success)
        if (otpCode === '123456') {
            alert('Login successful! Welcome to SecureGate.');
            closeLogin();
            
            // In a real app, you would redirect to dashboard
            // window.location.href = '/dashboard';
        } else {
            alert('Invalid OTP code. Please try again.');
            document.getElementById('otpCode').value = '';
            document.getElementById('otpCode').focus();
        }
    }, 1500);
}

// Resend OTP
function resendOTP() {
    const timerElement = document.getElementById('timer');
    if (timerElement && timerElement.textContent.includes('Resend in')) {
        alert('Please wait before requesting a new OTP');
        return;
    }
    
    if (currentOTPMethod === 'email') {
        sendEmailOTP();
    } else {
        sendMobileOTP();
    }
}

// Start resend timer (30 seconds)
function startResendTimer() {
    let timeLeft = 30;
    const timerElement = document.getElementById('timer');
    const resendLink = document.querySelector('.resend-otp a');
    
    if (!timerElement) return;
    
    // Disable resend link initially
    resendLink.style.pointerEvents = 'none';
    resendLink.style.opacity = '0.5';
    
    const timerInterval = setInterval(() => {
        timerElement.textContent = `(Resend in ${timeLeft}s)`;
        timeLeft--;
        
        if (timeLeft < 0) {
            clearInterval(timerInterval);
            timerElement.textContent = '';
            resendLink.style.pointerEvents = 'auto';
            resendLink.style.opacity = '1';
        }
    }, 1000);
}

// Form validation for registration
function submitRegistration() {
    const name = document.getElementById('regName').value.trim();
    const date = document.getElementById('regDate').value;
    const city = document.getElementById('regCity').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const mobile = document.getElementById('regMobile').value.trim();
    const terms = document.querySelector('#registerModal #terms');
    
    // Validation checks
    if (!name) {
        alert('Please enter your full name');
        document.getElementById('regName').focus();
        return;
    }
    
    if (!date) {
        alert('Please select your date of birth');
        document.getElementById('regDate').focus();
        return;
    }
    
    if (!city) {
        alert('Please enter your city');
        document.getElementById('regCity').focus();
        return;
    }
    
    if (!email) {
        alert('Please enter your email address');
        document.getElementById('regEmail').focus();
        return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address');
        document.getElementById('regEmail').focus();
        return;
    }
    
    if (!mobile) {
        alert('Please enter your mobile number');
        document.getElementById('regMobile').focus();
        return;
    }
    
    const mobileRegex = /^[0-9]{10,}$/;
    if (!mobileRegex.test(mobile.replace(/\D/g, ''))) {
        alert('Please enter a valid mobile number (at least 10 digits)');
        document.getElementById('regMobile').focus();
        return;
    }
    
    if (!terms.checked) {
        alert('Please agree to the Terms of Service and Privacy Policy');
        terms.focus();
        return;
    }
    
    // Show loading state
    const registerBtn = document.querySelector('#registerModal .primary-btn');
    const originalText = registerBtn.innerHTML;
    registerBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
    registerBtn.disabled = true;
    
    // Simulate registration process (replace with actual API call)
    setTimeout(() => {
        registerBtn.innerHTML = originalText;
        registerBtn.disabled = false;
        
        alert('Registration successful! Please check your email for verification.');
        closeRegister();
        
        // Reset form
        document.getElementById('regName').value = '';
        document.getElementById('regDate').value = '';
        document.getElementById('regCity').value = '';
        document.getElementById('regEmail').value = '';
        document.getElementById('regMobile').value = '';
        terms.checked = false;
    }, 2000);
}

// Add visual feedback for inputs
document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('.modern-input');
    
    inputs.forEach(input => {
        // Add focus effect
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'translateY(-2px)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'translateY(0)';
        });
        
        // Add floating label effect for date input
        if (input.type === 'date') {
            input.addEventListener('change', function() {
                if (this.value) {
                    this.style.color = '#1e293b';
                } else {
                    this.style.color = '';
                }
            });
        }
        
        // Auto-format mobile number input
        if (input.type === 'tel' || input.id === 'loginMobile' || input.id === 'regMobile') {
            input.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 0) {
                    value = value.match(/.{1,4}/g).join(' ');
                }
                e.target.value = value;
            });
        }
        
        // Auto-advance for OTP input
        if (input.id === 'otpCode') {
            input.addEventListener('input', function(e) {
                // Remove non-numeric characters
                this.value = this.value.replace(/\D/g, '');
                
                // Limit to 6 digits
                if (this.value.length > 6) {
                    this.value = this.value.slice(0, 6);
                }
                
                // Auto-submit when 6 digits are entered
                if (this.value.length === 6) {
                    verifyOTP();
                }
            });
        }
    });
    
    // Animate OTP code in the visual card
    const otpDigits = document.querySelectorAll('.otp-code span');
    if (otpDigits.length > 0) {
        let counter = 0;
        const animateOTP = () => {
            otpDigits.forEach((digit, index) => {
                setTimeout(() => {
                    digit.style.transform = 'scale(1.2)';
                    digit.style.boxShadow = '0 8px 20px rgba(59, 130, 246, 0.5)';
                    
                    setTimeout(() => {
                        digit.style.transform = 'scale(1)';
                        digit.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
                    }, 200);
                }, index * 100);
            });
            
            counter++;
            if (counter < 3) {
                setTimeout(animateOTP, 3000);
            }
        };
        
        // Start animation after a delay
        setTimeout(animateOTP, 1000);
    }
    
    // Add subtle animation to feature cards on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe feature cards and steps
    document.querySelectorAll('.feature-card, .step').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(element);
    });
    
    // Initialize date input to show placeholder properly
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        if (!input.value) {
            input.style.color = '#94a3b8';
        }
    });
});


// ===== DARK MODE FUNCTIONALITY =====

// Theme toggle functionality
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const body = document.body;
    
    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    // Apply saved theme
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    } else {
        body.classList.remove('dark-mode');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }
    
    // Toggle theme on button click
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        
        if (body.classList.contains('dark-mode')) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
            localStorage.setItem('theme', 'dark');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
            localStorage.setItem('theme', 'light');
        }
    });
    
    // Also toggle modals when theme changes
    const updateModalThemes = () => {
        const modals = document.querySelectorAll('.modal-content');
        modals.forEach(modal => {
            if (body.classList.contains('dark-mode')) {
                modal.classList.add('dark-modal');
            } else {
                modal.classList.remove('dark-modal');
            }
        });
    };
    
    // Observe theme changes
    const observer = new MutationObserver(updateModalThemes);
    observer.observe(body, { attributes: true, attributeFilter: ['class'] });
}

// Initialize theme when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Existing DOMContentLoaded code...
    
    // Add theme initialization
    initTheme();
    
    // Rest of your existing DOMContentLoaded code...
    
    // Animate OTP code in the visual card
    const otpDigits = document.querySelectorAll('.otp-code span');
    if (otpDigits.length > 0) {
        let counter = 0;
        const animateOTP = () => {
            otpDigits.forEach((digit, index) => {
                setTimeout(() => {
                    digit.style.transform = 'scale(1.2)';
                    digit.style.boxShadow = '0 8px 20px rgba(59, 130, 246, 0.5)';
                    
                    setTimeout(() => {
                        digit.style.transform = 'scale(1)';
                        digit.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
                    }, 200);
                }, index * 100);
            });
            
            counter++;
            if (counter < 3) {
                setTimeout(animateOTP, 3000);
            }
        };
        
        // Start animation after a delay
        setTimeout(animateOTP, 1000);
    }
    
    // Add subtle animation to feature cards on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe feature cards and steps
    document.querySelectorAll('.feature-card, .step').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(element);
    });
    
    // Initialize date input to show placeholder properly
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        if (!input.value) {
            input.style.color = '#94a3b8';
        }
    });
});