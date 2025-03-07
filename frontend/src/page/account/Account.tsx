import { useState, useEffect } from "react"
import { useAccount } from "@/hooks/use-account"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreditCard, Wallet, Building2, PiggyBank, PlusCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useNavigate } from "react-router-dom"
import { NewAccountModal } from "@/components/new-account-modal"
import Layout from "../Layout"
import { AccountEntity } from "@/entities/account"
import { NewCategoryModal } from "@/components/new-category-modal";
import { useCategory } from "@/hooks/use-category";

export default function Account() {
    const navigate = useNavigate()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [loading, setLoading] = useState(true)
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

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
        }
    }, [accounts]);

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
    if (loading) {
        return (
            <Layout>
                <div className="container mx-auto p-6">
                    <p className="text-center">Cargando cuentas...</p>
                </div>
            </Layout>
        )
    }
    const handleViewDetails = (accountId: number) => {
        navigate(`/account/${accountId}`);
    };
    // Función para obtener el ícono según el tipo de cuenta
    const getAccountTypeIcon = (type: AccountEntity["type"]) => {
        switch (type) {
            case "banco":
                return <Building2 className="h-4 w-4" />;
            case "crédito":
                return <CreditCard className="h-4 w-4" />;
            case "dinero":
                return <Wallet className="h-4 w-4" />;
            case "inversión":
                return <PiggyBank className="h-4 w-4" />;
        }
    };
    return (
        <Layout>
            <div className="container mx-auto p-6">
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold">Cuentas y Productos</h1>
                            <p className="text-muted-foreground">Gestiona tus cuentas bancarias y productos financieros</p>
                        </div>
                        <Button onClick={() => setIsModalOpen(true)}><PlusCircle />Agregar Cuenta</Button>
                    </div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Balance Total</CardTitle>
                            <CardDescription>Suma de todos tus activos y pasivos</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">${totalBalance.toFixed(2)}</div>
                        </CardContent>
                    </Card>
                    <Tabs defaultValue="cuentas" className="space-y-4">
                        <TabsList>
                            <TabsTrigger value="cuentas">Mis Cuentas</TabsTrigger>
                            <TabsTrigger value="inversiones">Mis metas Financieras</TabsTrigger>
                            <TabsTrigger value="category">Categorias</TabsTrigger>
                        </TabsList>
                        <TabsContent value="cuentas" className="space-y-4">
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
                        </TabsContent>

                        {/* Modificamos los filtros para las pestañas */}
                        <TabsContent value="categorias">
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {accounts
                                    .filter((account) => account.type === "crédito")
                                    .map((account) => (
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
                        </TabsContent>
                        <TabsContent value="inversiones">
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {accounts
                                    .filter((account) => account.type === "inversión")
                                    .map((account) => (
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
                        </TabsContent>
                        <TabsContent value="category">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold">Categorías</h2>
                                <Button onClick={() => setIsCategoryModalOpen(true)}>
                                    <PlusCircle className="mr-2 h-4 w-4" /> Nueva Categoría
                                </Button>
                            </div>
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
                        </TabsContent>
                    </Tabs>
                </div>
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

