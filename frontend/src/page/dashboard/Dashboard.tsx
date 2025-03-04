import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, TrendingDown, Activity } from "lucide-react";
import Layout from "../Layout";
import { useAccount } from "@/hooks/use-account";


export default function Dashboard() {
  const { accounts } = useAccount();
  const totalBalance = accounts.reduce((acc, account) => {
    return acc + account.initialBalance;
  }, 0);
  return (
    <Layout>
      <div className="flex flex-1 flex-col gap-4 p-4 bg-gray-50">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Balance</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalBalance.toFixed(2)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ingreso</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold"></div>
              <p className="text-xs text-muted-foreground">0.00</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gastos</CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0.00</div>
              <p className="text-xs text-muted-foreground">0.00</p>
            </CardContent>
          </Card>
        </div>
        <Card className="min-h-[50vh] flex-1 md:min-h-min">
          <CardHeader>
            <CardTitle>Actividad reciente</CardTitle>
          </CardHeader>
          <CardContent>
            <Activity className="h-40 w-full text-muted-foreground" />
            <p className="text-center text-sm text-muted-foreground">
              El gráfico de actividades se mostrará aquí.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
