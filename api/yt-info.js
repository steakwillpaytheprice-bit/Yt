export default async function handler(req, res) {
  const { channel } = req.query;

  if (!channel) return res.status(400).json({ error: "channel parameter required" });

  try {
    const handle = channel.replace("@", "");
    const url = `https://www.youtube.com/@${handle}?pbj=1`;

    const response = await fetch(url, {
      headers: {
        "x-youtube-client-name": "1",
        "x-youtube-client-version": "2.20231110.00.00",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
      }
    });

    if (!response.ok) return res.status(404).json({ error: "Channel not found" });

    const json = await response.json();

    const header = json[1]?.response?.metadata?.channelMetadataRenderer;
    const stats = json[1]?.response?.contents?.singleColumnBrowseResultsRenderer
      ?.tabs?.[0]?.tabRenderer?.content?.sectionListRenderer?.contents?.[0]
      ?.itemSectionRenderer?.contents?.[0]?.channelAboutFullMetadataRenderer;

    if (!header) return res.status(404).json({ error: "Channel not found" });

    res.status(200).json({
      channel_title: header?.title || "Unknown",
      channel_id: header?.externalId || "Unknown",
      handle: "@" + handle,
      subscribers: stats?.subscriberCountText?.simpleText || "Unknown",
      views: stats?.viewCountText?.simpleText || "Unknown",
      videos: stats?.videoCountText?.simpleText || "Unknown",
      published_at: stats?.joinedDateText?.simpleText || "Unknown",
      description: header?.description || "Unknown"
    });
  } catch (err) {
    res.status(500).json({ error: "Server error", message: err.message });
  }
}      headers: {
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
