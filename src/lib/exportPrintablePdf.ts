'use client';

/**
 * Capture l’élément #printable-document (aperçu du devis/facture) et produit un PDF multipage.
 * Utilisé pour joindre le document à un email (partage natif ou téléchargement + mailto).
 *
 * Note : jsPDF rejette parfois les très gros PNG (data URL) avec « wrong PNG signature ».
 * On utilise JPEG + élément positionné dans le viewport (pas hors écran) pour une capture fiable sur Safari/WebKit.
 */
export async function exportPrintableToPdf(): Promise<Blob> {
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
    import('html2canvas'),
    import('jspdf'),
  ]);

  const el = document.getElementById('printable-document');
  if (!el) {
    throw new Error('Document imprimable introuvable. Rechargez la page et réessayez.');
  }

  const prevClass = el.className;
  const prevCssText = el.style.cssText;

  el.classList.remove('hidden');
  /* Hors écran (left:-9999px) peut donner largeur 0 sous WebKit → canvas invalide */
  el.style.cssText = `${prevCssText}display:block !important;visibility:visible !important;opacity:0 !important;position:fixed !important;left:0 !important;top:0 !important;width:210mm !important;max-width:210mm !important;background:#fff !important;z-index:2147483646 !important;pointer-events:none !important;`;

  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
  await new Promise((r) => setTimeout(r, 150));

  try {
    const canvas = await html2canvas(el, {
      scale: 1.75,
      useCORS: true,
      allowTaint: false,
      logging: false,
      backgroundColor: '#ffffff',
      foreignObjectRendering: false,
      imageTimeout: 15000,
    });

    if (!canvas.width || !canvas.height) {
      throw new Error('Impossible de capturer le document (taille nulle). Réessayez après le chargement complet de la page.');
    }

    const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait', compress: true });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    /* JPEG : évite l’erreur « wrong PNG signature » sur gros exports avec jsPDF */
    let imgData: string;
    try {
      imgData = canvas.toDataURL('image/jpeg', 0.92);
    } catch {
      throw new Error(
        'Export image bloqué (contenu externe). Vérifiez que le logo est bien chargé depuis votre domaine.'
      );
    }

    if (!imgData || imgData.length < 32 || !/^data:image\/jpe?g/i.test(imgData.slice(0, 32))) {
      throw new Error('Image de capture invalide. Réessayez ou utilisez Imprimer → Enregistrer en PDF.');
    }

    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    return pdf.output('blob');
  } finally {
    el.style.cssText = prevCssText;
    el.className = prevClass;
  }
}
