import { z } from "zod";

/**
 * Quy tắc validation cho mật khẩu dùng chung:
 * - Ít nhất 8 ký tự
 * - Ít nhất 1 chữ thường
 * - Ít nhất 1 chữ hoa
 * - Ít nhất 1 con số
 * - Ít nhất 1 ký tự đặc biệt
 */
export const passwordValidation = z
  .string()
  .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
  .regex(/[a-z]/, "Cần ít nhất 1 chữ cái thường")
  .regex(/[A-Z]/, "Cần ít nhất 1 chữ cái hoa")
  .regex(/[0-9]/, "Cần ít nhất 1 chữ số")
  .regex(/[^A-Za-z0-9]/, "Cần ít nhất 1 ký tự đặc biệt (ví dụ: @, #, $, ...)");

/**
 * Schema cho Form Đổi mật khẩu
 */
export const changePasswordSchema = z
  .object({
    oldPassword: z.string().optional(), // Sẽ xử lý logic yêu cầu hay không ở component tùy theo is_password
    newPassword: passwordValidation,
    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu mới"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"], // Hiển thị lỗi tại ô confirmPassword
  });

/**
 * Schema cho Form Đăng ký (Tái sử dụng passwordValidation)
 */
export const registerSchema = z
  .object({
    name: z.string().min(2, "Họ tên phải có ít nhất 2 ký tự"),
    email: z.string().email("Email không hợp lệ"),
    password: passwordValidation,
    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

// Export các type để sử dụng với React Hook Form
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
