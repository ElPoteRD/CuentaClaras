import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useProfile } from "@/hooks/use-profile";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Layout from "../Layout";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

// Definición de la interfaz para los valores del formulario
interface ProfileFormValues {
  firstName?: string;
  lastName?: string;
  email: string;
  avatar?: string;
}

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { profile: user, updateProfile } = useProfile();
  
  // Configuración del formulario con validación personalizada
  const form = useForm<ProfileFormValues>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      avatar: ""
    },
    // Validación personalizada
    validate: (values) => {
      const errors: Record<string, string> = {};
      
      if (values.firstName && values.firstName.length < 2) {
        errors.firstName = "El nombre debe tener al menos 2 caracteres.";
      }
      
      if (values.lastName && values.lastName.length < 2) {
        errors.lastName = "El apellido debe tener al menos 2 caracteres.";
      }
      
      if (!values.email) {
        errors.email = "El email es requerido.";
      } else if (!/\S+@\S+\.\S+/.test(values.email)) {
        errors.email = "Por favor ingresa un email válido.";
      }
      
      return Object.keys(errors).length === 0 ? true : errors;
    }
  });
  
  // Cargar datos del perfil
  useEffect(() => {
    if (user) {
      form.reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        avatar: user.avatar || ""
      });
    }
  }, [user, form]);

  const handleCancel = () => {
    setIsEditing(false);
    if (user) {
      form.reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        avatar: user.avatar || ""
      });
    }
  };
  
  const onSubmit = async (data: ProfileFormValues) => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      const updatedProfile = {
        ...user,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        avatar: data.avatar
      };
      
      await updateProfile(updatedProfile);
      
      toast.success("Perfil actualizado correctamente");
      setIsEditing(false);
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
      toast.error("Error al actualizar el perfil");
    } finally {
      setIsLoading(false);
    }
  };

  // Obtener las iniciales para el avatar fallback
  const getInitials = () => {
    if (!user) return "U";
    
    const firstInitial = user.firstName?.[0] || "";
    const lastInitial = user.lastName?.[0] || "";
    
    return (firstInitial + lastInitial).toUpperCase() || "U";
  };

  return (
    <Layout>
      <div className="container mx-auto py-10">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Perfil de Usuario</CardTitle>
            <CardDescription>
              Gestiona tu información personal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center mb-6">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={user?.avatar || ""} alt={user?.firstName || "Usuario"} />
                <AvatarFallback>{getInitials()}</AvatarFallback>
              </Avatar>
              {!isEditing && (
                <div className="text-center">
                  <h3 className="text-lg font-medium">
                    {user?.firstName} {user?.lastName}
                  </h3>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
              )}
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {isEditing ? (
                  <>
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre</FormLabel>
                          <FormControl>
                            <Input placeholder="Tu nombre" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Apellido</FormLabel>
                          <FormControl>
                            <Input placeholder="Tu apellido" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="tu@ejemplo.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="avatar"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>URL de Avatar</FormLabel>
                          <FormControl>
                            <Input placeholder="https://ejemplo.com/avatar.jpg" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end space-x-2 pt-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={handleCancel}
                        disabled={isLoading}
                      >
                        Cancelar
                      </Button>
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Guardando..." : "Guardar cambios"}
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-end">
                    <Button type="button" onClick={() => setIsEditing(true)}>
                      Editar perfil
                    </Button>
                  </div>
                )}
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

