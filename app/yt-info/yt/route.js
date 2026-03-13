import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const channel = searchParams.get("channel");

  if (!channel) return NextResponse.json({ error: "channel parameter required" }, { status: 400 });

  const handle = channel.replace("@", "");
  const API_KEY = process.env.YT_API_KEY;

  if (!API_KEY) return NextResponse.json({ error: "YT_API_KEY not set" }, { status: 500 });

  try {
    // Search channel
    const searchRes = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent(handle)}&key=${API_KEY}`
    );
    const searchJson = await searchRes.json();

    if (!searchJson.items || searchJson.items.length === 0)
      return NextResponse.json({ error: "Channel not found" }, { status: 404 });

    const channelId = searchJson.items[0].snippet.channelId;

    // Get channel details
    const detailRes = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${API_KEY}`
    );
    const detailJson = await detailRes.json();

    if (!detailJson.items || !detailJson.items[0])
      return NextResponse.json({ error: "Channel details not found" }, { status: 404 });

    const ch = detailJson.items[0];

    const formatNumber = (num) => {
      if (!num) return "0";
      const n = parseInt(num, 10);
      if (n >= 1e9) return (n / 1e9).toFixed(1) + "B";
      if (n >= 1e6) return (n / 1e6).toFixed(1) + "M";
      if (n >= 1e3) return (n / 1e3).toFixed(1) + "K";
      return n.toString();
    };

    const result = {
      channel_title: ch.snippet.title,
      channel_id: ch.id,
      handle: "@" + handle,
      subscribers: formatNumber(ch.statistics.subscriberCount),
      views: formatNumber(ch.statistics.viewCount),
      videos: formatNumber(ch.statistics.videoCount),
      published_at: ch.snippet.publishedAt
    };

    return NextResponse.json(result);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error", message: err.message }, { status: 500 });
  }
}
