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

  function showCover(){
    if (cover) cover.classList.remove('hidden');
    if (cover) cover.setAttribute('aria-hidden','false');
    if (app) app.classList.add('hidden');
    if (app) app.setAttribute('aria-hidden','true');
    window.scrollTo(0,0);
  }

  function startTest(){
    if (cover) cover.classList.add('hidden');
    if (cover) cover.setAttribute('aria-hidden','true');
    if (app) app.classList.remove('hidden');
    if (app) app.setAttribute('aria-hidden','false');
    resetTest();
    if (slider) slider.focus();
    window.scrollTo(0,0);
  }

  function updateUI(){
    if (qnum) qnum.textContent = (current + 1);
    if (qtext) qtext.textContent = questions[current];
    if (progressBar) progressBar.style.width = (((current + 1) / total) * 100) + '%';
    if (slider) slider.value = answers[current];
    if (prevBtn) {
      prevBtn.disabled = current === 0;
      prevBtn.classList.toggle('disabled', current === 0);
    }
    if (nextBtn) nextBtn.textContent = current === total - 1 ? 'VER RESULTADO' : 'PRÓXIMO';
  }

  if (slider) {
    slider.addEventListener('input', function(){ answers[current] = parseInt(this.value,10); });
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
    const sum = answers.reduce((a,b) => a + b, 0);
    const maxSum = 4 * total;
    const pct = sum / maxSum;

    let label = '';
    let text = '';

    if(pct <= 0.40){
      label = 'Mindset Fixo';
      text = '<p><strong>Mindset Fixo</strong></p>'
           + '<p>Suas respostas indicam uma preferência por um Mindset Fixo. Você tende a acreditar que inteligência e talento são traços estáticos e que esforço nem sempre altera resultados significativos. Isso pode fazer com que você evite desafios, desista mais rápido diante de dificuldades e veja esforço como algo menos valioso.</p>'
           + '<p><em>Resumo:</em> foco na validação, aversão ao erro e busca por resultados imediatos. Sugestão: praticar a mentalidade de processo e encarar erros como aprendizado.</p>';
    } else if(pct >= 0.60){
      label = 'Mindset de Crescimento';
      text = '<p><strong>Mindset de Crescimento</strong></p>'
           + '<p>Suas respostas indicam uma preferência por um Mindset de Crescimento. Você tende a acreditar que habilidades podem ser desenvolvidas com esforço, estratégia e aprendizagem contínua. Isso favorece persistência, busca por desafios e valorização do processo de aprendizagem.</p>'
           + '<p><em>Resumo:</em> valoriza esforço e prática deliberada, aceita feedback e persiste diante de dificuldades. Sugestão: definir metas de aprendizagem e celebrar progresso.</p>';
    } else {
      label = 'Mindset Indiferenciado';
      text = '<p><strong>Mindset Indiferenciado</strong></p>'
           + '<p>Suas respostas sugerem que você tem um Mindset indiferenciado (ou misto). Isso significa que suas crenças oscilam entre acreditar que pessoas podem melhorar por meio do esforço e acreditar que talento é inato. Em algumas situações você reage com mentalidade de crescimento, em outras com mentalidade fixa.</p>'
           + '<p><em>Resumo:</em> flexível, porém inconsistente; vale trabalhar a consciência situacional e estratégias para ativar o mindset de crescimento quando necessário.</p>';
    }

    if (resultTitle) resultTitle.textContent = label;
    if (resultText) resultText.innerHTML = text;
    if (resultMeta) resultMeta.innerHTML = `<p><strong>Pontuação:</strong> ${sum} de ${maxSum} (${Math.round(pct*100)}%)</p><p><small>Interpretação adaptada a partir de conceitos do livro de Carol S. Dweck.</small></p>`;
    showResult();
  }

  function showResult(){
    if (resultPanel) {
      resultPanel.setAttribute('aria-hidden','false');
      resultPanel.classList.add('visible');
      if (closeResult) closeResult.focus();
    }
  }

  function hideResult(){
    if (resultPanel) {
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
    const element = document.querySelector('.result-card');
    const opt = {
      margin: 10,
      filename: `resultado-mindset-${new Date().toISOString().slice(0,10)}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' }
    };
    if (typeof html2pdf === 'function') {
      html2pdf().set(opt).from(element).save();
    } else {
      alert('PDF não disponível (biblioteca html2pdf não carregada).');
    }
  }

  // handlers
  if (closeResult) closeResult.addEventListener('click', hideResult);
  if (retryTest) retryTest.addEventListener('click', function(){ hideResult(); resetTest(); startTest(); });
  if (savePdf) savePdf.addEventListener('click', saveResultAsPdf);

  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape' && resultPanel && resultPanel.classList.contains('visible')) hideResult();
    if(e.key === 'ArrowRight' && nextBtn) nextBtn.click();
    if(e.key === 'ArrowLeft' && prevBtn) prevBtn.click();
  });

  // start / cover listeners
  if (startBtn) startBtn.addEventListener('click', function(){ startTest(); });
  if (backToCover) backToCover.addEventListener('click', function(){ showCover(); });
  if (learnMore) learnMore.addEventListener('click', function(){ alert('Este teste é uma adaptação baseada nas pesquisas de Carol S. Dweck sobre Mindset. Responda honestamente e veja sua interpretação ao final.'); });

  // inicializa mostrando a capa
  showCover();
})();
