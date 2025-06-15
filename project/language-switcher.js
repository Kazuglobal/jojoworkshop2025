// 言語切り替え機能

// HTMLから呼び出される関数（後方互換性のため）
function setLanguage(lang) {
    console.log('setLanguage called with:', lang); // デバッグ用
    switchLanguage(lang);
}

// グローバルに関数を公開
window.setLanguage = setLanguage;
window.switchLanguage = switchLanguage;

// 言語を切り替える関数
function switchLanguage(lang) {
    if (lang === currentLanguage) return;
    
    setCurrentLanguage(lang);
    updateLanguage();
    updateLanguageSwitcher();
    
    // アニメーション効果
    document.body.style.opacity = '0.8';
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 200);
}

// 全ての翻訳対象要素を更新
function updateLanguage() {
    // data-i18n属性を持つ要素を更新
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = t(key);
        
        if (element.tagName === 'INPUT') {
            if (element.type === 'submit' || element.type === 'button') {
                element.value = translation;
            } else {
                element.placeholder = translation;
            }
        } else if (element.tagName === 'OPTION') {
            element.textContent = translation;
        } else {
            // HTMLを含む場合はinnerHTMLを使用
            if (translation.includes('<')) {
                element.innerHTML = translation;
            } else {
                element.textContent = translation;
            }
        }
    });
    
    // 特別な処理が必要な要素
    updateSpecialElements();
    
    // フォームのバリデーションメッセージも更新
    updateFormValidation();
    
    // メタタグの更新
    updateMetaTags();
}

// 特別な処理が必要な要素の更新
function updateSpecialElements() {
    // ページタイトルの更新
    if (currentLanguage === 'en') {
        document.title = 'World-Class Voice Trainer JoJo Acosta Workshop | Voice Atelier';
    } else {
        document.title = '世界的ボイストレーナー ジョジョ・アコスタ氏ワークショップ | Voice Atelier';
    }
    
    // 学年セレクトボックスの更新
    updateGradeOptions();
    
    // 日付表示の更新
    updateDateFormats();
}

// 学年オプションの更新
function updateGradeOptions() {
    const gradeSelect = document.querySelector('select[name="grade"]');
    if (!gradeSelect) return;
    
    // 現在の選択値を保存
    const currentValue = gradeSelect.value;
    
    // オプションを更新
    const options = gradeSelect.querySelectorAll('option');
    options.forEach(option => {
        const value = option.value;
        if (value === '') {
            option.textContent = t('form_grade_placeholder');
        } else {
            // 学年の対応関係
            const gradeMap = {
                '小学1年生': 'grade_elementary_1',
                '小学2年生': 'grade_elementary_2', 
                '小学3年生': 'grade_elementary_3',
                '小学4年生': 'grade_elementary_4',
                '小学5年生': 'grade_elementary_5',
                '小学6年生': 'grade_elementary_6',
                '中学1年生': 'grade_junior_1',
                '中学2年生': 'grade_junior_2',
                '中学3年生': 'grade_junior_3'
            };
            
            const key = gradeMap[value];
            if (key) {
                option.textContent = t(key);
            }
        }
    });
    
    // 選択値を復元
    gradeSelect.value = currentValue;
}

// 日付フォーマットの更新
function updateDateFormats() {
    // 必要に応じて日付表示を言語に応じて調整
    const dateElements = document.querySelectorAll('.date-format');
    dateElements.forEach(element => {
        if (currentLanguage === 'en') {
            // 英語形式の日付フォーマットに変更
            element.textContent = element.textContent.replace(/年/g, ', ').replace(/月/g, '/').replace(/日/g, '');
        }
    });
}

// メタタグの更新
function updateMetaTags() {
    if (currentLanguage === 'en') {
        // 英語版のメタタグ
        document.querySelector('meta[name="description"]').content = 
            'June 21, 2025! Special workshop by international voice trainer JoJo Acosta from the Philippines. Direct instruction from a professional with experience coaching X-Factor, Les Misérables, and American Idol performers.';
        
        document.querySelector('meta[property="og:title"]').content = 
            'World-Class Voice Trainer JoJo Acosta Workshop';
        
        document.querySelector('meta[property="og:description"]').content = 
            'June 21, 2025! A special workshop to develop children\'s voices and confidence through professional instruction.';
        
        document.querySelector('meta[property="twitter:title"]').content = 
            'World-Class Voice Trainer JoJo Acosta Workshop';
        
        document.querySelector('meta[property="twitter:description"]').content = 
            'June 21, 2025! A special workshop to develop children\'s voices and confidence through professional instruction.';
    } else {
        // 日本語版のメタタグ（元に戻す）
        document.querySelector('meta[name="description"]').content = 
            '2025年6月21日開催！フィリピン出身の国際的ボイストレーナー、ジョジョ・アコスタ氏による子ども向け特別ワークショップ。X-Factor、レ・ミゼラブル出演者指導の実績を持つプロが直接指導。';
        
        document.querySelector('meta[property="og:title"]').content = 
            '世界的ボイストレーナー ジョジョ・アコスタ氏ワークショップ';
        
        document.querySelector('meta[property="og:description"]').content = 
            '2025年6月21日開催！プロの指導で子どもたちの歌声と自信を育てる特別なワークショップです。';
        
        document.querySelector('meta[property="twitter:title"]').content = 
            '世界的ボイストレーナー ジョジョ・アコスタ氏ワークショップ';
        
        document.querySelector('meta[property="twitter:description"]').content = 
            '2025年6月21日開催！プロの指導で子どもたちの歌声と自信を育てる特別なワークショップです。';
    }
}

// フォームバリデーションメッセージの更新
function updateFormValidation() {
    // 既存のエラーメッセージがあれば更新
    const errorElements = document.querySelectorAll('.form-error-luxury');
    errorElements.forEach(element => {
        if (element.textContent) {
            // エラーメッセージの種類を判定して適切な翻訳を適用
            const errorText = element.textContent;
            if (errorText.includes('必須')) {
                element.textContent = t('form_error_required');
            } else if (errorText.includes('メール')) {
                element.textContent = t('form_error_email');
            } else if (errorText.includes('電話')) {
                element.textContent = t('form_error_phone');
            } else if (errorText.includes('2文字')) {
                element.textContent = t('form_error_name_length');
            } else if (errorText.includes('日本語')) {
                element.textContent = t('form_error_name_japanese');
            }
        }
    });
}

// 言語切り替えボタンの状態を更新
function updateLanguageSwitcher() {
    const languageSwitcher = document.querySelector('.language-switcher');
    if (languageSwitcher) {
        const buttons = languageSwitcher.querySelectorAll('.lang-btn');
        buttons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-lang') === currentLanguage) {
                btn.classList.add('active');
            }
        });
    }
    
    // モバイル版も更新
    updateMobileLanguageSwitcher();
}

// 言語切り替えボタンを初期化（HTML内の既存要素を使用）
function initLanguageSwitcher() {
    const existingSwitcher = document.querySelector('.language-switcher');
    if (existingSwitcher) {
        // 既存のスイッチャーがある場合は、クリックイベントのみ追加
        const buttons = existingSwitcher.querySelectorAll('.lang-btn');
        buttons.forEach(btn => {
            // 既存のイベントリスナーをクリア
            btn.replaceWith(btn.cloneNode(true));
        });
        
        // 新しいボタンにイベントリスナーを追加
        const newButtons = existingSwitcher.querySelectorAll('.lang-btn');
        newButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const lang = this.getAttribute('data-lang');
                console.log('Language button clicked:', lang); // デバッグ用
                switchLanguage(lang);
            });
            
            // タッチデバイス用のイベントも追加
            btn.addEventListener('touchstart', function(e) {
                e.preventDefault();
                const lang = this.getAttribute('data-lang');
                console.log('Language button touched:', lang); // デバッグ用
                switchLanguage(lang);
            });
        });
        updateLanguageSwitcher();
        return;
    }
    
    // フォールバック：既存のスイッチャーがない場合は作成
    const navLinks = document.querySelector('.nav-links');
    if (!navLinks) return;
    
    const languageSwitcher = document.createElement('div');
    languageSwitcher.className = 'language-switcher';
    languageSwitcher.innerHTML = `
        <button class="lang-btn" data-lang="ja">日本語</button>
        <span class="lang-separator">|</span>
        <button class="lang-btn" data-lang="en">English</button>
    `;
    
    // ナビゲーションリンクの前に挿入
    navLinks.insertBefore(languageSwitcher, navLinks.querySelector('.nav-cta-luxury'));
    
    // イベントリスナーを追加
    const buttons = languageSwitcher.querySelectorAll('.lang-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            switchLanguage(lang);
        });
    });
    
    updateLanguageSwitcher();
}

// ページ読み込み時の初期化
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing language switcher'); // デバッグ用
    
    // 少し遅延させて確実に初期化
    setTimeout(() => {
        initLanguageSwitcher();
        initMobileLanguageSwitcher();
        
        // URLパラメータから言語を取得
        const urlParams = new URLSearchParams(window.location.search);
        const langParam = urlParams.get('lang');
        if (langParam && (langParam === 'en' || langParam === 'ja')) {
            switchLanguage(langParam);
        }
    }, 100);
});

// さらに安全のため、ウィンドウが完全に読み込まれた後にも実行
window.addEventListener('load', function() {
    console.log('Window loaded, re-initializing language switcher'); // デバッグ用
    setTimeout(() => {
        initLanguageSwitcher();
        initMobileLanguageSwitcher();
    }, 100);
});

// モバイル用言語切り替えボタンの初期化
function initMobileLanguageSwitcher() {
    const mobileSwitcher = document.querySelector('.mobile-language-switcher');
    if (mobileSwitcher) {
        const buttons = mobileSwitcher.querySelectorAll('.mobile-lang-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const lang = this.getAttribute('data-lang');
                console.log('Mobile language button clicked:', lang);
                switchLanguage(lang);
            });
            
            btn.addEventListener('touchstart', function(e) {
                e.preventDefault();
                const lang = this.getAttribute('data-lang');
                console.log('Mobile language button touched:', lang);
                switchLanguage(lang);
            });
        });
        updateMobileLanguageSwitcher();
    }
}

// モバイル言語切り替えボタンの状態を更新
function updateMobileLanguageSwitcher() {
    const mobileSwitcher = document.querySelector('.mobile-language-switcher');
    if (!mobileSwitcher) return;
    
    const buttons = mobileSwitcher.querySelectorAll('.mobile-lang-btn');
    buttons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-lang') === currentLanguage) {
            btn.classList.add('active');
        }
    });
}


// 成功メッセージ関数を多言語対応に更新
function showLocalizedSuccessMessage() {
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
            <h3>${t('success_title')}</h3>
            <p>${t('success_message')}</p>
            <div class="luxury-success-details">
                <div class="luxury-detail-item">
                    <span class="luxury-detail-icon">📧</span>
                    <span>${t('success_email_sent')}</span>
                </div>
                <div class="luxury-detail-item">
                    <span class="luxury-detail-icon">📅</span>
                    <span>${t('success_date')}</span>
                </div>
                <div class="luxury-detail-item">
                    <span class="luxury-detail-icon">📍</span>
                    <span>${t('success_venue')}</span>
                </div>
            </div>
            <button class="luxury-success-close">${t('success_close')}</button>
        </div>
    `;
    
    // スタイルは既存のものを使用
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
    
    document.body.appendChild(modal);
    
    // アニメーション実行
    requestAnimationFrame(() => {
        modal.style.opacity = '1';
        content.style.transform = 'scale(1)';
    });
    
    // 閉じる機能
    const closeButton = modal.querySelector('.luxury-success-close');
    closeButton.addEventListener('click', () => {
        modal.style.opacity = '0';
        setTimeout(() => modal.remove(), 400);
    });
    
    // 10秒後に自動クローズ
    setTimeout(() => {
        if (document.body.contains(modal)) {
            closeButton.click();
        }
    }, 10000);
}

// エラーメッセージ関数を多言語対応に更新
function showLocalizedErrorMessage(message) {
    const modal = document.createElement('div');
    modal.className = 'luxury-error-modal';
    
    modal.innerHTML = `
        <div class="luxury-error-content">
            <div class="luxury-error-icon">⚠️</div>
            <h3>${t('error_title')}</h3>
            <p>${message}</p>
            <button onclick="this.parentElement.parentElement.remove()" class="luxury-error-close">
                ${t('error_close')}
            </button>
        </div>
    `;
    
    // 既存のスタイルを適用
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
    
    document.body.appendChild(modal);
    
    // 5秒後に自動削除
    setTimeout(() => {
        if (modal.parentNode) {
            modal.remove();
        }
    }, 5000);
}