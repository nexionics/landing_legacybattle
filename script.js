function scrollToSignup() {
    document.getElementById('signup').scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
}

function scrollToFeatures() {
    document.getElementById('features').scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signupForm');
    const emailInput = document.getElementById('email');
    const submitButton = signupForm.querySelector('.form-button');
    const buttonText = submitButton.querySelector('.button-text');
    const buttonLoading = submitButton.querySelector('.button-loading');
    const successMessage = document.getElementById('successMessage');
    
    signupForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        
        if (!email) {
            showError('Please enter your email address');
            return;
        }
        
        if (!isValidEmail(email)) {
            showError('Please enter a valid email address');
            return;
        }
        
        submitButton.disabled = true;
        buttonText.style.display = 'none';
        buttonLoading.style.display = 'inline';
        
        try {
            await simulateSignup(email);
            
            signupForm.style.display = 'none';
            successMessage.style.display = 'block';
            
            trackSignup(email);
            
        } catch (error) {
            console.error('Signup error:', error);
            showError('Something went wrong. Please try again.');
            
            submitButton.disabled = false;
            buttonText.style.display = 'inline';
            buttonLoading.style.display = 'none';
        }
    });
    
    emailInput.addEventListener('input', function() {
        clearError();
        
        const email = this.value.trim();
        if (email && !isValidEmail(email)) {
            this.style.borderColor = '#ff4444';
        } else {
            this.style.borderColor = 'rgba(255, 68, 68, 0.2)';
        }
    });
});

async function simulateSignup(email) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('Signup successful for:', email);
            resolve({ success: true });
        }, 2000);
    });
}

function showError(message) {
    clearError();
    
    const emailInput = document.getElementById('email');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.cssText = `
        color: #ff4444;
        font-size: 0.875rem;
        margin-top: 0.5rem;
        padding: 0.5rem;
        background: rgba(255, 68, 68, 0.1);
        border-radius: 8px;
        border: 1px solid rgba(255, 68, 68, 0.2);
    `;
    errorDiv.textContent = message;
    
    emailInput.parentNode.appendChild(errorDiv);
    emailInput.style.borderColor = '#ff4444';
    emailInput.focus();
}

function clearError() {
    const existingError = document.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    const emailInput = document.getElementById('email');
    emailInput.style.borderColor = 'rgba(255, 68, 68, 0.2)';
}

function trackSignup(email) {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'signup', {
            'event_category': 'engagement',
            'event_label': 'early_access',
            'value': 1
        });
    }
    
    if (typeof fbq !== 'undefined') {
        fbq('track', 'Lead');
    }
    
    console.log('Signup tracked for:', email);
}

document.addEventListener('DOMContentLoaded', function() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    const animatedElements = document.querySelectorAll('.feature-card, .step, .signup-content > *');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(10, 10, 10, 0.98)';
        header.style.boxShadow = '0 4px 20px rgba(255, 68, 68, 0.1)';
    } else {
        header.style.background = 'rgba(10, 10, 10, 0.95)';
        header.style.boxShadow = 'none';
    }
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && e.target.classList.contains('nav-link')) {
        e.target.click();
    }
});

function toggleMobileMenu() {
    const nav = document.querySelector('.nav');
    nav.classList.toggle('mobile-open');
}

const style = document.createElement('style');
style.textContent = `
    @media (max-width: 480px) {
        .nav {
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: rgba(10, 10, 10, 0.98);
            flex-direction: column;
            padding: 1rem;
            border-top: 1px solid rgba(255, 68, 68, 0.1);
        }
        
        .nav.mobile-open {
            display: flex;
        }
        
        .mobile-menu-toggle {
            display: block;
            background: none;
            border: none;
            color: #ffffff;
            font-size: 1.5rem;
            cursor: pointer;
        }
    }
    
    .mobile-menu-toggle {
        display: none;
    }
`;
document.head.appendChild(style);

function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

document.addEventListener('DOMContentLoaded', lazyLoadImages);
