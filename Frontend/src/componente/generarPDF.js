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

  // Cargar logo
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
    alternateRowStyles: {
      fillColor: [250, 250, 250],
    },
    tableLineColor: [200, 200, 200],
    tableLineWidth: 0.2,
  });

  // Total
  let y = doc.lastAutoTable.finalY + 10;
  const totalTexto = `Total de la cotización: €${total.toLocaleString("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(60, 60, 60);
  doc.text(totalTexto, 20, y);

  // Observaciones
  if (datos.observaciones) {
    y += 12;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text("Observaciones:", 20, y);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const textLines = doc.splitTextToSize(datos.observaciones, 170);
    doc.text(textLines, 20, y + 6);
    y += textLines.length * 5 + 6;
  }

  // Footer
  const footerY = y + 15;

  // Información de pago
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Información de pago", 20, footerY);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  let pagoY = footerY + 6;
  if (datos.pago?.responsable) {
    doc.text(datos.pago.responsable, 20, pagoY);
    pagoY += 6;
  }
  if (datos.pago?.banco) {
    doc.text(datos.pago.banco, 20, pagoY);
    pagoY += 6;
  }
  if (datos.pago?.cuenta) {
    doc.text(`Cuenta: ${datos.pago.cuenta}`, 20, pagoY);
    pagoY += 6;
  }
  if (datos.pago?.fechaPago) {
    doc.text(`Fecha de pago: ${datos.pago.fechaPago}`, 20, pagoY);
    pagoY += 6;
  }

  // Contacto
  doc.setFont("helvetica", "bold");
  doc.text("Contacto", 130, footerY);
  doc.setFont("helvetica", "normal");
  let contactoY = footerY + 6;
  if (datos.contacto?.telefono) {
    doc.text(`Tel: ${datos.contacto.telefono}`, 130, contactoY);
    contactoY += 6;
  }
  if (datos.contacto?.correo) {
    doc.text(datos.contacto.correo, 130, contactoY);
    contactoY += 6;
  }
  if (datos.contacto?.direccion) {
    doc.text(datos.contacto.direccion, 130, contactoY);
  }

  doc.save(`Cotizacion_${datos.cliente || "cliente"}.pdf`);
}
