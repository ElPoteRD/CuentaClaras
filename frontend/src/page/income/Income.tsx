import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IngresosTable } from "@/components/ingresos-table";
import { AgregarIngresoModal } from "@/components/ingresos-modal";
import { PlusCircle, DollarSign } from "lucide-react";
import { useState } from "react";
import Layout from "../Layout";
import { useProfile } from "@/hooks/use-profile";
import { useTransaction } from "@/hooks/use-transaction";

export default function Income() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { profile: Id } = useProfile();
  const { transactions, fetchTransactions } = useTransaction(); // Agregamos fetchTransactions


  // Función para manejar el cierre del modal y actualizar datos
  const handleModalClose = async (shouldRefresh: boolean = false) => {
    setIsModalOpen(false);
    if (shouldRefresh) {
      await fetchTransactions(); // Actualizamos las transacciones cuando se cierra después de agregar
    }
  };

  // Filtrar ingresos del usuario actual
  const ingresos = transactions.filter(
    (transaction) => transaction.type === "Ingreso" && transaction.userId === Id?.id
  );

  const totalIngresos = ingresos.reduce(
    (total, ingreso) => total + ingreso.amount,
    0
  );

  return (
    <Layout>
      <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h1 className="text-3xl font-bold mb-4 sm:mb-0">Ingresos</h1>
          <div className="flex space-x-2">
            <Button onClick={() => setIsModalOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" /> Agregar Ingreso
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Ingresos
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${totalIngresos.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                +0.00% del mes pasado
              </p>
            </CardContent>
          </Card>
          {/* Add more summary cards here as needed */}
        </div>

        <Tabs defaultValue="todos" className="mb-6">
          <TabsList>
            <TabsTrigger value="todos">Todos</TabsTrigger>
          </TabsList>
          <TabsContent value="todos">
            <IngresosTable />
          </TabsContent>
          <TabsContent value="recientes">
            <IngresosTable />
          </TabsContent>
          <TabsContent value="categoria">
            {/* Implement category view here */}
            <p>Vista por categoría en desarrollo</p>
          </TabsContent>
        </Tabs>

        <AgregarIngresoModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
        />
      </div>
    </Layout>
  );
}
