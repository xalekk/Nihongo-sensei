// app.js — l'interface : parcours, leçons, quiz, Dōjō, sons et dictionnaire.

const CLE = 'nihongo_sensei_progress';
const vue = document.getElementById('vue');
const fenetre = document.getElementById('fenetre');
const ICONES = {
  son: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H2v6h4l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M19 5a10 10 0 0 1 0 14"/></svg>',
  fleche: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>',
};
const esc = s => String(s)
  .replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
  .replace(/« /g, '«\u00a0').replace(/ (»|:|\?|!)/g, '\u00a0$1'); // espaces insécables à la française
const guideSiUtile = (r, g) => r === g ? '' : ` « ${g} »`;

// ---------- Progression ----------
let progres = { version: 2, jourDebloque: 1, xp: 0, faits: [], erreurs: {}, romaji: true, furigana: true };

function charge() {
  try {
    const brut = localStorage.getItem(CLE);
    if (!brut) return;
    const s = JSON.parse(brut);
    if (s.version === 2) progres = { ...progres, ...s };
    // Ancienne version de 30 jours : le contenu a changé, on garde seulement les XP.
    else if (typeof s.xp === 'number') progres.xp = s.xp;
  } catch (e) { /* stockage indisponible : l'app fonctionne quand même */ }
}
function sauve() {
  try { localStorage.setItem(CLE, JSON.stringify(progres)); } catch (e) { /* idem */ }
  majEntete();
}
function majEntete() {
  document.getElementById('entete-xp').textContent = progres.xp.toLocaleString('fr-CA') + ' XP';
  document.body.classList.toggle('sans-romaji', !progres.romaji);
  document.body.classList.toggle('sans-furigana', !progres.furigana);
}

// ---------- Audio ----------
let voixJapon = null, voixChargees = false;
function chercheVoix() {
  if (!('speechSynthesis' in window)) return;
  const toutes = speechSynthesis.getVoices();
  if (toutes.length) voixChargees = true;
  voixJapon = toutes.find(v => /^ja/i.test(v.lang)) || null;
}
if ('speechSynthesis' in window) { chercheVoix(); speechSynthesis.onvoiceschanged = chercheVoix; }

function parle(texte) {
  if (!('speechSynthesis' in window)) { toast("L'audio n'est pas offert sur cet appareil."); return; }
  if (voixChargees && !voixJapon) toast("Aucune voix japonaise sur cet appareil : ajoute-la dans ses réglages de langue.");
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(texte);
  u.lang = 'ja-JP';
  u.rate = 0.85;
  if (voixJapon) u.voice = voixJapon;
  speechSynthesis.speak(u);
}
const audioDe = raw => Cours.sansTilde(Langue.enEcrit(raw)).replace(/\s+/g, '');
let minuterieToast;
function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.remove('cache');
  clearTimeout(minuterieToast);
  minuterieToast = setTimeout(() => t.classList.add('cache'), 3500);
}
const btnAudio = texte => `<button class="audio" data-parle="${esc(texte)}" aria-label="Écouter">${ICONES.son}</button>`;

// ---------- Affichage du japonais ----------
// Un kanji n'apparaît qu'une fois enseigné. Avant, on montre sa lecture en kana.
function jpHtml(raw, connus, opts = {}) {
  const segs = Langue.segments(raw);
  return segs.map(s => {
    if (s.texte !== undefined) {
      return esc(s.texte).replace(/___/g, '<span class="vide"></span>');
    }
    const lect = s.lecture.replace(/'/g, '');
    const tout = !connus || [...s.base].every(c => connus.has(c));
    if (opts.kanaSeul) return esc(lect);
    if (!tout) return esc(lect);
    if (opts.sansFurigana) return esc(s.base);
    return `<ruby>${esc(s.base)}<rt>${esc(lect)}</rt></ruby>`;
  }).join('');
}
const romajiHtml = raw => {
  const l = Langue.lire(raw);
  return `<span class="romaji">${esc(l.romaji)} · <em>« ${esc(l.guide)} »</em></span>`;
};
const contientKanji = raw => [...Langue.enEcrit(raw)].some(c => Langue.estKanji(c));

// ---------- Navigation ----------
let onglet = 'parcours';
document.querySelectorAll('.onglets button').forEach(b => b.addEventListener('click', () => allerOnglet(b.dataset.onglet)));
function allerOnglet(nom) {
  onglet = nom;
  document.querySelectorAll('.onglets button').forEach(b => b.classList.toggle('actif', b.dataset.onglet === nom));
  if ('speechSynthesis' in window) speechSynthesis.cancel();
  ({ parcours: voirParcours, dojo: voirDojo, sons: voirSons, dico: voirDico })[nom]();
  window.scrollTo(0, 0);
}
vue.addEventListener('click', e => {
  const b = e.target.closest('[data-parle]');
  if (b) { e.stopPropagation(); parle(b.dataset.parle); }
});
fenetre.addEventListener('click', e => {
  const b = e.target.closest('[data-parle]');
  if (b) { parle(b.dataset.parle); return; }
  if (e.target === fenetre || e.target.closest('[data-fermer]')) fenetre.classList.add('cache');
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') fenetre.classList.add('cache'); });

// ---------- Parcours ----------
const etapesOuvertes = new Set();
function etapeDe(n) { return Cours.jours[n - 1].etape; }

function reglagesHtml() {
  return `<div class="options">
    <button class="puce" data-regle="romaji" aria-pressed="${progres.romaji}">Romaji</button>
    <button class="puce" data-regle="furigana" aria-pressed="${progres.furigana}">Furigana</button>
  </div>`;
}
function brancheReglages() {
  vue.querySelectorAll('[data-regle]').forEach(b => b.addEventListener('click', () => {
    const k = b.dataset.regle;
    progres[k] = !progres[k]; sauve();
    b.setAttribute('aria-pressed', progres[k]);
  }));
}

function voirParcours() {
  const faits = new Set(progres.faits);
  const etapeCourante = etapeDe(Math.min(progres.jourDebloque, 365));
  if (!etapesOuvertes.size) etapesOuvertes.add(etapeCourante);
  const pct = Math.round(faits.size / 365 * 100);
  let h = `<div class="carte">
    <div class="prog-tete"><h2>Ton parcours</h2><span>${faits.size >= 365 ? 'Terminé !' : `Jour ${progres.jourDebloque} / 365`}</span></div>
    <div class="barre"><i style="width:${Math.max(pct, 1)}%"></i></div>
    <p class="petit" style="margin-top:10px">Environ 15 minutes par jour. Une erreur au quiz ? La question revient à la fin : tu finis quand tout est bon, et le jour suivant se débloque aussitôt.</p>
    ${reglagesHtml()}
    ${boutonInstaller()}
  </div>`;

  ETAPES.forEach(et => {
    const js = Cours.jours.filter(j => j.etape === et.numero);
    const nb = js.filter(j => faits.has(j.n)).length;
    const finie = nb === js.length;
    const cour = et.numero === etapeCourante && !finie;
    const ouv = etapesOuvertes.has(et.numero);
    h += `<section class="etape ${finie ? 'finie' : ''} ${cour ? 'courante' : ''} ${ouv ? 'ouverte' : ''}">
      <button class="etape-tete" data-etape="${et.numero}" aria-expanded="${ouv}">
        <span class="etape-num">${finie ? '✓' : et.numero}</span>
        <span><h3>${esc(et.titre)}</h3><p>Jours ${js[0].n} à ${js[js.length - 1].n} · ${nb} / ${js.length} faits</p></span>
        <span class="fleche">${ICONES.fleche}</span>
      </button>`;
    if (ouv) {
      h += `<p class="etape-but">${esc(et.but)}</p><div class="jours">`;
      js.forEach(j => {
        const ok = faits.has(j.n), dispo = j.n <= progres.jourDebloque, cj = j.n === progres.jourDebloque && !ok;
        const rev = j.type !== 'lecon';
        h += `<button class="jour ${ok ? 'ok' : ''} ${cj ? 'courant' : ''} ${rev ? 'rev' : ''}" data-jour="${j.n}" ${dispo ? '' : 'disabled'}>
          <span class="jour-num">${ok ? '✓' : j.n}</span>
          <span><b>${esc(j.titre)}</b><small>${dispo ? esc(j.desc) : 'Verrouillé'}</small></span>
        </button>`;
      });
      h += '</div>';
    }
    h += '</section>';
  });
  vue.innerHTML = h;
  brancheReglages();
  const inst = document.getElementById('installer');
  if (inst) inst.addEventListener('click', installer);
  vue.querySelectorAll('[data-etape]').forEach(b => b.addEventListener('click', () => {
    const n = +b.dataset.etape;
    etapesOuvertes.has(n) ? etapesOuvertes.delete(n) : etapesOuvertes.add(n);
    voirParcours();
    const cible = vue.querySelector(`[data-etape="${n}"]`);
    if (cible) cible.scrollIntoView({ block: 'nearest' });
  }));
  vue.querySelectorAll('[data-jour]').forEach(b => b.addEventListener('click', () => voirJour(+b.dataset.jour)));
}

// ---------- Leçon ----------
function ligneMot(m, connus) {
  const montreKanji = contientKanji(m.raw) && [...Langue.enEcrit(m.raw)].filter(c => Langue.estKanji(c)).every(c => connus.has(c));
  return `<div class="ligne">
    <div class="contenu">
      <div class="mot">${jpHtml(m.raw, connus)}</div>
      <div class="sens">${esc(m.fr)}</div>
      ${romajiHtml(m.raw)}
      ${contientKanji(m.raw) && !montreKanji ? `<span class="ecrit">s'écrit aussi : ${esc(m.ecrit)}</span>` : ''}
    </div>
    ${btnAudio(audioDe(m.raw))}
  </div>`;
}
function ligneExemple(x, connus) {
  return `<div class="ligne">
    <div class="contenu">
      <div class="mot" style="font-size:18px">${jpHtml(x.raw, connus)}</div>
      <div class="sens" style="font-weight:500">${esc(x.fr)}</div>
      ${romajiHtml(x.raw)}
    </div>
    ${btnAudio(audioDe(x.raw))}
  </div>`;
}
function carteKana(k) {
  return `<div class="kana">
    <div class="signe"><span>${esc(k.jp)}</span>${btnAudio(k.jp)}</div>
    <div class="son">${esc(k.romaji)} <span class="petit">${esc(guideSiUtile(k.romaji, k.guide))}</span></div>
    ${k.memo ? `<div class="memo">${esc(k.memo)}</div>` : ''}
  </div>`;
}
function ligneKanji(k) {
  return `<div class="ligne kanji-carte" data-kanji="${esc(k.jp)}" role="button" tabindex="0">
    <div class="gros">${esc(k.jp)}</div>
    <div class="contenu">
      <div class="sens">${esc(k.fr)}</div>
      <span class="petit jp">${esc(k.on)} · ${esc(k.kun)}</span>
    </div>
    ${btnAudio(k.jp)}
  </div>`;
}
function ouvreKanji(jp) {
  const k = Cours.kanjis.find(x => x.jp === jp);
  if (!k) return;
  const conn = new Set(Cours.kanjis.map(x => x.jp));
  const lies = Cours.mots.filter(m => m.ecrit.includes(jp)).slice(0, 5);
  fenetre.innerHTML = `<div class="fen-boite">
    <div class="gros">${esc(k.jp)}</div>
    <div class="sens">${esc(k.fr)}</div>
    <div class="infos jp">
      <div><b>Lecture on :</b> ${esc(k.on)}</div>
      <div><b>Lecture kun :</b> ${esc(k.kun)}</div>
      <div><b>Traits :</b> ${k.traits}</div>
    </div>
    ${lies.length ? `<div class="liste">${lies.map(m => `<div class="petit"><span class="jp" style="font-size:16px;color:var(--encre)">${jpHtml(m.raw, conn)}</span> : ${esc(m.fr)}</div>`).join('')}</div>` : ''}
    <button class="btn second" data-parle="${esc(k.jp)}">Écouter</button>
    <button class="btn" data-fermer>Fermer</button>
  </div>`;
  fenetre.classList.remove('cache');
}
vue.addEventListener('click', e => {
  if (e.target.closest('[data-parle]')) return;
  const k = e.target.closest('[data-kanji]');
  if (k) ouvreKanji(k.dataset.kanji);
});

function voirJour(n) {
  const j = Cours.jours[n - 1];
  j.type === 'lecon' ? voirLecon(j) : voirRevision(j);
  window.scrollTo(0, 0);
}

function voirLecon(j) {
  const l = j.lecon, connus = Cours.kanjiConnus(j.n);
  let h = `<button class="retour" data-retour>← Parcours</button>
  <div class="carte lecon-tete">
    <span class="etiquette">Jour ${j.n} · Étape ${j.etape}</span>
    <h2>${esc(l.t)}</h2>
    <p class="petit">${esc(l.d)}</p>
    ${reglagesHtml()}
  </div>`;
  if (l.note) h += `<div class="encart note"><h3>À savoir</h3>${esc(l.note)}</div>`;
  if (l.g) h += `<div class="carte gram">
    <h3>Grammaire</h3>
    <div class="nom">${esc(l.g.n)}</div>
    <div class="patron">${esc(l.g.p)}</div>
    <p>${esc(l.g.e)}</p>
  </div>`;
  if (l.tip) h += `<div class="encart truc"><h3>Truc de prononciation</h3>${esc(l.tip)}</div>`;
  if (l.kanas.length) h += `<h3 class="titre-sec">Les signes</h3><div class="kanas">${l.kanas.map(carteKana).join('')}</div>`;
  if (l.kanjis.length) h += `<h3 class="titre-sec">Les kanji</h3><div class="liste">${l.kanjis.map(ligneKanji).join('')}</div>`;
  if (l.mots.length) h += `<h3 class="titre-sec">Le vocabulaire</h3><div class="liste">${l.mots.map(m => ligneMot(m, connus)).join('')}</div>`;
  if (l.exemples.length) h += `<h3 class="titre-sec">${/Lecture|Dialogue|Écoute/.test(l.t) ? 'Le texte' : 'Les exemples'}</h3><div class="liste">${l.exemples.map(x => ligneExemple(x, connus)).join('')}</div>`;
  h += `<button class="btn" id="go-quiz">Faire le quiz du jour</button>`;
  vue.innerHTML = h;
  brancheReglages();
  vue.querySelector('[data-retour]').addEventListener('click', () => allerOnglet('parcours'));
  document.getElementById('go-quiz').addEventListener('click', () => lanceQuiz({ jour: j }));
}

function voirRevision(j) {
  const connus = Cours.kanjiConnus(j.n);
  const gram = j.source.filter(l => l.g);
  const titres = { revision: 'Révision', bilan: 'Bilan', final: 'Examen final' };
  const texte = {
    revision: "On mélange ce que tu as vu cette semaine. Prends une minute pour relire les points de grammaire, puis lance-toi.",
    bilan: "Tout ce qu'il y a dans cette étape. C'est plus long, et c'est normal : une pause au milieu, c'est permis.",
    final: "40 questions tirées de toute l'année : vocabulaire, kanji, grammaire et écoute. Réussis, et le niveau N5 est à ta portée !",
  }[j.type];
  let h = `<button class="retour" data-retour>← Parcours</button>
  <div class="carte lecon-tete">
    <span class="etiquette">Jour ${j.n} · ${titres[j.type]}</span>
    <h2>${esc(j.titre)}</h2>
    <p class="petit">${esc(texte)}</p>
  </div>`;
  if (j.type !== 'final' && gram.length) {
    h += `<h3 class="titre-sec">La grammaire à revoir</h3><div class="liste">${gram.map(l => `<details class="gram-dico"><summary>${esc(l.g.n)}</summary><p>${esc(l.g.e)}</p></details>`).join('')}</div>`;
  }
  if (j.type === 'revision') {
    const mots = j.source.flatMap(l => l.mots).slice(0, 12);
    if (mots.length) h += `<h3 class="titre-sec">Quelques mots à repasser</h3><div class="liste">${mots.map(m => ligneMot(m, connus)).join('')}</div>`;
  }
  h += `<button class="btn" id="go-quiz">${j.type === 'final' ? "Commencer l'examen" : 'Commencer'}</button>`;
  vue.innerHTML = h;
  vue.querySelector('[data-retour]').addEventListener('click', () => allerOnglet('parcours'));
  document.getElementById('go-quiz').addEventListener('click', () => lanceQuiz({ jour: j }));
}

// ---------- Quiz ----------
let quiz = null;

function lanceQuiz({ jour, dojo }) {
  const avecVoix = !!voixJapon;
  const liste = dojo ? Cours.quizDojo(dojo, progres, avecVoix) : Cours.quizDuJour(jour, avecVoix);
  if (!liste.length) { toast('Rien à pratiquer ici pour le moment.'); return; }
  const connus = dojo ? Cours.kanjiConnus(dojo === 'hiragana' || dojo === 'katakana' ? 1 : progres.jourDebloque) : Cours.kanjiConnus(jour.n);
  quiz = { jour, dojo, file: [...liste], total: liste.length, fait: 0, bonnes: 0, ratees: new Set(), connus, verrou: false };
  afficheQuestion();
}

function textChoix(c, connus) {
  if (c.raw !== undefined) return jpHtml(c.raw, connus);
  return esc(c.v);
}

function afficheQuestion() {
  if (!quiz.file.length) return finQuiz();
  quiz.verrou = false;
  const q = quiz.file[0];
  const fait = quiz.fait, total = quiz.total;
  const pct = Math.round(fait / total * 100);
  let h = `<div class="quiz-haut">
      <button class="retour" data-quitte style="padding:8px 0;min-height:40px">✕</button>
      <div class="barre"><i style="width:${Math.max(pct, 2)}%"></i></div>
      <span>${Math.min(fait + 1, total)} / ${total}</span>
    </div>
    <div class="carte question">
      <div class="consigne">${esc(q.consigne)}</div>`;
  if (q.sorte === 'ecoute') {
    h += `<button class="ecoute" data-rejoue aria-label="Réécouter">${ICONES.son}</button>`;
  } else if (q.enonceRaw) {
    const long = q.enonceRaw.length > 8;
    const fr = /[a-zA-ZÀ-ÿ]/.test(q.enonceRaw);
    h += `<div class="enonce ${fr ? 'fr' : long ? 'long' : ''}">${jpHtml(q.enonceRaw, quiz.connus)}</div>`;
    if (q.retro && q.retro.type === 'mot') h += romajiHtml(q.retro.raw);
    if (q.trad) h += `<div class="trad">${esc(q.trad)}</div>`;
  } else if (q.enonceFr) {
    h += `<div class="enonce fr">${esc(q.enonceFr)}</div>`;
  } else if (q.enonce) {
    h += `<div class="enonce ${q.grand ? '' : 'long'}" ${q.grand ? 'style="font-size:64px;line-height:1.2"' : ''}>${esc(q.enonce)}</div>`;
  }
  if (q.sorte === 'ordre') {
    h += `<div class="ordre-zone" id="ordre-zone" aria-label="Ta phrase"></div>
      <div class="ordre-mots" id="ordre-mots">${Cours.melange(q.toks.map((t, i) => ({ t, i }))).map(x => `<button class="tuile" data-i="${x.i}">${jpHtml(x.t, quiz.connus)}</button>`).join('')}</div>
      <button class="btn" id="ordre-ok" disabled>Vérifier</button>`;
  } else {
    h += `<div class="choix" id="choix">${q.choix.map((c, i) => `<button class="${c.jp ? 'jp' : ''}" data-c="${i}">${textChoix(c, quiz.connus)}</button>`).join('')}</div>`;
  }
  h += `<div id="retro"></div></div>`;
  vue.innerHTML = h;
  window.scrollTo(0, 0);

  vue.querySelector('[data-quitte]').addEventListener('click', quitteQuiz);
  if (q.sorte === 'ecoute') {
    const rejoue = () => parle(audioDe(q.ecoute));
    vue.querySelector('[data-rejoue]').addEventListener('click', rejoue);
    rejoue();
  }
  if (q.sorte === 'ordre') brancheOrdre(q);
  else vue.querySelectorAll('[data-c]').forEach(b => b.addEventListener('click', () => reponds(q, +b.dataset.c, b)));
}

function brancheOrdre(q) {
  const zone = document.getElementById('ordre-zone'), mots = document.getElementById('ordre-mots'), ok = document.getElementById('ordre-ok');
  let choisis = [];
  const maj = () => {
    zone.innerHTML = choisis.map((i, k) => `<button class="tuile" data-r="${k}">${jpHtml(q.toks[i], quiz.connus)}</button>`).join('');
    mots.querySelectorAll('.tuile').forEach(b => { b.disabled = choisis.includes(+b.dataset.i); });
    ok.disabled = choisis.length !== q.toks.length;
    zone.querySelectorAll('[data-r]').forEach(b => b.addEventListener('click', () => { choisis.splice(+b.dataset.r, 1); maj(); }));
  };
  mots.querySelectorAll('.tuile').forEach(b => b.addEventListener('click', () => { if (!quiz.verrou) { choisis.push(+b.dataset.i); maj(); } }));
  ok.addEventListener('click', () => {
    if (quiz.verrou) return;
    const juste = choisis.map(i => q.toks[i]).join(' ') === q.toks.join(' ');
    finitReponse(q, juste);
    mots.querySelectorAll('.tuile').forEach(b => { b.disabled = true; });
    zone.querySelectorAll('.tuile').forEach(b => { b.disabled = true; });
    ok.classList.add('cache');
  });
  maj();
}

function reponds(q, i, btn) {
  if (quiz.verrou) return;
  const c = q.choix[i];
  btn.classList.add(c.ok ? 'bon' : 'faux');
  vue.querySelectorAll('[data-c]').forEach((b, k) => {
    b.disabled = true;
    if (q.choix[k].ok) b.classList.add('bon');
  });
  finitReponse(q, !!c.ok);
}

function retroHtml(q, juste) {
  const conn = quiz.connus;
  let corps = '';
  if (q.retro) {
    const r = q.retro;
    if (r.type === 'kana') corps = `<div class="reponse">${esc(r.jp)}</div><div>${esc(r.romaji)}${esc(guideSiUtile(r.romaji, r.guide))}</div>`;
    else if (r.type === 'kanji') corps = `<div class="reponse">${esc(r.jp)}</div><div>${esc(r.fr)}</div>`;
    else corps = `<div class="reponse">${jpHtml(r.raw, conn)}</div><div>${esc(r.fr)}</div>${romajiHtml(r.raw)}`;
  } else if (q.retroPhrase) {
    const p = q.retroPhrase;
    const trou = p.enonce.includes('___');
    const phrase = trou ? p.enonce.replace('___', ` ${p.rep} `).replace(/\s+/g, ' ') : p.rep;
    const purFr = /[a-zA-ZÀ-ÿ0-9]/.test(phrase);
    corps = `<div class="reponse">${jpHtml(phrase, conn)}</div>${p.trad ? `<div>${esc(p.trad)}</div>` : ''}${purFr ? '' : romajiHtml(phrase)}`;
  } else if (q.retroEx) {
    corps = `<div class="reponse">${jpHtml(q.retroEx.raw, conn)}</div><div>${esc(q.retroEx.fr)}</div>${romajiHtml(q.retroEx.raw)}`;
  }
  return `<div class="retro ${juste ? 'bon' : 'faux'}"><strong>${juste ? 'Bravo !' : 'Presque ! La question reviendra.'}</strong>${corps}</div>
    <button class="btn" id="suite" style="margin-top:10px">Continuer</button>`;
}

function finitReponse(q, juste) {
  quiz.verrou = true;
  const premier = !quiz.ratees.has(q.id);
  const idEl = q.retro ? q.retro.id : null;
  if (juste) {
    if (premier) quiz.bonnes++;
    if (idEl && progres.erreurs[idEl]) {
      progres.erreurs[idEl]--;
      if (progres.erreurs[idEl] <= 0) delete progres.erreurs[idEl];
    }
    quiz.file.shift();
    quiz.fait++;
  } else {
    quiz.ratees.add(q.id);
    if (idEl) progres.erreurs[idEl] = (progres.erreurs[idEl] || 0) + 1;
    quiz.file.push(quiz.file.shift());
  }
  sauve();
  document.getElementById('retro').innerHTML = retroHtml(q, juste);
  document.getElementById('suite').addEventListener('click', afficheQuestion);
  document.getElementById('suite').scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}

function quitteQuiz() {
  const q = quiz;
  quiz = null;
  if (q.dojo) voirDojo();
  else voirJour(q.jour.n);
}

function finQuiz() {
  const pct = Math.round(quiz.bonnes / quiz.total * 100);
  let gain = 0, titre = 'Bien joué !', sousTitre = '', suivant = null;
  if (quiz.dojo) {
    gain = 5;
    titre = 'Séance terminée';
    sousTitre = 'Chaque tour au Dōjō aide ta mémoire.';
  } else {
    const n = quiz.jour.n;
    const nouveau = !progres.faits.includes(n);
    gain = nouveau ? { lecon: 50, revision: 50, bilan: 100, final: 500 }[quiz.jour.type] : 10;
    if (nouveau) progres.faits.push(n);
    if (progres.jourDebloque === n && n < 365) progres.jourDebloque = n + 1;
    if (n === 365) {
      titre = 'おめでとう！';
      sousTitre = 'Tu as terminé les 365 jours. Tu as maintenant les bases du niveau N5 !';
    } else {
      titre = pct === 100 ? 'Parfait !' : 'Jour réussi !';
      sousTitre = `Le jour ${n + 1} est débloqué.`;
      suivant = n + 1;
    }
  }
  progres.xp += gain;
  sauve();
  const dojo = quiz.dojo;
  vue.innerHTML = `<div class="carte resultat">
    <div class="note-finale">${pct} %</div>
    <h2>${esc(titre)}</h2>
    <p class="petit">${esc(sousTitre)} Réussi du premier coup : ${quiz.bonnes} sur ${quiz.total}.</p>
    <div class="gain">+${gain} XP</div>
  </div>
  ${suivant ? `<button class="btn" id="r-suivant">Passer au jour ${suivant}</button>` : ''}
  ${dojo ? `<button class="btn" id="r-encore">Encore une séance</button>` : ''}
  <button class="btn second" id="r-retour">${dojo ? 'Retour au Dōjō' : 'Retour au parcours'}</button>`;
  const q = quiz;
  quiz = null;
  if (suivant) document.getElementById('r-suivant').addEventListener('click', () => voirJour(suivant));
  if (dojo) document.getElementById('r-encore').addEventListener('click', () => lanceQuiz({ dojo }));
  document.getElementById('r-retour').addEventListener('click', () => { allerOnglet(q.dojo ? 'dojo' : 'parcours'); });
  window.scrollTo(0, 0);
}

// ---------- Dōjō ----------
function voirDojo() {
  const c = s => Cours.compteDojo(s, progres);
  const err = c('erreurs');
  vue.innerHTML = `<div class="carte">
    <div class="prog-tete"><h2>Dōjō</h2></div>
    <p class="petit">Une séance libre, quand tu veux. Elle ne change pas ta place dans le parcours. Les kanji et le vocabulaire se remplissent à mesure que tu avances.</p>
  </div>
  <div class="dojo-grille">
    <button class="dojo-btn" data-d="hiragana"><b>Hiragana</b><span class="jp">あ い う え お</span><small>${c('hiragana')} signes</small></button>
    <button class="dojo-btn" data-d="katakana"><b>Katakana</b><span class="jp">ア イ ウ エ オ</span><small>${c('katakana')} signes</small></button>
    <button class="dojo-btn" data-d="kanji" ${c('kanji') ? '' : 'disabled'}><b>Kanji</b><span class="jp">日 本 語</span><small>${c('kanji') ? `${c('kanji')} appris` : 'À venir : étape 3'}</small></button>
    <button class="dojo-btn" data-d="mots" ${c('mots') ? '' : 'disabled'}><b>Vocabulaire</b><span class="jp">ことば</span><small>${c('mots') ? `${c('mots')} mots appris` : 'Fais le jour 1 pour commencer'}</small></button>
    <button class="dojo-btn large" data-d="erreurs" ${err ? '' : 'disabled'}><b>Mes erreurs</b><small>${err ? `${err} élément${err > 1 ? 's' : ''} à revoir` : 'Rien pour le moment. Tes erreurs de quiz viendront ici.'}</small></button>
  </div>`;
  vue.querySelectorAll('[data-d]').forEach(b => b.addEventListener('click', () => lanceQuiz({ dojo: b.dataset.d })));
}

// ---------- Sons ----------
function tableKana(lignes, trois) {
  return `<div class="tableau ${trois ? 'trois' : ''}">` + lignes.flatMap(([s]) => [...s]).map(k => {
    const l = Langue.lire(k);
    return `<button data-parle="${esc(k)}"><span class="jp">${esc(k)}</span><small>${esc(l.romaji)}</small></button>`;
  }).join('') + '</div>';
}
function tableYoon(liste) {
  return `<div class="tableau trois">` + liste.map(k => {
    const l = Langue.lire(k);
    return `<button data-parle="${esc(k)}"><span class="jp">${esc(k)}</span><small>${esc(l.romaji)}</small></button>`;
  }).join('') + '</div>';
}
function voirSons() {
  vue.innerHTML = `<div class="carte">
    <div class="prog-tete"><h2>Bien prononcer</h2></div>
    <p class="petit">Le guide écrit pour une bouche québécoise. Le guide de son « ko-n-ni-tchi-wa » t'accompagne dans toute l'app : chaque tiret marque un temps. Touche un mot pour l'écouter.</p>
  </div>
  ${GUIDE_SONS.map((r, i) => `<div class="carte regle">
    <h3>${i + 1}. ${esc(r.t)}</h3>
    <p>${esc(r.e)}</p>
    <div class="exemples">${r.ex.map(x => `<button class="exemple" data-parle="${esc(x)}"><span class="jp">${esc(x)}</span><span class="gd">${esc(Langue.lire(x).guide)}</span></button>`).join('')}</div>
  </div>`).join('')}
  <h3 class="titre-sec">Les tableaux, avec l'audio</h3>
  <div class="carte"><h3 class="prog-tete" style="margin:0"><b>Hiragana</b></h3>${tableKana(HIRA_BASE)}<div class="sous-titre">Avec ゛ et ゜</div>${tableKana(HIRA_DAK)}<div class="sous-titre">Combinaisons</div>${tableYoon(YOON)}</div>
  <div class="carte"><h3 class="prog-tete" style="margin:0"><b>Katakana</b></h3>${tableKana(KATA_BASE)}<div class="sous-titre">Avec ゛ et ゜</div>${tableKana(KATA_DAK)}<div class="sous-titre">Combinaisons</div>${tableYoon(YOON_KATA)}</div>`;
}

// ---------- Dictionnaire ----------
const normalise = s => Langue.versHiragana(String(s)).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
let dicoFiltre = 'tout', dicoTexte = '', dicoMax = 40;
const SONS_EMPRUNTES = ['ファ', 'フィ', 'フェ', 'フォ', 'ティ', 'ディ', 'チェ', 'シェ', 'ジェ', 'ウィ', 'ウェ'];
const DICO_KANA = [
  ['Hiragana de base', HIRA_BASE.flatMap(([s]) => [...s])],
  ['Hiragana avec ゛ et ゜', HIRA_DAK.flatMap(([s]) => [...s])],
  ['Hiragana combinés', YOON],
  ['Katakana de base', KATA_BASE.flatMap(([s]) => [...s])],
  ['Katakana avec ゛ et ゜', KATA_DAK.flatMap(([s]) => [...s])],
  ['Katakana combinés', YOON_KATA],
  ['Katakana pour les sons étrangers', SONS_EMPRUNTES],
].flatMap(([cat, liste]) => liste.map(jp => ({ jp, cat, memo: MEMOS[jp], ...Langue.lire(jp) })));
const KARATE_MOTS = KARATE.flatMap(g => g.mots.map(m => {
  const [raw, fr] = m.split('|');
  return { raw, fr, cat: g.cat, note: g.note, kana: Langue.enKana(raw), ecrit: Langue.enEcrit(raw), ...Langue.lire(raw) };
}));
function voirDico() {
  vue.innerHTML = `<div class="carte">
    <input id="dico-q" class="recherche" type="search" placeholder="Français, romaji, kana ou kanji" value="${esc(dicoTexte)}" aria-label="Rechercher">
    <div class="options">
      ${[['tout', 'Tout'], ['mots', 'Mots'], ['kanji', 'Kanji'], ['gram', 'Grammaire'], ['karate', 'Karaté'], ['kana', 'Kana']].map(([v, t]) => `<button class="puce" data-f="${v}" aria-pressed="${dicoFiltre === v}">${t}</button>`).join('')}
    </div>
  </div>
  <div id="dico-res" class="liste"></div>`;
  const input = document.getElementById('dico-q');
  input.addEventListener('input', () => { dicoTexte = input.value; dicoMax = 40; rendDico(); });
  vue.querySelectorAll('[data-f]').forEach(b => b.addEventListener('click', () => {
    dicoFiltre = b.dataset.f; dicoMax = 40;
    vue.querySelectorAll('[data-f]').forEach(x => x.setAttribute('aria-pressed', x === b));
    rendDico();
  }));
  rendDico();
}
function rendDico() {
  const zone = document.getElementById('dico-res');
  const compacte = x => normalise(x).replace(/[\s\-]/g, '');
  const q = compacte(dicoTexte.trim());
  const qSansOu = q.replace(/ou/g, 'o');
  const conn = new Set(Cours.kanjis.map(k => k.jp));
  const trouve = (...champs) => !q || champs.some(c => { const n = compacte(c); return n.includes(q) || n.includes(qSansOu); });
  const res = [];
  // Pour un kana, on cherche le signe ou le son exact : « ka » ne doit pas sortir tout ce qui contient un « a ».
  if (dicoFiltre === 'kana' || (dicoFiltre === 'tout' && q)) DICO_KANA.forEach(k => { if (!q || [k.jp, k.romaji, k.guide].some(c => compacte(c) === q)) res.push({ t: 'kana', el: k }); });
  if (dicoFiltre === 'tout' || dicoFiltre === 'mots') {
    const vus = new Set();
    Cours.mots.forEach(m => {
      const cle = m.kana + m.fr; if (vus.has(cle)) return; vus.add(cle);
      if (trouve(m.fr, m.kana, m.ecrit, m.romaji)) res.push({ t: 'mot', el: m });
    });
  }
  if (dicoFiltre === 'tout' || dicoFiltre === 'kanji') Cours.kanjis.forEach(k => { if (trouve(k.jp, k.fr, k.on, k.kun)) res.push({ t: 'kanji', el: k }); });
  if (dicoFiltre === 'tout' || dicoFiltre === 'gram') Cours.grammaires.forEach(g => { if (trouve(g.n, g.p, g.e)) res.push({ t: 'gram', el: g }); });
  if (dicoFiltre === 'tout' || dicoFiltre === 'karate') KARATE_MOTS.forEach(k => { if (trouve(k.fr, k.kana, k.ecrit, k.romaji, k.cat)) res.push({ t: 'karate', el: k }); });
  if (!res.length) { zone.innerHTML = `<p class="petit" style="text-align:center;padding:20px">Aucun résultat.</p>`; return; }
  const groupe = dicoFiltre === 'karate' || dicoFiltre === 'kana';
  const kanaEcrit = el => contientKanji(el.raw) ? `<span class="ecrit">${esc(el.kana)}</span>` : '';
  const max = groupe ? res.length : dicoMax;
  let catCourante = '';
  const intro = dicoFiltre === 'karate' && !q ? `<p class="petit" style="padding:0 2px">Le vocabulaire du dōjō, avec sa lecture et sa prononciation. Certains termes et noms de katas varient d'une école à l'autre : suis ce qu'on enseigne dans la tienne.</p>` : '';
  zone.innerHTML = intro + res.slice(0, max).map(({ t, el }) => {
    if (t === 'kana') {
      const tete = groupe && el.cat !== catCourante ? `<h3 class="titre-sec">${esc(el.cat)}</h3>` : '';
      catCourante = el.cat;
      return `${tete}<div class="ligne kana-ligne">
      <div class="gros">${esc(el.jp)}</div>
      <div class="contenu"><div class="sens">${esc(el.romaji)}${esc(guideSiUtile(el.romaji, el.guide))}</div>${el.memo ? `<span class="petit">${esc(el.memo)}</span>` : ''}</div>
      ${groupe ? '' : '<span class="jour-lien">Kana</span>'}${btnAudio(el.jp)}
    </div>`;
    }
    if (t === 'karate') {
      const tete = groupe && el.cat !== catCourante ? `<h3 class="titre-sec">${esc(el.cat)}</h3>${el.note ? `<p class="petit" style="padding:0 2px">${jpHtml(el.note, null)}</p>` : ''}` : '';
      catCourante = el.cat;
      return `${tete}<div class="ligne">
      <div class="contenu"><div class="mot" style="font-size:18px">${jpHtml(el.raw, null)}</div>${kanaEcrit(el)}<div class="sens">${esc(el.fr)}</div>${romajiHtml(el.raw)}</div>
      ${groupe ? '' : '<span class="jour-lien">Karaté</span>'}${btnAudio(audioDe(el.raw))}
    </div>`;
    }
    if (t === 'mot') return `<div class="ligne">
      <div class="contenu"><div class="mot" style="font-size:18px">${jpHtml(el.raw, conn)}</div>${kanaEcrit(el)}<div class="sens">${esc(el.fr)}</div>${romajiHtml(el.raw)}</div>
      <span class="jour-lien">Jour ${el.jour}</span>${btnAudio(audioDe(el.raw))}
    </div>`;
    if (t === 'kanji') return `<div class="ligne kanji-carte" data-kanji="${esc(el.jp)}" role="button" tabindex="0">
      <div class="gros">${esc(el.jp)}</div>
      <div class="contenu"><div class="sens">${esc(el.fr)}</div><span class="petit jp">${esc(el.on)} · ${esc(el.kun)}</span></div>
      <span class="jour-lien">Jour ${el.jour}</span>
    </div>`;
    return `<details class="gram-dico"><summary>${esc(el.n)} <span class="jour-lien">Jour ${el.jour}</span></summary><p class="jp">${esc(el.p)}</p><p>${esc(el.e)}</p></details>`;
  }).join('') + (res.length > max ? `<button class="btn second" id="dico-plus">Afficher plus (${res.length - max} restants)</button>` : '');
  const plus = document.getElementById('dico-plus');
  if (plus) plus.addEventListener('click', () => { dicoMax += 40; rendDico(); });
}

// ---------- Installation et mode hors ligne ----------
let invitation = null;
const estInstallee = () => window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
const estIOS = () => /iP(hone|ad|od)/.test(navigator.userAgent);
function boutonInstaller() {
  if (estInstallee() || !('serviceWorker' in navigator) || !(invitation || estIOS())) return '';
  return '<button class="btn second" id="installer" style="margin-top:12px">Installer l\'app</button>';
}
async function installer() {
  if (invitation) {
    invitation.prompt();
    await invitation.userChoice;
    invitation = null;
    voirParcours();
  } else {
    toast("Dans Safari : touche Partager, puis « Sur l'écran d'accueil ».");
  }
}
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  invitation = e;
  if (onglet === 'parcours' && document.querySelector('.prog-tete')) voirParcours();
});
window.addEventListener('appinstalled', () => { invitation = null; });
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => { /* l'app fonctionne quand même en ligne */ });
    // Demande au navigateur de ne pas effacer la progression.
    if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});
  });
}

// ---------- Démarrage ----------
charge();
majEntete();
allerOnglet('parcours');
