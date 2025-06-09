import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function Header() {
  return (
    <header className="bg-amber-700 text-white p-4">
      <nav className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">CCPROS</h1>
        <ul className="flex gap-4 items-center">
          <li>
            <Link href="/" className="hover:underline">
              Home
            </Link>
          </li>
          <li>
            <Link href="/about" className="hover:underline">
              About
            </Link>
          </li>
          <SignedOut>
            <li>
              <Link href="/sign-in" className="hover:underline">
                Sign In
              </Link>
            </li>
          </SignedOut>
          <SignedIn>
            <li>
              <Link href="/dashboard" className="hover:underline">
                Dashboard
              </Link>
            </li>
            <li>
              <UserButton afterSignOutUrl="/" />
            </li>
          </SignedIn>
        </ul>
      </nav>
    </header>
  );
}
