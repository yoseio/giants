import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { searchPapers } from "@/lib/papers";
import { notFound } from "next/navigation";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = (await searchParams) || {};
  const query = params.q || "";
  if (!query) {
    return notFound();
  }
  const results = await searchPapers(query);

  return (
    <main className="container mx-auto p-4">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>{`Search results for "${query}"`}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Authors</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.length ? (
                results.map((paper) => {
                  const authors = paper.authors.map((a) => a.name).join(", ");
                  return (
                    <TableRow key={paper.id}>
                      <TableCell>
                        <Link href={`/papers/${paper.id}`}>{paper.title}</Link>
                      </TableCell>
                      <TableCell>{authors}</TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={2}>No results found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}
