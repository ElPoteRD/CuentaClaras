
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, CreditCard, Shield, Smartphone, Wallet, Target, ChevronRight, ChevronsLeft } from "lucide-react"
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

export default function Caracteristcas() {
  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate(-1); // Redirige a la página anterior
  };

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Características de FinanceHub</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Descubre todas las herramientas que tenemos para ayudarte a gestionar tus finanzas de manera eficiente y
          alcanzar tus metas financieras.
        </p>
        <Button
          variant="outline"
          className="mt-6 pl-2 flex items-center"
          onClick={handleGoBack}
        >
          <ChevronsLeft className="mr-[1px]" />
          Regresar
        </Button>
      </div>

      {/* Sección de características principales */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-16">
        <Card className="flex flex-col h-full">
          <CardHeader>
            <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
              <Wallet className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Gestión de Cuentas</CardTitle>
            <CardDescription>
              Administra todas tus cuentas bancarias, tarjetas de crédito y efectivo en un solo lugar.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <span className="bg-primary/10 p-1 rounded-full mr-2 mt-0.5">
                  <ChevronRight className="h-3 w-3 text-primary" />
                </span>
                Visualiza saldos y movimientos en tiempo real
              </li>
              <li className="flex items-start">
                <span className="bg-primary/10 p-1 rounded-full mr-2 mt-0.5">
                  <ChevronRight className="h-3 w-3 text-primary" />
                </span>
                Categoriza automáticamente tus transacciones
              </li>
              <li className="flex items-start">
                <span className="bg-primary/10 p-1 rounded-full mr-2 mt-0.5">
                  <ChevronRight className="h-3 w-3 text-primary" />
                </span>
                Personaliza colores e iconos para cada cuenta
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="flex flex-col h-full">
          <CardHeader>
            <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Reportes Detallados</CardTitle>
            <CardDescription>
              Obtén insights valiosos sobre tus finanzas con reportes visuales y detallados.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <span className="bg-primary/10 p-1 rounded-full mr-2 mt-0.5">
                  <ChevronRight className="h-3 w-3 text-primary" />
                </span>
                Gráficos interactivos de ingresos y gastos
              </li>
              <li className="flex items-start">
                <span className="bg-primary/10 p-1 rounded-full mr-2 mt-0.5">
                  <ChevronRight className="h-3 w-3 text-primary" />
                </span>
                Análisis por categorías y períodos personalizables
              </li>
              <li className="flex items-start">
                <span className="bg-primary/10 p-1 rounded-full mr-2 mt-0.5">
                  <ChevronRight className="h-3 w-3 text-primary" />
                </span>
                Exportación de datos en múltiples formatos
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="flex flex-col h-full">
          <CardHeader>
            <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
              <Target className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Metas Financieras</CardTitle>
            <CardDescription>
              Establece y alcanza tus objetivos financieros con nuestras herramientas de seguimiento.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <span className="bg-primary/10 p-1 rounded-full mr-2 mt-0.5">
                  <ChevronRight className="h-3 w-3 text-primary" />
                </span>
                Crea metas de ahorro personalizadas
              </li>
              <li className="flex items-start">
                <span className="bg-primary/10 p-1 rounded-full mr-2 mt-0.5">
                  <ChevronRight className="h-3 w-3 text-primary" />
                </span>
                Visualiza tu progreso en tiempo real
              </li>
              <li className="flex items-start">
                <span className="bg-primary/10 p-1 rounded-full mr-2 mt-0.5">
                  <ChevronRight className="h-3 w-3 text-primary" />
                </span>
                Recibe notificaciones de logros y recordatorios
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="flex flex-col h-full">
          <CardHeader>
            <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
              <CreditCard className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Control de Gastos</CardTitle>
            <CardDescription>
              Mantén un registro detallado de todos tus gastos y aprende a optimizarlos.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <span className="bg-primary/10 p-1 rounded-full mr-2 mt-0.5">
                  <ChevronRight className="h-3 w-3 text-primary" />
                </span>
                Categorización inteligente de gastos
              </li>
              <li className="flex items-start">
                <span className="bg-primary/10 p-1 rounded-full mr-2 mt-0.5">
                  <ChevronRight className="h-3 w-3 text-primary" />
                </span>
                Alertas de gastos inusuales o excesivos
              </li>
              <li className="flex items-start">
                <span className="bg-primary/10 p-1 rounded-full mr-2 mt-0.5">
                  <ChevronRight className="h-3 w-3 text-primary" />
                </span>
                Sugerencias para reducir gastos innecesarios
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="flex flex-col h-full">
          <CardHeader>
            <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Seguridad Avanzada</CardTitle>
            <CardDescription>
              Tu información financiera protegida con los más altos estándares de seguridad.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <span className="bg-primary/10 p-1 rounded-full mr-2 mt-0.5">
                  <ChevronRight className="h-3 w-3 text-primary" />
                </span>
                Encriptación de datos de extremo a extremo
              </li>
              <li className="flex items-start">
                <span className="bg-primary/10 p-1 rounded-full mr-2 mt-0.5">
                  <ChevronRight className="h-3 w-3 text-primary" />
                </span>
                Autenticación de dos factores
              </li>
              <li className="flex items-start">
                <span className="bg-primary/10 p-1 rounded-full mr-2 mt-0.5">
                  <ChevronRight className="h-3 w-3 text-primary" />
                </span>
                Monitoreo constante de actividades sospechosas
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="flex flex-col h-full">
          <CardHeader>
            <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
              <Smartphone className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Acceso Multiplataforma</CardTitle>
            <CardDescription>Accede a tus finanzas desde cualquier dispositivo, en cualquier momento.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <span className="bg-primary/10 p-1 rounded-full mr-2 mt-0.5">
                  <ChevronRight className="h-3 w-3 text-primary" />
                </span>
                Aplicaciones nativas para iOS y Android
              </li>
              <li className="flex items-start">
                <span className="bg-primary/10 p-1 rounded-full mr-2 mt-0.5">
                  <ChevronRight className="h-3 w-3 text-primary" />
                </span>
                Sincronización automática entre dispositivos
              </li>
              <li className="flex items-start">
                <span className="bg-primary/10 p-1 rounded-full mr-2 mt-0.5">
                  <ChevronRight className="h-3 w-3 text-primary" />
                </span>
                Interfaz adaptada a cada tipo de pantalla
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

