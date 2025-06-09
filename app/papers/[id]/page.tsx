import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PaperDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  return (
    <main className="p-4 flex justify-center">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>Paper Detail</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>ID: {id}</p>
          {/* Additional paper details would go here */}
        </CardContent>
      </Card>
    </main>
  );
}
