'use client';

import type { jsPDF } from 'jspdf';

/** Limite conservative largeur/hauteur canvas (navigateurs ~16k, on reste en dessous). */
const MAX_CANVAS_EDGE_PX = 8192;

/** Marges intérieures (mm) : évite le rognage aux bords du lecteur PDF + léger jeu sur la largeur. */
const PDF_MARGIN_MM = 2.5;

/**
 * Insère la capture sur une page A4 : si la hauteur dépasse la zone utile, réduction homogène
 * (une seule page, pas de découpe verticale — la découpe coupait au milieu des phrases).
 */
function addCanvasToPdf(
  pdf: jsPDF,
  canvas: HTMLCanvasElement,
  pageWidth: number,
  pageHeight: number,
  isFirstPage: boolean
): void {
  const innerW = pageWidth - 2 * PDF_MARGIN_MM;
  const innerH = pageHeight - 2 * PDF_MARGIN_MM;

  let drawW = innerW;
  let drawHmm = (canvas.height * drawW) / canvas.width;

  let scaledDown = false;
  if (drawHmm > innerH + 0.25) {
    scaledDown = true;
    drawHmm = innerH;
    drawW = (canvas.width * drawHmm) / canvas.height;
  }

  const x = PDF_MARGIN_MM + (innerW - drawW) / 2;
  /** Si tout tient en hauteur : alignement haut (moins de blanc artificiel). Si réduit : centrage vertical. */
  const y = scaledDown
    ? PDF_MARGIN_MM + (innerH - drawHmm) / 2
    : PDF_MARGIN_MM;

  if (!isFirstPage) pdf.addPage();
  const data = canvasToJpeg(canvas);
  pdf.addImage(data, 'JPEG', x, y, drawW, drawHmm);
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
    /* Pas de left:-100vw ni min(210mm,100vw) : ça réduit la largeur utile et html2canvas coupe les bords. */
    wrapper.style.cssText = `${wrapperPrevStyle}display:block !important;visibility:visible !important;position:fixed !important;left:0 !important;top:0 !important;width:210mm !important;min-width:210mm !important;max-width:none !important;opacity:0.02 !important;z-index:2147483645 !important;pointer-events:none !important;overflow:visible !important;box-sizing:border-box !important;`;
  }

  el.classList.remove('hidden');
  el.style.cssText = `${prevCssText}display:block !important;visibility:visible !important;position:fixed !important;left:0 !important;top:0 !important;width:210mm !important;min-width:210mm !important;max-width:none !important;opacity:0.02 !important;background:#fff !important;z-index:2147483646 !important;pointer-events:none !important;overflow:visible !important;box-sizing:border-box !important;`;

  const prevHtmlOverflow = document.documentElement.style.overflow;
  const prevBodyOverflow = document.body.style.overflow;
  document.documentElement.style.overflow = 'visible';
  document.body.style.overflow = 'visible';

  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
  await new Promise((r) => setTimeout(r, 300));

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
      const rect = sheet.getBoundingClientRect();
      const parent = sheet.parentElement;
      const parentW = parent ? Math.max(parent.scrollWidth, parent.offsetWidth, parent.getBoundingClientRect().width) : 0;
      /** Marge de sécurité : width/height trop justes rognent souvent les bords (logo, colonne droite). */
      const cw = Math.ceil(
        Math.max(sheet.scrollWidth, sheet.offsetWidth, rect.width, parentW, 1) + 32
      );
      const ch = Math.ceil(Math.max(sheet.scrollHeight, sheet.offsetHeight, rect.height, 1) + 48);

      let scale = 1.65;
      if (ch * scale > MAX_CANVAS_EDGE_PX) scale = MAX_CANVAS_EDGE_PX / ch;
      if (cw * scale > MAX_CANVAS_EDGE_PX) scale = Math.min(scale, MAX_CANVAS_EDGE_PX / cw);

      const winW = Math.max(Math.ceil(cw + 160), 1200);
      const winH = Math.max(Math.ceil(ch + 160), 600);

      const canvas = await html2canvas(sheet, {
        scale,
        windowWidth: winW,
        windowHeight: winH,
        useCORS: true,
        allowTaint: false,
        logging: false,
        backgroundColor: '#ffffff',
        foreignObjectRendering: false,
        imageTimeout: 15000,
        onclone: (_doc, cloned) => {
          if (!(cloned instanceof HTMLElement)) return;
          cloned.style.overflow = 'visible';
          cloned.style.boxSizing = 'border-box';
          cloned.style.minWidth = `${Math.ceil(rect.width + 24)}px`;
          cloned.style.maxWidth = 'none';
          const pb = Math.max(
            56,
            parseFloat(getComputedStyle(cloned).paddingBottom) || 0
          );
          cloned.style.paddingBottom = `${pb}px`;
        },
      });

      if (!canvas.width || !canvas.height) {
        throw new Error('Impossible de capturer une page du document.');
      }

      addCanvasToPdf(pdf, canvas, pageWidth, pageHeight, firstPage);

      firstPage = false;
    }

    return pdf.output('blob');
  } finally {
    document.documentElement.style.overflow = prevHtmlOverflow;
    document.body.style.overflow = prevBodyOverflow;
    el.style.cssText = prevCssText;
    el.className = prevClass;
    if (wrapper) {
      wrapper.style.cssText = wrapperPrevStyle;
      wrapper.className = wrapperPrevClass;
    }
  }
}
