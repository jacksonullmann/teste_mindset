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

  function showCover(){
    log('mostrar capa');
    if(cover) cover.classList.remove('hidden'), cover.setAttribute('aria-hidden','false');
    if(app) app.classList.add('hidden'), app.setAttribute('aria-hidden','true');
    window.scrollTo(0,0);
  }

  function startTest(){
    log('iniciar teste');
    if(cover) cover.classList.add('hidden'), cover.setAttribute('aria-hidden','true');
    if(app) app.classList.remove('hidden'), app.setAttribute('aria-hidden','false');
    resetTest();
    if(slider) slider.focus();
    window.scrollTo(0,0);
  }

  function updateUI(){
    if(qnum) qnum.textContent = (current + 1);
    if(qtext) qtext.textContent = questions[current];
    if(progressBar) progressBar.style.width = (((current + 1) / total) * 100) + '%';
    if(slider) slider.value = answers[current];
    if(prevBtn){ prevBtn.disabled = current === 0; prevBtn.classList.toggle('disabled', current === 0); }
    if(nextBtn) nextBtn.textContent = current === total - 1 ? 'VER RESULTADO' : 'PRÓXIMO';
  }

  function resetTest(){
    log('reset Test');
    answers = new Array(total).fill(2);
    current = 0;
    updateUI();
    hideResult();
  }

  function showResult(){
    if(resultPanel) resultPanel.classList.add('visible'), resultPanel.setAttribute('aria-hidden','false');
    if(closeResult) closeResult.focus();
  }
  function hideResult(){
    if(resultPanel) resultPanel.classList.remove('visible'), resultPanel.setAttribute('aria-hidden','true');
  }

  function computeAndShowResult(){
    const sum = answers.reduce((a,b)=>a+b,0);
    const maxSum = 4 * total;
    const pct = sum / maxSum;
    let label = '', text = '';
    if(pct <= 0.40){
      label = 'Mindset Fixo';
      text = '<p><strong>Mindset Fixo</strong></p><p>Suas respostas indicam preferência por Mindset Fixo...</p>';
    } else if(pct >= 0.60){
      label = 'Mindset de Crescimento';
      text = '<p><strong>Mindset de Crescimento</strong></p><p>Suas respostas indicam preferência por Mindset de Crescimento...</p>';
    } else {
      label = 'Mindset Indiferenciado';
      text = '<p><strong>Mindset Indiferenciado</strong></p><p>Suas respostas indicam mistura de crenças...</p>';
    }
    if(resultTitle) resultTitle.textContent = label;
    if(resultText) resultText.innerHTML = text;
    if(resultMeta) resultMeta.innerHTML = `<p><strong>Pontuação:</strong> ${sum} de ${maxSum} (${Math.round(pct*100)}%)</p>`;
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
