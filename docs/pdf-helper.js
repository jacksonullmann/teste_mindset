/* pdf-helper.js
   Uso: incluir <script src="path/to/html2pdf.bundle.min.js" defer></script>
         <script src="pdf-helper.js" defer></script>
*/

(function () {
  'use strict';

  // Config padrão do pdf
  const DEFAULT_OPTIONS = {
    selector: '#resultCard',
    filename: 'resultado.pdf',
    html2pdf: {
      margin: 10,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    },
    revokeDelayMs: 60_000,   // revoga URL depois de 60s
    linkContainerSelector: null // se null usa document.body
  };

  // Gera Blob + URL do PDF usando html2pdf; retorna { blob, url }
  async function gerarPdfBlobAndUrl(selector, opts) {
    if (!window.html2pdf) throw new Error('html2pdf não disponível');
    const el = document.querySelector(selector);
    if (!el) throw new Error('Elemento não encontrado: ' + selector);

    const worker = html2pdf().set(opts.html2pdf).from(el);
    const blob = await worker.outputPdf('blob');
    const url = URL.createObjectURL(blob);
    return { blob, url };
  }

  // Cria e insere link de download; retorna o elemento <a>
  function criarLinkDownload(url, filename, containerSelector) {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.textContent = 'Baixar PDF';
    a.className = 'pdf-download-link';
    a.style.display = 'inline-block';
    a.style.margin = '8px 0';
    a.style.padding = '8px 12px';
    a.style.background = '#3498db';
    a.style.color = '#fff';
    a.style.borderRadius = '8px';
    a.style.textDecoration = 'none';
    a.style.fontWeight = '600';
    (containerSelector ? document.querySelector(containerSelector) : document.body).appendChild(a);
    return a;
  }

  // API pública principal: gera PDF e cria link (ou dispara download automático se autoDownload=true)
  async function gerarPdfLink(opts = {}) {
    const cfg = Object.assign({}, DEFAULT_OPTIONS, opts);
    cfg.html2pdf = Object.assign({}, DEFAULT_OPTIONS.html2pdf, opts.html2pdf || {});

    const { blob, url } = await gerarPdfBlobAndUrl(cfg.selector, cfg);

    const link = criarLinkDownload(url, cfg.filename, cfg.linkContainerSelector);

    // opcional: dispara o download automaticamente e remove o link visual
    if (cfg.autoDownload) {
      link.click();
    }

    // revoga a URL depois de um tempo para liberar memória
    setTimeout(() => {
      try { URL.revokeObjectURL(url); } catch (e) { /* ignore */ }
    }, cfg.revokeDelayMs);

    return { blob, url, linkElement: link };
  }

  // Handler pronto para associar ao botão #btnSalvarPdf
  function attachButtonHandler(buttonId = 'btnSalvarPdf', opts = {}) {
    const btn = document.getElementById(buttonId);
    if (!btn) return null;
    // remove listeners duplicados de forma segura clonando
    const clean = () => {
      if (btn.__pdfHelperCleaned) return document.getElementById(buttonId);
      const clone = btn.cloneNode(true);
      clone.__pdfHelperCleaned = true;
      btn.parentNode.replaceChild(clone, btn);
      return document.getElementById(buttonId);
    };

    const boundBtn = clean();
    boundBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      try {
        // pequena UX: desabilita botão enquanto gera
        boundBtn.setAttribute('disabled', 'disabled');
        boundBtn.style.opacity = '0.6';
        const result = await gerarPdfLink(opts);
        // opcional: destaca o link recém-criado por 1s
        if (result && result.linkElement) {
          result.linkElement.focus();
        }
      } catch (err) {
        console.error('Erro ao gerar PDF:', err);
        alert('Erro ao gerar PDF: ' + (err.message || err));
      } finally {
        boundBtn.removeAttribute('disabled');
        boundBtn.style.opacity = '';
      }
    }, { passive: false });

    return boundBtn;
  }

  // Auto-attach ao DOMContentLoaded (não sobrescreve se não existir botão)
  document.addEventListener('DOMContentLoaded', () => {
    // Ajuste: se quiser que o link apareça dentro do painel, troque linkContainerSelector
    attachButtonHandler('btnSalvarPdf', { selector: '#resultCard', filename: 'resultado.pdf' });
  });

  // Expor função utilitária para uso manual se necessário
  window.gerarPdfLink = gerarPdfLink;
  window.pdfHelperAttach = attachButtonHandler;
})();
