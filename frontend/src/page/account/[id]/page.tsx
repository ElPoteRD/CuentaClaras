import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useAccount } from "@/hooks/use-account"
import { Button } from "@/components/ui/button"
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  CreditCard,
  Wallet,
  Building,
  Landmark,
  ArrowUpRight,
  ArrowDownRight,
  Pencil,
  Trash2
} from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { toast } from "sonner"
import { EditAccountModal } from "@/components/use-edits"
import { useEffect } from "react"
import { useTransaction } from "@/hooks/use-transaction"
import Layout from "@/page/Layout"
import { TransactionEntity } from "@/entities/transaction"

export function AccountDetail() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { accounts, deleteAccount, isLoading, refetchAccounts } = useAccount()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const { transactions, isLoading: loadingTransactions, refreshTransactions } = useTransaction()
  const [filteredTransactions, setFilteredTransactions] = useState<TransactionEntity[]>([])

  // Move cuenta declaration before effects
  const cuenta = accounts?.find(acc => acc.id === Number(id))

  useEffect(() => {
    if (!isLoading && !accounts) {
      console.error(`Account not found with ID: ${id}`)
      navigate("/account")
    }
  }, [isLoading, accounts, id, navigate])

  useEffect(() => {
    if (cuenta) {
      refreshTransactions() // Trigger transaction load when account is available
    }
  }, [cuenta, refreshTransactions])

  useEffect(() => {
    if (cuenta && transactions) {
      const accountTransactions = transactions.filter(t => t.accountId === cuenta.id)
      setFilteredTransactions(accountTransactions)
    }
  }, [transactions, cuenta]) // Remove unnecessary dependencies

  // Move loading check after cuenta declaration
  if (isLoading || !cuenta) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <span className="sr-only">Cargando...</span>
      </div>
    )
  }

  const handleDeleteAccount = async () => {
    if (!cuenta) return;
    try {
      const success = await deleteAccount(cuenta.id);
      if (success) {
        await refetchAccounts(); // Add this line
        toast.success("Cuenta eliminada correctamente");
        navigate("/account");
      }
    } catch (error) {
      toast.error("Error al eliminar la cuenta");
    } finally {
      setIsDeleteModalOpen(false);
    }
  };


  const renderIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "crédito":
        return <CreditCard className="h-6 w-6" />
      case "efectivo":
        return <Wallet className="h-6 w-6" />
      case "banco":
        return <Building className="h-6 w-6" />
      case "inversión":
        return <Landmark className="h-6 w-6" />
      default:
        return <CreditCard className="h-6 w-6" />
    }
  }

  if (!cuenta) {
    return (
      <div className="container mx-auto p-6">
        <Button variant="outline" onClick={() => navigate("/account")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver
        </Button>
        <div className="mt-10 text-center">
          <h2 className="text-2xl font-bold">Cuenta no encontrada</h2>
          <p className="mt-2 text-muted-foreground">
            La cuenta solicitada no existe o ha sido eliminada
          </p>
        </div>
      </div>
    )
  }

  return (
    <Layout>
      <div className="container mx-auto p-6 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-4 rounded-2xl">
                {renderIcon(cuenta.type)}
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">{cuenta.name}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="capitalize">
                    {cuenta.type}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Moneda: {cuenta.currency}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setIsEditModalOpen(true)}
              >
                <Pencil className="h-4 w-4 mr-2" />
                Editar
              </Button>
              <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Eliminar cuenta permanentemente?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta acción no se puede deshacer. Se eliminarán todos los datos asociados a esta cuenta.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAccount}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Confirmar Eliminación
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Button
                variant="destructive"
                onClick={() => setIsDeleteModalOpen(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row justify-between items-center pb-2">
              <CardTitle className="text-sm font-medium">Saldo Actual</CardTitle>
              <Wallet className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-semibold ${cuenta.initialBalance >= 0 ? "text-green-600" : "text-red-600"}`}>
                {cuenta.currency} {cuenta.initialBalance.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Creada el {format(new Date(cuenta.creationDate), "PPP", { locale: es })}
              </p>
            </CardContent>
          </Card>

          {/* Income Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row justify-between items-center pb-2">
              <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
              <ArrowUpRight className="h-5 w-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold text-green-600">
                {cuenta.currency} {filteredTransactions
                  .filter(t => t.type === 'Ingreso')
                  .reduce((sum, t) => sum + t.amount, 0)
                  .toFixed(2)}
              </div>
            </CardContent>
          </Card>

          {/* Expenses Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row justify-between items-center pb-2">
              <CardTitle className="text-sm font-medium">Gastos Totales</CardTitle>
              <ArrowDownRight className="h-5 w-5 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold text-red-600">
                {cuenta.currency} {filteredTransactions
                  .filter(t => t.type === 'Gasto')
                  .reduce((sum, t) => sum + t.amount, 0)
                  .toFixed(2)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transactions Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold tracking-tight">Movimientos</h2>
          </div>
          <Card className="overflow-hidden">
            <Tabs defaultValue="transacciones">
              <TabsList className="w-full rounded-none border-b bg-transparent p-0">
                <TabsTrigger
                  value="transacciones"
                  className="relative rounded-none border-b-2 border-transparent data-[state=active]:border-primary px-6 py-4"
                >
                  Transacciones
                </TabsTrigger>
                <TabsTrigger
                  value="analiticas"
                  className="relative rounded-none border-b-2 border-transparent data-[state=active]:border-primary px-6 py-4"
                >
                  Analíticas
                </TabsTrigger>
              </TabsList>

              <TabsContent value="transacciones" className="m-0">
                <CardContent className="p-6">
                  {filteredTransactions.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      No hay transacciones registradas
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredTransactions.map((transaction) => (
                        <div
                          key={transaction.id}
                          className="flex items-center justify-between p-4 hover:bg-muted/50 rounded-lg transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-lg ${transaction.type === 'Ingreso' ? 'bg-green-100' : 'bg-red-100'}`}>
                              {transaction.type === 'Ingreso' ? (
                                <ArrowUpRight className="h-5 w-5 text-green-600" />
                              ) : (
                                <ArrowDownRight className="h-5 w-5 text-red-600" />
                              )}
                            </div>
                            <div>
                              <div className={`font-medium ${transaction.type === 'Ingreso' ? 'text-green-600' : 'text-red-600'}`}>
                                {transaction.description || 'Sin descripción'}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {format(new Date(transaction.date), "PP", { locale: es })}
                              </div>
                            </div>
                          </div>
                          <div className={`text-lg font-semibold ${transaction.type === 'Ingreso' ? 'text-green-600' : 'text-red-600'}`}>
                            {transaction.type === 'Ingreso' ? '+' : '-'}
                            {transaction.amount.toFixed(2)} {cuenta.currency}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </TabsContent>
              <TabsContent value="analiticas" className="m-0">
                <CardContent className="p-6">
                  {filteredTransactions.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      No hay datos para mostrar
                    </div>
                  ) : (
                    <div className="space-y-8">
                      {/* Pie Chart - Income vs Expenses */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Distribución General</h3>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={[
                                  { name: 'Ingresos', value: filteredTransactions.filter(t => t.type === 'Ingreso').reduce((sum, t) => sum + t.amount, 0) },
                                  { name: 'Gastos', value: filteredTransactions.filter(t => t.type === 'Gasto').reduce((sum, t) => sum + t.amount, 0) }
                                ]}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                              >
                                <Cell fill="#16a34a" />
                                <Cell fill="#dc2626" />
                              </Pie>
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      {/* Bar Chart - Monthly Summary */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Resumen Mensual</h3>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={Object.values(
                              filteredTransactions.reduce((acc, t) => {
                                const month = format(new Date(t.date), 'MMM yyyy', { locale: es })
                                if (!acc[month]) {
                                  acc[month] = { month, income: 0, expense: 0 }
                                }
                                if (t.type === 'Ingreso') {
                                  acc[month].income = (acc[month].income || 0) + t.amount;
                                } else {
                                  acc[month].expense = (acc[month].expense || 0) + t.amount;
                                }
                                return acc
                              }, {})
                            )}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="month" />
                              <YAxis />
                              <Bar dataKey="income" fill="#16a34a" name="Ingresos" />
                              <Bar dataKey="expense" fill="#dc2626" name="Gastos" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
        <EditAccountModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          account={cuenta}
        />
      </div>
    </Layout>
  )
}