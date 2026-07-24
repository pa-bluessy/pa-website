import { NextResponse } from "next/server";
import {
  buildDecisionActionsBlock,
  buildDecisionResultBlock,
  buildPendingBlock,
  DECISION_LABEL,
  fetchSlackMessage,
  hasDecisionActions,
  hasDecisionResult,
  openDecisionModal,
  postEphemeral,
  slackInteractionsConfigured,
  stripDecisionUi,
  type SlackBlock,
  type SlackDecision,
  updateSlackMessage,
  verifySlackSignature,
} from "@/lib/slack";

export const runtime = "nodejs";
export const maxDuration = 30;

type BlockActionsPayload = {
  type: "block_actions";
  trigger_id: string;
  user: { id: string };
  channel: { id: string };
  message: {
    ts: string;
    text?: string;
    blocks?: SlackBlock[];
  };
  actions: Array<{ action_id: string; value?: string }>;
};

type ViewSubmissionPayload = {
  type: "view_submission";
  user: { id: string };
  view: {
    callback_id: string;
    private_metadata: string;
    state: {
      values: Record<string, Record<string, { value?: string }>>;
    };
  };
};

type ViewClosedPayload = {
  type: "view_closed";
  user: { id: string };
  view: {
    callback_id: string;
    private_metadata: string;
  };
  is_cleared?: boolean;
};

type SlackPayload = BlockActionsPayload | ViewSubmissionPayload | ViewClosedPayload | { type: string };

function isDecision(v: string): v is SlackDecision {
  return v === "approve" || v === "hold" || v === "reject";
}

async function finalizeDecision(params: {
  channel: string;
  ts: string;
  userId: string;
  decision: SlackDecision;
  reason?: string;
}): Promise<"ok" | "already" | "missing"> {
  const msg = await fetchSlackMessage({ channel: params.channel, ts: params.ts });
  if (!msg) return "missing";
  if (hasDecisionResult(msg.blocks)) return "already";

  const nextBlocks = [
    ...stripDecisionUi(msg.blocks),
    buildDecisionResultBlock({
      decision: params.decision,
      userId: params.userId,
      reason: params.reason,
    }),
  ];

  await updateSlackMessage({
    channel: params.channel,
    ts: params.ts,
    text: `${msg.text ?? "フィードバック提案"}\n判定: ${DECISION_LABEL[params.decision]}`,
    blocks: nextBlocks,
  });
  return "ok";
}

async function markPending(params: {
  channel: string;
  ts: string;
  userId: string;
  decision: "hold" | "reject";
  blocks: SlackBlock[] | undefined;
  fallbackText: string;
}): Promise<"ok" | "already"> {
  if (hasDecisionResult(params.blocks) || !hasDecisionActions(params.blocks)) {
    return "already";
  }
  const nextBlocks = [
    ...stripDecisionUi(params.blocks),
    buildPendingBlock(params.userId, params.decision),
  ];
  await updateSlackMessage({
    channel: params.channel,
    ts: params.ts,
    text: params.fallbackText,
    blocks: nextBlocks,
  });
  return "ok";
}

async function restoreActions(params: { channel: string; ts: string }): Promise<void> {
  const msg = await fetchSlackMessage({ channel: params.channel, ts: params.ts });
  if (!msg || hasDecisionResult(msg.blocks) || hasDecisionActions(msg.blocks)) return;
  const nextBlocks = [...stripDecisionUi(msg.blocks), buildDecisionActionsBlock()];
  await updateSlackMessage({
    channel: params.channel,
    ts: params.ts,
    text: msg.text ?? "フィードバック提案",
    blocks: nextBlocks,
  });
}

export async function POST(req: Request) {
  if (!slackInteractionsConfigured()) {
    return NextResponse.json({ ok: false, error: "slack_bot_not_configured" }, { status: 503 });
  }

  const rawBody = await req.text();
  const signingSecret = process.env.SLACK_SIGNING_SECRET!.trim();
  const valid = verifySlackSignature({
    signingSecret,
    signature: req.headers.get("x-slack-signature"),
    timestamp: req.headers.get("x-slack-request-timestamp"),
    rawBody,
  });
  if (!valid) {
    return NextResponse.json({ ok: false, error: "invalid_signature" }, { status: 401 });
  }

  if (rawBody.trim().startsWith("{")) {
    try {
      const json = JSON.parse(rawBody) as { type?: string; challenge?: string };
      if (json.type === "url_verification" && json.challenge) {
        return new NextResponse(json.challenge, {
          status: 200,
          headers: { "Content-Type": "text/plain" },
        });
      }
    } catch {
      // fall through to form payload
    }
  }

  const params = new URLSearchParams(rawBody);
  const payloadRaw = params.get("payload");
  if (!payloadRaw) {
    return NextResponse.json({ ok: false, error: "missing_payload" }, { status: 400 });
  }

  let payload: SlackPayload;
  try {
    payload = JSON.parse(payloadRaw) as SlackPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }

  try {
    if (payload.type === "block_actions") {
      const body = payload as BlockActionsPayload;
      const actionId = body.actions[0]?.action_id ?? "";
      const channel = body.channel.id;
      const ts = body.message.ts;
      const userId = body.user.id;
      const blocks = body.message.blocks;
      const fallbackText = body.message.text ?? "フィードバック提案";

      if (hasDecisionResult(blocks) || !hasDecisionActions(blocks)) {
        await postEphemeral({
          channel,
          user: userId,
          text: "この提案はすでに回答済みです。",
        });
        return new NextResponse("", { status: 200 });
      }

      if (actionId === "feedback_approve") {
        await finalizeDecision({
          channel,
          ts,
          userId,
          decision: "approve",
        });
        return new NextResponse("", { status: 200 });
      }

      if (actionId === "feedback_hold" || actionId === "feedback_reject") {
        const decision = actionId === "feedback_hold" ? "hold" : "reject";
        const pending = await markPending({
          channel,
          ts,
          userId,
          decision,
          blocks,
          fallbackText,
        });
        if (pending === "already") {
          await postEphemeral({
            channel,
            user: userId,
            text: "この提案はすでに回答済みです。",
          });
          return new NextResponse("", { status: 200 });
        }
        await openDecisionModal({
          triggerId: body.trigger_id,
          decision,
          channel,
          ts,
        });
        return new NextResponse("", { status: 200 });
      }

      return new NextResponse("", { status: 200 });
    }

    if (payload.type === "view_submission") {
      const body = payload as ViewSubmissionPayload;
      if (body.view.callback_id !== "feedback_decision_modal") {
        return new NextResponse("", { status: 200 });
      }

      let meta: { decision?: string; channel?: string; ts?: string };
      try {
        meta = JSON.parse(body.view.private_metadata) as typeof meta;
      } catch {
        return NextResponse.json({
          response_action: "errors",
          errors: { reason: "内部エラーです。もう一度お試しください。" },
        });
      }

      if (!meta.channel || !meta.ts || !meta.decision || !isDecision(meta.decision)) {
        return NextResponse.json({
          response_action: "errors",
          errors: { reason: "内部エラーです。もう一度お試しください。" },
        });
      }

      if (meta.decision === "approve") {
        return new NextResponse("", { status: 200 });
      }

      const reason = body.view.state.values.reason?.reason_text?.value?.trim() ?? "";
      if (!reason) {
        return NextResponse.json({
          response_action: "errors",
          errors: { reason: "理由を入力してください。" },
        });
      }

      const result = await finalizeDecision({
        channel: meta.channel,
        ts: meta.ts,
        userId: body.user.id,
        decision: meta.decision,
        reason,
      });

      if (result === "already") {
        return NextResponse.json({
          response_action: "errors",
          errors: { reason: "この提案はすでに回答済みです。" },
        });
      }
      if (result === "missing") {
        return NextResponse.json({
          response_action: "errors",
          errors: { reason: "メッセージを更新できませんでした。" },
        });
      }

      return new NextResponse("", { status: 200 });
    }

    if (payload.type === "view_closed") {
      const body = payload as ViewClosedPayload;
      if (body.view.callback_id !== "feedback_decision_modal") {
        return new NextResponse("", { status: 200 });
      }
      try {
        const meta = JSON.parse(body.view.private_metadata) as {
          channel?: string;
          ts?: string;
        };
        if (meta.channel && meta.ts) {
          await restoreActions({ channel: meta.channel, ts: meta.ts });
        }
      } catch (err) {
        console.error("restore actions failed", err);
      }
      return new NextResponse("", { status: 200 });
    }
  } catch (err) {
    console.error("slack interaction failed", err);
    return NextResponse.json({ ok: false, error: "interaction_failed" }, { status: 500 });
  }

  return new NextResponse("", { status: 200 });
}
