import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

// Helper: format numbers
const formatNumber = (num) => {
  if (!num) return "0";
  const n = parseInt(num, 10);
  if (n >= 1e9) return (n / 1e9).toFixed(1) + "B";
  if (n >= 1e6) return (n / 1e6).toFixed(1) + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(1) + "K";
  return n.toString();
};

// Main API route
app.get("/yt-info/yt", async (req, res) => {
  const { channel } = req.query;

  if (!channel) return res.status(400).json({ error: "channel parameter required" });

  const handle = channel.replace("@", "");
  const API_KEY = process.env.YT_API_KEY;

  if (!API_KEY) return res.status(500).json({ error: "YT_API_KEY not set in environment variables" });

  try {
    // 1️⃣ Search for channel
    const searchRes = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent(handle)}&key=${API_KEY}`
    );
    const searchJson = await searchRes.json();

    if (!searchJson.items || searchJson.items.length === 0)
      return res.status(404).json({ error: "Channel not found" });

    const channelId = searchJson.items[0].snippet.channelId;

    // 2️⃣ Get channel details
    const detailRes = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${API_KEY}`
    );
    const detailJson = await detailRes.json();

    if (!detailJson.items || !detailJson.items[0])
      return res.status(404).json({ error: "Channel details not found" });

    const ch = detailJson.items[0];

    const result = {
      channel_title: ch.snippet.title,
      channel_id: ch.id,
      handle: "@" + handle,
      subscribers: formatNumber(ch.statistics.subscriberCount),
      views: formatNumber(ch.statistics.viewCount),
      videos: formatNumber(ch.statistics.videoCount),
      published_at: ch.snippet.publishedAt
    };

    res.status(200).json(result);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error", message: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
