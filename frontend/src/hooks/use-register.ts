import { IRegisterForm } from "@/entities/auth";
import { authRegister } from "@/service/auth-service";
import { toast } from "sonner";

export const register = async (userData: IRegisterForm) => {
  try {
    await authRegister(userData);
    toast("Cuenta creada exitosamente", {
      description: `su cuenta ${userData.email} ha sido creada exitosamente`,
      action: {
        label: "Ok",
        onClick: () => {},
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      toast("Hubo un error creando su cuenta", {
        description: error.message,
        action: {
          label: "Ok",
          onClick: () => {},
        },
      });
    }
  }
  return{ success: true };
};
