# pa. Website

個人ブランドサイト「pa. — A Letter at Midnight.」です。手紙をテーマにした演出のサイトで、MyDawn などからのフィードバックを Slack へ中継する API も持ちます。

> **最初に読むこと（AI・人間共通）**
> - 本番URL **https://pa-website-indol.vercel.app** は**変えないでください**。MyDawn のフィードバック中継がこのURLに依存しています。
> - 秘密値（Slackトークン、署名シークレット、APIキー）はリポジトリに入れず、Vercel の環境変数と GitHub Secrets に置きます。

## 概要

- 状態: **実装済み・公開中**（旧READMEの「仕様固定フェーズ（実装はまだ開始していません）」は古い記述です。2026-07-23 に実装・公開、最終コミットは 2026-07-24）
- ページ: `/`（TOP）、`/about`、`/products`、`/products/mydawn`、`/journal`、`/journal/[slug]`、`/sns`、`/privacy`。返信（Reply）はフィードバック用の手紙UI
- フィードバック: `POST /api/feedback` が受け取り、Slack へ投稿。Slack のボタンで判断できます（`/api/slack/interactions`）
- 改善案の自動作成: フィードバックを `repository_dispatch` で GitHub Actions（`feedback-proposal.yml`）へ送り、Cursor SDK で改善案を作って Slack へ投稿します（任意。トークン未設定なら動きません）

## 本番・URL

| 項目 | 値 |
|---|---|
| 本番URL | https://pa-website-indol.vercel.app（GitHub の homepage 欄） |
| ホスティング | Vercel |
| フィードバック中継 | `https://pa-website-indol.vercel.app/api/feedback`（`source` は `mydawn` または `pa-website`） |
| Slack Interactivity | `https://pa-website-indol.vercel.app/api/slack/interactions`（GETはヘルスチェック用） |
| 独自ドメイン | **未確認**（`vercel.json` はなく、リポジトリ内に独自ドメインの設定は見当たりません） |

## 技術構成

- Next.js 14（App Router）+ React 18 + TypeScript + Tailwind CSS 3
- `@cursor/sdk`（改善案作成スクリプト `scripts/feedback-proposal.mts` で使用）
- 主なフォルダ: `app/`（ページとAPI）、`components/`、`lib/`（`feedback.ts`、`slack.ts`、`journal.ts`、`data.ts`）、`docs/`（仕様と原稿）、`scripts/`

コマンド:

```bash
npm install
npm run dev
npm run build
npm run lint
```

環境変数（名前のみ。値は書かない）:

- Vercel: `SLACK_WEBHOOK_URL`、`SLACK_BOT_TOKEN`、`SLACK_CHANNEL_ID`、`SLACK_SIGNING_SECRET`、`FEEDBACK_INGEST_TOKEN`、`FEEDBACK_DISPATCH_TOKEN`、`FEEDBACK_DISPATCH_REPO`
- GitHub Secrets（`feedback-proposal.yml`）: `CURSOR_API_KEY`、`SLACK_WEBHOOK_URL`、`SLACK_BOT_TOKEN`、`SLACK_CHANNEL_ID`

設計文書（実装前の仕様。歴史的資料）:

- 仕様書 / Task Pack: `docs/task-pack.md`
- Cursor向け指示文: `docs/cursor-instructions.md`
- 原稿・素材: `docs/content/`

当初の進め方: Claude Code（調査・仕様固定）→ 社長（仕様確認）→ Cursor（UI実装）→ Codex（検証・修理・完成判定）。

## ブランチとデプロイ

- 既定ブランチ: `master`（他のブランチはありません）
- デプロイ: Vercel（GitHub連携と推定。リポジトリに Vercel の設定ファイルはありません）
- GitHub Actions: `feedback-proposal.yml`（`repository_dispatch` の `feedback_proposal` でのみ起動。デプロイはしません）

## 関連リポジトリ

- `pa-bluessy/mydawn`: フィードバックの送り元。MyDawn の GAS（`FEEDBACK_API_URL`）からこのサイトの中継へ送る設計です。**このサイトのURLを変えると中継が壊れます**
- `pa-bluessy/pa-on-the-gravity`: 同じオーナーのアーティスト重力ランキング（直接の依存はありません）
- `pa-bluessy/pa-decision-log`: 意思決定ログ（非公開）

## 注意点

- **URLを変えない。** MyDawn の中継先と Slack Interactivity の送り先が壊れます
- **秘密値をリポジトリに入れない。** すべて環境変数・GitHub Secrets で渡します（直書きはありません）
- `feedback-proposal.yml` は MyDawn の参照ブランチとして `existing-log-split-gps` を指定しています。MyDawn の本番ソースは `local-production-2026-10-10` なので、改善案は旧系譜のコードを元に作られます
- このリポジトリは**公開**です。個人情報や秘密値を書かないでください
- 削除はしません（アーカイブのみ）

## 未確認事項

- **独自ドメインの有無: 未確認**（リポジトリ設定からは判断できません）
- Vercel のプロジェクトとGitHubの連携方法（自動デプロイか）: 未確認
- MyDawn 現行本番（GAS無効）から、この中継へ実際にフィードバックが届いているか: 未確認
- `feedback-proposal.yml` の MyDawn 参照ブランチを本番ソースへ変えるか: 未決定
