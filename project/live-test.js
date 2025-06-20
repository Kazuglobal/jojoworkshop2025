// Live Site Test Script for Voice Atelier
// Run this in browser console on the deployed site

console.log('🧪 Starting Live Site Tests...');

// Test 1: Check if scrollToForm function exists and works
function testScrollToFormLive() {
    console.log('🔍 Test 1: ScrollToForm Function');
    
    // Check if function exists
    if (typeof window.scrollToForm === 'function') {
        console.log('✅ scrollToForm function exists');
        
        // Check if target element exists
        const targetForm = document.getElementById('register');
        if (targetForm) {
            console.log('✅ Target form section (#register) exists');
            
            // Test the function
            try {
                window.scrollToForm();
                console.log('✅ scrollToForm() executed successfully');
                return true;
            } catch (error) {
                console.error('❌ scrollToForm() execution failed:', error);
                return false;
            }
        } else {
            console.error('❌ Target form section (#register) not found');
            return false;
        }
    } else {
        console.error('❌ scrollToForm function not found');
        return false;
    }
}

// Test 2: Check all application buttons
function testApplicationButtons() {
    console.log('🔍 Test 2: Application Buttons');
    
    const buttons = document.querySelectorAll('[onclick*="scrollToForm"]');
    console.log(`Found ${buttons.length} application buttons`);
    
    if (buttons.length > 0) {
        buttons.forEach((button, index) => {
            console.log(`Button ${index + 1}: ${button.textContent.trim()}`);
        });
        console.log('✅ Application buttons found');
        return true;
    } else {
        console.error('❌ No application buttons found');
        return false;
    }
}

// Test 3: Check form submission setup
function testFormSubmission() {
    console.log('🔍 Test 3: Form Submission Setup');
    
    const form = document.getElementById('registrationForm');
    if (form) {
        console.log('✅ Registration form found');
        
        // Check if form has event listener
        const hasSubmitHandler = form.onsubmit !== null;
        console.log(`Form submit handler: ${hasSubmitHandler ? '✅ Present' : '❌ Missing'}`);
        
        // Check required fields
        const requiredFields = form.querySelectorAll('[required]');
        console.log(`Required fields: ${requiredFields.length}`);
        
        return true;
    } else {
        console.error('❌ Registration form not found');
        return false;
    }
}

// Test 4: Check email functions
function testEmailFunctions() {
    console.log('🔍 Test 4: Email Functions');
    
    const emailFunctions = [
        'sendUserConfirmationViaFormsubmit',
        'sendBackupEmails',
        'sendNotificationEmails'
    ];
    
    let allPresent = true;
    emailFunctions.forEach(funcName => {
        if (typeof window[funcName] === 'function') {
            console.log(`✅ ${funcName} function exists`);
        } else {
            console.error(`❌ ${funcName} function missing`);
            allPresent = false;
        }
    });
    
    return allPresent;
}

// Test 5: Environment and initialization
function testEnvironmentSetup() {
    console.log('🔍 Test 5: Environment Setup');
    
    console.log(`Environment: ${window.location.hostname}`);
    console.log(`Supabase SDK: ${typeof window.supabase !== 'undefined' ? '✅ Loaded' : '❌ Missing'}`);
    
    // Check for debug functions
    const debugFunctions = ['debugFormLink', 'debugEnvironment', 'checkEmailLogs'];
    debugFunctions.forEach(funcName => {
        const exists = typeof window[funcName] === 'function';
        console.log(`${funcName}: ${exists ? '✅' : '❌'}`);
    });
    
    return true;
}

// Manual form submission test
function testFormSubmissionManual() {
    console.log('🔍 Manual Form Submission Test');
    
    const form = document.getElementById('registrationForm');
    if (!form) {
        console.error('❌ Form not found');
        return;
    }
    
    // Fill form with test data
    const testData = {
        childName: 'テスト太郎',
        grade: '小学3年生',
        parentName: 'テスト花子',
        email: 'test@example.com',
        phone: '090-1234-5678',
        experience: '初心者（歌を習ったことがない）',
        specialNeeds: 'ライブテスト用の申込みです'
    };
    
    Object.keys(testData).forEach(name => {
        const field = form.querySelector(`[name="${name}"]`);
        if (field) {
            field.value = testData[name];
            console.log(`✅ Filled ${name}: ${testData[name]}`);
        } else {
            console.error(`❌ Field ${name} not found`);
        }
    });
    
    console.log('📝 Form filled with test data. Submit manually to test email sending.');
}

// Run all tests
function runAllLiveTests() {
    console.log('🚀 Running All Live Tests...');
    
    const results = {
        scrollToForm: testScrollToFormLive(),
        applicationButtons: testApplicationButtons(),
        formSubmission: testFormSubmission(),
        emailFunctions: testEmailFunctions(),
        environment: testEnvironmentSetup()
    };
    
    console.log('📊 Test Results Summary:');
    Object.entries(results).forEach(([test, passed]) => {
        console.log(`${test}: ${passed ? '✅ PASSED' : '❌ FAILED'}`);
    });
    
    const allPassed = Object.values(results).every(result => result);
    console.log(`\n🏁 Overall Result: ${allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);
    
    if (!allPassed) {
        console.log('\n🔧 Suggested fixes:');
        if (!results.scrollToForm) {
            console.log('- Check if scrollToForm function is properly defined');
            console.log('- Verify target element #register exists');
        }
        if (!results.applicationButtons) {
            console.log('- Check if onclick="scrollToForm()" attributes are present');
        }
        if (!results.emailFunctions) {
            console.log('- Verify script.js is loaded correctly');
            console.log('- Check for JavaScript errors in console');
        }
    }
    
    return results;
}

// Quick fix attempt
function quickFixScrollToForm() {
    console.log('🔧 Attempting Quick Fix for ScrollToForm...');
    
    // Define scrollToForm function directly
    window.scrollToForm = function() {
        console.log('📍 ScrollToForm called (quick fix)');
        const formSection = document.getElementById('register');
        if (formSection) {
            formSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
            console.log('✅ Scrolled to form successfully');
        } else {
            console.error('❌ Form section not found');
        }
    };
    
    console.log('✅ Quick fix applied. Try clicking application buttons now.');
}

// Auto-run basic tests
runAllLiveTests();

// Make functions available globally for manual testing
window.runAllLiveTests = runAllLiveTests;
window.testFormSubmissionManual = testFormSubmissionManual;
window.quickFixScrollToForm = quickFixScrollToForm;

console.log('\n📋 Available Manual Tests:');
console.log('- runAllLiveTests() - Run all tests again');
console.log('- testFormSubmissionManual() - Fill form with test data');
console.log('- quickFixScrollToForm() - Apply quick fix for scroll function');
console.log('- scrollToForm() - Test scroll function directly');