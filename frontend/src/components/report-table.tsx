import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const data = [
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
  {
    fecha: "2024-02-22",
    tipo: "Gasto",
    categoria: "Transporte",
    descripcion: "Gasolina",
    monto: -50.0,
  },
  {
    fecha: "2024-02-23",
    tipo: "Ingreso",
    categoria: "Freelance",
    descripcion: "Proyecto web",
    monto: 500.0,
  },
  {
    fecha: "2024-02-24",
    tipo: "Gasto",
    categoria: "Entretenimiento",
    descripcion: "Cine",
    monto: -30.0,
  },
]

export function ReportTable() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fecha</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead className="text-right">Monto</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{new Date(item.fecha).toLocaleDateString()}</TableCell>
              <TableCell>{item.tipo}</TableCell>
              <TableCell>{item.categoria}</TableCell>
              <TableCell>{item.descripcion}</TableCell>
              <TableCell className={`text-right ${item.monto > 0 ? "text-green-600" : "text-red-600"}`}>
                ${Math.abs(item.monto).toFixed(2)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

