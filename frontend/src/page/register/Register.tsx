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
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import cuentasLogo from "../../assets/CuentaClarasIcon.svg";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { IRegisterForm } from "@/entities/auth";
import { register } from "@/hooks/use-register";
import { toast } from "sonner";


const Register = () => {
    const initialState: IRegisterForm = {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        avatar: "",
    };
    const [userData, setUserData] = useState<IRegisterForm>(initialState);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const navigate = useNavigate();

    const validatePassword = (password: string): boolean => {
        if (password.length < 8) {
            setPasswordError("La contraseña debe tener al menos 8 caracteres");
            return false;
        }
        setPasswordError("");
        return true;
    };
    const validateConfirmPassword = (confirmPass: string): boolean => {
        if (userData.password !== confirmPass) {
            setConfirmPasswordError("Las contraseñas no coinciden");
            return false;
        }
        setConfirmPasswordError("");
        return true;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name === 'password') {
            validatePassword(value);
        }
        if (name === 'confirmpassword') {
            validatePassword(value);
            if (confirmPassword) {
                validateConfirmPassword(confirmPassword);
            }
        }

        setUserData({
            ...userData,
            [name]: value,
        });
    };

    const handleConfirmPasswordInput = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { value } = e.target;
        setConfirmPassword(value);
        validateConfirmPassword(value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validar longitud de contraseña
        if (!validatePassword(userData.password)) {
            toast.error("La contraseña debe tener al menos 8 caracteres");
            return;
        }

        // Validar coincidencia de contraseñas
        if (userData.password !== confirmPassword) {
            toast.error("Las contraseñas no coinciden");
            return;
        }

        try {
            const response = await register(userData);
            if (response.success) {
                toast.success("Usuario registrado con éxito");
                navigate("/login");
            } else {
                toast.error("Error al registrar usuario");
            }
        } catch (error) {
            toast.error("Error al registrar usuario");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <div className="flex items-center justify-center mb-2">
                        <div className="text-primary-foreground p-2 rounded-full">
                            <img src={cuentasLogo} className="h-10 w-10" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-center">
                        Crear una cuenta
                    </CardTitle>
                    <CardDescription className="text-center">
                        Ingresa tus datos para registrarte en Cuentas Claras.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">Nombre completo</Label>
                            <div className="relative">
                                <User
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                    size={18}
                                />
                                <Input
                                    id="firstName"
                                    type="text"
                                    name="firstName"
                                    placeholder="Juan Pérez"
                                    value={userData.firstName}
                                    onChange={handleChange}
                                    className="pl-10"
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Apellido</Label>
                            <div className="relative">
                                <User
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                    size={18}
                                />
                                <Input
                                    id="lastName"
                                    type="text"
                                    name="lastName"
                                    placeholder="Juan Pérez"
                                    value={userData.lastName}
                                    onChange={handleChange}
                                    className="pl-10"
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Correo electrónico</Label>
                            <div className="relative">
                                <Mail
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                    size={18}
                                />
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    placeholder="tu@ejemplo.com"
                                    value={userData.email}
                                    onChange={handleChange}
                                    className="pl-10"
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Contraseña</Label>
                            <div className="relative">
                                <Lock
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                    size={18}
                                />
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    value={userData.password}
                                    onChange={handleChange}
                                    className={`pl-10 pr-10 ${passwordError ? 'border-red-500' : ''}`}
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
                            {passwordError && (
                                <p className="text-sm text-red-500 mt-1">{passwordError}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="Confirmpassword">Confirmar Contraseña</Label>
                            <div className="relative">
                                <Lock
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                    size={18}
                                />
                                <Input
                                    id="Confirmpassword"
                                    name="confirmpassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={handleConfirmPasswordInput}
                                    className={`pl-10 pr-10 ${confirmPasswordError ? 'border-red-500' : ''}`}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff size={18} />
                                    ) : (
                                        <Eye size={18} />
                                    )}
                                </button>
                            </div>
                            {confirmPasswordError && (
                                <p className="text-sm text-red-500 mt-1">{confirmPasswordError}</p>
                            )}
                        </div>
                        <Button
                            className="w-full mt-6"
                            type="submit"
                            disabled={!!passwordError || !!confirmPasswordError || !userData.password || !confirmPassword}

                        >
                            Registrarse
                        </Button>
                    </form>
                </CardContent>
                <CardFooter>
                    <div className="text-sm text-center w-full text-gray-500 dark:text-gray-400">
                        ¿Ya tienes una cuenta?{" "}
                        <Link
                            to="/login"
                            className="text-primary hover:underline font-medium"
                        >
                            Inicia sesión
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}

export default Register