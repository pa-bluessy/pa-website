/**
 * GitHub Action entry: generate Cursor SDK update proposal and post to Slack.
 * Triggered by repository_dispatch type=feedback_proposal.
 */
import { Agent, CursorAgentError } from "@cursor/sdk";
import {
  buildSlackFeedbackText,
  postToSlack,
  type FeedbackSource,
} from "../lib/feedback";

function isSource(v: string): v is FeedbackSource {
  return v === "mydawn" || v === "pa-website";
}

function repoForSource(source: FeedbackSource): { url: string; startingRef: string } {
  if (source === "mydawn") {
    return {
      url: process.env.FEEDBACK_MYDAWN_REPO_URL ?? "https://github.com/pa-bluessy/mydawn",
      startingRef: process.env.FEEDBACK_MYDAWN_REF ?? "existing-log-split-gps",
    };
  }
  return {
    url: process.env.FEEDBACK_WEBSITE_REPO_URL ?? "https://github.com/pa-bluessy/pa-website",
    startingRef: process.env.FEEDBACK_WEBSITE_REF ?? "master",
  };
}

async function main() {
  const sourceRaw = process.env.FEEDBACK_SOURCE ?? "";
  const message = (process.env.FEEDBACK_MESSAGE ?? "").trim();
  const userId = (process.env.FEEDBACK_USER_ID ?? "").trim() || undefined;

  if (!isSource(sourceRaw) || !message) {
    throw new Error("FEEDBACK_SOURCE / FEEDBACK_MESSAGE required");
  }
  if (!process.env.SLACK_WEBHOOK_URL) {
    throw new Error("SLACK_WEBHOOK_URL required");
  }
  if (!process.env.CURSOR_API_KEY) {
    throw new Error("CURSOR_API_KEY required");
  }

  const repo = repoForSource(sourceRaw);
  const prompt = [
    "You are reviewing product feedback for a production app.",
    "Separate facts, interpretation, and proposals clearly.",
    "Do NOT change code, open PRs, or deploy anything.",
    "Do NOT suggest deleting user data or breaking Preview/Production isolation.",
    "Respond in Japanese, concise, Slack-ready (no wrapping code fence around the whole answer).",
    "",
    "Required sections:",
    "1. 要約（1-2文）",
    "2. 要望の解釈（事実のみ）",
    "3. 更新提案（何をどう変えるか）",
    "4. 影響範囲（画面 / データ / GAS など）",
    "5. リスク",
    "6. テスト案",
    "7. 優先度（High / Mid / Low）",
    "",
    `Source: ${sourceRaw}`,
    userId ? `User ID: ${userId}` : "",
    "Feedback:",
    message,
  ]
    .filter(Boolean)
    .join("\n");

  let proposal: string;
  try {
    const result = await Agent.prompt(prompt, {
      apiKey: process.env.CURSOR_API_KEY,
      model: { id: process.env.FEEDBACK_CURSOR_MODEL ?? "composer-2.5" },
      cloud: { repos: [repo] },
    });
    if (result.status === "error" || !result.result?.trim()) {
      throw new Error(result.error?.message ?? "empty_proposal");
    }
    proposal = result.result.trim().slice(0, 5500);
  } catch (err) {
    if (err instanceof CursorAgentError) {
      throw new Error(`Cursor SDK startup failed: ${err.message}`);
    }
    throw err;
  }

  const text = [
    `*AI更新提案（Cursor SDK）* · 続き`,
    "",
    buildSlackFeedbackText({
      source: sourceRaw,
      userId,
      message,
      proposal,
    }),
  ].join("\n");

  await postToSlack(text);
  console.log("proposal posted to Slack");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
