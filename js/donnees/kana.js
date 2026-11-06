// kana.js — les deux syllabaires, avec un petit truc de mémoire pour chaque signe.
var ETAPES = [];
const MEMOS = {
  あ:"Une croix avec une boucle : « Ah ! », on s'y accroche", い:"Deux traits côte à côte : deux « i » qui se suivent", う:"Une oreille qui écoute : « u »", え:"Un danseur exotique : « e »", お:"Un personnage et sa balle : « o »",
  か:"Un coup de karaté : « KA ! »", き:"Une clé à deux dents : « ki », comme clé", く:"Le bec d'un coucou : « ku »", け:"Un képi vu de côté : « ke »", こ:"Deux traits de code : « ko »",
  さ:"Un sapin penché, avec sa branche : « sa »", し:"Un hameçon : « shi »", す:"Un fil noué avec une boucle : « su »", せ:"Une bouche ouverte qui dit : « se »", そ:"Un zigzag qui fait un « sot » : « so »",
  た:"Un « t » suivi d'un « a » : « ta »", ち:"Un 5 à l'envers qui éternue : « chi ! »", つ:"Une vague de tsunami : « tsu »", て:"Une main tendue : « te »", と:"Un orteil avec une épine : « to »",
  な:"Un nœud : « na » comme nœud", に:"Un genou et deux traits : « ni »", ぬ:"Des nouilles avec une boucle : « nu »", ね:"Un chat couché (neko) avec sa queue : « ne »", の:"Un panneau d'interdiction : « no ! »",
  は:"Un homme qui rit : « ha ha ! »", ひ:"Un grand sourire : « hi hi ! »", ふ:"Quelqu'un qui souffle sur sa soupe : « fu »", へ:"Le mont Fuji, une petite pente : « he »", ほ:"Un homme chargé de bagages : « ho ! »",
  ま:"Une maman avec deux bras : « ma »", み:"Un 2 et un 1 attachés : « mi »", む:"Une vache et ses cornes : « mu »", め:"Un œil fermé : « me » veut dire œil", も:"Un hameçon à deux barbes : « mo » comme « mo-rue »",
  や:"Un yak vu de côté : « ya »", ゆ:"Un poisson dans l'eau chaude (yu = eau chaude) : « yu »", よ:"Un yo-yo au bout de sa corde : « yo »",
  ら:"Un lapin (rabbit) : « ra »", り:"Deux rivières : « ri »", る:"Une route avec un rond-point : « ru »", れ:"Quelqu'un à genoux qui fait une révérence : « re »", ろ:"Comme る, mais sans la boucle du bas : « ro »",
  わ:"Une femme qui dit « wa ! » en se penchant", を:"Quelqu'un qui saute : « oh ! »", ん:"Un « n » écrit à la main : « n »",
  ア:"Une hache : « a »", イ:"Un petit arbre penché : « i »", ウ:"Une couronne sur う : « u »", エ:"Une poutre en I : « e »", オ:"Une personne qui court : « o »",
  カ:"Comme か, sans le point : « ka »", キ:"Une clé : « ki »", ク:"Un coin : « ku »", ケ:"Un képi tombé : « ke »", コ:"Un coin de boîte : « ko »",
  サ:"Un sapin à deux branches : « sa »", シ:"Trois traits, le grand monte : « shi »", ス:"Un homme qui fait du ski : « su »", セ:"Une boîte ouverte : « se »", ソ:"Une larme qui descend : « so »",
  タ:"Une table bancale : « ta »", チ:"Presque le nombre 千 : « chi »", ツ:"Trois traits, le grand descend : « tsu »", テ:"Un T avec un chapeau : « te »", ト:"Un poteau et un clou : « to »",
  ナ:"Une croix penchée : « na »", ニ:"Deux traits, comme 二 : « ni »", ヌ:"Des nouilles et des baguettes : « nu »", ネ:"Une nappe sur une table : « ne »", ノ:"Un seul trait qui dit « no »",
  ハ:"Deux traits, un toit : « ha ha »", ヒ:"Une chaise qui rit : « hi »", フ:"Un coin qui souffle : « fu »", ヘ:"Comme へ : « he »", ホ:"Une croix avec deux jambes : « ho »",
  マ:"Une maman avec un bec : « ma »", ミ:"Trois traits : « mi », comme 3 (mi-ttsu)", ム:"Une boîte de moufles : « mu »", メ:"Une croix : « me »", モ:"Un hameçon à deux barbes, comme も : « mo »",
  ヤ:"Comme や, en angles : « ya »", ユ:"Un U carré : « yu »", ヨ:"Un 3 à l'envers : « yo »",
  ラ:"Un toit et une rampe : « ra »", リ:"Comme り, en plus droit : « ri »", ル:"Une route qui remonte : « ru »", レ:"Un seul coin : « re »", ロ:"Une boîte, comme le 口 : « ro »",
  ワ:"Un toit qui fait « wa »", ヲ:"Rare : un o qui saute", ン:"Un trait et un point qui monte (ne pas confondre avec ソ) : « n »",
};

// Les tableaux complets. Une case vide ('') garde les colonnes alignées.
const lignes = (etiquettes, texte) => texte.split(' ').map((l, i) => [etiquettes[i], ...[...l].map(c => c === '_' ? '' : c)]);
const GOJUON = [
  ...lignes(['', 'K', 'S', 'T', 'N', 'H', 'M', 'Y', 'R', 'W', ''], 'あいうえお かきくけこ さしすせそ たちつてと なにぬねの はひふへほ まみむめも や_ゆ_よ らりるれろ わゐ_ゑを ん____'),
];
const GOJUON_SONORES = lignes(['G', 'Z', 'D', 'B', 'P'], 'がぎぐげご ざじずぜぞ だぢづでど ばびぶべぼ ぱぴぷぺぽ');
const YOON_LIGNES = [['K', 'きゃ', 'きゅ', 'きょ'], ['S', 'しゃ', 'しゅ', 'しょ'], ['T', 'ちゃ', 'ちゅ', 'ちょ'], ['N', 'にゃ', 'にゅ', 'にょ'], ['H', 'ひゃ', 'ひゅ', 'ひょ'], ['M', 'みゃ', 'みゅ', 'みょ'], ['R', 'りゃ', 'りゅ', 'りょ'], ['G', 'ぎゃ', 'ぎゅ', 'ぎょ'], ['J', 'じゃ', 'じゅ', 'じょ'], ['B', 'びゃ', 'びゅ', 'びょ'], ['P', 'ぴゃ', 'ぴゅ', 'ぴょ']];
const SONS_ETRANGERS = [['F', 'ファ', 'フィ', '', 'フェ', 'フォ'], ['V', 'ヴァ', 'ヴィ', 'ヴ', 'ヴェ', 'ヴォ'], ['W', '', 'ウィ', '', 'ウェ', 'ウォ'], ['T', '', 'ティ', 'トゥ', '', ''], ['D', '', 'ディ', 'ドゥ', '', ''], ['Ts', 'ツァ', 'ツィ', '', 'ツェ', 'ツォ'], ['Sh', '', '', '', 'シェ', ''], ['Ch', '', '', '', 'チェ', ''], ['J', '', '', '', 'ジェ', ''], ['Y', '', '', '', 'イェ', '']];
const kataDe = s => [...s].map(c => String.fromCharCode(c.charCodeAt(0) + 0x60)).join('');
const enKatakana = t => t.map(([e, ...cs]) => [e, ...cs.map(c => c ? kataDe(c) : '')]);
const KANA_SPECIAUX = {
  ゐ: { romaji: 'i', ancien: true, memo: 'Ancien signe, plus utilisé aujourd\'hui.' }, ゑ: { romaji: 'e', ancien: true, memo: 'Ancien signe, plus utilisé aujourd\'hui.' },
  ヰ: { romaji: 'i', ancien: true, memo: 'Ancien signe, plus utilisé aujourd\'hui.' }, ヱ: { romaji: 'e', ancien: true, memo: 'Ancien signe, plus utilisé aujourd\'hui.' },
  っ: { romaji: 'pause', muet: true, memo: 'Petit っ : une pause d\'un temps avant la consonne suivante.' }, ッ: { romaji: 'pause', muet: true, memo: 'Petit ッ : une pause d\'un temps avant la consonne suivante.' },
  ー: { romaji: 'long', muet: true, memo: 'Le trait ー allonge la voyelle d\'avant, surtout en katakana.' },
};

if (typeof module !== 'undefined') module.exports = { MEMOS, GOJUON, GOJUON_SONORES, YOON_LIGNES, SONS_ETRANGERS, KANA_SPECIAUX, kataDe };
