import { XMLParser } from "fast-xml-parser";

export interface Feed {
  title: string;
  url: string;
}

export interface Folder {
  title: string;
  path: string[]; // The full folder path, e.g. ["Tech", "News"]
  feeds: Feed[];
}

/**
 * Recursively traverses an outline node (representing a folder) and collects:
 *  - A flat folder entry (with its full path).
 *  - All feeds (RSS subscriptions) that are directly inside this folder or in any nested folders.
 *
 * @param outline - A parsed OPML outline node (without an "@_xmlUrl" attribute).
 * @param parentPath - The folder path of the parent (empty string for top-level folders).
 * @param accumulator - An array where each discovered folder is pushed.
 * @returns The aggregated feeds (Feed[]) from this folder and its children.
 */
function collectFolders(
  outline: any,
  path: string[],
  accumulator: Folder[]
): Feed[] {
  // Use either the "@_title" or "@_text" attribute (default if missing)
  const title = outline["@_title"] || outline["@_text"] || "Untitled Folder";
  const folderPath = [...path, title];
  let feeds: Feed[] = [];

  // Check for nested outlines (children)
  if (outline.outline) {
    // Ensure we always work with an array
    const children = Array.isArray(outline.outline)
      ? outline.outline
      : [outline.outline];

    for (const child of children) {
      // If the child has an xmlUrl attribute, it’s a feed.
      if (child["@_xmlUrl"]) {
        feeds.push({
          title: child["@_title"] || child["@_text"] || "Untitled Feed",
          url: child["@_xmlUrl"],
        });
      } else {
        // Otherwise, treat it as a folder and recursively collect its feeds.
        const childFeeds = collectFolders(child, folderPath, accumulator);
        feeds.push(...childFeeds);
      }
    }
  }

  // Create a folder entry with the aggregated feeds.
  const folder: Folder = {
    title,
    path: folderPath,
    feeds,
  };

  // Add this folder to the flat structure.
  accumulator.push(folder);

  // Return the feeds aggregated for this folder (to be bubbled up to its parent if any)
  return feeds;
}

// --------------------------------------------------------------------------
// Main function: Fetch, parse, and flatten the OPML structure.
// --------------------------------------------------------------------------

/**
 * Fetches an OPML file from the given URL (running in the browser),
 * parses it, and returns a flat structure of folders.
 *
 * Each folder contains:
 *  - A `path` property (showing its hierarchy).
 *  - An aggregated list of feeds (from itself and any nested child folders).
 *
 * Feeds that are at the top level (not inside any folder) are grouped into a special
 * folder with the title and path "root".
 *
 * @param url - The URL of the OPML file.
 * @returns A promise that resolves to an array of FlatFolder objects.
 */
export async function fetchAndParseOPML(url: string): Promise<{folders: Folder[], feeds: Feed[]}> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch OPML: ${response.statusText}`);
  }

  const opmlText = await response.text();

  // Create an XML parser configured to keep attributes.
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
  });
  const parsed = parser.parse(opmlText);

  if (!parsed.opml || !parsed.opml.body) {
    throw new Error("Invalid OPML format: missing <opml> or <body> element.");
  }

  // The <body> contains top-level <outline> elements.
  const outlines = parsed.opml.body.outline;
  const outlineArray = Array.isArray(outlines) ? outlines : [outlines];

  const flatFolders: Folder[] = [];
  const rootFeeds: Feed[] = [];

  // Process each top-level outline.
  for (const outline of outlineArray) {
    if (outline["@_xmlUrl"]) {
      // This is a feed not wrapped in a folder.
      rootFeeds.push({
        title: outline["@_title"] || outline["@_text"] || "Untitled Feed",
        url: outline["@_xmlUrl"],
      });
    } else {
      // This is a folder; recursively process it.
      collectFolders(outline, [], flatFolders);
    }
  }

  return {
    folders: flatFolders,
    feeds: [...rootFeeds, ...flatFolders.flatMap((folder) => folder.feeds)],
  };
}
