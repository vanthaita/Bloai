"use client";

import Link from "next/link";
import { FaSignOutAlt, FaPenAlt, FaUser } from "@/components/icons";
import { signOut } from "next-auth/react";
import { useRef, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserDropdownProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function UserDropdown({ user }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative flex gap-x-2 items-center" ref={dropdownRef}>
      <Button
        asChild
        className={cn(
          "bg-white text-black border border-black hover:bg-black hover:text-white rounded-none transition-all shadow-none h-8 px-4 font-bold uppercase tracking-wider text-[10px] md:text-xs",
          pathname === "/new-post" && "bg-black text-white"
        )}
      >
        <Link href="/new-post">
          <FaPenAlt className="w-3 h-3" />
          <span className="hidden sm:inline ml-2">Viết Bài</span>
        </Link>
      </Button>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-8 h-8 border border-black rounded-none hover:bg-black hover:text-white transition-all group p-0"
        aria-label="User menu"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <Avatar className="w-full h-full rounded-none">
          <AvatarImage
            src={user.image || "https://res.cloudinary.com/dq2z27agv/image/upload/q_auto,f_webp,w_auto/v1746885273/y3hpblcst5qn3j5aah1l.svg"}
            alt={user.name || "User avatar"}
            className="object-cover"
            onError={(e) => { e.currentTarget.style.display = "none"; }}
          />
          <AvatarFallback className="bg-transparent rounded-none text-black font-bold group-hover:text-white transition-colors flex items-center justify-center w-full h-full text-[10px]">
            {user.name ? (
              user.name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase()
            ) : (
              <FaUser className="w-3 h-3" />
            )}
          </AvatarFallback>
        </Avatar>
      </button>

      {isOpen && (
        <div
          className="absolute top-full right-0 mt-2 w-48 bg-white shadow-none border border-black divide-y divide-black z-[100]"
          role="menu"
        >
          <div className="px-3 py-2 bg-black text-white">
            <p className="text-[11px] font-bold uppercase tracking-wider truncate">{user.name}</p>
            <p className="text-[10px] text-gray-400 truncate mt-0.5">{user.email}</p>
          </div>
          <div>
            <button
              onClick={() => signOut()}
              className="flex w-full items-center px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-black hover:bg-gray-100 transition-colors"
            >
              <FaSignOutAlt className="w-3 h-3 mr-2" />
              Đăng xuất
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
