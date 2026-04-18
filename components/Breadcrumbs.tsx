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
    <nav className="flex px-4 md:px-10 py-4 text-[10px] md:text-xs uppercase tracking-widest text-gray-400 dark:text-zinc-500 font-sans max-w-7xl mx-auto transition-colors duration-300">
      {breadcrumbs.map((path, index) => (
        <div key={index} className="flex items-center">
          <Link
            href={path.link}
            className={`hover:text-black dark:hover:text-white transition-colors ${
              index === breadcrumbs.length - 1 ? "text-[#7C3AED] dark:text-[#A855F7] font-bold" : ""
            }`}
          >
            {path.name}
          </Link>
          {index < breadcrumbs.length - 1 && (
            <span className="mx-2 text-gray-300 dark:text-zinc-800">/</span>
          )}
        </div>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
