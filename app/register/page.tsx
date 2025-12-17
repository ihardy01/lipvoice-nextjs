"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, Check, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [touched, setTouched] = useState(false);

  // Logic validate mật khẩu
  const validations = {
    length: formData.password.length >= 8,
    lowercase: /[a-z]/.test(formData.password),
    uppercase: /[A-Z]/.test(formData.password),
    number: /[0-9]/.test(formData.password),
    special: /[^A-Za-z0-9]/.test(formData.password),
    match: formData.password && formData.password === formData.confirmPassword,
  };

  const isFormValid =
    Object.values(validations).every(Boolean) &&
    formData.name &&
    formData.email;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsLoading(true);
    // Giả lập call API
    setTimeout(() => {
      setIsLoading(false);
      alert("Đăng ký thành công!");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-md space-y-6 bg-white p-8 rounded-2xl shadow-lg border border-purple-100">
        {/* Logo & Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <Link href="/">
            <Image
              src="/lipvoice.png"
              alt="LipVoice Logo"
              width={150}
              height={50}
              className="mb-2"
            />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            Tạo tài khoản mới
          </h1>
          <p className="text-sm text-muted-foreground">
            Trải nghiệm chuyển đổi văn bản thành giọng nói AI
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tên */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Họ và tên</label>
            <Input
              name="name"
              placeholder="Nguyễn Văn A"
              value={formData.name}
              onChange={handleChange}
              className="bg-gray-50"
            />
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Email</label>
            <Input
              name="email"
              type="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              className="bg-gray-50"
            />
          </div>

          {/* Mật khẩu */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Mật khẩu</label>
            <div className="relative">
              <Input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu"
                value={formData.password}
                onChange={(e) => {
                  handleChange(e);
                  setTouched(true);
                }}
                className="bg-gray-50 pr-10"
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
          </div>

          {/* Nhập lại mật khẩu */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Xác nhận mật khẩu</label>
            <Input
              name="confirmPassword"
              type="password"
              placeholder="Nhập lại mật khẩu"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={cn(
                "bg-gray-50",
                formData.confirmPassword &&
                  !validations.match &&
                  "border-red-500 focus-visible:ring-red-500",
              )}
            />
          </div>

          {/* Validation Checklist */}
          {touched && (
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
              <ValidationItem
                isValid={
                  validations.match && formData.confirmPassword.length > 0
                }
                text="Mật khẩu khớp nhau"
              />
            </div>
          )}

          <Button
            type="submit"
            disabled={!isFormValid || isLoading}
            className="w-full h-11 text-base bg-gradient-to-r from-[#DD00AC] to-[#410093] hover:from-[#FF00EE] hover:to-[#7130c3] transition-all"
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

// Component con hiển thị trạng thái validation
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
