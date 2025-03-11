import { jsPDF } from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import FileSaver from "file-saver";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export interface EnhancedReportData {
  id: number;
  date: string;
  type: "Ingreso" | "Gasto";
  category: string;
  description: string;
  amount: number;
  account: string;
  currency: string;
  accountType: string;
}

const formatDate = (dateString: string) => 
  format(new Date(dateString), "dd MMM yyyy", { locale: es });

export const generatePDF = async (data: EnhancedReportData[]) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  
  // Modern header design
  doc.setFillColor(63, 81, 181);
  doc.rect(0, 0, pageWidth, 60, "F");
  
  // Header content
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.text("Reporte Financiero", 20, 35);
  doc.setFontSize(12);
  doc.text("Generado por CuentasClaras", 20, 45);

  // Summary section
  const summary = data.reduce((acc, item) => {
    acc.total += item.amount;
    item.type === "Ingreso" ? acc.income += item.amount : acc.expense += item.amount;
    return acc;
  }, { income: 0, expense: 0, total: 0 });

  // Summary table
  (doc as any).autoTable({
    startY: 70,
    head: [['Tipo', 'Monto']],
    body: [
      ['Ingresos', `+${summary.income.toLocaleString('es-ES')}`],
      ['Gastos', `-${summary.expense.toLocaleString('es-ES')}`],
      ['Balance Total', (summary.income - summary.expense).toLocaleString('es-ES')]
    ],
    styles: {
      fillColor: [255, 255, 255],
      textColor: [0, 0, 0],
      fontSize: 12,
    },
    columnStyles: {
      1: { cellWidth: 40, halign: 'right' }
    },
    headStyles: {
      fillColor: [63, 81, 181],
      textColor: 255
    }
  });

  // Main transactions table
  (doc as any).autoTable({
    startY: 110,
    head: [['Fecha', 'Cuenta', 'Tipo', 'Descripción', 'Monto']],
    body: data.map(item => [
      formatDate(item.date),
      item.account,
      item.type,
      item.description,
      {
        content: `${item.type === 'Ingreso' ? '+' : '-'}${item.amount.toLocaleString('es-ES', { 
          minimumFractionDigits: 2 
        })} ${item.currency}`,
        styles: { 
          textColor: item.type === 'Ingreso' ? [56, 142, 60] : [211, 47, 47],
          halign: 'right'
        }
      }
    ]),
    styles: {
      fontSize: 10,
      cellPadding: 2,
      fillColor: [255, 255, 255]
    },
    headStyles: {
      fillColor: [63, 81, 181],
      textColor: 255,
      fontSize: 11
    },
    alternateRowStyles: {
      fillColor: [245, 247, 250]
    },
    columnStyles: {
      0: { cellWidth: 25 },
      4: { cellWidth: 35 }
    }
  });

  doc.save(`reporte-financiero-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
};

export const generateExcel = async (data: EnhancedReportData[]) => {
  try {
    const worksheet = XLSX.utils.json_to_sheet(data.map(item => ({
      'Fecha': formatDate(item.date),
      'Cuenta': item.account,
      'Tipo de Cuenta': item.accountType,
      'Tipo': item.type,
      'Descripción': item.description,
      'Monto': {
        t: 'n',
        v: item.type === 'Ingreso' ? item.amount : -item.amount,
        z: `#,##0.00" ${item.currency}"`
      }
    })));

    worksheet['!cols'] = [
      { wch: 12 },  // Fecha
      { wch: 20 },  // Cuenta
      { wch: 15 },  // Tipo de Cuenta
      { wch: 10 },  // Tipo
      { wch: 35 },  // Descripción
      { wch: 15 }   // Monto
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transacciones");
    
    const excelBuffer = XLSX.write(workbook, { 
      bookType: "xlsx", 
      type: "array",
      cellStyles: true 
    });
    
    const blob = new Blob([excelBuffer], { 
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" 
    });
    
    FileSaver.saveAs(blob, `reporte-${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
  } catch (error) {
    console.error("Error generating Excel:", error);
    throw new Error("Failed to generate Excel report");
  }
};