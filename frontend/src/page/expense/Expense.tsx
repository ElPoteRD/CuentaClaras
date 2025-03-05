import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { GastosTable } from "@/components/gastos-table";
import { AgregarGastoModal } from "@/components/gastos-modal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, DollarSign } from "lucide-react";
import Layout from "../Layout";
import { useTransaction } from "@/hooks/use-transaction";
import { useAccount } from "@/hooks/use-account";

export default function Expense() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { transactions, fetchTransactions } = useTransaction();
  const { accounts } = useAccount();

  // Cargar transacciones al montar el componente
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Filtrar solo los gastos
  const gastos = transactions.filter(
    (transaction) => transaction.type === "Gasto"
  );


  // Calcular el porcentaje de cambio del mes anterior
  const calcularPorcentajeCambio = () => {
    const hoy = new Date();
    const mesActual = hoy.getMonth();
    const mesAnterior = mesActual - 1;

    const gastosEsteMes = gastos.filter(
      (gasto) => new Date(gasto.date).getMonth() === mesActual
    );

    const gastosMesPasado = gastos.filter(
      (gasto) => new Date(gasto.date).getMonth() === mesAnterior
    );

    const totalEsteMes = gastosEsteMes.reduce(
      (total, gasto) => total + gasto.amount,
      0
    );

    const totalMesPasado = gastosMesPasado.reduce(
      (total, gasto) => total + gasto.amount,
      0
    );

    if (totalMesPasado === 0) return 0;
    return ((totalEsteMes - totalMesPasado) / totalMesPasado) * 100;
  };

  const porcentajeCambio = calcularPorcentajeCambio();

  const handleModalClose = async (shouldRefresh: boolean = false) => {
    setIsModalOpen(false);
    if (shouldRefresh) {
      await fetchTransactions();
    }
  };

  // Función para obtener la moneda de una cuenta
  const getCurrency = (accountId: number) => {
    const account = accounts.find(acc => acc.id === accountId);
    return account?.currency || 'EUR';
  };

  // Agrupar gastos por moneda
  const gastosPorMoneda = gastos.reduce((acc, gasto) => {
    const currency = getCurrency(gasto.accountId);
    if (!acc[currency]) {
      acc[currency] = 0;
    }
    acc[currency] += gasto.amount;
    return acc;
  }, {} as Record<string, number>);

  return (
    <Layout>
      <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h1 className="text-3xl font-bold mb-4 sm:mb-0">Gastos</h1>
          <div className="flex space-x-2">
            <Button onClick={() => setIsModalOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" /> Agregar Gasto
            </Button>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          {Object.entries(gastosPorMoneda).map(([currency, total]) => (
            <Card key={currency}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Gastos ({currency})
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Intl.NumberFormat('es-ES', {
                    style: 'currency',
                    currency: currency,
                  }).format(total)}
                </div>
                <p className="text-xs text-muted-foreground">
                  <span className={porcentajeCambio >= 0 ? "text-red-600" : "text-green-600"}>
                    {porcentajeCambio > 0 ? "+" : ""}
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
            <GastosTable />
          </TabsContent>
        </Tabs>
        <AgregarGastoModal
          isOpen={isModalOpen}
          onClose={handleModalClose}

        />
      </div>
    </Layout>
  );
}
