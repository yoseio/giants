import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddPaperForm } from "@/components/AddPaperForm";

export default function AddPaperPage() {
  return (
    <main className="container mx-auto p-4">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Add Paper</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <AddPaperForm />
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
