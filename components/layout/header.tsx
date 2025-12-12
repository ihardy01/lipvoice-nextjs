"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef } from "react";
import {
  Menu,
  User,
  LogOut,
  History,
  CreditCard,
  Lock,
  LogIn,
  Zap,
  Star,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import Image from "next/image";

// MOCK DATA
const MOCK_USER_STATE = {
  isLoggedIn: false,
  name: "Hardy Developer",
  tokens: 1250,
  avatarUrl: "/user-avatar.svg",
};

const NAV_ITEMS = [
  { label: "Trang chủ", href: "/" },
  { label: "Text to Speech", href: "/text-to-speech" },
  { label: "Voice Cloning", href: "/voice-cloning" },
  { label: "Thanh Toán", href: "/pricing" },
  { label: "Đăng nhập", href: "/login" },
];

export default function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // --- LOGIC HOVER DROPDOWN (Đã sửa lỗi nháy) ---
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    // Xóa timer đóng menu nếu chuột quay lại kịp
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsUserMenuOpen(true);
  };

  const handleMouseLeave = () => {
    // Tăng thời gian chờ lên 300ms để người dùng kịp di chuột qua khoảng trống
    timerRef.current = setTimeout(() => {
      setIsUserMenuOpen(false);
    }, 300);
  };
  // -----------------------------

  const user = MOCK_USER_STATE.isLoggedIn
    ? MOCK_USER_STATE
    : {
        name: "Khách",
        tokens: 0,
        avatarUrl: "/user-avatar.svg",
        isLoggedIn: false,
      };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* --- LEFT: LOGO --- */}
        <div className="flex items-center gap-2 mr-4">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="Logo" width={103} height={35} />
          </Link>
        </div>

        {/* --- MIDDLE: NAVIGATION (Desktop) --- */}
        <nav className="hidden md:flex items-center gap-8 text-[#65676b] font-medium">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "transition-colors whitespace-nowrap",
                  isActive ? "text-[#FF3BD4]" : " hover:text-[#FF3BD4]",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* --- RIGHT: ACTIONS & AVATAR --- */}
        <div className="flex items-center gap-4">
          <Button
            size="lg"
            className="hidden sm:flex gap-2 bg-linear-to-r from-[#DD00AC] to-[#410093] hover:from-[#FF00EE] hover:to-[#7130c3] rounded-full"
          >
            Nâng cấp
            <Star />
          </Button>

          {/* User Dropdown */}
          {/* Thêm modal={false} để tránh block sự kiện chuột */}
          <DropdownMenu
            open={isUserMenuOpen}
            onOpenChange={setIsUserMenuOpen}
            modal={false}
          >
            {/* Wrapper Trigger */}
            <div
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className="py-4 px-2" // Tăng vùng đệm (padding) để dễ hover hơn
            >
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                    <AvatarFallback>
                      {user.name ? user.name.charAt(0) : "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
            </div>

            <DropdownMenuContent
              className="w-64"
              align="end"
              forceMount
              sideOffset={5} // Giữ menu gần trigger hơn
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user.name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground mt-1">
                    Token còn lại:{" "}
                    <span className="font-bold text-primary">
                      {user.tokens.toLocaleString()}
                    </span>
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              {user.isLoggedIn ? (
                <>
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <History className="mr-2 h-4 w-4" />
                      <span>Lịch sử sử dụng</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <CreditCard className="mr-2 h-4 w-4" />
                      <span>Lịch sử giao dịch</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>Thông tin người dùng</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Lock className="mr-2 h-4 w-4" />
                      <span>Đổi mật khẩu</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600 focus:text-red-600 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Đăng xuất</span>
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/login"
                      className="w-full cursor-pointer font-semibold text-primary"
                    >
                      <LogIn className="mr-2 h-4 w-4" />
                      <span>Đăng nhập ngay</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* --- MOBILE MENU --- */}
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle className="text-left flex items-center gap-2">
                    <div className="w-6 h-6 bg-primary rounded flex items-center justify-center text-xs text-primary-foreground">
                      LV
                    </div>
                    Menu
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 mt-8">
                  {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          "text-lg font-medium py-2 border-b transition-colors",
                          isActive
                            ? "text-primary border-primary"
                            : "text-foreground border-muted hover:text-primary",
                        )}
                      >
                        {item.label}
                      </Link>
                    );
                  })}

                  <Button className="w-70 gap-2 mt-4 bg-linear-to-r from-[#DD00AC] to-[#410093] rounded-full flex justify-center">
                    Nâng cấp
                    <Star />
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
