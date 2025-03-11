import { useEffect, useState } from "react"
import { useAccount } from "@/hooks/use-account"
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
import { toast } from "sonner"
import { AccountEntity } from "@/entities/account"
import { useTransaction } from "@/hooks/use-transaction";
import { TransactionEntity } from "@/entities/transaction"
import { useCategory } from "@/hooks/use-category"

interface EditIngresoModalProps {
    isOpen: boolean;
    onClose: () => void;
    transaction: TransactionEntity | null;
}

interface EditAccountModalProps {
    isOpen: boolean
    onClose: () => void
    account: AccountEntity | null
}

export const EditAccountModal = ({ isOpen, onClose, account }: EditAccountModalProps) => {
    const { updateAccount, isLoading } = useAccount()
    const [formData, setFormData] = useState({
        name: "",
        type: "",
        initialBalance: "",
        currency: "USD"
    })

    useEffect(() => {
        if (account) {
            setFormData({
                name: account.name,
                type: account.type,
                initialBalance: account.initialBalance.toString(),
                currency: account.currency
            })
        }
    }, [account])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!account) return
        try {
            const updatedAccount = {
                name: formData.name,
                type: formData.type as "banco" | "crédito" | "dinero" | "inversión",
                initialBalance: Number(formData.initialBalance),
                currency: formData.currency
            }

            await updateAccount(account.id, updatedAccount)
            toast.success("Cuenta actualizada correctamente")
            onClose()
        } catch (err) {
            console.error("Error al actualizar la cuenta:", err)
            toast.error("Error al actualizar la cuenta")
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Editar Cuenta</DialogTitle>
                    <DialogDescription>
                        Modifica los detalles de la cuenta seleccionada
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Nombre
                            </Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="col-span-3"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="type" className="text-right">
                                Tipo
                            </Label>
                            <Select
                                value={formData.type}
                                onValueChange={(value) => setFormData({ ...formData, type: value })}
                                required
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Selecciona un tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="banco">Cuenta Bancaria</SelectItem>
                                    <SelectItem value="crédito">Crédito</SelectItem>
                                    <SelectItem value="dinero">Efectivo</SelectItem>
                                    <SelectItem value="inversión">Inversión</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="initialBalance" className="text-right">
                                Saldo Inicial
                            </Label>
                            <Input
                                id="initialBalance"
                                type="number"
                                value={formData.initialBalance}
                                onChange={(e) => setFormData({ ...formData, initialBalance: e.target.value })}
                                className="col-span-3"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="currency" className="text-right">
                                Moneda
                            </Label>
                            <Select
                                value={formData.currency}
                                onValueChange={(value) => setFormData({ ...formData, currency: value })}
                                required
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Selecciona moneda" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="DOP">Peso Dominicano (DOP)</SelectItem>
                                    <SelectItem value="USD">Dólar (USD)</SelectItem>
                                    <SelectItem value="EUR">Euro (EUR)</SelectItem>
                                    <SelectItem value="COP">Peso Colombiano (COP)</SelectItem>
                                    <SelectItem value="MXN">Peso Mexicano (MXN)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Guardando..." : "Guardar Cambios"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export const EditIngresoModal = ({ isOpen, onClose, transaction }: EditIngresoModalProps) => {
    const { updateTransaction, isLoading } = useTransaction();
    const { categories, isLoading: loadingCategories } = useCategory();
    const [formData, setFormData] = useState({
        description: "",
        amount: "",
        type: "Ingreso",
        category: "",
    });

    useEffect(() => {
        if (transaction) {
            setFormData({
                description: transaction.description || "",
                amount: transaction.amount.toString(),
                type: "Ingreso",
                category: transaction.categoryId?.toString() || "",
            });
        }
    }, [transaction]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (!transaction?.id) return;

            await updateTransaction(transaction.id, {
                description: formData.description,
                amount: Number(formData.amount),
                type: "Ingreso",
                categoryId: Number(formData.category)
            });

            toast.success("Ingreso actualizado correctamente");
            onClose();
        } catch (err) {
            console.error("Error al actualizar el ingreso:", err);
            toast.error("Error al actualizar el ingreso");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Editar Ingreso</DialogTitle>
                    <DialogDescription>
                        Modifica los detalles del ingreso seleccionado
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" className="text-right">
                                Descripción
                            </Label>
                            <Input
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="col-span-3"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="amount" className="text-right">
                                Monto
                            </Label>
                            <Input
                                id="amount"
                                type="number"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="categoria" className="text-right">Categoría</Label>
                            <Select
                                value={formData.category.toString()}
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

                        <DialogFooter>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? "Guardando..." : "Guardar Cambios"}
                            </Button>
                        </DialogFooter>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};