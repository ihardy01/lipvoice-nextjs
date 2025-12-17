// hooks/use-auth.ts
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/services/auth.service";
import { LoginPayload, AuthError } from "@/types/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";

export const useLogin = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: LoginPayload) => authApi.login(data),
    onSuccess: (data) => {
      // toast.success sẽ hiện màu xanh lá cây (nhờ richColors)
      toast.success("Đăng nhập thành công!", {
        description: "Chào mừng bạn quay trở lại.",
        duration: 3000, // Tự tắt sau 3 giây
      });

      // Lưu token & User info
      localStorage.setItem("accessToken", data.metadata.accessToken);
      localStorage.setItem("refreshToken", data.metadata.refreshToken);
      localStorage.setItem("user", JSON.stringify(data.metadata.user));

      router.push("/");
    },
    onError: (error: AxiosError<AuthError>) => {
      const errorData = error.response?.data;

      // toast.error sẽ hiện màu đỏ (nhờ richColors)
      toast.error("Đăng nhập thất bại", {
        description: errorData?.message || "Vui lòng kiểm tra lại thông tin.",
        duration: 4000,
      });
    },
  });
};
