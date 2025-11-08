// Netlify CMS用のMarkdownファイル読み込みヘルパー関数

/**
 * Markdownファイルのfront-matterとbodyをパース
 */
function parseMarkdown(text) {
    const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
    const match = text.match(frontMatterRegex);
    
    if (!match) {
        return { frontMatter: {}, body: text };
    }
    
    const frontMatterText = match[1];
    const body = match[2];
    
    // front-matterをオブジェクトに変換
    const frontMatter = {};
    frontMatterText.split('\n').forEach(line => {
        const colonIndex = line.indexOf(':');
        if (colonIndex > 0) {
            const key = line.substring(0, colonIndex).trim();
            let value = line.substring(colonIndex + 1).trim();
            
            // クオートを削除
            value = value.replace(/^["']|["']$/g, '');
            
            frontMatter[key] = value;
        }
    });
    
    return { frontMatter, body };
}

/**
 * お知らせデータをMarkdownファイルから読み込む
 */
async function loadNewsFromMarkdown() {
    try {
        // GitHub Pages上のcontent/newsフォルダからファイルリストを取得
        const response = await fetch('/content/news/');
        const text = await response.text();
        
        // HTMLから.mdファイルのリンクを抽出
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        const links = Array.from(doc.querySelectorAll('a[href$=".md"]'));
        const fileNames = links.map(link => link.getAttribute('href'));
        
        if (fileNames.length === 0) {
            console.log('Markdownファイルが見つかりません。手動リストを使用します。');
            // フォールバック: 既知のファイル名を使用
            const knownFiles = [
                '2025-11-07-homepage-renewal.md',
                '2025-11-01-fukuoka-project-completed.md'
            ];
            return await loadNewsFiles(knownFiles);
        }
        
        return await loadNewsFiles(fileNames);
    } catch (error) {
        console.error('お知らせの読み込みエラー:', error);
        // エラー時はLocalStorageにフォールバック
        return JSON.parse(localStorage.getItem('newsData') || '[]');
    }
}

/**
 * 指定されたファイル名からお知らせを読み込む
 */
async function loadNewsFiles(fileNames) {
    const newsItems = [];
    
    for (const fileName of fileNames) {
        try {
            const response = await fetch(`/content/news/${fileName}`);
            const text = await response.text();
            const { frontMatter, body } = parseMarkdown(text);
            
            // published=trueのものだけを含める
            if (frontMatter.published === 'true' || frontMatter.published === true) {
                newsItems.push({
                    id: fileName,
                    title: frontMatter.title,
                    date: frontMatter.date,
                    category: frontMatter.category,
                    content: body,
                    body: body
                });
            }
        } catch (error) {
            console.error(`ファイル ${fileName} の読み込みエラー:`, error);
        }
    }
    
    // 日付でソート（新しい順）
    return newsItems.sort((a, b) => new Date(b.date) - new Date(a.date));
}

/**
 * 工事実績データをMarkdownファイルから読み込む
 */
async function loadWorksFromMarkdown() {
    try {
        // 既知のファイル名リスト（実際の運用ではディレクトリ一覧APIを使用）
        const knownFiles = [
            '2024-01-20-commercial-building.md'
        ];
        
        const worksItems = [];
        
        for (const fileName of knownFiles) {
            try {
                const response = await fetch(`/content/works/${fileName}`);
                const text = await response.text();
                const { frontMatter, body } = parseMarkdown(text);
                
                if (frontMatter.published === 'true' || frontMatter.published === true) {
                    worksItems.push({
                        id: fileName,
                        title: frontMatter.title,
                        date: frontMatter.date,
                        category: frontMatter.category,
                        location: frontMatter.location,
                        description: frontMatter.description,
                        image: frontMatter.image,
                        body: body
                    });
                }
            } catch (error) {
                console.error(`ファイル ${fileName} の読み込みエラー:`, error);
            }
        }
        
        return worksItems.sort((a, b) => new Date(b.date) - new Date(a.date));
    } catch (error) {
        console.error('工事実績の読み込みエラー:', error);
        return JSON.parse(localStorage.getItem('works') || '[]');
    }
}
