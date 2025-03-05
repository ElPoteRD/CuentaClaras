import { jsPDF } from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import FileSaver from "file-saver";

export interface ReportData {
  fecha: string;
  tipo: string;
  categoria: string;
  descripcion: string;
  monto: number;
  moneda: string;
  cuenta: string;
}

export interface ReportOptions {
  dateRange: { from: Date; to: Date } | undefined;
  type: 'resumen' | 'detallado' | 'categorias';
  includeIncome: boolean;
  includeExpenses: boolean;
  includeBalance: boolean;
  includeCategories: boolean;
}

export const generatePDF = async (data: ReportData[], options: ReportOptions) => {
  const doc = new jsPDF();
  
  // Configuración de cabecera
  doc.setFont("helvetica", "bold");
  doc.setFillColor(52, 152, 219);
  doc.rect(0, 0, doc.internal.pageSize.width, 40, "F");
  
  // Título y fecha
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.text("Reporte Financiero", 14, 25);
  
  // Agregar meta información
  doc.setProperties({
    title: 'Reporte Financiero',
    subject: 'Reporte de transacciones',
    author: 'CuentaClaras',
    keywords: 'finanzas, reporte, transacciones',
    creator: 'CuentaClaras App'
  });

  // Agrupar por moneda
  const groupedByMoneda = data.reduce((acc, item) => {
    if (!acc[item.moneda]) {
      acc[item.moneda] = [];
    }
    acc[item.moneda].push(item);
    return acc;
  }, {} as Record<string, ReportData[]>);

  // Generar resumen por moneda
  Object.entries(groupedByMoneda).forEach(([moneda, items], index) => {
    const yPosition = 90 + (index * 60);
    
    const totalIngresos = items
      .filter(item => item.tipo === "Ingreso")
      .reduce((sum, item) => sum + item.monto, 0);
      
    const totalGastos = items
      .filter(item => item.tipo === "Gasto")
      .reduce((sum, item) => sum + Math.abs(item.monto), 0);
      
    const balance = totalIngresos - totalGastos;

    // Cajas de resumen por moneda
    doc.setFillColor(241, 245, 249);
    doc.rect(14, yPosition, 180, 40, "F");
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.text(`Resumen en ${moneda}`, 20, yPosition + 15);
    
    doc.setFontSize(12);
    doc.text(`Ingresos: ${totalIngresos.toLocaleString('es-ES')} ${moneda}`, 20, yPosition + 25);
    doc.text(`Gastos: ${totalGastos.toLocaleString('es-ES')} ${moneda}`, 90, yPosition + 25);
    doc.text(`Balance: ${balance.toLocaleString('es-ES')} ${moneda}`, 160, yPosition + 25);
  });

  // Tabla detallada por moneda
  let currentY = 200;
  Object.entries(groupedByMoneda).forEach(([moneda, items]) => {
    // Título de la sección
    doc.setFontSize(14);
    doc.text(`Transacciones en ${moneda}`, 14, currentY);
    currentY += 10;

    // Configurar tabla
    (doc as any).autoTable({
      head: [["Fecha", "Tipo", "Categoría", "Cuenta", "Descripción", "Monto"]],
      body: items.map(item => [
        new Date(item.fecha).toLocaleDateString('es-ES'),
        item.tipo,
        item.categoria,
        item.cuenta,
        item.descripcion,
        {
          content: `${Math.abs(item.monto).toLocaleString('es-ES')} ${item.moneda}`,
          styles: {
            textColor: item.tipo === "Ingreso" ? [46, 125, 50] : [211, 47, 47],
            halign: 'right'
          }
        }
      ]),
      startY: currentY,
      styles: { fontSize: 10 },
      headStyles: {
        fillColor: [52, 152, 219],
        textColor: 255,
        fontStyle: 'bold'
      },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 20 },
        2: { cellWidth: 30 },
        3: { cellWidth: 30 },
        4: { cellWidth: 'auto' },
        5: { cellWidth: 30, halign: 'right' }
      }
    });

    currentY = (doc as any).lastAutoTable.finalY + 20;
    
    // Agregar nueva página si es necesario
    if (currentY > doc.internal.pageSize.height - 40) {
      doc.addPage();
      currentY = 20;
    }
  });

  // Agregar pie de página
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(
      `Página ${i} de ${pageCount}`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      { align: "center" }
    );
  }

  return doc.save(`reporte-financiero-${new Date().toISOString().slice(0,10)}.pdf`);
};

export const printReport = async (data: ReportData[], options: ReportOptions) => {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  const totalIngresos = data.filter((item) => item.monto > 0).reduce((sum, item) => sum + item.monto, 0);
  const totalGastos = data.filter((item) => item.monto < 0).reduce((sum, item) => sum + Math.abs(item.monto), 0);
  const balance = totalIngresos - totalGastos;

  const html = `
    <html>
      <head>
        <title>Reporte Financiero</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          
          body {
            font-family: 'Inter', sans-serif;
            padding: 20px;
            margin: 0;
            color: #1a1a1a;
          }
          
          .header {
            background-color: #3498db;
            color: white;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
          }
          
          .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
          }
          
          .header p {
            margin: 5px 0 0 0;
            opacity: 0.9;
          }
          
          .summary {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
          }
          
          .summary-card {
            background-color: #f8fafc;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          }
          
          .summary-card h3 {
            margin: 0;
            font-size: 14px;
            color: #64748b;
            font-weight: 600;
            text-transform: uppercase;
          }
          
          .summary-card p {
            margin: 10px 0 0 0;
            font-size: 24px;
            font-weight: 600;
          }
          
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            background-color: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          }
          
          th {
            background-color: #3498db;
            color: white;
            font-weight: 600;
            text-align: left;
            padding: 12px;
            font-size: 14px;
          }
          
          td {
            padding: 12px;
            border-bottom: 1px solid #e2e8f0;
            font-size: 14px;
          }
          
          tr:nth-child(even) {
            background-color: #f8fafc;
          }
          
          .amount-positive {
            color: #16a34a;
            font-weight: 600;
          }
          
          .amount-negative {
            color: #dc2626;
            font-weight: 600;
          }
          
          .footer {
            margin-top: 30px;
            text-align: center;
            color: #64748b;
            font-size: 12px;
          }
          
          @media print {
            body {
              padding: 0;
            }
            
            .header {
              background-color: #3498db !important;
              color: white !important;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            
            th {
              background-color: #3498db !important;
              color: white !important;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            
            .summary-card {
              break-inside: avoid;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Reporte Financiero</h1>
          <p>Generado el: ${new Date().toLocaleDateString()}</p>
          ${
            options.dateRange?.from && options.dateRange?.to
              ? `<p>Período: ${options.dateRange.from.toLocaleDateString()} - ${options.dateRange.to.toLocaleDateString()}</p>`
              : ""
          }
        </div>
        
        <div class="summary">
          <div class="summary-card">
            <h3>Ingresos Totales</h3>
            <p style="color: #16a34a">$${totalIngresos.toFixed(2)}</p>
          </div>
          <div class="summary-card">
            <h3>Gastos Totales</h3>
            <p style="color: #dc2626">$${totalGastos.toFixed(2)}</p>
          </div>
          <div class="summary-card">
            <h3>Balance</h3>
            <p style="color: ${balance >= 0 ? "#16a34a" : "#dc2626"}">$${balance.toFixed(2)}</p>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Tipo</th>
              <th>Categoría</th>
              <th>Descripción</th>
              <th style="text-align: right">Monto</th>
            </tr>
          </thead>
          <tbody>
            ${data
              .map(
                (item) => `
              <tr>
                <td>${new Date(item.fecha).toLocaleDateString()}</td>
                <td>${item.tipo}</td>
                <td>${item.categoria}</td>
                <td>${item.descripcion}</td>
                <td style="text-align: right" class="${item.monto > 0 ? "amount-positive" : "amount-negative"}">
                  $${Math.abs(item.monto).toFixed(2)}
                </td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
        
        <div class="footer">
          <p>© ${new Date().getFullYear()} CuentasClaras - Todos los derechos reservados</p>
        </div>
      </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.print();
};

export const generateExcel = async (data: ReportData[], options: ReportOptions) => {
  // Preparar datos para Excel con mejor formato
  const worksheet = XLSX.utils.json_to_sheet(
    data.map((item) => ({
      Fecha: new Date(item.fecha).toLocaleDateString(),
      Tipo: item.tipo,
      Categoría: item.categoria,
      Descripción: item.descripcion,
      Monto: item.monto,
    })),
  );

  // Ajustar ancho de columnas
  const colWidths = [
    { wch: 12 }, // Fecha
    { wch: 10 }, // Tipo
    { wch: 15 }, // Categoría
    { wch: 30 }, // Descripción
    { wch: 12 }, // Monto
  ];
  worksheet["!cols"] = colWidths;

  // Crear libro de trabajo
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Reporte Financiero");

  // Generar archivo
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const data2 = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

  FileSaver.saveAs(data2, "reporte-financiero.xlsx");
};

