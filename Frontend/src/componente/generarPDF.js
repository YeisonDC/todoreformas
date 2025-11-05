import jsPDF from "jspdf";
import "jspdf-autotable";

export async function generarPDF(datos, servicios) {
  const total =
    datos.valorCotizacion && datos.valorCotizacion !== ""
      ? Number(datos.valorCotizacion)
      : servicios.reduce(
          (acc, s) => acc + (s.cantidad || 0) * (s.precio || 0),
          0
        );

  const doc = new jsPDF();

  // Logo
  const logoUrl =
    "https://res.cloudinary.com/dvj1tw3ui/image/upload/v1762298998/afcbda62-db73-457b-a60b-27f95d1954db_msvvdk.jpg";
  const img = await fetch(logoUrl)
    .then((res) => res.blob())
    .then(
      (blob) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        })
    );

  doc.addImage(img, "JPEG", 150, 12, 35, 35);

  // Encabezado
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("COTIZACIÓN", 14, 20);

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("Todo en Reformas M&V", 14, 30);
  doc.text("Tel: +34 634 11 41 49", 14, 36);
  doc.text("todo.reformas.myv@gmail.com", 14, 42);

  doc.setDrawColor(0);
  doc.line(14, 52, 195, 52);

  // Cliente
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Cliente:", 14, 60);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(datos.cliente?.toUpperCase() || "—", 35, 60);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Dirección:", 14, 66);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(datos.direccion?.toUpperCase() || "—", 35, 66);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Fecha:", 130, 66);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(datos.fecha || "—", 150, 66);

  // Tabla de servicios
  const tabla = servicios.map((s) => [s.descripcion || "—"]);

  doc.autoTable({
    head: [["Servicio"]],
    body: tabla,
    startY: 78,
    margin: { left: 20, right: 20 },
    styles: {
      fontSize: 10,
      cellPadding: 3,
      halign: "left",
      valign: "middle",
      textColor: [40, 40, 40],
      lineColor: [220, 220, 220],
      lineWidth: 0.2,
    },
    headStyles: {
      fillColor: [60, 60, 60],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      halign: "left",
    },
    alternateRowStyles: { fillColor: [250, 250, 250] },
    tableLineColor: [200, 200, 200],
    tableLineWidth: 0.2,
  });

  // Total
  let y = doc.lastAutoTable.finalY + 10;
  const euro = String.fromCharCode(8364);
  const totalTexto = `Total de la cotización: ${euro} ${total.toLocaleString("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(60, 60, 60);
  doc.text(totalTexto, 20, y);

  // 🔹 Observaciones y Abonos en paralelo
  const columnaAncho = 85;
  let columnaY = y + 10;
  let alturaIzquierda = columnaY;
  let alturaDerecha = columnaY;

  // Observaciones (izquierda)
  if (datos.observaciones) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text("Observaciones:", 20, columnaY);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const obsText = doc.splitTextToSize(datos.observaciones, columnaAncho);
    doc.text(obsText, 20, columnaY + 6);
    alturaIzquierda += obsText.length * 5 + 12;
  }

  // Abonos (derecha)
  if (datos.abonos) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("Abonos:", 115, columnaY);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const abonosText = doc.splitTextToSize(datos.abonos, columnaAncho);
    doc.text(abonosText, 115, columnaY + 6);
    alturaDerecha += abonosText.length * 5 + 12;
  }

  // Calcular el final más bajo entre ambas columnas
  y = Math.max(alturaIzquierda, alturaDerecha) + 10;

  // Firma
  let firmaY = y + 7;
  if (firmaY > 270) {
    doc.addPage();
    firmaY = 40;
  }

  doc.setDrawColor(100);
  doc.line(20, firmaY, 80, firmaY);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Anderson Giraldo", 20, firmaY + 6);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Proveedor / Todo en Reformas M&V", 20, firmaY + 12);
  doc.text("Tel: +34 634 11 41 49", 20, firmaY + 18);

  doc.save(`Cotizacion_${datos.cliente || "cliente"}.pdf`);
}
