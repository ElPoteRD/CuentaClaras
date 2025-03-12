import { useState, useEffect } from "react"
import { useAccount } from "@/hooks/use-account"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { CreditCard, Wallet, Building2, PiggyBank, PlusCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useNavigate } from "react-router-dom"
import { NewAccountModal } from "@/components/new-account-modal"
import Layout from "../Layout"
import { NewCategoryModal } from "@/components/new-category-modal";
import { useCategory } from "@/hooks/use-category";

import { useProfile } from "@/hooks/use-profile"

export default function Account() {
    const navigate = useNavigate()
    const [isModalOpen, setIsModalOpen] = useState(false)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [loading, setLoading] = useState(true)
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const { refreshProfile } = useProfile()
    const {
        accounts,
        error,
        refreshAccounts
    } = useAccount()
    const { categories, fetchCategories } = useCategory();
    // Efecto para cargar las cuentas
    useEffect(() => {
        if (accounts.length > 0) {
            setLoading(false);
            refreshProfile();
        }
    }, [accounts, refreshProfile]);

    // Efecto para cargar las categorías
    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    // Manejador para cerrar el modal de categorías
    const handleCategoryModalClose = () => {
        setIsCategoryModalOpen(false);
        fetchCategories(); // Actualizamos las categorías al cerrar el modal
    };

    // Calcular balance total
    const totalBalance = accounts.reduce((sum, account) => {
        return sum + (account.type === "crédito"
            ? -account.initialBalance
            : account.initialBalance)
    }, 0)

    // Función para manejar el cierre del modal y refrescar las cuentas
    const handleModalClose = () => {
        setIsModalOpen(false)
        refreshAccounts() // Refrescamos las cuentas al cerrar el modal
    }
    setTimeout(() => {
        if (accounts.length === 0) {
            return (
                <Layout>
                    <div className="container mx-auto p-6">
                        <div className="flex items-center justify-center h-64">
                            <div className="text-center">
                                <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent mx-auto mb-4"></div>
                                <p className="text-muted-foreground">Cargando datos...</p>
                            </div>
                        </div>
                    </div>
                </Layout>
            )
        }
    }, 5000);

    function getAccountTypeIcon(type: string): import("react").ReactNode {
        switch (type) {
            case "crédito":
                return <CreditCard className="h-6 w-6 text-primary" />;
            case "efectivo":
                return <Wallet className="h-6 w-6 text-primary" />;
            case "banco":
                return <Building2 className="h-6 w-6 text-primary" />;
            case "inversión":
                return <PiggyBank className="h-6 w-6 text-primary" />;
            default:
                return <PlusCircle className="h-6 w-6 text-primary" />;
        }
    }

    // Update the handleViewDetails function
    const handleViewDetails = (id: number) => {
        navigate(`/account/${id}`)
    }

    return (
        <Layout>
            <div className="container mx-auto p-6">
                {error && (
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <div className="bg-destructive/15 text-destructive px-4 py-2 rounded-md mb-4">
                                {error}
                            </div>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogTitle>Error</DialogTitle>
                            <DialogDescription>
                                {error}
                            </DialogDescription>
                        </DialogContent>
                    </Dialog>
                )}
                <div className="flex flex-col gap-6">
                    {/* Header section */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold">Cuentas y Productos</h1>
                            <p className="text-muted-foreground">Gestiona tus cuentas bancarias y productos financieros</p>
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={() => setIsModalOpen(true)}>
                                <PlusCircle className="mr-2 h-4 w-4" />Agregar Cuenta
                            </Button>
                        </div>
                    </div>

                    {/* Balance Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Balance Total</CardTitle>
                            <CardDescription>Suma de todos tus activos y pasivos</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {accounts.length > 0 ? (
                                <div className="space-y-3">
                                    {/* Group accounts by currency and calculate totals */}
                                    {Object.entries(
                                        accounts.reduce((acc, account) => {
                                            const currency = account.currency || 'USD';
                                            if (!acc[currency]) acc[currency] = 0;
                                            acc[currency] += account.type === "crédito"
                                                ? -account.initialBalance
                                                : account.initialBalance;
                                            return acc;
                                        }, {} as Record<string, number>)
                                    ).map(([currency, amount]) => (
                                        <div key={currency} className="flex justify-between items-center border-b pb-2 last:border-0">
                                            <span className="font-medium">{currency}</span>
                                            <span className="text-2xl font-bold">
                                                {new Intl.NumberFormat('es-ES', {
                                                    style: 'currency',
                                                    currency: currency,
                                                }).format(amount)}
                                            </span>
                                        </div>
                                    ))}
                                    <div className="pt-2 mt-2 border-t border-muted">
                                        <div className="text-sm text-muted-foreground">Balance total (todas las monedas)</div>
                                        <div className="text-3xl font-bold">
                                            ${totalBalance.toFixed(2)}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-3xl font-bold">$0.00</div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Tabs Section */}
                    <Tabs defaultValue="cuentas" className="space-y-4">
                        <TabsList>
                            <TabsTrigger value="cuentas">Mis Cuentas</TabsTrigger>
                            <TabsTrigger value="category">Categorías</TabsTrigger>
                        </TabsList>

                        {/* Cuentas Tab */}
                        <TabsContent value="cuentas" className="space-y-4">
                            {accounts.length === 0 ? (
                                <Card>
                                    <CardContent className="flex flex-col items-center justify-center h-40">
                                        <p className="text-muted-foreground mb-4">No tienes cuentas creadas aún</p>
                                        <Button onClick={() => setIsModalOpen(true)}>
                                            <PlusCircle className="mr-2 h-4 w-4" />Crear mi primera cuenta
                                        </Button>
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {accounts.map((account) => (
                                        <Card key={account.id} className="relative overflow-hidden">
                                            <CardHeader className="space-y-1">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-2">
                                                        {getAccountTypeIcon(account.type)}
                                                        <CardTitle className="text-xl">{account.name}</CardTitle>
                                                    </div>
                                                    <Badge variant={account.type === "crédito" ? "destructive" : "secondary"}>
                                                        {account.type.toUpperCase()}
                                                    </Badge>
                                                </div>
                                                <CardDescription>
                                                    {account.currency}
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="text-2xl font-bold">
                                                    ${account.initialBalance.toFixed(2)}
                                                </div>
                                            </CardContent>
                                            <CardFooter className="flex justify-between">
                                                <div className="space-y-1">
                                                    <div className="text-sm font-medium">
                                                        Fecha de creación
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {new Date(account.creationDate).toLocaleDateString()}
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => handleViewDetails(account.id)}
                                                    >
                                                        Ver detalles
                                                    </Button>
                                                </div>
                                            </CardFooter>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </TabsContent>
                        {/* Categorías Tab */}
                        <TabsContent value="category">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold">Categorías</h2>
                                <Button onClick={() => setIsCategoryModalOpen(true)}>
                                    <PlusCircle className="mr-2 h-4 w-4" /> Nueva Categoría
                                </Button>
                            </div>

                            {categories.length === 0 ? (
                                <Card>
                                    <CardContent className="flex flex-col items-center justify-center h-40">
                                        <p className="text-muted-foreground mb-4">No hay categorías creadas aún</p>
                                        <Button onClick={() => setIsCategoryModalOpen(true)}>
                                            <PlusCircle className="mr-2 h-4 w-4" />Crear mi primera categoría
                                        </Button>
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {categories.map((category) => (
                                        <Card key={category.id}>
                                            <CardHeader>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-2">
                                                        <CardTitle>{category.name}</CardTitle>
                                                    </div>
                                                </div>
                                            </CardHeader>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Modals */}
                <NewAccountModal
                    isOpen={isModalOpen}
                    onClose={handleModalClose}
                    onAddAccount={refreshAccounts}
                />
                <NewCategoryModal
                    isOpen={isCategoryModalOpen}
                    onClose={handleCategoryModalClose}
                />
            </div>
        </Layout>
    )
}

