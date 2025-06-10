import fs from "fs/promises";
import path from "path";

export type Author = {
  authorId: string;
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
  const files = await fs.readdir(papersDir);
  return files
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(/\.json$/, ""));
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
