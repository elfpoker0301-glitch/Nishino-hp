# Netlify CMS セットアップガイド

株式会社ニシボのウェブサイトはNetlify CMSで管理されています。

## 管理画面へのアクセス

### ローカル開発環境
```
http://localhost:8080/admin/
```

### 本番環境
```
https://あなたのサイト.netlify.app/admin/
```

## Netlifyでの初期設定

### 1. Netlifyにデプロイ

1. [Netlify](https://www.netlify.com/)にログイン
2. 「New site from Git」をクリック
3. GitHub リポジトリ「Nishino-hp」を選択
4. ビルド設定:
   - Build command: (空欄)
   - Publish directory: `/`
5. 「Deploy site」をクリック

### 2. Netlify Identity の有効化

1. Netlify ダッシュボードで「Identity」タブを開く
2. 「Enable Identity」をクリック
3. 「Settings and usage」→「Registration preferences」
   - 「Invite only」を選択（セキュリティのため）
4. 「Services」→「Git Gateway」を有効化

### 3. 管理者ユーザーの作成

1. 「Identity」タブで「Invite users」をクリック
2. 管理者のメールアドレスを入力
3. 招待メールが届くので、リンクをクリックしてパスワードを設定

### 4. ログイン

1. `https://あなたのサイト.netlify.app/admin/` にアクセス
2. 設定したメールアドレスとパスワードでログイン

## Netlify CMS の使い方

### お知らせの追加

1. 管理画面にログイン
2. 左メニューから「お知らせ」をクリック
3. 「新しいお知らせ記事」をクリック
4. 以下を入力:
   - タイトル
   - 公開日
   - カテゴリ（お知らせ / 施工情報 / 重要）
   - 本文（Markdownで記述可能）
   - 公開ステータス
5. 「Publish」をクリック → 自動的にGitHubにコミット＆プッシュ
6. Netlifyが自動的にビルド＆デプロイ（1〜2分）

### 工事実績の追加

1. 左メニューから「工事実績」をクリック
2. 「新しい工事実績」をクリック
3. 以下を入力:
   - タイトル
   - 施工日
   - カテゴリ
   - 場所
   - 説明
   - 画像（アップロード可能）
   - 詳細（オプション）
5. 「Publish」をクリック

### 下書きとして保存

- 「Save」をクリックすると下書きとして保存
- 「Publish」で公開

### 既存記事の編集

1. 一覧から編集したい記事をクリック
2. 内容を修正
3. 「Publish」で更新を反映

### 記事の削除

1. 編集画面で「Delete entry」をクリック
2. 確認ダイアログで「Yes」

## データの保存場所

- お知らせ: `/content/news/*.md`
- 工事実績: `/content/works/*.md`
- 事業案内: `/content/services/*.md`
- 画像: `/images/uploads/`

すべてMarkdown形式でGitHub上で管理されています。

## トラブルシューティング

### ログインできない
- Netlify Identityが有効になっているか確認
- ユーザー招待が完了しているか確認

### 記事が表示されない
- `published: true` になっているか確認
- Netlifyのビルドが完了しているか確認（Deploy log参照）

### 画像がアップロードできない
- 画像サイズを確認（推奨: 2MB以下）
- ファイル形式を確認（JPG, PNG, GIF）

## ローカル開発

Netlify CMSをローカルで動かす場合:

```bash
npx netlify-cms-proxy-server
```

別のターミナルで:

```bash
python3 -m http.server 8080
```

ブラウザで `http://localhost:8080/admin/` にアクセス

## サポート

問題が発生した場合は、以下を確認してください:
- [Netlify CMS ドキュメント](https://decapcms.org/)
- [Netlify Identity ドキュメント](https://docs.netlify.com/visitor-access/identity/)
