import Link from "next/link";
import Navbar from "@/components/navbar/navbar";

const contactLinks = [
  { label: "Support", href: "/contact/support" },
  { label: "FAQ", href: "/contact/faq" },
  { label: "Office", href: "/contact/office" },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.12),transparent_35%),linear-gradient(180deg,rgba(255,255,255,1),rgba(248,250,252,1))] text-foreground dark:bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.15),transparent_35%),linear-gradient(180deg,rgba(2,6,23,1),rgba(15,23,42,1))]">
      <Navbar sticky variant="glass" />
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col justify-center gap-10 px-6 py-16 lg:flex-row lg:items-center">
        <div className="max-w-2xl space-y-6">
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Contact</p>
          <h1 className="font-heading text-5xl leading-tight text-foreground dark:text-white md:text-7xl">
            Contact paths with direct routes and quick answers.
          </h1>
          <p className="max-w-xl text-lg leading-8 text-muted-foreground">
            This section supports support, FAQ, and office pages so the hover card can point to real content instead of dead ends.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3 lg:w-[28rem]">
          {contactLinks.map((link) => (
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