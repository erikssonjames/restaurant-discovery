"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface LinkActiveButtonProps {
    item: {
        label: string;
        href: string;
    };
}

function isCurrentRoute(pathname: string, href: string) {
  return (
    pathname === href ||
    (href !== "/" && pathname.startsWith(`${href}/`))
  );
}

export function LinkActiveButton({ item }: LinkActiveButtonProps) {
  const pathname = usePathname();
    const active = isCurrentRoute(pathname, item.href);

    return (
        <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
            >
            {item.label}
        </Link>
    )
}