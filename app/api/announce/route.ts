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

async function postToReddit(
  title: string,
  message: string,
  subreddit: string,
  url: string
) {
  const clientId = process.env.REDDIT_CLIENT_ID;
  const clientSecret = process.env.REDDIT_CLIENT_SECRET;
  const username = process.env.REDDIT_USERNAME;
  const password = process.env.REDDIT_PASSWORD;
  const userAgent = process.env.REDDIT_USER_AGENT ?? "brickwise/1.0";

  if (!clientId || !clientSecret || !username || !password) {
    throw new Error("Reddit credentials not fully configured");
  }

  // Get access token
  const tokenRes = await fetch("https://www.reddit.com/api/v1/access_token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": userAgent,
    },
    body: new URLSearchParams({
      grant_type: "password",
      username,
      password,
    }),
  });

  if (!tokenRes.ok) {
    const text = await tokenRes.text();
    throw new Error(`Reddit auth error ${tokenRes.status}: ${text}`);
  }

  const { access_token } = await tokenRes.json();

  // Determine post kind: link if URL provided, self otherwise
  const kind = url ? "link" : "self";

  const submitRes = await fetch("https://oauth.reddit.com/api/submit", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": userAgent,
    },
    body: new URLSearchParams({
      sr: subreddit,
      kind,
      title,
      ...(kind === "link" ? { url } : { text: message }),
      resubmit: "true",
    }),
  });

  if (!submitRes.ok) {
    const text = await submitRes.text();
    throw new Error(`Reddit submit error ${submitRes.status}: ${text}`);
  }

  const data = await submitRes.json();
  if (data?.json?.errors?.length) {
    throw new Error(`Reddit: ${data.json.errors[0][1]}`);
  }
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, message, url, platforms, subreddit } = await req.json();

  if (!title?.trim() || !message?.trim()) {
    return NextResponse.json({ error: "Title and message are required" }, { status: 400 });
  }

  const results: Record<string, string> = {};
  const errors: Record<string, string> = {};

  await Promise.allSettled([
    platforms.includes("discord")
      ? postToDiscord(message, title, url).then(() => { results.discord = "sent"; }).catch((e: Error) => { errors.discord = e.message; })
      : Promise.resolve(),

    platforms.includes("reddit") && subreddit
      ? postToReddit(title, message, subreddit, url).then(() => { results.reddit = "sent"; }).catch((e: Error) => { errors.reddit = e.message; })
      : Promise.resolve(),
  ]);

  const hasErrors = Object.keys(errors).length > 0;
  const hasSent = Object.keys(results).length > 0;

  return NextResponse.json(
    { results, errors },
    { status: hasErrors && !hasSent ? 500 : 200 }
  );
}
