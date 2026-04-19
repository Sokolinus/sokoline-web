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
    <nav className="w-full bg-white flex items-center justify-center px-[10px] py-[24px]">
      <ol className="flex items-center gap-2 font-sans text-[24px] text-black">
        {breadcrumbs.map((path, index) => (
          <li key={index} className="flex items-center gap-2">
            {index > 0 && <span className="opacity-60">{`>`}</span>}
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
