import useStore from "@/context/useStore";
import { UserEntity } from "@/entities/user";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { getDataProfile } from "@/service/profile-service";
import { useLogin } from "@/hooks/use-login";
import { useNavigate } from "react-router-dom";

import { toast } from "sonner";

export const useProfile = () => {
  const [profile, setProfile] = useState<UserEntity | null>(null);
  const { data, logout } = useStore();
  const { logoutSession } = useLogin();
  const {loadSession} = useLogin()
  const navigate = useNavigate();

  useEffect(() => {
    getProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getProfile = async () => {
    try {
      const existToken = JSON.parse(
        localStorage.getItem("login-token") ?? ""
      );

      if(!data?.token) loadSession()

      if (existToken) {
        const res = await getDataProfile(data?.token ?? existToken.access_token);
        setProfile(res.data);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.status === 401) {
            console.log(error)
          logoutSession();
          logout();
          toast.error(`Su sesión a expirado`);
          navigate("/login");
        } else {
          toast.error("Error", { description: error.message });
        }
      }
    }
  };

  return { profile };
};
