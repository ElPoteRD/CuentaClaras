import { useState, useEffect } from "react";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import useStore from "@/context/useStore";
import { useLogin } from "./use-login";
import { UserEntity } from "@/entities/user";
import { getDataProfile, updateProfile } from "@/service/profile-service";
import { IUserProfile } from "@/entities/auth";

export const useProfile = () => {
  const [profile, setProfile] = useState<UserEntity | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { logout } = useStore();
  const { logoutSession, loadSession } = useLogin();
  const navigate = useNavigate();

  useEffect(() => {
    getProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getProfile = async () => {
    setIsLoading(true);
    try {
      const storedToken = localStorage.getItem("login-token");
      if (!storedToken) {
        loadSession();
        return; 
      }
      // Parseamos el token almacenado
      const tokenData = JSON.parse(storedToken);
      const accessToken = tokenData.access_token;

      if (!accessToken) {
        throw new Error("No se encontró un token de acceso válido");
      }
      // Hacemos la petición con el token
      const response = await getDataProfile(accessToken);
      // Actualizamos el estado con los datos del perfil
      setProfile(response.data);
      setError(false);
      setErrorMessage(null);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          // Si el token expiró, cerramos la sesión
          logoutSession();
          logout();
          toast.error("Su sesión ha expirado");
          navigate("/login");
        } else {
          setError(true);
          setErrorMessage(error.message);
          toast.error("Error al obtener el perfil", {
            description: error.message,
          });
        }
      } else {
        // Error que no es de Axios
        setError(true);
        setErrorMessage(
          error instanceof Error ? error.message : "Error desconocido"
        );
        toast.error("Error al obtener el perfil");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async (
    profileData: IUserProfile & { token: string; Id: number }
  ) => {
    setIsLoading(true);
    try {
      // Validar que exista el token
      const storedData = localStorage.getItem("login-token");
      if (!storedData) {
        throw new Error("No hay sesión activa");
      }

      const parsedToken = JSON.parse(storedData);
      if (!parsedToken.access_token) {
        throw new Error("Token inválido");
      }
      // Validar que el ID coincida con el usuario actual
      if (!parsedToken.user?.id) {
        throw new Error("ID de usuario no encontrado");
      }
      // Extraer solo los campos necesarios para la actualización
      const updateData = {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        email: profileData.email,
        avatar: profileData.avatar,
      };
      // Usar el token del localStorage
      const response = await updateProfile(
        updateData,
        parsedToken.access_token,
        parsedToken.user.id
      );
      if (response.data) {
        setProfile(response.data);
        setError(false);
        setErrorMessage(null);
        return response.data;
      }
      throw new Error("Error al actualizar el perfil");
    } catch (error) {
      setError(true);
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          logoutSession();
          logout();
          navigate("/login");
          throw new Error("Su sesión ha expirado");
        }
        setErrorMessage(error.response?.data?.message || error.message);
        throw new Error(
          error.response?.data?.message || "Error al actualizar el perfil"
        );
      }
      setErrorMessage(
        error instanceof Error ? error.message : "Error desconocido"
      );
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  return {
    profile,
    isLoading,
    error,
    errorMessage,
    updateProfile: handleUpdateProfile,
    refreshProfile: getProfile,
  };
};
