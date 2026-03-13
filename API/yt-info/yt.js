export default async function handler(req, res) {

const channel = req.query.channel?.replace("@","");

if(!channel){
return res.status(400).json({error:"Channel required"});
}

const API_KEY = process.env.YT_API_KEY;AIzaSyBSAOgDv1yaSEACAgTGV4xeiMGeaecL70Y

try {

const response = await fetch(
`https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${channel}&key=${API_KEY}`
);

const data = await response.json();

const channelId = data.items[0].snippet.channelId;

const stats = await fetch(
`https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&id=${channelId}&key=${API_KEY}`
);

const statsData = await stats.json();

const info = statsData.items[0];

const result = {
channel_title: info.snippet.title,
channel_id: channelId,
handle: "@" + channel,
subscribers: info.statistics.subscriberCount,
views: info.statistics.viewCount,
videos: info.statistics.videoCount,
published_at: info.snippet.publishedAt
};

res.json(result);

} catch(err){
res.status(500).json({error:"Failed to fetch"});
}

}
