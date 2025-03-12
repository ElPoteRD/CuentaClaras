import { useState } from "react";
import { useAccount } from "@/hooks/use-account";
import { useTransaction } from "@/hooks/use-transaction";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useProfile } from "@/hooks/use-profile";
import { useCategory } from "@/hooks/use-category";

interface AgregarIngresoModalProps {
  isOpen: boolean
  onClose: (shouldRefresh?: boolean) => void
  onAddTransacction: () => void
}

export function AgregarIngresoModal({ isOpen, onClose }: AgregarIngresoModalProps) {
  const { profile: user } = useProfile();
  const { accounts } = useAccount();
  const { createTransaction } = useTransaction();
  const { categories, isLoading: loadingCategories } = useCategory();
  const [selectedAccount, setSelectedAccount] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    date: new Date(),
    categoryId: "",
    id: user?.id ?? 0
  });

  const handleAccountSelect = (accountId: string) => {
    setSelectedAccount(Number(accountId));
    // Verificar si la cuenta existe
    const account = accounts.find(acc => acc.id === Number(accountId));
    if (!account) {
      toast.error("Cuenta no válida");
      return;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.id) {
      toast.error("Usuario no autenticado");
      return;
    }

    if (!selectedAccount) {
      toast.error("Selecciona una cuenta");
      return;
    }

    try {
      const transactionData = {
        amount: Number(formData.amount),
        description: formData.description,
        date: formData.date,
        type: "Ingreso",
        accountId: selectedAccount,
        categoryId: Number(formData.categoryId),
        userId: user.id
      };

      console.log('Datos de la transacción:', transactionData); // Para debugging

      await createTransaction(transactionData);
      toast.success("Ingreso registrado exitosamente");

      // Limpiar el formulario
      setFormData({
        amount: "",
        description: "",
        date: new Date(),
        categoryId: "",
        id: user?.id ?? 0
      });

      onClose(true); // Indicamos que debe refrescar los datos
    } catch (error) {
      console.error('Error al crear la transacción:', error);
      toast.error("Error al registrar el ingreso");
    }
  };

  // Obtener la cuenta seleccionada
  const selectedAccountData = accounts.find(acc => acc.id === selectedAccount);

  if (accounts.length === 0) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-red-600 py-3">Algo salio mal😓</DialogTitle>
          </DialogHeader>
          <div className="p-6 text-center bg-amber-50 rounded-lg border border-amber-200 shadow-sm">
            <div className="flex flex-col items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <h3 className="text-lg font-medium text-amber-800">No hay cuentas disponibles</h3>
              <p className="text-amber-700">
                Por favor, agrega una cuenta antes de registrar un ingreso.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Agregar Ingreso</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Selector de cuenta */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cuenta" className="text-right">Cuenta</Label>
              <Select
                value={selectedAccount?.toString()}
                onValueChange={handleAccountSelect}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecciona una cuenta" />
                </SelectTrigger>
                <SelectContent>
                  {accounts?.length > 0 ? (
                    accounts.map((account) => (
                      <SelectItem
                        key={account.id}
                        value={account.id.toString()}
                      >
                        {account.name} - Saldo: {new Intl.NumberFormat('es-ES', {
                          style: 'currency',
                          currency: account.currency || 'USD',
                        }).format(account.initialBalance)}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="" disabled>
                      No hay cuentas disponibles
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Campo de monto con moneda dinámica */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="monto" className="text-right">
                Monto ({selectedAccountData?.currency || 'USD'})
              </Label>
              <Input
                id="monto"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                className="col-span-3"
                placeholder={`0.00 ${selectedAccountData?.currency || 'USD'}`}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="descripcion" className="text-right">Descripción</Label>
              <Input
                id="descripcion"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="col-span-3"
              />
            </div>
            {/* Selector de categoría */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="categoria" className="text-right">Categoría</Label>
              <Select
                value={formData.categoryId.toString()}
                onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: value }))}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder={
                    loadingCategories
                      ? "Cargando categorías..."
                      : "Selecciona una categoría"
                  } />
                </SelectTrigger>
                <SelectContent>
                  {loadingCategories ? (
                    <SelectItem value="" disabled>
                      Cargando categorías...
                    </SelectItem>
                  ) : categories.length > 0 ? (
                    categories.map((category) => (
                      <SelectItem
                        key={category.id}
                        value={category.id.toString()}
                      >
                        {category.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="" disabled>
                      No hay categorías disponibles
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Fecha</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "col-span-3 justify-start text-left font-normal",
                      !formData.date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.date ? format(formData.date, "PPP") : <span>Selecciona una fecha</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.date}
                    onSelect={(date) => date && setFormData(prev => ({ ...prev, date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={
                !selectedAccount ||
                !formData.amount ||
                !formData.description ||
                !formData.categoryId
              }
            >
              Guardar Ingreso
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

