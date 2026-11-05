// cours.js — assemble les données en 365 jours et fabrique les questions.
//
// Rythme : 13 étapes de 28 jours (6 leçons + 1 révision, 4 fois), puis l'examen final au jour 365.

const Cours = (() => {
  const nettoieSens = s => s.replace(/,?\s*\(?en (kanji|hiragana et kanji)\)?/g, '').trim();
  const melange = t => { const a = [...t]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const sansTilde = s => s.replace(/〜/g, '');

  const lecons = [];   // toutes les leçons, à plat
  const jours = [];    // les 365 jours
  const elements = new Map(); // id → élément (kana, mot, kanji)
  const mots = [], kanjis = [], grammaires = [];

  function ajoute(el) { if (!elements.has(el.id)) elements.set(el.id, el); return elements.get(el.id); }

  function fabriqueKana(jp, jour) {
    const lu = Langue.lireSigne(jp);
    const memo = MEMOS[jp];
    const script = /[゠-ヿ]/.test(jp) ? 'katakana' : 'hiragana';
    return ajoute({ id: 'k:' + jp, type: 'kana', jp, script, romaji: lu.romaji, guide: lu.guide, memo, jour });
  }

  function fabriqueMot(chaine, jour) {
    const [raw, fr] = chaine.split('|');
    const el = ajoute({ id: 'w:' + raw, type: 'mot', raw, fr: nettoieSens(fr), kana: Langue.enKana(raw), ecrit: Langue.enEcrit(raw), ...Langue.lire(raw), jour });
    if (!mots.includes(el)) mots.push(el);
    return el;
  }

  function fabriqueKanji(chaine, jour) {
    const [jp, fr, on, kun, traits] = chaine.split('|');
    const el = ajoute({ id: 'j:' + jp, type: 'kanji', jp, fr, on, kun, traits: +traits, jour });
    if (!kanjis.includes(el)) kanjis.push(el);
    return el;
  }

  function fabriqueQuestion(chaine, jour) {
    const [enonce, rep, dist, trad] = chaine.split('|');
    return { type: 'choix', enonce, rep, dist: dist.split(';').map(s => s.trim()), trad, jour };
  }

  function fabriqueExemple(chaine) {
    const [raw, fr] = chaine.split('|');
    return { raw, fr };
  }

  // Assemblage
  let n = 0;
  ETAPES.forEach((etape, ie) => {
    etape.numero = ie + 1;
    let compte = 0;
    etape.lecons.forEach((l, il) => {
      n++;
      const jour = { n, type: 'lecon', etape: ie + 1, titre: l.t, desc: l.d, lecon: l, source: [l] };
      jours.push(jour);
      l.jour = n;
      l.kanas = (typeof l.kana === 'string' ? [...l.kana] : (l.kana || [])).map(c => fabriqueKana(c, n));
      l.mots = (l.w || []).map(w => fabriqueMot(w, n));
      l.kanjis = (l.k || []).map(k => fabriqueKanji(k, n));
      l.exemples = (l.ex || []).map(fabriqueExemple);
      l.questions = (l.q || []).map(q => fabriqueQuestion(q, n));
      if (l.g) grammaires.push({ ...l.g, jour: n });
      lecons.push(l);
      compte++;
      if (compte % 6 === 0) {
        n++;
        const semaine = compte / 6;
        const recents = etape.lecons.slice(il - 5, il + 1);
        const estBilan = semaine === 4;
        jours.push(estBilan
          ? { n, type: 'bilan', etape: ie + 1, titre: `Bilan de l'étape ${ie + 1}`, desc: `Tout « ${etape.titre} », d'un coup.`, source: etape.lecons }
          : { n, type: 'revision', etape: ie + 1, titre: `Révision de la semaine ${semaine}`, desc: 'Les 6 derniers jours, en mélange.', source: recents });
      }
    });
  });
  n++;
  jours.push({ n, type: 'final', etape: 13, titre: 'Le grand examen N5', desc: 'Toute l\'année en une seule épreuve.', source: lecons });

  // Kanji connus à un jour donné : ce qui a été enseigné jusqu'à ce jour.
  function kanjiConnus(nJour) {
    const s = new Set();
    kanjis.forEach(k => { if (k.jour <= nJour) s.add(k.jp); });
    return s;
  }

  // ---------- Fabrication des questions ----------
  const unique = (t, f) => { const v = new Set(), r = []; t.forEach(x => { const k = f(x); if (!v.has(k)) { v.add(k); r.push(x); } }); return r; };

  // Choisit 3 mauvaises réponses, d'abord dans ce qui est déjà vu.
  function distracteurs(pool, bon, valeur, nJour) {
    const bonne = valeur(bon);
    const valide = unique(pool.filter(x => valeur(x) !== bonne && x.id !== bon.id), valeur);
    const vus = melange(valide.filter(x => x.jour <= nJour));
    const autres = melange(valide.filter(x => x.jour > nJour));
    return [...vus, ...autres].slice(0, 3);
  }

  function qKana(k, nJour, voix) {
    const pool = [...elements.values()].filter(e => e.type === 'kana' && e.script === k.script);
    const r = Math.random();
    if (voix && r < 0.25) {
      const d = distracteurs(pool, k, e => e.jp, nJour);
      return { sorte: 'ecoute', consigne: 'Quel signe entends-tu ?', ecoute: k.jp, choix: melange([{ v: k.jp, ok: true, jp: true }, ...d.map(x => ({ v: x.jp, jp: true }))]), id: k.id, retro: k };
    }
    if (r < 0.65) {
      const d = distracteurs(pool, k, e => e.romaji, nJour);
      return { sorte: 'choix', consigne: 'Comment se lit ce signe ?', enonce: k.jp, grand: true, choix: melange([{ v: k.romaji, ok: true }, ...d.map(x => ({ v: x.romaji }))]), id: k.id, retro: k };
    }
    const d = distracteurs(pool, k, e => e.jp, nJour);
    return { sorte: 'choix', consigne: 'Quel signe fait ce son ?', enonceFr: k.romaji === k.guide ? k.romaji : `${k.romaji} (« ${k.guide} »)`, choix: melange([{ v: k.jp, ok: true, jp: true }, ...d.map(x => ({ v: x.jp, jp: true }))]), id: k.id, retro: k };
  }

  function qMot(m, nJour, voix) {
    const pool = mots;
    const r = Math.random();
    const parSens = () => distracteurs(pool, m, e => e.fr, nJour);
    if (voix && r < 0.2) {
      return { sorte: 'ecoute', consigne: 'Que veut dire ce que tu entends ?', ecoute: m.raw, choix: melange([{ v: m.fr, ok: true }, ...parSens().map(x => ({ v: x.fr }))]), id: m.id, retro: m };
    }
    if (r < 0.65) {
      return { sorte: 'choix', consigne: 'Que veut dire ce mot ?', enonceRaw: m.raw, choix: melange([{ v: m.fr, ok: true }, ...parSens().map(x => ({ v: x.fr }))]), id: m.id, retro: m };
    }
    const d = distracteurs(pool, m, e => e.kana, nJour);
    return { sorte: 'choix', consigne: 'Comment dit-on en japonais ?', enonceFr: sansTilde(m.fr), choix: melange([{ raw: m.raw, ok: true, jp: true }, ...d.map(x => ({ raw: x.raw, jp: true }))]), id: m.id, retro: m };
  }

  function qKanji(k, nJour) {
    const pool = kanjis;
    if (Math.random() < 0.6) {
      const d = distracteurs(pool, k, e => e.fr, nJour);
      return { sorte: 'choix', consigne: 'Que veut dire ce kanji ?', enonce: k.jp, grand: true, choix: melange([{ v: k.fr, ok: true }, ...d.map(x => ({ v: x.fr }))]), id: k.id, retro: k };
    }
    const d = distracteurs(pool, k, e => e.jp, nJour);
    return { sorte: 'choix', consigne: 'Quel kanji veut dire :', enonceFr: k.fr, choix: melange([{ v: k.jp, ok: true, jp: true }, ...d.map(x => ({ v: x.jp, jp: true }))]), id: k.id, retro: k };
  }

  // Lecture d'un mot dont tous les kanji sont connus : on cache les furigana.
  function qLecture(m, nJour) {
    const d = distracteurs(mots.filter(x => x.kana !== m.kana && Math.abs(x.kana.length - m.kana.length) <= 2), m, e => e.kana, nJour);
    return { sorte: 'choix', consigne: 'Comment se lit ce mot ?', enonce: m.ecrit, choix: melange([{ v: m.kana, ok: true, jp: true }, ...d.map(x => ({ v: x.kana, jp: true }))]), id: m.id + ':lu', retro: m };
  }

  function qGrammaire(q, i) {
    return { sorte: 'choix', consigne: q.enonce.includes('___') ? 'Complète la phrase' : 'Choisis la bonne réponse', enonceRaw: q.enonce, trad: q.trad,
      choix: melange([{ raw: q.rep, ok: true, jp: !/[a-zA-ZÀ-ÿ]/.test(q.rep) }, ...q.dist.map(x => ({ raw: x, jp: !/[a-zA-ZÀ-ÿ]/.test(x) }))]), id: 'q:' + q.jour + ':' + i, retroPhrase: q };
  }

  // Ordre des mots : seulement si la phrase n'a qu'un ordre naturel.
  const PARTICULES = new Set(['は', 'が', 'を', 'に', 'で', 'へ', 'と', 'も', 'から', 'まで', 'の', 'や', 'か']);
  function ordrePossible(raw) {
    const toks = raw.replace(/[。、？！]/g, '').trim().split(/\s+/);
    if (toks.length < 3 || toks.length > 5) return false;
    const parts = toks.filter(t => PARTICULES.has(t));
    return parts.length === 1 && PARTICULES.has(toks[1]) || (parts.length === 2 && toks[toks.length - 1] === 'か' && PARTICULES.has(toks[1]));
  }
  function qOrdre(ex, i) {
    const toks = ex.raw.replace(/[。、？！]/g, '').trim().split(/\s+/);
    return { sorte: 'ordre', consigne: 'Remets la phrase dans l\'ordre', enonceFr: ex.fr, toks, id: 'o:' + ex.raw, retroEx: ex };
  }

  function questionPour(el, nJour, voix, connus) {
    if (el.type === 'kana') return qKana(el, nJour, voix);
    if (el.type === 'kanji') return qKanji(el, nJour);
    if ([...el.ecrit].some(c => Langue.estKanji(c)) && [...el.ecrit].filter(c => Langue.estKanji(c)).every(c => connus.has(c)) && Math.random() < 0.5) return qLecture(el, nJour);
    return qMot(el, nJour, voix);
  }

  function quizDuJour(jour, voix) {
    const nJ = jour.n;
    const connus = kanjiConnus(nJ);
    const cible = jour.type === 'lecon' ? 12 : jour.type === 'revision' ? 15 : jour.type === 'bilan' ? 24 : 40;
    const sources = jour.source;

    const gram = [], els = [], ordres = [];
    sources.forEach(l => {
      l.questions.forEach((q, i) => gram.push(qGrammaire(q, i)));
      [...l.kanas, ...l.kanjis, ...l.mots].forEach(e => els.push(e));
      if (l.jour > 28) l.exemples.filter(e => ordrePossible(e.raw)).forEach((e, i) => ordres.push(e));
    });

    let liste = [];
    if (jour.type === 'lecon') {
      // Toutes les questions de grammaire, puis les éléments, en priorité les kanji.
      liste.push(...gram);
      const lec = jour.lecon;
      const prio = [...lec.kanjis, ...melange(lec.kanas), ...melange(lec.mots)];
      melange(ordres).slice(0, 1).forEach((e, i) => liste.push(qOrdre(e, i)));
      prio.slice(0, Math.max(0, cible - liste.length)).forEach(e => liste.push(questionPour(e, nJ, voix, connus)));
      if (lec.kanjis.length) lec.mots.filter(m => [...m.ecrit].some(c => Langue.estKanji(c)) && [...m.ecrit].filter(c => Langue.estKanji(c)).every(c => connus.has(c))).slice(0, 2).forEach(m => liste.push(qLecture(m, nJ)));
    } else {
      const nbGram = Math.round(cible * .4), nbOrdre = jour.type === 'revision' ? 2 : 4;
      liste.push(...melange(gram).slice(0, nbGram));
      melange(ordres).slice(0, nbOrdre).forEach((e, i) => liste.push(qOrdre(e, i)));
      const reste = Math.max(0, cible - liste.length);
      melange(unique(els, e => e.id)).slice(0, reste).forEach(e => liste.push(questionPour(e, nJ, voix, connus)));
    }
    return melange(liste);
  }

  // Séances libres du Dōjō
  function quizDojo(sorte, progres, voix) {
    const nJ = progres.jourDebloque;
    const connus = kanjiConnus(nJ);
    let pool = [];
    if (sorte === 'hiragana' || sorte === 'katakana') pool = [...elements.values()].filter(e => e.type === 'kana' && e.script === sorte);
    if (sorte === 'kanji') pool = kanjis.filter(k => k.jour <= nJ);
    if (sorte === 'mots') pool = mots.filter(m => m.jour <= nJ);
    if (sorte === 'erreurs') pool = Object.keys(progres.erreurs).map(id => elements.get(id)).filter(Boolean);
    const nj = (sorte === 'hiragana' || sorte === 'katakana') ? 365 : nJ;
    const taille = sorte === 'erreurs' ? 12 : 20;
    return melange(pool).slice(0, taille).map(e => questionPour(e, nj, voix, connus));
  }

  function compteDojo(sorte, progres) {
    const nJ = progres.jourDebloque;
    if (sorte === 'kanji') return kanjis.filter(k => k.jour <= nJ).length;
    if (sorte === 'mots') return mots.filter(m => m.jour <= nJ).length;
    if (sorte === 'erreurs') return Object.keys(progres.erreurs).filter(id => elements.has(id)).length;
    return [...elements.values()].filter(e => e.type === 'kana' && e.script === sorte).length;
  }

  return { jours, lecons, mots, kanjis, grammaires, elements, kanjiConnus, quizDuJour, quizDojo, compteDojo, melange, sansTilde, ordrePossible };
})();
