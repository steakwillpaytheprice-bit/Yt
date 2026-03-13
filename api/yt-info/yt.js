export default async function handler(req, res) {
  const { channel } = req.query;
  if (!channel) return res.status(400).json({ error: "channel parameter required" });

  try {
    const handle = channel.replace("@", "");
    const API_KEY = process.env.YT_API_KEY || "AIzaSyClAgCQ7xA9Kw3S-YxA4pPfTbBu2n9Hse4";

    // 1) Search for channel
    const searchRes = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent(handle)}&key=${API_KEY}`
    );
    const searchJson = await searchRes.json();

    if (!searchJson.items || searchJson.items.length === 0)
      return res.status(404).json({ error: "Channel not found" });

    const channelId = searchJson.items[0].snippet.channelId;

    // 2) Get channel details
    const detailRes = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${API_KEY}`
    );
    const detailJson = await detailRes.json();

    if (!detailJson.items || !detailJson.items[0])
      return res.status(404).json({ error: "Channel details not found" });

    const ch = detailJson.items[0];

    res.status(200).json({
      channel_title: ch.snippet.title,
      channel_id: ch.id,
      handle: "@" + handle,
      subscribers: ch.statistics.subscriberCount,
      views: ch.statistics.viewCount,
      videos: ch.statistics.videoCount,
      published_at: ch.snippet.publishedAt
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error", message: error.message });
  }
}      videos: ch.statistics.videoCount,
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
