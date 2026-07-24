import { NextResponse } from "next/server";
import {
  buildSlackFeedbackText,
  postToSlack,
  tidyMessage,
  type FeedbackSource,
} from "@/lib/feedback";

export const runtime = "nodejs";
export const maxDuration = 30;

type Body = {
  source?: string;
  message?: string;
  userId?: string;
  token?: string;
};

function isSource(v: unknown): v is FeedbackSource {
  return v === "mydawn" || v === "pa-website";
}

async function dispatchProposalJob(payload: {
  source: FeedbackSource;
  message: string;
  userId?: string;
}): Promise<boolean> {
  const ghToken = process.env.FEEDBACK_DISPATCH_TOKEN;
  const repo = process.env.FEEDBACK_DISPATCH_REPO ?? "pa-bluessy/pa-website";
  if (!ghToken) return false;

  const res = await fetch(`https://api.github.com/repos/${repo}/dispatches`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${ghToken}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      event_type: "feedback_proposal",
      client_payload: {
        source: payload.source,
        message: payload.message.slice(0, 3000),
        userId: payload.userId ?? "",
      },
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error("dispatch failed", res.status, text);
    return false;
  }
  return true;
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  if (!isSource(body.source)) {
    return NextResponse.json({ ok: false, error: "invalid_source" }, { status: 400 });
  }

  const message = tidyMessage(String(body.message ?? ""));
  if (!message) {
    return NextResponse.json({ ok: false, error: "empty_message" }, { status: 400 });
  }

  if (body.source === "mydawn") {
    const expected = process.env.FEEDBACK_INGEST_TOKEN;
    if (!expected || body.token !== expected) {
      return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
    }
  }

  if (!process.env.SLACK_WEBHOOK_URL) {
    return NextResponse.json({ ok: false, error: "slack_not_configured" }, { status: 503 });
  }

  const userId = body.userId ? String(body.userId).slice(0, 120) : undefined;

  // Phase 1: organized Slack post (no AI wait)
  try {
    const text = buildSlackFeedbackText({
      source: body.source,
      userId,
      message,
    });
    await postToSlack(text);
  } catch (err) {
    console.error("slack post failed", err);
    return NextResponse.json({ ok: false, error: "slack_failed" }, { status: 502 });
  }

  // Phase 2: kick Cursor SDK proposal job (GitHub Actions, long-running)
  let queued = false;
  try {
    queued = await dispatchProposalJob({
      source: body.source,
      message,
      userId,
    });
  } catch (err) {
    console.error("proposal dispatch failed", err);
  }

  return NextResponse.json({
    ok: true,
    proposalQueued: queued,
  });
}
