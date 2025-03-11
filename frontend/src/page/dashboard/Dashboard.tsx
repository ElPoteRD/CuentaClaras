import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import Layout from "../Layout";
import { useAccount } from "@/hooks/use-account";
// Add new imports
import { useTransaction } from "@/hooks/use-transaction";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useEffect } from "react";

// Update the component function
export default function Dashboard() {
  const { accounts } = useAccount();
  const { transactions, fetchTransactions } = useTransaction();

  // Fetch transactions on mount
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Calculate totals with fallback values
  const totalBalance = accounts.reduce((acc, account) => acc + account.initialBalance, 0);
  const totalIncome = transactions.filter(t => t.type === 'Ingreso').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'Gasto').reduce((sum, t) => sum + t.amount, 0);

  // Prepare chart data
  const chartData = Object.values(
    transactions.reduce((acc, t) => {
      const month = format(new Date(t.date), 'MMM yyyy', { locale: es });
      if (!acc[month]) {
        acc[month] = { month, income: 0, expense: 0 };
      }
      t.type === 'Ingreso'
        ? acc[month].income += t.amount
        : acc[month].expense += t.amount;
      return acc;
    }, {})
  );

  return (
    <Layout>
      <div className="flex flex-1 flex-col gap-4 p-4 bg-gray-50">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          {/* Balance Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Balance Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${totalBalance.toFixed(2)}
              </div>
            </CardContent>
          </Card>

          {/* Income Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                +${totalIncome.toFixed(2)}
              </div>
            </CardContent>
          </Card>

          {/* Expenses Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gastos Totales</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                -${totalExpenses.toFixed(2)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chart Section */}
        <Card className="min-h-[50vh]">
          <CardHeader>
            <CardTitle>Evolución Financiera</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            {transactions.length === 0 ? (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                No hay datos para mostrar
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Bar dataKey="income" fill="#16a34a" name="Ingresos" />
                  <Bar dataKey="expense" fill="#dc2626" name="Gastos" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
