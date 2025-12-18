"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLogin } from "@/hooks/use-auth";
import { loginSchema, LoginInput } from "@/lib/schema";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: login, isPending } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginInput) => {
    login(data);
  };

  return (
    <div className="flex items-center justify-center bg-background pt-15 px-4">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-2xl shadow-lg border border-purple-100">
        <div className="flex flex-col items-center text-center space-y-2">
          <Link href="/">
            <Image
              src="/lipvoice.png"
              alt="LipVoice Logo"
              width={180}
              height={60}
              priority
            />
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Chào mừng trở lại
          </h1>
          <p className="text-sm text-muted-foreground">
            Nhập email và mật khẩu để đăng nhập
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              {...register("email")}
              type="text"
              placeholder="name@example.com"
              className={
                errors.email
                  ? "border-red-500"
                  : "bg-gray-50 focus-visible:ring-[#DD00AC]"
              }
              disabled={isPending}
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Mật khẩu</label>
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-[#DD00AC] hover:underline"
              >
                Quên mật khẩu?
              </Link>
            </div>
            <div className="relative">
              <Input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className={
                  errors.password
                    ? "border-red-500"
                    : "bg-gray-50 pr-10 focus-visible:ring-[#DD00AC]"
                }
                disabled={isPending}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full h-11 bg-gradient-to-r from-[#DD00AC] to-[#410093]"
            disabled={isPending}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? "Đang xử lý..." : "Đăng nhập"}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-muted-foreground">
              Hoặc đăng nhập với
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          type="button"
          className="w-full h-11 gap-2 hover:bg-gray-50"
          disabled={isPending}
          onClick={() => alert("Chức năng đang phát triển")}
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Google
        </Button>

        <div className="text-center text-sm">
          Chưa có tài khoản?{" "}
          <Link
            href="/register"
            className="font-semibold text-[#DD00AC] hover:underline"
          >
            Đăng ký ngay
          </Link>
        </div>
      </div>
    </div>
  );
}
