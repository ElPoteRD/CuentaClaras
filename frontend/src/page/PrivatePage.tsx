import imgPrivate from "@/assets/12756149.gif"
import { Link } from "react-router-dom";
import PrivateRoute from "@/components/PrivateRoute"
export default function PrivatePage() {
    return (
        <PrivateRoute>
            <div className="w-full h-screen flex flex-col justify-center items-center gap-6 bg-slate-50 p-4">
                <img src={imgPrivate} alt="private" className="w-[180px] mb-2" />
                <div className="max-w-md space-y-4 text-center">
                    <h1 className="text-2xl font-bold text-primary">
                        Acceso Restringido
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Necesitas iniciar sesión para acceder a esta sección. Esta área está
                        reservada para usuarios registrados de CuentaClaras. Por favor,
                        inicia sesión o crea una cuenta para continuar.
                    </p>
                    <div className="flex gap-3 justify-center mt-6">
                        <Link
                            to="/"
                            className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md transition-all text-sm font-medium"
                        >
                            Ir al inicio
                        </Link>
                        <Link
                            to="/login"
                            className="border border-primary text-primary hover:bg-primary/10 px-4 py-2 rounded-md transition-all text-sm font-medium"
                        >
                            Iniciar sesión
                        </Link>
                    </div>
                </div>
            </div>
        </PrivateRoute>
    );
}
