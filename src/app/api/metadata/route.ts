import { Redis } from '@upstash/redis';
import { parse, HTMLElement } from 'node-html-parser';
import UserAgent from 'user-agents';

export const runtime = 'edge';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const rulesets: {
  name: string;
  rules: [string, (element: HTMLElement) => string | undefined][];
  absolute?: boolean;
  defaultValue?: string;
}[] = [
    {
      name: 'title',
      rules: [
        ['meta[property="og:title"]', (e) => e.getAttribute('content')],
        ['meta[name="twitter:title"]', (e) => e.getAttribute('content')],
        ['meta[property="twitter:title"]', (e) => e.getAttribute('content')],
        ['title', (e) => e.text],
      ],
    },
    {
      name: 'description',
      rules: [
        ['meta[property="og:description"]', (e) => e.getAttribute('content')],
        ['meta[name="description" i]', (e) => e.getAttribute('content')],
      ],
    },
    {
      name: 'published_time',
      rules: [
        ['meta[property="article:published_time"]', (e) => e.getAttribute('content')],
        ['meta[name="article:published_time"]', (e) => e.getAttribute('content')],
        ['time[pubdate]', (e) => e.getAttribute('datetime')],
      ],
    },
    {
      name: 'modified_time',
      rules: [
        ['meta[property="article:modified_time"]', (e) => e.getAttribute('content')],
        ['meta[name="article:modified_time"]', (e) => e.getAttribute('content')],
      ],
    },
    {
      name: 'language',
      rules: [
        ['html', (e) => e.getAttribute('lang')],
      ],
    },
    {
      name: 'author',
      rules: [
        ['meta[name="author"]', (e) => e.getAttribute('content')],
        ['meta[property="article:author"]', (e) => e.getAttribute('content')],
      ],
    },
    {
      name: 'icon',
      rules: [
        ['link[rel="apple-touch-icon"]', (e) => e.getAttribute('href')],
        ['link[rel="apple-touch-icon-precomposed"]', (e) => e.getAttribute('href')],
        ['link[rel="icon" i]', (e) => e.getAttribute('href')],
      ],
      absolute: true,
    },
    {
      name: 'image',
      rules: [
        ['meta[property="og:image:secure_url"]', (e) => e.getAttribute('content')],
        ['meta[property="og:image:url"]', (e) => e.getAttribute('content')],
        ['meta[property="og:image"]', (e) => e.getAttribute('content')],
        ['meta[name="twitter:image"]', (e) => e.getAttribute('content')],
        ['meta[property="twitter:image"]', (e) => e.getAttribute('content')],
        ['meta[name="thumbnail"]', (e) => e.getAttribute('content')],
      ],
      absolute: true,
    }
  ];

/** Transforms relative urls into absolute ones, for images and icons for eg. Throws if not well formed. */
function makeUrlAbsolute(pageUrl: string, path: string) {
  return new URL(path, new URL(pageUrl).origin).toString()
}

// Fetch the HTML head by reading the response stream until the closing </head> tag is found.
async function fetchHead(url: string) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': new UserAgent().toString(),
    },
    signal: AbortSignal.timeout(9_000),
  });
  const reader = res.body?.getReader();
  if (!reader) {
    throw new Error('Failed to get reader from response body');
  }
  const decoder = new TextDecoder();
  let head = '';

  while (true) {
    const { value, done } = await reader.read();
    if (value) {
      // Decode the chunk and append it to our head variable.
      head += decoder.decode(value, { stream: true });
      // If the closing </head> tag is found, truncate the content.
      if (head.includes('</head>')) {
        const index = head.indexOf('</head>');
        head = head.substring(0, index + 7) + '</html>';
        break;
      }
    }
    if (done) break;
  }
  return head;
}

async function fetchMeta(url: string): Promise<Record<string, any>> {
  const head = await fetchHead(url);
  const dom = parse(head);
  const metadata = { url };

  for (const ruleset of rulesets) {
    for (const rule of ruleset.rules) {
      const [selector, fn] = rule;
      const el = dom.querySelector(selector);
      if (el) {
        let data = fn(el);
        if (data && ruleset.absolute) {
          data = makeUrlAbsolute(url, data);
        }
        // @ts-ignore
        metadata[ruleset.name] = data;
        break;
      }
    }
  }
  return metadata as Record<string, string>;
}

export async function GET(req: Request): Promise<Response> {
  try {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get('url');

    if (!url) {
      return new Response(JSON.stringify({ error: 'Missing url parameter' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const targetUrl = decodeURIComponent(url);

    // check cache
    const cacheKey = `meta:${targetUrl}`;
    const cached: string | null = await redis.get(cacheKey);
    if (cached) {
      return new Response(JSON.stringify(cached), {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=604800, stale-while-revalidate=604800' // cache for 1 week
        },
      });
    }

    // fetch and cache
    const metadata = await fetchMeta(targetUrl);
    await redis.set(cacheKey, JSON.stringify(metadata));
    return new Response(JSON.stringify(metadata), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=604800, stale-while-revalidate=604800' // cache for 1 week
      },
    });
  }
}
