// 緊急修正版 script.js - ホームページを動作させるための最小限の実装
console.log('緊急修正版 script.js 読み込み開始');

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

// ローディング画面の処理
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM読み込み完了');
    
    // メインコンテンツの初期化
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
        console.log('メインコンテンツを検出しました');
        // ローディング画面がない場合は即座に表示
        const loadingScreen = document.getElementById('loading-screen');
        if (!loadingScreen) {
            mainContent.classList.add('show');
            console.log('ローディング画面がないため、メインコンテンツを即座に表示');
        }
    }
    
    // 創業年カウンター画面の制御
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        console.log('創業年カウンター画面を検出しました');
        
        // 創業年カウンターを開始
        startYearCounter();
        
        // スキップメッセージを1秒後に表示
        setTimeout(function() {
            const skipMessage = document.querySelector('.skip-message');
            if (skipMessage) {
                skipMessage.style.display = 'block';
                console.log('スキップメッセージを表示しました');
            }
        }, 1000);
        
        // スキップ機能の追加
        loadingScreen.addEventListener('click', function() {
            console.log('クリックでスキップ');
            hideLoadingScreen();
        });
        
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                console.log('キーでスキップ');
                hideLoadingScreen();
            }
        });
    }
});

// 統計数値のカウントアップアニメーション
function animateNumbers() {
            const statNumbers = document.querySelectorAll('.stat-number[data-target]');
            
            statNumbers.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-target'));
                const duration = 2000; // 2秒
                const increment = target / (duration / 16); // 60fps
                let current = 0;
                
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    
                    // 数値の表示形式を調整
                    if (target >= 1000) {
                        stat.textContent = Math.floor(current).toLocaleString() + '+';
                    } else if (target === 100) {
                        stat.textContent = Math.floor(current) + '%';
                    } else {
                        stat.textContent = Math.floor(current);
                    }
                }, 16);
            });
        }
        
        // Intersection Observer でスクロール時にアニメーション実行
        function setupScrollAnimations() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        if (entry.target.classList.contains('stats-grid') || entry.target.classList.contains('hero-stats-grid')) {
                            animateNumbers();
                            observer.unobserve(entry.target);
                        }
                    }
                });
            }, { threshold: 0.5 });
            
            // 新しい統計セクションを監視
            const statsGrid = document.querySelector('.stats-grid');
            if (statsGrid) {
                observer.observe(statsGrid);
            }
            
            // 古い統計セクションも念のため監視
            const heroStatsGrid = document.querySelector('.hero-stats-grid');
            if (heroStatsGrid) {
                observer.observe(heroStatsGrid);
            }
        }
        
        // ページ読み込み完了時にアニメーション設定
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', setupScrollAnimations);
        } else {
            setupScrollAnimations();
        }
        
        // ホバー時の画像背景制御
        function setupHoverImageBackground() {
            const heroSection = document.querySelector('.hero-modern');
            const hoverBg = document.querySelector('.hero-bg-hover');
            
            if (!heroSection || !hoverBg) return;
            
            // ホバー開始時
            heroSection.addEventListener('mouseenter', function() {
                hoverBg.classList.add('active');
                console.log('ホバー画像表示開始');
            });
            
            // ホバー終了時
            heroSection.addEventListener('mouseleave', function() {
                hoverBg.classList.remove('active');
                console.log('ホバー画像非表示');
            });
            
            // 画像のプリロード確認
            const img = new Image();
            img.onload = function() {
                console.log('ホバー用背景画像の読み込み完了');
            };
            img.onerror = function() {
                console.error('ホバー用背景画像の読み込みに失敗しました');
            };
            img.src = '../images/sample/hero-bg-hover.png';
        }
        
        // ホバー画像機能の初期化
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', setupHoverImageBackground);
        } else {
            setupHoverImageBackground();
        }
        }, 2000);
        
        // デバッグモードでも十分な表示時間を確保
        if (DEBUG_MODE) {
            setTimeout(function() {
                console.log('デバッグモード: ローディング画面を非表示');
                hideLoadingScreen();
            }, 3000); // デバッグモードでも3秒表示
        }
        
        // ページが完全に読み込まれた後にローディング画面を隠す
        window.addEventListener('load', function() {
            console.log('ページ読み込み完了、ローディング画面を非表示にします');
            setTimeout(function() {
                loadingScreen.classList.add('fade-out');
                setTimeout(function() {
                    loadingScreen.style.display = 'none';
                    console.log('ローディング画面を非表示にしました');
                }, 800); // フェードアウト時間を長く
            }, 4000); // 最小表示時間を4秒に延長
        });
        
        // 強制的にローディング画面を隠すためのフォールバック（10秒後）
        setTimeout(function() {
            if (loadingScreen.style.display !== 'none') {
                console.log('フォールバック: ローディング画面を強制的に非表示');
                hideLoadingScreen();
            }
        }, 10000);
    }
    
    // ナビゲーション処理
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenu && navMenu) {
        mobileMenu.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });
    }
    
    // スムーススクロール
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(function(link) {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // 基本的な工事実績表示
    loadBasicWorks();
    
    // 統計情報の表示
    loadStatsData();
    
    // 工事実績統計の表示（works.htmlの場合）
    loadWorksStatsData();
    
    // 事業案内の表示（index.htmlの場合）
    loadServicesData();
    
    // 事業案内詳細の表示（services.htmlの場合）
    loadServicesDetailData();
    
    // お知らせの表示（index.htmlの場合）
    loadNewsData();
});

// 創業年カウンター関数
function startYearCounter() {
    const yearDisplay = document.getElementById('yearDisplay');
    if (!yearDisplay) {
        console.log('年表示要素が見つかりません');
        return;
    }
    
    console.log('創業年カウンターを開始します');
    const startYear = 1986;
    const endYear = 2017;
    const duration = 3000; // 3秒間でカウント
    const totalYears = endYear - startYear;
    const increment = totalYears / (duration / 50); // 50msごとに更新
    
    let currentYear = startYear;
    
    const counter = setInterval(() => {
        currentYear += increment;
        
        if (currentYear >= endYear) {
            yearDisplay.textContent = endYear;
            clearInterval(counter);
            console.log('カウンター完了: ' + endYear);
            
            // カウント完了後、0.5秒待ってからフェードアウト
            setTimeout(() => {
                hideLoadingScreen();
            }, 500);
        } else {
            yearDisplay.textContent = Math.floor(currentYear);
        }
    }, 50);
}

// ローディング画面を隠すヘルパー関数
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    const mainContent = document.getElementById('main-content');
    
    if (loadingScreen && loadingScreen.style.display !== 'none') {
        console.log('ローディング画面を隠しています...');
        loadingScreen.classList.add('fade-out');
        
        // メインコンテンツを表示
        if (mainContent) {
            console.log('メインコンテンツを表示します');
            mainContent.classList.add('show');
        }
        
        setTimeout(function() {
            loadingScreen.style.display = 'none';
            console.log('ローディング画面を完全に非表示にしました');
        }, 500);
    }
}

// クリックやキーボードでローディング画面をスキップ
document.addEventListener('click', function() {
    hideLoadingScreen();
});

document.addEventListener('keydown', function(e) {
    // Enterキー、Spaceキー、Escapeキーでローディング画面を隠す
    if (e.code === 'Enter' || e.code === 'Space' || e.code === 'Escape') {
        hideLoadingScreen();
    }
});

// 安全策: 8秒後に確実にメインコンテンツを表示
safetyTimer = setTimeout(function() {
    console.log('=== 安全策実行 ===');
    const mainContent = document.getElementById('main-content');
    const loadingScreen = document.getElementById('loading-screen');
    
    if (mainContent && !mainContent.classList.contains('show')) {
        console.log('安全策: メインコンテンツを表示');
        mainContent.classList.add('show');
    }
    
    if (loadingScreen && loadingScreen.style.display !== 'none') {
        console.log('安全策: ローディング画面を隠す');
        hideLoadingScreen();
    }
}, 8000);

// 統計情報の読み込みと表示
function loadStatsData() {
    console.log('=== 統計情報の読み込みを開始 ===');
    
    // ローカルストレージの全内容を確認
    console.log('ローカルストレージの全キー:', Object.keys(localStorage));
    
    // ローカルストレージから統計情報を取得
    let stats = {};
    try {
        const rawStats = localStorage.getItem('siteStats');
        console.log('生の統計情報データ:', rawStats);
        
        if (rawStats) {
            stats = JSON.parse(rawStats);
            console.log('パース後の統計情報:', stats);
        } else {
            console.log('統計情報が見つかりません、デフォルト値を使用');
            // デフォルト統計情報を設定
            stats = {
                companyYears: 38,
                projectCount: '1000+',
                safetyRate: '100%'
            };
            console.log('デフォルト統計情報を設定:', stats);
        }
    } catch (e) {
        console.error('統計情報の読み込みエラー:', e);
        // エラーの場合もデフォルト値を使用
        stats = {
            companyYears: 38,
            projectCount: '1000+',
            safetyRate: '100%'
        };
    }
    
    // 統計情報をページに反映
    updateStatsDisplay(stats);
}

// 統計情報の表示更新
function updateStatsDisplay(stats) {
    console.log('=== 統計情報の表示更新開始 ===');
    console.log('受け取った統計情報:', stats);
    
    // デフォルト値
    const defaultStats = {
        companyYears: 38,
        projectCount: '1000+',
        safetyRate: '100%'
    };
    
    // 各統計値の要素を取得
    const yearsStat = document.querySelector('.stat-experience .stat-number');
    const projectsStat = document.querySelector('.stat-projects .stat-number');
    const safetyStat = document.querySelector('.stat-satisfaction .stat-number');
    
    console.log('年数要素:', yearsStat);
    console.log('施工実績要素:', projectsStat);
    console.log('安全施工要素:', safetyStat);
    
    if (yearsStat) {
        const newValue = stats.companyYears || defaultStats.companyYears;
        const oldValue = yearsStat.textContent;
        yearsStat.textContent = newValue;
        console.log('年数を更新:', oldValue, '→', newValue);
    } else {
        console.error('年数の統計要素が見つかりません');
    }
    
    if (projectsStat) {
        const newValue = stats.projectCount || defaultStats.projectCount;
        const oldValue = projectsStat.textContent;
        projectsStat.textContent = newValue;
        console.log('施工実績数を更新:', oldValue, '→', newValue);
    } else {
        console.error('施工実績の統計要素が見つかりません');
    }
    
    if (safetyStat) {
        const newValue = stats.safetyRate || defaultStats.safetyRate;
        const oldValue = safetyStat.textContent;
        safetyStat.textContent = newValue;
        console.log('安全施工率を更新:', oldValue, '→', newValue);
    } else {
        console.error('安全施工の統計要素が見つかりません');
    }
    
    console.log('=== 統計情報の表示更新完了 ===');
}

// 工事実績統計の読み込みと表示
function loadWorksStatsData() {
    // works.htmlページでのみ実行
    if (!document.querySelector('.works-stat-core')) {
        console.log('工事実績統計要素が見つかりません（works.htmlページではない）');
        return;
    }
    
    console.log('=== 工事実績統計の読み込みを開始 ===');
    
    // ローカルストレージから工事実績統計を取得
    let worksStats = {};
    try {
        const rawWorksStats = localStorage.getItem('worksStats');
        console.log('生の工事実績統計データ:', rawWorksStats);
        
        if (rawWorksStats) {
            worksStats = JSON.parse(rawWorksStats);
            console.log('パース後の工事実績統計:', worksStats);
        } else {
            console.log('工事実績統計が見つかりません、デフォルト値を使用');
            // デフォルト工事実績統計を設定
            worksStats = {
                coreCount: '1,500+',
                anchorCount: '3,000+',
                inspectionCount: '500+',
                experienceYears: '30+'
            };
            console.log('デフォルト工事実績統計を設定:', worksStats);
        }
    } catch (e) {
        console.error('工事実績統計の読み込みエラー:', e);
        // エラーの場合もデフォルト値を使用
        worksStats = {
            coreCount: '1,500+',
            anchorCount: '3,000+',
            inspectionCount: '500+',
            experienceYears: '30+'
        };
    }
    
    // 工事実績統計をページに反映
    updateWorksStatsDisplay(worksStats);
}

// 工事実績統計の表示更新
function updateWorksStatsDisplay(worksStats) {
    console.log('=== 工事実績統計の表示更新開始 ===');
    console.log('受け取った工事実績統計:', worksStats);
    
    // デフォルト値
    const defaultWorksStats = {
        coreCount: '1,500+',
        anchorCount: '3,000+',
        inspectionCount: '500+',
        experienceYears: '30+'
    };
    
    // 各統計値の要素を取得
    const coreStat = document.querySelector('.works-stat-core');
    const anchorStat = document.querySelector('.works-stat-anchor');
    const inspectionStat = document.querySelector('.works-stat-inspection');
    const experienceStat = document.querySelector('.works-stat-experience');
    
    console.log('コア穿孔件数要素:', coreStat);
    console.log('アンカー施工本数要素:', anchorStat);
    console.log('検査実施件数要素:', inspectionStat);
    console.log('経験年数要素:', experienceStat);
    
    if (coreStat) {
        const newValue = worksStats.coreCount || defaultWorksStats.coreCount;
        const oldValue = coreStat.textContent;
        coreStat.textContent = newValue;
        console.log('コア穿孔件数を更新:', oldValue, '→', newValue);
    } else {
        console.error('コア穿孔件数の統計要素が見つかりません');
    }
    
    if (anchorStat) {
        const newValue = worksStats.anchorCount || defaultWorksStats.anchorCount;
        const oldValue = anchorStat.textContent;
        anchorStat.textContent = newValue;
        console.log('アンカー施工本数を更新:', oldValue, '→', newValue);
    } else {
        console.error('アンカー施工本数の統計要素が見つかりません');
    }
    
    if (inspectionStat) {
        const newValue = worksStats.inspectionCount || defaultWorksStats.inspectionCount;
        const oldValue = inspectionStat.textContent;
        inspectionStat.textContent = newValue;
        console.log('検査実施件数を更新:', oldValue, '→', newValue);
    } else {
        console.error('検査実施件数の統計要素が見つかりません');
    }
    
    if (experienceStat) {
        const newValue = worksStats.experienceYears || defaultWorksStats.experienceYears;
        const oldValue = experienceStat.textContent;
        experienceStat.textContent = newValue;
        console.log('経験年数を更新:', oldValue, '→', newValue);
    } else {
        console.error('経験年数の統計要素が見つかりません');
    }
    
    console.log('=== 工事実績統計の表示更新完了 ===');
}

// 事業案内の読み込みと表示
function loadServicesData() {
    // index.htmlページでのみ実行
    const servicesGrid = document.querySelector('.services-grid');
    if (!servicesGrid) {
        console.log('事業案内要素が見つかりません（index.htmlページではない）');
        return;
    }
    
    console.log('=== 事業案内の読み込みを開始 ===');
    
    // ローカルストレージから事業案内データを取得
    let servicesData = [];
    try {
        const rawServices = localStorage.getItem('services');
        console.log('生の事業案内データ:', rawServices);
        
        if (rawServices) {
            servicesData = JSON.parse(rawServices);
            console.log('パース後の事業案内:', servicesData);
        } else {
            console.log('事業案内が見つかりません、デフォルト値を使用');
        }
    } catch (e) {
        console.error('事業案内の読み込みエラー:', e);
    }
    
    // データが0件の場合はデフォルトデータを使用
    if (servicesData.length === 0) {
        console.log('デフォルト事業案内データを使用');
        servicesData = [
            {
                id: 1,
                name: 'ダイヤモンドコア工事',
                description: '精密な穴あけ工事でφ25mm～φ600mmまで対応',
                icon: '💎'
            },
            {
                id: 2,
                name: '各種アンカー工事',
                description: 'ケミカルアンカー等による確実な固定・補強工事',
                icon: '⚓'
            },
            {
                id: 3,
                name: '非破壊検査・X線調査',
                description: '構造物の内部状況を非破壊で検査',
                icon: '🔍'
            }
        ];
    }
    
    // HTML生成（ホームページ用のコンパクト表示）
    const servicesHTML = servicesData.map(function(service) {
        const icon = service.icon || '🔧';
        const name = service.name || 'サービス名';
        const description = service.description || 'サービス説明';
        
        return '<div class="service-card service-card-compact">' +
               '<div class="service-icon">' + icon + '</div>' +
               '<h3 class="service-title">' + name + '</h3>' +
               '<p class="service-description">' + description + '</p>' +
               '</div>';
    }).join('');
    
    // フォールバック内容を削除して動的コンテンツを表示
    const fallbackElements = servicesGrid.querySelectorAll('.fallback-content');
    fallbackElements.forEach(function(element) {
        element.remove();
    });
    
    servicesGrid.innerHTML = servicesHTML;
    console.log('事業案内表示完了:', servicesData.length + '件');
}

// 事業案内詳細の読み込みと表示
function loadServicesDetailData() {
    // services.htmlページでのみ実行
    const servicesDetails = document.querySelector('.services-details');
    if (!servicesDetails) {
        console.log('事業案内詳細要素が見つかりません（services.htmlページではない）');
        return;
    }
    
    console.log('=== 事業案内詳細の読み込みを開始 ===');
    
    // ローカルストレージから事業案内データを取得
    let servicesData = [];
    try {
        const rawServices = localStorage.getItem('services');
        console.log('生の事業案内データ:', rawServices);
        
        if (rawServices) {
            servicesData = JSON.parse(rawServices);
            console.log('パース後の事業案内:', servicesData);
        } else {
            console.log('事業案内が見つかりません、デフォルト値を使用');
        }
    } catch (e) {
        console.error('事業案内の読み込みエラー:', e);
    }
    
    // データが0件の場合はデフォルトデータを使用
    if (servicesData.length === 0) {
        console.log('デフォルト事業案内データを使用');
        servicesData = [
            {
                id: 1,
                name: 'ダイヤモンドコア工事',
                description: 'φ25mm～φ600mmまで対応可能な高精度コンクリート穿孔工事',
                icon: '💎',
                features: [
                    '高精度な穿孔技術',
                    '大型から小型まで幅広い対応',
                    '低振動・低騒音での施工'
                ],
                applications: [
                    '配管・配線用穿孔',
                    'アンカーボルト用穿孔',
                    '構造物解体'
                ]
            },
            {
                id: 2,
                name: '各種アンカー工事',
                description: 'ケミカルアンカー等による確実な固定・補強工事',
                icon: '⚓',
                features: [
                    'ケミカルアンカーによる強固な固定',
                    '各種アンカーボルトに対応',
                    '耐震補強工事対応'
                ],
                applications: [
                    '構造物の補強・固定',
                    '設備機器の据付',
                    '耐震補強工事'
                ]
            },
            {
                id: 3,
                name: '非破壊検査・X線調査',
                description: '構造物の内部状況を非破壊で詳細に検査',
                icon: '🔍',
                features: [
                    'X線透過検査',
                    '超音波探傷検査',
                    '電磁誘導検査'
                ],
                applications: [
                    '鉄筋探査',
                    'PC鋼線・鋼材配置確認',
                    '内部欠陥検査'
                ]
            }
        ];
    }
    
    // HTML生成（詳細ページ用の完全表示）
    const servicesHTML = servicesData.map(function(service) {
        const icon = service.icon || '🔧';
        const name = service.name || 'サービス名';
        const description = service.description || 'サービス説明';
        const features = service.features || [];
        const applications = service.applications || [];
        
        // 特徴リストのHTML
        let featuresHTML = '';
        if (features.length > 0) {
            featuresHTML = '<div class="service-features">' +
                          '<h4><i class="fas fa-star"></i> 主な特徴</h4>' +
                          '<ul>' +
                          features.map(function(feature) {
                              return '<li>' + feature + '</li>';
                          }).join('') +
                          '</ul>' +
                          '</div>';
        }
        
        // 用途リストのHTML
        let applicationsHTML = '';
        if (applications.length > 0) {
            applicationsHTML = '<div class="service-applications">' +
                              '<h4><i class="fas fa-wrench"></i> 主な用途</h4>' +
                              '<ul>' +
                              applications.map(function(application) {
                                  return '<li>' + application + '</li>';
                              }).join('') +
                              '</ul>' +
                              '</div>';
        }
        
        return '<div class="service-detail-item">' +
               '<div class="service-detail-header">' +
               '<div class="service-detail-icon">' + icon + '</div>' +
               '<div class="service-detail-title">' +
               '<h3>' + name + '</h3>' +
               '<p>' + description + '</p>' +
               '</div>' +
               '</div>' +
               '<div class="service-detail-content">' +
               featuresHTML +
               applicationsHTML +
               '</div>' +
               '</div>';
    }).join('');
    
    servicesDetails.innerHTML = servicesHTML;
    console.log('事業案内詳細表示完了:', servicesData.length + '件');
}

// お知らせの読み込みと表示
function loadNewsData() {
    // index.htmlページでのみ実行
    const newsList = document.getElementById('news-list');
    if (!newsList) {
        console.log('お知らせ要素が見つかりません（index.htmlページではない）');
        return;
    }
    
    console.log('=== お知らせの読み込みを開始 ===');
    
    // ローカルストレージからお知らせデータを取得
    let newsData = [];
    try {
        const rawNews = localStorage.getItem('news');
        console.log('生のお知らせデータ:', rawNews);
        
        if (rawNews) {
            newsData = JSON.parse(rawNews);
            console.log('パース後のお知らせ:', newsData);
        } else {
            console.log('お知らせが見つかりません、デフォルト値を使用');
        }
    } catch (e) {
        console.error('お知らせの読み込みエラー:', e);
    }
    
    // データが0件の場合はデフォルトデータを使用
    if (newsData.length === 0) {
        console.log('デフォルトお知らせデータを使用');
        newsData = [
            {
                id: 1,
                title: 'ホームページをリニューアルしました',
                content: 'この度、株式会社ニシボのホームページを全面的にリニューアルいたしました。',
                date: new Date().toISOString().split('T')[0],
                category: 'お知らせ'
            },
            {
                id: 2,
                title: '年末年始休業のお知らせ',
                content: '誠に勝手ながら、年末年始は下記の期間を休業とさせていただきます。',
                date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                category: 'お知らせ'
            }
        ];
    }
    
    // 最新2件を取得
    const latestNews = newsData.slice(0, 2);
    console.log('表示するお知らせ（最新2件）:', latestNews);
    
    // HTML生成（ホームページ用の簡潔表示）
    const newsHTML = latestNews.map(function(news) {
        const title = news.title || 'お知らせ';
        const content = news.content || '';
        const date = formatNewsDate(news.date);
        const category = news.category || 'お知らせ';
        
        // 内容を100文字に制限
        const shortContent = content.length > 100 ? content.substring(0, 100) + '...' : content;
        
        return '<div class="news-item">' +
               '<div class="news-date">' +
               '<span class="news-category">' + category + '</span>' +
               '<span class="news-time">' + date + '</span>' +
               '</div>' +
               '<div class="news-content">' +
               '<h3 class="news-title">' + title + '</h3>' +
               '<p class="news-summary">' + shortContent + '</p>' +
               '</div>' +
               '</div>';
    }).join('');
    
    newsList.innerHTML = newsHTML;
    console.log('お知らせ表示完了:', latestNews.length + '件');
}

// お知らせ日付のフォーマット
function formatNewsDate(dateString) {
    if (!dateString) return '';
    try {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return year + '.' + month + '.' + day;
    } catch (e) {
        return dateString;
    }
}

// 工事実績の基本表示
function loadBasicWorks() {
    console.log('基本的な工事実績表示を開始');
    
    const worksContainer = document.querySelector('.works-grid, .works-slider');
    if (!worksContainer) {
        console.log('工事実績コンテナが見つかりません');
        return;
    }
    
    // ローカルストレージから工事実績データを取得
    let worksData = [];
    try {
        const rawData = localStorage.getItem('works');
        if (rawData) {
            worksData = JSON.parse(rawData);
            console.log('ローカルストレージから工事実績データを取得:', worksData.length + '件');
        }
    } catch (e) {
        console.error('工事実績データの読み込みエラー:', e);
    }
    
    // データが0件の場合はデフォルトデータを使用
    if (worksData.length === 0) {
        console.log('デフォルト工事実績データを使用');
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
    
    // アップロード画像の処理
    console.log('=== アップロード画像処理開始 ===');
    const uploadedFiles = JSON.parse(localStorage.getItem('uploadedFiles') || '{}');
    console.log('アップロードファイル数:', Object.keys(uploadedFiles).length);
    console.log('アップロードファイル一覧:', Object.keys(uploadedFiles));
    
    worksData.forEach(function(work, index) {
        console.log(`工事実績 ${index + 1}: ${work.title}`);
        console.log('  画像パス:', work.image);
        
        if (work.image && work.image.indexOf('images/uploads/') === 0) {
            // アップロード画像の場合
            const fileName = work.image.split('/').pop();
            console.log('  アップロード画像ファイル名:', fileName);
            
            try {
                if (uploadedFiles[fileName] && uploadedFiles[fileName].dataUrl) {
                    work.displayImage = uploadedFiles[fileName].dataUrl;
                    console.log('  ✅ base64データを設定 (長さ:', uploadedFiles[fileName].dataUrl.length, ')');
                } else {
                    console.warn('  ❌ base64データが見つからないため、デフォルト画像を使用');
                    console.log('  利用可能なアップロードファイル:', Object.keys(uploadedFiles));
                    work.displayImage = 'images/sample/work1.jpg';
                }
            } catch (e) {
                console.error('  ❌ アップロード画像処理エラー:', e);
                work.displayImage = 'images/sample/work1.jpg';
            }
        } else {
            // 通常の画像の場合
            work.displayImage = work.image || 'images/sample/work1.jpg';
            console.log('  📁 通常画像を設定:', work.displayImage);
        }
        
        console.log('  最終表示画像:', work.displayImage.substring(0, 50) + (work.displayImage.length > 50 ? '...' : ''));
    });
    
    console.log('=== アップロード画像処理完了 ===');
    
    // HTML生成
    let html = '';
    
    if (worksContainer.classList.contains('works-slider')) {
        // スライダー形式
        const doubledWorks = worksData.concat(worksData);
        html = doubledWorks.map(function(work) {
            const imageUrl = work.displayImage;
            const isBase64 = imageUrl.startsWith('data:');
            
            return '<div class="work-slide" data-category="' + work.category + '">' +
                   '<div class="work-image">' +
                   '<img src="' + imageUrl + '" alt="' + work.title + '" loading="lazy" ' +
                   'onerror="console.error(\'画像読み込みエラー: ' + work.title + '\'); this.src=\'images/sample/work1.jpg\';" ' +
                   'onload="console.log(\'画像読み込み成功: ' + work.title + (isBase64 ? ' (base64)' : ' (URL)') + '\');">' +
                   '</div>' +
                   '<div class="work-info">' +
                   '<h3 class="work-title">' + work.title + '</h3>' +
                   '<p class="work-location">' + work.location + '</p>' +
                   '<p class="work-description">' + work.description + '</p>' +
                   '</div>' +
                   '</div>';
        }).join('');
    } else {
        // グリッド形式（works.htmlページ用）
        html = worksData.map(function(work) {
            const imageUrl = work.displayImage;
            const isBase64 = imageUrl.startsWith('data:');
            
            return '<div class="work-item" data-category="' + work.category + '">' +
                   '<div class="work-image">' +
                   '<img src="' + imageUrl + '" alt="' + work.title + '" loading="lazy" ' +
                   'onerror="console.error(\'画像読み込みエラー: ' + work.title + '\'); this.src=\'images/sample/work1.jpg\';" ' +
                   'onload="console.log(\'画像読み込み成功: ' + work.title + (isBase64 ? ' (base64)' : ' (URL)') + '\');">' +
                   '</div>' +
                   '<div class="work-info">' +
                   '<h3 class="work-title">' + work.title + '</h3>' +
                   '<p class="work-category">' + getCategoryDisplayName(work.category) + '</p>' +
                   '<p class="work-location">' + work.location + '</p>' +
                   '<p class="work-description">' + work.description + '</p>' +
                   '<div class="work-details">' +
                   '<span class="detail-item">施工日: ' + formatDate(work.date) + '</span>' +
                   '</div>' +
                   '</div>' +
                   '</div>';
        }).join('');
    }
    
    worksContainer.innerHTML = html;
    console.log('工事実績表示完了:', worksData.length + '件');
}

// カテゴリ表示名取得
function getCategoryDisplayName(category) {
    const categories = {
        'diamond-core': 'ダイヤモンドコア工事',
        'anchor': 'アンカー工事',
        'inspection': '非破壊検査'
    };
    return categories[category] || category;
}

// 日付フォーマット
function formatDate(dateString) {
    if (!dateString) return '';
    try {
        const date = new Date(dateString);
        return date.getFullYear() + '年' + 
               (date.getMonth() + 1) + '月' + 
               date.getDate() + '日';
    } catch (e) {
        return dateString;
    }
}

// 後で定義される安全策タイマー
let safetyTimer;

console.log('緊急修正版 script.js 読み込み完了');