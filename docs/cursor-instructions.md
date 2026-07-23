# Cursorに貼り付ける指示文

このリポジトリ（pa-website）でWebサイトを実装してください。

## 最初に必ず読むファイル
- `docs/task-pack.md` — ページ構成・URL設計・コンポーネント分割・レスポンシブ仕様・完成条件
- `docs/content/about.md` — About Pa.の本文（仮テキスト）
- `docs/content/journal-sample.json` — Journal記事の仮データ
- `docs/content/privacy.md` — Privacy Policyの本文
- `docs/content/assets/` — 実素材（人物写真 `profile.jpeg`、MyDawnスクリーンショット `mydawn-screenshot-1〜3.png`）

## 技術スタック
Next.js 14 (App Router) + TypeScript + Tailwind CSS

## やること
1. `docs/task-pack.md`の「3. ページ構成・URL設計」に従って各ページを実装する
2. 「4. コンポーネント分割」に従ってコンポーネントを分ける
3. 「5. レスポンシブ仕様」に従い、PC(≥768px)とモバイル(<768px)の両方に対応する
4. テキスト・画像は`docs/content/`配下のファイルをそのまま使う（Journalサムネイルのみ実素材がないためプレースホルダ画像でOK）
5. Contactリンクは `mailto:pa.basement.b1@gmail.com`
6. SNSリンク（X/YouTube/Threads/note）は今回すべてダミーリンク（`#`）でOK

## やらないこと（スコープ外）
- note記事の自動取得・RSS連携
- Voicy連携の実装（リンクのみ「予定」表示）
- 実際のフォーム送信機能（mailtoで代替）
- CMS導入
- 作り込んだアニメーション（基本的なホバー/トランジションのみ）
- デプロイ・ドメイン設定

## 完成条件
`docs/task-pack.md`の「8. 完成条件・受入テスト」のチェックリストを満たすこと

## 注意
- モック画像の完全再現は不要。構成・階層・情報量を揃えれば良い
- 実装中に仕様書と矛盾する判断が必要になったら、まず`docs/task-pack.md`に追記してから進める
- 指示されていない機能・UIを勝手に追加しない
