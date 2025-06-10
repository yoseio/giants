import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <nav className="border-b p-4 flex gap-4 items-center justify-between">
      <Link href="/" className="font-semibold">
        Paper Manager
      </Link>
      <form action="/search" className="flex-1 max-w-md ml-auto">
        <Input name="q" placeholder="Search papers" />
      </form>
      <Button asChild>
        <Link href="/papers/add">Add Paper</Link>
      </Button>
    </nav>
  );
}
