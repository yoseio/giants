"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AddPaperPage() {
  const [doi, setDoi] = useState("");
  const [file, setFile] = useState<File | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!file) return;
    const fields = "paperId,title,abstract,year,authors.name";
    let metadata: unknown;
    try {
      const res = await fetch(
        `https://api.semanticscholar.org/graph/v1/paper/DOI:${encodeURIComponent(
          doi,
        )}?fields=${fields}`,
      );
      if (!res.ok) {
        throw new Error(await res.text());
      }
      metadata = await res.json();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to fetch metadata");
      return;
    }

    const formData = new FormData();
    formData.append("doi", doi);
    formData.append("metadata", JSON.stringify(metadata));
    formData.append("pdf", file);

    const upload = await fetch("/api/papers/add", {
      method: "POST",
      body: formData,
    });

    if (upload.ok) {
      const data = (await upload.json()) as { url: string };
      window.location.href = data.url;
    } else {
      const err = await upload.json().catch(() => null);
      alert(err?.error || "Upload failed");
    }
  }

  return (
    <main className="p-4 flex justify-center">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>Add Paper</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input
              placeholder="DOI"
              value={doi}
              onChange={(e) => setDoi(e.target.value)}
              required
            />
            <Input
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              required
            />
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
