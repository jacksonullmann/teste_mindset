(function(){
  'use strict';

  async function gerarEBaixarPdfImediato(selector = '#resultCard', filename = 'resultado.pdf', btn = null) {
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

  // auto-attach ao botão if exists
  document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('btnSalvarPdf');
    if (!btn) return;
    // remove listeners duplicados clonando (seguro)
    if (!btn.__pdfHelperAttached) {
      const clone = btn.cloneNode(true);
      clone.__pdfHelperAttached = true;
      btn.parentNode.replaceChild(clone, btn);
    }
    const boundBtn = document.getElementById('btnSalvarPdf');
    boundBtn.addEventListener('click', (e) => {
      e.preventDefault();
      gerarEBaixarPdfImediato('#resultCard', 'resultado.pdf', boundBtn)
        .then(res => { if (!res.ok) alert('Falha ao gerar PDF: ' + (res.error?.message || '')) });
    });
  });

  // exporta para uso manual se precisar
  window.gerarEBaixarPdfImediato = gerarEBaixarPdfImediato;
})();
