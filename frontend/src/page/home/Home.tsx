import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  ChevronRight,
  DollarSign,
  LineChart,
  ShieldCheck,
  Menu,
} from "lucide-react";
import LogoC from "../../assets/CuentaClarasIcon.svg";
import { Link } from "react-router-dom";
export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center my-2">
        <Link className="flex items-center justify-center" to="/">
          <div className="flex justify-start rounded-md">
            <img src={LogoC} className="h-[50px] w-[50px]" />
          </div>
          <span className="sr-only">Cuentas Claras</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            className="text-sm font-medium hover:underline underline-offset-4 hidden sm:inline-block"
            to="/caracteristicas"
          >
            Caracteristicas
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4 hidden sm:inline-block"
            to="/about"
          >
            Sobre Nosotros
          </Link>
          <Button variant="outline" size="icon" className="sm:hidden">
            <Menu className="h-4 w-4" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-6xl/none">
                    Simplifique sus finanzas
                  </h1>
                  <p className="max-w-[600px] text-gray-500 text-sm sm:text-base md:text-xl dark:text-gray-400">
                    Tome el control de su dinero con nuestras intuitivas
                    herramientas de gestión financiera. Comience su viaje hacia
                    la libertad financiera hoy.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button size="lg">
                        Empezar
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </SheetTrigger>
                    <div className="flex flex-col items-center justify-center space-y-4 text-center">
                      <SheetContent
                        className="w-full py-12 md:py-24 lg:py-32 border-t"
                        side={"bottom"}
                      >
                        <SheetHeader>
                          <div className="space-y-2">
                            <SheetTitle className="text-3xl font-bold tracking-tighter sm:text-5xl mb-4">
                              ¿Listo para empezar?
                            </SheetTitle>
                            <SheetDescription className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400 md:leading-relaxed">
                              Únase a miles de usuarios satisfechos y tome el
                              control de sus finanzas hoy.
                            </SheetDescription>
                          </div>
                        </SheetHeader>
                        <div className="w-full max-w-sm space-y-2 mt-10">
                          <div className="flex flex-col place-content-center sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                            <Button className="w-full sm:w-[500px]">
                              <Link to="/login">Inicia sesión</Link>
                            </Button>
                            <Button className="w-full sm:w-[500px]">
                              <Link to="/register">Registrate</Link>
                            </Button>
                          </div>
                        </div>
                      </SheetContent>
                    </div>
                  </Sheet>
                  <Button size="lg" variant="outline">
                    Más información
                  </Button>
                </div>
              </div>
              <img />
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Nuestras características
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Descubre las herramientas que revolucionarán tu gestión
                  financiera.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 sm:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Seguimiento de gastos</CardTitle>
                  <LineChart className="w-8 h-8 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <p>
                    Realice un seguimiento y categorice fácilmente sus gastos
                    para comprender sus hábitos de gasto.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Planificación presupuestaria</CardTitle>
                  <DollarSign className="w-8 h-8 text-green-500" />
                </CardHeader>
                <CardContent>
                  <p>
                    Cree y administre presupuestos para ayudarlo a alcanzar sus
                    objetivos financieros.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Transacciones seguras</CardTitle>
                  <ShieldCheck className="w-8 h-8 text-red-500" />
                </CardHeader>
                <CardContent>
                  <p>
                    Descanse tranquilo sabiendo que sus datos financieros están
                    protegidos con seguridad de última generación.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Lo que dicen nuestros clientes
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  No confíe sólo en nuestra palabra. Esto es lo que nuestros
                  usuarios tienen que decir sobre nosotros.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 sm:grid-cols-2">
              <nav className="sm:ml-auto flex justify-center gap-4 sm:gap-6">
                <Card>
                  <CardHeader className="flex items-center">
                    <CardTitle>Luis Emilio</CardTitle>
                  </CardHeader>
                  <CardContent>
                    "Cuentas Claras ha transformado completamente la forma en
                    que administro las finanzas de mi empresa. Es intuitivo,
                    potente y me ahorra horas cada semana".
                  </CardContent>
                </Card>
              </nav>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2025 Cuentas Claras. Reservados todos los derechos.
        </p>
      </footer>
    </div>
  );
}
