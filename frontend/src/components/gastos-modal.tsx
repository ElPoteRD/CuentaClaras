import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useProfile } from "@/hooks/use-profile";
import { useAccount } from "@/hooks/use-account";
import { useTransaction } from "@/hooks/use-transaction";
import { useCategory } from "@/hooks/use-category";
import { toast } from "sonner";

interface AgregarGastoModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AgregarGastoModal({ isOpen, onClose }: AgregarGastoModalProps) {
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
    accountId: "",
    id: user?.id ?? 0
  });

  // Obtener la cuenta seleccionada
  const selectedAccountData = accounts.find(acc => acc.id === selectedAccount);

  // Filtrar categorías de tipo Gasto


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.id) {
      toast.error("Usuario no autenticado");
      return;
    }

    if (!formData.categoryId || !formData.accountId) {
      toast.error("Selecciona una cuenta y categoría");
      return;
    }

    try {
      await createTransaction({
        amount: Number(formData.amount),
        description: formData.description,
        date: formData.date,
        type: "Gasto",
        accountId: Number(formData.accountId),
        categoryId: Number(formData.categoryId),
        userId: user.id,
        id: 0
      });

      toast.success("Gasto registrado exitosamente");
      setFormData({
        amount: "",
        description: "",
        date: new Date(),
        categoryId: "",
        accountId: "",
        id: user?.id ?? 0
      });
      onClose(true);
    } catch (error) {
      console.error('Error al crear el gasto:', error);
      toast.error("Error al registrar el gasto");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Agregar Nuevo Gasto</DialogTitle>
          <DialogDescription>
            Ingresa los detalles del nuevo gasto aquí. Haz clic en guardar cuando hayas terminado.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Selector de cuenta */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cuenta" className="text-right">Cuenta</Label>
              <Select
                value={formData.accountId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, accountId: value }))}
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
                          currency: account.currency || 'USD'
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
                required
              />
            </div>

            {/* Campo de descripción */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="descripcion" className="text-right">Descripción</Label>
              <Input
                id="descripcion"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="col-span-3"
                required
              />
            </div>

            {/* Selector de categoría */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="categoria" className="text-right">Categoría</Label>
              <Select
                value={formData.categoryId}
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

            {/* Selector de fecha */}
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
              disabled={!formData.accountId || !formData.amount || !formData.description || !formData.categoryId}
            >
              Guardar Gasto
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

