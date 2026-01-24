// ===== DARK MODE FUNCTIONALITY =====

function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const body = document.body;
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('otpPageTheme') || 'light';
    
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
            localStorage.setItem('otpPageTheme', 'dark');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
            localStorage.setItem('otpPageTheme', 'light');
        }
    });
}

// ===== CONTACT INFO MANAGEMENT =====

function initContactInfo() {
    // Get contact info from URL parameters or use defaults
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email') || 'user@example.com';
    const mobile = urlParams.get('mobile') || '+1 (234) 567-8900';
    const method = urlParams.get('method') || 'email'; // 'email' or 'mobile'
    
    // Store full contact info
    window.contactInfo = {
        email: email,
        mobile: mobile,
        method: method
    };
    
    // Mask the contact info
    function maskEmail(email) {
        const [username, domain] = email.split('@');
        const maskedUsername = username.length > 2 
            ? username.charAt(0) + '*'.repeat(username.length - 2) + username.charAt(username.length - 1)
            : '*'.repeat(username.length);
        return `${maskedUsername}@${domain}`;
    }
    
    function maskMobile(mobile) {
        // Remove non-digits
        const digits = mobile.replace(/\D/g, '');
        // Keep last 4 digits, mask the rest
        if (digits.length >= 4) {
            const lastFour = digits.slice(-4);
            const masked = '*'.repeat(Math.max(0, digits.length - 4));
            return `${masked}${lastFour}`;
        }
        return mobile;
    }
    
    // Update masked display
    function updateMaskedDisplay() {
        const maskedElement = document.getElementById('maskedContactInfo');
        const typeBadge = document.getElementById('otpTypeBadge');
        const fullEmailElement = document.getElementById('fullEmail');
        const fullMobileElement = document.getElementById('fullMobile');
        
        if (window.contactInfo.method === 'email') {
            // Mask email
            const maskedEmail = maskEmail(window.contactInfo.email);
            maskedElement.textContent = maskedEmail;
            maskedElement.style.fontFamily = "'Courier New', monospace";
            
            // Update type badge
            typeBadge.innerHTML = '<i class="fas fa-envelope"></i><span>Email</span>';
            
            // Update full contact info
            if (fullEmailElement) fullEmailElement.textContent = window.contactInfo.email;
            if (fullMobileElement) fullMobileElement.textContent = window.contactInfo.mobile;
        } else {
            // Mask mobile
            const maskedMobile = maskMobile(window.contactInfo.mobile);
            maskedElement.textContent = maskedMobile;
            maskedElement.style.fontFamily = "'Courier New', monospace";
            
            // Update type badge
            typeBadge.innerHTML = '<i class="fas fa-mobile-alt"></i><span>SMS</span>';
            
            // Update full contact info
            if (fullEmailElement) fullEmailElement.textContent = window.contactInfo.email;
            if (fullMobileElement) fullMobileElement.textContent = window.contactInfo.mobile;
        }
    }
    
    // Toggle between masked and full contact info
    const showContactBtn = document.getElementById('showContactBtn');
    const changeContactBtn = document.getElementById('changeContactBtn');
    const fullContactInfo = document.getElementById('fullContactInfo');
    
    if (showContactBtn) {
        showContactBtn.addEventListener('click', () => {
            showContactBtn.style.display = 'none';
            changeContactBtn.style.display = 'inline-flex';
            fullContactInfo.style.display = 'block';
        });
    }
    
    if (changeContactBtn) {
        changeContactBtn.addEventListener('click', () => {
            // Toggle between email and mobile
            window.contactInfo.method = window.contactInfo.method === 'email' ? 'mobile' : 'email';
            updateMaskedDisplay();
            
            // Show notification
            const methodName = window.contactInfo.method === 'email' ? 'Email' : 'SMS';
            showNotification(`OTP will be sent via ${methodName} next time`, 'info');
        });
    }
    
    // Initialize
    updateMaskedDisplay();
}

// ===== OTP INPUT HANDLING =====

function initOTPInputs() {
    const otpDigits = document.querySelectorAll('.otp-digit');
    const verifyBtn = document.getElementById('verifyBtn');
    
    // Focus first input on load
    otpDigits[0].focus();
    
    // Handle input
    otpDigits.forEach((digit, index) => {
        digit.addEventListener('input', (e) => {
            const value = e.target.value;
            
            // Only allow numbers
            if (!/^\d*$/.test(value)) {
                e.target.value = '';
                return;
            }
            
            // Auto-focus next input
            if (value && index < otpDigits.length - 1) {
                otpDigits[index + 1].focus();
            }
            
            // Update filled state
            updateFilledState();
            
            // Check if all digits are filled
            checkOTPComplete();
        });
        
        // Handle backspace
        digit.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !digit.value && index > 0) {
                otpDigits[index - 1].focus();
                otpDigits[index - 1].value = '';
                updateFilledState();
                checkOTPComplete();
            }
        });
        
        // Handle paste
        digit.addEventListener('paste', (e) => {
            e.preventDefault();
            const pastedData = e.clipboardData.getData('text').trim();
            
            if (/^\d{6}$/.test(pastedData)) {
                // Fill all inputs with pasted OTP
                pastedData.split('').forEach((char, i) => {
                    if (otpDigits[i]) {
                        otpDigits[i].value = char;
                        otpDigits[i].classList.add('filled');
                    }
                });
                
                // Focus last input
                otpDigits[Math.min(pastedData.length - 1, 5)].focus();
                
                // Check if complete
                checkOTPComplete();
                updateFilledState();
            }
        });
    });
    
    // Update filled state styling
    function updateFilledState() {
        otpDigits.forEach(digit => {
            if (digit.value) {
                digit.classList.add('filled');
            } else {
                digit.classList.remove('filled');
            }
        });
    }
    
    // Check if OTP is complete
    function checkOTPComplete() {
        const otpCode = Array.from(otpDigits).map(d => d.value).join('');
        const isComplete = otpCode.length === 6 && /^\d{6}$/.test(otpCode);
        
        if (verifyBtn) {
            verifyBtn.disabled = !isComplete;
            verifyBtn.title = isComplete ? 'Click to verify OTP' : 'Enter 6-digit OTP first';
        }
        
        return isComplete;
    }
}

// ===== TIMER FUNCTIONALITY =====

function initTimer() {
    let timeLeft = 30; // 30 seconds
    const timerElement = document.getElementById('resendTimer');
    const resendBtn = document.getElementById('resendBtn');
    
    if (!timerElement || !resendBtn) return;
    
    // Disable resend button initially
    resendBtn.disabled = true;
    
    const timerInterval = setInterval(() => {
        timeLeft--;
        timerElement.textContent = `(${timeLeft}s)`;
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timerElement.textContent = '';
            resendBtn.disabled = false;
            resendBtn.innerHTML = '<i class="fas fa-redo"></i> Resend OTP';
        }
    }, 1000);
    
    // Resend button click handler
    resendBtn.addEventListener('click', () => {
    if (resendBtn.disabled) return;

    resendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Resending...';
    resendBtn.disabled = true;

    const params = new URLSearchParams(window.location.search);
    const email = params.get('email');

    fetch('/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ email })
    })
    .then(res => {
        if (res.redirected) {
            window.location.href = res.url;
        } else {
            throw new Error();
        }
    })
    .catch(() => {
        showNotification('Failed to resend OTP', 'error');
        resendBtn.disabled = false;
        resendBtn.innerHTML = '<i class="fas fa-redo"></i> Resend OTP';
    });
});

}

// ===== DEMO OTP FUNCTIONALITY =====


// ===== BUTTON HANDLERS =====

function initButtonHandlers() {
    // Verify Button
    const verifyBtn = document.getElementById('verifyBtn');
    if (verifyBtn) {
        verifyBtn.addEventListener('click', verifyOTP);
    }
    
    // Back Button
    const backBtn = document.getElementById('backBtn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.location.href = '/#login';
        });
    }
    
    // Support Button
    const supportBtn = document.getElementById('supportBtn');
    if (supportBtn) {
        supportBtn.addEventListener('click', () => {
            alert('Need help? Contact support@securegate.com or call 1-800-OTP-HELP\n\nCurrent contact method: ' + 
                  (window.contactInfo.method === 'email' ? window.contactInfo.email : window.contactInfo.mobile));
        });
    }
}

// ===== OTP VERIFICATION =====

function verifyOTP() {
    const otpDigits = document.querySelectorAll('.otp-digit');
    const otpCode = Array.from(otpDigits).map(d => d.value).join('');
    const verifyBtn = document.getElementById('verifyBtn');

    if (otpCode.length !== 6 || !/^\d{6}$/.test(otpCode)) {
        showNotification('Please enter a valid 6-digit OTP', 'error');
        return;
    }

    const params = new URLSearchParams(window.location.search);
    const email = params.get('email');

    if (!email) {
        showNotification('Email missing. Please login again.', 'error');
        return;
    }

    verifyBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying...';
    verifyBtn.disabled = true;

    fetch('/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            email: email,
            otp: otpCode
        })
    })
    .then(res => {
        if (res.redirected) {
            window.location.href = res.url; // → /dashboard
        } else {
            throw new Error('Invalid OTP');
        }
    })
    .catch(() => {
        showNotification('❌ Invalid OTP. Please try again.', 'error');

        otpDigits.forEach(d => {
            d.value = '';
            d.classList.remove('filled');
        });

        otpDigits[0].focus();
        verifyBtn.innerHTML = '<i class="fas fa-shield-check"></i> Verify OTP';
        verifyBtn.disabled = true;
    });
}


// ===== NOTIFICATION SYSTEM =====

function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        left: 50%;
        transform: translateX(-50%);
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        padding: 15px 25px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        gap: 10px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: slideDown 0.3s ease;
        backdrop-filter: blur(10px);
    `;
    
    // Add shake animation for error
    if (type === 'error') {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                20%, 40%, 60%, 80% { transform: translateX(5px); }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 3000);
}

// ===== INITIALIZATION =====

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
    initTheme();
    initContactInfo();
    initOTPInputs();
    initTimer();
    initExpiryTimer();
    
    initButtonHandlers();
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.target.classList.contains('otp-digit')) {
            const verifyBtn = document.getElementById('verifyBtn');
            if (verifyBtn && !verifyBtn.disabled) {
                verifyBtn.click();
            }
        }
        if (e.key === 'Escape') {
            window.location.href = '/';
        }
        if (e.key === 'r' || e.key === 'R') {
            if (e.ctrlKey) {
                const resendBtn = document.getElementById('resendBtn');
                if (resendBtn && !resendBtn.disabled) {
                    resendBtn.click();
                }
            }
        }
    });


});

// ===== EXPIRY TIMER =====
function initExpiryTimer() {
    let minutes = 5;
    let seconds = 0;
    const expiryElement = document.getElementById('expiryTime');
    if (!expiryElement) return;

    setInterval(() => {
        if (seconds === 0) {
            if (minutes === 0) return;
            minutes--;
            seconds = 59;
        } else {
            seconds--;
        }
        expiryElement.textContent =
            `${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`;
    }, 1000);
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
    initTheme();
    initContactInfo();
    initOTPInputs();
    initTimer();
    initExpiryTimer(); // now this is safe

    initButtonHandlers();

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.target.classList.contains('otp-digit')) {
            const verifyBtn = document.getElementById('verifyBtn');
            if (verifyBtn && !verifyBtn.disabled) verifyBtn.click();
        }
        if (e.key === 'Escape') {
            window.location.href = '/';
        }
        if ((e.key === 'r' || e.key === 'R') && e.ctrlKey) {
            const resendBtn = document.getElementById('resendBtn');
            if (resendBtn && !resendBtn.disabled) resendBtn.click();
        }
    });
});
