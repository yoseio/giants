import Link from "next/link"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { searchPapers } from "@/lib/demo-data"
import { notFound } from "next/navigation"

export default function SearchPage({ searchParams }: { searchParams?: { q?: string } }) {
  const query = searchParams?.q || "";
  if (!query) {
    return notFound();
  }
  const results = searchPapers(query)

  return (
    <main className="p-4">
      <Card>
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
                results.map((paper) => (
                  <TableRow key={paper.id}>
                    <TableCell>
                      <Link href={`/papers/${paper.id}`}>{paper.title}</Link>
                    </TableCell>
                    <TableCell>{paper.authors}</TableCell>
                  </TableRow>
                ))
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
