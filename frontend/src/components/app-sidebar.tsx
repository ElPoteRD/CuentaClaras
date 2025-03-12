import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import cuentaLogo from "../assets/CuentasClarasLogo.png";
import {
  Banknote,
  CreditCard,
  ChevronDown,
  LogOut,
  Settings,
  User,
  Home,
  PieChart,
  DollarSign,
} from "lucide-react";
import { useState } from "react";
import { useProfile } from "@/hooks/use-profile";
import { useNavigate } from "react-router-dom";
import { useLogin } from "@/hooks/use-login";

export function AppSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { profile } = useProfile();
  const navigate = useNavigate()
  const { logoutSession } = useLogin();

  const handleLogout = async () => {
    await logoutSession();
    navigate("/");
  };
  return (
    <Sidebar>
      <SidebarHeader className="flex justify-center items-center">
        <img
          src={cuentaLogo}
          className=" justify-center w-[100px] h-auto"
        />

      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  asChild
                >
                  <Link to="/dashboard">
                    <Home className="mr-2 h-4 w-4" />
                    <span>Inicio</span>
                  </Link>
                </Button>
                <SidebarMenuItem>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    asChild
                  >
                    <Link to="/account">
                      <User className="mr-2 h-4 w-4" />
                      <span>Mis productos</span>
                    </Link>
                  </Button>
                </SidebarMenuItem>
              </SidebarMenuItem>
              {/* SubMenu de Transaciones */}
              <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between">
                    <div className="flex items-center">
                      <DollarSign className="mr-2 h-4 w-4" />
                      <span>Transaciones</span>
                    </div>
                    <ChevronDown
                      className="h-4 w-4 transition-transform duration-200"
                      style={{ transform: isOpen ? "rotate(180deg)" : "" }}
                    />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-2 pl-6">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    asChild
                  >
                    <Link to="/income">
                      <Banknote className="mr-2 h-4 w-4" />
                      <span>Ingresos</span>
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    asChild
                  >
                    <Link to="/expense">
                      <CreditCard className="mr-2 h-4 w-4" />
                      <span>Gastos</span>
                    </Link>
                  </Button>
                </CollapsibleContent>
              </Collapsible>
              {/*SubMenu de Reportes*/}
              <SidebarMenuItem>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  asChild
                >
                  <Link to="/report">
                    <PieChart className="mr-2 h-4 w-4" />
                    <span>Reportes</span>
                  </Link>
                </Button>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  asChild
                >
                  <Link to="/configuration">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Configuraciones</span>
                  </Link>
                </Button>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <div className="p-4 border-t">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src="" alt="Usuario" />
                <AvatarFallback>
                  {profile?.firstName?.charAt(0)?.toUpperCase()}
                  {profile?.lastName?.charAt(0)?.toUpperCase() || ""}
                </AvatarFallback>
              </Avatar>
              <span>Mi Cuenta</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link to="/profile">
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Cerrar Sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Sidebar>
  );
}
