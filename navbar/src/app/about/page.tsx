import Link from "next/link";
import Navbar from "@/components/navbar/navbar";

const aboutLinks = [
  { label: "Team", href: "/about/team" },
  { label: "History", href: "/about/history" },
  { label: "Approach", href: "/about/approach" },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(15,23,42,0.08),transparent_35%),linear-gradient(180deg,rgba(248,250,252,1),rgba(241,245,249,1))] text-foreground dark:bg-[radial-gradient(circle_at_top,rgba(148,163,184,0.18),transparent_35%),linear-gradient(180deg,rgba(2,6,23,1),rgba(15,23,42,1))]">
      <Navbar sticky variant="glass" />
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col justify-center gap-10 px-6 py-16 lg:flex-row lg:items-center">
        <div className="max-w-2xl space-y-6">
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">About</p>
          <h1 className="font-heading text-5xl leading-tight text-foreground dark:text-white md:text-7xl">
            A small navbar with clearer routes and stronger context.
          </h1>
          <p className="max-w-xl text-lg leading-8 text-muted-foreground">
            This section explains who the project is for, how it is structured, and why the navigation is designed to keep the user oriented.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3 lg:w-[28rem]">
          {aboutLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-3xl border border-border bg-background/80 p-5 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-lg"
            >
              <span className="block text-sm font-semibold text-foreground">{link.label}</span>
              <span className="mt-2 block text-sm leading-6 text-muted-foreground">
                Open the {link.label.toLowerCase()} page.
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}