import { Button } from "@/components/ui/button";
import { ChevronsLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Redirige a la página anterior
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-6xl font-bold text-gray-800">404</h1>
      <p className="mt-4 text-xl text-gray-600">Página no encontrada</p>
      <p className="mt-2 text-gray-500">
        Lo sentimos, no pudimos encontrar la página que estás buscando.
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
  );
};

export default NotFound;
