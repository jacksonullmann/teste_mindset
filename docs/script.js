// script.js - versão enxuta e compatível com index.html
(function () {
  // Perguntas
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
    "Estou sempre me desenvolvendo em uma área ou outra; eu gosto de aprender coisas novas.",
    "Acredito que a inteligência sempre pode ser melhorada.",
    "Acredito que todos os seres humanos sem lesões cerebrais ou grandes defeitos congênitos são capazes da mesma quantidade de aprendizado."
  ];

  // Estado
  const total = questions.length;
  let current = 0;
  let answers = new Array(total).fill(2); // default no-op (meio)

  // Elementos
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
  const resultCard = document.getElementById('resultCard');
  const resultTitle = document.getElementById('resultTitle');
  const resultText = document.getElementById('resultText');
  const resultMeta = document.getElementById('resultMeta');

  const btnSalvarPdf = document.getElementById('btnSalvarPdf');
  const btnFechar = document.getElementById('btnFechar');
  const btnRefazer = document.getElementById('btnRefazer');

  // Helpers
  function showCover() {
    if (cover) {
      cover.classList.remove('hidden');
      cover.style.display = '';
      cover.setAttribute('aria-hidden', 'false');
    }
    if (app) {
      app.classList.add('hidden');
      app.style.display = 'none';
      app.setAttribute('aria-hidden', 'true');
    }
    window.scrollTo(0,0);
    startBtn && startBtn.focus();
  }

  function showApp() {
    if (cover) {
      cover.classList.add('hidden');
      cover.style.display = 'none';
      cover.setAttribute('aria-hidden', 'true');
    }
    if (app) {
      app.classList.remove('hidden');
      app.style.display = '';
      app.setAttribute('aria-hidden', 'false');
    }
    renderQuestion();
  }

  function renderQuestion() {
    qnum && (qnum.textContent = String(current + 1));
    qtext && (qtext.textContent = questions[current]);
    progressBar && (progressBar.style.width = `${Math.round(((current+1)/total)*100)}%`);
    if (slider) slider.value = answers[current];
    prevBtn && (prevBtn.disabled = current === 0);
    nextBtn && (nextBtn.textContent = current === total - 1 ? 'FINALIZAR' : 'PRÓXIMO');
  }

  function saveAnswer(val) {
    answers[current] = Number(val);
  }

  function calcResult() {
    // Exemplo simples: soma normalizada e classificação
    const sum = answers.reduce((s, v) => s + Number(v), 0);
    const max = total * 4;
    const pct = Math.round((sum / max) * 100);
    let label = 'Mindset Neutro';
    if (pct >= 70) label = 'Mindset de Crescimento';
    else if (pct <= 30) label = 'Mindset Fixo';
    return { sum, pct, label };
  }

  function showResultPanel() {
    const r = calcResult();
    resultTitle && (resultTitle.textContent = r.label);
    resultText && (resultText.innerHTML = `<p>Pontuação: ${r.sum} de ${total*4} (${r.pct}%)</p><p>Interpretação: ${r.pct >=70 ? 'Você tende a ver habilidades como desenvolvíveis.' : (r.pct <=30 ? 'Você tende a ver habilidades como fixas.' : 'Você tem crenças mistas sobre aprendizado.') }</p>`);
    resultMeta && (resultMeta.textContent = `Total de perguntas: ${total}`);
    if (resultPanel) {
      resultPanel.style.display = 'flex';
      resultPanel.setAttribute('aria-hidden', 'false');
    }
    // foco para acessibilidade
    resultCard && resultCard.focus && resultCard.focus();
  }

  function hideResultPanel() {
    if (resultPanel) {
      resultPanel.style.display = 'none';
      resultPanel.setAttribute('aria-hidden', 'true');
    }
  }

  // Listeners
  startBtn && startBtn.addEventListener('click', showApp);
  backToCover && backToCover.addEventListener('click', showCover);

  prevBtn && prevBtn.addEventListener('click', function () {
    if (current > 0) {
      current--;
      renderQuestion();
    }
  });

  nextBtn && nextBtn.addEventListener('click', function () {
    if (current < total - 1) {
      // grava e avança
      if (slider) saveAnswer(slider.value);
      current++;
      renderQuestion();
    } else {
      // último -> mostrar resultado
      if (slider) saveAnswer(slider.value);
      showResultPanel();
    }
  });

  slider && slider.addEventListener('input', function () {
    // resposta imediata ao mover
    saveAnswer(this.value);
  });

  // Resultado: salvar PDF (usa html2pdf já incluído no index)
  if (btnSalvarPdf) {
    btnSalvarPdf.addEventListener('click', function (e) {
      e.preventDefault();
      if (!resultCard) return alert('Nada para salvar');
      try {
        const opt = {
          margin: 10,
          filename: 'resultado.pdf',
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        html2pdf().set(opt).from(resultCard).save().catch(function (err) {
          console.error('html2pdf error', err);
          alert('Falha ao gerar PDF. Use Imprimir → Salvar como PDF.');
        });
      } catch (err) {
        console.error('Erro ao gerar PDF', err);
        alert('Erro ao gerar PDF. Use Imprimir → Salvar como PDF.');
      }
    });
  }

  // Fechar
  btnFechar && btnFechar.addEventListener('click', function (e) {
    e.preventDefault();
    hideResultPanel();
  });

  // Refazer
  btnRefazer && btnRefazer.addEventListener('click', function (e) {
    e.preventDefault();
    // reinicia estado
    answers = new Array(total).fill(2);
    current = 0;
    hideResultPanel();
    showApp();
  });

  // Start state
  showCover();

  // Expor util para debug/uso
  window._testeMindset = {
    questions, answers, calcResult, showResultPanel, showCover, showApp
  };
})();
