"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef } from "react";
import { Menu, User, LogOut, History, Lock, LogIn, Star } from "lucide-react";
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
import { useProfile, useLogout } from "@/hooks/use-auth";
import { ChangePasswordModal } from "@/components/modals/change-password-modal";

const NAV_ITEMS = [
  { label: "Trang chủ", href: "/" },
  { label: "Text to Speech", href: "/text-to-speech" },
  { label: "Voice Cloning", href: "/voice-cloning" },
  { label: "Thanh Toán", href: "/pricing" },
];

export default function Header() {
  const pathname = usePathname();
  const [isChangePassOpen, setIsChangePassOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: profileData, isLoading } = useProfile();
  const logoutMutation = useLogout();

  const isLoggedIn =
    !!profileData?.metadata && profileData.metadata.role === "customer";
  const isPasswordSet = profileData?.metadata?.is_password ?? true;
  const user = {
    name: profileData?.metadata?.name || "Khách hàng",
    tokens: profileData?.metadata?.token || 0,
    avatarUrl: "/user-avatar.svg",
  };

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsUserMenuOpen(true);
  };

  const handleMouseLeave = () => {
    timerRef.current = setTimeout(() => setIsUserMenuOpen(false), 300);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Mobile Menu & Logo Group */}
        <div className="flex items-center gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="Logo"
              width={103}
              height={35}
              priority
            />
          </Link>
        </div>

        {/* Navigation - Desktop (Giữ nguyên) */}
        <nav className="hidden md:flex items-center gap-8 text-[#65676b] font-medium">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={
                pathname === item.href
                  ? "text-[#FF3BD4]"
                  : "hover:text-[#FF3BD4]"
              }
            >
              {item.label}
            </Link>
          ))}

          {!isLoading && !isLoggedIn && (
            <Link
              href="/login"
              className={
                pathname === "/login"
                  ? "text-[#FF3BD4]"
                  : "hover:text-[#FF3BD4]"
              }
            >
              Đăng nhập
            </Link>
          )}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Desktop Upgrade Button (Giữ nguyên) */}
          <Button
            size="lg"
            className="hidden md:flex gap-2 bg-linear-to-r from-[#DD00AC] to-[#410093] rounded-full"
          >
            Nâng cấp <Star className="w-4 h-4" />
          </Button>

          {/* User Avatar Dropdown */}
          <DropdownMenu
            open={isUserMenuOpen}
            onOpenChange={setIsUserMenuOpen}
            modal={false}
          >
            <div
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className="py-2"
            >
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full"
                >
                  <Avatar className="h-10 w-10 border border-pink-100">
                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
            </div>

            <DropdownMenuContent
              className="w-64"
              align="end"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-bold">{user.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Token:{" "}
                    <span className="font-bold text-[#FF3BD4]">
                      {user.tokens.toLocaleString()}
                    </span>
                  </p>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              {isLoggedIn ? (
                <>
                  <DropdownMenuGroup>
                    <DropdownMenuItem className="cursor-pointer">
                      <History className="mr-2 h-4 w-4" />{" "}
                      <span>Lịch sử sử dụng</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />{" "}
                      <span>Thông tin cá nhân</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => setIsChangePassOpen(true)}
                    >
                      <Lock className="mr-2 h-4 w-4" />{" "}
                      <span>Đổi mật khẩu</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-600 cursor-pointer"
                    onClick={() => logoutMutation.mutate()}
                    disabled={logoutMutation.isPending}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>
                      {logoutMutation.isPending ? "Đang xử lý..." : "Đăng xuất"}
                    </span>
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem asChild>
                  <Link
                    href="/login"
                    className="w-full flex items-center font-semibold text-[#FF3BD4]"
                  >
                    <LogIn className="mr-2 h-4 w-4" /> <span>Đăng nhập</span>
                  </Link>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-[300px] sm:w-[350px] flex flex-col"
            >
              <SheetHeader className="text-left pb-6 border-b">
                <SheetTitle>
                  <Image
                    src="/logo.png"
                    alt="Logo"
                    width={100}
                    height={34}
                    priority
                  />
                </SheetTitle>
              </SheetHeader>

              <div className="flex flex-col flex-1 gap-6 mt-6">
                {/* Navigation Links */}
                <nav className="flex flex-col gap-2">
                  {NAV_ITEMS.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "text-lg font-medium px-4 py-3 rounded-lg transition-colors",
                        pathname === item.href
                          ? "bg-pink-50 text-[#FF3BD4]"
                          : "text-[#65676b] hover:bg-gray-50 hover:text-[#FF3BD4]",
                      )}
                    >
                      {item.label}
                    </Link>
                  ))}
                  {!isLoading && !isLoggedIn && (
                    <Link
                      href="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "text-lg font-medium px-4 py-3 rounded-lg transition-colors",
                        pathname === "/login"
                          ? "bg-pink-50 text-[#FF3BD4]"
                          : "text-[#65676b] hover:bg-gray-50 hover:text-[#FF3BD4]",
                      )}
                    >
                      Đăng nhập
                    </Link>
                  )}
                </nav>

                {/* Mobile Upgrade Button */}
                <div className="px-4 mt-auto pb-8">
                  <Button
                    size="lg"
                    className="w-full gap-2 bg-linear-to-r from-[#DD00AC] to-[#410093] rounded-full text-white"
                  >
                    Nâng cấp <Star className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <ChangePasswordModal
        isOpen={isChangePassOpen}
        onClose={() => setIsChangePassOpen(false)}
        isPasswordSet={isPasswordSet}
      />
    </header>
  );
}
