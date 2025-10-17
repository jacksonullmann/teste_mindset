// script.js - versão estável e defensiva
(function(){
  const questions = [
    "Você pode aprender coisas novas, mas isso não mudará realmente o quão inteligente você é.",
    "Experimentar coisas novas é estressante para mim.",
    "Acredito que a inteligência é em grande parte inata e não pode ser muito mudada.",
    "Na minha opinião, o talento é em grande parte algo com o qual você nasce.",
    "Eu aprecio quando pais, treinadores e professores me dão feedback sobre meu desempenho, mesmo que esse feedback seja negativo.",
    "É possível mudar coisas básicas sobre o tipo de pessoa que você é.",
    "Muitas vezes fico ressentido ou com inveja quando ouço sobre o sucesso de outras pessoas.",
    "Acredito que não importa que tipo de pessoa você seja, sempre é possível fazer grandes mudanças para melhor.",
    "Pessoas verdadeiramente inteligentes não precisam se esforçar muito.",
    "Acredito que quase todo mundo que é bom em alguma habilidade passou muito tempo praticando essa habilidade, independentemente de sua habilidade natural.",
    "Não acho que as pessoas possam mudar quem realmente são em sua essência.",
    "Você pode escolher fazer as coisas de maneira diferente, mas as partes realmente importantes de quem você é – seus talentos e habilidades – não podem ser alteradas.",
    "Acredito que a matemática é muito mais fácil de aprender se você for homem.",
    "Eu acredito que é possível aumentar substancialmente o quão inteligente você é.",
    "Acredito que quanto maior for o esforço, melhor será o resultado.",
    "Penso que habilidade musical é algo que qualquer um pode aprender.",
    "Muitas vezes fico com raiva quando recebo feedback crítico sobre meu desempenho.",
    "Estou sempre me desenvolvendo em uma área ou outra; Eu gosto de aprender coisas novas.",
    "Acredito que a inteligência sempre pode ser melhorada.",
    "Acredito que todos os seres humanos sem lesões cerebrais ou grandes defeitos congênitos são capazes da mesma quantidade de aprendizado."
  ];

  const total = questions.length;
  let current = 0;
  let answers = new Array(total).fill(2);

  // elementos
  const cover = document.getElementById('cover');
  const startBtn = document.getElementById('startBtn');
  const learnMore = document.getElementById('learnMore');
  const app = document.getElementById('app');
  const backToCover = document.getElementById('backToCover');

  const qnum = document.getElementById('qnum');
  const qtext = document.getElementById('questionText');
  const progressBar = document.getElementById('progressBar');
  const slider = document.getElementById('answerSlider');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  const resultPanel = document.getElementById('resultPanel');
  const resultTitle = document.getElementById('resultTitle');
  const resultText = document.getElementById('resultText');
  const resultMeta = document.getElementById('resultMeta');
  const closeResult = document.getElementById('closeResult');
  const savePdf = document.getElementById('savePdf');
  const retryTest = document.getElementById('retryTest');

  function log(){
    if(window && window.console) {
      const args = Array.prototype.slice.call(arguments);
      console.log.apply(console, ['[teste_mindset]'].concat(args));
    }
  }

  function showCover(){
    log('mostrar capa');
    if(document.activeElement && app && app.contains(document.activeElement)) try { document.activeElement.blur(); } catch(e){}
    if(cover){ cover.classList.remove('hidden'); cover.style.display = ''; cover.setAttribute('aria-hidden','false'); }
    if(app){ app.classList.add('hidden'); app.style.display = 'none'; app.setAttribute('aria-hidden','true'); }
    if(startBtn) startBtn.focus();
    window.scrollTo(0,0);
  }

  function startTest(){
    log('iniciar teste');
    if(document.activeElement && resultPanel && resultPanel.contains(document.activeElement)) try { document.activeElement.blur(); } catch(e){}
    if(cover){ cover.classList.add('hidden'); cover.style.display = 'none'; cover.setAttribute('aria-hidden','true'); }
    if(app){ app.classList.remove('hidden'); app.style.display = ''; app.setAttribute('aria-hidden','false'); }
    resetTest();
    if(slider) slider.focus();
    window.scrollTo(0,0);
  }

  function updateUI(){
    try {
      if (qnum) qnum.textContent = String(current + 1);
      if (qtext) qtext.textContent = questions[current] || '';
      if (progressBar) progressBar.style.width = String(((current + 1) / total) * 100) + '%';
      if (slider) slider.value = String(answers[current] ?? 2);
      if (prevBtn) {
        prevBtn.disabled = (current === 0);
        prevBtn.classList.toggle('disabled', current === 0);
      }
      if (nextBtn) {
        nextBtn.textContent = (current === total - 1) ? 'VER RESULTADO' : 'PRÓXIMO';
      }
    } catch (err) {
      console.error('[teste_mindset] updateUI error:', err);
    }
  }

  if (slider) {
    slider.addEventListener('input', function(){ answers[current] = parseInt(this.value,10) || 0; });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', function(){
      if(current === 0) return;
      current--;
      updateUI();
      if (slider) slider.focus();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', function(){
      if(current < total - 1){
        current++;
        updateUI();
        if (slider) slider.focus();
      } else {
        computeAndShowResult();
      }
    });
  }

 function computeAndShowResult(){
  const sum = answers.reduce(function(a,b){ return a + b; }, 0);
  const maxSum = 4 * total;
  const pct = sum / maxSum;

  var label = '';
  var text = '';

  if(pct <= 0.40){
    label = 'Mindset Fixo';
    text = '<p>Suas respostas indicam uma preferência por um Mindset Fixo. Você tende a acreditar que inteligência e talento são traços estáticos e que esforço nem sempre altera resultados significativos. Isso pode fazer com que você evite desafios, desista mais rápido diante de dificuldades e veja esforço como algo menos valioso.</p>' +
           '<p><em>Resumo:</em> foco na validação, aversão ao erro e busca por resultados imediatos. Sugestão: praticar a mentalidade de processo e encarar erros como aprendizado.</p>';
  } else if(pct >= 0.60){
    label = 'Mindset de Crescimento';
    text = '<p>Suas respostas indicam uma preferência por um Mindset de Crescimento. Você tende a acreditar que habilidades podem ser desenvolvidas com esforço, estratégia e aprendizagem contínua. Isso favorece persistência, busca por desafios e valorização do processo de aprendizagem.</p>' +
           '<p><em>Resumo:</em> valoriza esforço e prática deliberada, aceita feedback e persiste diante de dificuldades. Sugestão: definir metas de aprendizagem e celebrar progresso.</p>';
  } else {
    label = 'Mindset Indiferenciado';
    text = '<p>Suas respostas sugerem um Mindset indiferenciado (ou misto). Isso significa que suas crenças oscilam entre acreditar que pessoas podem melhorar por meio do esforço e acreditar que talento é inato. Em algumas situações você reage com mentalidade de crescimento, em outras com mentalidade fixa.</p>' +
           '<p><em>Resumo:</em> flexível, porém inconsistente; vale trabalhar a consciência situacional e estratégias para ativar o mindset de crescimento quando necessário.</p>';
  }

  if (resultTitle) resultTitle.textContent = label;
  if (resultText) resultText.innerHTML = text;
  if (resultMeta) resultMeta.innerHTML = '<p><strong>Pontuação:</strong> ' + sum + ' de ' + maxSum + ' (' + Math.round(pct*100) + '%)</p>' +
                                         '<p><small>Interpretação adaptada a partir de conceitos do livro de Carol S. Dweck.</small></p>';
  showResult();
}

  function showResult(){
    if(resultPanel){
      // garantir que nada focado fique escondido
      if(document.activeElement && resultPanel.contains(document.activeElement)){
        try { document.activeElement.blur(); } catch(e){}
      }
      resultPanel.setAttribute('aria-hidden','false');
      resultPanel.classList.add('visible');
      if (closeResult) try { closeResult.focus(); } catch(e){}
    }
  }

  function hideResult(){
    if(resultPanel){
      if(document.activeElement && resultPanel.contains(document.activeElement)){
        if(nextBtn) try { nextBtn.focus(); } catch(e){} else if(startBtn) try { startBtn.focus(); } catch(e){}
        try { document.activeElement.blur(); } catch(e){}
      }
      resultPanel.classList.remove('visible');
      resultPanel.setAttribute('aria-hidden','true');
    }
  }

  function resetTest(){
    answers = new Array(total).fill(2);
    current = 0;
    updateUI();
    hideResult();
  }

  function saveResultAsPdf(){
    var element = document.querySelector('.result-card');
    var opt = {
      margin: 10,
      filename: 'resultado-mindset-' + (new Date().toISOString().slice(0,10)) + '.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' }
    };
    if (typeof html2pdf === 'function') {
      try { html2pdf().set(opt).from(element).save(); } catch(e){ alert('Erro ao gerar PDF'); }
    } else {
      alert('PDF não disponível (biblioteca html2pdf não carregada).');
    }
  }

  // handlers
  if (closeResult) closeResult.addEventListener('click', hideResult);
  if (retryTest) retryTest.addEventListener('click', function(){ hideResult(); resetTest(); startTest(); });
  if (savePdf) savePdf.addEventListener('click', saveResultAsPdf);

  document.addEventListener('keydown', function(e){
    try {
      if(e.key === 'Escape' && resultPanel && resultPanel.classList.contains('visible')) hideResult();
      if(e.key === 'ArrowRight' && nextBtn) nextBtn.click();
      if(e.key === 'ArrowLeft' && prevBtn) prevBtn.click();
    } catch(err){ /* silent */ }
  });

  if (startBtn) startBtn.addEventListener('click', function(){ startTest(); });
  if (backToCover) backToCover.addEventListener('click', function(){ showCover(); });
  if (learnMore) learnMore.addEventListener('click', function(){ alert('Este teste é uma adaptação baseada nas pesquisas de Carol S. Dweck sobre Mindset. Responda honestamente e veja sua interpretação ao final.'); });

  // iniciar
  updateUI();
  showCover();
  log('script inicializado. startBtn exists:', !!startBtn, 'cover exists:', !!cover, 'app exists:', !!app);

function downloadResultPdf(){
  var element = document.querySelector('.result-card');
  if(!element){
    alert('Resultado não encontrado para gerar PDF.');
    return;
  }

  // 1) tenta html2pdf se disponível
  if (typeof html2pdf === 'function') {
    try {
      var opt = {
        margin: 10,
        filename: 'resultado-mindset-' + (new Date().toISOString().slice(0,10)) + '.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' }
      };
      html2pdf().set(opt).from(element).save();
      return;
    } catch (err) {
      console.warn('[teste_mindset] html2pdf falhou, tentando fallback', err);
    }
  }

  // 2) tenta html2canvas + jsPDF -> Blob
  var createPdfBlob = function(){
    return new Promise(function(resolve, reject){
      if (typeof html2canvas !== 'function' || typeof window.jspdf === 'undefined') {
        return reject(new Error('html2canvas ou jsPDF não disponíveis'));
      }
      try {
        html2canvas(element, { scale: 2, useCORS: true }).then(function(canvas){
          try {
            var imgData = canvas.toDataURL('image/jpeg', 0.95);
            var pdf = new window.jspdf.jsPDF('p', 'pt', 'a4');
            var pageWidth = pdf.internal.pageSize.getWidth();
            var imgWidth = pageWidth - 20;
            var imgHeight = (canvas.height * imgWidth) / canvas.width;
            pdf.addImage(imgData, 'JPEG', 10, 10, imgWidth, imgHeight);
            var pdfBlob = pdf.output('blob');
            resolve(pdfBlob);
          } catch (e){
            reject(e);
          }
        }).catch(reject);
      } catch (e){ reject(e); }
    });
  };

  createPdfBlob().then(function(pdfBlob){
    var filename = 'resultado-mindset-' + (new Date().toISOString().slice(0,10)) + '.pdf';
    var url = URL.createObjectURL(pdfBlob);

    // detecta iOS Safari (userAgent check simples)
    var isIOS = /iP(ad|hone|od)/.test(navigator.userAgent) && /Safari/.test(navigator.userAgent);

    if (isIOS) {
      // iOS: abrir em nova aba para que o usuário possa usar o Share / Salvar em Arquivos
      window.open(url, '_blank');
      if (typeof window.__showIosSaveBanner === 'function') window.__showIosSaveBanner();
      // opcional: mostrar instrução breve
      try { alert('O PDF foi aberto em nova aba. Use o botão de partilha ou pressione longo sobre o documento para salvar em Arquivos.'); } catch(e){}
      // revoga depois de um tempo (não imediato para não invalidar a aba)
      setTimeout(function(){ URL.revokeObjectURL(url); }, 30000);
    } else {
      // Desktop e navegadores que aceitam download programático
      var a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(function(){ URL.revokeObjectURL(url); }, 10000);
    }
  }).catch(function(err){
    console.warn('[teste_mindset] erro ao criar PDF blob, fallback para print', err);
    window.print();
  });
}

// mostra banner de instrução para iOS quando o PDF é aberto em nova aba
(function(){
  var isIOS = /iP(ad|hone|od)/.test(navigator.userAgent) && /Safari/.test(navigator.userAgent);
  if(!isIOS) return;
  var banner = document.createElement('div');
  banner.className = 'ios-save-banner';
  banner.id = 'iosSaveBanner';
  banner.innerHTML = 'PDF aberto. Use o botão de partilha ou pressione longo para salvar em Arquivos.';
  document.body.appendChild(banner);
  // função para exibir por 8 segundos
  window.__showIosSaveBanner = function(){
    var b = document.getElementById('iosSaveBanner');
    if(!b) return;
    b.classList.add('visible');
    setTimeout(function(){ b.classList.remove('visible'); }, 8000);
  };
  // chamar quando abrimos o PDF em nova aba (no fluxo de downloadResultPdf)
})();
