"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/date-range-picker"
import type { DateRange } from "react-day-picker"
import { addDays } from "date-fns"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ReportTable } from "@/components/report-table"
import { ReportChart } from "@/components/report-chart"
import { Download, FileSpreadsheet, FileText, Loader2, Printer } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { generatePDF, generateExcel, printReport } from "@/service/report-service"
import { toast } from "sonner"
import Layout from "../Layout"

// Datos de ejemplo (en una aplicación real, estos vendrían de una API)
const mockData = [
  {
    fecha: "2024-02-20",
    tipo: "Ingreso",
    categoria: "Salario",
    descripcion: "Pago mensual",
    monto: 3000.0,
  },
  {
    fecha: "2024-02-21",
    tipo: "Gasto",
    categoria: "Alimentación",
    descripcion: "Supermercado",
    monto: -150.0,
  },
  // ... más datos
]

export default function Report() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 30),
  })
  const [reportType, setReportType] = useState("detallado")
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedOptions, setSelectedOptions] = useState({
    ingresos: true,
    gastos: true,
    balance: true,
    categorias: true,
  })

  const handleGenerateReport = async (format: "pdf" | "excel" | "print") => {
    try {
      setIsGenerating(true)

      // Configurar opciones del reporte
      const options = {
        dateRange: date ? { from: date.from ?? new Date(), to: date.to ?? new Date() } : undefined,
        type: reportType,
        includeIncome: selectedOptions.ingresos,
        includeExpenses: selectedOptions.gastos,
        includeBalance: selectedOptions.balance,
        includeCategories: selectedOptions.categorias,
      }

      // Filtrar datos según las opciones seleccionadas
      let filteredData = [...mockData]
      if (!selectedOptions.ingresos) {
        filteredData = filteredData.filter((item) => item.monto < 0)
      }
      if (!selectedOptions.gastos) {
        filteredData = filteredData.filter((item) => item.monto > 0)
      }

      // Generar el reporte en el formato seleccionado
      switch (format) {
        case "pdf":
          await generatePDF(filteredData, options)
          toast.success("PDF generado")
          break
        case "excel":
          await generateExcel(filteredData, options)
          toast.success("Documento Excel generado")
          break
        case "print":
          await printReport(filteredData, options)
          toast.success("Imprension Generado")
          break
      }
    } catch (error) {
      console.error("Error al generar el reporte:", error)
      toast.error("Error al generar el reporte")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Layout>
    <div className="container mx-auto py-5 space-y-8">
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
          <CardDescription>Selecciona el período y los datos que deseas incluir en tu reporte</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="w-full sm:w-[300px]">
              <Label>Período</Label>
              <DatePickerWithRange date={date} onDateChange={setDate} />
            </div>
            <div className="w-full sm:w-[200px]">
              <Label>Tipo de Reporte</Label>
              <Select defaultValue="detallado">
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="resumen">Resumen</SelectItem>
                  <SelectItem value="detallado">Detallado</SelectItem>
                  <SelectItem value="categorias">Por Categorías</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label className="mb-2 block">Incluir en el reporte</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="ingresos"
                  checked={selectedOptions.ingresos}
                  onCheckedChange={(checked) =>
                    setSelectedOptions({ ...selectedOptions, ingresos: checked as boolean })
                  }
                />
                <label
                  htmlFor="ingresos"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Ingresos
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="gastos"
                  checked={selectedOptions.gastos}
                  onCheckedChange={(checked) => setSelectedOptions({ ...selectedOptions, gastos: checked as boolean })}
                />
                <label
                  htmlFor="gastos"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Gastos
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="balance"
                  checked={selectedOptions.balance}
                  onCheckedChange={(checked) => setSelectedOptions({ ...selectedOptions, balance: checked as boolean })}
                />
                <label
                  htmlFor="balance"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Balance
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="categorias"
                  checked={selectedOptions.categorias}
                  onCheckedChange={(checked) =>
                    setSelectedOptions({ ...selectedOptions, categorias: checked as boolean })
                  }
                />
                <label
                  htmlFor="categorias"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Categorías
                </label>
              </div>
            </div>
          </div>
        </CardContent>
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

