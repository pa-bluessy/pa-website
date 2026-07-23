# pa. サイト リニューアル — 仕様書 / Cursor Task Pack v1

## 0. この文書について

- 目的: デザインモックアップ（PC版1枚・スマホ版3枚組）をもとに、実装前に「何を作るか」を確定するための設計文書です。
- Claude Codeが作成し、Cursorが実装時にこれを見ながら進めます。
- 今回はコードの実装は行わず、仕様固定のみです。実装開始・公開は次のステップです。

## 1. 前提・参照確認

- 参照した資料: モックアップ画像2枚（PC版1枚、スマホ版3枚組。チャットに添付されたもの）
- 既存サイト／既存リポジトリ: **なし**（今回新規作成。社長に確認済み）
- 参照したWeb版/Native版ファイル: 該当なし（新規プロジェクトのため）

## 2. 技術スタック（提案・仮決め）

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS（ダーク基調・グリッド構成のモックアップと相性が良いため）
- デプロイ想定: Vercel（後日）

このスタックで進める前提にしています。変更したい場合は着手前に教えてください。

## 3. ページ構成・URL設計

| ページ | URL | 内容 |
|---|---|---|
| TOP | `/` | Hero, About抜粋, Products抜粋, Journal抜粋, SNS一覧 |
| Pa.（about） | `/about` | 来歴 / 好きなもの / 影響を受けたもの / 使用機材 |
| Products一覧 | `/products` | プロダクトカード一覧 |
| MyDawn詳細 | `/products/mydawn` | About, Features, Screenshots, Coming Soon, Related Products |
| Journal一覧 | `/journal` | note記事カード一覧（今回は手動データ、自動取得は後続フェーズ） |
| Journal詳細 | `/journal/[slug]` | 個別記事（後続フェーズ。今回はnoteへの外部リンクのみでも可） |
| SNS | `/sns` | X, YouTube, Threads, Contactへのリンク集 |
| Privacy Policy | `/privacy` | フッターリンクのみ。今回は簡易プレースホルダ |

## 4. コンポーネント分割

- `Header` — logo, nav, Contactボタン, ハンバーガーメニュー（モバイル）
- `MobileNavDrawer` — スマホ用ナビ、閉じるボタン、About写真+ボタン、SNSアイコン列
- `Hero` — 背景画像, 見出し「思考を、仕組みに。」, サブテキスト, Scroll indicator
- `AboutSection` — 写真, 見出し, リード文, 4アイコン項目（来歴/好きなもの/影響/機材）, VIEW MOREボタン
- `ProductsSection` — 見出し, リード文, VIEW ALLボタン, `ProductCard`カルーセル
- `ProductCard` — 画像, タイトル, ステータスバッジ（IN PROGRESS等）, 説明, タグ, 矢印リンク
- `JournalSection` — 見出し, リード文, VIEW ALLボタン, `JournalCard`カルーセル/グリッド
- `JournalCard` — プラットフォームラベル「note」, 日付, タイトル, サムネイル画像
- `SnsSection` — 見出し, リード文, VIEW ALLボタン, `SnsCard` x4
- `SnsCard` — アイコン, サービス名, 説明, 矢印
- `Footer` — logo, コピーライト, Privacy Policy, Contactリンク
- `ScrollToTopButton` — モバイルのみ表示
- MyDawn詳細ページ専用: `ProductDetailHeader`, `FeatureListItem`, `ScreenshotCarousel`, `ComingSoonCard`, `RelatedProductCard`

## 5. レスポンシブ仕様

- ブレークポイント: モバイル `< 768px`、デスクトップ `>= 768px`（Tailwind: 無指定=モバイル, `md:`=デスクトップ）
- Header: PC=横並びナビ表示 / モバイル=ハンバーガーメニュー+ドロワー
- Products/Journalカード: PC=横並びカード+カルーセル / モバイル=縦積みカード
- SNSセクション: PC=4カラムグリッド / モバイル=縦積みリスト
- MyDawn詳細ページ: PCレイアウト未確定（モックアップがモバイルのみのため）→ 6章「未確定項目」参照

## 6. 未確定項目 → 社長確認結果（2026-07-23 確定）

1. **MyDawn詳細ページのPCレイアウト** → 他ページ（Products/Journalセクション等）と同じ「左テキスト・右画像」の2カラム構成を踏襲し、Cursorの裁量でPC版を作成する
2. **X/YouTube/Threads/noteの実URL** → 今回はダミーリンク（`#`）。実URLが決まり次第、社長から共有してもらい差し替える
3. **Contact/Feedback送信先** → `mailto:pa.basement.b1@gmail.com`（フォームサービスは使わない）
4. **実素材（人物写真・MyDawnスクショ・Journalサムネ）** →
   - 人物写真: 社長が提供可能。ファイルを共有してもらい次第、`public/images/`に配置して差し替える（現時点は未受領のためプレースホルダ）
   - MyDawnアプリのスクリーンショット: アプリアイコン用に使っている画像がある可能性あり。共有してもらい次第差し替える（現時点は未受領のためプレースホルダ）
   - Journal記事サムネイル: 現状なし。プレースホルダ画像で進行
5. **About Pa.の4項目本文** → 「準備中」のダミーテキストで進行。本文は [docs/content/about.md](content/about.md) 参照
6. **Journal記事の取得方法** → 手動で2〜3件の仮データを配置。データは [docs/content/journal-sample.json](content/journal-sample.json) 参照。note API自動取得は後続フェーズ
7. **Privacy Policyの本文** → 一般的なテンプレート文で仮作成。[docs/content/privacy.md](content/privacy.md) 参照（法的完全性は保証されないため、公開前に社長側で確認・調整推奨）
8. **正式ドメイン** → 未定のまま進行。デプロイは今回のスコープ外

## 7. 今回追加しないもの（スコープ外・明示的に見送り）

- note記事の自動取得・RSS連携
- Voicy連携
- Threads実装（リンクのみ、「予定」表示のまま）
- 実際のフォーム送信機能（Contactはmailtoリンクで暫定対応）
- CMS導入
- 作り込んだアニメーション演出（基本的なホバー/トランジションのみ）

## 8. 完成条件・受入テスト

- [ ] 上記7ページがルーティングされ、404にならない
- [ ] PC(1280px)とモバイル(375px)の両方でモックアップと概ね一致したレイアウトになる
- [ ] ハンバーガーメニューが開閉し、ドロワー内リンクが正しいページに遷移する
- [ ] Products/Journalのカルーセル（またはスクロール）が動作する
- [ ] 画像は仮素材（プレースホルダ）で構わないが、alt属性を設定する
- [ ] Lighthouseアクセシビリティスコア90以上（Codex検証フェーズで確認）
- [ ] ビルドエラー・型エラーなし

## 9. Cursorへの依頼範囲

- 上記コンポーネント・ページのHTML/CSS(Tailwind)/React実装
- レスポンシブ対応
- ハンバーガーメニューの開閉動作
- ホバー/トランジションの基本演出
- 未受領の実素材（人物写真・MyDawnスクショ・Journalサムネ）はプレースホルダ画像で進めてOK（後で差し替え）
- モック画像そのものの完全再現は不要。構成・階層・情報量を揃えれば良い
- テキストコンテンツは [docs/content/](content/) 配下のファイルをそのまま使う
  - About Pa.本文 → `content/about.md`
  - Journal仮データ → `content/journal-sample.json`
  - Privacy Policy本文 → `content/privacy.md`
  - Contactリンク → `mailto:pa.basement.b1@gmail.com`

## 10. 次のアクション

1. 社長が「6. 未確定項目」に回答する、または一旦プレースホルダのまま進めることを承認する
2. このリポジトリをCursorで開いて実装開始
3. 実装後、Codexで検証・修理
