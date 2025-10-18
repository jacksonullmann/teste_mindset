(function(){
  'use strict';

  async function gerarEBaixarPdfAntes(selector = '.result-card', filenameBase = 'resultado', btn = null) {
    if (btn && btn instanceof HTMLElement) {
      btn.setAttribute('disabled', 'disabled');
      btn.__origText = btn.textContent;
      btn.textContent = 'Gerando PDF...';
    }

    try {
      if (!window.html2pdf) throw new Error('html2pdf não carregado');
      const card = document.querySelector(selector);
      if (!card) throw new Error('Elemento não encontrado: ' + selector);

      // clona e limpa o clone de elementos não desejados
      const clone = card.cloneNode(true);
      // remove ações/botões marcados com .no-print e a área .result-actions
      clone.querySelectorAll('.no-print').forEach(el => el.remove());
      const actions = clone.querySelector('.result-actions');
      if (actions) actions.remove();

      // opcional: garantir que meta exista (já populada no mostrarResultado)
      if (!clone.querySelector('#resultMeta') && !clone.querySelector('.result-meta')) {
        const meta = document.createElement('div');
        meta.className = 'result-meta';
        clone.appendChild(meta);
      }

      // construir filename com nome e data
      let name = (card.dataset.participantName || 'Sem nome').trim();
      if (!name) name = 'Sem nome';
      const iso = card.dataset.resultDateISO || new Date().toISOString();
      const datePart = iso.slice(0,10); // YYYY-MM-DD
      const safeName = name.replace(/[^a-z0-9_\-]/gi, '_').slice(0,50);
      const filename = `${filenameBase}_${safeName}_${datePart}.pdf`;

      // converte o clone para blob (aguarda conversão)
      const worker = html2pdf().set({
        margin: 10,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      }).from(clone);

      const blob = await worker.outputPdf('blob');

      // comportamento cross-platform: download, share ou abrir em nova aba no iOS
      const isIOS = /iP(ad|hone|od)/.test(navigator.userAgent) || (navigator.platform && /iP/.test(navigator.platform));
      if (isIOS && navigator.canShare && window.File) {
        try {
          const file = new File([blob], filename, { type: 'application/pdf' });
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({ files: [file], title: filename });
            return { ok: true, method: 'share', blob, filename };
          }
        } catch (shareErr) {
          console.warn('Web Share falhou', shareErr);
        }
      }

      const url = URL.createObjectURL(blob);
      if (!isIOS) {
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        return { ok: true, method: 'download', blob, filename };
      } else {
        window.open(url, '_blank');
        setTimeout(() => URL.revokeObjectURL(url), 5000);
        return { ok: true, method: 'open', blob, filename };
      }

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

  // auto-attach ao botão #savePdf
  document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('savePdf');
    if (!btn) return console.info('pdf-helper: botão savePdf não encontrado');
    if (!btn.__pdfHelperAttached) {
      const clone = btn.cloneNode(true);
      clone.__pdfHelperAttached = true;
      btn.parentNode.replaceChild(clone, btn);
    }
    const boundBtn = document.getElementById('savePdf');
    boundBtn.addEventListener('click', (e) => {
      e.preventDefault();
      gerarEBaixarPdfAntes('.result-card', 'resultado', boundBtn)
        .then(res => { if (!res.ok) alert('Falha ao gerar PDF: ' + (res.error?.message || '')); });
    });
  });

  window.gerarEBaixarPdfAntes = gerarEBaixarPdfAntes;
})();
