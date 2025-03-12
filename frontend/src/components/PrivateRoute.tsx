import { useEffect, useState } from "react";
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "@/hooks/use-login";
import { Link } from "react-router-dom";
import imgPrivate from "@/assets/private.svg";
export default function PrivateRoute({ children }: { children: ReactNode }) {
  const { loadSession } = useLogin();
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const existToken = localStorage.getItem("login-token");
    if (!existToken) {
      setTimeout(()=>{
        navigate("/")
      }, 2000)
    } else {
      loadSession();
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <div className="w-full h-[100vh] flex flex-col justify-center items-center gap-3">
      <img src={imgPrivate} alt="private" className="w-[200px]" />
      <h1 className="text-xl text-green-700 p-2 font-semibold uppercase w-[350px] text-center">
        Sin acceso
      </h1>
      <p className="w-[400px] text-xs text-center p-2 font-semibold text-gray-600">
        Lo sentimos, no puedes acceder a este recurso porque no eres el creador del mismo. Este contenido está restringido exclusivamente al usuario que lo creó, y no se puede compartir ni visualizar desde otras cuentas. Si necesitas más información, asegúrate de estar utilizando una cuenta autorizada o revisa las políticas de acceso.
      </p>
      <Link
        to="/"
        className="bg-red-600 text-white p-2 rounded-md transition-all hover:bg-red-500 cursor-pointer text-xs"
      >
        Regresar
      </Link>
    </div>;
  }
  return <>{children}</>;
}
