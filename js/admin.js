// 管理画面のJavaScript

// パスワード設定（本番環境では環境変数を使用）
const ADMIN_PASSWORD = 'nishibo2024';

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
}

// ログアウト
function logout() {
    sessionStorage.removeItem('admin_authenticated');
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('admin-content').style.display = 'none';
    document.getElementById('password').value = '';
}

// セクション切り替え
function showSection(section) {
    // すべてのセクションを非表示
    document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.admin-nav-btn').forEach(btn => btn.classList.remove('active'));
    
    // 選択されたセクションを表示
    document.getElementById(section + '-section').classList.add('active');
    event.target.classList.add('active');
}

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
    const workItem = {
        id: Date.now(),
        title: formData.get('title'),
        category: formData.get('category'),
        location: formData.get('location'),
        description: formData.get('description'),
        image: formData.get('image') || 'images/sample/work1.jpg',
        date: new Date().toISOString().split('T')[0]
    };
    
    // LocalStorageに保存
    let works = JSON.parse(localStorage.getItem('works') || '[]');
    works.unshift(workItem); // 新しいものを先頭に
    localStorage.setItem('works', JSON.stringify(works));
    
    // フォームクリア
    e.target.reset();
    
    // 成功メッセージ表示
    showStatusMessage('works-status', '施工実績を追加しました', 'success');
    
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