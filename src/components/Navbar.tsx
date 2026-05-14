"use client";

import { useCurrentUser } from "@/hook/use-current-user";
import Link from "next/link";
import { FaSearch } from "@/components/icons";
import { cn } from "@/lib/utils";
import Logo from "@/components/logo";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
const Search = dynamic(() => import("./Search"), { ssr: false, loading: () => <div className="w-full h-8 bg-gray-100 animate-pulse border border-gray-200" /> });
const UserDropdown = dynamic(() => import("./navbar/UserDropdown").then(m => m.UserDropdown), { ssr: false, loading: () => <div className="w-8 h-8 bg-gray-200 animate-pulse rounded-full" /> });

// Lazy-load so the ticker's tRPC fetch doesn't block Navbar hydration
const NewsTicker = dynamic(
  () => import("./blog/NewsTicker").then((m) => ({ default: m.NewsTicker })),
  { ssr: false, loading: () => <div className="bg-black h-8" /> }
);

const NAV_LINKS = [
  { name: "Trang chủ", path: "/" },
  { name: "Danh Mục", path: "/tags" },
  { name: "Về chúng tôi", path: "/about" },
];

const Navbar = () => {
  const user = useCurrentUser();
  const pathname = usePathname();

  return (
    <header className="bg-white w-full sticky top-0 z-50 transition-all duration-300 border-b-2 border-black max-w-[100vw]">
      {/* Top Tier */}
      <div className="border-b border-black">
        <div className="max-w-7xl mx-auto px-4 min-[375px]:px-6 md:px-8 w-full flex items-center justify-between h-14 md:h-16">
          {/* Left: Search */}
          <div className="flex-1 flex items-center justify-start">
            <div className="hidden md:block w-56">
              <Search />
            </div>
            <Link
              href="/search"
              className={cn(
                "md:hidden flex items-center justify-center w-8 h-8 border border-black hover:bg-black hover:text-white transition-colors",
                pathname === "/search" && "bg-black text-white"
              )}
            >
              <FaSearch className="w-3.5 h-3.5" aria-label="Search" />
            </Link>
          </div>

          {/* Center: Logo */}
          <div className="flex-shrink-0 flex items-center justify-center">
            <Logo />
          </div>

          {/* Right: User / Auth */}
          <div className="flex-1 flex items-center justify-end gap-2 md:gap-3">
            {user ? (
              <UserDropdown user={user} />
            ) : (
              <Link
                href="/auth/signin"
                className={cn(
                  "px-4 py-1.5 text-[10px] md:text-xs font-bold uppercase tracking-wider text-black border border-black rounded-none hover:bg-black hover:text-white transition-colors h-8 flex items-center justify-center",
                  pathname === "/auth/signin" && "bg-black text-white"
                )}
              >
                Đăng Nhập
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Tier: Category Navigation (Desktop) */}
      <div className="hidden md:block bg-white border-b border-black">
        <nav
          className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-center space-x-12 py-2.5"
          aria-label="Category navigation"
        >
          {NAV_LINKS.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "text-[10px] md:text-[11px] font-bold uppercase tracking-[0.15em] text-black hover:underline underline-offset-[4px] decoration-1 transition-all",
                pathname === item.path && "underline"
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* News Ticker */}
      <NewsTicker />
    </header>
  );
};

export default Navbar;