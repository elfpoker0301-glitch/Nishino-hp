# Google Search Console用設定ファイル

## 1. HTML確認ファイル作成手順

Google Search Consoleでドメイン確認を行う際、以下のようなHTMLファイルが必要になる場合があります：

```html
google[確認コード].html
```

このファイルは以下の内容にしてください：

```
google-site-verification: google[確認コード].html
```

## 2. メタタグ確認方法

HTMLのheadセクションに以下のようなタグを追加する方法もあります（すでにindex.htmlに実装済み）：

```html
<meta name="google-site-verification" content="確認コード" />
```

## 3. サーチコンソール設定手順

1. https://search.google.com/search-console/ にアクセス
2. 「プロパティを追加」をクリック
3. 「ドメイン」を選択し、新しいドメインを入力
4. 所有権確認方法を選択
5. 確認完了後、サイトマップを送信

## 4. 推奨設定

### サイトマップ送信
URL: https://[your-domain]/sitemap.xml

### インデックス登録要求
各ページについて手動でインデックス登録を要求することを推奨

### 重要ページの優先順位
1. index.html（ホームページ）
2. about.html（会社概要）  
3. works.html（施工実績）
4. news.html（お知らせ）

## 5. Google My Business 設定情報

### 基本情報
- 業種カテゴリ: 建設会社 / 総合建設業
- 地域: 福岡市南区
- サービスエリア: 福岡市・近郊エリア

### 追加推奨設定
- 営業時間の設定
- 休業日の設定
- 写真の追加（事務所外観、施工事例など）
- サービス内容の詳細記載