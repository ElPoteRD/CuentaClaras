import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Pencil, Trash } from "lucide-react"
import { useState, useEffect } from "react";
import { useTransaction } from "@/hooks/use-transaction";
import { useAccount } from "@/hooks/use-account";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { EditGastoModal } from "./use-edits";



export function GastosTable() {
  const { transactions, deleteTransaction, fetchTransactions, isLoading, error, } = useTransaction();
  const { accounts, refetchAccounts } = useAccount();
  const [openAlert, setOpenAlert] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedGasto, setSelectedGasto] = useState<any>(null);
  const [gastos, setGastos] = useState<any[]>([]);


  // Efecto para cargar transacciones iniciales
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Efecto para filtrar y actualizar gastos cuando cambien las transacciones
  useEffect(() => {
    const filteredGastos = transactions.filter(
      (transaction) => transaction.type === "Gasto"
    );
    setGastos(filteredGastos);
  }, [transactions]);

  const getCurrency = (accountId: number) => {
    const account = accounts.find(acc => acc.id === accountId);
    return account?.currency || 'USD';
  };

  const getAccountName = (accountId: number) => {
    const account = accounts.find(acc => acc.id === accountId);
    return account?.name || 'Cuenta no encontrada';
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDeleteClick = (gasto: any) => {
    const account = accounts.find(acc => acc.id === gasto.accountId);
    if (!account) {
      toast.error("No se encontró la cuenta asociada");
      return;
    }
    setSelectedGasto({ ...gasto, account });
    setOpenAlert(true);
  };

  const confirmDelete = async () => {
    if (!selectedGasto) return;
    try {
      const success = await deleteTransaction(selectedGasto.id);
      if (success) {
        toast.success(`Gasto eliminado correctamente`);
        // Actualizar la lista de transacciones y el balance de las cuentas
        await Promise.all([
          fetchTransactions(),
          refetchAccounts()
        ]);
      }
    } catch (error) {
      toast.error("Error al eliminar el gasto");
      console.error('Error al eliminar la transacción:', error);
    } finally {
      setOpenAlert(false);
      setSelectedGasto(null);
    }
  };
  const handleEditClick = (gasto: any) => {
    const account = accounts.find(acc => acc.id === gasto.accountId);
    const enrichedGasto = {
      ...gasto,
      account: account || { currency: "USD", name: "Unknown Account" },
    };
    setSelectedGasto(enrichedGasto);
    setIsEditModalOpen(true);
  };

  return (
    <>
      <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              {selectedGasto && (
                <>
                  <p>Esta acción no se puede deshacer. Esto eliminará permanentemente el gasto:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>
                      Monto: {new Intl.NumberFormat('es-ES', {
                        style: 'currency',
                        currency: selectedGasto.account.currency || 'USD'
                      }).format(selectedGasto.amount)}
                    </li>
                    <li>Cuenta: {selectedGasto.account.name}</li>
                    <li>
                      El balance de la cuenta aumentará en {new Intl.NumberFormat('es-ES', {
                        style: 'currency',
                        currency: selectedGasto.account.currency || 'USD'
                      }).format(selectedGasto.amount)}
                    </li>
                  </ul>
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* Mensaje de error */}
      {error && <div className="text-red-500">{error}</div>}

      {/* Contador de gastos */}
      <div className="mb-2 text-sm text-muted-foreground">
        Total gastos encontrados: {gastos.length}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Concepto</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Cuenta</TableHead>
              <TableHead>Monto</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {gastos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No hay gastos registrados
                </TableCell>
              </TableRow>
            ) : (
              gastos.map((gasto) => (
                <TableRow key={gasto.id}>
                  <TableCell className="font-medium">
                    {gasto.description}
                  </TableCell>
                  <TableCell>{gasto.categoryId}</TableCell>
                  <TableCell>{getAccountName(gasto.accountId)}</TableCell>
                  <TableCell>
                    {new Intl.NumberFormat('es-ES', {
                      style: 'currency',
                      currency: getCurrency(gasto.accountId)
                    }).format(gasto.amount)}
                  </TableCell>
                  <TableCell>
                    {new Date(gasto.date).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menú</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleEditClick(gasto)} >
                          <Pencil className="mr-2 h-4 w-4" />
                          <span>Editar</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDeleteClick(gasto)}
                          className="text-red-600"
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          <span>Eliminar</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <EditGastoModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedGasto(null);
            fetchTransactions(); // Refresh data after editing
          }}
          transaction={selectedGasto}
        />
      </div>
    </>
  );
}
