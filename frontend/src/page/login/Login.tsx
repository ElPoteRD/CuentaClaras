
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import cuentasLogo from "../../assets/CuentaClarasIcon.svg";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ILoginForm } from "@/entities/auth";
import { useLogin } from "@/hook/use-login";

export default function Login() {
    const navigate = useNavigate();
    const { loading, loginProcess } = useLogin();

    const [formData, setFormData] = useState<ILoginForm>({
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const response = await loginProcess(formData);

        if (response.success && response.user) {
            setTimeout(() => {
                navigate("/dashboard");
            }, 3000);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <div className="flex items-center justify-center mb-4">
                        <div className="text-primary-foreground p-2 rounded-full">
                            <img src={cuentasLogo} alt="Logo" className="h-10 w-10" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-center">
                        Iniciar sesión
                    </CardTitle>
                    <CardDescription className="text-center">
                        Ingresa tus credenciales para acceder a tu cuenta
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Correo electrónico</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    placeholder="tu@ejemplo.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="pl-10"
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Contraseña</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="pl-10 pr-10"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>
                        <Button variant="link" className="w-full" asChild>
                            <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
                        </Button>
                        <Button className="w-full mt-6" type="submit" disabled={loading}>
                            {loading ? "Iniciando sesión..." : "Iniciar sesión"}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2">
                    <div className="text-sm text-center text-gray-500 dark:text-gray-400">
                        ¿No tienes una cuenta?{" "}
                        <Link to="/register" className="text-primary hover:underline font-medium">
                            Regístrate
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}