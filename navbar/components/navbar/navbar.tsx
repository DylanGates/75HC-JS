import Link from "next/link";
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

export default function Navbar({
    sticky = false,
    transparent = false,
    darkMode = false,
    variant = "default"
}) {

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
            <nav className="w-full h-16 bg-gray-800 text-white flex items-center justify-between px-4">

            </nav>
        </>
    );
};