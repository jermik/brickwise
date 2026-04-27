import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

async function postToDiscord(message: string, title: string, url: string) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) throw new Error("DISCORD_WEBHOOK_URL not set");

  const body: Record<string, unknown> = {
    embeds: [
      {
        title,
        description: message,
        color: 0x16a34a,
        ...(url ? { url } : {}),
        footer: { text: "brickwise.pro" },
        timestamp: new Date().toISOString(),
      },
    ],
  };

  const res = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Discord error ${res.status}: ${text}`);
  }
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, message, url, platforms } = await req.json();

  if (!title?.trim() || !message?.trim()) {
    return NextResponse.json({ error: "Title and message are required" }, { status: 400 });
  }

  const results: Record<string, string> = {};
  const errors: Record<string, string> = {};

  if (platforms.includes("discord")) {
    await postToDiscord(message, title, url)
      .then(() => { results.discord = "sent"; })
      .catch((e: Error) => { errors.discord = e.message; });
  }

  const hasErrors = Object.keys(errors).length > 0;
  const hasSent = Object.keys(results).length > 0;

  return NextResponse.json(
    { results, errors },
    { status: hasErrors && !hasSent ? 500 : 200 }
  );
}
