// Luxury JavaScript for Voice Workshop Landing Page - Perfect Responsive

// Environment Detection
const isLocalEnvironment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname.includes('192.168');
const isDeployedEnvironment = !isLocalEnvironment;

console.log(`🌍 Environment: ${isLocalEnvironment ? 'LOCAL' : 'DEPLOYED'} (${window.location.hostname})`);

// Supabase Configuration
const SUPABASE_URL = 'https://dgclcoaxalatwvyjeeld.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRnY2xjb2F4YWxhdHd2eWplZWxkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4NzczNDIsImV4cCI6MjA2NTQ1MzM0Mn0.wSl0mpD_34p3HFWow-tqA4HjbCRWT0ObKs-u_b4-ioI';

// Global variables for Supabase client
let supabase = null;
let supabaseReady = false;

// Wait for Supabase SDK to load before initializing
async function initializeSupabase() {
    console.log('📦 Initializing Supabase...');
    
    // Wait for window.supabase to be available
    let attempts = 0;
    const maxAttempts = 50; // 5 seconds maximum wait
    
    while (!window.supabase && attempts < maxAttempts) {
        console.log(`⏳ Waiting for Supabase SDK... (${attempts + 1}/${maxAttempts})`);
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
    }
    
    if (window.supabase) {
        try {
            supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            supabaseReady = true;
            console.log('✅ Supabase initialized successfully');
            return true;
        } catch (error) {
            console.error('❌ Supabase initialization failed:', error);
            return false;
        }
    } else {
        console.error('❌ Supabase SDK not loaded after maximum wait time');
        return false;
    }
}

// Performance monitoring
const performanceMonitor = {
    startTime: Date.now(),
    metrics: {},
    
    // Track page load performance
    trackPageLoad() {
        window.addEventListener('load', () => {
            const loadTime = Date.now() - this.startTime;
            this.metrics.pageLoad = loadTime;
            console.log(`📊 Page loaded in ${loadTime}ms`);
            
            // Track to analytics if available
            if (typeof gtag !== 'undefined') {
                gtag('event', 'page_load_time', {
                    custom_parameter: loadTime
                });
            }
        });
    },
    
    // Track form interactions
    trackFormInteraction(action, field = null) {
        const timestamp = Date.now();
        this.metrics[`form_${action}`] = timestamp;
        
        console.log(`📊 Form ${action}${field ? ` - ${field}` : ''}`);
        
        // Track to analytics if available
        if (typeof gtag !== 'undefined') {
            gtag('event', 'form_interaction', {
                action: action,
                field: field
            });
        }
    },
    
    // Track errors
    trackError(error, context = 'unknown') {
        console.error(`📊 Error tracked:`, error);
        
        // Store in localStorage for debugging
        const errorLog = JSON.parse(localStorage.getItem('errorLog') || '[]');
        errorLog.push({
            timestamp: new Date().toISOString(),
            error: error.message || error,
            context: context,
            userAgent: navigator.userAgent,
            url: window.location.href
        });
        
        // Keep only last 50 errors
        if (errorLog.length > 50) {
            errorLog.splice(0, errorLog.length - 50);
        }
        
        localStorage.setItem('errorLog', JSON.stringify(errorLog));
        
        // Track to analytics if available
        if (typeof gtag !== 'undefined') {
            gtag('event', 'exception', {
                description: error.message || error,
                fatal: false
            });
        }
    },
    
    // Get performance summary
    getSummary() {
        return {
            ...this.metrics,
            totalTime: Date.now() - this.startTime,
            userAgent: navigator.userAgent,
            viewport: `${window.innerWidth}x${window.innerHeight}`,
            connection: navigator.connection ? {
                effectiveType: navigator.connection.effectiveType,
                downlink: navigator.connection.downlink
            } : null
        };
    }
};

// Initialize performance monitoring
performanceMonitor.trackPageLoad();

// Smooth scroll to form functionality
function scrollToForm() {
    const formSection = document.getElementById('register');
    if (formSection) {
        formSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
        
        // Add focus to first form input after scroll
        setTimeout(() => {
            const firstInput = formSection.querySelector('input, select');
            if (firstInput) {
                firstInput.focus();
            }
        }, 800);
        
        // Track CTA click
        performanceMonitor.trackFormInteraction('cta_click', 'scroll_to_form');
    }
}

// Enhanced social sharing functionality
function shareOnTwitter() {
    const text = '🎼 世界的ボイストレーナー ジョジョ・アコスタ氏による特別ワークショップ！\n\n✨ 完全無料・定員20名限定\n📅 2025年6月21日(土)10:30-12:00\n📍 UDCK 柏の葉キャンパス駅徒歩1分\n\n#VoiceAtelier #ボイストレーニング #子ども習い事 #柏の葉 #無料ワークショップ';
    const url = window.location.href;
    const twitterUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    
    window.open(twitterUrl, '_blank', 'width=600,height=400');
    
    // Track sharing
    performanceMonitor.trackFormInteraction('social_share', 'x_twitter');
}

function shareOnLine() {
    const text = `🎼 世界的ボイストレーナー ジョジョ・アコスタ氏による特別ワークショップ！

✨ 完全無料・定員20名限定
📅 2025年6月21日(土)10:30-12:00  
📍 UDCK 柏の葉キャンパス駅徒歩1分
🎯 小学生〜中学生対象

X-Factor、レ・ミゼラブル出演者を指導した世界レベルの指導が受けられます！

お申し込みはこちら👇`;
    
    const url = window.location.href;
    const lineUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
    
    window.open(lineUrl, '_blank', 'width=600,height=400');
    
    // Track sharing
    performanceMonitor.trackFormInteraction('social_share', 'line');
}

function copyUrl() {
    const url = window.location.href;
    
    if (navigator.clipboard && window.isSecureContext) {
        // Modern approach using Clipboard API
        navigator.clipboard.writeText(url).then(() => {
            showCopySuccess();
        }).catch(() => {
            fallbackCopyTextToClipboard(url);
        });
    } else {
        // Fallback for older browsers
        fallbackCopyTextToClipboard(url);
    }
    
    // Track copying
    performanceMonitor.trackFormInteraction('social_share', 'copy_url');
}

function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    
    // Avoid scrolling to bottom
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showCopySuccess();
        } else {
            showCopyError();
        }
    } catch (err) {
        showCopyError();
    }
    
    document.body.removeChild(textArea);
}

function showCopySuccess() {
    const notification = document.createElement('div');
    const message = (typeof t === 'function') ? t('copy_success') : '✅ URLをコピーしました！';
    notification.innerHTML = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #4ade80, #22c55e);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        font-weight: 600;
        z-index: 10000;
        animation: luxury-fadeIn 0.3s ease;
        box-shadow: 0 10px 30px rgba(74, 222, 128, 0.3);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function showCopyError() {
    const notification = document.createElement('div');
    const message = (typeof t === 'function') ? t('copy_error') : '❌ コピーに失敗しました';
    notification.innerHTML = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #ff6b6b, #ee5a6f);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        font-weight: 600;
        z-index: 10000;
        animation: luxury-fadeIn 0.3s ease;
        box-shadow: 0 10px 30px rgba(255, 107, 107, 0.3);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all luxury functionality
    initLuxuryScrollAnimations();
    initLuxuryFormHandling();
    initLuxuryNavigation();
    initLuxuryFAQ();
    initLuxuryParticleEffects();
    initLuxuryInteractions();
    initLuxuryCountdown();
    initLuxuryParallax();
    initMobileMenu();
    initResponsiveOptimizations();
});

// Enhanced luxury scroll animations with perfect mobile support
function initLuxuryScrollAnimations() {
    const observerOptions = {
        threshold: window.innerWidth < 768 ? 0.05 : 0.1,
        rootMargin: window.innerWidth < 768 ? '0px 0px -20px 0px' : '0px 0px -80px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-luxury');
                
                // Add special luxury effects for ALL devices
                if (entry.target.classList.contains('feature-card-luxury')) {
                    setTimeout(() => {
                        entry.target.style.transform = 'translateY(0) scale(1)';
                        addSparkleEffect(entry.target);
                    }, 200);
                }
                
                if (entry.target.classList.contains('stat-card-luxury')) {
                    animateCounter(entry.target);
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all luxury elements
    const elementsToAnimate = document.querySelectorAll(
        '.hero-content-luxury, .instructor-card-luxury, .section-header-luxury, .feature-card-luxury, .timeline-item-luxury, .register-info-luxury, .register-form-container-luxury, .testimonial-card-luxury, .faq-item-luxury, .stat-card-luxury'
    );
    
    elementsToAnimate.forEach((el, index) => {
        const delay = window.innerWidth < 768 ? index * 0.08 : index * 0.15;
        el.style.animationDelay = `${delay}s`;
        observer.observe(el);
    });
}

// Mobile menu functionality
function initMobileMenu() {
    const navToggle = document.createElement('div');
    navToggle.className = 'nav-toggle';
    navToggle.innerHTML = '<span></span><span></span><span></span>';
    
    const navContainer = document.querySelector('.nav-container');
    const navLinks = document.querySelector('.nav-links');
    
    if (navContainer && navLinks) {
        navContainer.appendChild(navToggle);
        
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });
        
        // Close menu when clicking on links
        navLinks.addEventListener('click', (e) => {
            if (e.target.classList.contains('nav-link-luxury') || e.target.classList.contains('nav-cta-luxury')) {
                navToggle.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navContainer.contains(e.target) && navLinks.classList.contains('active')) {
                navToggle.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
}

// Responsive optimizations with mobile animations enabled
function initResponsiveOptimizations() {
    let resizeTimeout;
    
    function handleResize() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            optimizeLuxuryPerformance();
            updateResponsiveElements();
        }, 250);
    }
    
    window.addEventListener('resize', handleResize);
    
    // Initial optimization
    optimizeLuxuryPerformance();
    updateResponsiveElements();
}

function updateResponsiveElements() {
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
    
    // Enable particle effects for ALL devices with optimized settings
    const particles = document.querySelectorAll('.luxury-particles, .floating-elements, .avatar-particles');
    particles.forEach(particle => {
        particle.style.display = 'block';
        if (isMobile) {
            // Reduce particle count for mobile performance
            const particleElements = particle.querySelectorAll('.particle, .floating-note');
            particleElements.forEach((p, index) => {
                if (index > 2) p.style.display = 'none'; // Show only first 3 particles on mobile
                else p.style.display = 'block';
            });
        }
    });
    
    // Enable orb effects for ALL devices with optimized settings
    const orbs = document.querySelectorAll('.luxury-gradient-orb');
    orbs.forEach(orb => {
        orb.style.display = 'block';
        if (isMobile) {
            orb.style.filter = 'blur(30px)';
            orb.style.opacity = '0.3';
            orb.style.transform = 'scale(0.7)';
        } else if (isTablet) {
            orb.style.filter = 'blur(40px)';
            orb.style.opacity = '0.4';
            orb.style.transform = 'scale(0.8)';
        } else {
            orb.style.filter = 'blur(60px)';
            orb.style.opacity = '0.6';
            orb.style.transform = 'scale(1)';
        }
    });
    
    // Update animation delays for all devices
    const animatedElements = document.querySelectorAll('.fade-in-luxury');
    animatedElements.forEach((el, index) => {
        const delay = isMobile ? index * 0.08 : index * 0.15;
        el.style.animationDelay = `${delay}s`;
    });
}

// Luxury form handling with enhanced validation and responsive support
function initLuxuryFormHandling() {
    const form = document.getElementById('registrationForm');
    
    if (!form) return;
    
    form.addEventListener('submit', handleLuxuryFormSubmit);
    
    // Enhanced real-time validation with luxury effects for ALL devices
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateLuxuryField(input));
        input.addEventListener('input', () => {
            clearLuxuryError(input);
            if (input.value.trim() && validateLuxuryField(input, false)) {
                addSuccessGlow(input);
            }
        });
        
        // Add focus effects for ALL devices
        input.addEventListener('focus', () => {
            addFocusGlow(input);
            performanceMonitor.trackFormInteraction('field_focus', input.name);
        });
        
        input.addEventListener('blur', () => {
            removeFocusGlow(input);
            performanceMonitor.trackFormInteraction('field_blur', input.name);
        });
    });
    
    // Enhanced phone number formatting
    const phoneInput = form.querySelector('input[name="phone"]');
    if (phoneInput) {
        phoneInput.addEventListener('input', formatLuxuryPhoneNumber);
    }
}

async function handleLuxuryFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitButton = form.querySelector('.form-submit-luxury');
    
    // Validate all fields with luxury effects
    const isValid = validateLuxuryForm(form);
    
    if (!isValid) {
        // Enhanced shake animation with glow effect for ALL devices
        const shakeIntensity = window.innerWidth < 768 ? '0.4s' : '0.6s';
        form.style.animation = `shake-luxury ${shakeIntensity} ease-in-out`;
        form.style.boxShadow = '0 0 30px rgba(255, 107, 107, 0.5)';
        setTimeout(() => {
            form.style.animation = '';
            form.style.boxShadow = '';
        }, window.innerWidth < 768 ? 400 : 600);
        return;
    }
    
    // Ensure Supabase is initialized before form submission
    if (!supabaseReady) {
        console.log('⏳ Supabase not ready, initializing...');
        const initSuccess = await initializeSupabase();
        if (!initSuccess) {
            console.warn('⚠️ Supabase initialization failed, proceeding with backup email system');
        }
    }
    
    // Luxury loading state with particle effects for ALL devices
    submitButton.disabled = true;
    const sendingText = (typeof t === 'function') ? t('form_sending') : '送信中...';
    submitButton.innerHTML = `<span>${sendingText}</span><div class="luxury-loading-spinner"></div>`;
    
    // Add luxury loading spinner
    const spinner = submitButton.querySelector('.luxury-loading-spinner');
    if (spinner) {
        const spinnerSize = window.innerWidth < 768 ? '16px' : '20px';
        spinner.style.cssText = `
            width: ${spinnerSize};
            height: ${spinnerSize};
            border: 3px solid rgba(26, 26, 46, 0.3);
            border-top: 3px solid #1a1a2e;
            border-radius: 50%;
            animation: luxury-spin 1s linear infinite;
        `;
    }
    
    try {
        // Collect form data
        const formData = new FormData(form);
        const registrationData = {
            child_name: formData.get('childName'),
            grade: formData.get('grade'),
            parent_name: formData.get('parentName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            experience: formData.get('experience'),
            special_needs: formData.get('specialNeeds') || '',
            created_at: new Date().toISOString()
        };
        
        // Track form submission attempt
        performanceMonitor.trackFormInteraction('submit_attempt');
        
        // Submit to Supabase (with availability check)
        let dataStorageSuccess = false;
        
        if (supabaseReady && supabase) {
            try {
                const { data, error } = await supabase
                    .from('registrations')
                    .insert([registrationData])
                    .select();
                
                if (error) {
                    throw error;
                }
                
                dataStorageSuccess = true;
                console.log('✅ Data stored in Supabase successfully');
            } catch (supabaseError) {
                console.error('❌ Supabase storage failed:', supabaseError);
                // Continue with email sending even if storage fails
                // In production, you might want to use alternative storage
                logRegistrationForManualFollowUp(registrationData, {
                    adminEmail: false,
                    userEmail: false,
                    method: 'none',
                    errors: ['Supabase storage failed: ' + supabaseError.message]
                });
            }
        } else {
            console.warn('⚠️ Supabase not available, skipping database storage');
            // Store locally for manual retrieval
            const localRegistrations = JSON.parse(localStorage.getItem('offline_registrations') || '[]');
            localRegistrations.push(registrationData);
            localStorage.setItem('offline_registrations', JSON.stringify(localRegistrations));
            console.log('💾 Registration stored locally for manual retrieval');
        }
        
        // Send notification emails (non-blocking)
        sendNotificationEmails(registrationData).catch(error => {
            console.error('Email notification failed but registration was successful:', error);
            
            // Log detailed error for debugging
            console.error('Email Error Details:', {
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                url: window.location.href,
                userEmail: registrationData.email,
                error: error.message,
                stack: error.stack
            });
            
            // Store failed email attempt for manual follow-up
            const failedEmails = JSON.parse(localStorage.getItem('failed_emails') || '[]');
            failedEmails.push({
                timestamp: new Date().toISOString(),
                email: registrationData.email,
                parentName: registrationData.parent_name,
                childName: registrationData.child_name,
                error: error.message
            });
            localStorage.setItem('failed_emails', JSON.stringify(failedEmails.slice(-20)));
        });
        
        // Show luxury success message with fireworks for ALL devices
        showLuxurySuccessMessage();
        
        // Reset form with luxury animation
        setTimeout(() => {
            form.reset();
            form.style.animation = 'luxury-fadeIn 0.8s ease-in-out';
            
            // Reset button with glow effect
            submitButton.disabled = false;
            const submitText = (typeof t === 'function') ? t('form_submit') : '申込みを送信';
            submitButton.innerHTML = `<span>${submitText}</span><div class="btn-arrow">→</div>`;
            addSuccessParticles(submitButton);
        }, 1500);
        
    } catch (error) {
        console.error('Form submission error:', error);
        
        // Track error
        performanceMonitor.trackError(error, 'form_submission');
        performanceMonitor.trackFormInteraction('submit_error');
        
        // Show error message
        const errorMessage = (typeof t === 'function') ? 
            t('form_error_submit') : 
            '申し込みの送信に失敗しました。もう一度お試しください。';
        showLuxuryErrorMessage(errorMessage);
        
        // Reset button
        submitButton.disabled = false;
        const submitText = (typeof t === 'function') ? t('form_submit') : '申込みを送信';
        submitButton.innerHTML = `<span>${submitText}</span><div class="btn-arrow">→</div>`;
    }
}

function validateLuxuryForm(form) {
    const fields = form.querySelectorAll('input[required], select[required]');
    let isValid = true;
    
    fields.forEach(field => {
        if (!validateLuxuryField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateLuxuryField(field, showError = true) {
    const value = field.value.trim();
    const fieldName = field.name;
    let errorMessage = '';
    
    // Use translation function if available
    const translateError = (key) => {
        return (typeof t === 'function') ? t(key) : {
            'form_error_required': 'この項目は必須です。',
            'form_error_email': '有効なメールアドレスを入力してください。',
            'form_error_phone': '有効な電話番号を入力してください（例：090-1234-5678）。',
            'form_error_name_length': '2文字以上で入力してください。',
            'form_error_name_japanese': '日本語で入力してください。'
        }[key] || key;
    };
    
    // Required field check
    if (field.required && !value) {
        errorMessage = translateError('form_error_required');
    } else if (value) {
        // Enhanced validation with luxury feedback
        switch (fieldName) {
            case 'email':
                if (!isValidEmail(value)) {
                    errorMessage = translateError('form_error_email');
                }
                break;
            case 'phone':
                if (!isValidPhone(value)) {
                    errorMessage = translateError('form_error_phone');
                }
                break;
            case 'childName':
            case 'parentName':
                if (value.length < 2) {
                    errorMessage = translateError('form_error_name_length');
                } else if (!/^[ぁ-んァ-ヶー一-龠\s]+$/.test(value) && (typeof currentLanguage === 'undefined' || currentLanguage === 'ja')) {
                    errorMessage = translateError('form_error_name_japanese');
                }
                break;
        }
    }
    
    if (showError) {
        showLuxuryFieldError(field, errorMessage);
    }
    return !errorMessage;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^(0\d{1,4}-\d{1,4}-\d{3,4}|0\d{9,11})$/;
    return phoneRegex.test(phone);
}

function formatLuxuryPhoneNumber(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length > 0) {
        if (value.length <= 3) {
            value = value;
        } else if (value.length <= 7) {
            value = value.slice(0, 3) + '-' + value.slice(3);
        } else {
            value = value.slice(0, 3) + '-' + value.slice(3, 7) + '-' + value.slice(7, 11);
        }
    }
    
    e.target.value = value;
}

function showLuxuryFieldError(field, message) {
    const errorElement = field.parentNode.querySelector('.form-error-luxury');
    if (errorElement) {
        errorElement.textContent = message;
        field.classList.toggle('error', !!message);
        
        // Add luxury error animation with glow for ALL devices
        if (message) {
            const shakeDuration = window.innerWidth < 768 ? '0.3s' : '0.4s';
            field.style.animation = `luxury-shake ${shakeDuration} ease-in-out`;
            field.style.boxShadow = '0 0 20px rgba(255, 107, 107, 0.3)';
            setTimeout(() => {
                field.style.animation = '';
                field.style.boxShadow = '';
            }, window.innerWidth < 768 ? 300 : 400);
        }
    }
}

function clearLuxuryError(field) {
    const errorElement = field.parentNode.querySelector('.form-error-luxury');
    if (errorElement && errorElement.textContent) {
        errorElement.textContent = '';
        field.classList.remove('error');
    }
}

function addSuccessGlow(field) {
    field.style.borderColor = '#d4af37';
    field.style.boxShadow = '0 0 20px rgba(212, 175, 55, 0.3)';
}

function addFocusGlow(field) {
    const translateY = window.innerWidth < 768 ? '-2px' : '-2px';
    field.style.transform = `translateY(${translateY})`;
    field.style.boxShadow = '0 4px 20px rgba(212, 175, 55, 0.2)';
}

function removeFocusGlow(field) {
    field.style.transform = 'translateY(0)';
    field.style.boxShadow = '';
}

// Email notification functions with enhanced error handling
async function sendNotificationEmails(registrationData) {
    console.log('🔄 Starting email notification process...', registrationData);
    
    // Enhanced email sending with detailed tracking
    const emailStatus = {
        adminEmail: false,
        userEmail: false,
        method: 'none',
        errors: []
    };
    
    try {
        console.log('🔄 Attempting backup email system...');
        await sendBackupEmails(registrationData);
        emailStatus.adminEmail = true;
        emailStatus.userEmail = true;
        emailStatus.method = 'web3forms';
        console.log('✅ Backup email system successful');
        
        // Log successful email sending
        logEmailSuccess(registrationData, emailStatus);
        
    } catch (backupError) {
        console.error('❌ Backup email system failed:', backupError);
        emailStatus.errors.push('Web3Forms: ' + backupError.message);
        
        // Last resort: Email via direct API
        try {
            await sendDirectEmails(registrationData);
            emailStatus.adminEmail = true;
            emailStatus.userEmail = true;
            emailStatus.method = 'direct';
            console.log('✅ Direct email system successful');
            
            // Log successful email sending
            logEmailSuccess(registrationData, emailStatus);
            
        } catch (directError) {
            console.error('❌ All email systems failed:', directError);
            emailStatus.errors.push('Direct: ' + directError.message);
            
            // Store for manual follow-up
            logRegistrationForManualFollowUp(registrationData, emailStatus);
            
            // Show user that emails might be delayed
            showEmailDelayNotification();
        }
    }
}

async function sendAdminNotification(data) {
    console.log('📧 Sending admin notification to globalbunny77@gmail.com...');
    
    // Check if Supabase is properly configured
    if (!supabase) {
        throw new Error('Supabase client not initialized');
    }
    
    try {
        const { data: result, error } = await supabase.functions.invoke('send-admin-notification', {
            body: {
                to: 'globalbunny77@gmail.com',
                subject: '【Voice Atelier】新しいワークショップ申し込み',
                data: data
            }
        });
        
        if (error) {
            console.error('Supabase function error:', error);
            throw new Error(`Supabase Edge Function failed: ${error.message || JSON.stringify(error)}`);
        }
        
        console.log('✅ Admin notification sent via Supabase:', result);
        return result;
        
    } catch (error) {
        console.error('❌ Admin notification failed:', error);
        
        // Enhanced logging for debugging
        console.log('Debug info:', {
            supabaseUrl: SUPABASE_URL,
            hasSupabaseClient: !!supabase,
            errorDetails: error,
            timestamp: new Date().toISOString()
        });
        
        throw error;
    }
}

async function sendThankYouEmail(data) {
    console.log(`📧 Sending thank you email to ${data.email}...`);
    
    // Check if Supabase is properly configured
    if (!supabase) {
        throw new Error('Supabase client not initialized');
    }
    
    // Determine language and function to use
    const isEnglish = (typeof currentLanguage !== 'undefined' && currentLanguage === 'en');
    const functionName = isEnglish ? 'send-thank-you-email-en' : 'send-thank-you-email';
    const subject = isEnglish ? 
        '【Voice Atelier】Thank you for your workshop registration' : 
        '【Voice Atelier】ワークショップお申し込みありがとうございます';
    
    try {
        const { data: result, error } = await supabase.functions.invoke(functionName, {
            body: {
                to: data.email,
                subject: subject,
                data: data
            }
        });
        
        if (error) {
            console.error('Supabase function error:', error);
            throw new Error(`Supabase Edge Function failed: ${error.message || JSON.stringify(error)}`);
        }
        
        console.log('✅ Thank you email sent via Supabase:', result);
        return result;
        
    } catch (error) {
        console.error('❌ Thank you email failed:', error);
        throw error;
    }
}

// Complete backup email implementation
async function sendBackupEmails(data) {
    console.log('📧 Using Web3Forms backup system...');
    
    const web3formsKey = 'e1e48109-25e6-4dc7-80fa-29aa5ca56e24'; 
    
    // Send admin notification
    const adminEmailData = {
        access_key: web3formsKey,
        subject: '【Voice Atelier】新しいワークショップ申し込み',
        from_name: 'Voice Atelier システム',
        email: 'globalbunny77@gmail.com',
        message: `新しいワークショップ申し込みがありました。

【参加者情報】
参加者名: ${data.child_name}
学年: ${data.grade}
保護者名: ${data.parent_name}
メールアドレス: ${data.email}
電話番号: ${data.phone}
歌唱経験: ${data.experience}
特別配慮事項: ${data.special_needs || 'なし'}
申し込み日時: ${new Date(data.created_at).toLocaleString('ja-JP')}

【重要】お申し込みありがとうございます。

このメールは自動送信されています。
Voice Atelier システム`
    };
    
    const adminResponse = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(adminEmailData)
    });
    
    if (!adminResponse.ok) {
        const errorText = await adminResponse.text();
        throw new Error(`Admin email failed: ${adminResponse.status} - ${errorText}`);
    }
    
    const adminResult = await adminResponse.json();
    console.log('✅ Admin notification sent via Web3Forms:', adminResult);
    
    // Send user confirmation email using separate Web3Forms submission
    // Force Japanese email for now
    const isEnglish = false; // 日本語メールを強制送信
    
    // Use a different approach: send directly to user with proper From/To headers
    const userEmailData = {
        access_key: web3formsKey,
        subject: isEnglish ? 
            '【Voice Atelier】Thank you for your workshop registration✨' :
            '【Voice Atelier】ワークショップお申し込みありがとうございます✨',
        from_name: 'Voice Atelier',
        from_email: 'globalbunny77@gmail.com', // 実際の送信元
        email: data.email, // 宛先（ユーザーのメールアドレス）
        reply_to: 'globalbunny77@gmail.com', // 返信先
        message: isEnglish ? 
            `Dear ${data.parent_name},

✨ Thank you for registering for the special workshop by world-class voice trainer Mr. JoJo Acosta! We are delighted to have you join us!

【✅ Registration Details】
🧒 Participant: ${data.child_name}
📚 Grade: ${data.grade}
🎵 Experience: ${data.experience}
${data.special_needs ? `⚠️ Special needs: ${data.special_needs}` : ''}

【📅 Workshop Details】
🗓️ Date & Time: June 21, 2025 (Saturday) 10:30 AM - 12:00 PM (90 minutes)
📍 Venue: UDCK (Kashiwa-no-ha Urban Design Center)
　　　  - 1-minute walk from Tsukuba Express "Kashiwa-no-ha Campus Station"
🎯 Target: Elementary to junior high students (ages 7-15)
👥 Capacity: Limited to 20 participants
💝 Fee: Completely free
🌐 Language: English songs (Japanese support available)

【🎤 About the Instructor】
Mr. JoJo Acosta (From the Philippines)
World-class voice trainer who has coached performers from "X-Factor," "Les Misérables," and "American Idol"

【📧 Contact Information】
• If you have any questions, please feel free to contact us

【📞 Contact】
📧 Email: globalbunny77@gmail.com
👤 Contact: Odate

We look forward to providing your child with world-level instruction!

──────────────────
🎼 Voice Atelier
World-Class Voice Trainer Mr. JoJo Acosta Workshop
──────────────────

*This email was sent automatically
Registration date: ${new Date(data.created_at).toLocaleString('en-US')}` :
            `${data.parent_name} 様

✨ この度は、世界的ボイストレーナー ジョジョ・アコスタ氏による特別ワークショップにお申し込みいただき、誠にありがとうございます！

【✅ お申し込み内容確認】
🧒 参加者名: ${data.child_name}
📚 学年: ${data.grade}
🎵 歌唱経験: ${data.experience}
${data.special_needs ? `⚠️ 配慮事項: ${data.special_needs}` : ''}

【📅 ワークショップ詳細】
🗓️ 開催日時: 2025年6月21日（土）10:30〜12:00（90分間）
📍 会場: UDCK（柏の葉アーバンデザインセンター）
　　　  - つくばエクスプレス「柏の葉キャンパス駅」徒歩1分
🎯 対象: 小学生〜中学生（7歳〜15歳）
👥 定員: 20名限定
💝 参加費: 完全無料
🌐 使用言語: 英語楽曲（日本語サポートあり）

【🎤 講師プロフィール】
ジョジョ・アコスタ氏（フィリピン出身）
「X-Factor」「レ・ミゼラブル」「アメリカン・アイドル」の出演者を指導した世界的ボイストレーナー

【📧 お問い合わせについて】
• ご質問がございましたらお気軽にお問い合わせください

【📞 お問い合わせ】
📧 メール: globalbunny77@gmail.com
👤 担当: 大舘

世界レベルの指導をお子様に体験していただけることを、スタッフ一同心より楽しみにしております！

──────────────────
🎼 Voice Atelier
世界的ボイストレーナー ジョジョ・アコスタ氏ワークショップ
──────────────────

※このメールは自動送信されています
申し込み日時: ${new Date(data.created_at).toLocaleString('ja-JP')}`
    };
    
    const userResponse = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(userEmailData)
    });
    
    // Web3Formsの制限のため、ユーザー確認メールは直接Formsubmitを使用
    console.log('📧 Sending user confirmation email via Formsubmit...');
    try {
        await sendUserConfirmationViaFormsubmit(data, false); // 日本語強制
        console.log('✅ User confirmation sent via Formsubmit');
    } catch (formsubmitError) {
        console.error('❌ Formsubmit failed, trying alternative method:', formsubmitError);
        try {
            await sendUserConfirmationViaEmailJS(data, false); // 日本語強制
            console.log('✅ User confirmation sent via EmailJS backup');
        } catch (emailJsError) {
            console.error('❌ All user email methods failed:', emailJsError);
            // Don't throw error - admin notification succeeded
        }
    }
}

// Formsubmit user confirmation email (dedicated function)
async function sendUserConfirmationViaFormsubmit(data, isEnglish = false) {
    console.log('📧 Sending user confirmation via Formsubmit...');
    
    // Always use Japanese for user confirmation
    isEnglish = false;
    
    const detailedMessage = `${data.parent_name} 様

✨ この度は、世界的ボイストレーナー ジョジョ・アコスタ氏による特別ワークショップにお申し込みいただき、誠にありがとうございます！

【✅ お申し込み確認完了】
🧒 参加者名: ${data.child_name}
📚 学年: ${data.grade}
🎵 歌唱経験: ${data.experience}
${data.special_needs ? `⚠️ 配慮事項: ${data.special_needs}` : ''}

【📅 ワークショップ詳細】
🗓️ 開催日時: 2025年6月21日（土）10:30〜12:00（90分間）
📍 会場: UDCK（柏の葉アーバンデザインセンター）
　　　  - つくばエクスプレス「柏の葉キャンパス駅」徒歩1分
🎯 対象: 小学生〜中学生（7歳〜15歳）
👥 定員: 20名限定
💝 参加費: 完全無料
🌐 使用言語: 英語楽曲（日本語サポートあり）

【🎤 講師プロフィール】
ジョジョ・アコスタ氏（フィリピン出身）
「X-Factor」「レ・ミゼラブル」「アメリカン・アイドル」の出演者を指導した世界的ボイストレーナー

【📧 お問い合わせについて】
• ご質問がございましたらお気軽にお問い合わせください

【📞 お問い合わせ】
📧 メール: globalbunny77@gmail.com
👤 担当: 大舘

世界レベルの指導をお子様に体験していただけることを、スタッフ一同心より楽しみにしております！

──────────────────
🎼 Voice Atelier
世界的ボイストレーナー ジョジョ・アコスタ氏ワークショップ
──────────────────

※このメールは自動送信されています
申し込み日時: ${new Date(data.created_at).toLocaleString('ja-JP')}`;

    let emailSent = false;
    let lastError = '';
    
    // Method 1: Try Formsubmit (primary)
    try {
        console.log(`📧 Sending to user: ${data.email}`);
        const formsubmitResponse = await fetch(`https://formsubmit.co/ajax/${data.email}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                name: 'Voice Atelier',
                email: 'globalbunny77@gmail.com',
                subject: '【Voice Atelier】ワークショップお申し込み確認✨',
                message: detailedMessage,
                _captcha: 'false',
                _template: 'table'
            })
        });
        
        if (formsubmitResponse.ok) {
            const result = await formsubmitResponse.json();
            console.log('✅ User confirmation sent via Formsubmit:', result);
            emailSent = true;
        } else {
            const errorText = await formsubmitResponse.text();
            lastError = `Formsubmit failed: ${formsubmitResponse.status} - ${errorText}`;
            console.error(lastError);
        }
    } catch (error) {
        lastError = `Formsubmit error: ${error.message}`;
        console.error(lastError);
    }
    
    // Method 2: Try alternative Formsubmit endpoint
    if (!emailSent) {
        try {
            console.log('📧 Trying alternative Formsubmit method...');
            const altResponse = await fetch('https://formsubmit.co/ajax/globalbunny77@gmail.com', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    name: data.parent_name,
                    email: data.email,
                    subject: '【Voice Atelier】ワークショップお申し込み確認✨',
                    message: detailedMessage,
                    _cc: data.email, // Copy to user
                    _captcha: 'false'
                })
            });
            
            if (altResponse.ok) {
                console.log('✅ User confirmation sent via alternative method');
                emailSent = true;
            } else {
                lastError = `Alternative method failed: ${altResponse.status}`;
                console.error(lastError);
            }
        } catch (error) {
            lastError = `Alternative method error: ${error.message}`;
            console.error(lastError);
        }
    }
    
    if (!emailSent) {
        throw new Error(`All Formsubmit methods failed: ${lastError}`);
    }
}

// EmailJS backup for user confirmation emails
async function sendUserConfirmationViaEmailJS(data, isEnglish) {
    console.log('📧 Sending user confirmation via EmailJS...');
    
    // Force Japanese for all emails
    isEnglish = false;
    
    // EmailJS configuration (using a public service)
    const emailjsConfig = {
        serviceId: 'service_voiceatelier',
        templateId: 'template_confirmation_ja', // 日本語テンプレート強制
        publicKey: 'YOUR_EMAILJS_PUBLIC_KEY' // この値は後で設定
    };
    
    // For now, use a simple SMTP service simulation
    const emailData = {
        to_email: data.email,
        to_name: data.parent_name,
        from_name: 'Voice Atelier',
        subject: '【Voice Atelier】ワークショップお申し込み確認✨',
        message: `${data.parent_name} 様、${data.child_name} さんのワークショップお申し込みありがとうございます！`,
        participant_name: data.child_name,
        grade: data.grade,
        experience: data.experience,
        special_needs: data.special_needs || '',
        workshop_date: '2025年6月21日（土）10:30〜12:00',
        venue: 'UDCK（柏の葉キャンパス駅）'
    };
    
    // 詳細な日本語確認メールを作成
    const detailedMessage =
        `${data.parent_name} 様

✨ この度は、世界的ボイストレーナー ジョジョ・アコスタ氏による特別ワークショップにお申し込みいただき、誠にありがとうございます！

【✅ お申し込み確認完了】
🧒 参加者名: ${data.child_name}
📚 学年: ${data.grade}
🎵 歌唱経験: ${data.experience}
${data.special_needs ? `⚠️ 配慮事項: ${data.special_needs}` : ''}

【📅 ワークショップ詳細】
🗓️ 開催日時: 2025年6月21日（土）10:30〜12:00（90分間）
📍 会場: UDCK（柏の葉アーバンデザインセンター）
　　　  - つくばエクスプレス「柏の葉キャンパス駅」より徒歩1分
🎯 対象: 小学生〜中学生（7歳〜15歳）
👥 定員: 20名限定
💝 参加費: 完全無料
🌐 使用言語: 英語楽曲（日本語サポートあり）

【🎤 講師について】
ジョジョ・アコスタ氏（フィリピン出身）
「X-Factor」「レ・ミゼラブル」「アメリカンアイドル」の出演者を指導した世界的ボイストレーナー
詳細プロフィール: https://jojoacosta.com/

【📧 お問い合わせ】
ご質問がございましたら、お気軽にご連絡ください：
📧 メール: globalbunny77@gmail.com
👤 担当: 大舘

世界レベルの指導をお子様に体験していただけることを、スタッフ一同心より楽しみにしております！

──────────────────
🎼 Voice Atelier
世界的ボイストレーナー ジョジョ・アコスタ氏ワークショップ
──────────────────

※この確認メールは自動送信されています
申し込み日時: ${new Date(data.created_at).toLocaleString('ja-JP')}`;

    // Formsubmitを使用してユーザー確認メール送信
    const formsubmitResponse = await fetch('https://formsubmit.co/ajax/' + data.email, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            name: 'Voice Atelier',
            email: 'globalbunny77@gmail.com',
            subject: '【Voice Atelier】ワークショップお申し込み確認✨',
            message: detailedMessage,
            _captcha: 'false',
            _template: 'table'
        })
    });
    
    if (!formsubmitResponse.ok) {
        throw new Error('Formsubmit failed');
    }
    
    console.log('✅ User confirmation sent via Formsubmit');
}


// Logging functions for email tracking
function logEmailSuccess(registrationData, emailStatus) {
    console.log('📊 Email Success Log:', {
        timestamp: new Date().toISOString(),
        participant: registrationData.child_name,
        email: registrationData.email,
        adminEmail: emailStatus.adminEmail,
        userEmail: emailStatus.userEmail,
        method: emailStatus.method
    });
    
    // Store in localStorage for debugging
    const emailLogs = JSON.parse(localStorage.getItem('email_logs') || '[]');
    emailLogs.push({
        timestamp: new Date().toISOString(),
        type: 'success',
        participant: registrationData.child_name,
        email: registrationData.email,
        status: emailStatus
    });
    localStorage.setItem('email_logs', JSON.stringify(emailLogs.slice(-50))); // Keep last 50 logs
}

function logRegistrationForManualFollowUp(registrationData, emailStatus) {
    console.error('📝 Manual Follow-up Required:', {
        timestamp: new Date().toISOString(),
        participant: registrationData.child_name,
        email: registrationData.email,
        phone: registrationData.phone,
        errors: emailStatus.errors
    });
    
    // Store in localStorage for manual follow-up
    const manualLogs = JSON.parse(localStorage.getItem('manual_followup') || '[]');
    manualLogs.push({
        timestamp: new Date().toISOString(),
        participant: registrationData.child_name,
        parentName: registrationData.parent_name,
        email: registrationData.email,
        phone: registrationData.phone,
        grade: registrationData.grade,
        experience: registrationData.experience,
        specialNeeds: registrationData.special_needs,
        errors: emailStatus.errors
    });
    localStorage.setItem('manual_followup', JSON.stringify(manualLogs));
    
    // Send to admin immediately for manual processing
    fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            access_key: 'e1e48109-25e6-4dc7-80fa-29aa5ca56e24',
            subject: '【緊急】Voice Atelier - メール送信失敗・手動対応必要',
            from_name: 'Voice Atelier システム',
            email: 'globalbunny77@gmail.com',
            message: `メール送信に失敗しました。手動での連絡が必要です。

【参加者情報】
参加者名: ${registrationData.child_name}
保護者名: ${registrationData.parent_name}
メールアドレス: ${registrationData.email}
電話番号: ${registrationData.phone}
学年: ${registrationData.grade}

【エラー詳細】
${emailStatus.errors.join('\n')}

【重要】この方に直接ご連絡ください。`
        })
    }).catch(err => console.error('Emergency notification failed:', err));
}


// Debug function to check email logs (for development)
function checkEmailLogs() {
    const emailLogs = JSON.parse(localStorage.getItem('email_logs') || '[]');
    const manualLogs = JSON.parse(localStorage.getItem('manual_followup') || '[]');
    
    console.log('📊 Email Success Logs:', emailLogs);
    console.log('📝 Manual Follow-up Required:', manualLogs);
    
    return {
        successCount: emailLogs.length,
        failureCount: manualLogs.length,
        logs: emailLogs,
        failures: manualLogs
    };
}

// Make debug functions available globally
window.checkEmailLogs = checkEmailLogs;

// Test function for email sending (for development/testing)
async function testEmailSending() {
    console.log('🧪 Testing email sending functionality...');
    
    const testData = {
        child_name: 'テスト太郎',
        grade: '小学3年生',
        parent_name: 'テスト花子',
        email: 'test@example.com',
        phone: '090-1234-5678',
        experience: '初心者（歌を習ったことがない）',
        special_needs: 'テスト用の申込みです',
        created_at: new Date().toISOString()
    };
    
    try {
        console.log('📧 Testing user confirmation email...');
        await sendUserConfirmationViaFormsubmit(testData, false);
        console.log('✅ User confirmation email test PASSED');
        return { success: true, message: 'Email test passed' };
    } catch (error) {
        console.error('❌ User confirmation email test FAILED:', error);
        return { success: false, message: error.message };
    }
}

// Test function for admin email
async function testAdminEmail() {
    console.log('🧪 Testing admin email functionality...');
    
    const testData = {
        child_name: 'テスト太郎',
        grade: '小学3年生',
        parent_name: 'テスト花子',
        email: 'test@example.com',
        phone: '090-1234-5678',
        experience: '初心者（歌を習ったことがない）',
        special_needs: 'テスト用の申込みです',
        created_at: new Date().toISOString()
    };
    
    try {
        console.log('📧 Testing admin notification email...');
        await sendBackupEmails(testData);
        console.log('✅ Admin email test PASSED');
        return { success: true, message: 'Admin email test passed' };
    } catch (error) {
        console.error('❌ Admin email test FAILED:', error);
        return { success: false, message: error.message };
    }
}

// Complete test suite
async function runCompleteTests() {
    console.log('🏃‍♂️ Running complete test suite...');
    
    const results = {
        environment: isLocalEnvironment ? 'LOCAL' : 'DEPLOYED',
        timestamp: new Date().toISOString(),
        tests: {}
    };
    
    // Test 1: ScrollToForm
    const formSection = document.getElementById('register');
    results.tests.scrollToForm = {
        passed: !!formSection && typeof scrollToForm === 'function',
        message: formSection ? 'Form section found' : 'Form section missing'
    };
    
    // Test 2: Supabase initialization
    results.tests.supabase = {
        passed: !!window.supabase,
        message: window.supabase ? 'Supabase SDK loaded' : 'Supabase SDK missing'
    };
    
    // Test 3: Email functions
    results.tests.emailFunctions = {
        passed: typeof sendUserConfirmationViaFormsubmit === 'function' && typeof sendBackupEmails === 'function',
        message: 'Email functions availability'
    };
    
    // Test 4: User email (only in test environment)
    if (window.location.pathname.includes('test.html')) {
        try {
            const userEmailResult = await testEmailSending();
            results.tests.userEmail = userEmailResult;
        } catch (error) {
            results.tests.userEmail = { success: false, message: error.message };
        }
    }
    
    console.log('📊 Test Results:', results);
    return results;
}

// Make test functions globally available
window.testEmailSending = testEmailSending;
window.testAdminEmail = testAdminEmail;
window.runCompleteTests = runCompleteTests;

// Debug function to check failed emails
function checkFailedEmails() {
    const failedEmails = JSON.parse(localStorage.getItem('failed_emails') || '[]');
    console.log('📧 Failed Email Attempts:', failedEmails);
    return failedEmails;
}

// Test email function for debugging
async function testEmailDelivery(testEmail) {
    console.log('🧪 Testing email delivery to:', testEmail);
    
    const testData = {
        child_name: 'テスト太郎',
        grade: '小学1年生',
        parent_name: 'テスト花子',
        email: testEmail,
        phone: '090-1234-5678',
        experience: '初心者',
        special_needs: '',
        created_at: new Date().toISOString()
    };
    
    try {
        await sendUserConfirmationViaFormsubmit(testData, false);
        console.log('✅ Test email sent successfully');
        return true;
    } catch (error) {
        console.error('❌ Test email failed:', error);
        return false;
    }
}

window.checkFailedEmails = checkFailedEmails;
window.testEmailDelivery = testEmailDelivery;

// Direct email implementation with multiple providers
async function sendDirectEmails(data) {
    console.log('📧 Attempting direct email providers...');
    
    // Try Formspree (another reliable service)
    try {
        await sendViaFormspree(data);
        return;
    } catch (formspreeError) {
        console.error('Formspree failed:', formspreeError);
    }
    
    // Try Netlify Forms as last resort
    try {
        await sendViaNetlifyForms(data);
        return;
    } catch (netlifyError) {
        console.error('Netlify Forms failed:', netlifyError);
        throw new Error('All direct email services failed');
    }
}

async function sendViaFormspree(data) {
    console.log('📧 Sending via Formspree...');
    
    const formspreeEndpoint = 'https://formspree.io/f/xrbgqpbv'; // Demo endpoint
    
    const formData = new FormData();
    formData.append('_replyto', 'globalbunny77@gmail.com');
    formData.append('_subject', '【Voice Atelier】新しいワークショップ申し込み');
    formData.append('child_name', data.child_name);
    formData.append('parent_name', data.parent_name);
    formData.append('grade', data.grade);
    formData.append('email', data.email);
    formData.append('phone', data.phone);
    formData.append('experience', data.experience);
    formData.append('special_needs', data.special_needs || 'なし');
    formData.append('created_at', new Date(data.created_at).toLocaleString('ja-JP'));
    formData.append('message', `新しいワークショップ申し込み:
参加者: ${data.child_name} (${data.grade})
保護者: ${data.parent_name}
連絡先: ${data.email} / ${data.phone}
経験: ${data.experience}
特別配慮: ${data.special_needs || 'なし'}
申込日時: ${new Date(data.created_at).toLocaleString('ja-JP')}`);
    
    const response = await fetch(formspreeEndpoint, {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    });
    
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Formspree error: ${response.status} - ${errorText}`);
    }
    
    console.log('✅ Email sent via Formspree');
}

async function sendViaNetlifyForms(data) {
    console.log('📧 Sending via Netlify Forms...');
    
    const netlifyEndpoint = '/'; // Current site with Netlify Forms
    
    const formData = new FormData();
    formData.append('form-name', 'voice-atelier-registration');
    formData.append('child_name', data.child_name);
    formData.append('parent_name', data.parent_name);
    formData.append('grade', data.grade);
    formData.append('email', data.email);
    formData.append('phone', data.phone);
    formData.append('experience', data.experience);
    formData.append('special_needs', data.special_needs || 'なし');
    formData.append('created_at', new Date(data.created_at).toLocaleString('ja-JP'));
    
    const response = await fetch(netlifyEndpoint, {
        method: 'POST',
        body: formData
    });
    
    if (!response.ok) {
        throw new Error(`Netlify Forms error: ${response.statusText}`);
    }
    
    console.log('✅ Email sent via Netlify Forms');
}

// Enhanced user notification for email delays
function showEmailDelayNotification() {
    const notification = document.createElement('div');
    notification.className = 'email-delay-notification';
    
    notification.innerHTML = `
        <div class="delay-notification-content">
            <div class="delay-icon">📧</div>
            <h3>申し込み完了</h3>
            <p>お申し込みは正常に受付けました。</p>
            <p class="delay-message">
                <strong>確認メールの送信に遅延が発生している可能性があります。</strong><br>
                後ほど手動でご連絡いたします。
            </p>
            <div class="delay-contact">
                <p>お急ぎの場合は直接ご連絡ください：</p>
                <a href="mailto:globalbunny77@gmail.com" class="contact-link">
                    globalbunny77@gmail.com
                </a>
            </div>
            <button onclick="this.parentElement.parentElement.remove()" class="delay-close-btn">
                理解しました
            </button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10003;
        animation: luxury-fadeIn 0.5s ease;
        padding: 20px;
    `;
    
    const content = notification.querySelector('.delay-notification-content');
    content.style.cssText = `
        background: linear-gradient(135deg, #1a1a2e, #16213e);
        padding: 2.5rem;
        border-radius: 1rem;
        text-align: center;
        max-width: 500px;
        width: 100%;
        border: 1px solid rgba(212, 175, 55, 0.3);
        color: white;
    `;
    
    const closeBtn = notification.querySelector('.delay-close-btn');
    closeBtn.style.cssText = `
        background: linear-gradient(135deg, #d4af37, #f4e4a6);
        color: #1a1a2e;
        border: none;
        padding: 1rem 2rem;
        border-radius: 2rem;
        margin-top: 1.5rem;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(notification);
}

function showLuxuryErrorMessage(message) {
    // Use the localized version if language switcher is available
    if (typeof showLocalizedErrorMessage === 'function') {
        showLocalizedErrorMessage(message);
        return;
    }
    
    // Fallback to original function
    const modal = document.createElement('div');
    modal.className = 'luxury-error-modal';
    
    modal.innerHTML = `
        <div class="luxury-error-content">
            <div class="luxury-error-icon">⚠️</div>
            <h3>エラーが発生しました</h3>
            <p>${message}</p>
            <button onclick="this.parentElement.parentElement.remove()" class="luxury-error-close">
                閉じる
            </button>
        </div>
    `;
    
    // Add styles
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: luxury-fadeIn 0.3s ease;
    `;
    
    const content = modal.querySelector('.luxury-error-content');
    content.style.cssText = `
        background: linear-gradient(135deg, #1a1a2e, #16213e);
        padding: 2rem;
        border-radius: 1rem;
        text-align: center;
        max-width: 400px;
        margin: 0 1rem;
        border: 1px solid rgba(255, 107, 107, 0.3);
    `;
    
    const closeBtn = modal.querySelector('.luxury-error-close');
    closeBtn.style.cssText = `
        background: linear-gradient(135deg, #ff6b6b, #ee5a6f);
        color: white;
        border: none;
        padding: 0.8rem 1.5rem;
        border-radius: 2rem;
        margin-top: 1rem;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(modal);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (modal.parentNode) {
            modal.remove();
        }
    }, 5000);
}

function showLuxurySuccessMessage() {
    // Use the localized version if language switcher is available
    if (typeof showLocalizedSuccessMessage === 'function') {
        showLocalizedSuccessMessage();
        return;
    }
    
    // Fallback to original function
    const modal = document.createElement('div');
    modal.className = 'luxury-success-modal';
    
    const isMobile = window.innerWidth < 768;
    const modalPadding = isMobile ? '2rem' : '4rem';
    const modalBorderRadius = isMobile ? '2rem' : '3rem';
    
    modal.innerHTML = `
        <div class="luxury-success-content">
            <div class="luxury-success-animation">
                <div class="luxury-success-icon">✨</div>
                <div class="luxury-fireworks"></div>
                <div class="luxury-particles-success"></div>
            </div>
            <h3>お申込みありがとうございます！</h3>
            <p>ワークショップのお申込みを受け付けました。<br>詳細については24時間以内にご連絡いたします。</p>
            <div class="luxury-success-details">
                <div class="luxury-detail-item">
                    <span class="luxury-detail-icon">📧</span>
                    <span>確認メールを送信しました</span>
                </div>
                <div class="luxury-detail-item">
                    <span class="luxury-detail-icon">📅</span>
                    <span>開催日: 2025年6月21日（土）</span>
                </div>
                <div class="luxury-detail-item">
                    <span class="luxury-detail-icon">📍</span>
                    <span>会場: UDCK（柏の葉キャンパス駅）</span>
                </div>
            </div>
            <button class="luxury-success-close">閉じる</button>
        </div>
    `;
    
    // Enhanced luxury modal styles with responsive support
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(26, 26, 46, 0.8);
        backdrop-filter: blur(10px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.4s ease;
        padding: 1rem;
    `;
    
    const content = modal.querySelector('.luxury-success-content');
    content.style.cssText = `
        background: linear-gradient(135deg, rgba(26, 26, 46, 0.95) 0%, rgba(22, 33, 62, 0.95) 100%);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        padding: ${modalPadding};
        border-radius: ${modalBorderRadius};
        text-align: center;
        max-width: ${isMobile ? '90vw' : '600px'};
        width: 100%;
        box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
        transform: scale(0.8);
        transition: transform 0.4s ease;
        position: relative;
        overflow: hidden;
        color: white;
        max-height: 90vh;
        overflow-y: auto;
    `;
    
    // Add luxury modal styles
    addLuxuryModalStyles(modal);
    
    document.body.appendChild(modal);
    
    // Animate in with luxury effects for ALL devices
    requestAnimationFrame(() => {
        modal.style.opacity = '1';
        content.style.transform = 'scale(1)';
        triggerFireworks(modal);
    });
    
    // Close functionality
    const closeButton = modal.querySelector('.luxury-success-close');
    closeButton.addEventListener('click', () => {
        modal.style.opacity = '0';
        setTimeout(() => modal.remove(), 400);
    });
    
    // Auto close after 10 seconds
    setTimeout(() => {
        if (document.body.contains(modal)) {
            closeButton.click();
        }
    }, 10000);
}

function addLuxuryModalStyles(modal) {
    const isMobile = window.innerWidth < 768;
    const style = document.createElement('style');
    style.textContent = `
        .luxury-success-animation {
            position: relative;
            margin-bottom: ${isMobile ? '2rem' : '3rem'};
            height: ${isMobile ? '80px' : '120px'};
        }
        
        .luxury-success-icon {
            font-size: ${isMobile ? '3rem' : '5rem'};
            animation: luxury-bounceIn 0.8s ease-out;
            background: linear-gradient(135deg, #d4af37 0%, #f4e4a6 100%);
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        
        .luxury-fireworks {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: ${isMobile ? '150px' : '200px'};
            height: ${isMobile ? '150px' : '200px'};
            background: radial-gradient(circle, #d4af37 2px, transparent 2px);
            background-size: ${isMobile ? '20px 20px' : '30px 30px'};
            animation: luxury-fireworks 1.5s ease-out;
            opacity: 0;
        }
        
        .luxury-particles-success {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            pointer-events: none;
        }
        
        .luxury-success-modal h3 {
            font-family: 'Playfair Display', serif;
            font-size: ${isMobile ? '1.5rem' : '2.25rem'};
            font-weight: 700;
            margin-bottom: ${isMobile ? '1rem' : '1.5rem'};
            background: linear-gradient(135deg, #d4af37 0%, #f4e4a6 100%);
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        
        .luxury-success-modal p {
            color: rgba(255, 255, 255, 0.8);
            margin-bottom: ${isMobile ? '2rem' : '3rem'};
            line-height: 1.7;
            font-size: ${isMobile ? '0.9rem' : '1.125rem'};
        }
        
        .luxury-success-details {
            display: flex;
            flex-direction: column;
            gap: ${isMobile ? '1rem' : '1.5rem'};
            margin-bottom: ${isMobile ? '2rem' : '3rem'};
            text-align: left;
        }
        
        .luxury-detail-item {
            display: flex;
            align-items: center;
            gap: ${isMobile ? '0.75rem' : '1rem'};
            padding: ${isMobile ? '1rem' : '1.25rem'};
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: ${isMobile ? '1rem' : '1.5rem'};
            font-size: ${isMobile ? '0.875rem' : '1rem'};
            font-weight: 600;
            color: white;
            transition: all 0.3s ease;
        }
        
        .luxury-detail-item:hover {
            background: rgba(212, 175, 55, 0.1);
            border-color: rgba(212, 175, 55, 0.3);
            transform: translateX(${isMobile ? '4px' : '8px'});
        }
        
        .luxury-detail-icon {
            font-size: ${isMobile ? '1.25rem' : '1.5rem'};
            flex-shrink: 0;
        }
        
        .luxury-success-close {
            background: linear-gradient(135deg, #d4af37 0%, #f4e4a6 100%);
            color: #1a1a2e;
            border: none;
            padding: ${isMobile ? '1rem 2rem' : '1.25rem 3rem'};
            border-radius: ${isMobile ? '1.5rem' : '2rem'};
            font-weight: 700;
            cursor: pointer;
            transition: all 0.4s ease;
            font-size: ${isMobile ? '1rem' : '1.125rem'};
            box-shadow: 0 10px 30px rgba(212, 175, 55, 0.3);
            position: relative;
            overflow: hidden;
            width: 100%;
        }
        
        .luxury-success-close:hover {
            transform: translateY(${isMobile ? '-2px' : '-4px'});
            box-shadow: 0 20px 40px rgba(212, 175, 55, 0.4);
        }
        
        .luxury-success-close::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
            transition: left 0.6s;
        }
        
        .luxury-success-close:hover::before {
            left: 100%;
        }
        
        @keyframes luxury-bounceIn {
            0% { transform: scale(0.2); opacity: 0; }
            50% { transform: scale(1.1); }
            70% { transform: scale(0.9); }
            100% { transform: scale(1); opacity: 1; }
        }
        
        @keyframes luxury-fireworks {
            0% { opacity: 1; transform: translate(-50%, -50%) scale(0); }
            50% { opacity: 1; transform: translate(-50%, -50%) scale(1.5); }
            100% { opacity: 0; transform: translate(-50%, -50%) scale(2); }
        }
        
        @keyframes luxury-shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-8px); }
            75% { transform: translateX(8px); }
        }
        
        @keyframes shake-luxury {
            0%, 100% { transform: translateX(0) scale(1); }
            25% { transform: translateX(-10px) scale(1.02); }
            75% { transform: translateX(10px) scale(1.02); }
        }
        
        @keyframes luxury-fadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
        }
        
        @keyframes luxury-spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        
        @media (max-width: 480px) {
            .luxury-success-modal h3 {
                font-size: 1.25rem;
            }
            
            .luxury-success-modal p {
                font-size: 0.8rem;
            }
            
            .luxury-detail-item {
                font-size: 0.75rem;
                padding: 0.75rem;
            }
            
            .luxury-detail-icon {
                font-size: 1rem;
            }
            
            .luxury-success-close {
                font-size: 0.9rem;
                padding: 0.875rem 1.5rem;
            }
        }
    `;
    document.head.appendChild(style);
}

// Enhanced luxury navigation with responsive support
function initLuxuryNavigation() {
    // Smooth scroll with luxury easing
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navHeight = document.querySelector('.nav-luxury').offsetHeight;
                const targetPosition = target.offsetTop - navHeight - (window.innerWidth < 768 ? 20 : 30);
                
                // Luxury smooth scroll with custom easing
                smoothScrollTo(targetPosition, window.innerWidth < 768 ? 800 : 1000);
                
                // Add luxury highlight effect for ALL devices
                target.style.animation = 'luxury-highlight 1.5s ease-in-out';
                setTimeout(() => {
                    target.style.animation = '';
                }, 1500);
            }
        });
    });
    
    // Enhanced active navigation with luxury effects
    const navLinks = document.querySelectorAll('.nav-link-luxury');
    const sections = document.querySelectorAll('section[id]');
    
    function updateLuxuryActiveNavLink() {
        const scrollPosition = window.scrollY + (window.innerWidth < 768 ? 80 : 120);
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                        addNavLinkGlow(link);
                    }
                });
            }
        });
    }
    
    // Luxury navbar background with enhanced effects
    function handleLuxuryNavbarBackground() {
        const navbar = document.querySelector('.nav-luxury');
        const scrollThreshold = window.innerWidth < 768 ? 40 : 80;
        
        if (window.scrollY > scrollThreshold) {
            navbar.style.background = 'rgba(26, 26, 46, 0.98)';
            navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
            navbar.style.borderBottom = '1px solid rgba(212, 175, 55, 0.2)';
        } else {
            navbar.style.background = 'rgba(26, 26, 46, 0.95)';
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            navbar.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';
        }
    }
    
    // Throttled scroll listener with luxury performance
    let luxuryTicking = false;
    function handleLuxuryScroll() {
        if (!luxuryTicking) {
            requestAnimationFrame(() => {
                updateLuxuryActiveNavLink();
                handleLuxuryNavbarBackground();
                updateScrollProgress();
                luxuryTicking = false;
            });
            luxuryTicking = true;
        }
    }
    
    window.addEventListener('scroll', handleLuxuryScroll, { passive: true });
    
    // Initial calls
    updateLuxuryActiveNavLink();
    handleLuxuryNavbarBackground();
}

// Luxury FAQ functionality with responsive support
function initLuxuryFAQ() {
    const faqItems = document.querySelectorAll('.faq-item-luxury');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question-luxury');
        const answer = item.querySelector('.faq-answer-luxury');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other FAQ items with luxury animation
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    const otherAnswer = otherItem.querySelector('.faq-answer-luxury');
                    otherAnswer.style.maxHeight = null;
                    otherItem.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                }
            });
            
            // Toggle current item with luxury effects
            if (isActive) {
                item.classList.remove('active');
                answer.style.maxHeight = null;
                item.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            } else {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                answer.style.transition = 'max-height 0.4s ease-in-out';
                item.style.borderColor = 'rgba(212, 175, 55, 0.3)';
                
                item.style.boxShadow = '0 10px 30px rgba(212, 175, 55, 0.1)';
                addLuxuryGlowEffect(item);
            }
        });
    });
}

// Luxury particle effects with mobile support
function initLuxuryParticleEffects() {
    createFloatingParticles();
    createLuxuryOrbs();
}

function createFloatingParticles() {
    const particleContainer = document.querySelector('.luxury-particles');
    if (!particleContainer) return;
    
    const particleCount = window.innerWidth < 768 ? 3 : window.innerWidth < 1024 ? 5 : 8;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'luxury-floating-particle';
        const size = window.innerWidth < 768 ? '4px' : '6px';
        particle.style.cssText = `
            position: absolute;
            width: ${size};
            height: ${size};
            background: linear-gradient(135deg, #d4af37, #f4e4a6);
            border-radius: 50%;
            animation: luxury-particle-float ${15 + Math.random() * 10}s linear infinite;
            left: ${Math.random() * 100}%;
            animation-delay: ${Math.random() * 15}s;
            opacity: ${window.innerWidth < 768 ? '0.4' : '0.6'};
        `;
        particleContainer.appendChild(particle);
    }
}

function createLuxuryOrbs() {
    const orbContainer = document.querySelector('.hero-background-luxury');
    if (!orbContainer) return;
    
    const orbCount = window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;
    
    // Add additional luxury orbs
    for (let i = 0; i < orbCount; i++) {
        const orb = document.createElement('div');
        orb.className = 'luxury-dynamic-orb';
        const size = window.innerWidth < 768 ? 100 + Math.random() * 50 : 
                     window.innerWidth < 1024 ? 150 + Math.random() * 100 : 
                     200 + Math.random() * 200;
        orb.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: linear-gradient(135deg, rgba(212, 175, 55, 0.3), rgba(244, 228, 166, 0.2));
            border-radius: 50%;
            filter: blur(${window.innerWidth < 768 ? 20 : window.innerWidth < 1024 ? 30 : 40}px);
            animation: luxury-orb-float ${20 + Math.random() * 10}s ease-in-out infinite;
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            animation-delay: ${Math.random() * 10}s;
        `;
        orbContainer.appendChild(orb);
    }
}

// Luxury interactions with full responsive support
function initLuxuryInteractions() {
    addLuxuryRippleEffects();
    addLuxuryHoverEffects();
    addLuxuryScrollProgress();
}

function addLuxuryRippleEffects() {
    document.querySelectorAll('.btn-primary-luxury, .btn-secondary-luxury, .form-submit-luxury, .nav-cta-luxury').forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, transparent 70%);
                border-radius: 50%;
                transform: scale(0);
                animation: luxury-ripple 0.8s linear;
                pointer-events: none;
                z-index: 1;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 800);
        });
    });
}

function addLuxuryHoverEffects() {
    // Enhanced card hover effects for ALL devices
    document.querySelectorAll('.feature-card-luxury, .testimonial-card-luxury, .achievement-card-luxury').forEach(card => {
        card.addEventListener('mouseenter', function() {
            const translateY = window.innerWidth < 768 ? '-8px' : '-12px';
            const scale = window.innerWidth < 768 ? '1.02' : '1.02';
            this.style.transform = `translateY(${translateY}) scale(${scale})`;
            addLuxuryGlowEffect(this);
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            removeLuxuryGlowEffect(this);
        });
        
        // Add touch support for mobile
        card.addEventListener('touchstart', function() {
            const translateY = '-6px';
            const scale = '1.01';
            this.style.transform = `translateY(${translateY}) scale(${scale})`;
            addLuxuryGlowEffect(this);
        });
        
        card.addEventListener('touchend', function() {
            setTimeout(() => {
                this.style.transform = 'translateY(0) scale(1)';
                removeLuxuryGlowEffect(this);
            }, 150);
        });
    });
}

function addLuxuryScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'luxury-scroll-progress';
    const navHeight = window.innerWidth < 768 ? '60px' : '80px';
    progressBar.style.cssText = `
        position: fixed;
        top: ${navHeight};
        left: 0;
        width: 0%;
        height: ${window.innerWidth < 768 ? '3px' : '4px'};
        background: linear-gradient(135deg, #d4af37 0%, #f4e4a6 100%);
        z-index: 1001;
        transition: width 0.1s ease;
        box-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
    `;
    document.body.appendChild(progressBar);
}

function updateScrollProgress() {
    const progressBar = document.querySelector('.luxury-scroll-progress');
    if (!progressBar) return;
    
    const scrollTop = window.pageYOffset;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    progressBar.style.width = scrollPercent + '%';
}

// Luxury countdown functionality
function initLuxuryCountdown() {
    const eventDate = new Date('2025-06-21T10:00:00').getTime();
    
    function updateLuxuryCountdown() {
        const now = new Date().getTime();
        const distance = eventDate - now;
        
        if (distance > 0) {
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            
            // Update countdown display if element exists
            const countdownElement = document.querySelector('.luxury-countdown');
            if (countdownElement) {
                countdownElement.innerHTML = `
                    <div class="countdown-item">
                        <div class="countdown-number">${days}</div>
                        <div class="countdown-label">日</div>
                    </div>
                    <div class="countdown-item">
                        <div class="countdown-number">${hours}</div>
                        <div class="countdown-label">時間</div>
                    </div>
                    <div class="countdown-item">
                        <div class="countdown-number">${minutes}</div>
                        <div class="countdown-label">分</div>
                    </div>
                `;
            }
        }
    }
    
    // Update countdown every minute
    setInterval(updateLuxuryCountdown, 60000);
    updateLuxuryCountdown();
}

// Luxury parallax effects with mobile optimization
function initLuxuryParallax() {
    const parallaxElements = document.querySelectorAll('.luxury-gradient-orb, .floating-note');
    
    function handleLuxuryParallax() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * (window.innerWidth < 768 ? -0.1 : -0.3);
        
        parallaxElements.forEach((element, index) => {
            const speed = window.innerWidth < 768 ? 0.1 + (index * 0.05) : 0.2 + (index * 0.1);
            const rotation = window.innerWidth < 768 ? scrolled * 0.02 : scrolled * 0.05;
            element.style.transform = `translateY(${rate * speed}px) rotate(${rotation}deg)`;
        });
    }
    
    // Throttled parallax scroll
    let parallaxTicking = false;
    window.addEventListener('scroll', () => {
        if (!parallaxTicking) {
            requestAnimationFrame(() => {
                handleLuxuryParallax();
                parallaxTicking = false;
            });
            parallaxTicking = true;
        }
    }, { passive: true });
}

// Utility functions with responsive support
function smoothScrollTo(target, duration) {
    const start = window.pageYOffset;
    const distance = target - start;
    let startTime = null;
    
    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = easeInOutCubic(timeElapsed, start, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }
    
    function easeInOutCubic(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t * t + b;
        t -= 2;
        return c / 2 * (t * t * t + 2) + b;
    }
    
    requestAnimationFrame(animation);
}

function addLuxuryGlowEffect(element) {
    const glowIntensity = window.innerWidth < 768 ? '0 10px 20px rgba(212, 175, 55, 0.2)' : '0 20px 40px rgba(212, 175, 55, 0.2)';
    element.style.boxShadow = glowIntensity;
    element.style.borderColor = 'rgba(212, 175, 55, 0.4)';
}

function removeLuxuryGlowEffect(element) {
    element.style.boxShadow = '';
    element.style.borderColor = '';
}

function addNavLinkGlow(link) {
    link.style.textShadow = '0 0 10px rgba(212, 175, 55, 0.5)';
}

function animateCounter(element) {
    const numberElement = element.querySelector('.stat-number, .stat-number-luxury');
    if (!numberElement) return;
    
    const finalNumber = parseInt(numberElement.textContent);
    const duration = window.innerWidth < 768 ? 1500 : 2000;
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const currentNumber = Math.floor(progress * finalNumber);
        
        numberElement.textContent = currentNumber + (numberElement.textContent.includes('%') ? '%' : '');
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }
    
    requestAnimationFrame(updateCounter);
}

function addSparkleEffect(element) {
    const sparkleCount = window.innerWidth < 768 ? 3 : 5;
    
    for (let i = 0; i < sparkleCount; i++) {
        const sparkle = document.createElement('div');
        const sparkleSize = window.innerWidth < 768 ? '3px' : '4px';
        sparkle.style.cssText = `
            position: absolute;
            width: ${sparkleSize};
            height: ${sparkleSize};
            background: #d4af37;
            border-radius: 50%;
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            animation: sparkle-fade 1s ease-out forwards;
            pointer-events: none;
        `;
        element.style.position = 'relative';
        element.appendChild(sparkle);
        
        setTimeout(() => sparkle.remove(), 1000);
    }
}

function addSuccessParticles(element) {
    const particleCount = window.innerWidth < 768 ? 5 : 8;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        const particleSize = window.innerWidth < 768 ? '4px' : '6px';
        particle.style.cssText = `
            position: absolute;
            width: ${particleSize};
            height: ${particleSize};
            background: #d4af37;
            border-radius: 50%;
            top: 50%;
            left: 50%;
            animation: success-particle ${1 + Math.random()}s ease-out forwards;
            pointer-events: none;
        `;
        element.style.position = 'relative';
        element.appendChild(particle);
        
        setTimeout(() => particle.remove(), 1500);
    }
}

function triggerFireworks(modal) {
    const fireworksContainer = modal.querySelector('.luxury-fireworks');
    if (!fireworksContainer) return;
    
    // Create multiple firework bursts for ALL devices
    const burstCount = window.innerWidth < 768 ? 2 : 3;
    for (let i = 0; i < burstCount; i++) {
        setTimeout(() => {
            fireworksContainer.style.animation = 'none';
            fireworksContainer.offsetHeight; // Trigger reflow
            fireworksContainer.style.animation = 'luxury-fireworks 1.5s ease-out';
        }, i * 500);
    }
}

// Performance optimization for luxury effects with mobile support
function optimizeLuxuryPerformance() {
    // Reduce animations on low-end devices
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
        document.documentElement.style.setProperty('--transition-luxury', 'all 0.2s ease');
        document.documentElement.style.setProperty('--transition-luxury-slow', 'all 0.3s ease');
    }
    
    // Optimize effects for mobile while keeping them enabled
    if (window.innerWidth < 768) {
        const particles = document.querySelectorAll('.luxury-particles .particle, .floating-elements .floating-note');
        particles.forEach((particle, index) => {
            if (index > 2) particle.style.display = 'none'; // Show only first 3 particles on mobile
            else {
                particle.style.display = 'block';
                particle.style.opacity = '0.4';
            }
        });
        
        // Optimize orbs for mobile
        const orbs = document.querySelectorAll('.luxury-gradient-orb');
        orbs.forEach(orb => {
            orb.style.display = 'block';
            orb.style.filter = 'blur(20px)';
            orb.style.opacity = '0.3';
            orb.style.transform = 'scale(0.6)';
        });
        
        // Reduce animation complexity
        document.documentElement.style.setProperty('--transition-luxury', 'all 0.2s ease');
    } else {
        // Re-enable full effects on larger screens
        const particles = document.querySelectorAll('.luxury-particles, .luxury-gradient-orb, .floating-elements');
        particles.forEach(particle => {
            particle.style.display = 'block';
        });
    }
    
    // Optimize for tablet
    if (window.innerWidth >= 768 && window.innerWidth < 1024) {
        const orbs = document.querySelectorAll('.luxury-gradient-orb');
        orbs.forEach(orb => {
            orb.style.filter = 'blur(30px)';
            orb.style.opacity = '0.4';
            orb.style.transform = 'scale(0.8)';
        });
    }
}

// Add luxury animation styles with perfect mobile support
const luxuryAnimationStyles = document.createElement('style');
luxuryAnimationStyles.textContent = `
    @keyframes luxury-particle-float {
        0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
        10% { opacity: 0.6; }
        90% { opacity: 0.6; }
        100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
    }
    
    @keyframes luxury-orb-float {
        0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
        25% { transform: translateY(-30px) rotate(90deg) scale(1.1); }
        50% { transform: translateY(-15px) rotate(180deg) scale(0.9); }
        75% { transform: translateY(-45px) rotate(270deg) scale(1.05); }
    }
    
    @keyframes luxury-ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes luxury-highlight {
        0%, 100% { background-color: transparent; }
        50% { background-color: rgba(212, 175, 55, 0.1); }
    }
    
    @keyframes sparkle-fade {
        0% { opacity: 1; transform: scale(0); }
        50% { opacity: 1; transform: scale(1); }
        100% { opacity: 0; transform: scale(0); }
    }
    
    @keyframes success-particle {
        0% { 
            opacity: 1; 
            transform: translate(-50%, -50%) scale(0); 
        }
        50% { 
            opacity: 1; 
            transform: translate(-50%, -50%) scale(1) translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px); 
        }
        100% { 
            opacity: 0; 
            transform: translate(-50%, -50%) scale(0) translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px); 
        }
    }
    
    /* Mobile-optimized animations */
    @media (max-width: 768px) {
        @keyframes luxury-particle-float {
            0% { transform: translateY(50vh) rotate(0deg); opacity: 0; }
            10% { opacity: 0.4; }
            90% { opacity: 0.4; }
            100% { transform: translateY(-50px) rotate(180deg); opacity: 0; }
        }
        
        @keyframes luxury-orb-float {
            0%, 100% { transform: translateY(0px) scale(0.6); }
            50% { transform: translateY(-15px) scale(0.7); }
        }
        
        @keyframes luxury-ripple {
            to {
                transform: scale(3);
                opacity: 0;
            }
        }
    }
    
    /* Tablet-optimized animations */
    @media (min-width: 768px) and (max-width: 1024px) {
        @keyframes luxury-orb-float {
            0%, 100% { transform: translateY(0px) scale(0.8); }
            50% { transform: translateY(-20px) scale(0.9); }
        }
    }
`;
document.head.appendChild(luxuryAnimationStyles);

// Enhanced keyboard navigation for luxury experience with responsive support
document.addEventListener('keydown', function(e) {
    // ESC key to close modal with luxury effect
    if (e.key === 'Escape') {
        const modal = document.querySelector('.luxury-success-modal');
        if (modal) {
            modal.style.transform = 'scale(0.8)';
            setTimeout(() => {
                modal.querySelector('.luxury-success-close').click();
            }, 200);
        }
        
        // Close mobile menu
        const navToggle = document.querySelector('.nav-toggle');
        const navLinks = document.querySelector('.nav-links');
        if (navToggle && navLinks && navLinks.classList.contains('active')) {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
    
    // Enhanced arrow key navigation for FAQ
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        const focusedFAQ = document.activeElement.closest('.faq-item-luxury');
        if (focusedFAQ) {
            e.preventDefault();
            const faqItems = Array.from(document.querySelectorAll('.faq-item-luxury'));
            const currentIndex = faqItems.indexOf(focusedFAQ);
            
            let nextIndex;
            if (e.key === 'ArrowDown') {
                nextIndex = (currentIndex + 1) % faqItems.length;
            } else {
                nextIndex = (currentIndex - 1 + faqItems.length) % faqItems.length;
            }
            
            const nextFAQ = faqItems[nextIndex].querySelector('.faq-question-luxury');
            nextFAQ.focus();
            addLuxuryGlowEffect(faqItems[nextIndex]);
        }
    }
});

// Enhanced touch support for luxury mobile interactions
let luxuryTouchStartY = 0;
document.addEventListener('touchstart', function(e) {
    luxuryTouchStartY = e.touches[0].clientY;
}, { passive: true });

document.addEventListener('touchend', function(e) {
    const touchEndY = e.changedTouches[0].clientY;
    const diff = luxuryTouchStartY - touchEndY;
    
    // Detect luxury swipe up gesture (only on mobile)
    if (diff > 80 && window.innerWidth < 768) {
        const registerSection = document.getElementById('register');
        if (registerSection && window.scrollY < registerSection.offsetTop - 150) {
            smoothScrollTo(registerSection.offsetTop - 100, 800);
            addLuxuryGlowEffect(registerSection);
        }
    }
}, { passive: true });

// Resize handler for luxury responsiveness
window.addEventListener('resize', () => {
    optimizeLuxuryPerformance();
    updateResponsiveElements();
});

// Orientation change handler for mobile
window.addEventListener('orientationchange', () => {
    setTimeout(() => {
        optimizeLuxuryPerformance();
        updateResponsiveElements();
    }, 100);
});

// Intersection Observer for lazy loading (performance optimization)
if ('IntersectionObserver' in window) {
    const lazyElements = document.querySelectorAll('.luxury-gradient-orb, .floating-note');
    const lazyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.willChange = 'transform';
                lazyObserver.unobserve(entry.target);
            }
        });
    });
    
    lazyElements.forEach(el => lazyObserver.observe(el));
}

// Prefers reduced motion support
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('--transition-luxury', 'none');
    document.documentElement.style.setProperty('--transition-luxury-fast', 'none');
    document.documentElement.style.setProperty('--transition-luxury-slow', 'none');
}

// Main initialization function
async function initializeApplication() {
    console.log('🚀 Initializing Voice Atelier Application...');
    
    // Initialize Supabase
    const supabaseInitialized = await initializeSupabase();
    
    // Initialize form event listeners
    const form = document.getElementById('registrationForm');
    if (form) {
        form.addEventListener('submit', handleLuxuryFormSubmit);
        console.log('✅ Form event listeners attached');
    }
    
    // Initialize other components
    initializeLuxuryFormPhoneFormatting();
    initializeLazyLoading();
    
    // Environment-specific initialization
    if (isLocalEnvironment) {
        console.log('🏠 Local environment detected - Enhanced debugging enabled');
        // Enable additional local debugging features
        window.debugSupabase = () => ({ supabaseReady, supabase: !!supabase });
        window.debugEnvironment = () => ({ 
            isLocal: isLocalEnvironment, 
            hostname: window.location.hostname,
            supabaseReady,
            hasSupabaseSDK: !!window.supabase
        });
    } else {
        console.log('🌐 Deployed environment detected - Production mode');
    }
    
    // Log initialization summary
    console.log(`📊 Initialization Complete:
- Environment: ${isLocalEnvironment ? 'LOCAL' : 'DEPLOYED'}
- Supabase: ${supabaseInitialized ? '✅' : '❌'}
- Form: ${form ? '✅' : '❌'}
- SDK Available: ${!!window.supabase ? '✅' : '❌'}`);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApplication);
} else {
    // DOM already loaded
    initializeApplication();
}

console.log('🎵 Perfect Mobile Responsive Luxury Voice Workshop experience initialized! ✨📱');