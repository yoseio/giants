import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ReactMarkdown, { defaultUrlTransform } from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "@/components/ui/table";
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
      <Card className="w-full max-w-5xl mx-auto">
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
                rehypePlugins={[rehypeRaw, rehypeKatex]}
                components={{
                  table: (props) => <Table {...props} />,
                  thead: (props) => <TableHeader {...props} />,
                  tbody: (props) => <TableBody {...props} />,
                  tfoot: (props) => <TableFooter {...props} />,
                  tr: (props) => <TableRow {...props} />,
                  th: (props) => <TableHead {...props} />,
                  td: (props) => <TableCell {...props} />,
                  caption: (props) => <TableCaption {...props} />,
                }}
                urlTransform={(url, key) => {
                  const safe = defaultUrlTransform(url);
                  if (
                    key === "src" &&
                    !/^(?:[a-z]+:)?\/\//i.test(safe) &&
                    !safe.startsWith("/")
                  ) {
                    return `/papers/${id}/${safe}`;
                  }
                  return safe;
                }}
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
