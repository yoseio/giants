import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { getPaper, listPaperIds, getPaperMarkdown } from "@/lib/papers";
import { notFound } from "next/navigation";

export default async function PaperDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const paper = await getPaper(id);
  const markdown = await getPaperMarkdown(id, "ja");
  if (!paper) {
    return notFound();
  }
  const authors = paper.authors.map((a) => a.name).join(", ");
  return (
    <main className="container mx-auto p-4">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="space-y-1">
          <CardTitle>{paper.title}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {authors}
            {paper.year ? ` (${paper.year})` : null}
          </p>
          {paper.openAccessPdf?.url ? (
            <a
              href={paper.openAccessPdf.url}
              className="text-sm underline text-blue-600"
              target="_blank"
              rel="noopener noreferrer"
            >
              View PDF
            </a>
          ) : null}
        </CardHeader>
        <CardContent className="space-y-4">
          {markdown ? (
            <div className="markdown">
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex]}
              >
                {markdown}
              </ReactMarkdown>
            </div>
          ) : (
            <p>{paper.abstract || "No abstract available."}</p>
          )}
        </CardContent>
      </Card>
    </main>
  );
}

export async function generateStaticParams() {
  const ids = await listPaperIds();
  return ids.map((id) => ({ id }));
}
