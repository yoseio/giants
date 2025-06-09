import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getPaper } from "@/lib/demo-data"
import { notFound } from "next/navigation"

export default function PaperDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  const paper = getPaper(id)
  if (!paper) {
    return notFound()
  }
  return (
    <main className="p-4 flex justify-center">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>{paper.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground">{paper.authors}</p>
          <p>{paper.abstract}</p>
        </CardContent>
      </Card>
    </main>
  )
}
