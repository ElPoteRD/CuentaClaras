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
} from "@/components/ui/alert-dialog";

export function IngresosTable() {
  const { transactions, deleteTransaction, fetchTransactions, isLoading, error } = useTransaction();
  const { accounts, refetchAccounts } = useAccount();
  const [openAlert, setOpenAlert] = useState(false);
  const [selectedIngreso, setSelectedIngreso] = useState<any>(null);

  // Cargar transacciones al montar el componente
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Filtrar solo los ingresos
  const ingresos = transactions.filter(
    (transaction) => transaction.type === "Ingreso"
  );

  console.log('Ingresos filtrados:', ingresos);

  const getCurrency = (accountId: number) => {
    const account = accounts.find(acc => acc.id === accountId);
    return account?.currency || 'USD';
  };

  const getAccountName = (accountId: number) => {
    const account = accounts.find(acc => acc.id === accountId);
    return account?.name || 'Cuenta no encontrada';
  };

  const handleDeleteClick = (ingreso: any) => {
    const account = accounts.find(acc => acc.id === ingreso.accountId);
    if (!account) {
      toast.error("No se encontró la cuenta asociada");
      return;
    }
    setSelectedIngreso({ ...ingreso, account });
    setOpenAlert(true);
  };

  const confirmDelete = async () => {
    if (!selectedIngreso) return;

    try {
      const success = await deleteTransaction(selectedIngreso.id);

      if (success) {
        toast.success(`Ingreso eliminado correctamente`);
        await Promise.all([
          fetchTransactions(),
          refetchAccounts()
        ]);
      }
    } catch (error) {
      toast.error("Error al eliminar el ingreso");
      console.error('Error al eliminar la transacción:', error);
    } finally {
      setOpenAlert(false);
      setSelectedIngreso(null);
    }
  };

  if (isLoading) {
    return <div className="text-center p-4">Cargando ingresos...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 p-4">{error}</div>;
  }

  return (
    <>
      <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              {selectedIngreso && (
                <>
                  <p>Esta acción no se puede deshacer. Esto eliminará permanentemente el ingreso:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>
                      Monto: {new Intl.NumberFormat('es-ES', {
                        style: 'currency',
                        currency: selectedIngreso.account.currency || 'USD'
                      }).format(selectedIngreso.amount)}
                    </li>
                    <li>Cuenta: {selectedIngreso.account.name}</li>
                    <li>
                      El balance de la cuenta se reducirá en {new Intl.NumberFormat('es-ES', {
                        style: 'currency',
                        currency: selectedIngreso.account.currency || 'USD'
                      }).format(selectedIngreso.amount)}
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

      {/* Agregar un indicador visual del número de ingresos */}
      <div className="mb-2 text-sm text-muted-foreground">
        Total ingresos encontrados: {ingresos.length}
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
            {ingresos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No hay ingresos registrados
                </TableCell>
              </TableRow>
            ) : (
              ingresos.map((ingreso) => (
                <TableRow key={ingreso.id}>
                  <TableCell className="font-medium">
                    {ingreso.description}
                  </TableCell>
                  <TableCell>{ingreso.categoryId}</TableCell>
                  <TableCell>
                    {getAccountName(ingreso.accountId)}
                  </TableCell>
                  <TableCell>
                    {new Intl.NumberFormat('es-ES', {
                      style: 'currency',
                      currency: getCurrency(ingreso.accountId)
                    }).format(ingreso.amount)}
                  </TableCell>
                  <TableCell>
                    {new Date(ingreso.date).toLocaleDateString('es-ES', {
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
                        <DropdownMenuItem
                          onClick={() => {
                            // Aquí irá la lógica de edición
                          }}
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          <span>Editar</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDeleteClick(ingreso)}
                          className="text-red-600"
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Eliminar</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

