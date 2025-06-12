import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
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
        <CardHeader>
          <CardTitle>{paper.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground">{authors}</p>
          {markdown ? (
            <ReactMarkdown>{markdown}</ReactMarkdown>
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
