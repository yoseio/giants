import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPaper, listPaperIds } from "@/lib/papers";
import { notFound } from "next/navigation";

export default async function PaperDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const paper = await getPaper(id);
  if (!paper) {
    return notFound();
  }
  const authors = paper.authors.map((a) => a.name).join(", ");
  return (
    <main className="p-4 flex justify-center">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>{paper.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground">{authors}</p>
          <p>{paper.abstract || "No abstract available."}</p>
        </CardContent>
      </Card>
    </main>
  );
}

export async function generateStaticParams() {
  const ids = await listPaperIds();
  return ids.map((id) => ({ id }));
}
