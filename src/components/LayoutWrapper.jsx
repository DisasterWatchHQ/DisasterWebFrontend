'use client'

import { usePathname } from "next/navigation";

export default function LayoutWrapper({ children, header, footer }) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith('/auth');

  return (
    <>
      {!isAuthPage && header}
      <main className="flex-grow container min-w-full">
        {children}
      </main>
      {!isAuthPage && footer}
    </>
  );
}