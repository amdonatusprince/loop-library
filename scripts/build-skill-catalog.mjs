import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

import { getLoopCategory, loops, site } from "./loop-data.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const catalogPath = path.join(
  root,
  "skills",
  "loop-library",
  "references",
  "catalog.md",
);

export function renderSkillCatalog() {
  const titleBySlug = new Map(loops.map((loop) => [loop.slug, loop.title]));
  const lines = [
    "# Published Loop Library catalog",
    "",
    `Snapshot generated from \`scripts/loop-data.mjs\` (catalog updated ${site.updated}).`,
    `Canonical catalog: ${site.baseUrl}`,
    "",
    "Search by outcome, trigger, artifact, evidence, category, or keyword. Check",
    "the canonical catalog when freshness matters. Treat adaptations and new designs",
    "as unpublished unless they appear at the canonical URL.",
    "",
  ];

  for (const loop of loops) {
    const url = `${site.baseUrl}loops/${loop.slug}/`;
    const related = loop.related
      .map((slug) => `[${titleBySlug.get(slug)}](${site.baseUrl}loops/${slug}/)`)
      .join(", ");

    lines.push(
      `## ${loop.number} — [${loop.title}](${url})`,
      "",
      `- Category: ${getLoopCategory(loop).label}`,
      `- Use when: ${loop.useWhen}`,
      `- Prompt: ${loop.prompt}`,
      `- Verify: ${loop.verifyTitle} ${loop.verifyDetail}`,
      `- Keywords: ${loop.keywords.join(", ")}`,
      `- Related: ${related}`,
      "",
    );
  }

  return lines.join("\n");
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await writeFile(catalogPath, renderSkillCatalog(), "utf8");
  console.log(`Wrote ${path.relative(root, catalogPath)} from ${loops.length} loops.`);
}
