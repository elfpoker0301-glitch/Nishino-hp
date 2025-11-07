// スクリプトの重複実行を防ぐ
if (window.scriptInitialized) {
    console.warn('script.js が既に読み込まれています。重複実行を防止します。');
} else {
    window.scriptInitialized = true;
    console.log('script.js を初期化します。');
}

// デバッグモード制御
const DEBUG_MODE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
function debugLog(message, data = null) {
    if (DEBUG_MODE) {
        if (data) {
            console.log(message, data);
        } else {
            console.log(message);
        }
    }
}

// ローディング画面制御
document.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.getElementById('loading-screen');
    const mainContent = document.getElementById('main-content');
    
    // 毎回ローディングアニメーションを表示
    debugLog('ローディングアニメーションを表示');
    
    let assetsLoaded = false;
    let minimumTimeElapsed = false;

    // 最低表示時間（2.5秒）のタイマー
    setTimeout(() => {
        minimumTimeElapsed = true;
        checkAndHideLoading();
    }, 2500);

    // すべてのリソースが読み込まれた後
    window.addEventListener('load', () => {
        assetsLoaded = true;
        checkAndHideLoading();
    });

    // ローディングを隠す条件をチェック
    function checkAndHideLoading() {
        if (assetsLoaded && minimumTimeElapsed) {
            hideLoading();
        }
    }

    // ローディング画面を隠してメインコンテンツを表示
    function hideLoading() {
        loadingScreen.classList.add('fade-out');
        mainContent.classList.add('show');
        
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 800);
    }

    // プログレスバーアニメーション
    const progressFill = document.querySelector('.progress-fill');
    if (progressFill) {
        setTimeout(() => {
            progressFill.style.width = '100%';
        }, 500);
    }
});

// DOM要素の取得
const mobileMenu = document.getElementById('mobile-menu');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const contactForm = document.getElementById('contactForm');

// 施工実績のフィルター機能
document.addEventListener('DOMContentLoaded', () => {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const workCards = document.querySelectorAll('.work-card');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.getAttribute('data-category');
            
            // アクティブなタブの切り替え
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // カードのフィルタリング
            workCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                if (category === 'all' || cardCategory === category) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeInUp 0.5s ease';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
});

// モバイルメニューの切り替え
if (mobileMenu && navMenu) {
    mobileMenu.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// ナビゲーションリンクのクリック時にモバイルメニューを閉じる
if (navLinks.length > 0 && mobileMenu && navMenu) {
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// スムーズスクロール機能
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// スクロール時のヘッダー背景変更
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
});

// セクションのフェードインアニメーション
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

// 観察する要素を設定
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.service-card, .about-text, .contact-form, .stat');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// お問い合わせフォームの処理
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // フォームデータの取得
    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const company = formData.get('company');
    const message = formData.get('message');
    
    // 簡単なバリデーション
    if (!name || !email || !message) {
        showNotification('必須項目を入力してください。', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('有効なメールアドレスを入力してください。', 'error');
        return;
    }
    
    // 送信処理のシミュレーション（実際の実装では、サーバーへのAPI呼び出しを行う）
    showNotification('送信中...', 'info');
    
    setTimeout(() => {
        showNotification('お問い合わせありがとうございます。2営業日以内にご返信いたします。', 'success');
        contactForm.reset();
    }, 2000);
    });
}

// メールアドレスのバリデーション
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// 通知メッセージの表示
function showNotification(message, type = 'info') {
    // 既存の通知を削除
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // 新しい通知を作成
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // スタイルを適用
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 9999;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        font-weight: 500;
    `;
    
    document.body.appendChild(notification);
    
    // アニメーション
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // 自動削除
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 4000);
}

// 通知の色を取得
function getNotificationColor(type) {
    switch (type) {
        case 'success':
            return '#10b981';
        case 'error':
            return '#ef4444';
        case 'info':
            return '#3b82f6';
        default:
            return '#6b7280';
    }
}

// 統計数値のカウントアップアニメーション
function animateCounter(element, start, end, duration) {
    let current = start;
    const increment = (end - start) / (duration / 10);
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current) + (element.textContent.includes('+') ? '+' : '') + 
                            (element.textContent.includes('年') ? '年' : '');
    }, 10);
}

// 統計セクションが表示されたときにカウントアップを開始
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const text = stat.textContent;
                const number = parseInt(text.replace(/\D/g, ''));
                if (number) {
                    stat.textContent = '0' + text.replace(/\d+/, '');
                    animateCounter(stat, 0, number, 2000);
                }
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// 統計セクションを観察
document.addEventListener('DOMContentLoaded', () => {
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }
});

// パフォーマンス最適化：スクロールイベントのスロットリング
let isScrolling = false;
window.addEventListener('scroll', () => {
    if (!isScrolling) {
        window.requestAnimationFrame(() => {
            // スクロール時の処理をここに追加
            isScrolling = false;
        });
        isScrolling = true;
    }
});

// ページロード時のアニメーション
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // ヒーローセクションの遅延アニメーション
    setTimeout(() => {
        const heroElements = document.querySelectorAll('.hero-title, .hero-description, .hero-buttons');
        heroElements.forEach((el, index) => {
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }, 500);
});

// レスポンシブ対応：ウィンドウサイズ変更時の処理
window.addEventListener('resize', () => {
    // モバイルメニューが開いている場合、デスクトップサイズで閉じる
    if (window.innerWidth > 768) {
        mobileMenu.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// お知らせ読み込み関数
function loadNews() {
    const newsContainer = document.getElementById('news-list');
    const newsData = JSON.parse(localStorage.getItem('news') || '[]');
    
    debugLog('loadNews実行:', {
        newsContainer: !!newsContainer,
        newsDataLength: newsData.length,
        currentPath: window.location.pathname
    });
    
    if (!newsContainer) {
        debugLog('お知らせコンテナが見つかりません');
        return;
    }
    
    if (newsData.length === 0) {
        newsContainer.innerHTML = '<div class="no-news"><p>お知らせはありません。</p></div>';
        return;
    }
    
    // 最新2件のお知らせを表示
    const recentNews = newsData.slice(0, 2);
    
    newsContainer.innerHTML = recentNews.map(item => `
        <div class="news-item">
            <div class="news-meta">
                <div class="news-date">${formatDate(item.date)}</div>
                <div class="news-category category-${item.category}">${getCategoryName(item.category)}</div>
            </div>
            <div class="news-content">
                <h3 class="news-title">${item.title}</h3>
                <p class="news-excerpt">${item.content}</p>
            </div>
        </div>
    `).join('');
}

// 管理画面連携: 会社情報を読み込み
function loadCompanyInfo() {
    const companyData = JSON.parse(localStorage.getItem('companyInfo') || '{}');
    debugLog('loadCompanyInfo実行:', {
        companyData: companyData,
        hasCompanyName: !!companyData.companyName,
        currentPath: window.location.pathname
    });
    
    // 会社名の更新
    const companyNameElements = document.querySelectorAll('.company-name, .footer-company-name');
    debugLog('会社名要素検索結果:', companyNameElements.length + '個');
    companyNameElements.forEach(element => {
        if (companyData.companyName) {
            debugLog('会社名を更新:', element.tagName, companyData.companyName);
            element.textContent = companyData.companyName;
        }
    });
    
    // 連絡先情報の更新
    const phoneElements = document.querySelectorAll('.contact-phone, .footer-phone');
    phoneElements.forEach(element => {
        if (companyData.phone) {
            element.textContent = companyData.phone;
        }
    });
    
    // メールアドレスの更新
    const emailElements = document.querySelectorAll('.contact-email, .footer-email');
    emailElements.forEach(element => {
        if (companyData.email) {
            element.textContent = companyData.email;
        }
    });
    
    // 住所の更新
    const addressElements = document.querySelectorAll('.company-address, .footer-address');
    debugLog('住所要素検索結果:', addressElements.length + '個');
    addressElements.forEach(element => {
        if (companyData.address) {
            debugLog('住所を更新:', element.tagName, companyData.address);
            element.textContent = companyData.address;
        }
    });
    
    // 代表者名の更新
    const representativeElements = document.querySelectorAll('.company-representative');
    representativeElements.forEach(element => {
        if (companyData.representative) {
            element.textContent = companyData.representative;
        }
    });
    
    // FAX番号の更新
    const faxElements = document.querySelectorAll('.contact-fax, .footer-fax');
    faxElements.forEach(element => {
        if (companyData.fax) {
            element.textContent = companyData.fax;
        }
    });
    
    debugLog('loadCompanyInfo完了');
}

// 管理画面連携: 事業案内を読み込み
function loadServices() {
    const servicesData = JSON.parse(localStorage.getItem('services') || '[]');
    debugLog('loadServices実行開始:', {
        servicesDataLength: servicesData.length,
        currentPath: window.location.pathname,
        servicesData: servicesData
    });
    
    // 各ページの事業案内コンテナを検索
    const servicesContainer = document.querySelector('.services-grid');
    const businessGrid = document.querySelector('.business-grid');
    const serviceDetailsContainer = document.querySelector('.services-details');
    
    debugLog('コンテナ検索結果:', {
        servicesContainer: !!servicesContainer,
        businessGrid: !!businessGrid, 
        serviceDetailsContainer: !!serviceDetailsContainer,
        servicesContainerHTML: servicesContainer ? servicesContainer.outerHTML.substring(0, 150) + '...' : 'null'
    });
    

    
    if (servicesData.length === 0) {
        debugLog('事業案内データがありません - デフォルトデータで初期化します');
        // デフォルトデータを再初期化
        initializeServicesData();
        // 再度データを取得
        const newServicesData = JSON.parse(localStorage.getItem('services') || '[]');
        if (newServicesData.length > 0) {
            debugLog('デフォルトデータで再実行:', newServicesData);
            loadServicesContent(newServicesData);
        }
        return;
    }
    
    loadServicesContent(servicesData);
    
    // services.htmlページの場合、追加で確実にコンテンツを読み込み
    if (window.location.pathname.endsWith('services.html')) {
        debugLog('services.htmlページのため、詳細コンテンツを追加読み込み');
        setTimeout(() => {
            const serviceDetailsContainer = document.querySelector('.services-details');
            if (serviceDetailsContainer && servicesData.length > 0) {
                loadServicesContent(servicesData);
            }
        }, 100);
    }
}

// 事業案内コンテンツを実際に読み込む関数
function loadServicesContent(servicesData) {
    const servicesContainer = document.querySelector('.services-grid');
    const businessGrid = document.querySelector('.business-grid');
    const serviceDetailsContainer = document.querySelector('.services-details');
    
    debugLog('loadServicesContent実行:', {
        servicesData: servicesData,
        containers: {
            servicesContainer: !!servicesContainer,
            businessGrid: !!businessGrid,
            serviceDetailsContainer: !!serviceDetailsContainer
        }
    });
    
    // フォールバックコンテンツを削除
    if (servicesContainer) {
        const fallbackElements = servicesContainer.querySelectorAll('.fallback-content');
        fallbackElements.forEach(element => element.remove());
    }
    
    // ホームページの事業案内セクション（コンパクト表示）
    if (servicesContainer) {
        const isCompact = servicesContainer.classList.contains('services-grid-compact');
        debugLog(`ホームページ事業案内セクション処理開始:`, {
            isCompact: isCompact,
            servicesDataLength: servicesData.length,
            servicesData: servicesData
        });
        servicesContainer.innerHTML = servicesData.map(service => `
            <div class="service-card ${isCompact ? 'service-card-compact' : ''}">
                <div class="service-icon">${service.icon || '⚙️'}</div>
                <h3 class="service-title">${service.name}</h3>
                <p class="service-description">${service.description}</p>
                ${service.details && !isCompact ? `<div class="service-details">${service.details}</div>` : ''}
            </div>
        `).join('');
        debugLog(`ホーム事業案内を読み込み完了: ${servicesData.length}件`);
        debugLog('生成されたHTML:', servicesContainer.innerHTML.substring(0, 200) + '...');
    }
    
    // 会社概要ページの詳細事業内容
    if (businessGrid) {
        businessGrid.innerHTML = servicesData.map(service => `
            <div class="business-item">
                <h4>${service.name}</h4>
                <p>${service.description}</p>
            </div>
        `).join('');
        debugLog(`会社概要事業内容を読み込み: ${servicesData.length}件`);
    }
    
    // 事業案内ページの詳細表示
    if (serviceDetailsContainer) {
        debugLog('services-detailsコンテナが見つかりました。データを読み込みます:', servicesData);
        serviceDetailsContainer.innerHTML = servicesData.map(service => `
            <div class="service-detail-card">
                <div class="service-header">
                    <div class="service-icon">${service.icon || '⚙️'}</div>
                    <div class="service-title">
                        <h3>${service.name}</h3>
                        ${service.subtitle ? `<p class="service-subtitle">${service.subtitle}</p>` : ''}
                    </div>
                </div>
                <div class="service-content">
                    <p class="service-description">
                        ${service.detailedDescription || service.description}
                    </p>
                    ${service.specs && service.specs.length > 0 ? `
                        <div class="service-specs">
                            <h4>対応範囲・仕様</h4>
                            <div class="specs-grid">
                                ${service.specs.map(spec => `
                                    <div class="spec-item">
                                        <strong>${spec.label}</strong>
                                        <span>${spec.value}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                    ${service.applications && service.applications.length > 0 ? `
                        <div class="service-applications">
                            <h4>主な用途</h4>
                            <ul>
                                ${service.applications.map(app => `<li>${app}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                    ${service.features && service.features.length > 0 ? `
                        <div class="service-features">
                            <h4>特徴・強み</h4>
                            <ul>
                                ${service.features.map(feature => `<li>${feature}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                </div>
            </div>
        `).join('');
        debugLog(`事業案内詳細ページを読み込み: ${servicesData.length}件`);
    }

    // フッターの事業案内リスト
    const footerServicesList = document.getElementById('footer-services-list');
    if (footerServicesList && servicesData.length > 0) {
        debugLog('フッター事業案内リストを更新:', servicesData.length);
        footerServicesList.innerHTML = servicesData.map(service => `
            <li><a href="services.html">${service.name}</a></li>
        `).join('');
        debugLog(`フッター事業案内を読み込み: ${servicesData.length}件`);
    }
}

// 管理画面連携: 実績情報を読み込み
function loadWorks() {
    const rawWorksData = localStorage.getItem('works');
    let worksData = JSON.parse(rawWorksData || '[]');
    const worksContainer = document.querySelector('.works-grid, .works-slider');
    
    debugLog('=== 工事実績データ読み込み開始 ===');
    debugLog('ローカルストレージの生データ:', rawWorksData);
    debugLog('パース後の工事実績データ:', worksData);
    debugLog('工事実績コンテナ:', worksContainer);
    debugLog('工事実績データ数:', worksData.length);
    
    if (worksData.length > 0) {
        debugLog('各工事実績の詳細:');
        worksData.forEach((work, index) => {
            debugLog(`  ${index + 1}. ${work.title} - ${work.image}`);
        });
    }
    
    if (!worksContainer) {
        debugLog('工事実績コンテナが見つかりません');
        return;
    }
    
    // 管理画面からのデータを優先し、データが0件の場合のみテストデータを使用
    if (worksData.length === 0) {
        debugLog('工事実績データが0件です - テストデータを生成');
        worksData = [
            {
                id: 1,
                title: 'ダイヤモンドコア工事実績',
                category: 'diamond-core',
                location: '福岡市博多区',
                description: 'φ300mmのコンクリート穿孔工事を実施',
                image: 'images/sample/work1.jpg',
                date: '2024-09-01'
            },
            {
                id: 2,
                title: 'アンカー工事実績',
                category: 'anchor',
                location: '福岡市中央区',
                description: 'ケミカルアンカーによる構造物固定工事',
                image: 'images/sample/work2.jpg',
                date: '2024-08-15'
            },
            {
                id: 3,
                title: '非破壊検査実績',
                category: 'inspection',
                location: '福岡市南区',
                description: 'X線透過検査による内部構造確認',
                image: 'images/sample/work3.jpg',
                date: '2024-07-20'
            }
        ];
        debugLog('テストデータ生成完了:', worksData);
    } else {
        debugLog('管理画面からの工事実績データを使用:', worksData.length + '件');
    }
    
    // 既存のコンテンツをクリア（フォールバックコンテンツを含む）
    worksContainer.innerHTML = '';
    debugLog('既存コンテンツをクリアしました');
    
    // スライダー形式の場合
    if (worksContainer.classList.contains('works-slider')) {
        debugLog('スライダー形式で工事実績を表示');
        // 既存の実績データを2倍にしてシームレスなループを作成
        const doubledWorks = [...worksData, ...worksData];
        
        const html = doubledWorks.map(work => {
            let imageUrl = work.image || 'images/sample/work1.jpg';
            
            // アップロード画像の場合はbase64データを使用
            if (imageUrl.startsWith('images/uploads/')) {
                const fileName = imageUrl.split('/').pop();
                const uploadedFiles = JSON.parse(localStorage.getItem('uploadedFiles') || '{}');
                const uploadData = uploadedFiles[fileName];
                if (uploadData && uploadData.dataUrl) {
                    imageUrl = uploadData.dataUrl;
                }
            }
            
            return `
            <div class="work-slide" data-category="${work.category}">
                <div class="work-image">
                    <img src="${imageUrl}" alt="${work.title}" loading="lazy">
                </div>
                <div class="work-info">
                    <h3 class="work-title">${work.title}</h3>
                    <p class="work-location">${work.location}</p>
                    <p class="work-description">${work.description}</p>
                </div>
            </div>
        `;
        `).join('');
        
        worksContainer.innerHTML = html;
        debugLog('スライダー形式HTML生成完了:', doubledWorks.length + '件');
        debugLog('生成されたHTML（先頭部分）:', html.substring(0, 200) + '...');
        debugLog('実際にDOMに設定されたHTML:', worksContainer.innerHTML.substring(0, 200) + '...');
    } else {
        debugLog('グリッド形式で工事実績を表示');
        // グリッド形式の場合
        const html = worksData.map(work => {
            let imageUrl = work.image || 'images/sample/work1.jpg';
            
            // アップロード画像の場合はbase64データを使用
            if (imageUrl.startsWith('images/uploads/')) {
                const fileName = imageUrl.split('/').pop();
                const uploadedFiles = JSON.parse(localStorage.getItem('uploadedFiles') || '{}');
                const uploadData = uploadedFiles[fileName];
                if (uploadData && uploadData.dataUrl) {
                    imageUrl = uploadData.dataUrl;
                }
            }
            
            return `
            <div class="work-card" data-category="${work.category}">
                <div class="work-image">
                    <img src="${imageUrl}" alt="${work.title}" loading="lazy">
                </div>
                <div class="work-content">
                    <h3 class="work-title">${work.title}</h3>
                    <p class="work-location">${work.location}</p>
                    <p class="work-description">${work.description}</p>
                    <div class="work-date">${formatDate(work.date)}</div>
                </div>
            </div>
            `;
        }).join('');
        
        worksContainer.innerHTML = html;
        debugLog('グリッド形式HTML生成完了:', worksData.length + '件');
        debugLog('実際にDOMに設定されたHTML:', worksContainer.innerHTML.substring(0, 200) + '...');
    }
    
    debugLog('=== 工事実績表示完了 ===');
}

// 工事実績ページ用の読み込み関数
function loadWorksPage() {
    let worksData = JSON.parse(localStorage.getItem('works') || '[]');
    const worksContainer = document.getElementById('works-container');
    const noWorksElement = document.getElementById('no-works');
    
    debugLog('工事実績ページのデータ読み込み開始');
    debugLog('工事実績データ:', worksData);
    debugLog('工事実績コンテナ:', worksContainer);
    
    if (!worksContainer) {
        debugLog('工事実績コンテナが見つかりません');
        return;
    }
    
    // データが0件の場合、テストデータを使用
    if (worksData.length === 0) {
        debugLog('工事実績データが0件です - テストデータを使用');
        worksData = [
            {
                id: 1,
                title: 'ダイヤモンドコア工事実績',
                category: 'diamond-core',
                location: '福岡市博多区',
                description: 'φ300mmのコンクリート穿孔工事を実施',
                image: 'images/sample/work1.jpg',
                date: '2024-09-01'
            },
            {
                id: 2,
                title: 'アンカー工事実績',
                category: 'anchor',
                location: '福岡市中央区',
                description: 'ケミカルアンカーによる構造物固定工事',
                image: 'images/sample/work2.jpg',
                date: '2024-08-15'
            },
            {
                id: 3,
                title: '非破壊検査実績',
                category: 'inspection',
                location: '福岡市南区',
                description: 'X線透過検査による内部構造確認',
                image: 'images/sample/work3.jpg',
                date: '2024-07-20'
            }
        ];
    }
    
    // 既存のコンテンツをクリア
    worksContainer.innerHTML = '';
    
    // 工事実績カードを生成（works.html用のスタイル）
    debugLog('各工事実績アイテムの詳細生成:');
    
    const html = worksData.map((work, index) => {
        let imageUrl = work.image || 'images/sample/work1.jpg';
        
        // アップロード画像の場合はbase64データを使用
        if (imageUrl.startsWith('images/uploads/')) {
            const fileName = imageUrl.split('/').pop();
            const uploadedFiles = JSON.parse(localStorage.getItem('uploadedFiles') || '{}');
            debugLog(`     - アップロード画像処理開始: ${fileName}`);
            debugLog(`     - uploadedFilesの内容:`, Object.keys(uploadedFiles));
            
            const uploadData = uploadedFiles[fileName];
            if (uploadData && uploadData.dataUrl) {
                imageUrl = uploadData.dataUrl;
                debugLog(`     - ✅ base64データを使用: ${fileName}`);
            } else {
                debugLog(`     - ❌ アップロードデータが見つからない: ${fileName}`);
                debugLog(`     - 利用可能なファイル:`, Object.keys(uploadedFiles));
                imageUrl = 'images/sample/work1.jpg';
            }
        }
        
        debugLog(`  ${index + 1}. ${work.title}`);
        debugLog(`     - 画像URL: ${imageUrl.substring(0, 50)}${imageUrl.length > 50 ? '...' : ''}`);
        debugLog(`     - カテゴリ: ${work.category}`);
        debugLog(`     - 場所: ${work.location}`);
        
        return `
        <div class="work-item" data-category="${work.category}">
            <div class="work-image">
                <img src="${imageUrl}" alt="${work.title}" loading="lazy" 
                     onerror="console.error('画像読み込みエラー:', this.src); console.log('デフォルト画像に切り替え'); this.src='images/sample/work1.jpg';"
                     onload="console.log('画像読み込み成功:', this.src);">
            </div>
            <div class="work-info">
                <h3 class="work-title">${work.title}</h3>
                <p class="work-category">${getWorkCategoryDisplayName(work.category)}</p>
                <p class="work-location">${work.location}</p>
                <p class="work-description">${work.description}</p>
                <div class="work-details">
                    <span class="detail-item">施工日: ${formatDate(work.date)}</span>
                </div>
            </div>
        </div>
        `;
    }).join('');
    
    worksContainer.innerHTML = html;
    debugLog('HTML生成完了、DOMに設定しました');
    debugLog('設定されたHTML内容（最初の500文字）:', html.substring(0, 500));
    debugLog('工事実績ページ表示完了:', worksData.length + '件');
    
    // DOM更新後の状況を確認
    setTimeout(() => {
        debugLog('=== DOM更新後の検証 ===');
        debugLog('worksContainer.children.length:', worksContainer.children.length);
        debugLog('worksContainer.innerHTML.length:', worksContainer.innerHTML.length);
        
        const workItems = worksContainer.querySelectorAll('.work-item');
        debugLog('work-item要素数:', workItems.length);
        
        workItems.forEach((item, index) => {
            debugLog(`Work Item ${index + 1}:`);
            debugLog('  - element:', item);
            debugLog('  - data-category:', item.getAttribute('data-category'));
            const img = item.querySelector('img');
            if (img) {
                debugLog('  - 画像要素:', img);
                debugLog('  - 画像src:', img.src);
                debugLog('  - 画像alt:', img.alt);
            } else {
                debugLog('  - 画像要素が見つかりません');
            }
        });
    }, 100);
    
    // 画像読み込み状況を確認
    setTimeout(() => {
        const images = worksContainer.querySelectorAll('img');
        debugLog('画像要素数:', images.length);
        images.forEach((img, index) => {
            if (img.complete) {
                if (img.naturalWidth === 0) {
                    debugLog(`画像 ${index + 1} 読み込み失敗:`, img.src);
                } else {
                    debugLog(`画像 ${index + 1} 読み込み成功:`, img.src);
                }
            } else {
                debugLog(`画像 ${index + 1} 読み込み中:`, img.src);
            }
        });
    }, 1000);
    
    // フィルター機能を初期化
    initializeWorksFilter();
}

// 工事実績のカテゴリ表示名を取得
function getWorkCategoryDisplayName(category) {
    const categories = {
        'diamond-core': 'ダイヤモンドコア工事',
        'anchor': 'アンカー工事', 
        'inspection': '非破壊検査'
    };
    return categories[category] || category;
}

// 工事実績ページのフィルター機能を初期化
function initializeWorksFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    if (filterButtons.length === 0) {
        debugLog('フィルターボタンが見つかりません');
        return;
    }
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            
            // アクティブボタンの切り替え
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // アイテムの表示/非表示
            filterWorkItems(filter);
        });
    });
    
    debugLog('工事実績フィルター機能を初期化しました');
}

// 工事実績アイテムのフィルタリング
function filterWorkItems(filter) {
    const workItems = document.querySelectorAll('.work-item');
    
    debugLog('フィルター適用:', filter, '対象アイテム数:', workItems.length);
    
    workItems.forEach((item, index) => {
        const category = item.getAttribute('data-category');
        
        if (filter === 'all' || category === filter) {
            item.style.display = 'block';
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 50);
        } else {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            setTimeout(() => {
                item.style.display = 'none';
            }, 300);
        }
    });
}

// 工事実績データのクリーンアップ
function cleanupWorksData() {
    const works = JSON.parse(localStorage.getItem('works') || '[]');
    
    if (works.length === 0) {
        debugLog('工事実績データが0件のため、クリーンアップをスキップ');
        return;
    }
    
    debugLog('工事実績データクリーンアップ開始:', works.length + '件');
    
    // 利用可能な画像リスト
    const availableImages = [
        'images/sample/work1.jpg',
        'images/sample/work2.jpg',
        'images/sample/work3.jpg',
        'images/sample/hero-bg.jpg',
        'images/sample/office.jpg',
        'images/sample/team.jpg',
        'images/nishibo-icon.png',
        'images/nishibo-logo.svg'
    ];
    
    let updated = false;
    
    const cleanedWorks = works.map((work, index) => {
        debugLog(`クリーンアップ対象 ${index + 1}: ${work.title} - 画像: ${work.image}`);
        
        if (!work.image || work.image.trim() === '') {
            debugLog('  → 空の画像パスをデフォルト画像に変更');
            work.image = 'images/sample/work1.jpg';
            updated = true;
        } else if (!availableImages.includes(work.image)) {
            debugLog('  → 無効な画像パス:', work.image, '-> images/sample/work1.jpg');
            work.image = 'images/sample/work1.jpg';
            updated = true;
        } else {
            debugLog('  → 画像パス正常:', work.image);
        }
        
        return work;
    });
    
    if (updated) {
        localStorage.setItem('works', JSON.stringify(cleanedWorks));
        debugLog('工事実績データをクリーンアップしました - 更新された項目があります');
    } else {
        debugLog('工事実績データのクリーンアップ完了 - 変更なし');
    }
}

// 管理画面連携: 統計データを読み込み
function loadStats() {
    const statsData = JSON.parse(localStorage.getItem('stats') || '{}');
    debugLog('loadStats実行:', statsData);
    
    // 統計数値を更新
    if (statsData.experience) {
        const experienceElement = document.querySelector('.stat-experience .stat-number');
        if (experienceElement) {
            experienceElement.textContent = statsData.experience + '年';
            debugLog('経験年数を更新:', statsData.experience + '年');
        }
    }
    
    if (statsData.projects) {
        const projectsElement = document.querySelector('.stat-projects .stat-number');
        if (projectsElement) {
            projectsElement.textContent = statsData.projects + '+';
            debugLog('プロジェクト数を更新:', statsData.projects + '+');
        }
    }
    
    if (statsData.clients) {
        const clientsElement = document.querySelector('.stat-clients .stat-number');
        if (clientsElement) {
            clientsElement.textContent = statsData.clients + '+';
            debugLog('顧客数を更新:', statsData.clients + '+');
        }
    }
    
    if (statsData.satisfaction) {
        const satisfactionElement = document.querySelector('.stat-satisfaction .stat-number');
        if (satisfactionElement) {
            satisfactionElement.textContent = statsData.satisfaction + '%';
            debugLog('満足度を更新:', statsData.satisfaction + '%');
        }
    }
    
    debugLog('loadStats完了');
}

// 管理画面連携: SEOデータを読み込み
function loadSEOData() {
    const seoData = JSON.parse(localStorage.getItem('seoData') || '{}');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const pageKey = currentPage.replace('.html', '') || 'index';
    const pageSEO = seoData[pageKey];
    
    debugLog('loadSEOData実行:', {
        currentPage: currentPage,
        pageKey: pageKey,
        pageSEO: pageSEO,
        allSEOData: seoData
    });
    
    if (pageSEO) {
        // ページタイトルの更新
        if (pageSEO.pageTitle) {
            document.title = pageSEO.pageTitle;
        }
        
        // メタディスクリプションの更新
        if (pageSEO.pageDescription) {
            const metaDescription = document.querySelector('meta[name="description"]');
            if (metaDescription) metaDescription.content = pageSEO.pageDescription;
        }
        
        // メタキーワードの更新
        if (pageSEO.pageKeywords) {
            const metaKeywords = document.querySelector('meta[name="keywords"]');
            if (metaKeywords) metaKeywords.content = pageSEO.pageKeywords;
        }
        
        // OGタイトルの更新
        if (pageSEO.ogTitle) {
            const ogTitle = document.querySelector('meta[property="og:title"]');
            if (ogTitle) ogTitle.content = pageSEO.ogTitle;
        }
        
        // OGディスクリプションの更新
        if (pageSEO.ogDescription) {
            const ogDescription = document.querySelector('meta[property="og:description"]');
            if (ogDescription) ogDescription.content = pageSEO.ogDescription;
        }
    }
}

// 管理画面連携: サイト設定を読み込み
function loadSiteSettings() {
    const siteSettings = JSON.parse(localStorage.getItem('siteSettings') || '{}');
    debugLog('loadSiteSettings実行:', siteSettings);
    
    // カラーテーマの適用
    if (siteSettings.primaryColor) {
        document.documentElement.style.setProperty('--primary-color', siteSettings.primaryColor);
        debugLog('プライマリカラーを適用:', siteSettings.primaryColor);
    }
    
    if (siteSettings.secondaryColor) {
        document.documentElement.style.setProperty('--secondary-color', siteSettings.secondaryColor);
        debugLog('セカンダリカラーを適用:', siteSettings.secondaryColor);
    }
    
    // ロゴの更新
    const logoData = JSON.parse(localStorage.getItem('logoData') || '{}');
    if (logoData.dataUrl) {
        const logoElements = document.querySelectorAll('.site-logo, .header-logo, img[alt*="ロゴ"]');
        debugLog('ロゴ要素検索結果:', logoElements.length + '個');
        logoElements.forEach(element => {
            element.src = logoData.dataUrl;
            element.alt = siteSettings.siteName || '株式会社ニシボ';
            debugLog('ロゴを更新:', element.tagName, element.className);
        });
    }
    
    // サイト名の更新（ヘッダーロゴは除外して固定）
    if (siteSettings.siteName) {
        const siteNameElements = document.querySelectorAll('.site-name, title');
        debugLog('サイト名要素検索結果:', siteNameElements.length + '個（ヘッダーロゴは固定のため除外）');
        siteNameElements.forEach(element => {
            if (element.tagName === 'TITLE') {
                // タイトル要素の場合は既存タイトルを保持しつつサイト名を更新
                const currentTitle = element.textContent;
                if (currentTitle.includes('株式会社ニシボ')) {
                    element.textContent = currentTitle.replace(/株式会社ニシボ/g, siteSettings.siteName);
                }
            } else {
                element.textContent = siteSettings.siteName;
            }
            debugLog('サイト名を更新:', element.tagName, siteSettings.siteName);
        });
    }
    
    // フッターテキストの更新
    if (siteSettings.footerText) {
        const footerCopyright = document.querySelectorAll('.footer-copyright, .copyright, .footer-bottom p');
        debugLog('フッター著作権要素検索結果:', footerCopyright.length + '個');
        footerCopyright.forEach(element => {
            element.textContent = siteSettings.footerText;
            debugLog('フッターテキストを更新:', element.tagName, siteSettings.footerText);
        });
    }
    
    debugLog('loadSiteSettings完了');
}

// 全体の連携状況を確認
function checkAllIntegrations() {
    debugLog('=== 管理画面連携状況チェック ===');
    
    // LocalStorageのデータ存在チェック
    const dataKeys = ['companyInfo', 'services', 'news', 'works', 'stats', 'seoData', 'siteSettings'];
    dataKeys.forEach(key => {
        const data = localStorage.getItem(key);
        const parsed = data ? JSON.parse(data) : null;
        const dataSize = Array.isArray(parsed) ? parsed.length : (parsed ? Object.keys(parsed).length : 0);
        debugLog(`${key}:`, data ? `存在 (${dataSize}項目)` : '不存在');
    });
    
    // HTML要素の存在チェック（ヘッダーロゴは固定のため除外）
    const elements = {
        '会社名': '.company-name, .footer-company-name',
        '住所': '.company-address, .footer-address',
        '電話番号': '.contact-phone, .footer-phone',
        'FAX': '.contact-fax, .footer-fax',
        'メール': '.contact-email, .footer-email',
        '事業案内': '.services-grid, .services-details',
        'お知らせ': '#news-list',
        '実績': '.works-grid, .works-slider',
        '統計': '.stat-number'
    };
    
    Object.entries(elements).forEach(([name, selector]) => {
        const found = document.querySelectorAll(selector);
        debugLog(`${name}要素:`, found.length + '個');
    });
    
    debugLog('=== チェック完了 ===');
}

// 日付フォーマット関数
function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
}

// カテゴリ名取得関数
function getCategoryName(category) {
    const categories = {
        'info': 'お知らせ',
        'work': '施工情報', 
        'important': '重要'
    };
    return categories[category] || category;
}

// ページ読み込み時にお知らせを読み込み（ホームページのみ）
document.addEventListener('DOMContentLoaded', () => {
    debugLog('管理データ連携を開始...');
    
    // デバッグ: LocalStorageの全内容を表示
    debugLog('=== LocalStorage 全データ ===');
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);
        debugLog(`${key}:`, value ? value.substring(0, 100) + (value.length > 100 ? '...' : '') : 'null');
    }
    debugLog('=== LocalStorage 終了 ===');
    
    // サンプルデータを初期化
    initializeSampleData();
    
    // 事業案内のデフォルトデータを初期化（管理画面データがない場合）
    initializeServicesData();
    
    // データクリーンアップ（不正な画像パスを修正）
    cleanupWorksData();
    
    // 管理画面で設定されたデータを読み込み
    loadSEOData();        // SEO設定（最初に読み込み）
    loadSiteSettings();   // サイト設定（カラー、ロゴ等）
    loadCompanyInfo();    // 会社情報
    loadServices();       // 事業案内（全ページ共通）
    loadStats();          // 統計情報
    
    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
        debugLog('ホームページを検出、追加データを読み込み中...');
        loadNews();       // お知らせ（ホームページのみ）
        
        // 工事実績を少し遅延して読み込み（確実に表示するため）
        // 注意: この処理はworksページ専用のloadWorksPage()と重複するため、
        // index.htmlでのみ実行するようにします
        if (window.location.pathname === '/' || window.location.pathname.endsWith('index.html')) {
            setTimeout(() => {
                debugLog('ホームページ用の工事実績の遅延読み込みを実行');
                loadWorks();
            }, 100);
        }
        
        // ホームページの事業案内セクションを確実に読み込み
        setTimeout(() => {
            const homeServicesContainer = document.querySelector('.services-grid');
            const servicesData = JSON.parse(localStorage.getItem('services') || '[]');
            if (homeServicesContainer && servicesData.length > 0) {
                debugLog('ホームページ事業案内セクションを追加読み込み:', servicesData.length + '件');
                loadServicesContent(servicesData);
            }
        }, 200);
    }
    
    if (window.location.pathname.endsWith('services.html')) {
        debugLog('事業案内ページを検出、詳細コンテンツを読み込み中...');
        // 事業案内ページの詳細読み込みを確実に実行
        const servicesData = JSON.parse(localStorage.getItem('services') || '[]');
        debugLog('services.htmlページでのservicesData:', servicesData);
        const detailsContainer = document.querySelector('.services-details');
        debugLog('services-detailsコンテナ:', detailsContainer);
        loadServicesContent(servicesData);
    }
    
    if (window.location.pathname.endsWith('works.html')) {
        debugLog('工事実績ページを検出、実績データを読み込み中...');
        // 重複実行を防ぐためのガード
        if (!window.worksPageLoaded) {
            window.worksPageLoaded = true;
            loadWorksPage();
        } else {
            debugLog('工事実績ページは既に読み込み済みです');
        }
    }
    
    // 全体の連携状況を確認
    checkAllIntegrations();
    
    debugLog('管理データ連携完了');
    
    // デバッグ: LocalStorageの事業データを確認
    const debugServices = JSON.parse(localStorage.getItem('services') || '[]');
    debugLog('LocalStorage 事業データ:', debugServices);
});

// 事業案内のデフォルトデータ初期化
function initializeServicesData() {
    debugLog('initializeServicesData実行開始');
    const existingServices = localStorage.getItem('services');
    debugLog('既存のservicesデータ:', existingServices ? existingServices.substring(0, 100) + '...' : 'なし');
    
    if (!existingServices) {
        debugLog('デフォルトサービスデータを初期化します');
        const defaultServices = [
            {
                id: 1,
                name: 'ダイヤモンドコア工事',
                subtitle: 'Diamond Core Drilling',
                icon: '💎',
                description: '精密な穴あけ工事でφ25mm～φ600mmまで対応',
                detailedDescription: 'ダイヤモンドビットを使用した精密な穴あけ工事。コンクリート構造物への正確な加工を行います。高精度な位置決めと確実な施工で、配管・電気設備の貫通工事に対応いたします。',
                specs: [
                    {"label": "穴径", "value": "φ25mm～φ600mm"},
                    {"label": "壁厚", "value": "1m以上の厚壁対応可能"},
                    {"label": "施工方向", "value": "水平・垂直・斜め穴あけ"},
                    {"label": "精度", "value": "高精度位置決め施工"}
                ],
                applications: [
                    "配管・電気設備の貫通工事",
                    "空調設備取付け工事", 
                    "構造補強用穴あけ",
                    "各種設備工事"
                ],
                features: [
                    "高精度な位置決め技術",
                    "豊富な施工実績",
                    "迅速な対応力",
                    "安全な施工管理"
                ]
            },
            {
                id: 2,
                name: '各種アンカー工事',
                subtitle: 'Chemical Anchor Work',
                icon: '⚓',
                description: 'ケミカルアンカー等による確実な固定・補強工事',
                detailedDescription: '構造物の補強・固定に最適なケミカルアンカー工事を提供します。既存構造物への後付け工事において、確実な固定力を実現いたします。',
                specs: [
                    {"label": "アンカー径", "value": "M6～M30"},
                    {"label": "埋込み深さ", "value": "50mm～500mm"},
                    {"label": "引張強度", "value": "高強度仕様対応"},
                    {"label": "施工環境", "value": "屋内外問わず対応"}
                ],
                applications: [
                    "設備機器の固定工事",
                    "構造補強工事",
                    "後付け工事",
                    "耐震補強工事"
                ],
                features: [
                    "確実な固定力",
                    "豊富な材料選択",
                    "迅速な施工",
                    "安全性の確保"
                ]
            },
            {
                id: 3,
                name: '非破壊検査・調査',
                subtitle: 'Non-Destructive Testing',
                icon: '🔍',
                description: 'X線・RCレーダーによる構造物内部調査',
                detailedDescription: 'X線撮影装置やRCレーダーを使用した非破壊検査により、コンクリート構造物内部の鉄筋配置や空洞の有無を正確に調査いたします。',
                specs: [
                    {"label": "X線装置", "value": "ポータブル型X線装置使用"},
                    {"label": "RCレーダー", "value": "電磁波レーダー探査"},
                    {"label": "調査深度", "value": "最大60cm程度"},
                    {"label": "精度", "value": "鉄筋位置±5mm以内"}
                ],
                applications: [
                    "鉄筋位置確認調査",
                    "空洞・欠陥部調査",
                    "コア抜き前事前調査",
                    "構造物健全性調査"
                ],
                features: [
                    "非破壊での内部構造確認",
                    "高精度な位置検出",
                    "迅速な現場調査",
                    "詳細な調査報告書作成"
                ]
            },
            {
                id: 4,
                name: '切断・解体工事',
                subtitle: 'Cutting & Demolition Work',
                icon: '🛠️',
                description: 'ウォールソー・ワイヤーソー等による各種工事',
                detailedDescription: 'ウォールソー、ワイヤーソー等の専用機械を使用したコンクリート構造物の精密切断工事。騒音・振動を抑制した安全な施工を行います。',
                specs: [
                    {"label": "ウォールソー", "value": "壁厚最大1.2m対応"},
                    {"label": "ワイヤーソー", "value": "大型構造物対応"},
                    {"label": "切断精度", "value": "高精度直線切断"},
                    {"label": "騒音対策", "value": "低騒音型機械使用"}
                ],
                applications: [
                    "開口部新設工事",
                    "構造物部分解体",
                    "改修工事での切断",
                    "設備更新時の開口"
                ],
                features: [
                    "低騒音・低振動施工",
                    "精密な切断精度",
                    "粉塵対策の徹底",
                    "安全性を重視した施工"
                ]
            },
            {
                id: 5,
                name: 'バースター工事',
                subtitle: 'Static Cracking Work', 
                icon: '⚡',
                description: '静的破砕による環境配慮型解体工事',
                detailedDescription: '静的破砕剤を使用した無騒音・無振動の環境配慮型解体工事。住宅密集地や夜間工事など、騒音制限のある現場に最適です。',
                specs: [
                    {"label": "破砕能力", "value": "最大5000t/cm²"},
                    {"label": "騒音レベル", "value": "無騒音（静的破砕）"},
                    {"label": "振動", "value": "無振動"},
                    {"label": "適用温度", "value": "5℃～35℃"}
                ],
                applications: [
                    "住宅密集地での解体",
                    "夜間工事での解体",
                    "部分的な構造物撤去",
                    "環境制約のある現場"
                ],
                features: [
                    "完全無騒音施工",
                    "無振動での解体",
                    "環境への配慮",
                    "狭小地での施工可能"
                ]
            },
            {
                id: 6,
                name: '斫り解体工事',
                subtitle: 'Chipping & Demolition',
                icon: '🔨',
                description: 'コンクリート構造物の解体・斫り工事',
                detailedDescription: '電動ハンマーやブレーカー等を使用したコンクリート構造物の斫り・解体工事。部分的な撤去から全面解体まで対応いたします。',
                specs: [
                    {"label": "電動ハンマー", "value": "各種サイズ対応"},
                    {"label": "ブレーカー", "value": "大型・小型機械完備"},
                    {"label": "切断工具", "value": "ダイヤモンドカッター使用"},
                    {"label": "廃材処理", "value": "適正処理・リサイクル"}
                ],
                applications: [
                    "部分的な構造物撤去",
                    "改修工事での斫り",
                    "設備撤去工事",
                    "全面解体工事"
                ],
                features: [
                    "効率的な施工",
                    "適正な廃材処理",
                    "安全管理の徹底",
                    "工期短縮への対応"
                ]
            }
        ];
        localStorage.setItem('services', JSON.stringify(defaultServices));
        debugLog('デフォルト事業案内データを初期化しました:', {
            count: defaultServices.length,
            services: defaultServices.map(s => s.name)
        });
    } else {
        debugLog('既存のservicesデータが存在するため、初期化をスキップしました');
    }
}

// サンプルデータの初期化（初回のみ）
function initializeSampleData() {
    if (!localStorage.getItem('news')) {
        const sampleNews = [
            {
                id: 1,
                title: 'ホームページをリニューアルしました',
                category: 'info',
                content: '株式会社ニシボのホームページを全面リニューアルいたしました。',
                date: '2024-01-15'
            },
            {
                id: 2,
                title: '大型商業施設のダイヤモンドコア工事を受注',
                category: 'work',
                content: '東京都内の大型商業施設におけるダイヤモンドコア工事を受注いたしました。',
                date: '2024-01-10'
            },
            {
                id: 3,
                title: '年末年始休業のお知らせ',
                category: 'important',
                content: '12月29日から1月3日まで年末年始休業とさせていただきます。',
                date: '2023-12-25'
            }
        ];
        localStorage.setItem('news', JSON.stringify(sampleNews));
    }
    
    if (!localStorage.getItem('works')) {
        const sampleWorks = [
            {
                id: 1,
                title: '商業ビル基礎工事',
                category: 'diamond-core',
                location: '東京都渋谷区',
                description: '10階建て商業ビルの基礎部分におけるダイヤモンドコア工事を実施。',
                image: 'images/sample/work1.jpg',
                date: '2024-01-20'
            },
            {
                id: 2,
                title: 'マンション構造補強工事',
                category: 'anchor',
                location: '神奈川県横浜市',
                description: '築30年マンションの耐震補強におけるアンカー工事を実施。',
                image: 'images/sample/work2.jpg',
                date: '2024-01-18'
            },
            {
                id: 3,
                title: '橋梁点検業務',
                category: 'inspection',
                location: '埼玉県さいたま市',
                description: '市内主要橋梁の定期点検および非破壊検査を実施。',
                image: 'images/sample/work3.jpg',
                date: '2024-01-15'
            }
        ];
        localStorage.setItem('works', JSON.stringify(sampleWorks));
    }
}

// Corporate website scripts loaded successfully!

// モダンなスクロールアニメーション機能
document.addEventListener('DOMContentLoaded', () => {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // カウンターアニメーション
                if (entry.target.classList.contains('hero-stat-number')) {
                    animateCounter(entry.target);
                }
            }
        });
    }, observerOptions);

    // 観察対象要素を追加
    const animateElements = document.querySelectorAll('.section-header, .about-text, .service-card, .news-item, .hero-stat');
    animateElements.forEach(el => {
        el.classList.add('animate-element');
        observer.observe(el);
    });



    // スムーズスクロール
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerOffset = 70;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // パララックス効果
    let ticking = false;
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const heroParticles = document.querySelector('.hero-particles');
        
        if (heroParticles) {
            const speed = scrolled * 0.5;
            heroParticles.style.transform = `translateY(${speed}px)`;
        }

        ticking = false;
    }

    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }

    window.addEventListener('scroll', requestTick);



    // 無限ループスライダー
    function initWorksSlider() {
        const slider = document.getElementById('worksSlider');
        if (!slider) {
            debugLog('スライダー要素(#worksSlider)が見つかりません - ホームページ以外では正常');
            return;
        }

        debugLog('スライダーを初期化中...');
        
        const slideWidth = 322; // 300px + 22px gap
        let currentPosition = 0;
        const speed = 1;
        let animationId;
        let isPaused = false;

        function animate() {
            if (!isPaused) {
                currentPosition -= speed;
                
                // 半分の位置まで移動したらリセット
                const resetPoint = slideWidth * 6; // 6枚分
                if (Math.abs(currentPosition) >= resetPoint) {
                    currentPosition = 0;
                }
                
                slider.style.transform = `translateX(${currentPosition}px)`;
            }
            
            animationId = requestAnimationFrame(animate);
        }

        // ホバー機能
        const container = document.querySelector('.works-slider-container');
        if (container) {
            container.addEventListener('mouseenter', () => {
                isPaused = true;
                debugLog('スライダー一時停止');
            });

            container.addEventListener('mouseleave', () => {
                isPaused = false;
                debugLog('スライダー再開');
            });
        }

        // アニメーション開始
        debugLog('アニメーション開始');
        animate();
    }

    // DOM読み込み完了後にスライダーを初期化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWorksSlider);
    } else {
        initWorksSlider();
    }
});