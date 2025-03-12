import { useState, useCallback } from "react";
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

interface StoredAuthData {
  access_token: string;
  user: IUserProfile;
  expiry: number;
}

export const useLogin = () => {
  const { login, logout } = useStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  
  const loginProcess = async (request: ILoginForm): Promise<LoginResponse> => {
    setLoading(true);
    setError(null);

    try {
      // Primero, asegurarse de limpiar cualquier sesión anterior
      await logoutSession();

      const { access_token, user } = await authLogin(request);

      // Preparar datos para almacenar con tiempo de expiración
      const authData: StoredAuthData = {
        access_token,
        user,
        expiry: new Date().getTime() + 24 * 60 * 60 * 1000, // 24 horas
      };

      // Store in localStorage
      localStorage.setItem("login-token", JSON.stringify(authData));

      // Update global state
      login({ ...user, token: access_token });

      toast.success("¡Bienvenido!", {
        description: `Inicio de sesión exitoso como ${user.firstName}`,
      });

      return { success: true, user };
    } catch (error) {
      let errorMessage = "Error al iniciar sesión";

      if (error instanceof AxiosError) {
        errorMessage =
          error.response?.status === 401
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

  const logoutSession = useCallback(async () => {
    try {
      // Obtener datos del usuario actual antes de eliminar
      const storedData = localStorage.getItem("login-token");
      if (storedData) {
        const { user } = JSON.parse(storedData) as StoredAuthData;
        // Mostrar mensaje de despedida si hay un usuario
        if (user?.firstName) {
          toast.info("¡Hasta pronto!", {
            description: `Sesión cerrada: ${user.firstName}`,
          });
        }
      }

      // Limpiar localStorage
      localStorage.removeItem("login-token");

      // Limpiar estado global
      logout();

      return true;
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Error al cerrar sesión", {
        description: "No se pudo cerrar la sesión correctamente",
      });
      return false;
    }
  }, [logout]);

  const loadSession = useCallback((): boolean => {
    const storedData = localStorage.getItem("login-token");

    if (!storedData) {
      logout();
      return false;
    }

    try {
      const { access_token, user, expiry } = JSON.parse(
        storedData
      ) as StoredAuthData;

      // Verificar si la sesión ha expirado
      if (expiry && new Date().getTime() > expiry) {
        toast.warning("Sesión expirada", {
          description: "Por favor, inicia sesión nuevamente",
        });
        logoutSession();
        return false;
      }

      login({ ...user, token: access_token });
      return true;
    } catch (error) {
      console.error("Error loading session:", error);
      logoutSession();
      return false;
    }
  }, [login, logout, logoutSession]);

  // Función para verificar si hay una sesión activa
  const hasActiveSession = (): boolean => {
    const storedData = localStorage.getItem("login-token");
    if (!storedData) return false;

    try {
      const { expiry } = JSON.parse(storedData) as StoredAuthData;
      return expiry > new Date().getTime();
    } catch {
      return false;
    }
  };

  return {
    login,
    loading,
    error,
    loginProcess,
    logoutSession,
    loadSession,
    hasActiveSession,
  };
};
