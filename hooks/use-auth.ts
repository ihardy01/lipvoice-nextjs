// hooks/use-auth.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/services/auth.service";
import { LoginPayload } from "@/types/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient(); // Sử dụng để quản lý cache

  return useMutation({
    mutationFn: (data: LoginPayload) => authApi.login(data),
    onSuccess: () => {
      toast.success("Đăng nhập thành công!");
      // LÀM MỚI NGAY: Xóa cache cũ và fetch lại profile mới
      queryClient.invalidateQueries({ queryKey: ["profile"] });

      router.push("/");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Đăng nhập thất bại");
    },
  });
};

export const useProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: () => authApi.getProfile(),
    retry: false,
    staleTime: 5 * 60 * 1000, // Giữ dữ liệu trong 5 phút
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSettled: () => {
      // Xóa toàn bộ cache liên quan đến profile và set lại về null
      queryClient.setQueryData(["profile"], null);
      queryClient.removeQueries({ queryKey: ["profile"] });

      toast.success("Đăng xuất thành công");
      router.push("/login");
    },
  });
};
