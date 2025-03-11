import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { ChevronsLeft } from "lucide-react";
export const About = () => {
    const navigate = useNavigate();
    const handleGoBack = () => {
        navigate(-1); // Redirige a la página anterior
    };
    return (

        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
                {/* Header Section */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Luis E. Polanco Moscoso
                    </h1>
                    <p className="text-lg text-gray-600">2017-0514</p>
                </div>

                {/* Academic Information */}
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                        🎓 Formación Académica
                    </h2>
                    <p className="text-gray-600 leading-relaxed">
                        Estudiante de Informática en la Universidad Tecnologica del Cibao Oriental (UTECO).
                    </p>
                </div>

                {/* Location Section */}
                <div className="bg-blue-50 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-700 mb-2">
                        📍 Ubicación Actual
                    </h3>
                    <p className="text-gray-600">
                        Residente en Cotui, República Dominicana.
                        Zona conocida por su riqueza natural y comunidad acogedora.
                    </p>
                </div>

                {/* Additional Info */}
                <div className="mt-8 border-t border-gray-200 pt-6">
                    <p className="text-gray-600 italic">
                        "Apasionado por el aprendizaje continuo en el campo de la tecnología
                        y el desarrollo de soluciones innovadoras."
                    </p>
                </div>
            </div>
            <Button
                variant="outline"
                className="mt-6 mx-auto pl-2 flex items-center"  // Added mx-auto for centering
                onClick={handleGoBack}
            >
                <ChevronsLeft className="mr-[1px]" />
                Regresar
            </Button>
        </div>
    );
};