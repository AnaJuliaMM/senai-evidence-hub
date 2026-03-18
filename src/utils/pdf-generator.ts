import jsPDF from "jspdf";

interface AtividadeData {
  nome: string;
  descricao: string;
  data: string;
  local: string;
  fotosUrls: string[];
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

export async function gerarPdfAtividade(atividade: AtividadeData): Promise<Blob> {
  const doc = new jsPDF("p", "mm", "a4");

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const margin = 20;
  const contentWidth = pageWidth - margin * 2;

  let y = 20;

  /* ================================
     HEADER
  ================================= */

  doc.setFillColor(0, 90, 156);
  doc.rect(0, 0, pageWidth, 35, "F");

  doc.setFillColor(200, 30, 30);
  doc.rect(0, 35, pageWidth, 4, "F");

  doc.setTextColor(255, 255, 255);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);

  doc.text("RELATÓRIO DE EVIDÊNCIA", pageWidth / 2, 18, { align: "center" });

  doc.setFontSize(14);
  doc.text("SENAI", pageWidth / 2, 28, { align: "center" });

  y = 50;

  /* ================================
     CARD CONTAINER
  ================================= */

  doc.setDrawColor(220, 220, 220);
  doc.setFillColor(255, 255, 255);

  doc.roundedRect(
    margin - 5,
    y - 10,
    contentWidth + 10,
    120,
    4,
    4,
    "FD"
  );

  /* ================================
     FIELD FUNCTION
  ================================= */

  const addField = (label: string, value: string) => {
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.setFont("helvetica", "bold");

    doc.text(label.toUpperCase(), margin, y);

    y += 5;

    doc.setFontSize(12);
    doc.setTextColor(40, 40, 40);
    doc.setFont("helvetica", "normal");

    const lines = doc.splitTextToSize(value, contentWidth);

    doc.text(lines, margin, y);

    y += lines.length * 6 + 6;
  };

  /* ================================
     DATA FORMAT
  ================================= */

  const dataFormatada = new Date(
    atividade.data + "T00:00:00"
  ).toLocaleDateString("pt-BR");

  /* ================================
     CONTENT
  ================================= */

  addField("Responsável", atividade.nome);

  addField("Descrição da atividade", atividade.descricao);

  addField("Data", dataFormatada);

  addField("Local", atividade.local);

  /* ================================
     PHOTOS
  ================================= */

  if (atividade.fotosUrls.length > 0) {
    y += 6;

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 90, 156);

    doc.text("REGISTROS FOTOGRÁFICOS", margin, y);

    y += 10;

    const imgWidth = (contentWidth - 10) / 2;
    let x = margin;

    for (let i = 0; i < atividade.fotosUrls.length; i++) {
      const url = atividade.fotosUrls[i];

      try {
        const img = await loadImage(url);

        const ratio = img.height / img.width;
        const imgHeight = imgWidth * ratio;

        if (y + imgHeight > pageHeight - 30) {
          doc.addPage();
          y = 20;
        }

        doc.addImage(img, "JPEG", x, y, imgWidth, imgHeight);

        if (x === margin) {
          x = margin + imgWidth + 10;
        } else {
          x = margin;
          y += imgHeight + 10;
        }
      } catch {
        doc.setTextColor(150, 150, 150);
        doc.text("[imagem não disponível]", x, y);
      }
    }
  }

  /* ================================
     FOOTER
  ================================= */

  const pageCount = doc.getNumberOfPages();

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);

    doc.setDrawColor(220, 220, 220);
    doc.line(margin, pageHeight - 18, pageWidth - margin, pageHeight - 18);

    doc.setFontSize(8);
    doc.setTextColor(140, 140, 140);

    doc.text(
      "SENAI • Registro de Evidências de Atividades",
      margin,
      pageHeight - 10
    );

    doc.text(
      `Página ${i} de ${pageCount}`,
      pageWidth - margin,
      pageHeight - 10,
      { align: "right" }
    );
  }

  return doc.output("blob");
}