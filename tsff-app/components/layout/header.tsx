"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ThemeToggle from "./theme-toggle";
import { useAuth } from "@/context/AuthContext";
import { User } from "lucide-react";

export default function Header() {
  const { user, loading } = useAuth();

  return (
    <header className="bg-background border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <span className="text-2xl font-bold text-primary">Logo</span>
            </Link>
            <nav className="hidden md:block ml-10">
              <ul className="flex space-x-4">
                <li>
                  <Link href="/" className="text-foreground hover:text-primary">
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/seriespill"
                    className="text-foreground hover:text-primary"
                  >
                    Seriespill
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services"
                    className="text-foreground hover:text-primary"
                  >
                    Services
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-foreground hover:text-primary"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
          <div className="hidden md:flex items-center space-x-2">
            {loading ? (
              <p>Loading...</p>
            ) : user ? (
              <Link href={`/profile/${user.id}`}>
                <Button variant="ghost" size="icon">
                  <User className="w-6 h-6" />
                </Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button>Sign In</Button>
              </Link>
            )}

            <ThemeToggle />
          </div>
          <div className="md:hidden flex items-center space-x-2">
            <Button variant="ghost" size="icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
