export type FeedbackSource = "mydawn" | "pa-website";

export type FeedbackCategory = "bug" | "ui" | "request" | "other";

export type FeedbackPayload = {
  source: FeedbackSource;
  message: string;
  userId?: string;
};

export function categorizeFeedback(message: string): FeedbackCategory {
  const t = message.toLowerCase();
  if (/(バグ|不具合|壊|エラー|crash|bug|fail|動かない|消え)/i.test(t)) return "bug";
  if (/(ui|見た目|色|テーマ|レイアウト|デザイン|画面|ボタン)/i.test(t)) return "ui";
  if (/(してほしい|欲しい|追加|要望|改善|ほしい|feature|お願い)/i.test(t)) return "request";
  return "other";
}

const CATEGORY_LABEL: Record<FeedbackCategory, string> = {
  bug: "バグ",
  ui: "UI",
  request: "要望",
  other: "その他",
};

const SOURCE_LABEL: Record<FeedbackSource, string> = {
  mydawn: "MyDawn",
  "pa-website": "pa. website",
};

/** Normalize messy user text for Slack readability */
export function tidyMessage(message: string): string {
  return message
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, 3500);
}

export function summarizeOneLine(message: string): string {
  const compact = message.replace(/\s+/g, " ").trim();
  if (compact.length <= 80) return compact;
  return `${compact.slice(0, 77)}...`;
}

export function buildSlackFeedbackText(input: {
  source: FeedbackSource;
  userId?: string;
  message: string;
  proposal?: string;
}): string {
  const category = categorizeFeedback(input.message);
  const tidy = tidyMessage(input.message);
  const summary = summarizeOneLine(tidy);
  const when = new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" });

  const lines = [
    `*フィードバック受信* · ${SOURCE_LABEL[input.source]}`,
    "",
    `*要約:* ${summary}`,
    `*カテゴリ:* ${CATEGORY_LABEL[category]}`,
    `*受信:* ${when}`,
  ];

  if (input.userId) {
    lines.push(`*送信者ID:* \`${input.userId}\``);
  }

  lines.push("", "*原文（整形）*", "```", tidy, "```");

  if (input.proposal?.trim()) {
    lines.push("", "*AI更新提案（Cursor SDK）*", input.proposal.trim());
  } else {
    lines.push("", "_AI更新提案: 生成中（完了後に別投稿）_");
  }

  return lines.join("\n");
}

export async function postToSlack(text: string): Promise<void> {
  const webhook = process.env.SLACK_WEBHOOK_URL?.trim();
  if (!webhook) {
    throw new Error("SLACK_WEBHOOK_URL is not set");
  }

  const res = await fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Slack webhook failed: ${res.status} ${body}`);
  }
}
