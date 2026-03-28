'use client';

/** Limite conservative largeur/hauteur canvas (navigateurs ~16k, on reste en dessous). */
const MAX_CANVAS_EDGE_PX = 8192;

/**
 * Capture l’élément #printable-document et produit un PDF multipage.
 * Découpe le canvas en bandes (une par page A4) au lieu d’une seule image décalée :
 * évite bandes noires, contenu coupé et bugs jsPDF sur les longs documents.
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

  const wrapper = document.getElementById('print-content');
  const wrapperPrevClass = wrapper?.className ?? '';
  const wrapperPrevStyle = wrapper?.style.cssText ?? '';

  const prevClass = el.className;
  const prevCssText = el.style.cssText;

  if (wrapper) {
    wrapper.classList.remove('hidden');
    wrapper.style.cssText = `${wrapperPrevStyle}display:block !important;visibility:visible !important;position:fixed !important;left:-100vw !important;top:0 !important;width:min(210mm,100vw) !important;max-width:210mm !important;z-index:2147483645 !important;pointer-events:none !important;overflow:visible !important;`;
  }

  el.classList.remove('hidden');
  el.style.cssText = `${prevCssText}display:block !important;visibility:visible !important;position:fixed !important;left:-100vw !important;top:0 !important;width:210mm !important;max-width:210mm !important;background:#fff !important;z-index:2147483646 !important;pointer-events:none !important;`;

  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
  await new Promise((r) => setTimeout(r, 200));

  const captureW = Math.max(el.scrollWidth, el.offsetWidth, 1);
  const captureH = Math.max(el.scrollHeight, el.offsetHeight, 1);

  let scale = 1.75;
  if (captureH * scale > MAX_CANVAS_EDGE_PX) scale = MAX_CANVAS_EDGE_PX / captureH;
  if (captureW * scale > MAX_CANVAS_EDGE_PX) scale = Math.min(scale, MAX_CANVAS_EDGE_PX / captureW);

  try {
    const canvas = await html2canvas(el, {
      scale,
      width: captureW,
      height: captureH,
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

    /** Hauteur totale du document en mm si on imprime à la largeur page. */
    const imgHeightMm = (canvas.height * pageWidth) / canvas.width;

    /** Hauteur du document en pixels source correspondant à une page A4. */
    const pxPerPage = Math.max(1, (pageHeight / imgHeightMm) * canvas.height);

    let yPx = 0;
    let pageIndex = 0;

    while (yPx < canvas.height) {
      const slicePx = Math.min(Math.ceil(pxPerPage), canvas.height - yPx);
      const sliceCanvas = document.createElement('canvas');
      sliceCanvas.width = canvas.width;
      sliceCanvas.height = slicePx;
      const ctx = sliceCanvas.getContext('2d');
      if (!ctx) {
        throw new Error('Impossible de préparer l’image pour le PDF.');
      }
      ctx.drawImage(
        canvas,
        0,
        yPx,
        canvas.width,
        slicePx,
        0,
        0,
        canvas.width,
        slicePx
      );

      let sliceData: string;
      try {
        sliceData = sliceCanvas.toDataURL('image/jpeg', 0.92);
      } catch {
        throw new Error(
          'Export image bloqué (contenu externe). Vérifiez que le logo est bien chargé depuis votre domaine.'
        );
      }

      if (!sliceData || !/^data:image\/jpe?g/i.test(sliceData.slice(0, 32))) {
        throw new Error('Image de capture invalide. Réessayez ou utilisez Imprimer → Enregistrer en PDF.');
      }

      const sliceHeightMm = (slicePx / canvas.height) * imgHeightMm;

      if (pageIndex > 0) {
        pdf.addPage();
      }
      pdf.addImage(sliceData, 'JPEG', 0, 0, pageWidth, sliceHeightMm);

      yPx += slicePx;
      pageIndex += 1;
    }

    return pdf.output('blob');
  } finally {
    el.style.cssText = prevCssText;
    el.className = prevClass;
    if (wrapper) {
      wrapper.style.cssText = wrapperPrevStyle;
      wrapper.className = wrapperPrevClass;
    }
  }
}
