"use client";

import { useState } from "react";
import { useForm, UseFormRegisterReturn, FieldError } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { changePasswordSchema, type ChangePasswordInput } from "@/lib/schema";
import { useChangePassword } from "@/hooks/use-auth";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  isPasswordSet: boolean;
}

interface PasswordInputProps {
  label: string;
  id: string;
  show: boolean;
  setShow: (show: boolean) => void;
  error?: FieldError; // Error có thể có hoặc không
  registration: UseFormRegisterReturn; // Type chuẩn từ react-hook-form
}

export function ChangePasswordModal({
  isOpen,
  onClose,
  isPasswordSet,
}: ChangePasswordModalProps) {
  const { mutate, isPending } = useChangePassword();

  // State quản lý hiển thị mật khẩu cho 3 ô
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      isPasswordSet: isPasswordSet, // Truyền vào để Zod nhận biết
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: ChangePasswordInput) => {
    // Chuẩn bị payload dựa trên việc đã có mật khẩu hay chưa
    const payload = isPasswordSet
      ? {
          old_password: data.oldPassword,
          new_password: data.newPassword,
        }
      : {
          new_password: data.newPassword,
        };

    mutate(payload, {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  };

  // Helper component cho Input mật khẩu có icon eye
  const PasswordInput = ({
    label,
    id,
    show,
    setShow,
    error,
    registration,
  }: PasswordInputProps) => (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <div className="relative">
        <Input
          id={id}
          type={show ? "text" : "password"}
          className="pr-10"
          {...registration}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {error && <p className="text-xs text-red-500">{error.message}</p>}
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Đổi mật khẩu</DialogTitle>
          <DialogDescription>
            Nhập thông tin bên dưới để cập nhật mật khẩu mới.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          {/* MẬT KHẨU CŨ */}
          {isPasswordSet && (
            <PasswordInput
              label="Mật khẩu hiện tại"
              id="oldPassword"
              show={showOld}
              setShow={setShowOld}
              error={errors.oldPassword}
              registration={register("oldPassword")}
            />
          )}

          {/* MẬT KHẨU MỚI */}
          <PasswordInput
            label="Mật khẩu mới"
            id="newPassword"
            show={showNew}
            setShow={setShowNew}
            error={errors.newPassword}
            registration={register("newPassword")}
          />

          {/* XÁC NHẬN MẬT KHẨU */}
          <PasswordInput
            label="Xác nhận mật khẩu mới"
            id="confirmPassword"
            show={showConfirm}
            setShow={setShowConfirm}
            error={errors.confirmPassword}
            registration={register("confirmPassword")}
          />

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-[#FF3BD4] hover:bg-[#D432B0]"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
