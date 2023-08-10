import { useCustomToast } from "@/hooks/useCustomToast";
import { toast } from "@/hooks/useToast";
import { UsernameRequest } from "@/lib/validators/username";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";

export const useUpdateUsername = () => {
  const router = useRouter();
  const { loginToast } = useCustomToast();

  return useMutation({
    mutationFn: async (payload: UsernameRequest) => {
      const { data } = await axios.patch("/api/username", payload);

      return data;
    },
    onSuccess: () => {
      router.refresh();

      return toast({
        title: "Name updated",
        description: "Your username has been updated.",
        variant: "default",
      });
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 409) {
          return toast({
            title: "Name already taken",
            description: "Please choose another name.",
            variant: "destructive",
          });
        }
        if (error.response?.status === 422) {
          return toast({
            title: "Invalid name",
            description: "Please choose a name between 3 and 32 characters.",
            variant: "destructive",
          });
        }
        if (error.response?.status === 401) {
          return loginToast();
        }
      }

      return toast({
        title: "An error occurred",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });
};
