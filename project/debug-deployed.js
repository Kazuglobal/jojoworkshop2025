// Comprehensive Debug Script for Deployed Voice Atelier Site
// Copy and paste this entire script into the browser console on the live site

(function() {
    console.log('🔍 VOICE ATELIER DEPLOYMENT DEBUG SCRIPT');
    console.log('==========================================');
    
    // Step 1: Basic Environment Check
    console.log('🌍 ENVIRONMENT CHECK:');
    console.log(`URL: ${window.location.href}`);
    console.log(`Hostname: ${window.location.hostname}`);
    console.log(`User Agent: ${navigator.userAgent}`);
    console.log(`Window loaded: ${document.readyState}`);
    
    // Step 2: DOM Elements Check
    console.log('\n📋 DOM ELEMENTS CHECK:');
    
    // Check for form section
    const registerSection = document.getElementById('register');
    console.log(`Register section (#register): ${registerSection ? '✅ Found' : '❌ Missing'}`);
    if (registerSection) {
        console.log(`  - Visible: ${registerSection.offsetHeight > 0 ? '✅' : '❌'}`);
        console.log(`  - Position: top=${registerSection.offsetTop}px`);
    }
    
    // Check for registration form
    const registrationForm = document.getElementById('registrationForm');
    console.log(`Registration form: ${registrationForm ? '✅ Found' : '❌ Missing'}`);
    if (registrationForm) {
        const requiredFields = registrationForm.querySelectorAll('[required]');
        console.log(`  - Required fields: ${requiredFields.length}`);
        console.log(`  - Has submit handler: ${registrationForm.onsubmit ? '✅' : '❌'}`);
    }
    
    // Check application buttons
    const scrollButtons = document.querySelectorAll('[onclick*="scrollToForm"]');
    console.log(`Application buttons: ${scrollButtons.length} found`);
    scrollButtons.forEach((btn, i) => {
        console.log(`  - Button ${i+1}: "${btn.textContent.trim()}" (${btn.tagName})`);
    });
    
    // Step 3: JavaScript Functions Check
    console.log('\n⚡ JAVASCRIPT FUNCTIONS CHECK:');
    
    const criticalFunctions = [
        'scrollToForm',
        'handleLuxuryFormSubmit', 
        'sendUserConfirmationViaFormsubmit',
        'sendBackupEmails',
        'initializeSupabase',
        'runCompleteTests'
    ];
    
    criticalFunctions.forEach(funcName => {
        const exists = typeof window[funcName] === 'function';
        console.log(`${funcName}: ${exists ? '✅' : '❌'}`);
        
        if (!exists && funcName === 'scrollToForm') {
            // Try to find it in different scopes
            const inlineExists = typeof scrollToForm === 'function';
            console.log(`  - Inline scrollToForm: ${inlineExists ? '✅' : '❌'}`);
        }
    });
    
    // Step 4: Script Loading Check
    console.log('\n📜 SCRIPT LOADING CHECK:');
    const scripts = document.querySelectorAll('script');
    console.log(`Total scripts: ${scripts.length}`);
    
    scripts.forEach((script, i) => {
        if (script.src) {
            console.log(`  - External ${i+1}: ${script.src}`);
        } else if (script.textContent.includes('scrollToForm')) {
            console.log(`  - Inline ${i+1}: Contains scrollToForm ✅`);
        } else if (script.textContent.length > 100) {
            console.log(`  - Inline ${i+1}: ${script.textContent.substring(0, 50)}...`);
        }
    });
    
    // Step 5: Console Errors Check
    console.log('\n❌ CHECKING FOR ERRORS:');
    const originalError = console.error;
    const errors = [];
    console.error = function(...args) {
        errors.push(args.join(' '));
        originalError.apply(console, args);
    };
    
    // Test scrollToForm function
    try {
        if (typeof scrollToForm === 'function') {
            console.log('Testing scrollToForm function...');
            scrollToForm();
            console.log('✅ scrollToForm executed without error');
        } else if (typeof window.scrollToForm === 'function') {
            console.log('Testing window.scrollToForm function...');
            window.scrollToForm();
            console.log('✅ window.scrollToForm executed without error');
        } else {
            console.error('❌ scrollToForm function not accessible');
        }
    } catch (error) {
        console.error('❌ scrollToForm execution error:', error);
    }
    
    // Step 6: Manual Button Test
    console.log('\n🖱️ MANUAL BUTTON TEST:');
    if (scrollButtons.length > 0) {
        const firstButton = scrollButtons[0];
        console.log('Testing first application button...');
        try {
            firstButton.click();
            console.log('✅ Button click executed');
        } catch (error) {
            console.error('❌ Button click error:', error);
        }
    }
    
    // Step 7: Form Submission Test
    console.log('\n📝 FORM SUBMISSION TEST:');
    if (registrationForm) {
        console.log('Form found. Testing email functions...');
        
        // Test email functions
        const emailFunctions = [
            'sendUserConfirmationViaFormsubmit',
            'sendBackupEmails'
        ];
        
        emailFunctions.forEach(funcName => {
            if (typeof window[funcName] === 'function') {
                console.log(`✅ ${funcName} is available`);
            } else {
                console.error(`❌ ${funcName} is missing`);
            }
        });
    }
    
    // Step 8: Network Connectivity Test
    console.log('\n🌐 NETWORK CONNECTIVITY TEST:');
    fetch('https://api.web3forms.com/submit', {
        method: 'HEAD'
    }).then(() => {
        console.log('✅ Web3Forms API reachable');
    }).catch(error => {
        console.error('❌ Web3Forms API unreachable:', error);
    });
    
    fetch('https://formsubmit.co/', {
        method: 'HEAD',
        mode: 'no-cors'
    }).then(() => {
        console.log('✅ Formsubmit API reachable');
    }).catch(error => {
        console.error('❌ Formsubmit API unreachable:', error);
    });
    
    // Step 9: Quick Fixes
    console.log('\n🔧 AVAILABLE QUICK FIXES:');
    
    // Define emergency scrollToForm function
    window.emergencyScrollToForm = function() {
        console.log('🚨 Emergency scrollToForm called');
        const target = document.getElementById('register');
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            console.log('✅ Emergency scroll successful');
        } else {
            console.error('❌ Target not found');
        }
    };
    
    // Fix application buttons if needed
    window.fixApplicationButtons = function() {
        console.log('🔧 Fixing application buttons...');
        const buttons = document.querySelectorAll('[onclick*="scrollToForm"]');
        buttons.forEach((btn, i) => {
            btn.onclick = function(e) {
                e.preventDefault();
                window.emergencyScrollToForm();
            };
            console.log(`✅ Fixed button ${i+1}`);
        });
        console.log(`🎯 Fixed ${buttons.length} buttons`);
    };
    
    // Test email sending with real data
    window.testEmailSendingLive = async function() {
        console.log('📧 Testing live email sending...');
        
        const testData = {
            child_name: 'デバッグテスト太郎',
            grade: '小学3年生',
            parent_name: 'デバッグテスト花子',
            email: 'debug.test@example.com',
            phone: '090-1234-5678',
            experience: '初心者（歌を習ったことがない）',
            special_needs: 'ライブデバッグテスト用',
            created_at: new Date().toISOString()
        };
        
        if (typeof sendUserConfirmationViaFormsubmit === 'function') {
            try {
                await sendUserConfirmationViaFormsubmit(testData, false);
                console.log('✅ User email test PASSED');
            } catch (error) {
                console.error('❌ User email test FAILED:', error);
            }
        } else {
            console.error('❌ sendUserConfirmationViaFormsubmit not available');
        }
    };
    
    console.log('\n📋 MANUAL COMMANDS AVAILABLE:');
    console.log('- emergencyScrollToForm() - Emergency scroll function');
    console.log('- fixApplicationButtons() - Fix broken application buttons');
    console.log('- testEmailSendingLive() - Test email sending with real API calls');
    
    console.log('\n🏁 DEBUG COMPLETE. Check results above for issues.');
    
    // Auto-fix if problems detected
    if (scrollButtons.length > 0 && typeof scrollToForm !== 'function' && typeof window.scrollToForm !== 'function') {
        console.log('🚨 AUTO-FIXING: ScrollToForm function missing, applying emergency fix...');
        window.fixApplicationButtons();
    }
    
})();