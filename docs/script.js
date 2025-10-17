// script.js — versão de depuração e funcionamento garantido
(function(){
  // perguntas (mantive seu conjunto)
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

  // buscar elementos uma vez (podem ser nulos se o HTML mudar)
  const cover = document.getElementById('cover');
  const app = document.getElementById('app');
  const startBtn = document.getElementById('startBtn');
  const backToCover = document.getElementById('backToCover');
  const learnMore = document.getElementById('learnMore');

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

  // funções básicas
  function log(...args){ if(window && window.console) console.log('[teste_mindset]', ...args); }

function moveFocusAwayFrom(node){
  // se o elemento focado for descendente de node, mova foco para um alvo visível seguro
  const active = document.activeElement;
  if(!active) return;
  try {
    if(node && node.contains(active)){
      if(startBtn) { startBtn.focus(); }
      else if(nextBtn) { nextBtn.focus(); }
      else { active.blur(); }
    }
  } catch(e){ try { active.blur(); } catch(e){} }
}

function showCover(){
  // se algo dentro do app estiver focado, retire foco antes de aplicar aria-hidden
  moveFocusAwayFrom(app);
  if(cover){
    cover.classList.remove('hidden');
    cover.style.display = '';
    cover.setAttribute('aria-hidden','false');
  }
  if(app){
    app.classList.add('hidden');
    app.style.display = 'none';
    app.setAttribute('aria-hidden','true');
  }
  if(startBtn) startBtn.focus();
  window.scrollTo(0,0);
}

function startTest(){
  // se algo dentro do resultPanel estiver focado, retire antes de esconder a capa
  moveFocusAwayFrom(resultPanel);
  if(cover){
    cover.classList.add('hidden');
    cover.style.display = 'none';
    cover.setAttribute('aria-hidden','true');
  }
  if(app){
    app.classList.remove('hidden');
    app.style.display = '';
    app.setAttribute('aria-hidden','false');
  }
  resetTest();
  if(slider) slider.focus();
  window.scrollTo(0,0);
}
  if(cover){
    cover.classList.add('hidden');
    cover.style.display = 'none';
    cover.setAttribute('aria-hidden','true');
  }
  if(app){
    app.classList.remove('hidden');
    app.style.display = '';
    app.setAttribute('aria-hidden','false');
  }
  resetTest();
  if(slider) slider.focus();
  window.scrollTo(0,0);
}

  function updateUI(){
  try {
    if (qnum) qnum.textContent = String(current + 1);
    if (qtext) qtext.textContent = questions[current] || '';
    if (progressBar) progressBar.style.width = (((current + 1) / total) * 100) + '%';
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

  function resetTest(){
    log('reset Test');
    answers = new Array(total).fill(2);
    current = 0;
    updateUI();
    hideResult();
  }

function showResult(){
  if(resultPanel){
    // antes de tornar visível, garantir que nada externo retenha foco indevido
    resultPanel.setAttribute('aria-hidden','false');
    resultPanel.classList.add('visible');
    // foco no botão fechar do modal (se existir)
    if(closeResult) closeResult.focus();
  }
}

  function hideResult(){
  if(resultPanel){
    // se o botão dentro do panel tem foco, movemos para o botão "PRÓXIMO" (ou startBtn) antes de esconder
    if(document.activeElement && resultPanel.contains(document.activeElement)){
      if(nextBtn) nextBtn.focus(); else if(startBtn) startBtn.focus();
      document.activeElement.blur();
    }
    resultPanel.classList.remove('visible');
    resultPanel.setAttribute('aria-hidden','true');
  }
}

  function computeAndShowResult(){
  const sum = answers.reduce((a,b)=>a+b,0);
  const maxSum = 4 * total;
  const pct = sum / maxSum;

  let label = '';
  let text = '';

  if(pct <= 0.40){
    label = 'Mindset Fixo';
    text = ''
      + '<p><strong>Mindset Fixo</strong></p>'
      + '<p>Suas respostas indicam uma preferência por um Mindset Fixo. Você tende a acreditar que inteligência e talento são traços estáticos e que esforço nem sempre altera resultados significativos. Isso pode fazer com que você evite desafios, desista mais rápido diante de dificuldades e veja esforço como algo menos valioso.</p>'
      + '<p><em>Resumo:</em> foco na validação, aversão ao erro e busca por resultados imediatos. Sugestão: praticar a mentalidade de processo e encarar erros como aprendizado.</p>';
  } else if(pct >= 0.60){
    label = 'Mindset de Crescimento';
    text = ''
      + '<p><strong>Mindset de Crescimento</strong></p>'
      + '<p>Suas respostas indicam uma preferência por um Mindset de Crescimento. Você tende a acreditar que habilidades podem ser desenvolvidas com esforço, estratégia e aprendizagem contínua. Isso favorece persistência, busca por desafios e valorização do processo de aprendizagem.</p>'
      + '<p><em>Resumo:</em> valoriza esforço e prática deliberada, aceita feedback e persiste diante de dificuldades. Sugestão: definir metas de aprendizagem e celebrar progresso.</p>';
  } else {
    label = 'Mindset Indiferenciado';
    text = ''
      + '<p><strong>Mindset Indiferenciado</strong></p>'
      + '<p>Suas respostas sugerem um Mindset indiferenciado (ou misto). Isso significa que suas crenças oscilam entre acreditar que pessoas podem melhorar por meio do esforço e acreditar que talento é inato. Em algumas situações você reage com mentalidade de crescimento, em outras com mentalidade fixa.</p>'
      + '<p><em>Resumo:</em> flexível, porém inconsistente; vale trabalhar a consciência situacional e estratégias para ativar o mindset de crescimento quando necessário.</p>';
  }

  if (resultTitle) resultTitle.textContent = label;
  if (resultText) resultText.innerHTML = text;
  if (resultMeta) resultMeta.innerHTML = `<p><strong>Pontuação:</strong> ${sum} de ${maxSum} (${Math.round(pct*100)}%)</p><p><small>Interpretação adaptada a partir de conceitos do livro de Carol S. Dweck.</small></p>`;

  showResult();
}

  // listeners defensivos: se elemento existir, usa listener direto; caso contrário, usa delegação no document
  if(startBtn){
    startBtn.addEventListener('click', function(e){
      e.preventDefault();
      log('startBtn click (via startBtn)');
      startTest();
    });
  } else {
    // delegação: botão pode ser recriado ou id diferente, assim ainda capturamos clique
    document.addEventListener('click', function(e){
      const el = e.target.closest && e.target.closest('#startBtn');
      if(el){
        e.preventDefault();
        log('startBtn click (via delegation)');
        startTest();
      }
    });
  }

  if(backToCover){
    backToCover.addEventListener('click', function(e){ e.preventDefault(); log('voltar para capa'); showCover(); });
  } else {
    document.addEventListener('click', function(e){
      if(e.target.closest && e.target.closest('#backToCover')){ e.preventDefault(); log('voltar (delegation)'); showCover(); }
    });
  }

  if(learnMore){
    learnMore.addEventListener('click', function(){ alert('Este teste é uma adaptação baseada nas pesquisas de Carol S. Dweck sobre Mindset.'); });
  }

  // sliders e navegação (se existem)
  if(slider){
    slider.addEventListener('input', function(){ answers[current] = parseInt(this.value,10); });
  }

  if(prevBtn){
    prevBtn.addEventListener('click', function(){ if(current===0) return; current--; updateUI(); if(slider) slider.focus(); });
  }

  if(nextBtn){
    nextBtn.addEventListener('click', function(){ if(current < total-1){ current++; updateUI(); if(slider) slider.focus(); } else { computeAndShowResult(); } });
  }

  if(closeResult) closeResult.addEventListener('click', function(){ hideResult(); });
  if(retryTest) retryTest.addEventListener('click', function(){ hideResult(); resetTest(); startTest(); });
  if(savePdf) savePdf.addEventListener('click', function(){ /* chama html2pdf se carregado */ if(typeof html2pdf==='function'){ html2pdf().from(document.querySelector('.result-card')).save(); } else { alert('PDF não disponível'); } });

  // teclado
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape' && resultPanel && resultPanel.classList.contains('visible')) hideResult();
    if(e.key === 'ArrowRight' && nextBtn) nextBtn.click();
    if(e.key === 'ArrowLeft' && prevBtn) prevBtn.click();
  });

  // inicializar texto e mostrar capa
  updateUI();
  showCover();

  // DEBUG: expõe funções no console para testes manuais
  window.__testeMindset = { startTest, showCover, updateUI, computeAndShowResult, resetTest };
  log('script inicializado. startBtn exists:', !!startBtn, 'cover exists:', !!cover, 'app exists:', !!app);
})();





