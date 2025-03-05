"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { DateRange } from "react-day-picker"
import { addDays } from "date-fns"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ReportTable } from "@/components/report-table"
import { ReportChart } from "@/components/report-chart"
import { Download, FileSpreadsheet, FileText, Loader2, Printer } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { generatePDF, generateExcel, printReport } from "@/service/report-service"
import { toast } from "sonner"
import Layout from "../Layout"
import { useTransaction } from "@/hooks/use-transaction";
import { useCategory } from "@/hooks/use-category";
import { useAccount } from "@/hooks/use-account";

export default function Reporte() {
  const { transactions, fetchTransactions } = useTransaction();
  const { categories } = useCategory();
  const { accounts } = useAccount();
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 30),
  });
  const [reportType, setReportType] = useState("detallado")
  const [isGenerating, setIsGenerating] = useState(false)

  const [selectedOptions, setSelectedOptions] = useState({
    ingresos: true,
    gastos: true,
    balance: true,
    categorias: true,
  })

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleGenerateReport = async (format: "pdf" | "excel" | "print") => {
    try {
      setIsGenerating(true);

      // Configurar opciones del reporte
      const cons = {
        dateRange: date ? {
          from: date.from ?? new Date(),
          to: date.to ?? new Date()
        } : undefined,
        type: reportType,
        includeIncome: selectedOptions.ingresos,
        includeExpenses: selectedOptions.gastos,
        includeBalance: selectedOptions.balance,
        includeCategories: selectedOptions.categorias,
      };

      // Filtrar transacciones según las opciones seleccionadas
      const filteredTransactions = transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return (
          (!date?.from || transactionDate >= date.from) &&
          (!date?.to || transactionDate <= date.to) &&
          ((selectedOptions.ingresos && transaction.type === "Ingreso") ||
            (selectedOptions.gastos && transaction.type === "Gasto"))
        );
      });

      // Preparar datos para el reporte
      const reportData = filteredTransactions.map(transaction => ({
        fecha: new Date(transaction.date).toISOString(),
        tipo: transaction.type === "Ingreso" ? "Ingreso" : "Gasto",
        categoria: categories.find(cat => cat.id === transaction.categoryId)?.name || "Sin categoría",
        descripcion: transaction.description,
        monto: transaction.amount,
        cuenta: accounts.find(acc => acc.id === transaction.accountId)?.name || "Cuenta desconocida",
        moneda: accounts.find(acc => acc.id === transaction.accountId)?.currency || "EUR"
      }));

      // Generar el reporte en el formato seleccionado
      switch (format) {
        case "pdf":
          await generatePDF(reportData, cons);
          toast.success("PDF generado correctamente");
          break;
        case "excel":
          await generateExcel(reportData, cons);
          toast.success("Excel generado correctamente");
          break;
        case "print":
          await printReport(reportData, cons);
          toast.success("Documento enviado a impresión");
          break;
      }
    } catch (error) {
      console.error("Error al generar el reporte:", error);
      toast.error("Error al generar el reporte");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-10 space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Generar Reporte</h2>
            <p className="text-muted-foreground">Personaliza y exporta tus reportes financieros</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button disabled={isGenerating}>
                {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                {isGenerating ? "Generando..." : "Exportar"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleGenerateReport("pdf")}>
                <FileText className="mr-2 h-4 w-4" />
                Exportar como PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleGenerateReport("excel")}>
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Exportar como Excel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleGenerateReport("print")}>
                <Printer className="mr-2 h-4 w-4" />
                Imprimir reporte
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Configuración del Reporte</CardTitle>
            <CardDescription>Selecciona el período y los datos que deseas incluir</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vista Previa del Reporte</CardTitle>
            <CardDescription>Visualiza cómo quedará tu reporte antes de exportarlo</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="tabla" className="space-y-4">
              <TabsList>
                <TabsTrigger value="tabla">Vista de Tabla</TabsTrigger>
                <TabsTrigger value="grafico">Vista de Gráfico</TabsTrigger>
              </TabsList>
              <TabsContent value="tabla">
                <ReportTable />
              </TabsContent>
              <TabsContent value="grafico">
                <ReportChart />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

