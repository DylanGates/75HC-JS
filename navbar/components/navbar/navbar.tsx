'use client';

import Link from "next/link";
import { tv } from 'tailwind-variants';
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";


const navlinks = [
    {
        name: "Home",
        href: "/"
    },
    {
        name: "About",
        href: "/about"
    },
    {
        name: "Contact",
        href: "/contact"
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
    const { theme, setTheme } = useTheme();
    const [isScrolled, setIsScrolled] = useState(false);
    const mobileMenuId = "navbar-mobile-menu";

    const themeToggle = () => {
        setTheme(theme === "light" ? "dark" : "light");
    };

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const closeMenu = () => {
        setIsOpen(false);
    };
    
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };

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
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                closeMenu();
            }
        };

        if (isOpen) {
            document.body.style.overflow = "hidden";
            window.addEventListener("keydown", handleEscape);
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen]);

    return(
        <>
            <nav
                className={navbarVariants({
                    position: sticky ? "sticky" : "relative",
                    variant: variant,
                    transparent: transparent,
                })}
            >
                <div className="flex items-center gap-3">
                    <Link href="/" className="text-xl font-bold tracking-tight text-foreground dark:text-white">
                        MyLogo
                    </Link>
                </div>

                <div className="hidden md:flex items-center gap-6">
                    {navlinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-sm font-medium text-foreground/75 transition-colors hover:text-foreground dark:text-white/80 dark:hover:text-white"
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                <div className="flex items-center gap-2 md:gap-4">
                    <Button
                        variant="outline"
                        onClick={themeToggle}
                        className="hidden md:inline-flex rounded-full border-border bg-background/70 px-4 text-foreground hover:bg-accent transition-colors"
                    >
                        {theme === "light" ? "Dark" : "Light"}
                    </Button>
                    <Button variant="default" className="hidden md:inline-flex">
                        Get Started
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
                            className="flex items-center justify-between rounded-2xl border border-white/10 px-4 py-3 text-sm font-medium transition-colors hover:bg-white/10"
                        >
                            <span>{link.name}</span>
                            <span className="text-xs text-white/50">Open</span>
                        </Link>
                    ))}

                    <div className="mt-2 flex gap-3">
                        <Button
                            variant="outline"
                            onClick={themeToggle}
                            className="flex-1 rounded-2xl border-white/20 bg-white/5 text-white hover:bg-white/10"
                        >
                            {theme === "light" ? "Dark mode" : "Light mode"}
                        </Button>
                        <Button
                            variant="default"
                            className="flex-1 rounded-2xl"
                            onClick={closeMenu}
                        >
                            Get Started
                        </Button>
                    </div>
                </div>
            </div>

            {sticky && <div className="h-16"></div>}
        </>
    );
};