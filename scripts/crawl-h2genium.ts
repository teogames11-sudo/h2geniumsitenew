import fs from "node:fs/promises";
import path from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import * as cheerio from "cheerio";

type SnapshotPage = {
  url: string;
  title: string;
  headings: string[];
  paragraphs: string[];
  lists: string[];
  images: string[];
  documents: { title: string; url: string }[];
  links: string[];
};

type Product = {
  url: string;
  slug: string;
  title: string;
  description?: string;
  images: string[];
  documents: { title: string; url: string }[];
};

type Article = {
  url: string;
  title: string;
  excerpt?: string;
};

type DocumentLink = {
  url: string;
  title: string;
};

const seeds = [
  "https://h2genium.ru/",
  "https://h2genium.ru/catalog",
  "https://h2genium.ru/privacy",
  "https://h2genium.ru/cookie",
];

const allowlist = [
  /^https:\/\/h2genium\.ru\/$/,
  /^https:\/\/h2genium\.ru\/catalog\/?$/,
  /^https:\/\/h2genium\.ru\/privacy\/?$/,
  /^https:\/\/h2genium\.ru\/cookie\/?$/,
  /^https:\/\/h2genium\.ru\/tproduct\/\d+-.+$/,
  /^https:\/\/h2genium\.ru\/catalog\/tproduct\/\d+-.+$/,
  /^https:\/\/h2genium\.ru\/(?!catalog|privacy|cookie|tproduct)[a-z0-9-]+\/?$/i,
];

const MAX_DEPTH = 3;
const MAX_PAGES = 500;

const isAllowed = (url: string) => allowlist.some((pattern) => pattern.test(url.split("#")[0]));

const normalizeUrl = (href: string, base: string) => {
  if (!href) return null;
  try {
    const url = new URL(href, base);
    if (url.hostname !== "h2genium.ru") return null;
    return url.toString().split("#")[0];
  } catch {
    return null;
  }
};

const cleanText = (value: string) =>
  value
    .replace(/\s+/g, " ")
    .replace(/\u00a0/g, " ")
    .trim();

const ensureContentDir = async () => {
  const target = path.join(process.cwd(), "src", "content");
  await fs.mkdir(target, { recursive: true });
};

const snapshot: SnapshotPage[] = [];
const products: Product[] = [];
const articles: Article[] = [];
const documents: DocumentLink[] = [];

const queue: { url: string; depth: number }[] = seeds.map((url) => ({ url, depth: 0 }));
const visited = new Set<string>();

const maybePushDocument = (docUrl: string, title: string) => {
  if (!docUrl || documents.some((d) => d.url === docUrl)) return;
  documents.push({ url: docUrl, title: title || path.basename(docUrl) });
};

const parsePage = (url: string, html: string) => {
  const $ = cheerio.load(html);

  const headings: string[] = [];
  $("h1, h2, h3, h4").each((_, el) => {
    const text = cleanText($(el).text());
    if (text) headings.push(text);
  });

  const paragraphs: string[] = [];
  $("p").each((_, el) => {
    const text = cleanText($(el).text());
    if (text) paragraphs.push(text);
  });
  $('[data-elem-type="text"], [data-elem-type="title"]').each((_, el) => {
    const text = cleanText($(el).text());
    if (text) paragraphs.push(text);
  });

  const lists: string[] = [];
  $("li").each((_, el) => {
    const text = cleanText($(el).text());
    if (text) lists.push(text);
  });

  const images: string[] = [];
  $("img").each((_, el) => {
    const src = $(el).attr("src");
    const normalized = normalizeUrl(src || "", url);
    if (normalized && !images.includes(normalized)) images.push(normalized);
  });

  const documentLinks: { title: string; url: string }[] = [];
  $('a[href$=".pdf"], a[href$=".doc"], a[href$=".docx"]').each((_, el) => {
    const href = $(el).attr("href");
    const title = cleanText($(el).text()) || path.basename(href || "");
    const normalized = normalizeUrl(href || "", url);
    if (normalized) {
      documentLinks.push({ title, url: normalized });
      maybePushDocument(normalized, title);
    }
  });

  const title = cleanText($("title").first().text()) || url;
  const links: string[] = [];

  $("a[href]").each((_, el) => {
    const href = $(el).attr("href");
    const normalized = normalizeUrl(href || "", url);
    if (normalized && !links.includes(normalized) && isAllowed(normalized)) {
      links.push(normalized);
    }
  });

  snapshot.push({ url, title, headings, paragraphs, lists, images, documents: documentLinks, links });

  if (/\/tproduct\/\d+-/.test(url)) {
    const slug = url.split("/").filter(Boolean).pop() || "";
    const productTitle = headings[0] || title;
    const desc = paragraphs.slice(0, 3).join(" ").slice(0, 500);
    products.push({ url, slug, title: productTitle, description: desc, images, documents: documentLinks });
  }

  if (/\/(blog|news|articles)/.test(url)) {
    const articleTitle = headings[0] || title;
    const excerpt = paragraphs.slice(0, 2).join(" ").slice(0, 300);
    articles.push({ url, title: articleTitle, excerpt });
  }

  return links;
};

const crawl = async () => {
  while (queue.length && visited.size < MAX_PAGES) {
    const current = queue.shift();
    if (!current) break;
    const { url, depth } = current;
    if (visited.has(url) || depth > MAX_DEPTH || !isAllowed(url)) continue;
    visited.add(url);

    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent": "H2GENIUM-content-sync/1.0 (+https://h2genium.ru)",
          Accept: "text/html,application/xhtml+xml",
        },
      });
      if (!res.ok) {
        console.warn(`Skip ${url}: ${res.status}`);
        continue;
      }
      const html = await res.text();
      const nextLinks = parsePage(url, html);
      if (depth < MAX_DEPTH) {
        nextLinks.forEach((link) => {
          if (!visited.has(link) && queue.length + visited.size < MAX_PAGES) {
            queue.push({ url: link, depth: depth + 1 });
          }
        });
      }
    } catch (error) {
      console.warn(`Failed to fetch ${url}`, error);
    }

    const jitter = Math.floor(Math.random() * 200) + 200;
    await delay(jitter);
  }
};

const save = async () => {
  await ensureContentDir();
  const snapshotPath = path.join(process.cwd(), "src", "content", "h2genium.snapshot.json");
  const productsPath = path.join(process.cwd(), "src", "content", "products.json");
  const articlesPath = path.join(process.cwd(), "src", "content", "articles.json");
  const documentsPath = path.join(process.cwd(), "src", "content", "documents.json");

  await fs.writeFile(
    snapshotPath,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        pages: snapshot,
      },
      null,
      2,
    ),
    "utf-8",
  );

  await fs.writeFile(productsPath, JSON.stringify(products, null, 2), "utf-8");
  await fs.writeFile(articlesPath, JSON.stringify(articles, null, 2), "utf-8");
  await fs.writeFile(documentsPath, JSON.stringify(documents, null, 2), "utf-8");
};

const main = async () => {
  console.log("Starting crawl...");
  await crawl();
  console.log(`Visited ${visited.size} pages`);
  await save();
  console.log("Saved content to src/content");
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
