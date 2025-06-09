import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AddPaperPage() {
  return (
    <main className="p-4 flex justify-center">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>Add Paper</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form className="space-y-4" encType="multipart/form-data">
            <Input placeholder="DOI" name="doi" required />
            <Input type="file" accept="application/pdf" name="pdf" required />
            <Button type="submit">Save</Button>
          </form>
          <p className="text-sm text-muted-foreground">
            This demo form does not actually save data.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
