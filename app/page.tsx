import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { listPaperIds, getPaper } from "@/lib/papers";

export default async function Home() {
  const ids = await listPaperIds();
  const papers = await Promise.all(ids.map((id) => getPaper(id)));

  return (
    <main className="container mx-auto p-4 space-y-6">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Standing on the Shoulders of Giants</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Manage your research papers with a simple workflow.</p>
          <div className="flex flex-col sm:flex-row gap-2">
            <form action="/search" className="flex-1">
              <Input name="q" placeholder="Search papers" className="w-full" />
            </form>
            <Button asChild className="whitespace-nowrap">
              <Link href="/papers/add">Add Paper</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
      {papers.length > 0 && (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Available Papers</CardTitle>
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
                {papers.map((paper, i) => {
                  if (!paper) return null;
                  const authors = paper.authors.map((a) => a.name).join(", ");
                  return (
                    <TableRow key={ids[i]}>
                      <TableCell>
                        <Link href={`/papers/${ids[i]}`}>{paper.title}</Link>
                      </TableCell>
                      <TableCell>{authors}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </main>
  );
}
