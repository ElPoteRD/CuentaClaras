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
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

// Actualizar el esquema de validación
const profileFormSchema = z.object({
  firstName: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }).optional(),
  lastName: z.string().min(2, {
    message: "El apellido debe tener al menos 2 caracteres.",
  }).optional(),
  email: z.string().email({
    message: "Por favor ingresa un email válido.",
  }),
  avatar: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema> & { token?: string };

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [isImageChanged, setIsImageChanged] = useState(false);
  const { profile, updateProfile } = useProfile();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: profile?.firstName || "",
      lastName: profile?.lastName || "",
      email: profile?.email || "",
      avatar: profile?.avatar || ""
    },
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        email: profile.email || "",
        avatar: profile?.avatar || ""
      });
    }
  }, [profile, form]);

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      const storedData = localStorage.getItem("login-token");
      if (!storedData) {
        toast.error("No hay sesión activa");
        return;
      }

      const parsedData = JSON.parse(storedData);
      if (!parsedData.access_token || !parsedData.user?.id) {
        toast.error("Datos de sesión inválidos");
        return;
      }

      // Verificar si hay cambios reales
      const hasChanges = form.formState.isDirty || isImageChanged;
      if (!hasChanges) {
        toast.error("No hay cambios para guardar");
        return;
      }

      // Crear objeto con los datos actualizados
      const updateData = {
        id: parsedData.user.id, // Usar el ID del usuario almacenado
        firstName: data.firstName?.trim() || "",
        lastName: data.lastName?.trim() || "",
        email: data.email.trim(),
        avatar: data.avatar,
      };

      // Validar datos requeridos
      if (!updateData.email) {
        toast.error("El email es requerido");
        return;
      }

      const updated = await updateProfile({
        ...updateData,
        token: parsedData.access_token,
      });

      if (updated) {
        toast.success("Perfil actualizado exitosamente");
        setIsEditing(false);
        setIsImageChanged(false);
        form.reset(updated);
      }
    } catch (err) {
      if (err instanceof Error) {
        toast.error(`Error al actualizar el perfil: ${err.message}`);
      } else {
        toast.error("Error al actualizar el perfil");
      }
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-4">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage
                    alt={`${profile?.firstName || 'Usuario'}`}
                    src={profile?.avatar || "/placeholder-avatar.jpg"}
                  />
                  <AvatarFallback>
                    {profile?.firstName?.charAt(0)}{profile?.lastName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>
                    {profile?.firstName} {profile?.lastName}
                  </CardTitle>
                  <CardDescription>{profile?.email}</CardDescription>
                </div>
                <Button
                  variant="outline"
                  className="ml-auto"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? "Cancelar" : "Editar perfil"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={!isEditing}
                            placeholder="Tu nombre"
                          />
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
                          <Input
                            {...field}
                            disabled={!isEditing}
                            placeholder="Tu apellido"
                          />
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
                          <Input
                            {...field}
                            disabled={!isEditing}
                            type="email"
                            placeholder="tu@email.com"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {isEditing && (
                    <Button
                      type="submit"
                      disabled={(!form.formState.isDirty && !isImageChanged) || form.formState.isSubmitting}
                    >
                      {form.formState.isSubmitting ? "Guardando..." : "Guardar cambios"}
                    </Button>
                  )}
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
