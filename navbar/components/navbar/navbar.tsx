import Link from "next/link";
import { tv } from 'tailwind-variants';
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
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
    darkMode?: boolean;
    variant?: "default" | "glass";
}

const navbarVariants = tv({
    base: "w-full h-16 flex items-center justify-between px-4 transition-colors duration-300",
    variants: {
        position: {
            sticky: "fixed top-0 z-50",
            relative: "relative",
        },
        variant: {
            default: "bg-gray-800 text-white",
            glass: "bg-white/30 backdrop-blur-md text-gray-800"
        },
        transparent: {
            true: "bg-transparent",
            false: ""
        },
        darkMode: {
            true: "dark",
            false: ""
        }
    },
    compoundVariants: [
    // Transparent variant when not scrolled
        {
            transparent: true,
            scrolled: false,
            class: "bg-transparent text-white",
        },
        // Sticky scrolled effects
        {
            position: "sticky",
            scrolled: true,
            class: "shadow-lg",
        },
        {
            position: "sticky",
            scrolled: true,
            variant: "glass",
            class: "bg-white/95",
        },
        {
            position: "sticky",
            scrolled: true,
            variant: "default",
            class: "bg-gray-900",
        },
    ],
    defaultVariants: {
        position: "relative",
        variant: "default",
        scrolled: false,
        transparent: false,
        darkMode: false,
    },
});

export default function Navbar({
    sticky = false,
    transparent = false,
    darkMode = false,
    variant = "default"
}: NavbarProps) {

    const [isOpen, setIsOpen] = useState(false);
    const { theme, setTheme } = useTheme();
    const [isScrolled, setIsScrolled] = useState(false);

    const themeToggle = () => {
        setTheme(theme === "light" ? "dark" : "light");
    };

    const toggleMenu = () => {
        setIsOpen(!isOpen);
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

    return(
        <>
            <nav
                className={navbarVariants({
                    position: sticky ? "sticky" : "relative",
                    variant: variant,
                    transparent: transparent,
                    darkMode: darkMode
                })}
            >
                {/* Logo Section */}
                <div className="text-xl font-bold">
                    <Link href="/">MyLogo</Link>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex space-x-4">
                    {navlinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="hover:text-blue-500 transition-colors"
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* Theme Toggle & CTA Button */}
                <div className="flex items-center space-x-4">
                    <button
                        onClick={themeToggle}
                        className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                    >
                        {theme === "light" ? "🌙" : "☀️"}
                    </button>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">
                        Get Started
                    </button>
                </div>

            </nav>
        </>
    );
};