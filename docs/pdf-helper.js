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

      // clona o card para gerar um documento limpo (não modifica o DOM visível)
      const clone = card.cloneNode(true);

      // 1) remover seletivamente elementos que não devem aparecer no PDF
      // ajuste os seletores se seus IDs/classes forem diferentes
      [
        '#savePdf',
        '#retryTest',
        '#closeResult',
        '.result-actions',
        '.qnav',
        '.no-print'
      ].forEach(sel => {
        clone.querySelectorAll(sel).forEach(el => el.remove());
      });

      // 2) garantir via style inline no clone (fallback caso o renderer ignore regras externas)
      const styleTag = document.createElement('style');
      styleTag.textContent = `
        .no-print { display: none !important; }
        .result-actions, .qnav, button[id="savePdf"], button[id="retryTest"], button[id="closeResult"] { display: none !important; }
      `;
      clone.insertBefore(styleTag, clone.firstChild);

      // lê nome do input no momento da conversão (sem mostrar no painel)
      // lê nome do input no momento da conversão (sem mostrar no painel)
// tenta: 1) valor atual do input, 2) localStorage, 3) fallback 'Sem_nome'
const nameInput = document.getElementById('participantName');
let name = (nameInput && nameInput.value && nameInput.value.trim()) || null;
if (!name) {
  try { name = localStorage.getItem('participantName') || null; } catch(e){ name = null; }
}
if (!name) name = 'Sem_nome';

// normaliza para filename: remove acentos, espaços e caracteres perigosos
// preserva legibilidade convertendo acentos para ASCII
const normalize = s => s.normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
const safeName = normalize(name).replace(/[^a-z0-9_\-]/gi, '_').slice(0,50);

// opcional: inserir o nome no clone para que apareça no PDF (sem alterar UI)
// se preferir NÃO mostrar no PDF, comente as 3 linhas abaixo
const metaHolder = document.createElement('div');
metaHolder.className = 'pdf-meta';
metaHolder.style.cssText = 'font-size:0.9rem;color:#333;margin-bottom:8px;';
metaHolder.textContent = `Nome: ${name}`;
clone.insertBefore(metaHolder, clone.firstChild);

// data atual em YYYY-MM-DD_HH-MM-SS para filename
const now = new Date();
const pad = n => String(n).padStart(2,'0');
const datePart = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;

const filename = `${filenameBase}_${safeName}_${datePart}.pdf`;


      // converte clone para blob (aguarda término)
      const worker = html2pdf().set({
        margin: 10,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      }).from(clone);

      const blob = await worker.outputPdf('blob');

      // comportamento cross-platform: desktop download, iOS open/share fallback
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

  // auto-attach ao botão #savePdf e comportamento do input de nome (uma única vez)
  document.addEventListener('DOMContentLoaded', () => {
    // attach do botão salvar PDF
    const btn = document.getElementById('savePdf');
    if (btn) {
      if (!btn.__pdfHelperAttached) {
        const cloneBtn = btn.cloneNode(true);
        cloneBtn.__pdfHelperAttached = true;
        btn.parentNode.replaceChild(cloneBtn, btn);
      }
      const boundBtn = document.getElementById('savePdf');
      boundBtn.addEventListener('click', (e) => {
        e.preventDefault();
        gerarEBaixarPdfAntes('.result-card', 'resultado', boundBtn)
          .then(res => { if (!res.ok) alert('Falha ao gerar PDF: ' + (res.error?.message || '')); });
      });
    } else {
      console.info('pdf-helper: botão #savePdf não encontrado');
    }

    // participantName: carregar salvo, salvar on change, limpar
    const input = document.getElementById('participantName');
    const clearBtn = document.getElementById('clearName');

    try {
      const saved = localStorage.getItem('participantName');
      if (saved && input) input.value = saved;
    } catch(e){ /* ignore */ }

    input?.addEventListener('change', () => {
      try { localStorage.setItem('participantName', input.value.trim()); } catch(e){}
    });

    clearBtn?.addEventListener('click', () => {
      if (!input) return;
      input.value = '';
      try { localStorage.removeItem('participantName'); } catch(e){}
      input.focus();
    });
  });

  // exporta para uso manual se necessário
  window.gerarEBaixarPdfAntes = gerarEBaixarPdfAntes;
})();
