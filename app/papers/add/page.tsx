import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AddPaperPage() {
  return (
    <main className="container mx-auto p-4">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Add Paper</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form
            className="space-y-4"
            action="/api/papers/add"
            method="post"
            encType="multipart/form-data"
          >
            <Input placeholder="DOI" name="doi" required />
            <Input type="file" accept="application/pdf" name="pdf" required />
            <Button type="submit">Save</Button>
          </form>
          <p className="text-sm text-muted-foreground">
            Submitting the form creates a pull request with the uploaded PDF in
            the
            <code>papers</code> directory.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
