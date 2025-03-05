import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useState, useEffect } from "react"
import { useTransaction } from "@/hooks/use-transaction"
import { useCategory } from "@/hooks/use-category"
import { useAccount } from "@/hooks/use-account"
import { Input } from "@/components/ui/input"
import { DatePickerWithRange } from "@/components/date-range-picker"
import { DateRange } from "react-day-picker"

export function ReportTable() {
  const { transactions, fetchTransactions, isLoading } = useTransaction()
  const { categories } = useCategory()
  const { accounts } = useAccount()
  const [filteredTransactions, setFilteredTransactions] = useState(transactions)
  const [searchTerm, setSearchTerm] = useState("")
  const [dateRange, setDateRange] = useState<DateRange | undefined>()

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  useEffect(() => {
    let filtered = [...transactions]

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(transaction =>
        transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtrar por rango de fechas
    if (dateRange?.from && dateRange?.to) {
      filtered = filtered.filter(transaction => {
        const transactionDate = new Date(transaction.date)
        return transactionDate >= dateRange.from! &&
          transactionDate <= dateRange.to!
      })
    }

    setFilteredTransactions(filtered)
  }, [transactions, searchTerm, dateRange])

  const getCategoryName = (categoryId: number) => {
    const category = categories.find(cat => cat.id === categoryId)
    return category?.name || 'Categoría no encontrada'
  }

  const getAccountCurrency = (accountId: number) => {
    const account = accounts.find(acc => acc.id === accountId)
    return account?.currency || 'EUR'
  }



  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-2 flex-1">
          <Input
            placeholder="Buscar por descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <DatePickerWithRange date={dateRange} onDateChange={setDateRange} />
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-4">Cargando transacciones...</div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Cuenta</TableHead>
                <TableHead className="text-right">Monto</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    No se encontraron transacciones
                  </TableCell>
                </TableRow>
              ) : (
                filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                    <TableCell>{transaction.type === 'Ingreso' ? 'Ingreso' : 'Gasto'}</TableCell>
                    <TableCell>{getCategoryName(transaction.categoryId)}</TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>{getAccountCurrency(transaction.accountId)}</TableCell>
                    <TableCell
                      className={`text-right ${transaction.type === 'Ingreso' ? "text-green-600" : "text-red-600"
                        }`}
                    >
                      {new Intl.NumberFormat('es-ES', {
                        style: 'currency',
                        currency: getAccountCurrency(transaction.accountId)
                      }).format(Math.abs(transaction.amount))}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}

