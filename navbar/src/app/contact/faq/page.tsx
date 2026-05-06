import Link from "next/link";
import Navbar from "@/components/navbar/navbar";

export default function FaqPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar sticky variant="glass" />
      <section className="mx-auto max-w-4xl px-6 py-16">
        <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Contact / FAQ</p>
        <h1 className="mt-4 font-heading text-4xl text-foreground md:text-6xl">FAQ page</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
          Use this page for the common questions linked from the Contact hover card so visitors can self-serve before reaching out.
        </p>
        <div className="mt-10 flex gap-4">
          <Link href="/contact" className="rounded-full border border-border px-5 py-3 text-sm font-medium transition-colors hover:bg-accent">Back to Contact</Link>
        </div>
      </section>
    </main>
  );
}