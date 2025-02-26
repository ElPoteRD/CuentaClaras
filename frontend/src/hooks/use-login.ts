import { useState } from "react";
import { authLogin } from "../service/auth-service";
import { toast } from "sonner";
import useStore from "@/context/useStore";
import { AxiosError } from "axios";
import { ILoginForm, IUserProfile } from "@/entities/auth";

interface LoginResponse {
  success: boolean;
  user?: IUserProfile;
  error?: string;
}

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const { login, logout } = useStore();
  const [error, setError] = useState<string | null>(null);

  const loginProcess = async (request: ILoginForm): Promise<LoginResponse> => {
    setLoading(true);
    setError(null);

    try {
      const { access_token, user } = await authLogin(request);
      
      // Store in localStorage
      localStorage.setItem(
        "login-token",
        JSON.stringify({ access_token, user })
      );

      // Update global state
      login({ ...user, token: access_token });

      toast.success("¡Bienvenido!", {
        description: `Inicio de sesión exitoso`,
      });

      return { success: true, user };

    } catch (error) {
      let errorMessage = "Error al iniciar sesión";
      
      if (error instanceof AxiosError) {
        errorMessage = error.response?.status === 401 
          ? "Credenciales inválidas"
          : error.message || "Error al conectar con el servidor";
      }

      setError(errorMessage);
      toast.error("Error", {
        description: errorMessage,
      });

      return { success: false, error: errorMessage };

    } finally {
      setLoading(false);
    }
  };

  const logoutSession = () => {
    localStorage.removeItem("login-token");
    logout();
  };

  const loadSession = (): boolean => {
    const storedData = localStorage.getItem("login-token");
    
    if (!storedData) {
      logout();
      return false;
    }

    try {
      const { access_token, user } = JSON.parse(storedData);
      login({ ...user, token: access_token });
      return true;
    } catch {
      logout();
      return false;
    }
  };

  return {
    loading,
    error,
    loginProcess,
    logoutSession,
    loadSession,
  };
};
