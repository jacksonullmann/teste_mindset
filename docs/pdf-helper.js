(function(){
  'use strict';

  async function gerarEBaixarPdfAntes(selector = '.result-card', filename = 'resultado.pdf', btn = null) {
    if (btn && btn instanceof HTMLElement) {
      btn.setAttribute('disabled', 'disabled');
      btn.__origText = btn.textContent;
      btn.textContent = 'Gerando PDF...';
    }

    try {
      if (!window.html2pdf) throw new Error('html2pdf não carregado');
      const el = document.querySelector(selector);
      if (!el) throw new Error('Elemento não encontrado: ' + selector);

      // converte em blob primeiro (aguarda conclusão)
      const worker = html2pdf().set({
        margin: 10,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      }).from(el);

      const blob = await worker.outputPdf('blob'); // conversão completa aqui

      // detecta iOS para fallback
      const isIOS = /iP(ad|hone|od)/.test(navigator.userAgent) || (navigator.platform && /iP/.test(navigator.platform));

      // se Web Share API com arquivos disponível e for iOS/compatível, tenta compartilhar
      if (isIOS && navigator.canShare && window.File) {
        try {
          const file = new File([blob], filename, { type: 'application/pdf' });
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({ files: [file], title: filename });
            return { ok: true, method: 'share', blob };
          }
        } catch (shareErr) {
          console.warn('Web Share falhou, fallback para abrir/baixar', shareErr);
        }
      }

      // gerar object URL e forçar download (desktop) ou abrir nova aba (iOS)
      const url = URL.createObjectURL(blob);
      if (!isIOS) {
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        return { ok: true, method: 'download', blob };
      } else {
        // iOS: abrir em nova aba para que o usuário possa usar "Salvar em Arquivos" ou compartilhar
        window.open(url, '_blank');
        // não revoga imediatamente para evitar que a aba abra vazio
        setTimeout(() => URL.revokeObjectURL(url), 5000);
        return { ok: true, method: 'open', blob };
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

  // auto-attach ao botão #savePdf no DOMContentLoaded
  document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('savePdf');
    if (!btn) return console.info('pdf-helper: botão savePdf não encontrado');
    // replace com clone para remover listeners antigos se houver
    if (!btn.__pdfHelperAttached) {
      const clone = btn.cloneNode(true);
      clone.__pdfHelperAttached = true;
      btn.parentNode.replaceChild(clone, btn);
    }
    const boundBtn = document.getElementById('savePdf');
    boundBtn.addEventListener('click', (e) => {
      e.preventDefault();
      gerarEBaixarPdfAntes('.result-card', 'resultado.pdf', boundBtn)
        .then(res => { if (!res.ok) alert('Falha ao gerar PDF: ' + (res.error?.message || '')); });
    });
  });

  // exporta para uso manual
  window.gerarEBaixarPdfAntes = gerarEBaixarPdfAntes;
})();
