export default async function handler(req, res) {
  const { channel } = req.query;
  if (!channel) {
    return res.status(400).json({ error: "channel parameter required" });
  }

  try {
    const handle = channel.replace("@", "");

    // Search for the channel using YouTube Data API
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent(
      handle
    )}&key=AIzaSyClAgCQ7xA9Kw3S-YxA4pPfTbBu2n9Hse4`;

    const searchRes = await fetch(searchUrl);
    const searchJson = await searchRes.json();

    if (!searchJson.items || searchJson.items.length === 0) {
      return res.status(404).json({ error: "Channel not found" });
    }

    const channelId = searchJson.items[0].snippet.channelId;

    // Get detailed channel stats
    const detailUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=AIzaSyClAgCQ7xA9Kw3S-YxA4pPfTbBu2n9Hse4`;
    const detailRes = await fetch(detailUrl);
    const detailJson = await detailRes.json();

    const ch = detailJson.items[0];

    const result = {
      channel_title: ch.snippet.title,
      channel_id: ch.id,
      handle: "@" + handle,
      subscribers: ch.statistics.subscriberCount,
      views: ch.statistics.viewCount,
      videos: ch.statistics.videoCount,
      published_at: ch.snippet.publishedAt
    };

    res.status(200).json(result);

  } catch (error) {
    res.status(500).json({ error: "Server error", message: error.message });
  }
}      views: ch.statistics.viewCount,
      videos: ch.statistics.videoCount,
      published_at: ch.snippet.publishedAt
    };

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error", message: error.message });
  }
}
    res.status(200).json(response);

  } catch (err) {
    res.status(500).json({ error: "Server error", message: err.message });
  }
}    };

    res.status(200).json(response);

  } catch (err) {
    res.status(500).json({ error: "Server error", message: err.message });
  }
}
