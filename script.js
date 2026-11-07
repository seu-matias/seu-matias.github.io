(function () {
  'use strict';

  var reduz = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var WA = 'https://wa.me/5547999788806?text=';
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }

  // Ano do rodapé
  var ano = $('#ano');
  if (ano) ano.textContent = new Date().getFullYear();

  /* ---------- Topo: sombra ao rolar e barra de poste ---------- */
  var topo = $('#topo');
  var pole = $('#poleFill');
  var ticking = false;
  function aoRolar() {
    ticking = false;
    var y = window.scrollY || document.documentElement.scrollTop;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    if (topo) topo.classList.toggle('is-rolou', y > 8);
    if (pole) pole.style.setProperty('--p', max > 0 ? Math.min(1, y / max).toFixed(4) : 0);
    passosProgresso();
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(aoRolar); }
  }, { passive: true });

  /* ---------- Linha do tempo da prótese ---------- */
  var passos = $('#passos');
  function passosProgresso() {
    if (!passos) return;
    var r = passos.getBoundingClientRect();
    var alvo = window.innerHeight * 0.6;
    var f = (alvo - r.top) / r.height;
    passos.style.setProperty('--fill', Math.max(0, Math.min(1, f)).toFixed(3));
  }

  /* ---------- Aberto agora / fechado ---------- */
  // Horários em minutos desde 0h. Dia 0 = domingo.
  var HORAS = {
    0: [],
    1: [[510, 720], [840, 1140]], 2: [[510, 720], [840, 1140]], 3: [[510, 720], [840, 1140]],
    4: [[510, 720], [840, 1140]], 5: [[510, 720], [840, 1140]],
    6: [[510, 1020]]
  };
  var DIAS = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
  function hm(min) {
    var h = Math.floor(min / 60), m = min % 60;
    return h + 'h' + (m ? (m < 10 ? '0' + m : m) : '');
  }
  function agoraSP() {
    try {
      var p = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Sao_Paulo', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false }).formatToParts(new Date());
      var o = {}; p.forEach(function (x) { o[x.type] = x.value; });
      var mapa = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      var h = parseInt(o.hour, 10) % 24;
      return { d: mapa[o.weekday], min: h * 60 + parseInt(o.minute, 10) };
    } catch (e) {
      var n = new Date(); return { d: n.getDay(), min: n.getHours() * 60 + n.getMinutes() };
    }
  }
  function proximaAbertura(d, min) {
    for (var i = 0; i < 8; i++) {
      var dia = (d + i) % 7, faixas = HORAS[dia];
      for (var j = 0; j < faixas.length; j++) {
        if (i > 0 || faixas[j][0] > min) return { i: i, dia: dia, min: faixas[j][0] };
      }
    }
    return null;
  }
  function status() {
    var n = agoraSP(), faixas = HORAS[n.d], texto, estado = 'fechado';
    for (var k = 0; k < faixas.length; k++) {
      if (n.min >= faixas[k][0] && n.min < faixas[k][1]) { estado = 'aberto'; texto = 'Aberto agora, fecha às ' + hm(faixas[k][1]); }
    }
    if (estado === 'fechado') {
      var prox = proximaAbertura(n.d, n.min);
      if (!prox) texto = 'Fechado agora';
      else if (prox.i === 0) texto = 'Fechado agora, abre às ' + hm(prox.min);
      else if (prox.i === 1) texto = 'Fechado agora, abre amanhã às ' + hm(prox.min);
      else texto = 'Fechado agora, abre ' + (prox.dia === 0 || prox.dia === 6 ? 'no ' : 'na ') + DIAS[prox.dia] + ' às ' + hm(prox.min);
    }
    $$('[data-status]').forEach(function (el) {
      el.classList.remove('is-aberto', 'is-fechado');
      el.classList.add('is-' + estado);
      var t = $('[data-status-texto]', el); if (t) t.textContent = texto;
    });
    $$('.horas tr').forEach(function (tr) {
      tr.classList.toggle('is-hoje', parseInt(tr.getAttribute('data-d'), 10) === n.d);
    });
  }
  status();
  setInterval(status, 60000);

  /* ---------- Revelar ao rolar ---------- */
  var rvs = $$('.rv');
  if ('IntersectionObserver' in window && !reduz) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    rvs.forEach(function (el) { io.observe(el); });
  } else {
    rvs.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Números que contam ---------- */
  function fmt(v, dec) { return v.toFixed(dec).replace('.', ','); }
  var contas = $$('[data-conta]');
  function conta(el) {
    var alvo = parseFloat(el.getAttribute('data-conta')), dec = parseInt(el.getAttribute('data-dec') || '0', 10);
    if (reduz) { el.textContent = fmt(alvo, dec); return; }
    var t0 = null, dur = 1400;
    function passo(t) {
      if (t0 === null) t0 = t;
      var p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(alvo * e, dec);
      if (p < 1) requestAnimationFrame(passo); else el.textContent = fmt(alvo, dec);
    }
    requestAnimationFrame(passo);
  }
  if ('IntersectionObserver' in window) {
    var io2 = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { conta(e.target); io2.unobserve(e.target); } });
    }, { threshold: 0.6 });
    contas.forEach(function (el) { io2.observe(el); });
  }

  /* ---------- Monte o seu atendimento ---------- */
  var svcs = $$('.svc');
  var lista = $('#pedidoLista'), vazio = $('#pedidoVazio'), totalEl = $('#pedidoTotal'), tempoEl = $('#pedidoTempo');
  var btn = $('#pedidoBtn'), btnTxt = $('#pedidoBtnTxt');
  var msgPadrao = 'Olá! Vim pelo site e quero agendar um horário na Barbearia Seu Matias.';
  function tempo(min) {
    if (!min) return '0 min';
    var h = Math.floor(min / 60), m = min % 60;
    return (h ? h + 'h' : '') + (h && m ? ' ' : '') + (m ? m + ' min' : '');
  }
  function reais(v) { return 'R$ ' + v; }
  function atualiza() {
    var itens = [], total = 0, min = 0;
    svcs.forEach(function (s) {
      var on = $('input', s).checked;
      s.classList.toggle('is-on', on);
      if (on) {
        var p = parseInt(s.getAttribute('data-preco'), 10), m = parseInt(s.getAttribute('data-min'), 10);
        itens.push({ nome: s.getAttribute('data-nome'), preco: p, min: m });
        total += p; min += m;
      }
    });
    lista.innerHTML = '';
    itens.forEach(function (i) {
      var li = document.createElement('li');
      var a = document.createElement('span'); a.textContent = i.nome;
      var b = document.createElement('span'); b.textContent = reais(i.preco);
      li.appendChild(a); li.appendChild(b); lista.appendChild(li);
    });
    vazio.hidden = itens.length > 0;
    totalEl.textContent = reais(total);
    tempoEl.textContent = tempo(min);
    var msg = msgPadrao;
    if (itens.length) {
      msg = 'Olá! Vim pelo site e quero agendar: ' + itens.map(function (i) { return i.nome; }).join(' + ') +
        '. Total de ' + reais(total) + ', cerca de ' + tempo(min) + '. Quais horários vocês têm?';
    }
    btn.href = WA + encodeURIComponent(msg);
    btnTxt.textContent = itens.length ? 'Agendar este pedido no WhatsApp' : 'Agendar no WhatsApp';
  }
  svcs.forEach(function (s) { $('input', s).addEventListener('change', atualiza); });
  atualiza();

  /* ---------- Comparador antes e depois ---------- */
  var ba = $('#ba');
  if (ba) {
    var range = $('.ba__range', ba);
    function pos(v) { ba.style.setProperty('--pos', v + '%'); }
    range.addEventListener('input', function () { pos(range.value); });
    // Dica: balança uma vez quando aparece
    if ('IntersectionObserver' in window && !reduz) {
      var tocou = false;
      var io3 = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting && !tocou) {
            tocou = true; io3.disconnect();
            var t0 = null;
            (function passo(t) {
              if (t0 === null) t0 = t;
              var p = Math.min(1, (t - t0) / 1800);
              var v = 50 + Math.sin(p * Math.PI * 2) * 32 * (1 - p * 0.3);
              if (range.matches(':active')) return;
              range.value = v; pos(v);
              if (p < 1) requestAnimationFrame(passo); else { range.value = 50; pos(50); }
            })(performance.now());
          }
        });
      }, { threshold: 0.6 });
      io3.observe(ba);
    }
  }

  /* ---------- Galeria: filtro + ampliação ---------- */
  var filtros = $$('.filtro');
  var figs = $$('#mosaico figure');
  filtros.forEach(function (b) {
    b.addEventListener('click', function () {
      var f = b.getAttribute('data-f'), k = 0;
      filtros.forEach(function (x) { var on = x === b; x.classList.toggle('is-on', on); x.setAttribute('aria-pressed', on ? 'true' : 'false'); });
      figs.forEach(function (fg) {
        var mostra = f === 'todos' || fg.getAttribute('data-c') === f;
        fg.hidden = !mostra;
        fg.classList.remove('entra');
        if (mostra && !reduz) { fg.style.setProperty('--k', k++); void fg.offsetWidth; fg.classList.add('entra'); }
      });
    });
  });

  var lb = $('#lb'), lbImg = $('#lbImg'), lbCap = $('#lbCap'), atual = 0;
  function visiveis() { return figs.filter(function (f) { return !f.hidden; }); }
  function abre(i) {
    var v = visiveis(); if (!v.length) return;
    atual = (i + v.length) % v.length;
    var btnFoto = $('.foto', v[atual]), img = $('img', btnFoto);
    lbImg.src = img.currentSrc || img.src;
    lbImg.alt = img.alt;
    lbCap.textContent = btnFoto.getAttribute('data-cap') || img.alt;
  }
  if (lb && typeof lb.showModal === 'function') {
    figs.forEach(function (fg) {
      $('.foto', fg).addEventListener('click', function () {
        abre(visiveis().indexOf(fg));
        lb.showModal();
      });
    });
    $('#lbX').addEventListener('click', function () { lb.close(); });
    $('#lbP').addEventListener('click', function () { abre(atual - 1); });
    $('#lbN').addEventListener('click', function () { abre(atual + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) lb.close(); });
    lb.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') abre(atual - 1);
      if (e.key === 'ArrowRight') abre(atual + 1);
    });
  } else {
    $$('.foto').forEach(function (b) { b.style.cursor = 'default'; });
  }

  /* ---------- Mapa: só carrega quando a pessoa pede ---------- */
  var mapaBtn = $('#mapaBtn'), mapa = $('#mapa');
  if (mapaBtn && mapa) {
    mapaBtn.addEventListener('click', function () {
      var f = document.createElement('iframe');
      f.src = 'https://www.google.com/maps?q=-26.0323404,-48.8562409&z=17&output=embed';
      f.title = 'Mapa: Barbearia Seu Matias, Av. Celso Ramos, 1391, Garuva/SC';
      f.loading = 'lazy';
      f.referrerPolicy = 'no-referrer-when-downgrade';
      mapa.innerHTML = '';
      mapa.appendChild(f);
    });
  }

  aoRolar();
})();
