'use client';

import type { jsPDF } from 'jspdf';

/** Limite conservative largeur/hauteur canvas (navigateurs ~16k, on reste en dessous). */
const MAX_CANVAS_EDGE_PX = 8192;

function addCanvasToPdf(
  pdf: jsPDF,
  canvas: HTMLCanvasElement,
  pageWidth: number,
  pageHeight: number,
  isFirstPage: boolean
): void {
  const imgW = pageWidth;
  const imgHmm = (canvas.height * imgW) / canvas.width;

  if (imgHmm <= pageHeight + 0.5) {
    if (!isFirstPage) pdf.addPage();
    const data = canvasToJpeg(canvas);
    pdf.addImage(data, 'JPEG', 0, 0, imgW, imgHmm);
    return;
  }

  /** Découpe verticale si une feuille logique dépasse une page A4 (ex. beaucoup de texte). */
  let yPx = 0;
  let first = isFirstPage;
  const pxPerPage = (pageHeight / imgHmm) * canvas.height;

  while (yPx < canvas.height) {
    const slicePx = Math.min(Math.ceil(pxPerPage), canvas.height - yPx);
    const sliceCanvas = document.createElement('canvas');
    sliceCanvas.width = canvas.width;
    sliceCanvas.height = slicePx;
    const ctx = sliceCanvas.getContext('2d');
    if (!ctx) throw new Error('Impossible de préparer l’image pour le PDF.');
    ctx.drawImage(canvas, 0, yPx, canvas.width, slicePx, 0, 0, canvas.width, slicePx);
    const sliceHmm = (slicePx / canvas.height) * imgHmm;
    const data = canvasToJpeg(sliceCanvas);
    if (!first) pdf.addPage();
    first = false;
    pdf.addImage(data, 'JPEG', 0, 0, imgW, sliceHmm);
    yPx += slicePx;
  }
}

function canvasToJpeg(canvas: HTMLCanvasElement): string {
  const sliceData = canvas.toDataURL('image/jpeg', 0.92);
  if (!sliceData || !/^data:image\/jpe?g/i.test(sliceData.slice(0, 32))) {
    throw new Error('Image de capture invalide.');
  }
  return sliceData;
}

/**
 * Capture le document : une page PDF par bloc `[data-pdf-sheet]` (même découpe qu’à l’écran / impression).
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
  await new Promise((r) => setTimeout(r, 250));

  try {
    const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait', compress: true });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const sheets = Array.from(el.querySelectorAll<HTMLElement>('[data-pdf-sheet]'));

    if (sheets.length === 0) {
      throw new Error('Structure du document inattendue. Rechargez la page.');
    }

    let firstPage = true;

    for (const sheet of sheets) {
      const cw = Math.max(sheet.scrollWidth, sheet.offsetWidth, 1);
      const ch = Math.max(sheet.scrollHeight, sheet.offsetHeight, 1);

      let scale = 1.75;
      if (ch * scale > MAX_CANVAS_EDGE_PX) scale = MAX_CANVAS_EDGE_PX / ch;
      if (cw * scale > MAX_CANVAS_EDGE_PX) scale = Math.min(scale, MAX_CANVAS_EDGE_PX / cw);

      const canvas = await html2canvas(sheet, {
        scale,
        width: cw,
        height: ch,
        useCORS: true,
        allowTaint: false,
        logging: false,
        backgroundColor: '#ffffff',
        foreignObjectRendering: false,
        imageTimeout: 15000,
      });

      if (!canvas.width || !canvas.height) {
        throw new Error('Impossible de capturer une page du document.');
      }

      addCanvasToPdf(pdf, canvas, pageWidth, pageHeight, firstPage);

      firstPage = false;
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
