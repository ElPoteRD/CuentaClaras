import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"

const data = [
  {
    name: "Ene",
    ingresos: 4000,
    gastos: 2400,
  },
  {
    name: "Feb",
    ingresos: 3000,
    gastos: 1398,
  },
  {
    name: "Mar",
    ingresos: 2000,
    gastos: 9800,
  },
  {
    name: "Abr",
    ingresos: 2780,
    gastos: 3908,
  },
  {
    name: "May",
    ingresos: 1890,
    gastos: 4800,
  },
  {
    name: "Jun",
    ingresos: 2390,
    gastos: 3800,
  },
]

export function ReportChart() {
  return (
    <div className="w-full aspect-[16/9]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="ingresos" fill="#4ade80" name="Ingresos" />
          <Bar dataKey="gastos" fill="#f87171" name="Gastos" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

