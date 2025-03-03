import { useState, useEffect } from "react"
import { useAccount } from "@/hooks/use-account"
import { useProfile } from "@/hooks/use-profile"
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

interface NewAccountModalProps {
    isOpen: boolean
    onClose: () => void
    onAddAccount: () => void
}

export function NewAccountModal({ isOpen, onClose }: NewAccountModalProps) {
    const { profile, isLoading: profileLoading } = useProfile()
    const { createAccount, loading, error } = useAccount()

    const [formData, setFormData] = useState({
        name: "",
        type: "",
        initialBalance: "",
        currency: "USD"
    })
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!profile) {
            toast.error("No se encontró información del usuario")
            return
        }
        try {
            const newAccount = {
                name: formData.name,
                type: formData.type as "banco" | "crédito" | "dinero" | "inversión",
                initialBalance: Number(formData.initialBalance),
                currency: formData.currency,
                userId: profile.id
            }
            const response = await createAccount(newAccount)
            if (response) {
                // Limpiamos el formulario y cerramos el modal
                setFormData({
                    name: "",
                    type: "",
                    initialBalance: "",
                    currency: "USD"
                })
                onClose()
            }
        } catch (err) {
            console.error("Error al crear la cuenta:", err)
            toast.error("Error al crear la cuenta")
        }
    }
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Agregar Nueva Cuenta</DialogTitle>
                    <DialogDescription>
                        Ingresa los detalles de tu nueva cuenta o producto financiero.
                    </DialogDescription>
                </DialogHeader>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                {profileLoading ? (
                    <div className="text-center py-4">
                        <p>Cargando información del usuario...</p>
                    </div>
                ) : !profile ? (
                    <div className="text-center py-4 text-red-500">
                        <p>No se pudo cargar la información del usuario</p>
                    </div>
                ) : (
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
                            <Button
                                type="submit"
                                disabled={loading || profileLoading}
                            >
                                {loading ? "Creando..." : "Agregar Cuenta"}
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    )
}

