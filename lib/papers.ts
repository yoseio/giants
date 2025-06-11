import fs from "fs/promises";
import path from "path";

export type Author = {
  name: string;
};

export type Paper = {
  paperId: string;
  title: string;
  year?: number;
  abstract: string | null;
  authors: Author[];
  openAccessPdf?: { url: string };
};

const papersDir = path.join(process.cwd(), "papers");

export async function listPaperIds(): Promise<string[]> {
  try {
    const files = await fs.readdir(papersDir);
    return files
      .filter((f) => f.endsWith(".json"))
      .map((f) => f.replace(/\.json$/, ""));
  } catch {
    return [];
  }
}

export async function getPaper(id: string): Promise<Paper | null> {
  try {
    const filePath = path.join(process.cwd(), "papers", `${id}.json`);
    const data = await fs.readFile(filePath, "utf8");
    return JSON.parse(data) as Paper;
  } catch {
    return null;
  }
}

export type PaperWithId = Paper & { id: string };

export async function searchPapers(query: string): Promise<PaperWithId[]> {
  const q = query.toLowerCase();
  const ids = await listPaperIds();
  const results: PaperWithId[] = [];
  for (const id of ids) {
    const paper = await getPaper(id);
    if (!paper) continue;
    const authors = paper.authors
      .map((a) => a.name)
      .join(", ")
      .toLowerCase();
    if (paper.title.toLowerCase().includes(q) || authors.includes(q)) {
      results.push({ id, ...paper });
    }
  }
  return results;
}
