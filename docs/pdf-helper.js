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

      // prepara clone limpo do card para conversão (remove botões/ações)
      const clone = card.cloneNode(true);
      clone.querySelectorAll('.no-print').forEach(el => el.remove());
      const actions = clone.querySelector('.result-actions');
      if (actions) actions.remove();

      // lê nome do input no momento da conversão (sem mostrar no painel)
      const nameInput = document.getElementById('participantName');
      let name = (nameInput && nameInput.value.trim()) || 'Sem_nome';
      // normaliza para filename (substitui espaços e caracteres perigosos)
      const safeName = name.replace(/[^a-z0-9_\-]/gi, '_').slice(0,50);

      // data atual em YYYY-MM-DD_HH-MM (para evitar dois arquivos iguais)
      const now = new Date();
      const pad = n => String(n).padStart(2,'0');
      const datePart = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;

      const filename = `${filenameBase}_${safeName}_${datePart}.pdf`;

      // converte clone para blob
      const worker = html2pdf().set({
        margin: 10,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      }).from(clone);

      const blob = await worker.outputPdf('blob');

      // cross-platform: desktop download, iOS open/share fallback
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

  document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('participantName');
  const clearBtn = document.getElementById('clearName');

  // carregar nome salvo se houver
  try {
    const saved = localStorage.getItem('participantName');
    if (saved && input) input.value = saved;
  } catch(e){ /* ignore */ }

  // salvar automaticamente ao sair do campo
  input?.addEventListener('change', () => {
    try { localStorage.setItem('participantName', input.value.trim()); } catch(e){}
  });

  // limpar campo
  clearBtn?.addEventListener('click', () => {
    if (!input) return;
    input.value = '';
    try { localStorage.removeItem('participantName'); } catch(e){}
    input.focus();
  });

})();
