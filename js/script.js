// ローディング画面制御
document.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.getElementById('loading-screen');
    const mainContent = document.getElementById('main-content');
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
mobileMenu.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// ナビゲーションリンクのクリック時にモバイルメニューを閉じる
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

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
    
    if (!newsContainer) return;
    
    if (newsData.length === 0) {
        newsContainer.innerHTML = '<div class="no-news"><p>お知らせはありません。</p></div>';
        return;
    }
    
    // 最新5件のお知らせを表示
    const recentNews = newsData.slice(0, 5);
    
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
    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
        // お知らせを読み込み
        loadNews();
    }
});

console.log('Corporate website scripts loaded successfully!');