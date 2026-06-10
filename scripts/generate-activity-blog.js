#!/usr/bin/env node

/**
 * 从 GitHub 获取 CCB 仓库近期活动（PR、commit），自动生成博客文章。
 *
 * 用法:
 *   node scripts/generate-activity-blog.js [--dry-run]
 *
 * 环境变量:
 *   GITHUB_TOKEN      - GitHub API 令牌（Actions 中自动提供）
 *   GITHUB_REPOSITORY - 仓库名，默认 LYHGLYTX/Cataclysm-Cleanwater-Bomb
 *   LOOKBACK_DAYS     - 回顾天数，默认 7
 */

const fs = require("fs");
const path = require("path");

const REPO = process.env.GITHUB_REPOSITORY || "LYHGLYTX/Cataclysm-Cleanwater-Bomb";
const LOOKBACK_DAYS = parseInt(process.env.LOOKBACK_DAYS || "7", 10);
const BLOG_DIR = path.join(__dirname, "..", "blog");
const DRY_RUN = process.argv.includes("--dry-run");

const TOKEN = process.env.GITHUB_TOKEN || "";
const AUTH_HEADER = TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {};

async function fetchJSON(url) {
  const res = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": "ccb-blog-generator/1.0",
      ...AUTH_HEADER,
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`GitHub API ${res.status}: ${res.url}\n${text}`);
  }
  return res.json();
}

async function fetchMergedPRs(since) {
  const prs = [];
  let page = 1;

  while (true) {
    const url = `https://api.github.com/repos/${REPO}/pulls?state=closed&sort=updated&direction=desc&per_page=100&page=${page}`;
    const batch = await fetchJSON(url);
    if (!batch || batch.length === 0) break;

    let foundOld = false;
    for (const pr of batch) {
      if (!pr.merged_at) continue;
      const merged = new Date(pr.merged_at);
      if (merged < since) {
        foundOld = true;
        break;
      }
      prs.push(pr);
    }
    if (foundOld || batch.length < 100) break;
    page++;
  }

  return prs;
}

async function fetchRecentCommits(since) {
  const url = `https://api.github.com/repos/${REPO}/commits?since=${since.toISOString()}&per_page=100`;
  return fetchJSON(url);
}

function generateSlug(date) {
  const y = date.getFullYear();
  const w = getWeekNumber(date);
  return `${y}-w${String(w).padStart(2, "0")}-activity`;
}

function getWeekNumber(d) {
  const start = new Date(d.getFullYear(), 0, 1);
  return Math.ceil(((d - start) / 86400000 + start.getDay() + 1) / 7);
}

function formatDate(d) {
  const m = d.getMonth() + 1;
  const day = d.getDate();
  return `${d.getFullYear()}-${String(m).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

async function main() {
  const now = new Date();
  const since = new Date(now.getTime() - LOOKBACK_DAYS * 86400000);
  const slug = generateSlug(now);
  const filename = `${formatDate(now)}-${slug}.md`;

  const existingFiles = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"));
  if (existingFiles.some((f) => f.includes(slug))) {
    console.log(`[skip] 本周博客已存在 (${slug})`);
    return { created: false };
  }

  console.log(`[fetch] 获取 ${REPO} 自 ${since.toISOString()} 以来的活动...`);

  let prs;
  let commits;
  try {
    [prs, commits] = await Promise.all([
      fetchMergedPRs(since),
      fetchRecentCommits(since),
    ]);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }

  console.log(`[info] 已合并 PR: ${prs.length}  提交: ${commits.length}`);

  if (prs.length === 0 && commits.length === 0) {
    console.log("[skip] 近期无活动");
    return { created: false };
  }

  const lines = [];

  lines.push("---");
  lines.push(`slug: ${slug}`);
  lines.push(`title: CCB 开发动态 (${formatDate(since)} ~ ${formatDate(now)})`);
  lines.push("authors: [lyh]");
  lines.push("tags: [activity, auto]");
  lines.push("---");
  lines.push("");
  lines.push(
    `过去 ${LOOKBACK_DAYS} 天的开发动态，由 GitHub Actions 自动生成。`
  );
  lines.push("");
  lines.push("<!-- truncate -->");
  lines.push("");

  if (prs.length > 0) {
    lines.push(`## 已合并 PR（${prs.length}）`);
    lines.push("");
    lines.push("| PR | 标题 | 作者 | 合并时间 |");
    lines.push("|---|---|---|---|");
    for (const pr of prs) {
      const title = (pr.title || "").replace(/\|/g, "\\|");
      const user = pr.user ? pr.user.login : "unknown";
      const date = formatDate(new Date(pr.merged_at));
      const num = `[#${pr.number}](${pr.html_url})`;
      lines.push(`| ${num} | ${title} | @${user} | ${date} |`);
    }
    lines.push("");
  }

  if (commits.length > 0) {
    lines.push(`## 近期提交（${commits.length}）`);
    lines.push("");
    lines.push("| 提交 | 作者 | 时间 |");
    lines.push("|---|---|---|");
    for (const c of commits.slice(0, 50)) {
      const msg = (c.commit?.message || "").split("\n")[0].replace(/\|/g, "\\|").substring(0, 80);
      const user = c.author ? c.author.login : (c.commit?.author?.name || "unknown");
      const date = formatDate(new Date(c.commit?.author?.date));
      const shortSha = c.sha.substring(0, 7);
      const link = `[${shortSha}](${c.html_url})`;
      lines.push(`| ${link} | @${user} | ${date} |`);
    }
    lines.push("");
  }

  const content = lines.join("\n");
  const filePath = path.join(BLOG_DIR, filename);

  if (DRY_RUN) {
    console.log(`[dry-run] 将写入 blog/${filename}`);
    console.log(content);
    return { created: true, filePath };
  }

  fs.writeFileSync(filePath, content, "utf-8");
  console.log(`[done] 已生成 blog/${filename}`);
  return { created: true, filePath };
}

main()
  .then((result) => {
    if (result.created) process.exit(0);
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
