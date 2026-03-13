export default async function handler(req, res) {
  const { channel } = req.query;

  if (!channel) {
    return res.status(400).json({ error: "channel parameter required" });
  }

  try {
    const handle = channel.replace("@", "");

    // 1) Search YouTube to get the channel ID (JSON mode)
    const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
      handle
    )}&pbj=1`;
    const searchRes = await fetch(searchUrl, {
      headers: {
        "x-youtube-client-name": "1",
        "x-youtube-client-version": "2.20231110.00.00"
      }
    });

    const searchJson = await searchRes.json();
    const channelRenderer =
      searchJson[1]?.response?.contents?.twoColumnSearchResultsRenderer
        ?.primaryContents?.sectionListRenderer?.contents?.[0]
        ?.itemSectionRenderer?.contents?.[0]?.channelRenderer;

    if (!channelRenderer) {
      return res.status(404).json({ error: "Channel not found" });
    }

    const channelId = channelRenderer.channelId;

    // 2) Fetch channel info JSON using pbj
    const channelUrl = `https://www.youtube.com/channel/${channelId}?pbj=1`;
    const channelRes = await fetch(channelUrl, {
      headers: {
        "x-youtube-client-name": "1",
        "x-youtube-client-version": "2.20231110.00.00"
      }
    });
    const channelJson = await channelRes.json();

    const metadata =
      channelJson[1]?.response?.metadata?.channelMetadataRenderer;
    const stats =
      channelJson[1]?.response?.contents?.singleColumnBrowseResultsRenderer
        ?.tabs?.[0]?.tabRenderer?.content?.sectionListRenderer?.contents?.[0]
        ?.itemSectionRenderer?.contents?.[0]?.channelAboutFullMetadataRenderer;

    const result = {
      channel_title: metadata?.title || "Unknown",
      channel_id: metadata?.externalId || channelId,
      handle: "@" + handle,
      subscribers: stats?.subscriberCountText?.simpleText || "Unknown",
      views: stats?.viewCountText?.simpleText || "Unknown",
      videos: stats?.videoCountText?.simpleText || "Unknown",
      published_at: stats?.joinedDateText?.simpleText || "Unknown",
      description: metadata?.description || "Unknown"
    };

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Server error", message: error.message });
  }
}
