// 管理画面のJavaScript

// パスワード設定（本番環境では環境変数を使用）
const ADMIN_PASSWORD = 'nishibo2024';

// 画像選択の更新
function updateImageInput() {
    const select = document.getElementById('workImageSelect');
    const input = document.getElementById('workImage');
    const preview = document.getElementById('workImagePreview');
    
    if (select.value) {
        input.value = select.value;
        showImagePreview(select.value, preview);
        
        // ファイルアップロードをクリア
        const fileInput = document.getElementById('workImageFile');
        if (fileInput) fileInput.value = '';
    } else {
        preview.innerHTML = '';
    }
}

// 画像プレビューの表示
function showImagePreview(imagePath, previewElement) {
    if (imagePath) {
        const fileName = imagePath.split('/').pop();
        previewElement.innerHTML = `
            <img src="${imagePath}" alt="プレビュー" onerror="this.style.display='none'">
            <div class="preview-filename">${fileName}</div>
        `;
    }
}

// ファイルアップロード処理
function handleFileUpload(fileInput, previewId, targetInputId) {
    const file = fileInput.files[0];
    const previewElement = document.getElementById(previewId);
    const targetInput = document.getElementById(targetInputId);
    
    if (file) {
        // ファイルサイズチェック (5MB制限)
        if (file.size > 5 * 1024 * 1024) {
            alert('ファイルサイズが大きすぎます。5MB以下のファイルを選択してください。');
            fileInput.value = '';
            return;
        }
        
        // ファイル形式チェック
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
            alert('サポートされていないファイル形式です。JPG、PNG、GIFファイルを選択してください。');
            fileInput.value = '';
            return;
        }
        
        // FileReaderでプレビュー表示
        const reader = new FileReader();
        reader.onload = function(e) {
            const imageUrl = e.target.result;
            
            // プレビュー表示
            previewElement.innerHTML = `
                <img src="${imageUrl}" alt="アップロード画像プレビュー" style="max-width: 200px; max-height: 150px; border-radius: 8px;">
                <div class="preview-filename">
                    <strong>アップロード予定:</strong> ${file.name}
                    <br><small>サイズ: ${(file.size / 1024).toFixed(1)} KB</small>
                </div>
            `;
            
            // 一意のファイル名を生成して対象inputに設定
            const timestamp = Date.now();
            const extension = file.name.split('.').pop();
            const uniqueFileName = `uploaded_${timestamp}.${extension}`;
            targetInput.value = `images/uploads/${uniqueFileName}`;
            
            // ローカルストレージにbase64形式で一時保存
            const uploadData = {
                fileName: uniqueFileName,
                originalName: file.name,
                dataUrl: imageUrl,
                timestamp: timestamp
            };
            
            // 既存のアップロードファイルリストを取得
            let uploadedFiles = JSON.parse(localStorage.getItem('uploadedFiles')) || {};
            uploadedFiles[uniqueFileName] = uploadData;
            localStorage.setItem('uploadedFiles', JSON.stringify(uploadedFiles));
            
            // 他の選択をクリア
            clearOtherImageSelections(fileInput.id);
        };
        
        reader.readAsDataURL(file);
    }
}

// 他の画像選択をクリアする
function clearOtherImageSelections(currentInputId) {
    if (currentInputId !== 'workImageFile') {
        // ファイル選択をクリア
        const fileInput = document.getElementById('workImageFile');
        if (fileInput) fileInput.value = '';
    }
    
    // セレクトボックスをクリア
    const selectInput = document.getElementById('workImageSelect');
    if (selectInput) selectInput.value = '';
}

// 初期化
document.addEventListener('DOMContentLoaded', function() {
    // ログイン状態をチェック
    checkLoginStatus();
    
    // ログインフォームのイベントリスナー
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    
    // お知らせフォームのイベントリスナー
    document.getElementById('newsForm').addEventListener('submit', handleNewsSubmit);
    
    // 施工実績フォームのイベントリスナー
    document.getElementById('worksForm').addEventListener('submit', handleWorksSubmit);
    
    // 画像入力フィールドのイベントリスナー
    document.getElementById('workImage').addEventListener('input', function() {
        const preview = document.getElementById('workImagePreview');
        showImagePreview(this.value, preview);
    });
    
    // データを読み込み
    loadNews();
    loadWorks();
});

// ログイン処理
function handleLogin(e) {
    e.preventDefault();
    const password = document.getElementById('password').value;
    
    if (password === ADMIN_PASSWORD) {
        sessionStorage.setItem('admin_authenticated', 'true');
        showAdminContent();
    } else {
        alert('パスワードが間違っています');
    }
}

// ログイン状態チェック
function checkLoginStatus() {
    if (sessionStorage.getItem('admin_authenticated') === 'true') {
        showAdminContent();
    }
}

// 管理画面表示
function showAdminContent() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('admin-content').style.display = 'block';
    
    // ログイン後に最初のセクションを表示
    setTimeout(() => {
        showSection('news');
        console.log('ログイン後にニュースセクションを表示');
    }, 100);
}

// ログアウト
function logout() {
    sessionStorage.removeItem('admin_authenticated');
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('admin-content').style.display = 'none';
    document.getElementById('password').value = '';
}

// 古いshowSection関数を削除（下で新しい版を使用）

// お知らせ送信処理
function handleNewsSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const newsItem = {
        id: Date.now(),
        title: formData.get('title'),
        category: formData.get('category'),
        content: formData.get('content'),
        date: new Date().toISOString().split('T')[0]
    };
    
    // LocalStorageに保存
    let news = JSON.parse(localStorage.getItem('news') || '[]');
    news.unshift(newsItem); // 新しいものを先頭に
    localStorage.setItem('news', JSON.stringify(news));
    
    // フォームクリア
    e.target.reset();
    
    // 成功メッセージ表示
    showStatusMessage('news-status', 'お知らせを追加しました', 'success');
    
    // リスト更新
    loadNews();
}

// 施工実績送信処理
function handleWorksSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    let works = JSON.parse(localStorage.getItem('works') || '[]');
    
    if (window.editingWorkId) {
        // 編集モード
        const workIndex = works.findIndex(w => w.id === window.editingWorkId);
        if (workIndex !== -1) {
            const workItem = {
                id: window.editingWorkId, // 既存のIDを保持
                title: formData.get('title'),
                category: formData.get('category'),
                location: formData.get('location'),
                description: formData.get('description'),
                image: formData.get('image') || 'images/sample/work1.jpg',
                date: works[workIndex].date // 元の日付を保持
            };
            
            works[workIndex] = workItem;
            localStorage.setItem('works', JSON.stringify(works));
            
            // 編集モードを終了
            cancelWorkEdit();
            
            // 成功メッセージ表示
            showStatusMessage('works-status', '施工実績を更新しました', 'success');
        } else {
            showStatusMessage('works-status', '編集対象の施工実績が見つかりません。', 'error');
        }
    } else {
        // 新規追加モード
        const workItem = {
            id: Date.now(),
            title: formData.get('title'),
            category: formData.get('category'),
            location: formData.get('location'),
            description: formData.get('description'),
            image: formData.get('image') || 'images/sample/work1.jpg',
            date: new Date().toISOString().split('T')[0]
        };
        
        works.unshift(workItem); // 新しいものを先頭に
        localStorage.setItem('works', JSON.stringify(works));
        
        // フォームクリア
        e.target.reset();
        
        // 成功メッセージ表示
        showStatusMessage('works-status', '施工実績を追加しました', 'success');
    }
    
    // リスト更新
    loadWorks();
}

// お知らせ読み込み
function loadNews() {
    const news = JSON.parse(localStorage.getItem('news') || '[]');
    const newsList = document.getElementById('news-list');
    
    newsList.innerHTML = '';
    
    news.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.date}</td>
            <td><span class="category-badge ${item.category}">${getCategoryName(item.category)}</span></td>
            <td>${item.title}</td>
            <td class="item-actions">
                <button class="btn-admin btn-small btn-danger" onclick="deleteNews(${item.id})">削除</button>
            </td>
        `;
        newsList.appendChild(row);
    });
}

// 施工実績読み込み
function loadWorks() {
    const works = JSON.parse(localStorage.getItem('works') || '[]');
    const worksList = document.getElementById('works-list');
    
    worksList.innerHTML = '';
    
    works.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.date}</td>
            <td>${getWorkCategoryName(item.category)}</td>
            <td>${item.title}</td>
            <td>${item.location}</td>
            <td class="item-actions">
                <button class="btn-admin btn-small btn-primary" onclick="editWork(${item.id})">編集</button>
                <button class="btn-admin btn-small btn-danger" onclick="deleteWork(${item.id})">削除</button>
            </td>
        `;
        worksList.appendChild(row);
    });
}

// お知らせ削除
function deleteNews(id) {
    if (confirm('このお知らせを削除しますか？')) {
        let news = JSON.parse(localStorage.getItem('news') || '[]');
        news = news.filter(item => item.id !== id);
        localStorage.setItem('news', JSON.stringify(news));
        
        showStatusMessage('news-status', 'お知らせを削除しました', 'success');
        loadNews();
    }
}

// 施工実績の編集
function editWork(id) {
    const works = JSON.parse(localStorage.getItem('works') || '[]');
    const work = works.find(w => w.id === id);
    
    if (!work) {
        showStatusMessage('works-status', '施工実績が見つかりません。', 'error');
        return;
    }
    
    // フォームに既存データを設定
    document.getElementById('workDate').value = work.date;
    document.getElementById('workCategory').value = work.category;
    document.getElementById('workTitle').value = work.title;
    document.getElementById('workLocation').value = work.location;
    document.getElementById('workDescription').value = work.description;
    document.getElementById('workImage').value = work.image;
    
    // 画像プレビューの表示
    if (work.image) {
        showImagePreview(work.image, document.getElementById('workImagePreview'));
    }
    
    // 編集モードフラグを設定
    window.editingWorkId = id;
    
    // フォームタイトルを変更
    const formTitle = document.querySelector('#works-section h3');
    if (formTitle && formTitle.textContent === '新しい実績の追加') {
        formTitle.textContent = '実績の編集';
        formTitle.style.color = '#f39c12';
    }
    
    // 保存ボタンのテキストを変更
    const submitBtn = document.querySelector('#works-section button[type="submit"]');
    if (submitBtn) {
        submitBtn.textContent = '更新';
        submitBtn.style.backgroundColor = '#f39c12';
    }
    
    // キャンセルボタンを追加
    if (!document.getElementById('cancelEditWork')) {
        const cancelBtn = document.createElement('button');
        cancelBtn.type = 'button';
        cancelBtn.id = 'cancelEditWork';
        cancelBtn.textContent = 'キャンセル';
        cancelBtn.className = 'btn btn-secondary';
        cancelBtn.style.marginLeft = '10px';
        cancelBtn.onclick = cancelWorkEdit;
        submitBtn.parentNode.insertBefore(cancelBtn, submitBtn.nextSibling);
    }
    
    showStatusMessage('works-status', `「${work.title}」の編集を開始しました。`, 'info');
}

// 施工実績編集のキャンセル
function cancelWorkEdit() {
    delete window.editingWorkId;
    
    // フォームをリセット
    document.getElementById('workForm').reset();
    document.getElementById('workImagePreview').innerHTML = '';
    
    // フォームタイトルを元に戻す
    const formTitle = document.querySelector('#works-section h3');
    if (formTitle) {
        formTitle.textContent = '新しい実績の追加';
        formTitle.style.color = '';
    }
    
    // 保存ボタンを元に戻す
    const submitBtn = document.querySelector('#works-section button[type="submit"]');
    if (submitBtn) {
        submitBtn.textContent = '実績を追加';
        submitBtn.style.backgroundColor = '';
    }
    
    // キャンセルボタンを削除
    const cancelBtn = document.getElementById('cancelEditWork');
    if (cancelBtn) {
        cancelBtn.remove();
    }
    
    showStatusMessage('works-status', '編集をキャンセルしました。', 'info');
}

// 施工実績削除
function deleteWork(id) {
    if (confirm('この施工実績を削除しますか？')) {
        let works = JSON.parse(localStorage.getItem('works') || '[]');
        works = works.filter(item => item.id !== id);
        localStorage.setItem('works', JSON.stringify(works));
        
        showStatusMessage('works-status', '施工実績を削除しました', 'success');
        loadWorks();
    }
}

// ステータスメッセージ表示
function showStatusMessage(containerId, message, type) {
    const container = document.getElementById(containerId);
    const statusDiv = document.createElement('div');
    statusDiv.className = `status-message status-${type}`;
    statusDiv.textContent = message;
    
    container.innerHTML = '';
    container.appendChild(statusDiv);
    
    // 3秒後に消去
    setTimeout(() => {
        container.innerHTML = '';
    }, 3000);
}

// フォームクリア
function clearForm(formId) {
    document.getElementById(formId).reset();
    
    // 施工実績フォームの場合、画像プレビューもクリア
    if (formId === 'worksForm') {
        document.getElementById('workImagePreview').innerHTML = '';
        document.getElementById('workImageSelect').value = '';
        document.getElementById('workImageFile').value = '';
    }
}

// カテゴリ名取得
function getCategoryName(category) {
    const categories = {
        'info': 'お知らせ',
        'work': '施工情報',
        'important': '重要'
    };
    return categories[category] || category;
}

// 施工実績カテゴリ名取得
function getWorkCategoryName(category) {
    const categories = {
        'diamond-core': 'ダイヤモンドコア工事',
        'anchor': 'アンカー工事',
        'inspection': '非破壊検査'
    };
    return categories[category] || category;
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

// サンプルデータ初期化（ページ読み込み時）
initializeSampleData();

// === 統計数値管理 ===

// 統計数値の初期化
function initializeStats() {
    const defaultStats = {
        companyYears: 38,
        projectCount: '1000+',
        employeeCount: 29,
        safetyRate: '100%'
    };
    
    if (!localStorage.getItem('siteStats')) {
        localStorage.setItem('siteStats', JSON.stringify(defaultStats));
    }
    
    loadStatsForm();
    updateStatsPreview();
}

// 統計数値フォームの読み込み
function loadStatsForm() {
    const stats = JSON.parse(localStorage.getItem('siteStats')) || {};
    
    document.getElementById('companyYears').value = stats.companyYears || 38;
    document.getElementById('projectCount').value = stats.projectCount || '1000+';
    document.getElementById('employeeCount').value = stats.employeeCount || 29;
    document.getElementById('safetyRate').value = stats.safetyRate || '100%';
}

// 統計数値プレビューの更新
function updateStatsPreview() {
    const stats = JSON.parse(localStorage.getItem('siteStats')) || {};
    
    document.getElementById('preview-years').textContent = stats.companyYears || 38;
    document.getElementById('preview-projects').textContent = stats.projectCount || '1000+';
    document.getElementById('preview-employees').textContent = stats.employeeCount || 29;
    document.getElementById('preview-safety').textContent = stats.safetyRate || '100%';
}

// 年数の自動計算
function autoCalculateYears() {
    const foundingYear = 1986; // 昭和61年
    const currentYear = new Date().getFullYear();
    const years = currentYear - foundingYear;
    
    document.getElementById('companyYears').value = years;
    showStatus('stats-status', `${foundingYear}年創業からの年数を自動計算しました: ${years}年`, 'success');
}

// 統計数値フォームの送信処理
document.addEventListener('DOMContentLoaded', function() {
    // 既存のイベントリスナーに追加
    const statsForm = document.getElementById('statsForm');
    if (statsForm) {
        statsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            const statsData = {
                companyYears: parseInt(formData.get('companyYears')),
                projectCount: formData.get('projectCount'),
                employeeCount: parseInt(formData.get('employeeCount')),
                safetyRate: formData.get('safetyRate')
            };
            
            // データの保存
            localStorage.setItem('siteStats', JSON.stringify(statsData));
            
            // プレビューの更新
            updateStatsPreview();
            
            // 成功メッセージ
            showStatus('stats-status', '統計数値が正常に更新されました。', 'success');
            
            // 実際のサイトに反映させる場合の処理をここに追加
            // updateSiteStats(statsData);
        });
    }
    
    // 統計数値の初期化
    initializeStats();
    
    // 新機能の初期化
    initializeCompanyInfo();
    initializeServices();
    initializeSEO();
    initializeContactSettings();
    initializeSiteSettings();
});

// === 会社基本情報管理 ===
function initializeCompanyInfo() {
    const defaultCompanyInfo = {
        companyName: '株式会社ニシボ',
        companyNameEn: 'NISHIBO Co., Ltd.',
        representative: '代表取締役 西坊 太郎',
        founded: 1986,
        address: '福岡県福岡市南区横手4丁目12-8',
        phone: '092-541-4649',
        fax: '092-541-4650',
        email: 'info@nishibo.co.jp',
        website: 'https://nishibo.co.jp',
        businessHours: '8:00〜17:00',
        businessDays: '月〜金曜日',
        companyDescription: '昭和61年創業以来、ボーリング工事の老舗として30数年の実績と経験を積み重ねてまいりました。業界内でも良く知られた優良企業として、安全・信頼・迅速対応・技術力・スピーディ施工をモットーに、お客様のニーズにお応えし続けています。'
    };
    
    if (!localStorage.getItem('companyInfo')) {
        localStorage.setItem('companyInfo', JSON.stringify(defaultCompanyInfo));
    }
    
    const companyForm = document.getElementById('companyForm');
    if (companyForm) {
        companyForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(e.target);
            const companyData = {};
            
            for (let [key, value] of formData.entries()) {
                companyData[key] = value;
            }
            
            localStorage.setItem('companyInfo', JSON.stringify(companyData));
            showStatus('company-status', '会社情報が正常に更新されました。メインサイトに反映されます。', 'success');
        });
    }
}

// === 事業案内管理 ===
function initializeServices() {
    // 既存データがない場合のみデフォルトデータを設定
    if (!localStorage.getItem('services')) {
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
            ],
            details: 'ダイヤモンドビットを使用した精密な穴あけ工事。'
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
            ],
            details: '構造物の補強・固定に最適なアンカー工事'
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
            ],
            details: 'X線撮影装置やRCレーダーを使用した非破壊検査'
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
            ],
            details: 'ウォールソー、ワイヤーソー等の専用機械を使用したコンクリート構造物の精密切断工事'
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
            ],
            details: '静的破砕剤を使用した無騒音・無振動の環境配慮型解体工事'
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
            ],
            details: '電動ハンマーやブレーカー等を使用したコンクリート構造物の斫り・解体工事'
        }
    ];
        localStorage.setItem('services', JSON.stringify(defaultServices));
    }
    
    loadServicesList();
    
    const serviceForm = document.getElementById('serviceForm');
    if (serviceForm) {
        serviceForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(e.target);
            
            // 仕様データのJSONパース
            let specs = [];
            try {
                const specsText = formData.get('serviceSpecs');
                if (specsText) {
                    specs = JSON.parse(specsText);
                }
            } catch (error) {
                showStatus('services-status', '仕様データのJSON形式が正しくありません。', 'error');
                return;
            }
            
            // 用途と特徴の配列化
            const applications = formData.get('serviceApplications') 
                ? formData.get('serviceApplications').split('\n').filter(item => item.trim())
                : [];
            const features = formData.get('serviceFeatures')
                ? formData.get('serviceFeatures').split('\n').filter(item => item.trim())
                : [];
            
            let services = JSON.parse(localStorage.getItem('services')) || [];
            
            if (window.editingServiceId) {
                // 編集モード
                const serviceIndex = services.findIndex(s => s.id === window.editingServiceId);
                if (serviceIndex !== -1) {
                    const serviceData = {
                        id: window.editingServiceId, // 既存のIDを保持
                        name: formData.get('serviceName'),
                        subtitle: formData.get('serviceSubtitle') || '',
                        icon: formData.get('serviceIcon'),
                        description: formData.get('serviceDescription'),
                        detailedDescription: formData.get('serviceDetailedDescription') || '',
                        specs: specs,
                        applications: applications,
                        features: features,
                        details: formData.get('serviceDetailedDescription') || ''
                    };
                    
                    services[serviceIndex] = serviceData;
                    localStorage.setItem('services', JSON.stringify(services));
                    console.log('管理画面: 事業更新完了:', serviceData.name);
                    
                    // 編集モードを終了
                    cancelServiceEdit();
                    
                    loadServicesList();
                    showStatus('services-status', '事業が正常に更新されました。メインサイトに反映されます。', 'success');
                } else {
                    showStatus('services-status', '編集対象の事業が見つかりません。', 'error');
                }
            } else {
                // 新規追加モード
                const serviceData = {
                    id: Date.now(),
                    name: formData.get('serviceName'),
                    subtitle: formData.get('serviceSubtitle') || '',
                    icon: formData.get('serviceIcon'),
                    description: formData.get('serviceDescription'),
                    detailedDescription: formData.get('serviceDetailedDescription') || '',
                    specs: specs,
                    applications: applications,
                    features: features,
                    details: formData.get('serviceDetailedDescription') || ''
                };
                
                console.log('管理画面: 事業追加前のservices件数:', services.length);
                services.push(serviceData);
                localStorage.setItem('services', JSON.stringify(services));
                console.log('管理画面: 事業追加後のservices件数:', services.length);
                console.log('管理画面: 保存されたservicesデータ:', services.map(s => s.name));
                
                loadServicesList();
                showStatus('services-status', '事業が正常に追加されました。メインサイトに反映されます。', 'success');
                e.target.reset();
            }
        });
    }
}

function loadServicesList() {
    const services = JSON.parse(localStorage.getItem('services')) || [];
    console.log('管理画面: loadServicesList実行, services件数:', services.length);
    console.log('管理画面: services一覧:', services.map(s => s.name));
    const servicesList = document.getElementById('services-list');
    
    if (servicesList) {
        servicesList.innerHTML = services.map(service => `
            <tr>
                <td>${service.name}</td>
                <td>${service.icon}</td>
                <td>${service.description}</td>
                <td>
                    <button onclick="editService(${service.id})" class="btn-admin btn-primary">編集</button>
                    <button onclick="deleteService(${service.id})" class="btn-admin btn-danger">削除</button>
                </td>
            </tr>
        `).join('');
    }
}

// 事業の編集
function editService(id) {
    const services = JSON.parse(localStorage.getItem('services')) || [];
    const service = services.find(s => s.id === id);
    
    if (!service) {
        showStatus('services-status', '事業が見つかりません。', 'error');
        return;
    }
    
    // フォームに既存データを設定
    document.getElementById('serviceName').value = service.name;
    document.getElementById('serviceSubtitle').value = service.subtitle || '';
    document.getElementById('serviceIcon').value = service.icon || '';
    document.getElementById('serviceDescription').value = service.description;
    document.getElementById('serviceDetailedDescription').value = service.detailedDescription || '';
    
    // 配列データの設定
    if (service.specs && service.specs.length > 0) {
        document.getElementById('serviceSpecs').value = JSON.stringify(service.specs, null, 2);
    }
    if (service.applications && service.applications.length > 0) {
        document.getElementById('serviceApplications').value = service.applications.join('\n');
    }
    if (service.features && service.features.length > 0) {
        document.getElementById('serviceFeatures').value = service.features.join('\n');
    }
    
    // 編集モードフラグを設定
    window.editingServiceId = id;
    
    // フォームタイトルを変更
    const formTitle = document.querySelector('#services-section h3');
    if (formTitle) {
        formTitle.textContent = '事業の編集';
        formTitle.style.color = '#f39c12';
    }
    
    // 保存ボタンのテキストを変更
    const submitBtn = document.querySelector('#services-section button[type="submit"]');
    if (submitBtn) {
        submitBtn.textContent = '更新';
        submitBtn.style.backgroundColor = '#f39c12';
    }
    
    // キャンセルボタンを追加
    if (!document.getElementById('cancelEditService')) {
        const cancelBtn = document.createElement('button');
        cancelBtn.type = 'button';
        cancelBtn.id = 'cancelEditService';
        cancelBtn.textContent = 'キャンセル';
        cancelBtn.className = 'btn btn-secondary';
        cancelBtn.style.marginLeft = '10px';
        cancelBtn.onclick = cancelServiceEdit;
        submitBtn.parentNode.insertBefore(cancelBtn, submitBtn.nextSibling);
    }
    
    showStatus('services-status', `「${service.name}」の編集を開始しました。`, 'info');
}

// 編集キャンセル
function cancelServiceEdit() {
    delete window.editingServiceId;
    
    // フォームをリセット
    document.getElementById('serviceForm').reset();
    
    // フォームタイトルを元に戻す
    const formTitle = document.querySelector('#services-section h3');
    if (formTitle) {
        formTitle.textContent = '新しい事業の追加';
        formTitle.style.color = '';
    }
    
    // 保存ボタンを元に戻す
    const submitBtn = document.querySelector('#services-section button[type="submit"]');
    if (submitBtn) {
        submitBtn.textContent = '事業を追加';
        submitBtn.style.backgroundColor = '';
    }
    
    // キャンセルボタンを削除
    const cancelBtn = document.getElementById('cancelEditService');
    if (cancelBtn) {
        cancelBtn.remove();
    }
    
    showStatus('services-status', '編集をキャンセルしました。', 'info');
}

function deleteService(id) {
    if (confirm('この事業を削除しますか？')) {
        let services = JSON.parse(localStorage.getItem('services')) || [];
        services = services.filter(service => service.id !== id);
        localStorage.setItem('services', JSON.stringify(services));
        loadServicesList();
        updateDataUsage();
        showStatus('services-status', '事業が削除されました。', 'success');
    }
}

// 事業案内データを元の固定データにリセット
function resetServicesData() {
    if (confirm('現在の事業案内データを削除して、元の6事業に戻しますか？\nこの操作は元に戻せません。')) {
        // 現在のデータを削除
        localStorage.removeItem('services');
        
        // デフォルトデータを再設定
        initializeServices();
        
        // 表示を更新
        loadServicesList();
        updateDataUsage();
        
        showStatus('services-status', '元の事業案内データ（6事業）に復元されました。ページをリロードしてメインサイトに反映してください。', 'success');
    }
}

// === SEO・メタ情報管理 ===
function initializeSEO() {
    const defaultSEOData = {
        index: {
            pageTitle: '株式会社ニシボ - 福岡のダイヤモンドコア工事・ボーリング工事専門会社',
            pageDescription: '昭和61年創業、福岡のボーリング工事のプロフェッショナル。ダイヤモンドコア工事、各種アンカー工事、非破壊検査を提供。',
            pageKeywords: 'ボーリング工事,ダイヤモンドコア,福岡,アンカー工事,非破壊検査',
            ogTitle: '株式会社ニシボ - 福岡のボーリング工事専門会社',
            ogDescription: '30数年の実績と経験。安全・信頼・迅速対応をモットーに、お客様のニーズにお応えします。'
        }
    };
    
    if (!localStorage.getItem('seoData')) {
        localStorage.setItem('seoData', JSON.stringify(defaultSEOData));
    }
    
    const seoForm = document.getElementById('seoForm');
    if (seoForm) {
        seoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(e.target);
            const page = document.getElementById('pageSelect').value;
            
            const seoData = JSON.parse(localStorage.getItem('seoData')) || {};
            seoData[page] = {
                pageTitle: formData.get('pageTitle'),
                pageDescription: formData.get('pageDescription'),
                pageKeywords: formData.get('pageKeywords'),
                ogTitle: formData.get('ogTitle'),
                ogDescription: formData.get('ogDescription')
            };
            
            localStorage.setItem('seoData', JSON.stringify(seoData));
            showStatus('seo-status', `${page}ページのSEO情報が更新されました。`, 'success');
        });
    }
}

function loadPageSEO() {
    const page = document.getElementById('pageSelect').value;
    const seoData = JSON.parse(localStorage.getItem('seoData')) || {};
    const pageData = seoData[page] || {};
    
    document.getElementById('pageTitle').value = pageData.pageTitle || '';
    document.getElementById('pageDescription').value = pageData.pageDescription || '';
    document.getElementById('pageKeywords').value = pageData.pageKeywords || '';
    document.getElementById('ogTitle').value = pageData.ogTitle || '';
    document.getElementById('ogDescription').value = pageData.ogDescription || '';
}

// === お問い合わせ設定管理 ===
function initializeContactSettings() {
    const defaultContactSettings = {
        formTitle: 'お問い合わせ',
        formDescription: 'ご質問やご相談がございましたら、お気軽にお問い合わせください。',
        autoReplySubject: '【株式会社ニシボ】お問い合わせありがとうございます',
        notificationEmail: 'info@nishibo.co.jp',
        autoReplyMessage: 'この度は、株式会社ニシボにお問い合わせいただき、ありがとうございます。\n\nお問い合わせ内容を確認させていただき、3営業日以内にご返信いたします。\nお急ぎの場合は、直接お電話（092-541-4649）にてお問い合わせください。\n\n今後ともどうぞよろしくお願いいたします。\n\n株式会社ニシボ'
    };
    
    if (!localStorage.getItem('contactSettings')) {
        localStorage.setItem('contactSettings', JSON.stringify(defaultContactSettings));
    }
    
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(e.target);
            const contactData = {};
            
            for (let [key, value] of formData.entries()) {
                contactData[key] = value;
            }
            
            localStorage.setItem('contactSettings', JSON.stringify(contactData));
            showStatus('contact-status', 'お問い合わせ設定が更新されました。', 'success');
        });
    }
}

// === サイト設定管理 ===
function initializeSiteSettings() {
    const defaultSiteSettings = {
        siteName: '株式会社ニシボ',
        siteTagline: '福岡のボーリング工事のプロフェッショナル',
        primaryColor: '#3b82f6',
        secondaryColor: '#1e40af',
        footerText: '© 2024 株式会社ニシボ. All rights reserved.',
        googleAnalytics: ''
    };
    
    if (!localStorage.getItem('siteSettings')) {
        localStorage.setItem('siteSettings', JSON.stringify(defaultSiteSettings));
    }
    
    const siteForm = document.getElementById('siteForm');
    if (siteForm) {
        siteForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(e.target);
            const siteData = {};
            
            for (let [key, value] of formData.entries()) {
                siteData[key] = value;
            }
            
            localStorage.setItem('siteSettings', JSON.stringify(siteData));
            showStatus('site-status', 'サイト設定が更新されました。', 'success');
        });
    }
}

function handleLogoUpload(fileInput) {
    const file = fileInput.files[0];
    const previewElement = document.getElementById('logoPreview');
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            previewElement.innerHTML = `
                <img src="${e.target.result}" alt="ロゴプレビュー" style="max-width: 200px; max-height: 100px;">
                <div class="preview-filename">${file.name}</div>
            `;
            
            // ロゴデータを保存
            const logoData = {
                fileName: file.name,
                dataUrl: e.target.result
            };
            localStorage.setItem('logoData', JSON.stringify(logoData));
        };
        reader.readAsDataURL(file);
    }
}

function previewColorChanges() {
    const primaryColor = document.getElementById('primaryColor').value;
    const secondaryColor = document.getElementById('secondaryColor').value;
    
    // 一時的にカラー変更を適用（プレビュー）
    document.documentElement.style.setProperty('--primary-color', primaryColor);
    document.documentElement.style.setProperty('--secondary-color', secondaryColor);
    
    showStatus('site-status', 'カラー変更のプレビューを適用しました。保存するには「サイト設定を更新」ボタンをクリックしてください。', 'success');
}

// === データ管理機能 ===
function exportAllData() {
    const allData = {
        news: JSON.parse(localStorage.getItem('news')) || [],
        works: JSON.parse(localStorage.getItem('works')) || [],
        stats: JSON.parse(localStorage.getItem('stats')) || {},
        companyInfo: JSON.parse(localStorage.getItem('companyInfo')) || {},
        services: JSON.parse(localStorage.getItem('services')) || [],
        seoData: JSON.parse(localStorage.getItem('seoData')) || {},
        contactSettings: JSON.parse(localStorage.getItem('contactSettings')) || {},
        siteSettings: JSON.parse(localStorage.getItem('siteSettings')) || {},
        logoData: JSON.parse(localStorage.getItem('logoData')) || {}
    };
    
    const dataStr = JSON.stringify(allData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'nishibo-website-data.json';
    link.click();
    
    showStatus('export-status', 'データのエクスポートが完了しました。', 'success');
}

function importAllData() {
    const fileInput = document.getElementById('importFile');
    const file = fileInput.files[0];
    
    if (!file) {
        showStatus('import-status', 'ファイルが選択されていません。', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            
            // データを各LocalStorageに保存
            Object.keys(importedData).forEach(key => {
                if (importedData[key]) {
                    localStorage.setItem(key, JSON.stringify(importedData[key]));
                }
            });
            
            showStatus('import-status', 'データのインポートが完了しました。ページを再読み込みしてください。', 'success');
            
            // 3秒後にページをリロード
            setTimeout(() => {
                location.reload();
            }, 3000);
            
        } catch (error) {
            showStatus('import-status', 'データの読み込みに失敗しました。ファイル形式を確認してください。', 'error');
        }
    };
    reader.readAsText(file);
}

function clearAllData() {
    if (confirm('全てのデータを削除します。この操作は元に戻せません。続行しますか？')) {
        if (confirm('本当に全てのデータを削除しますか？')) {
            // 管理データをクリア
            const keysToRemove = ['news', 'works', 'stats', 'companyInfo', 'services', 'seoData', 'contactSettings', 'siteSettings', 'logoData'];
            keysToRemove.forEach(key => localStorage.removeItem(key));
            
            showStatus('clear-status', '全てのデータが削除されました。ページを再読み込みしてください。', 'success');
            
            // 3秒後にページをリロード
            setTimeout(() => {
                location.reload();
            }, 3000);
        }
    }
}

// === 汎用機能 ===
function showStatus(statusId, message, type) {
    const statusElement = document.getElementById(statusId);
    if (statusElement) {
        statusElement.textContent = message;
        statusElement.className = `status ${type}`;
        statusElement.style.display = 'block';
        
        // 3秒後にステータスを非表示
        setTimeout(() => {
            statusElement.style.display = 'none';
        }, 3000);
    }
}

function showSection(sectionId) {
    // 全てのセクションを非表示
    const sections = document.querySelectorAll('.admin-section');
    sections.forEach(section => section.classList.remove('active'));
    
    // 指定されたセクションを表示（-section がついていない場合は追加）
    const targetSectionId = sectionId.includes('-section') ? sectionId : sectionId + '-section';
    const targetSection = document.getElementById(targetSectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        console.log('セクションを表示:', targetSectionId);
    } else {
        console.error('セクションが見つかりません:', targetSectionId);
    }
    
    // 選択状態のボタンを更新
    const buttons = document.querySelectorAll('.admin-nav-btn');
    buttons.forEach(button => button.classList.remove('active'));
    
    const activeButton = document.querySelector(`button[onclick*="${sectionId}"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
    
    // 特定のセクションで初期化処理を実行
    if (sectionId === 'stats') {
        loadStatsForm();
        updateStatsPreview();
    }
}

// === ページ読み込み時の初期設定 ===
document.addEventListener('DOMContentLoaded', function() {
    console.log('管理画面を初期化中...');
    
    // 最初のセクションを表示
    showSection('news');
    
    // データが存在しない場合は初期データを設定
    initializeDefaultData();
    
    // 既存データをフォームに読み込み
    loadExistingData();
    
    // デバッグ情報を表示
    setTimeout(() => {
        refreshDebugInfo();
    }, 100);
    
    console.log('管理画面の初期化完了');
});

function initializeDefaultData() {
    // 各管理機能の初期化は既に各初期化関数で行われているので、
    // ここでは追加の設定があれば記述
    updateDataUsage();
}

function updateDataUsage() {
    try {
        // データ件数を更新
        const news = JSON.parse(localStorage.getItem('news')) || [];
        const works = JSON.parse(localStorage.getItem('works')) || [];
        const services = JSON.parse(localStorage.getItem('services')) || [];
        
        const newsCountElement = document.getElementById('news-count');
        const worksCountElement = document.getElementById('works-count');
        const servicesCountElement = document.getElementById('services-count');
        
        if (newsCountElement) newsCountElement.textContent = `${news.length}件`;
        if (worksCountElement) worksCountElement.textContent = `${works.length}件`;
        if (servicesCountElement) servicesCountElement.textContent = `${services.length}件`;
        
        // LocalStorage使用量を計算
        let totalSize = 0;
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                totalSize += localStorage[key].length + key.length;
            }
        }
        
        const sizeKB = (totalSize / 1024).toFixed(2);
        const storageUsageElement = document.getElementById('storage-usage');
        if (storageUsageElement) {
            storageUsageElement.textContent = `${sizeKB} KB`;
        }
    } catch (error) {
        console.error('データ使用量の更新中にエラーが発生しました:', error);
    }
}

// デバッグ情報の表示
function refreshDebugInfo() {
    const servicesData = localStorage.getItem('services');
    const debugTextarea = document.getElementById('debugServices');
    
    if (debugTextarea) {
        if (servicesData) {
            try {
                const parsed = JSON.parse(servicesData);
                debugTextarea.value = JSON.stringify(parsed, null, 2);
            } catch (e) {
                debugTextarea.value = 'データの解析エラー: ' + e.message + '\n\n生データ:\n' + servicesData;
            }
        } else {
            debugTextarea.value = 'LocalStorageに事業案内データが存在しません';
        }
    }
}

// 既存データをフォームに読み込み
function loadExistingData() {
    console.log('既存データをフォームに読み込み中...');
    
    // 会社基本情報の読み込み
    const companyData = JSON.parse(localStorage.getItem('companyInfo') || '{}');
    if (Object.keys(companyData).length > 0) {
        console.log('会社基本情報を読み込み:', companyData);
        Object.entries(companyData).forEach(([key, value]) => {
            const element = document.getElementById(key);
            if (element) {
                element.value = value;
                console.log(`フォーム項目 ${key} に値を設定:`, value);
            }
        });
    }
    
    // 統計情報の読み込み
    const statsData = JSON.parse(localStorage.getItem('stats') || '{}');
    if (Object.keys(statsData).length > 0) {
        console.log('統計情報を読み込み:', statsData);
        Object.entries(statsData).forEach(([key, value]) => {
            const element = document.getElementById('stat' + key.charAt(0).toUpperCase() + key.slice(1));
            if (element) {
                element.value = value;
                console.log(`統計項目 ${key} に値を設定:`, value);
            }
        });
    }
    
    // サイト設定の読み込み
    const siteSettings = JSON.parse(localStorage.getItem('siteSettings') || '{}');
    if (Object.keys(siteSettings).length > 0) {
        console.log('サイト設定を読み込み:', siteSettings);
        Object.entries(siteSettings).forEach(([key, value]) => {
            const element = document.getElementById(key);
            if (element) {
                element.value = value;
                console.log(`サイト設定 ${key} に値を設定:`, value);
            }
        });
    }
    
    console.log('既存データの読み込み完了');
}

// 事業案内データをクリア
function clearServicesData() {
    if (confirm('事業案内データをすべて削除しますか？')) {
        localStorage.removeItem('services');
        showNotification('事業案内データを削除しました', 'success');
        refreshDebugInfo();
        updateStorageUsage();
    }
}