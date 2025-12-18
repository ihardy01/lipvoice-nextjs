"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { registerSchema, RegisterInput } from "@/lib/schema";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, touchedFields },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    mode: "onChange", // Validation realtime
  });

  const passwordValue = watch("password", "");

  const validations = {
    length: passwordValue.length >= 8,
    lowercase: /[a-z]/.test(passwordValue),
    uppercase: /[A-Z]/.test(passwordValue),
    number: /[0-9]/.test(passwordValue),
    special: /[^A-Za-z0-9]/.test(passwordValue),
  };

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true);
    setTimeout(() => {
      console.log("Đăng ký thành công:", data);
      setIsLoading(false);
      alert("Đăng ký thành công!");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-md space-y-6 bg-white p-8 rounded-2xl shadow-lg border border-purple-100">
        <div className="flex flex-col items-center text-center">
          <Link href="/">
            <Image
              src="/lipvoice.png"
              alt="LipVoice Logo"
              width={150}
              height={50}
            />
          </Link>
          <h1 className="text-2xl font-bold mt-2">Tạo tài khoản mới</h1>
          <p className="text-sm text-muted-foreground">
            Trải nghiệm chuyển đổi văn bản thành giọng nói AI
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Họ và tên</label>
            <Input
              {...register("name")}
              placeholder="Nguyễn Văn A"
              className={errors.name ? "border-red-500" : "bg-gray-50"}
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Email</label>
            <Input
              {...register("email")}
              type="email"
              placeholder="name@example.com"
              className={errors.email ? "border-red-500" : "bg-gray-50"}
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Mật khẩu</label>
            <div className="relative">
              <Input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu"
                className={
                  errors.password ? "border-red-500" : "bg-gray-50 pr-10"
                }
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Xác nhận mật khẩu</label>
            <Input
              {...register("confirmPassword")}
              type="password"
              placeholder="Nhập lại mật khẩu"
              className={
                errors.confirmPassword ? "border-red-500" : "bg-gray-50"
              }
            />
            {errors.confirmPassword && (
              <p className="text-xs text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Hiển thị checklist khi đã nhập hoặc chạm vào ô mật khẩu */}
          {(touchedFields.password || passwordValue) && (
            <div className="text-xs space-y-1 bg-gray-50 p-3 rounded-md">
              <p className="font-semibold text-gray-600 mb-1">
                Yêu cầu mật khẩu:
              </p>
              <ValidationItem
                isValid={validations.length}
                text="Tối thiểu 8 ký tự"
              />
              <ValidationItem
                isValid={validations.lowercase}
                text="Ít nhất 1 chữ thường"
              />
              <ValidationItem
                isValid={validations.uppercase}
                text="Ít nhất 1 chữ hoa"
              />
              <ValidationItem
                isValid={validations.number}
                text="Ít nhất 1 số"
              />
              <ValidationItem
                isValid={validations.special}
                text="Ít nhất 1 ký tự đặc biệt"
              />
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 bg-gradient-to-r from-[#DD00AC] to-[#410093]"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Đăng ký
          </Button>
        </form>

        <div className="text-center text-sm">
          Đã có tài khoản?{" "}
          <Link
            href="/login"
            className="font-semibold text-[#DD00AC] hover:underline"
          >
            Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
}

function ValidationItem({ isValid, text }: { isValid: boolean; text: string }) {
  return (
    <div
      className={cn(
        "flex items-center gap-2",
        isValid ? "text-green-600" : "text-muted-foreground",
      )}
    >
      {isValid ? (
        <Check className="h-3 w-3" />
      ) : (
        <div className="h-1.5 w-1.5 rounded-full bg-gray-300 ml-1 mr-0.5" />
      )}
      <span>{text}</span>
    </div>
  );
}
