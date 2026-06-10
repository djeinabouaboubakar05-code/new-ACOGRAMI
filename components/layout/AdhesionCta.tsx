"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function AdhesionCta() {
  const pathname = usePathname();
  if (pathname !== "/") return null;

  return (
    <Link
      href="/adhesion"
      className="rounded bg-[#D97736] px-10 py-3.5 font-bold text-white transition hover:bg-[#b86129] text-base"
    >
      Adhérer à l&apos;association
    </Link>
  );
}
