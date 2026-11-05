// langue.js — outils de langue : lecture du balisage des phrases, romaji et guide de prononciation.
//
// Dans les données, le japonais s'écrit avec un seul format :
//   学生[がくせい] は 食[た]べます。
// - base[lecture] : un mot en kanji avec sa lecture en kana.
// - les espaces séparent les groupes (ils servent au romaji et aux exercices d'ordre).
// - l'apostrophe dans une lecture (思[おも']う) indique que deux voyelles ne forment PAS un son long.

const Langue = (() => {
  const SYLLABES = {
    あ:['a','a'], い:['i','i'], う:['u','ou'], え:['e','é'], お:['o','o'],
    か:['ka','ka'], き:['ki','ki'], く:['ku','kou'], け:['ke','ké'], こ:['ko','ko'],
    さ:['sa','sa'], し:['shi','chi'], す:['su','sou'], せ:['se','sé'], そ:['so','so'],
    た:['ta','ta'], ち:['chi','tchi'], つ:['tsu','tsou'], て:['te','té'], と:['to','to'],
    な:['na','na'], に:['ni','ni'], ぬ:['nu','nou'], ね:['ne','né'], の:['no','no'],
    は:['ha','ha'], ひ:['hi','hi'], ふ:['fu','fou'], へ:['he','hé'], ほ:['ho','ho'],
    ま:['ma','ma'], み:['mi','mi'], む:['mu','mou'], め:['me','mé'], も:['mo','mo'],
    や:['ya','ya'], ゆ:['yu','you'], よ:['yo','yo'],
    ら:['ra','ra'], り:['ri','ri'], る:['ru','rou'], れ:['re','ré'], ろ:['ro','ro'],
    わ:['wa','wa'], を:['o','o'], ん:['n','n'],
    が:['ga','ga'], ぎ:['gi','gui'], ぐ:['gu','gou'], げ:['ge','gué'], ご:['go','go'],
    ざ:['za','za'], じ:['ji','dji'], ず:['zu','zou'], ぜ:['ze','zé'], ぞ:['zo','zo'],
    だ:['da','da'], ぢ:['ji','dji'], づ:['zu','zou'], で:['de','dé'], ど:['do','do'],
    ば:['ba','ba'], び:['bi','bi'], ぶ:['bu','bou'], べ:['be','bé'], ぼ:['bo','bo'],
    ぱ:['pa','pa'], ぴ:['pi','pi'], ぷ:['pu','pou'], ぺ:['pe','pé'], ぽ:['po','po'],
    きゃ:['kya','kya'], きゅ:['kyu','kyou'], きょ:['kyo','kyo'],
    しゃ:['sha','cha'], しゅ:['shu','chou'], しょ:['sho','cho'],
    ちゃ:['cha','tcha'], ちゅ:['chu','tchou'], ちょ:['cho','tcho'],
    にゃ:['nya','nya'], にゅ:['nyu','nyou'], にょ:['nyo','nyo'],
    ひゃ:['hya','hya'], ひゅ:['hyu','hyou'], ひょ:['hyo','hyo'],
    みゃ:['mya','mya'], みゅ:['myu','myou'], みょ:['myo','myo'],
    りゃ:['rya','rya'], りゅ:['ryu','ryou'], りょ:['ryo','ryo'],
    ぎゃ:['gya','guya'], ぎゅ:['gyu','guyou'], ぎょ:['gyo','guyo'],
    じゃ:['ja','dja'], じゅ:['ju','djou'], じょ:['jo','djo'],
    びゃ:['bya','bya'], びゅ:['byu','byou'], びょ:['byo','byo'],
    ぴゃ:['pya','pya'], ぴゅ:['pyu','pyou'], ぴょ:['pyo','pyo'],
    // Sons empruntés, écrits en katakana (convertis ici en hiragana)
    ふぁ:['fa','fa'], ふぃ:['fi','fi'], ふぇ:['fe','fé'], ふぉ:['fo','fo'],
    てぃ:['ti','ti'], でぃ:['di','di'], とぅ:['tu','tou'], どぅ:['du','dou'],
    つぁ:['tsa','tsa'], つぃ:['tsi','tsi'], つぇ:['tse','tsé'], つぉ:['tso','tso'], いぇ:['ye','yé'],
    しぇ:['she','ché'], ちぇ:['che','tché'], じぇ:['je','djé'],
    うぃ:['wi','wi'], うぇ:['we','wé'], うぉ:['wo','wo'],
    ゔぁ:['va','va'], ゔぃ:['vi','vi'], ゔ:['vu','vou'], ゔぇ:['ve','vé'], ゔぉ:['vo','vo'],
  };
  const PETITS = 'ゃゅょぁぃぅぇぉ';
  // Petits mots où は se lit « wa » et へ se lit « é »
  const MOTS_WA = new Set(['は','では','には','とは','ては','からは','までは','へは','今度は']);

  const estKatakana = c => c >= 'ァ' && c <= 'ヶ';
  const estKanji = c => (c >= '一' && c <= '鿿') || c === '々';
  const versHiragana = s => [...s].map(c => estKatakana(c) ? String.fromCharCode(c.charCodeAt(0) - 0x60) : c).join('');

  // Découpe du balisage en segments : {base, lecture} ou {texte}
  function segments(brut) {
    const out = [];
    const re = /([^\s\[\]]*?)\[([^\]]+)\]/g;
    let fin = 0, m;
    while ((m = re.exec(brut))) {
      // La base est la suite de kanji juste avant le crochet
      let debutBase = m.index + m[1].length;
      while (debutBase > fin && estKanji(brut[debutBase - 1])) debutBase--;
      if (debutBase > fin) out.push({ texte: brut.slice(fin, debutBase) });
      out.push({ base: brut.slice(debutBase, m.index + m[1].length), lecture: m[2] });
      fin = m.index + m[0].length;
    }
    if (fin < brut.length) out.push({ texte: brut.slice(fin) });
    return out;
  }

  // Forme en kana, avec les espaces. Garde l'apostrophe si garder=true (pour le romaji).
  function enKana(brut, garder) {
    const s = segments(brut).map(x => x.texte !== undefined ? x.texte : x.lecture).join('');
    return garder ? s : s.replace(/'/g, '');
  }

  // Forme écrite normale (avec kanji), sans lectures.
  function enEcrit(brut) {
    return segments(brut).map(x => x.texte !== undefined ? x.texte : x.base).join('');
  }

  // Convertit un groupe (sans espace) en syllabes : [romaji, guide][]
  function syllabes(groupe) {
    const h = versHiragana(groupe);
    const res = [];
    let attente = false; // petit っ
    for (let i = 0; i < h.length; i++) {
      const c = h[i];
      if (c === "'") { res.push(null); continue; }
      if (c === 'っ') { attente = true; continue; }
      if (c === 'ー') { res.push('LONG'); continue; }
      let syl = null;
      if (i + 1 < h.length && PETITS.includes(h[i + 1]) && SYLLABES[c + h[i + 1]]) { syl = SYLLABES[c + h[i + 1]]; i++; }
      else if (SYLLABES[c]) syl = SYLLABES[c];
      if (!syl) { if (/[、。！？!?,.…「」『』〜～・]/.test(c)) continue; res.push(['?', '?']); continue; }
      let [r, g] = syl;
      if (attente) {
        const rp = r.startsWith('ch') ? 't' : r[0];
        const gp = g.startsWith('tch') ? 't' : g.startsWith('ch') ? 's' : g.startsWith('dj') ? 'd' : g[0];
        r = rp + r; g = gp + '-' + g;
        attente = false;
      }
      res.push([r, g]);
    }
    return res;
  }

  const voyelle = r => r[r.length - 1];
  const LONG_R = { a:'ā', i:'ī', u:'ū', e:'ē', o:'ō' };
  const LONG_G = { a:'â', i:'î', ou:'oû', é:'éé', o:'ô' };

  // Fusionne les sons longs (おう, おお, うう, ああ, ee, ー) et produit les deux écritures d'un groupe.
  function groupe(tok, signeSeul) {
    let t = tok;
    const propre = t.replace(/[、。！？!?,.…「」『』〜]/g, '');
    if (signeSeul) { /* un kana montré seul garde son vrai son : は = ha, へ = he */ }
    else if (MOTS_WA.has(propre)) t = t.replace(/は/, 'わ');
    else if (propre.startsWith('では') || propre.endsWith('では')) t = t.replace(/は/, "わ'");
    t = t.replace(/じゃあり/, "じゃ'あり"); // じゃ + あります : pas un son long
    if (propre === 'へ' && !signeSeul) t = t.replace('へ', 'え');
    if (propre === 'こんにちは' || propre === 'こんばんは') t = t.replace(/は/, 'わ');
    const syl = syllabes(t);
    let rom = [], gui = [];
    for (let i = 0; i < syl.length; i++) {
      const s = syl[i];
      if (s === null) continue;
      const prec = rom.length ? rom[rom.length - 1] : null;
      if (s === 'LONG') {
        if (prec) {
          const v = voyelle(prec);
          if (LONG_R[v]) {
            rom[rom.length - 1] = prec.slice(0, -1) + LONG_R[v];
            gui[gui.length - 1] = allonge(gui[gui.length - 1]);
          }
        }
        continue;
      }
      const [r, g] = s;
      const coupe = syl[i - 1] === null;
      if (prec && !coupe && r.length === 1) {
        const v = voyelle(prec);
        if ((v === 'o' && (r === 'u' || r === 'o')) || (v === 'u' && r === 'u') || (v === 'a' && r === 'a') || (v === 'e' && r === 'e')) {
          rom[rom.length - 1] = prec.slice(0, -1) + LONG_R[v];
          gui[gui.length - 1] = allonge(gui[gui.length - 1]);
          continue;
        }
        if (v === 'i' && r === 'i') { // on garde « ii » en romaji, plus lisible
          rom[rom.length - 1] = prec + 'i';
          gui[gui.length - 1] = allonge(gui[gui.length - 1]);
          continue;
        }
        if (v === 'e' && r === 'i') { // えい se prononce comme un é long
          rom[rom.length - 1] = prec + 'i';
          gui[gui.length - 1] = allonge(gui[gui.length - 1]);
          continue;
        }
      }
      rom.push(r); gui.push(g);
    }
    return { romaji: rom.join(''), guide: lisser(gui) };
  }

  function allonge(g) {
    if (g.endsWith('ou')) return g.slice(0, -2) + 'oû';
    if (g.endsWith('é')) return g.slice(0, -1) + 'éé';
    if (g.endsWith('a')) return g.slice(0, -1) + 'â';
    if (g.endsWith('i')) return g.slice(0, -1) + 'î';
    if (g.endsWith('o')) return g.slice(0, -1) + 'ô';
    return g;
  }

  // Assemble avec des traits d'union et applique les voyelles avalées de です et ます.
  function lisser(g) {
    let s = '';
    g.forEach((x, i) => {
      if (i === 0) { s = x; return; }
      if (s.endsWith('-') || /^[a-zà-ÿ]-/.test(x)) s += (/^[a-zà-ÿ]-/.test(x) ? x : x);
      else s += '-' + x;
    });
    return s
      .replace(/dé-sou(-ka|-né|-yo|-ga)?$/, 'dess$1')
      .replace(/ma-sou(-ka|-né|-yo|-ga)?$/, 'mass$1')
      .replace(/ma-chi-ta$/, 'mach-ta')
      .replace(/dé-chi-ta$/, 'dech-ta');
  }

  function lire(brut) {
    const toks = enKana(brut, true).replace(/[、。！？]/g, '$& ').trim().split(/\s+/).filter(Boolean);
    const parts = toks.map(t => groupe(t));
    return {
      romaji: parts.map(p => p.romaji).filter(Boolean).join(' '),
      guide: parts.map(p => p.guide).filter(Boolean).join(' '),
    };
  }

  const lireSigne = jp => groupe(jp, true);

  // Romaji tapé au clavier → hiragana. « gakkou » donne がっこう.
  const INVERSE = {};
  Object.keys(SYLLABES).forEach(k => { const r = SYLLABES[k][0]; if (!INVERSE[r]) INVERSE[r] = k; });
  Object.assign(INVERSE, { si: 'し', hu: 'ふ', zi: 'じ', wo: 'を', sya: 'しゃ', syu: 'しゅ', syo: 'しょ', tya: 'ちゃ', tyu: 'ちゅ', tyo: 'ちょ', jya: 'じゃ', jyu: 'じゅ', jyo: 'じょ' });
  function versKana(texte) {
    const t = texte.toLowerCase().replace(/ā/g, 'aa').replace(/ī/g, 'ii').replace(/ū/g, 'uu').replace(/ē/g, 'ee').replace(/ō/g, 'ou');
    let out = '', i = 0;
    while (i < t.length) {
      const c = t[i];
      if (c === "'" || c === '-' || c === ' ') { i++; continue; }
      if (i + 1 < t.length && /[bcdfghjklmpqrstvwyz]/.test(c) && (t[i + 1] === c || (c === 't' && t[i + 1] === 'c'))) { out += 'っ'; i++; continue; }
      let trouve = false;
      for (let n = 3; n >= 1 && !trouve; n--) {
        const m = INVERSE[t.slice(i, i + n)];
        if (m) { out += m; i += n; trouve = true; }
      }
      if (!trouve) { out += c; i++; }
    }
    return out;
  }
  // Compare une réponse tapée (romaji ou kana) à la réponse attendue, longueurs comprises.
  const canon = x => lireSigne(x.replace(/[\s'〜]/g, '')).romaji.replace(/ā/g, 'aa').replace(/ī/g, 'ii').replace(/ū/g, 'uu').replace(/ē/g, 'ee').replace(/ō/g, 'oo');
  const reponseJuste = (tape, attendu) => {
    const t = tape.trim();
    if (!t) return false;
    return canon(/[a-zA-Zāīūēō]/.test(t) ? versKana(t) : t) === canon(attendu);
  };

  return { segments, enKana, enEcrit, lire, lireSigne, versKana, reponseJuste, estKanji, versHiragana };
})();

if (typeof module !== 'undefined') module.exports = Langue;
