import Link from "next/link";
import Navbar from "@/components/navbar/navbar";

export default function ApproachPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar sticky variant="glass" />
      <section className="mx-auto max-w-4xl px-6 py-16">
        <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">About / Approach</p>
        <h1 className="mt-4 font-heading text-4xl text-foreground md:text-6xl">Approach page</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
          A route for the approach link inside the About hover card. Use it to describe design choices, process, or product philosophy.
        </p>
        <div className="mt-10 flex gap-4">
          <Link href="/about" className="rounded-full border border-border px-5 py-3 text-sm font-medium transition-colors hover:bg-accent">Back to About</Link>
        </div>
      </section>
    </main>
  );
}