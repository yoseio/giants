import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { notFound } from "next/navigation";

export default function SearchPage({ searchParams }: { searchParams?: { q?: string } }) {
  const query = searchParams?.q || "";
  if (!query) {
    return notFound();
  }

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
              {/* Placeholder for search results */}
              <TableRow>
                <TableCell>Example Paper</TableCell>
                <TableCell>John Doe</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}
