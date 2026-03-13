import fetch from "node-fetch";

export default async function handler(req, res) {

  const channel = req.query.channel;

  if (!channel) {
    return res.status(400).json({ error: "channel required" });
  }

  try {

    const handle = channel.replace("@", "");
    const url = `https://www.youtube.com/@${handle}`;

    const response = await fetch(url);
    const html = await response.text();

    const jsonMatch = html.match(/ytInitialData\s*=\s*(\{.*?\});/);

    if (!jsonMatch) {
      return res.status(404).json({ error: "channel not found" });
    }

    const data = JSON.parse(jsonMatch[1]);

    const header =
      data.header.c4TabbedHeaderRenderer;

    const result = {
      channel_title: header.title,
      channel_id: header.channelId,
      handle: "@" + handle,
      subscribers: header.subscriberCountText.simpleText,
      videos: header.videosCountText?.runs?.[0]?.text || "Unknown",
      views: header.viewCountText?.simpleText || "Unknown",
      published_at: header.joinedDateText?.runs?.[1]?.text || "Unknown"
    };

    res.status(200).json(result);

  } catch (error) {
    res.status(500).json({ error: "failed to fetch info" });
  }
}
