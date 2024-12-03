// components/Header.js
import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-gray-900 text-white p-4">
      <nav className="flex justify-between">
        <Link href="/" className="text-lg font-bold">DisasterWatch</Link>
        <div className="space-x-4">
          <Link href="/map">Map</Link>
          <Link href="/feed">Feed</Link>
          <Link href="/guides">Guides</Link>
          <Link href="/resources">Resources</Link>
          <Link href="/profile">Profile</Link>
          <Link href="/login">Sign In</Link>
          <Link href="/register">Sign Up</Link>
        </div>
      </nav>
    </header>
  );
}
