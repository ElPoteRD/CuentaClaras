import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, FileSpreadsheet, FileText, } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import Layout from "../Layout"
import { useTransaction } from "@/hooks/use-transaction"
import { useAccount } from "@/hooks/use-account"
import { generatePDF, generateExcel } from "@/service/report-service"
import type { DateRange } from "react-day-picker"

export default function Reporte() {
  const { transactions, isLoading, fetchTransactions } = useTransaction()
  const { accounts } = useAccount()
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  const filteredTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date)
    return (
      (!dateRange?.from || transactionDate >= dateRange.from) &&
      (!dateRange?.to || transactionDate <= dateRange.to)
    )
  })

  const handleExport = async (format: "pdf" | "excel") => {
    try {
      setIsGenerating(true)

      const reportData = filteredTransactions.map(transaction => ({
        ...transaction,
        account: accounts.find(a => a.id === transaction.accountId)?.name || 'Desconocida',
        currency: accounts.find(a => a.id === transaction.accountId)?.currency || 'USD',
        accountType: accounts.find(a => a.id === transaction.accountId)?.type || 'General'
      }))

      if (format === "pdf") {
        await generatePDF(reportData)
        toast.success("PDF generado correctamente")
      } else {
        await generateExcel(reportData)
        toast.success("Excel exportado exitosamente")
      }
    } catch (error) {
      console.error("Error al exportar:", error)
      toast.error("Error al generar el reporte")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Layout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Reportes Financieros</h1>
            <p className="text-muted-foreground">Exporta tus transacciones en diferentes formatos</p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button disabled={isGenerating}>
                <Download /> {isGenerating ? "Exportando..." : "Exportar"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleExport("pdf")}>
                <FileText className="mr-2 h-4 w-4" />
                PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("excel")}>
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Excel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Card>
          <CardContent>
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No hay transacciones en el período seleccionado
              </div>
            ) : (
              <div className="border rounded-lg">
                <div className="grid grid-cols-6 gap-4 p-3 bg-muted/50 font-medium">
                  <div>Fecha</div>
                  <div>Tipo</div>
                  <div>Descripción</div>
                  <div className="text-right">Monto</div>
                  <div>Cuenta</div>
                  <div>Moneda</div>
                </div>

                {filteredTransactions.map((transaction) => {
                  const account = accounts.find(a => a.id === transaction.accountId)
                  return (
                    <div key={transaction.id} className="grid grid-cols-6 gap-4 p-3 border-t">
                      <div>{new Date(transaction.date).toLocaleDateString('es-ES')}</div>
                      <div>
                        <Badge variant={transaction.type === 'Ingreso' ? 'default' : 'destructive'}>
                          {transaction.type}
                        </Badge>
                      </div>
                      <div className="truncate">{transaction.description}</div>
                      <div className={`text-right ${transaction.type === 'Ingreso' ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.type === 'Ingreso' ? '+' : '-'}
                        {transaction.amount.toLocaleString('es-ES', {
                          style: 'currency',
                          currency: account?.currency || 'USD',
                          minimumFractionDigits: 2
                        })}
                      </div>
                      <div>{account?.name || 'Desconocida'}</div>
                      <div>{account?.currency || 'USD'}</div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}