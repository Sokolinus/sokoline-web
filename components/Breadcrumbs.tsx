"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import React from "react";

const Breadcrumbs = () => {
  const pathname = usePathname();
  
  // Don't show breadcrumbs on the homepage
  if (pathname === "/") return null;

  const pathSegments = pathname.split("/").filter((segment) => segment !== "");
  
  const breadcrumbs = [
    { name: "Home", link: "/" },
    ...pathSegments.map((segment, index) => {
      const link = `/${pathSegments.slice(0, index + 1).join("/")}`;
      const name = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
      return { name, link };
    }),
  ];

  return (
    <nav className="w-full border-b border-black/5 bg-white/95 px-4 py-4 backdrop-blur sm:px-6 sm:py-5">
      <ol className="mx-auto flex w-full max-w-7xl items-center gap-2 overflow-x-auto whitespace-nowrap font-sans text-base text-black sm:text-lg md:text-xl">
        {breadcrumbs.map((path, index) => (
          <li key={index} className="flex items-center gap-2">
            {index > 0 && <span className="opacity-40">{`/`}</span>}
            <Link
              href={path.link}
              className={`hover:text-black/60 transition-colors ${
                index === breadcrumbs.length - 1 ? "font-bold" : "font-normal"
              }`}
            >
              {path.name}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
