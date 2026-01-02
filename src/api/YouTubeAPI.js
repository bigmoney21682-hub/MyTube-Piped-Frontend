// File: src/api/YouTubeAPI.js
// Description: Optimized YouTube API fetch layer with caching, dedupe, and key rotation.

const API_KEYS = [
  import.meta.env.VITE_YT_API_PRIMARY,
  import.meta.env.VITE_YT_API_FALLBACK1
];

let keyIndex = 0;
function getKey() {
  return API_KEYS[keyIndex % API_KEYS.length];
}

function rotateKey() {
  keyIndex++;
}

const videoCache = {};
const relatedCache = {};
const trendingCache = {};
const pending = {}; // dedupe in-flight requests

/* ------------------------------------------------------------
   Safe fetch with key rotation + dedupe
------------------------------------------------------------ */
async function safeFetch(url) {
  if (pending[url]) return pending[url];

  pending[url] = new Promise(async (resolve) => {
    for (let i = 0; i < API_KEYS.length; i++) {
      const key = getKey();
      const finalUrl = url.replace("{{KEY}}", key);

      try {
        const res = await fetch(finalUrl);

        if (res.status === 200) {
          const json = await res.json();
          delete pending[url];
          return resolve(json);
        }

        if (res.status === 403) {
          rotateKey();
          continue;
        }

        break;
      } catch (err) {
        rotateKey();
      }
    }

    delete pending[url];
    resolve(null);
  });

  return pending[url];
}

/* ------------------------------------------------------------
   Fetch video metadata (cached)
------------------------------------------------------------ */
export async function fetchVideo(id) {
  if (videoCache[id]) return videoCache[id];

  const url =
    `https://www.googleapis.com/youtube/v3/videos?` +
    `part=snippet,statistics&id=${id}&key={{KEY}}`;

  const json = await safeFetch(url);
  if (!json || !json.items || !json.items[0]) return null;

  videoCache[id] = json.items[0];
  return videoCache[id];
}

/* ------------------------------------------------------------
   Fetch related videos (cached)
------------------------------------------------------------ */
export async function fetchRelated(id) {
  if (relatedCache[id]) return relatedCache[id];

  const url =
    `https://www.googleapis.com/youtube/v3/search?` +
    `part=snippet&type=video&relatedToVideoId=${id}` +
    `&videoEmbeddable=true&maxResults=20&key={{KEY}}`;

  const json = await safeFetch(url);

  if (!json || !Array.isArray(json.items)) {
    relatedCache[id] = [];
    return [];
  }

  relatedCache[id] = json.items;
  return relatedCache[id];
}

/* ------------------------------------------------------------
   Fetch trending (cached for 30 minutes)
------------------------------------------------------------ */
export async function fetchTrending(region = "US") {
  const cache = trendingCache[region];
  const now = Date.now();

  if (cache && now - cache.timestamp < 30 * 60 * 1000) {
    return cache.items;
  }

  const url =
    `https://www.googleapis.com/youtube/v3/videos?` +
    `part=snippet,statistics&chart=mostPopular&maxResults=20` +
    `&regionCode=${region}&key={{KEY}}`;

  const json = await safeFetch(url);

  if (!json || !json.items) {
    return cache ? cache.items : [];
  }

  trendingCache[region] = {
    timestamp: now,
    items: json.items
  };

  return json.items;
}
