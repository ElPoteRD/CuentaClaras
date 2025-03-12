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
interface EditGastoModalProps {
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

export const EditIngresoModal = ({
    isOpen,
    onClose,
    transaction,
}: EditIngresoModalProps) => {
    const { updateTransaction, isLoading } = useTransaction();
    const { categories, isLoading: loadingCategories } = useCategory();
    const { accounts } = useAccount();
    const [formData, setFormData] = useState({
        description: "",
        amount: "",
        type: "Ingreso",
        category: "",
        accountsId: "",
    });
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [formSubmitted, setFormSubmitted] = useState(false);

    useEffect(() => {
        if (transaction) {
            setFormData({
                description: transaction.description || "",
                amount: transaction.amount.toString(),
                type: "Ingreso",
                category: transaction.categoryId?.toString() || "",
                accountsId: transaction.accountId?.toString() || "",
            });
        }
    }, [transaction]);

    // Get the selected account data
    const selectedAccountData = accounts.find(
        (acc) => acc.id === Number(formData.accountsId)
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormSubmitted(true);
        setShowConfirmDialog(true);
    };

    const confirmUpdate = async () => {
        try {
            if (!transaction?.id) return;
            await updateTransaction(transaction.id, {
                description: formData.description,
                amount: Number(formData.amount),
                type: "Ingreso",
                categoryId: Number(formData.category),
            });

            toast.success("Ingreso actualizado correctamente");
            setShowConfirmDialog(false);
            onClose();
        } catch (err) {
            console.error("Error al actualizar el ingreso:", err);
            toast.error("Error al actualizar el ingreso");
            setShowConfirmDialog(false);
        }
    };

    return (
        <>
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
                            {/* Account selector */}
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="cuenta" className="text-right">
                                    Cuenta
                                </Label>
                                <Select
                                    value={formData.accountsId}
                                    onValueChange={(value) =>
                                        setFormData((prev) => ({ ...prev, accountId: value }))
                                    }
                                    disabled
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
                                                    {account.name} - Saldo:{" "}
                                                    {new Intl.NumberFormat("es-ES", {
                                                        style: "currency",
                                                        currency: account.currency || "USD",
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

                            {/* Amount field with dynamic currency */}
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="amount" className="text-right">
                                    Monto ({selectedAccountData?.currency || "USD"})
                                </Label>
                                <Input
                                    id="amount"
                                    type="number"
                                    value={formData.amount}
                                    onChange={(e) =>
                                        setFormData({ ...formData, amount: e.target.value })
                                    }
                                    className="col-span-3"
                                    placeholder={`0.00 ${selectedAccountData?.currency || "USD"}`}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="description" className="text-right">
                                    Descripción
                                </Label>
                                <Input
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({ ...formData, description: e.target.value })
                                    }
                                    className="col-span-3"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="categoria" className="text-right">
                                    Categoría
                                </Label>
                                <Select
                                    value={formData.category.toString()}
                                    onValueChange={(value) =>
                                        setFormData((prev) => ({ ...prev, category: value }))
                                    }
                                >
                                    <SelectTrigger className="col-span-3">
                                        <SelectValue
                                            placeholder={
                                                loadingCategories
                                                    ? "Cargando categorías..."
                                                    : "Selecciona una categoría"
                                            }
                                        />
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
                                <Button
                                    type="submit"
                                    disabled={
                                        isLoading ||
                                        !formData.accountsId ||
                                        !formData.amount ||
                                        !formData.description ||
                                        !formData.category
                                    }
                                >
                                    {isLoading ? "Guardando..." : "Guardar Cambios"}
                                </Button>
                            </DialogFooter>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Confirmar cambios?</AlertDialogTitle>
                        <AlertDialogDescription className="space-y-2">
                            <p>¿Estás seguro de que deseas guardar los siguientes cambios?</p>
                            <ul className="list-disc list-inside space-y-1">
                                <li>
                                    <span className="font-medium">Descripción:</span>{" "}
                                    {formData.description}
                                </li>
                                <li>
                                    <span className="font-medium">Monto:</span>{" "}
                                    {new Intl.NumberFormat("es-ES", {
                                        style: "currency",
                                        currency: selectedAccountData?.currency || "USD",
                                    }).format(Number(formData.amount))}
                                </li>
                                <li>
                                    <span className="font-medium">Categoría:</span>{" "}
                                    {categories.find(
                                        (cat) => cat.id === Number(formData.category)
                                    )?.name || "No especificada"}
                                </li>
                            </ul>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setShowConfirmDialog(false)}>
                            Cancelar
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmUpdate}
                            className="bg-primary hover:bg-primary/90"
                        >
                            Confirmar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

{/*Gasto Modal*/ }
export const EditGastoModal = ({ isOpen, onClose, transaction }: EditGastoModalProps) => {
    const { updateTransaction, isLoading } = useTransaction();
    const { categories, isLoading: loadingCategories } = useCategory();
    const { accounts } = useAccount();
    const [formData, setFormData] = useState({
        description: "",
        amount: "",
        type: "Gasto",
        category: "",
        accountsId: ""
    });
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [formSubmitted, setFormSubmitted] = useState(false);

    useEffect(() => {
        if (transaction) {
            setFormData({
                description: transaction.description || "",
                amount: transaction.amount.toString(),
                type: "Gasto",
                category: transaction.categoryId?.toString() || "",
                accountsId: transaction.accountId?.toString() || ""
            });
        }
    }, [transaction]);

    // Get the selected account data
    const selectedAccountData = accounts.find(acc => acc.id === Number(formData.accountsId));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormSubmitted(true);
        setShowConfirmDialog(true);
    };

    const confirmUpdate = async () => {
        try {
            if (!transaction?.id) return;
            await updateTransaction(transaction.id, {
              description: formData.description,
              amount: Number(formData.amount),
              type: "Gasto",
              categoryId: Number(formData.category),
            });

            toast.success("Gasto actualizado correctamente");
            setShowConfirmDialog(false);
            onClose();
        } catch (err) {
            console.error("Error al actualizar el Gasto:", err);
            toast.error("Error al actualizar el Gasto");
            setShowConfirmDialog(false);
        }
    };

    return (
        <>
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Editar Gasto</DialogTitle>
                        <DialogDescription>
                            Modifica los detalles del Gasto seleccionado
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-4 py-4">
                            {/* Account selector */}
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="cuenta" className="text-right">Cuenta</Label>
                                <Select
                                    value={formData.accountsId}
                                    onValueChange={(value) => setFormData(prev => ({ ...prev, accountId: value }))}
                                    disabled
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

                            {/* Amount field with dynamic currency */}
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="amount" className="text-right">
                                    Monto ({selectedAccountData?.currency || 'USD'})
                                </Label>
                                <Input
                                    id="amount"
                                    type="number"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                    className="col-span-3"
                                    placeholder={`0.00 ${selectedAccountData?.currency || 'USD'}`}
                                    required
                                />
                            </div>
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
                                <Label htmlFor="categoria" className="text-right">Categoría</Label>
                                <Select
                                    value={formData.category.toString()}
                                    onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
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
                                <Button
                                    type="submit"
                                    disabled={isLoading || !formData.accountsId || !formData.amount || !formData.description || !formData.category}
                                >
                                    {isLoading ? "Guardando..." : "Guardar Cambios"}
                                </Button>
                            </DialogFooter>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Confirmar cambios?</AlertDialogTitle>
                        <AlertDialogDescription className="space-y-2">
                            <p>¿Estás seguro de que deseas guardar los siguientes cambios?</p>
                            <ul className="list-disc list-inside space-y-1">
                                <li>
                                    <span className="font-medium">Descripción:</span> {formData.description}
                                </li>
                                <li>
                                    <span className="font-medium">Monto:</span> {new Intl.NumberFormat('es-ES', {
                                        style: 'currency',
                                        currency: selectedAccountData?.currency || 'USD'
                                    }).format(Number(formData.amount))}
                                </li>
                                <li>
                                    <span className="font-medium">Categoría:</span> {
                                        categories.find(cat => cat.id === Number(formData.category))?.name || 'No especificada'
                                    }
                                </li>
                            </ul>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setShowConfirmDialog(false)}>
                            Cancelar
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmUpdate}
                            className="bg-primary hover:bg-primary/90"
                        >
                            Confirmar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};