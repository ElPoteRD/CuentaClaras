import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import Layout from "../Layout";
import useStore from "@/context/useStore";

const configSchema = z.object({
  currency: z.string({
    required_error: "Por favor selecciona una moneda.",
  }),
  language: z.string({
    required_error: "Por favor selecciona un idioma.",
  }),
  darkMode: z.boolean().default(false),
  notifications: z.boolean().default(true),
  weeklyReport: z.boolean().default(true),
  accentColor: z.string().default("blue"),
});

export default function Configuration() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { data: user } = useStore();

  const form = useForm<z.infer<typeof configSchema>>({
    resolver: zodResolver(configSchema),
    defaultValues: {

      currency: "",
      language: "es",
      darkMode: false,
      notifications: true,
      weeklyReport: true,
      accentColor: "blue",
    },
  });

  // Load user preferences when component mounts
  useEffect(() => {
    if (user) {
      form.reset({
        currency: "USD", // Default or from user preferences
        language: "es",  // Default or from user preferences
        darkMode: false,
        notifications: true,
        weeklyReport: true,
        accentColor: "blue",
      });
    }
  }, [form, user]);

  function onSubmit(data: z.infer<typeof configSchema>) {
    setIsLoading(true);
    // Simular una llamada a la API
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Configuración actualizada correctamente.");
      console.log(data);

      // Apply theme changes immediately
      if (data.darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

      applyAccentColor(data.accentColor);
    }, 1000);
  }

  const applyAccentColor = (color: string) => {
    // This is a simplified example - in a real app you would update CSS variables
    const root = document.documentElement;
    const colors: Record<string, string> = {
      blue: "hsl(221.2 83.2% 53.3%)",
      green: "hsl(142.1 76.2% 36.3%)",
      purple: "hsl(262.1 83.3% 57.8%)",
      orange: "hsl(24.6 95% 53.1%)",
      pink: "hsl(346.8 77.2% 49.8%)",
    };

    root.style.setProperty('--primary', colors[color] || colors.blue);
  };

  return (
    <Layout>
      <div className="space-y-6 p-4 pb-16 md:block">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Configuración</h2>
          <p className="text-muted-foreground">
            Administra tus preferencias y ajustes de cuenta.
          </p>
        </div>
        <Separator className="my-6" />

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="appearance">Apariencia</TabsTrigger>
            <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
          </TabsList>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <TabsContent value="general" className="space-y-6">
                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Moneda predeterminada</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona una moneda" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="USD">
                            Dólar estadounidense (USD)
                          </SelectItem>
                          <SelectItem value="EUR">Euro (EUR)</SelectItem>
                          <SelectItem value="GBP">Libra esterlina (GBP)</SelectItem>
                          <SelectItem value="JPY">Yen japonés (JPY)</SelectItem>
                          <SelectItem value="MXN">Peso mexicano (MXN)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Esta será la moneda predeterminada para tus transacciones y
                        reportes.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Idioma</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un idioma" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="es">Español</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="fr">Français</SelectItem>
                          <SelectItem value="de">Deutsch</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Este será el idioma predeterminado de la interfaz.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="appearance" className="space-y-6">
                <FormField
                  control={form.control}
                  name="darkMode"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Modo oscuro</FormLabel>
                        <FormDescription>
                          Activa el modo oscuro para una experiencia visual más
                          cómoda en entornos con poca luz.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="accentColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color de acento</FormLabel>
                      <FormDescription>
                        Selecciona el color principal para la aplicación.
                      </FormDescription>
                      <FormMessage />
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-5 gap-4 pt-2"
                      >
                        <FormItem>
                          <FormLabel className="[&:has([data-state=checked])>div]:border-[3px] [&:has([data-state=checked])>div]:border-primary">
                            <FormControl>
                              <RadioGroupItem value="blue" className="sr-only" />
                            </FormControl>
                            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-muted bg-blue-600 cursor-pointer">
                              <div className="h-6 w-6 rounded-full bg-blue-600" />
                            </div>
                          </FormLabel>
                        </FormItem>
                        <FormItem>
                          <FormLabel className="[&:has([data-state=checked])>div]:border-[3px] [&:has([data-state=checked])>div]:border-primary">
                            <FormControl>
                              <RadioGroupItem value="green" className="sr-only" />
                            </FormControl>
                            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-muted bg-green-600 cursor-pointer">
                              <div className="h-6 w-6 rounded-full bg-green-600" />
                            </div>
                          </FormLabel>
                        </FormItem>
                        <FormItem>
                          <FormLabel className="[&:has([data-state=checked])>div]:border-[3px] [&:has([data-state=checked])>div]:border-primary">
                            <FormControl>
                              <RadioGroupItem value="purple" className="sr-only" />
                            </FormControl>
                            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-muted bg-purple-600 cursor-pointer">
                              <div className="h-6 w-6 rounded-full bg-purple-600" />
                            </div>
                          </FormLabel>
                        </FormItem>
                        <FormItem>
                          <FormLabel className="[&:has([data-state=checked])>div]:border-[3px] [&:has([data-state=checked])>div]:border-primary">
                            <FormControl>
                              <RadioGroupItem value="orange" className="sr-only" />
                            </FormControl>
                            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-muted bg-orange-600 cursor-pointer">
                              <div className="h-6 w-6 rounded-full bg-orange-600" />
                            </div>
                          </FormLabel>
                        </FormItem>
                        <FormItem>
                          <FormLabel className="[&:has([data-state=checked])>div]:border-[3px] [&:has([data-state=checked])>div]:border-primary">
                            <FormControl>
                              <RadioGroupItem value="pink" className="sr-only" />
                            </FormControl>
                            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-muted bg-pink-600 cursor-pointer">
                              <div className="h-6 w-6 rounded-full bg-pink-600" />
                            </div>
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormItem>
                  )}
                />
              </TabsContent>
              <TabsContent value="notifications" className="space-y-6">
                <FormField
                  control={form.control}
                  name="notifications"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Notificaciones</FormLabel>
                        <FormDescription>
                          Recibe notificaciones sobre actividad importante en tu cuenta.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="weeklyReport"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Reporte semanal</FormLabel>
                        <FormDescription>
                          Recibe un resumen semanal de tus finanzas por correo electrónico.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </TabsContent>

              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Guardando..." : "Guardar cambios"}
              </Button>
            </form>
          </Form>
        </Tabs>
      </div>
    </Layout>
  );
}
