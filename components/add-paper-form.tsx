"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const schema = z.object({
  doi: z.string().min(1, "Required"),
  title: z.string().min(1, "Required"),
  year: z
    .string()
    .optional()
    .refine((val) => !val || !Number.isNaN(Number(val)), {
      message: "Must be a number",
    }),
  authors: z.string().min(1, "Required"),
  abstract: z.string().optional(),
  pdf: z
    .custom<FileList>()
    .refine((files) => files instanceof FileList && files.length === 1, {
      message: "PDF is required",
    }),
});

type FormValues = {
  doi: string;
  title: string;
  year?: string;
  authors: string;
  abstract?: string;
  pdf: FileList;
};

export function AddPaperForm() {
  const [submitting, setSubmitting] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      doi: "",
      title: "",
      year: "",
      authors: "",
      abstract: "",
      pdf: undefined as unknown as FileList,
    },
  });

  async function onSubmit(values: FormValues) {
    const data = new FormData();
    data.append("doi", values.doi);
    data.append("title", values.title);
    if (values.year) data.append("year", values.year);
    data.append("authors", values.authors);
    if (values.abstract) data.append("abstract", values.abstract);
    data.append("pdf", values.pdf[0]);

    setSubmitting(true);
    try {
      const res = await fetch("/api/papers/add", {
        method: "POST",
        body: data,
      });
      if (!res.ok) {
        const json = await res.json();
        toast.error(json.error || "Failed to submit");
      } else {
        const json = await res.json();
        toast.success("Pull request created");
        if (json.url) {
          window.location.href = json.url;
        }
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
        encType="multipart/form-data"
      >
        <FormField
          control={form.control}
          name="doi"
          render={({ field }) => (
            <FormItem>
              <FormLabel>DOI</FormLabel>
              <FormControl>
                <Input placeholder="DOI" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="year"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Year</FormLabel>
              <FormControl>
                <Input placeholder="Year" type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="authors"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Authors</FormLabel>
              <FormControl>
                <Input placeholder="Authors (comma separated)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="abstract"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Abstract</FormLabel>
              <FormControl>
                <Textarea placeholder="Abstract" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="pdf"
          render={({ field }) => (
            <FormItem>
              <FormLabel>PDF</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => field.onChange(e.target.files)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={submitting}>
          {submitting && <Loader2 className="animate-spin" />}
          {submitting ? "Submitting..." : "Save"}
        </Button>
      </form>
    </Form>
  );
}
