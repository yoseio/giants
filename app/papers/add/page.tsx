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
          <form className="space-y-4">
            <Input placeholder="Title" required />
            <Input placeholder="Authors" required />
            <Button type="submit">Save</Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
