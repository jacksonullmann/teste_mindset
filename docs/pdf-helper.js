/* pdf-helper.js - adaptado ao seu HTML
   Espera encontrar no DOM:
   - botão com id="savePdf"
   - o card de resultado: element with class "result-card" (usado como fonte do PDF)
*/
(function(){
  'use strict';

  async function gerarEBaixarPdfImediato(selector = '.result-card', filename = 'resultado.pdf', btn = null) {
    if (btn && btn instanceof HTMLElement) {
      btn.setAttribute('disabled', 'disabled');
      btn.__origText = btn.textContent;
      btn.textContent = 'Gerando PDF...';
    }
    try {
      if (!window.html2pdf) throw new Error('html2pdf não carregado');
      const el = document.querySelector(selector);
      if (!el) throw new Error('Elemento não encontrado: ' + selector);

      const worker = html2pdf().set({
        margin: 10,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      }).from(el);

      const blob = await worker.outputPdf('blob');
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      return { ok: true, blob };
    } catch (err) {
      console.error('Erro ao gerar/baixar PDF:', err);
      return { ok: false, error: err };
    } finally {
      if (btn && btn instanceof HTMLElement) {
        btn.removeAttribute('disabled');
        if (btn.__origText) btn.textContent = btn.__origText;
      }
    }
  }

  // Auto-attach ao botão #savePdf
  document.addEventListener('DOMContentLoaded', () => {
    const btnId = 'savePdf';
    const btn = document.getElementById(btnId);
    if (!btn) return console.info('pdf-helper: botão', btnId, 'não encontrado');
    // substitui por clone para remover listeners antigos se houver
    if (!btn.__pdfHelperAttached) {
      const clone = btn.cloneNode(true);
      clone.__pdfHelperAttached = true;
      btn.parentNode.replaceChild(clone, btn);
    }
    const boundBtn = document.getElementById(btnId);
    boundBtn.addEventListener('click', (e) => {
      e.preventDefault();
      gerarEBaixarPdfImediato('.result-card', 'resultado.pdf', boundBtn)
        .then(res => { if (!res.ok) alert('Falha ao gerar PDF: ' + (res.error?.message || '')); });
    });
  });

  // exporta para uso manual
  window.gerarEBaixarPdfImediato = gerarEBaixarPdfImediato;
})();
