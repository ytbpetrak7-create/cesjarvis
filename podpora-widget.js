/* J.A.R.V.I.S. AI podpora — widget na jakoukoliv stránku.
   Použití:
   1) Zkopíruj tento soubor vedle své stránky.
   2) Před </body> vlož:
      <script>const JARVIS_PODPORA = { nadpis: 'Podpora', email: 'tvuj@mail.cz', znalosti: [...] };</script>
      <script src="podpora-widget.js"></script>
   Bez nastavení fungují výchozí odpovědi (uprav si je níže v DEFAULT_ZNALOSTI).
*/
(function () {
  const NAST = (typeof JARVIS_PODPORA !== 'undefined') ? JARVIS_PODPORA : {};
  const NADPIS = NAST.nadpis || 'AI podpora';
  const EMAIL = NAST.email || 'objednavky@jarvis.cz';
  const DEFAULT_ZNALOSTI = [
    { k: ['cena', 'stojí', 'kolik', 'platit', 'koupit'], o: 'Ceny najdeš v ceníku na hlavní stránce. Objednáš přes košík.' },
    { k: ['kontakt', 'email', 'mail', 'telefon'], o: 'Napiš nám na ' + EMAIL + '.' },
    { k: ['doprava', 'doručení', 'odeslání', 'kdy přijde'], o: 'Digitální zboží chodí mailem obvykle do 24 hodin.' },
    { k: ['reklamace', 'vrácení', 'nefunguje', 'problém', 'chyba'], o: 'Mrzí nás to! Napiš na ' + EMAIL + ' s popisem problému.' },
    { k: ['ahoj', 'čau', 'zdravím', 'dobrý den'], o: 'Ahoj! Ptej se na ceny, objednávku nebo problémy.' },
    { k: ['dík', 'děkuji', 'super'], o: 'Rádo se stalo!' }
  ];
  const ZNALOSTI = (NAST.znalosti && NAST.znalosti.length) ? NAST.znalosti : DEFAULT_ZNALOSTI;

  const css = '#jp-btn{position:fixed;bottom:20px;right:20px;width:60px;height:60px;border-radius:50%;border:none;background:#00d4ff;font-size:28px;cursor:pointer;z-index:9999;box-shadow:0 4px 15px rgba(0,0,0,.4);}'
    + '#jp-box{display:none;position:fixed;bottom:95px;right:20px;width:330px;max-width:90vw;height:440px;max-height:70vh;background:#121a2b;color:#e8edf5;border-radius:12px;z-index:9999;flex-direction:column;overflow:hidden;border:1px solid #00d4ff;font-family:Arial,sans-serif;}'
    + '#jp-box.open{display:flex;}'
    + '#jp-head{background:#00d4ff;color:#04121a;font-weight:bold;padding:12px;text-align:center;}'
    + '#jp-chat{flex:1;overflow-y:auto;padding:12px;}'
    + '.jp-msg{margin:8px 0;padding:10px 12px;border-radius:10px;max-width:85%;font-size:.95em;}'
    + '.jp-me{background:#1e2c4a;margin-left:auto;}'
    + '.jp-bot{background:#0a0e17;border-left:3px solid #00d4ff;}'
    + '#jp-bar{display:flex;gap:8px;padding:10px;}'
    + '#jp-in{flex:1;padding:10px;border-radius:6px;border:1px solid #223;background:#000;color:#e8edf5;}'
    + '#jp-send{background:#00d4ff;color:#04121a;border:none;border-radius:6px;padding:10px 14px;font-weight:bold;cursor:pointer;}';
  const st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  const btn = document.createElement('button');
  btn.id = 'jp-btn';
  btn.textContent = '💬';
  btn.title = NADPIS;
  document.body.appendChild(btn);

  const box = document.createElement('div');
  box.id = 'jp-box';
  box.innerHTML = '<div id="jp-head">' + NADPIS + '</div><div id="jp-chat"></div>'
    + '<div id="jp-bar"><input id="jp-in" placeholder="Napiš dotaz…"><button id="jp-send">➤</button></div>';
  document.body.appendChild(box);

  const chat = box.querySelector('#jp-chat');
  const input = box.querySelector('#jp-in');
  function add(who, text) {
    const d = document.createElement('div');
    d.className = 'jp-msg ' + who;
    d.textContent = text;
    chat.appendChild(d);
    chat.scrollTop = chat.scrollHeight;
  }
  function odpovez(q) {
    const s = q.toLowerCase();
    let best = null, bestN = 0;
    for (const z of ZNALOSTI) {
      let n = 0;
      for (const k of z.k) if (s.includes(k)) n++;
      if (n > bestN) { bestN = n; best = z; }
    }
    add('jp-bot', best ? best.o : 'Na tohle neznám odpověď. Napiš nám na ' + EMAIL + '.');
  }
  btn.onclick = () => {
    box.classList.toggle('open');
    if (box.classList.contains('open') && !chat.children.length) add('jp-bot', 'Ahoj! Jak mohu pomoci?');
  };
  function posli() {
    if (!input.value.trim()) return;
    add('jp-me', input.value);
    odpovez(input.value);
    input.value = '';
  }
  box.querySelector('#jp-send').onclick = posli;
  input.onkeydown = e => { if (e.key === 'Enter') posli(); };
})();
