import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { Octokit } from "@octokit/rest";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const doi = formData.get("doi");
  const file = formData.get("pdf");

  if (!doi || typeof doi !== "string" || !(file instanceof Blob)) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const token = process.env.GITHUB_TOKEN;

  if (!owner || !repo || !token) {
    return NextResponse.json(
      { error: "Server not configured" },
      { status: 500 },
    );
  }

  const hash = createHash("sha256").update(doi).digest("hex");
  const branch = `add-paper-${hash}`;
  const pdfPath = `public/papers/${hash}.pdf`;
  const jsonPath = `public/papers/${hash}.json`;

  const octokit = new Octokit({
    auth: token,
    userAgent: "giants-app",
  });

  let repoData;
  try {
    ({ data: repoData } = await octokit.repos.get({ owner, repo }));
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: "Failed to get repo", details: message },
      { status: 500 },
    );
  }
  const defaultBranch = repoData.default_branch;

  let refData;
  try {
    ({ data: refData } = await octokit.git.getRef({
      owner,
      repo,
      ref: `heads/${defaultBranch}`,
    }));
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: "Failed to get branch ref", details: message },
      { status: 500 },
    );
  }
  const baseSha = (refData.object as { sha: string }).sha;

  try {
    await octokit.git.createRef({
      owner,
      repo,
      ref: `refs/heads/${branch}`,
      sha: baseSha,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: "Failed to create branch", details: message },
      { status: 500 },
    );
  }

  const title = formData.get("title");
  const year = formData.get("year");
  const authors = formData.get("authors");
  const abstract = formData.get("abstract");

  if (
    !title ||
    typeof title !== "string" ||
    !authors ||
    typeof authors !== "string"
  ) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const authorList = authors
    .split(",")
    .map((a) => a.trim())
    .filter(Boolean)
    .map((name) => ({ name }));

  const paperData = {
    paperId: doi,
    title,
    abstract:
      typeof abstract === "string" && abstract.trim() ? abstract.trim() : null,
    year:
      year && typeof year === "string" && year.trim()
        ? Number(year)
        : undefined,
    authors: authorList,
  };

  const jsonContent = Buffer.from(JSON.stringify(paperData, null, 2)).toString(
    "base64",
  );

  try {
    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: jsonPath,
      message: `Add metadata for ${doi}`,
      content: jsonContent,
      branch,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: "Failed to create metadata file", details: message },
      { status: 500 },
    );
  }

  const buffer = Buffer.from(await (file as Blob).arrayBuffer());
  const content = buffer.toString("base64");

  try {
    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: pdfPath,
      message: `Add paper ${doi}`,
      content,
      branch,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: "Failed to create file", details: message },
      { status: 500 },
    );
  }

  let prData;
  try {
    ({ data: prData } = await octokit.pulls.create({
      owner,
      repo,
      title: `Add paper ${doi}`,
      head: branch,
      base: defaultBranch,
      body: "Automated paper upload",
    }));
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: "Failed to create pull request", details: message },
      { status: 500 },
    );
  }

  return NextResponse.json({ url: prData.html_url });
}
