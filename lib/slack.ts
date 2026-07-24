import { createHmac, timingSafeEqual } from "crypto";

export type SlackDecision = "approve" | "hold" | "reject";

export const DECISION_LABEL: Record<SlackDecision, string> = {
  approve: "採用・承認",
  hold: "保留",
  reject: "却下",
};

export type SlackBlock = Record<string, unknown>;

function botToken(): string {
  const t = process.env.SLACK_BOT_TOKEN?.trim();
  if (!t) throw new Error("SLACK_BOT_TOKEN is not set");
  return t;
}

function channelId(): string {
  const c = process.env.SLACK_CHANNEL_ID?.trim();
  if (!c) throw new Error("SLACK_CHANNEL_ID is not set");
  return c;
}

export function slackBotConfigured(): boolean {
  return Boolean(process.env.SLACK_BOT_TOKEN?.trim() && process.env.SLACK_CHANNEL_ID?.trim());
}

export function slackInteractionsConfigured(): boolean {
  return Boolean(slackBotConfigured() && process.env.SLACK_SIGNING_SECRET?.trim());
}

export function verifySlackSignature(params: {
  signingSecret: string;
  signature: string | null;
  timestamp: string | null;
  rawBody: string;
}): boolean {
  const { signingSecret, signature, timestamp, rawBody } = params;
  if (!signature || !timestamp) return false;
  const ts = Number(timestamp);
  if (!Number.isFinite(ts)) return false;
  if (Math.abs(Date.now() / 1000 - ts) > 60 * 5) return false;

  const base = `v0:${timestamp}:${rawBody}`;
  const digest = createHmac("sha256", signingSecret).update(base).digest("hex");
  const expected = `v0=${digest}`;
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

async function slackApi<T>(
  method: string,
  body: Record<string, unknown>
): Promise<T & { ok: boolean; error?: string }> {
  const res = await fetch(`https://slack.com/api/${method}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${botToken()}`,
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(body),
  });
  const data = (await res.json()) as T & { ok: boolean; error?: string };
  if (!data.ok) {
    throw new Error(`Slack ${method} failed: ${data.error ?? res.status}`);
  }
  return data;
}

export function buildDecisionActionsBlock(): SlackBlock {
  return {
    type: "actions",
    block_id: "feedback_decision",
    elements: [
      {
        type: "button",
        action_id: "feedback_approve",
        style: "primary",
        text: { type: "plain_text", text: "採用・承認", emoji: true },
        value: "approve",
      },
      {
        type: "button",
        action_id: "feedback_hold",
        text: { type: "plain_text", text: "保留", emoji: true },
        value: "hold",
      },
      {
        type: "button",
        action_id: "feedback_reject",
        style: "danger",
        text: { type: "plain_text", text: "却下", emoji: true },
        value: "reject",
      },
    ],
  };
}

export function buildPendingBlock(userId: string, decision: "hold" | "reject"): SlackBlock {
  return {
    type: "context",
    block_id: "feedback_decision_pending",
    elements: [
      {
        type: "mrkdwn",
        text: `_${DECISION_LABEL[decision]}の理由を入力中…_ <@${userId}>`,
      },
    ],
  };
}

export function hasDecisionActions(blocks: SlackBlock[] | undefined): boolean {
  return Boolean(blocks?.some((b) => b.block_id === "feedback_decision"));
}

export function hasDecisionResult(blocks: SlackBlock[] | undefined): boolean {
  return Boolean(blocks?.some((b) => b.block_id === "feedback_decision_result"));
}

export function stripDecisionUi(blocks: SlackBlock[] | undefined): SlackBlock[] {
  return (blocks ?? []).filter(
    (b) =>
      b.block_id !== "feedback_decision" &&
      b.block_id !== "feedback_decision_pending" &&
      b.block_id !== "feedback_decision_result"
  );
}

export function buildDecisionResultBlock(input: {
  decision: SlackDecision;
  userId: string;
  reason?: string;
}): SlackBlock {
  const when = new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" });
  const lines = [
    `*判定:* ${DECISION_LABEL[input.decision]}`,
    `*回答者:* <@${input.userId}>`,
    `*日時:* ${when}`,
  ];
  if (input.reason?.trim()) {
    lines.push(`*理由・条件:*\n${input.reason.trim()}`);
  }
  return {
    type: "section",
    block_id: "feedback_decision_result",
    text: { type: "mrkdwn", text: lines.join("\n") },
  };
}

export function textToBlocks(text: string): SlackBlock[] {
  const chunks: string[] = [];
  let rest = text;
  while (rest.length > 0) {
    chunks.push(rest.slice(0, 2900));
    rest = rest.slice(2900);
  }
  if (chunks.length === 0) chunks.push(" ");
  return chunks.map((chunk, i) => ({
    type: "section",
    block_id: `feedback_body_${i}`,
    text: { type: "mrkdwn", text: chunk },
  }));
}

export async function postSlackMessage(params: {
  text: string;
  blocks?: SlackBlock[];
  channel?: string;
}): Promise<{ channel: string; ts: string }> {
  const data = await slackApi<{ channel: string; ts: string }>("chat.postMessage", {
    channel: params.channel ?? channelId(),
    text: params.text,
    blocks: params.blocks,
    unfurl_links: false,
    unfurl_media: false,
  });
  return { channel: data.channel, ts: data.ts };
}

export async function updateSlackMessage(params: {
  channel: string;
  ts: string;
  text: string;
  blocks: SlackBlock[];
}): Promise<void> {
  await slackApi("chat.update", {
    channel: params.channel,
    ts: params.ts,
    text: params.text,
    blocks: params.blocks,
  });
}

export async function fetchSlackMessage(params: {
  channel: string;
  ts: string;
}): Promise<{ text?: string; blocks?: SlackBlock[] } | null> {
  const data = await slackApi<{
    messages?: Array<{ text?: string; blocks?: SlackBlock[] }>;
  }>("conversations.history", {
    channel: params.channel,
    latest: params.ts,
    inclusive: true,
    limit: 1,
  });
  return data.messages?.[0] ?? null;
}

export async function openDecisionModal(params: {
  triggerId: string;
  decision: "hold" | "reject";
  channel: string;
  ts: string;
}): Promise<void> {
  const title = params.decision === "hold" ? "保留" : "却下";
  await slackApi("views.open", {
    trigger_id: params.triggerId,
    view: {
      type: "modal",
      callback_id: "feedback_decision_modal",
      notify_on_close: true,
      private_metadata: JSON.stringify({
        decision: params.decision,
        channel: params.channel,
        ts: params.ts,
      }),
      title: { type: "plain_text", text: title, emoji: true },
      submit: { type: "plain_text", text: "送信", emoji: true },
      close: { type: "plain_text", text: "キャンセル", emoji: true },
      blocks: [
        {
          type: "input",
          block_id: "reason",
          label: {
            type: "plain_text",
            text: params.decision === "hold" ? "条件・理由" : "却下理由",
            emoji: true,
          },
          element: {
            type: "plain_text_input",
            action_id: "reason_text",
            multiline: true,
            placeholder: {
              type: "plain_text",
              text:
                params.decision === "hold"
                  ? "保留する条件や理由を書いてください"
                  : "却下する理由を書いてください",
            },
          },
        },
      ],
    },
  });
}

export async function postEphemeral(params: {
  channel: string;
  user: string;
  text: string;
}): Promise<void> {
  await slackApi("chat.postEphemeral", {
    channel: params.channel,
    user: params.user,
    text: params.text,
  });
}
