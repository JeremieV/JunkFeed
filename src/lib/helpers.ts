export function displayUrl(url: string): string {
  try {
    return new URL(url).host.replace(/^www\./, '').replace(/.com$/, '')
  } catch (e) {
    return url
  }
}

export function displayTimeAgo(dateStr: string | number): string {
  const inputDate = new Date(dateStr);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - inputDate.getTime()) / 1000);

  const intervals: { [key: string]: number } = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1
  };

  for (const [unit, value] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / value);
    if (interval >= 1) {
      return interval === 1 ? `1 ${unit} ago` : `${interval} ${unit}s ago`;
    }
  }

  return "just now";
}

function redditToRSS(redditUrl: string): string | null {
  const subredditRegex = /reddit\.com\/r\/([a-zA-Z0-9_]+)/;
  const userRegex = /reddit\.com\/user\/([a-zA-Z0-9_]+)/;

  // Check for a subreddit URL
  let match = redditUrl.match(subredditRegex);
  if (match) {
    return `https://www.reddit.com/r/${match[1]}/.rss`;
  }

  // Check for a user URL
  match = redditUrl.match(userRegex);
  if (match) {
    return `https://www.reddit.com/user/${match[1]}/.rss`;
  }

  // If no known format matches
  return null;
}

function substackToRSS(substackUrl: string): string | null {
  const substackRegex = /https?:\/\/([a-zA-Z0-9_-]+)\.substack\.com/;

  // Check if the URL matches a valid Substack URL
  const match = substackUrl.match(substackRegex);
  if (match) {
    const publicationName = match[1];
    return `https://${publicationName}.substack.com/feed`;
  }

  // If no valid Substack URL is found
  return null;
}

function mediumToRSS(mediumUrl: string): string | null {
  const userRegex = /medium\.com\/@([a-zA-Z0-9_-]+)/;
  const publicationRegex = /medium\.com\/([a-zA-Z0-9_-]+)(\/|$)/;

  // Check if it's a user/author URL
  let match = mediumUrl.match(userRegex);
  if (match) {
    return `https://medium.com/feed/@${match[1]}`;
  }

  // Check if it's a publication URL
  match = mediumUrl.match(publicationRegex);
  if (match) {
    return `https://medium.com/feed/${match[1]}`;
  }

  // If no valid Medium URL is found
  return null;
}

async function youtubeToRSS(youtubeUrl: string): Promise<string | null> {
  // Extract the channel name from the URL
  const channelNameMatch = youtubeUrl.match(/youtube\.com\/@([a-zA-Z0-9_-]+)/);
  console.log(channelNameMatch);
  if (!channelNameMatch || !channelNameMatch[1]) {
    return null;
  }

  const channelName = channelNameMatch[1];
  console.log(channelName);

  // Fetch the channel ID using the YouTube Data API
  const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${channelName}&key=${process.env.YOUTUBE_API_KEY}`;

  const response = await fetch(apiUrl);
  if (!response.ok) {
    console.error(`Failed to fetch channel ID: ${response.statusText}`);
    return null;
  }

  const data = await response.json();

  if (data.items && data.items.length > 0) {
    const channelId = data.items[0].snippet.channelId;
    // Construct the RSS feed URL
    return `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
  }

  return null; // Return null if the channel isn't found
}

export async function urlToRSS(url: string): Promise<string> {
  return (await youtubeToRSS(url)) || redditToRSS(url) || substackToRSS(url) || mediumToRSS(url) || url;
}

export function _import() {} 

export function _export(urls: string[]) {
  const opml = `<?xml version="1.0" encoding="UTF-8"?>
<opml version="2.0">
  <head>
    <title>Stateless Feed OPML Export</title>
  </head>
  <body>
    <outline text="stateless" title="stateless">
      ${urls.map((url) => `<outline type="rss" text="${url}" xmlUrl="${url}"/>`).join("\n      ")}
    </outline>
  </body>
</opml>`;

  const blob = new Blob([opml], { type: 'text/xml' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'stateless_feeds_export.opml';
  link.click();
  URL.revokeObjectURL(url);
}