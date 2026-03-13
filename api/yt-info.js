import fetch from "node-fetch";

export default async function handler(req, res) {

  const { channel } = req.query;

  if (!channel) {
    return res.status(400).json({
      error: "channel parameter required"
    });
  }

  try {

    const handle = channel.replace("@", "");
    const url = `https://www.youtube.com/@${handle}`;

    const response = await fetch(url);
    const html = await response.text();

    const match = html.match(/ytInitialData\s*=\s*(\{.*?\});/);

    if (!match) {
      return res.status(404).json({
        error: "Channel data not found"
      });
    }

    const data = JSON.parse(match[1]);

    const header = data.header.c4TabbedHeaderRenderer;

    const result = {
      channel_title: header.title,
      channel_id: header.channelId,
      handle: "@" + handle,
      subscribers: header.subscriberCountText?.simpleText || "Unknown",
      videos: header.videosCountText?.runs?.[0]?.text || "Unknown",
      views: header.viewCountText?.simpleText || "Unknown"
    };

    res.status(200).json(result);

  } catch (error) {

    res.status(500).json({
      error: "Failed to fetch YouTube data",
      message: error.message
    });

  }
}      published_at: header.joinedDateText?.runs?.[1]?.text || "Unknown"
    };

    res.status(200).json(result);

  } catch (error) {
    res.status(500).json({ error: "failed to fetch info" });
  }
}
