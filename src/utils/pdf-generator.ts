import jsPDF from "jspdf";
import {template_base64} from "./template_base64"

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

export async function gerarPdfAtividade(
  atividade: AtividadeData
): Promise<Blob> {
  const doc = new jsPDF("p", "mm", "a4");


  // Parametros de configuracao ---------------------
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginLeft = 20;
  const contentWidth = pageWidth - marginLeft * 2;
  const lineHeight = 6
  let marginTop = 40;


  // Posicionar a mascara oficial ---------------------
  doc.addImage(template_base64, "PNG", 0, 0, 210, 297);


  // Formatar titulo ---------------------
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0); 
  doc.text(
    "RELATÓRIO DE EVIDÊNCIA", 
    pageWidth / 2, 
    marginTop, 
    { align: "center" }
  );
  marginTop += lineHeight*2;


  // Formatar campos do formulario ---------------------
  const formatFormsFields = (label: string, value: string) => {
      // Formatar e posicionar o campo
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(`${label}: `, marginLeft, marginTop);
  
      // Formatar e posicionar o valor
      const labelWidth = doc.getTextWidth(`${label}: `);
      const valueStartMargin = marginLeft + labelWidth;
      const availableWidth = contentWidth - labelWidth;
      const valueLines = doc.splitTextToSize(value, availableWidth);
  
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(valueLines, valueStartMargin, marginTop);
  
      // Atualizar a margem 
      marginTop += (valueLines.length * lineHeight);
    };

  // titulo
  // tipo 
  formatFormsFields("Responsável", atividade.nome);
  // empresa parceira (se tiver)
  formatFormsFields("Local", atividade.local);
  formatFormsFields(
    "Data", 
    new Date(atividade.data + "T00:00:00").toLocaleDateString("pt-BR")
  );
  

  // Formatar secao descricao ---------------------
  marginTop += lineHeight*2
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(
    "DESCRIÇÃO", 
    pageWidth / 2, 
    marginTop, 
    { align: "center" }
  );

  marginTop += lineHeight*2
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  const descriptionLines = doc.splitTextToSize(atividade.descricao, contentWidth);
  doc.text(descriptionLines, marginLeft, marginTop);


  // Formatar secao evidencias ---------------------
  if (atividade.fotosUrls.length > 0) {
    marginTop += lineHeight*2
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(
      "EVIDÊNCIAS", 
      pageWidth / 2, 
      marginTop, 
      { align: "center" }
    );
    marginTop += lineHeight*2

    // const imgWidth = (contentWidth - 10) / 2;
    // let x = marginLeft;
    // for (let i = 0; i < atividade.fotosUrls.length; i++) {
    //   const url = atividade.fotosUrls[i];

    //   try {
    //     const img = await loadImage(url);

    //     const ratio = img.height / img.width;
    //     const imgHeight = imgWidth * ratio;

    //     if (y + imgHeight > pageHeight - 30) {
    //       doc.addPage();
    //       y = 20;
    //     }

    //     doc.addImage(img, "JPEG", x, y, imgWidth, imgHeight);

    //     if (x === margin) {
    //       x = margin + imgWidth + 10;
    //     } else {
    //       x = margin;
    //       y += imgHeight + 10;
    //     }
    //   } catch {
    //     doc.setTextColor(150, 150, 150);
    //     doc.text("[imagem não disponível]", x, y);
    //   }
    // }
    
  }


  return doc.output("blob");
}