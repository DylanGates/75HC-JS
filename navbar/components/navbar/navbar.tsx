'use client';

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { tv } from 'tailwind-variants';
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";

type NavExtraLink = {
    label: string;
    href: string;
};

type NavItem = {
    name: string;
    href: string;
    description: string;
    image: string;
    extraLinks: NavExtraLink[];
};


const navlinks: NavItem[] = [
    {
        name: "Home",
        href: "/",
        description: "Jump back to the landing page",
        image: "/about-preview.svg",
        extraLinks: [],
    },
    {
        name: "About",
        href: "/about",
        description: "See the story behind the project",
        image: "/about-preview.svg",
        extraLinks: [
            { label: "Team", href: "/about/team" },
            { label: "History", href: "/about/history" },
            { label: "Approach", href: "/about/approach" },
        ],
    },
    {
        name: "Contact",
        href: "/contact",
        description: "Send a quick message or request",
        image: "/contact-preview.svg",
        extraLinks: [
            { label: "Support", href: "/contact/support" },
            { label: "FAQ", href: "/contact/faq" },
            { label: "Office", href: "/contact/office" },
        ],
    }
];

interface NavbarProps {
    sticky?: boolean;
    transparent?: boolean;
    variant?: "default" | "glass";
}

const navbarVariants = tv({
    base: "w-full h-16 flex items-center justify-between px-4 md:px-8 transition-all duration-300",
    variants: {
        position: {
            sticky: "fixed top-0 z-50",
            relative: "relative",
        },
        variant: {
            default: "bg-background/95 text-foreground border-b border-border",
            glass: "bg-background/80 backdrop-blur-md text-foreground border-b border-border",
        },
        transparent: {
            true: "bg-transparent text-foreground dark:text-white",
            false: ""
        }
    },
    compoundVariants: [
        {
            transparent: true,
            scrolled: false,
            class: "bg-transparent text-foreground dark:text-white",
        },
        {
            position: "sticky",
            scrolled: true,
            class: "shadow-lg",
        },
        {
            position: "sticky",
            scrolled: true,
            variant: "glass",
            class: "bg-background/90",
        },
        {
            position: "sticky",
            scrolled: true,
            variant: "default",
            class: "bg-background/95",
        },
    ],
    defaultVariants: {
        position: "relative",
        variant: "default",
        scrolled: false,
        transparent: false,
    },
});

export default function Navbar({
    sticky = false,
    transparent = false,
    variant = "default"
}: NavbarProps) {

    const [isOpen, setIsOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [shareLabel, setShareLabel] = useState("Share");
    const { theme, setTheme } = useTheme();
    const [isScrolled, setIsScrolled] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [isNavVisible, setIsNavVisible] = useState(true);
    const pathname = usePathname();
    const mobileMenuId = "navbar-mobile-menu";
    const lastScrollTop = useRef(0);

    const isActiveLink = (href: string) => pathname === href;

    const themeToggle = () => {
        setTheme(theme === "system" ? "light" : theme === "light" ? "dark" : "system");
    };

    const themeLabel = theme === "dark" ? "Dark" : theme === "light" ? "Light" : "System";

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const closeMenu = () => {
        setIsOpen(false);
    };

    const closeSearch = () => {
        setIsSearchOpen(false);
        setSearchQuery("");
    };

    const shareCurrentPage = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setShareLabel("Copied");
            window.setTimeout(() => setShareLabel("Share"), 1400);
        } catch {
            setShareLabel("Copy failed");
            window.setTimeout(() => setShareLabel("Share"), 1400);
        }
    };

    const filteredNavlinks = navlinks.filter((link) => {
        const value = `${link.name} ${link.description}`.toLowerCase();
        return value.includes(searchQuery.toLowerCase().trim());
    });
    
    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

            setIsScrolled(scrollTop > 0);
            setScrollProgress(Math.min(100, Math.max(0, progress)));

            if (isOpen || isSearchOpen) {
                setIsNavVisible(true);
                lastScrollTop.current = scrollTop;
                return;
            }

            const scrollingDown = scrollTop > lastScrollTop.current;
            setIsNavVisible(!(scrollingDown && scrollTop > 120));
            lastScrollTop.current = scrollTop;
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    useEffect(() => {
        if (sticky && isScrolled) {
            document.documentElement.classList.add("sticky");
        } else {
            document.documentElement.classList.remove("sticky");
        }
    }, [isScrolled, sticky]);

    useEffect(() => {
        closeMenu();
        closeSearch();
    }, [pathname]);

    useEffect(() => {
        const handleKeyboard = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                closeMenu();
                closeSearch();
            }

            if (
                event.key === "/" &&
                document.activeElement === document.body &&
                !isOpen
            ) {
                event.preventDefault();
                setIsSearchOpen(true);
            }
        };

        if (isOpen || isSearchOpen) {
            document.body.style.overflow = "hidden";
            window.addEventListener("keydown", handleKeyboard);
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", handleKeyboard);
        };
    }, [isOpen, isSearchOpen]);

    return(
        <>
            <div
                className="fixed left-0 top-0 z-60 h-1 bg-linear-to-r from-primary via-foreground to-primary transition-[width] duration-200 md:h-0.5"
                style={{ width: `${scrollProgress}%` }}
                aria-hidden="true"
            />
            <nav
                className={cn(
                    navbarVariants({
                        position: sticky ? "sticky" : "relative",
                        variant: variant,
                        transparent: transparent,
                    }),
                    sticky && isScrolled && "h-14 bg-background/90 shadow-xl backdrop-blur-xl",
                    sticky && !isNavVisible && "-translate-y-full"
                )}
            >
                <div className="flex items-center gap-3">
                    <Link href="/" className="text-xl font-bold tracking-tight text-foreground dark:text-white">
                        MyLogo
                    </Link>
                </div>

                <div className="hidden md:flex items-center gap-6">
                    {navlinks.map((link) => (
                        <HoverCard key={link.href} openDelay={120} closeDelay={80}>
                            <HoverCardTrigger asChild>
                                <Link
                                    href={link.href}
                                    aria-current={isActiveLink(link.href) ? "page" : undefined}
                                    className={`text-sm font-medium transition-colors ${isActiveLink(link.href) ? "text-foreground dark:text-white" : "text-foreground/75 hover:text-foreground dark:text-white/80 dark:hover:text-white"}`}
                                >
                                    <span className="inline-flex items-center gap-2">
                                        {link.name}
                                        {isActiveLink(link.href) && (
                                            <span className="h-1.5 w-1.5 rounded-full bg-current" />
                                        )}
                                    </span>
                                </Link>
                            </HoverCardTrigger>
                            <HoverCardContent className="w-72 rounded-2xl border border-border bg-background/95 shadow-xl">
                                <div className="flex gap-4">
                                    <div className="w-24 shrink-0 space-y-3">
                                        <Image
                                            src={link.image}
                                            alt={`${link.name} preview`}
                                            width={40}
                                            height={40}
                                            className="h-10 w-10 rounded-xl border border-border object-cover"
                                        />
                                        <div className="space-y-1">
                                            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                                Navigation
                                            </p>
                                            <h4 className="text-sm font-semibold text-foreground">
                                                {link.name}
                                            </h4>
                                            <p className="text-xs leading-5 text-muted-foreground">
                                                {link.description}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="min-w-0 flex-1 space-y-2">
                                        {link.extraLinks.length > 0 ? (
                                            <>
                                                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                                    Extra links
                                                </p>
                                                {link.extraLinks.map((extraLink) => (
                                                    <Link
                                                        key={extraLink.href}
                                                        href={extraLink.href}
                                                        className="block rounded-xl border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                                                    >
                                                        {extraLink.label}
                                                    </Link>
                                                ))}
                                            </>
                                        ) : (
                                            <div className="flex h-full flex-col justify-end gap-2">
                                                <p className="text-sm leading-6 text-muted-foreground">
                                                    Open the main page for this section.
                                                </p>
                                                <Button asChild size="sm" className="mt-2 rounded-full">
                                                    <Link href={link.href}>Open page</Link>
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </HoverCardContent>
                        </HoverCard>
                    ))}
                </div>

                <div className="flex items-center gap-2 md:gap-4">
                    <Button
                        variant="outline"
                        onClick={themeToggle}
                        className="hidden md:inline-flex rounded-full border-border bg-background/70 px-4 text-foreground hover:bg-accent transition-colors"
                    >
                        Theme: {themeLabel}
                    </Button>
                    <Button asChild variant="default" className="hidden md:inline-flex">
                        <Link href="/contact">Get Started</Link>
                    </Button>
                    <Button
                        variant="outline"
                        onClick={shareCurrentPage}
                        className="hidden md:inline-flex rounded-full border-border bg-background/70 px-4 text-foreground hover:bg-accent transition-colors"
                    >
                        {shareLabel}
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => setIsSearchOpen(true)}
                        className="hidden md:inline-flex rounded-full border-border bg-background/70 px-4 text-foreground hover:bg-accent transition-colors"
                    >
                        Search /
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                        onClick={toggleMenu}
                        aria-expanded={isOpen}
                        aria-controls={mobileMenuId}
                        aria-label="Toggle mobile menu"
                    >
                        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </Button>
                </div>

            </nav>

            {isOpen && (
                <div
                    className="fixed inset-0 top-16 z-40 bg-black/50 md:hidden"
                    onClick={closeMenu}
                    aria-hidden="true"
                />
            )}

            {isSearchOpen && (
                <div
                    className="fixed inset-0 top-16 z-50 flex items-start justify-center bg-black/50 px-4 pt-4"
                    onClick={closeSearch}
                    aria-hidden="true"
                >
                    <div
                        className="w-full max-w-xl rounded-3xl border border-border bg-background/95 p-4 text-foreground shadow-2xl"
                        onClick={(event) => event.stopPropagation()}
                        role="dialog"
                        aria-modal="true"
                        aria-label="Quick navigation search"
                    >
                        <input
                            autoFocus
                            value={searchQuery}
                            onChange={(event) => setSearchQuery(event.target.value)}
                            placeholder="Search navigation..."
                            className="mb-4 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none ring-0 placeholder:text-muted-foreground"
                        />
                        <div className="space-y-2">
                            {filteredNavlinks.length > 0 ? (
                                filteredNavlinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={closeSearch}
                                        className="flex items-center justify-between rounded-2xl border border-border px-4 py-3 text-sm transition-colors hover:bg-accent"
                                    >
                                        <span>
                                            <span className="block font-medium text-foreground">{link.name}</span>
                                            <span className="block text-xs text-muted-foreground">{link.description}</span>
                                        </span>
                                        <span className="text-xs text-muted-foreground">Open</span>
                                    </Link>
                                ))
                            ) : (
                                <p className="rounded-2xl border border-dashed border-border px-4 py-6 text-sm text-muted-foreground">
                                    No matches found.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div
                id={mobileMenuId}
                className={`fixed left-0 right-0 top-16 z-50 border-b border-white/10 bg-gray-900 text-white shadow-2xl transition-all duration-300 md:hidden ${isOpen ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"}`}
            >
                <div className="flex flex-col gap-2 p-4">
                    {navlinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={closeMenu}
                            aria-current={isActiveLink(link.href) ? "page" : undefined}
                            className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-medium transition-colors ${isActiveLink(link.href) ? "border-white/30 bg-white/15 text-white" : "border-white/10 hover:bg-white/10"}`}
                        >
                            <span className="inline-flex items-center gap-2">
                                {link.name}
                                {isActiveLink(link.href) && (
                                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                                )}
                            </span>
                            <span className="text-xs text-white/50">Open</span>
                        </Link>
                    ))}

                    <div className="mt-2 flex gap-3">
                        <Button
                            variant="outline"
                            onClick={themeToggle}
                            className="flex-1 rounded-2xl border-white/20 bg-white/5 text-white hover:bg-white/10"
                        >
                            Theme: {themeLabel}
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => setIsSearchOpen(true)}
                            className="flex-1 rounded-2xl border-white/20 bg-white/5 text-white hover:bg-white/10"
                        >
                            Search
                        </Button>
                        <Button
                            variant="outline"
                            onClick={shareCurrentPage}
                            className="flex-1 rounded-2xl border-white/20 bg-white/5 text-white hover:bg-white/10"
                        >
                            {shareLabel}
                        </Button>
                        <Button
                            asChild
                            variant="default"
                            className="flex-1 rounded-2xl"
                        >
                            <Link href="/contact" onClick={closeMenu}>
                                Get Started
                            </Link>
                        </Button>
                    </div>

                    <div className="rounded-2xl border border-white/10 px-4 py-3 text-xs leading-5 text-white/60">
                        Press / to search, Esc to close, and swipe down to dismiss.
                    </div>
                </div>
            </div>

            {sticky && <div className={isScrolled ? "h-14" : "h-16"}></div>}
        </>
    );
};