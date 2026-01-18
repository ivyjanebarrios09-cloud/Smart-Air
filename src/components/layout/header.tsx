"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 md:static md:h-auto md:border-0 md:bg-transparent md:px-6">
      <SidebarTrigger className="hidden md:flex" />
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/image/logo.png"
          alt="Smart Air Logo"
          width={32}
          height={32}
        />
        <span className="text-xl font-bold">Smart Air</span>
      </Link>
    </header>
  );
}
