// 株式会社ニシボ - メインスクリプト
console.log('メインスクリプト読み込み開始');

// ページ読み込み完了時の処理
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM読み込み完了');
    
    // ローディング画面がある場合のみloadingクラスを追加
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        document.body.classList.add('loading');
    }
    
    // テスト用お知らせデータの初期化（現在は使用していません - Netlify CMSを使用）
    // initTestNewsData();
    
    // ヒーローセクションのスライドショーを初期化
    initHeroSlideshow();
    
    // 創業年カウンター画面の初期化
    initYearCounter();
    
    // 統計情報のアニメーション初期化
    initStatsAnimation();
    
    // 統計情報の代替初期化（確実に実行）
    setTimeout(() => {
        const stats = document.querySelectorAll('.stat-number[data-target]');
        stats.forEach(stat => {
            const targetValue = stat.getAttribute('data-target');
            if (!targetValue || stat.textContent === 'NaN') {
                console.log('統計値を修正:', targetValue);
                stat.textContent = targetValue || '0';
            }
        });
    }, 1000);    // スクロールアニメーションの初期化
    initScrollAnimations();
    
    // ホバー画像背景の初期化
    initHoverImageBackground();
    
    // ニュースデータの読み込み
    loadNewsData();
    
    // お知らせページの読み込み
    loadNewsGrid();
    
    // 工事実績スライダーの読み込み
    loadWorksSlider();
    
    // 工事実績ページの読み込み
    loadWorksGrid();
    
    // 事業案内の読み込み
    loadServicesData();
    
    // 事業案内詳細ページの読み込み（事業案内ページでのみ実行）
    if (document.body.classList.contains('services-detail-page')) {
        loadServicesDetailData();
        loadServicesWorksSlider(); // 事業案内ページ専用スライダーを読み込み
    }
    
    // ハンバーガーメニュー削除 - 水平スクロールナビゲーション使用
});

// 創業年カウンターの初期化
function initYearCounter() {
    const loadingScreen = document.getElementById('loading-screen');
    if (!loadingScreen) return;
    
    console.log('創業年カウンター初期化');
    
    // カウンターを開始
    startYearCounter();
    
    // スキップメッセージを1秒後に表示
    setTimeout(() => {
        const skipMessage = document.querySelector('.skip-message');
        if (skipMessage) {
            skipMessage.style.display = 'block';
        }
    }, 1000);
    
    // スキップ機能
    loadingScreen.addEventListener('click', () => hideLoadingScreen());
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            hideLoadingScreen();
        }
    });
}

// ヒーローセクションのスライドショーを初期化
function initHeroSlideshow() {
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length === 0) return;
    
    let currentSlide = 0;
    
    // 5秒ごとにスライドを切り替え
    setInterval(() => {
        // 現在のスライドを非表示
        slides[currentSlide].classList.remove('active');
        
        // 次のスライドへ
        currentSlide = (currentSlide + 1) % slides.length;
        
        // 次のスライドを表示
        slides[currentSlide].classList.add('active');
    }, 5000);
}

// 創業年カウンター実行
function startYearCounter() {
    const yearDisplay = document.getElementById('yearDisplay');
    const yearRange = document.getElementById('yearRange');
    
    if (!yearDisplay) {
        console.log('年表示要素が見つかりません');
        return;
    }
    
    console.log('創業年カウンター開始');
    
    // 自動計算: 創業年と現在年から創業年数を計算
    const foundingYear = 1986;
    const currentYear = new Date().getFullYear();
    const yearsInBusiness = currentYear - foundingYear;
    
    console.log(`創業年: ${foundingYear}, 現在年: ${currentYear}, 創業年数: ${yearsInBusiness}`);
    
    // 年数範囲を更新
    if (yearRange) {
        yearRange.textContent = `${foundingYear} - ${currentYear}`;
    }
    
    const duration = 3000; // 3秒間のアニメーション
    const increment = yearsInBusiness / (duration / 50);
    
    let animatedYears = 1;
    
    const counter = setInterval(() => {
        animatedYears += increment;
        
        if (animatedYears >= yearsInBusiness) {
            animatedYears = yearsInBusiness;
            clearInterval(counter);
            
            // カウンター終了後、少し待ってからメインコンテンツに移行
            setTimeout(() => hideLoadingScreen(), 1500);
        }
        
        // 表示更新（創業○○年の形式）
        yearDisplay.textContent = Math.floor(animatedYears);
        if (progressFill) {
            const progress = (animatedYears / yearsInBusiness) * 100;
            progressFill.style.width = Math.min(progress, 100) + '%';
        }
    }, 50);
}

// ローディング画面を隠す
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    const mainContent = document.getElementById('main-content');
    
    if (loadingScreen && loadingScreen.style.display !== 'none') {
        console.log('ローディング画面を隠します');
        loadingScreen.classList.add('fade-out');
        
        // bodyからloadingクラスを削除してスクロールを有効化
        document.body.classList.remove('loading');
        
        if (mainContent) {
            mainContent.classList.add('show');
        }
        
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            console.log('ローディング画面を完全に隠しました');
        }, 800);
    }
}

// 統計情報のスクロールアニメーション
function initStatsAnimation() {
    const stats = document.querySelectorAll('.stat-number');
    console.log('統計情報要素数:', stats.length);
    
    if (stats.length === 0) {
        console.warn('統計情報要素が見つかりません');
        return;
    }
    
    // 創業年から現在年の実績年数を自動計算
    const foundingYear = 1986;
    const currentYear = new Date().getFullYear();
    const yearsInBusiness = currentYear - foundingYear;
    
    // 年の実績要素を更新
    stats.forEach(stat => {
        const label = stat.nextElementSibling;
        if (label && label.textContent === '年の実績') {
            stat.setAttribute('data-target', yearsInBusiness);
            console.log('年の実績を自動更新:', yearsInBusiness);
        }
    });
    
    const observerOptions = {
        threshold: 0.7,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.hasAttribute('data-animated')) {
                const stat = entry.target;
                stat.setAttribute('data-animated', 'true');
                
                // data-target属性を使用
                const targetValue = stat.getAttribute('data-target');
                const finalValue = parseInt(targetValue) || 0;
                
                // 無効な値をチェック
                if (isNaN(finalValue) || finalValue <= 0) {
                    console.warn('無効なdata-target値:', targetValue);
                    return;
                }
                
                let current = 0;
                const increment = finalValue / 80; // アニメーション速度調整
                
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= finalValue) {
                        current = finalValue;
                        clearInterval(timer);
                    }
                    
                    // 数値に応じて表示形式を決定
                    const label = stat.nextElementSibling;
                    if (finalValue === 100 && label && label.textContent === '安全施工率') {
                        stat.textContent = Math.floor(current) + '%';
                    } else if (finalValue >= 15000 && label && label.textContent === '施工実績') {
                        stat.textContent = Math.floor(current).toLocaleString() + '+';
                    } else if (finalValue >= 1000) {
                        stat.textContent = Math.floor(current).toLocaleString();
                    } else {
                        stat.textContent = Math.floor(current);
                    }
                }, 20);
            }
        });
    }, observerOptions);
    
    stats.forEach(stat => {
        observer.observe(stat);
    });
}

// 統計数値のカウントアップ（改良版）
function animateNumbers() {
    // 創業年から現在年の実績年数を自動計算
    const foundingYear = 1986;
    const currentYear = new Date().getFullYear();
    const yearsInBusiness = currentYear - foundingYear;
    
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    
    statNumbers.forEach(stat => {
        // 年の実績要素を自動更新
        const label = stat.nextElementSibling;
        if (label && label.textContent === '年の実績') {
            stat.setAttribute('data-target', yearsInBusiness);
        }
        
        const targetValue = stat.getAttribute('data-target');
        const target = parseInt(targetValue) || 0;
        
        // 無効な値をチェック
        if (isNaN(target) || target <= 0) {
            console.warn('無効なdata-target値:', targetValue);
            stat.textContent = '0';
            return;
        }
        
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            const label = stat.nextElementSibling;
            if (target === 100 && label && label.textContent === '安全施工率') {
                stat.textContent = Math.floor(current) + '%';
            } else if (target >= 15000 && label && label.textContent === '施工実績') {
                stat.textContent = Math.floor(current).toLocaleString() + '+';
            } else if (target >= 1000) {
                stat.textContent = Math.floor(current).toLocaleString();
            } else {
                stat.textContent = Math.floor(current);
            }
        }, 16);
    });
}

// スクロールアニメーションの初期化
function initScrollAnimations() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            once: true,
            offset: 50
        });
    }
}

// ホバー画像背景の初期化
function initHoverImageBackground() {
    const heroSection = document.querySelector('.hero-modern');
    const hoverBg = document.querySelector('.hero-bg-hover');
    
    if (!heroSection || !hoverBg) return;
    
    heroSection.addEventListener('mouseenter', () => {
        hoverBg.classList.add('active');
    });
    
    heroSection.addEventListener('mouseleave', () => {
        hoverBg.classList.remove('active');
    });
    
    // 画像のプリロード
    const img = new Image();
    img.onload = () => console.log('ホバー用背景画像読み込み完了');
    img.onerror = () => console.error('ホバー用背景画像の読み込みに失敗');
    img.src = '../images/sample/hero-bg-hover.png';
}

// ニュースデータの読み込み
async function loadNewsData() {
    try {
        const newsContainer = document.getElementById('news-list');
        
        console.log('=== お知らせデータ読み込み開始 ===');
        
        if (!newsContainer) {
            console.log('news-listコンテナが見つかりません');
            return;
        }
        
        // Markdownファイルから読み込み
        let newsData = [];
        try {
            newsData = await loadNewsFromMarkdown();
            console.log('Markdownから読み込み:', newsData.length + '件');
        } catch (error) {
            console.log('Markdownの読み込み失敗:', error);
            newsData = [];
        }
        
        if (newsData.length === 0) {
            console.log('お知らせデータがありません - デフォルト表示します');
            // デフォルトのお知らせを表示
            newsContainer.innerHTML = `
                <div class="news-item">
                    <div class="news-date">2025.11.07</div>
                    <div class="news-content">
                        <span class="news-category">お知らせ</span>
                        <h3 class="news-title">ホームページをリニューアルしました</h3>
                    </div>
                </div>
                <div class="news-item">
                    <div class="news-date">2025.11.01</div>
                    <div class="news-content">
                        <span class="news-category">施工情報</span>
                        <h3 class="news-title">福岡市内大型商業施設の工事が完了しました</h3>
                    </div>
                </div>
            `;
            return;
        }
        
        // 最新2件を取得
        const latestNews = newsData.slice(0, 2);
        
        console.log('最新ニュースをHTML表示します:', latestNews);
        
        newsContainer.innerHTML = latestNews.map(news => `
            <div class="news-item" data-aos="fade-up">
                <div class="news-date">${news.date.replace(/-/g, '.')}</div>
                <div class="news-content">
                    <span class="news-category">${news.category}</span>
                    <h3 class="news-title">${news.title}</h3>
                </div>
            </div>
        `).join('');
        
        console.log('ニュースデータを読み込みました:', latestNews.length + '件');
    } catch (error) {
        console.error('ニュースデータの読み込みエラー:', error);
    }
}

// 事業案内データの読み込み
function loadServicesData() {
    try {
        const servicesData = JSON.parse(localStorage.getItem('servicesData') || '[]');
        const servicesGrid = document.querySelector('.services-grid');
        
        if (!servicesGrid) return;
        
        // デフォルトの事業案内データ
        const defaultServices = [
            {
                title: '建築工事全般',
                description: '新築・改修・解体まで建築に関わるあらゆる工事に対応。豊富な経験と確かな技術で安全・迅速に施工いたします。',
                icon: '🏗️'
            },
            {
                title: 'ダイヤモンドコア工事',
                description: '精密な穴あけ工事でφ25mm～φ600mmまで対応。コンクリート構造物への正確な孔あけを実現します。',
                icon: '💎'
            },
            {
                title: '各種アンカー工事',
                description: 'ケミカルアンカー、あと施工アンカーによる構造物の確実な固定・補強工事を行います。',
                icon: '⚓'
            },
            {
                title: '非破壊検査・X線調査',
                description: 'RCレーダー、X線透過検査による構造物内部の安全性確認と詳細調査を実施します。',
                icon: '🔍'
            },
            {
                title: 'ウォールソー・ワイヤーソー工事',
                description: '大型構造物の精密切断・解体工事。困難な作業環境でも安全確実に施工します。',
                icon: '⚙️'
            }
        ];
        
        const servicesToDisplay = servicesData.length > 0 ? servicesData : defaultServices;
        
        servicesGrid.innerHTML = servicesToDisplay.map(service => `
            <div class="service-card service-card-compact" data-aos="fade-up">
                <h3 class="service-title">${service.title}</h3>
                <p class="service-description">${service.description}</p>
            </div>
        `).join('');
        
        console.log('事業案内データを読み込みました:', servicesToDisplay.length + '件');
    } catch (error) {
        console.error('事業案内データの読み込みエラー:', error);
    }
}

// 工事実績スライダーの読み込み
function loadWorksSlider() {
    try {
        const worksData = JSON.parse(localStorage.getItem('worksData') || '[]');
        const worksSlider = document.getElementById('worksSlider');
        
        if (!worksSlider) return;
        
        if (worksData.length === 0) {
            // サンプルデータを表示
            const sampleWorks = [
                {
                    title: 'ダイヤモンドコア工事',
                    location: '福岡市博多区',
                    date: '2024年11月',
                    image: 'images/works/work-slide-01.jpg',
                    description: 'φ300mmのダイヤモンドコア工事を安全かつ迅速に実施'
                },
                {
                    title: 'アンカー工事',
                    location: '北九州市小倉',
                    date: '2024年10月',
                    image: 'images/works/work-slide-02.jpg',
                    description: 'ケミカルアンカーによる構造物固定工事'
                },
                {
                    title: 'ワイヤーソー工事',
                    location: '久留米市',
                    date: '2024年9月',
                    image: 'images/works/work-slide-03.jpg',
                    description: '大型構造物の精密切断工事'
                },
                {
                    title: 'ウォールソー工事',
                    location: '福岡市中央区',
                    date: '2024年8月',
                    image: 'images/works/work-slide-04.jpeg',
                    description: 'RC壁面の開口工事をウォールソーで精密施工'
                },
                {
                    title: '非破壊検査',
                    location: '大牟田市',
                    date: '2024年7月',
                    image: 'images/works/work-slide-05.jpg',
                    description: 'X線調査による鉄筋配置確認作業'
                },
                {
                    title: '建築工事全般',
                    location: '筑後市',
                    date: '2024年6月',
                    image: 'images/works/work-slide-06.jpg',
                    description: '商業施設の改修工事における総合施工'
                },
                {
                    title: 'ボーリング工事',
                    location: '飯塚市',
                    date: '2024年5月',
                    image: 'images/works/work-slide-07.jpg',
                    description: '地質調査のための精密ボーリング作業'
                },
                {
                    title: 'インフラ整備工事',
                    location: '糸島市',
                    date: '2024年4月',
                    image: 'images/works/work-slide-08.JPG',
                    description: '道路・橋梁の補強工事における専門技術'
                },
                {
                    title: '工場設備工事',
                    location: '福岡市東区',
                    date: '2024年3月',
                    image: 'images/works/work-slide-09.jpeg',
                    description: '製造設備のメンテナンス・改修工事'
                },
                {
                    title: '医療施設工事',
                    location: '春日市',
                    date: '2024年2月',
                    image: 'images/works/work-slide-10.jpg',
                    description: '病院建設における高精度な専門工事'
                }
            ];
            
            // 画面を埋めるために複製を作成（無限スクロール用）
            const worksToShow = sampleWorks.slice(0, 6); // 最初の6枚を使用
            const slideHtml = worksToShow.map(work => `
                <div class="work-slide">
                    <img src="${work.image}" alt="${work.title}" loading="lazy">
                </div>
            `).join('');
            
            // 3回複製して画面を完全に埋める（6枚 × 3 = 18枚）
            worksSlider.innerHTML = slideHtml + slideHtml + slideHtml;
        } else {
            // LocalStorageのデータを表示
            const latestWorks = worksData.slice(0, 6);
            const slideHtml = latestWorks.map(work => `
                <div class="work-slide">
                    <img src="${work.image}" alt="${work.title}" loading="lazy">
                </div>
            `).join('');
            
            // 3回複製して画面を完全に埋める
            worksSlider.innerHTML = slideHtml + slideHtml + slideHtml;
        }
        
        console.log('工事実績スライダーを読み込みました');
    } catch (error) {
        console.error('工事実績スライダーの読み込みエラー:', error);
    }
}

// 事業案内ページ専用のスライダー読み込み
function loadServicesWorksSlider() {
    try {
        const servicesWorksSlider = document.getElementById('servicesWorksSlider');
        
        if (!servicesWorksSlider) return;
        
        // 事業案内ページ専用のサンプルデータ
        const servicesSampleWorks = [
            {
                title: 'ダイヤモンドコア施工例 1',
                image: 'images/services-slider/service-slide-01.jpg'
            },
            {
                title: 'アンカー工事施工例 1',
                image: 'images/services-slider/service-slide-02.jpg'
            },
            {
                title: 'ワイヤーソー施工例 1',
                image: 'images/services-slider/service-slide-03.jpg'
            },
            {
                title: 'ウォールソー施工例 1',
                image: 'images/services-slider/service-slide-04.jpg'
            },
            {
                title: '非破壊検査施工例 1',
                image: 'images/services-slider/service-slide-05.jpg'
            },
            {
                title: '建築工事施工例 1',
                image: 'images/services-slider/service-slide-06.jpg'
            },
            {
                title: '施工例 7',
                image: 'images/services-slider/service-slide-07.jpg'
            }
        ];
        
        const slideHtml = servicesSampleWorks.map(work => `
            <div class="work-slide">
                <img src="${work.image}" alt="${work.title}" loading="lazy">
            </div>
        `).join('');
        
        // 3回複製して無限スクロール用に画面を埋める
        servicesWorksSlider.innerHTML = slideHtml + slideHtml + slideHtml;
        
        console.log('事業案内ページのスライダーを読み込みました');
    } catch (error) {
        console.error('事業案内ページスライダーの読み込みエラー:', error);
    }
}

// 事業案内詳細ページの読み込み
function loadServicesDetailData() {
    const serviceCards = document.querySelector('.services-grid');
    if (!serviceCards) return;

    const servicesData = [
        {
            icon: '🏗️',
            title: '建築工事全般',
            description: '新築・改修・解体まで建築に関わるあらゆる工事に対応',
            features: [
                '新築建設工事',
                '改修・増築工事',
                '解体工事',
                '建設工事管理'
            ]
        },
        {
            icon: '💎',
            title: 'ダイヤモンドコア工事',
            description: '精密な穴あけ工事でコンクリート構造物への正確な孔あけを実現',
            features: [
                'φ25mm～φ600mmまで対応',
                '鉄筋コンクリート穿孔',
                '配管・配線用穴あけ',
                '高精度穿孔技術'
            ]
        },
        {
            icon: '⚓',
            title: '各種アンカー工事',
            description: 'ケミカルアンカー、あと施工アンカーによる構造物の確実な固定・補強',
            features: [
                'ケミカルアンカー施工',
                'あと施工アンカー工事',
                '構造補強工事',
                'アンカー引抜試験'
            ]
        },
        {
            icon: '�',
            title: '非破壊検査・X線調査',
            description: 'RCレーダー、X線透過検査による構造物内部の安全性確認と詳細調査',
            features: [
                'RCレーダー調査',
                'X線透過検査',
                '鉄筋探査',
                '構造物診断'
            ]
        },
        {
            icon: '⚙️',
            title: 'ウォールソー・ワイヤーソー工事',
            description: '大型構造物の精密切断・解体工事を安全確実に施工',
            features: [
                'ウォールソー切断',
                'ワイヤーソー工事',
                '大型構造物解体',
                '精密切断技術'
            ]
        }
    ];

    // サービスカードの生成（事業案内ページ専用のスタイル）
    serviceCards.innerHTML = servicesData.map((service, index) => `
        <div class="service-card" data-aos="fade-up" data-aos-delay="${index * 100}">
            <h3>${service.title}</h3>
            <p class="service-description">${service.description}</p>
            <ul class="service-features">
                ${service.features.map(feature => `<li>✓ ${feature}</li>`).join('')}
            </ul>
        </div>
    `).join('');

    console.log('事業案内詳細ページのデータを読み込みました:', servicesData.length + '件');
}

// ハンバーガーメニュー削除 - 水平スクロールナビゲーション使用
/*
function initMobileMenu() {
    // この関数は不要になりました
    // 水平スクロールナビゲーションはCSSのみで動作
}
*/

// 工事実績ページの読み込み
function loadWorksGrid() {
    const worksContainer = document.getElementById('works-container');
    if (!worksContainer) return;

    try {
        const worksData = JSON.parse(localStorage.getItem('worksData') || '[]');
        
        if (worksData.length === 0) {
            // サンプルデータを表示
            const sampleWorks = [
                {
                    title: 'ダイヤモンドコア工事',
                    image: 'images/sample/work1.jpg'
                },
                {
                    title: 'アンカー工事',
                    image: 'images/sample/work2.jpg'
                },
                {
                    title: 'ワイヤーソー工事',
                    image: 'images/sample/work3.jpg'
                },
                {
                    title: '非破壊検査',
                    image: 'images/sample/work1.jpg'
                },
                {
                    title: '建築工事',
                    image: 'images/sample/work2.jpg'
                },
                {
                    title: 'コンクリート工事',
                    image: 'images/sample/work3.jpg'
                }
            ];
            
            worksContainer.innerHTML = sampleWorks.map(work => `
                <div class="work-item" data-aos="fade-up">
                    <div class="work-image">
                        <img src="${work.image}" alt="${work.title}" loading="lazy">
                        <div class="work-overlay">
                            <h3 class="work-title">${work.title}</h3>
                        </div>
                    </div>
                </div>
            `).join('');
        } else {
            // LocalStorageのデータを表示
            worksContainer.innerHTML = worksData.map(work => `
                <div class="work-item" data-aos="fade-up">
                    <div class="work-image">
                        <img src="${work.image}" alt="${work.title}" loading="lazy">
                        <div class="work-overlay">
                            <h3 class="work-title">${work.title}</h3>
                        </div>
                    </div>
                </div>
            `).join('');
        }
        
        console.log('工事実績グリッドを読み込みました');
    } catch (error) {
        console.error('工事実績グリッドの読み込みエラー:', error);
    }
}

// お知らせページのグリッド表示
function loadNewsGrid() {
    try {
        console.log('=== script.js loadNewsGrid 開始 ===');
        const newsGrid = document.getElementById('news-grid');
        console.log('newsGrid要素:', newsGrid);
        if (!newsGrid) {
            console.log('newsGrid要素が見つからないためリターン');
            return; // お知らせページ以外では何もしない
        }
        
        const newsData = JSON.parse(localStorage.getItem('newsData') || '[]');
        console.log('script.js内のnewsData:', newsData);
        console.log('script.js内のnewsData件数:', newsData.length);
        
        if (newsData.length === 0) {
            newsGrid.innerHTML = `
                <div class="no-news-message" style="text-align: center; padding: 60px 20px; color: #64748b;">
                    <h3>まだお知らせがありません</h3>
                    <p>新しいお知らせが追加されるまでお待ちください。</p>
                </div>
            `;
            return;
        }
        
        // カテゴリ名のマッピング
        const categoryNames = {
            'info': 'お知らせ',
            'work': '施工情報',
            'important': '重要'
        };
        
        // お知らせを日付順（新しい順）に並び替え
        const sortedNews = newsData.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        newsGrid.innerHTML = sortedNews.map(news => `
            <article class="news-card" data-category="${news.category}" data-aos="fade-up">
                <div class="news-card-header">
                    <time class="news-date">${news.date.replace(/-/g, '.')}</time>
                    <span class="news-category category-${news.category}">${categoryNames[news.category] || news.category}</span>
                </div>
                <h3 class="news-title">${news.title}</h3>
                <div class="news-content">
                    <p>${news.content}</p>
                </div>
            </article>
        `).join('');
        
        // フィルター機能を初期化
        initNewsFilter();
        
        console.log('お知らせグリッドを読み込みました:', sortedNews.length + '件');
    } catch (error) {
        console.error('お知らせグリッドの読み込みエラー:', error);
    }
}

// カテゴリに応じたCSSクラスを返す関数
function getCategoryClass(category) {
    switch (category) {
        case 'お知らせ': return 'info';
        case '施工情報': return 'work';
        case '重要': return 'important';
        default: return 'info';
    }
}

// お知らせフィルター機能の初期化
function initNewsFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const newsCards = document.querySelectorAll('.news-card');
    const noNewsFound = document.getElementById('no-news-found');
    
    if (!filterButtons.length || !newsCards.length) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // アクティブボタンを切り替え
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const filter = button.getAttribute('data-filter');
            let visibleCount = 0;
            
            // フィルタリング処理
            newsCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filter === 'all') {
                    card.style.display = 'block';
                    visibleCount++;
                } else if (category === filter) {
                    // data-categoryの値と直接比較（英語のカテゴリID）
                    card.style.display = 'block';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });
            
            // 該当なしメッセージの表示切替
            if (noNewsFound) {
                noNewsFound.style.display = visibleCount === 0 ? 'block' : 'none';
            }
        });
    });
}

// テスト用お知らせデータの初期化
function initTestNewsData() {
    console.log('=== テスト用お知らせデータ初期化開始 ===');
    try {
        const existingNews = JSON.parse(localStorage.getItem('newsData') || '[]');
        console.log('既存のnewsDataをチェック:', existingNews);
        
        // デバッグのため強制的に初期化（開発時）
        console.log('強制的にテストデータを初期化します');
        
        // テスト用のお知らせデータ（より多くのデータでテスト）
        const testNewsData = [
            {
                id: 1,
                title: 'ホームページをリニューアルしました',
                content: '株式会社ニシボのホームページを全面的にリニューアルいたしました。より見やすく、使いやすいサイトを目指して改良を行いました。モダンなデザインと使いやすいナビゲーションで、お客様により良い体験をお届けします。',
                date: '2025-11-07',
                category: 'info'
            },
            {
                id: 2,
                title: '福岡市内大型商業施設の工事が完了しました',
                content: '福岡市内の大型商業施設におけるダイヤモンドコア工事および各種アンカー工事が無事完了いたしました。工期短縮と高品質な施工を実現し、お客様から高い評価をいただいております。',
                date: '2025-11-01',
                category: 'work'
            },
            {
                id: 3,
                title: '年末年始の営業について',
                content: '年末年始の営業日程についてお知らせいたします。12月29日より1月3日まで休業とさせていただきます。緊急時のお問い合わせは携帯電話までご連絡ください。',
                date: '2025-10-25',
                category: 'important'
            },
            {
                id: 4,
                title: '新しい検査機器を導入しました',
                content: '非破壊検査の精度向上のため、最新鋭のX線検査装置を導入いたしました。これにより、より詳細で正確な検査が可能となります。',
                date: '2025-10-15',
                category: 'info'
            },
            {
                id: 5,
                title: '九州地区のインフラ整備工事を受注',
                content: '九州地区の重要インフラ整備工事を受注いたしました。当社の技術力と実績が評価され、大型プロジェクトを任せていただくことになりました。',
                date: '2025-10-10',
                category: 'work'
            }
        ];
        
        // LocalStorageに保存
        localStorage.setItem('newsData', JSON.stringify(testNewsData));
        console.log('テスト用お知らせデータを初期化しました:', testNewsData.length + '件');
        console.log('保存したデータ:', testNewsData);
        
        // 保存後に確認
        const savedData = JSON.parse(localStorage.getItem('newsData') || '[]');
        console.log('保存確認:', savedData.length + '件のデータが保存されました');
        
    } catch (error) {
        console.error('テスト用お知らせデータの初期化エラー:', error);
    }
}

// ======================================
// モバイルメニューとレスポンシブ機能
// ======================================

// モバイルメニューの初期化
function initMobileMenu() {
    console.log('モバイルメニューの初期化');
    
    // ハンバーガーメニューボタンを作成
    createMobileMenuToggle();
    
    // メニューの動作を設定
    setupMenuToggle();
    
    // ウィンドウリサイズ時の処理
    setupResponsiveHandlers();
}

// ハンバーガーメニューボタンを作成
function createMobileMenuToggle() {
    const navContainer = document.querySelector('.nav-container');
    if (!navContainer) return;
    
    // 既存のボタンがあれば削除
    const existingToggle = navContainer.querySelector('.mobile-menu-toggle');
    if (existingToggle) {
        existingToggle.remove();
    }
    
    // ハンバーガーメニューボタンを作成
    const toggleButton = document.createElement('button');
    toggleButton.className = 'mobile-menu-toggle';
    toggleButton.setAttribute('aria-label', 'メニューを開く');
    toggleButton.setAttribute('aria-expanded', 'false');
    
    // ハンバーガーアイコンの3本線を作成
    for (let i = 0; i < 3; i++) {
        const span = document.createElement('span');
        toggleButton.appendChild(span);
    }
    
    // ナビゲーションコンテナに追加
    navContainer.appendChild(toggleButton);
    
    console.log('ハンバーガーメニューボタンを作成しました');
}

// メニュートグルの動作を設定
function setupMenuToggle() {
    const toggleButton = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!toggleButton || !navMenu) {
        console.warn('メニュートグルまたはナビゲーションメニューが見つかりません');
        return;
    }
    
    // トグルボタンのクリックイベント
    toggleButton.addEventListener('click', function() {
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        
        // メニューの表示/非表示を切り替え
        navMenu.classList.toggle('active');
        this.classList.toggle('active');
        
        // アクセシビリティ属性を更新
        this.setAttribute('aria-expanded', !isExpanded);
        this.setAttribute('aria-label', isExpanded ? 'メニューを開く' : 'メニューを閉じる');
        
        // ボディのスクロールを制御（メニューが開いているとき）
        document.body.style.overflow = isExpanded ? '' : 'hidden';
        
        console.log('メニューを' + (isExpanded ? '閉じました' : '開きました'));
    });
    
    // メニューリンクをクリックした時にメニューを閉じる
    const menuLinks = navMenu.querySelectorAll('a');
    menuLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            toggleButton.classList.remove('active');
            toggleButton.setAttribute('aria-expanded', 'false');
            toggleButton.setAttribute('aria-label', 'メニューを開く');
            document.body.style.overflow = '';
        });
    });
    
    // メニュー外をクリックした時にメニューを閉じる
    document.addEventListener('click', function(e) {
        if (!navMenu.contains(e.target) && !toggleButton.contains(e.target)) {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                toggleButton.classList.remove('active');
                toggleButton.setAttribute('aria-expanded', 'false');
                toggleButton.setAttribute('aria-label', 'メニューを開く');
                document.body.style.overflow = '';
            }
        }
    });
    
    console.log('メニュートグルの動作を設定しました');
}

// レスポンシブハンドラーの設定
function setupResponsiveHandlers() {
    let resizeTimeout;
    
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            const width = window.innerWidth;
            const toggleButton = document.querySelector('.mobile-menu-toggle');
            const navMenu = document.querySelector('.nav-menu');
            
            if (width > 991) {
                // デスクトップサイズの場合、モバイルメニューを非表示
                if (navMenu) {
                    navMenu.classList.remove('active');
                }
                if (toggleButton) {
                    toggleButton.classList.remove('active');
                    toggleButton.setAttribute('aria-expanded', 'false');
                    toggleButton.setAttribute('aria-label', 'メニューを開く');
                }
                document.body.style.overflow = '';
                
                // ハンバーガーボタンを非表示
                if (toggleButton) {
                    toggleButton.style.display = 'none';
                }
            } else {
                // タブレット・モバイルサイズの場合、ハンバーガーボタンを表示
                if (toggleButton) {
                    toggleButton.style.display = 'flex';
                }
            }
            
            console.log('ウィンドウサイズ変更: ' + width + 'px');
        }, 250);
    });
    
    // 初期状態でのボタン表示/非表示を設定
    const initialWidth = window.innerWidth;
    const toggleButton = document.querySelector('.mobile-menu-toggle');
    if (toggleButton) {
        toggleButton.style.display = initialWidth <= 991 ? 'flex' : 'none';
    }
    
    console.log('レスポンシブハンドラーを設定しました');
}

// タッチデバイス対応
function setupTouchDeviceSupport() {
    // タッチデバイスの検出
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    if (isTouchDevice) {
        document.body.classList.add('touch-device');
        
        // iOS Safariでのビューポート問題への対応
        function setVH() {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        }
        
        setVH();
        window.addEventListener('resize', setVH);
        
        // タッチイベントの最適化
        document.addEventListener('touchstart', function() {}, {passive: true});
        
        console.log('タッチデバイス対応を設定しました');
    }
}

// 画面方向変更への対応
function setupOrientationChange() {
    window.addEventListener('orientationchange', function() {
        setTimeout(function() {
            // メニューが開いている場合は閉じる
            const navMenu = document.querySelector('.nav-menu');
            const toggleButton = document.querySelector('.mobile-menu-toggle');
            
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                if (toggleButton) {
                    toggleButton.classList.remove('active');
                    toggleButton.setAttribute('aria-expanded', 'false');
                    toggleButton.setAttribute('aria-label', 'メニューを開く');
                }
                document.body.style.overflow = '';
            }
            
            // ビューポートの高さを再計算
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
            
        }, 300);
    });
    
    console.log('画面方向変更への対応を設定しました');
}

// レスポンシブ画像の遅延読み込み
function setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(function(img) {
            imageObserver.observe(img);
        });
        
        console.log('遅延読み込みを設定しました');
    } else {
        // IntersectionObserverをサポートしていない場合の代替処理
        images.forEach(function(img) {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
        });
    }
}

// ページ読み込み時にレスポンシブ機能を初期化
document.addEventListener('DOMContentLoaded', function() {
    setupTouchDeviceSupport();
    setupOrientationChange();
    setupLazyLoading();
});

// モバイルプルダウンメニューの初期化
function initMobileDropdownMenu() {
    const mobileNavButton = document.getElementById('mobile-nav-button');
    const mobileNavMenu = document.getElementById('mobile-nav-menu');
    
    if (!mobileNavButton || !mobileNavMenu) {
        console.log('プルダウンメニュー要素が見つかりません');
        return;
    }
    
    // プルダウンボタンのクリックイベント
    mobileNavButton.addEventListener('click', function(e) {
        e.stopPropagation();
        
        const isActive = mobileNavButton.classList.contains('active');
        
        if (isActive) {
            closeMobileDropdown();
        } else {
            openMobileDropdown();
        }
    });
    
    // メニュー外をクリックした時に閉じる
    document.addEventListener('click', function(e) {
        if (!mobileNavButton.contains(e.target) && !mobileNavMenu.contains(e.target)) {
            closeMobileDropdown();
        }
    });
    
    // メニューリンクがクリックされた時に閉じる
    const mobileNavLinks = mobileNavMenu.querySelectorAll('.mobile-nav-link');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            closeMobileDropdown();
        });
    });
    
    // ESCキーで閉じる
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeMobileDropdown();
        }
    });
    
    function openMobileDropdown() {
        mobileNavButton.classList.add('active');
        mobileNavMenu.classList.add('active');
        
        // メニューの位置を画面サイズに合わせて調整
        setTimeout(() => {
            adjustMenuPosition();
        }, 50);
    }
    
    function adjustMenuPosition() {
        const rect = mobileNavMenu.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        
        // メニューが画面右端を超える場合は左側に調整
        if (rect.right > viewportWidth) {
            const offsetX = rect.right - viewportWidth + 20; // 20px のマージン
            mobileNavMenu.style.transform = `translateX(-${offsetX + 20}px) translateY(0)`;
        }
        
        // メニューが画面左端を超える場合は右側に調整
        if (rect.left < 0) {
            const offsetX = Math.abs(rect.left) + 20; // 20px のマージン
            mobileNavMenu.style.transform = `translateX(${offsetX - 20}px) translateY(0)`;
        }
    }
    
    function closeMobileDropdown() {
        mobileNavButton.classList.remove('active');
        mobileNavMenu.classList.remove('active');
    }
    
    console.log('プルダウンメニュー初期化完了');
}

// DOMContentLoadedでプルダウンメニューを初期化
document.addEventListener('DOMContentLoaded', function() {
    initMobileDropdownMenu();
});

// 統計情報のNaN問題を緊急修正
window.addEventListener('load', function() {
    setTimeout(function() {
        console.log('統計情報の緊急修正を実行');
        const statNumbers = document.querySelectorAll('.stat-number');
        
        statNumbers.forEach(function(stat) {
            const target = stat.getAttribute('data-target');
            console.log('統計要素確認:', {
                element: stat,
                target: target,
                currentText: stat.textContent
            });
            
            // NaNまたは空の場合は修正
            if (stat.textContent === 'NaN' || stat.textContent === '' || stat.textContent === '0') {
                if (target) {
                    const targetNum = parseInt(target);
                    if (!isNaN(targetNum)) {
                        if (targetNum === 100) {
                            stat.textContent = targetNum + '%';
                        } else if (targetNum >= 1000) {
                            stat.textContent = targetNum.toLocaleString() + '+';
                        } else {
                            stat.textContent = targetNum.toString();
                        }
                        console.log('統計値を修正しました:', stat.textContent);
                    }
                }
            }
        });
        
        // アニメーションも再実行
        if (typeof animateNumbers === 'function') {
            animateNumbers();
        }
    }, 1000);
});

console.log('メインスクリプト読み込み完了');