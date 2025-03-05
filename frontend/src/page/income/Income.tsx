import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IngresosTable } from "@/components/ingresos-table";
import { AgregarIngresoModal } from "@/components/ingresos-modal";
import { PlusCircle, DollarSign } from "lucide-react";
import { useState, useEffect } from "react";
import Layout from "../Layout";
import { useProfile } from "@/hooks/use-profile";
import { useTransaction } from "@/hooks/use-transaction";
import { useAccount } from "@/hooks/use-account";

export default function Income() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { profile: Id } = useProfile();
  const { transactions, fetchTransactions } = useTransaction();
  const { accounts } = useAccount();
  const [porcentajeCambio, setPorcentajeCambio] = useState(0);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Filtrar ingresos del usuario actual
  const ingresos = transactions.filter(
    (transaction) => transaction.type === "Ingreso" && transaction.userId === Id?.id
  );

  // Calcular ingresos por moneda
  const ingresosPorMoneda = ingresos.reduce((acc, ingreso) => {
    const account = accounts.find(acc => acc.id === ingreso.accountId);
    const currency = account?.currency || 'EUR';

    if (!acc[currency]) {
      acc[currency] = 0;
    }
    acc[currency] += ingreso.amount;
    return acc;
  }, {} as Record<string, number>);

  // Calcular el porcentaje de cambio del mes anterior
  useEffect(() => {
    const hoy = new Date();
    const mesActual = hoy.getMonth();
    const mesAnterior = mesActual - 1;

    const ingresosEsteMes = ingresos.filter(
      (ingreso) => new Date(ingreso.date).getMonth() === mesActual
    );

    const ingresosMesPasado = ingresos.filter(
      (ingreso) => new Date(ingreso.date).getMonth() === mesAnterior
    );

    const totalEsteMes = ingresosEsteMes.reduce(
      (total, ingreso) => total + ingreso.amount,
      0
    );

    const totalMesPasado = ingresosMesPasado.reduce(
      (total, ingreso) => total + ingreso.amount,
      0
    );

    const porcentaje = totalMesPasado === 0
      ? 0
      : ((totalEsteMes - totalMesPasado) / totalMesPasado) * 100;

    setPorcentajeCambio(porcentaje);
  }, [ingresos]);

  function handleModalClose(shouldRefresh?: boolean): void {
    setIsModalOpen(false);
    if (shouldRefresh) {
      fetchTransactions();
    }
  }

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
          {Object.entries(ingresosPorMoneda).map(([currency, total]) => (
            <Card key={currency}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Ingresos ({currency})
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Intl.NumberFormat('es-ES', {
                    style: 'currency',
                    currency: currency
                  }).format(total)}
                </div>
                <p className="text-xs text-muted-foreground">
                  <span className={porcentajeCambio >= 0 ? "text-green-600" : "text-red-600"}>
                    {porcentajeCambio > 0 ? "+" : ""}
                    {porcentajeCambio.toFixed(2)}% del mes pasado
                  </span>
                </p>
              </CardContent>
            </Card>
          ))}
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
