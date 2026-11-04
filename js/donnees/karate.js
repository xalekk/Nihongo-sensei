// karate.js — le dictionnaire du karaté. Même format que le cours : base[lecture]|sens.
// Les espaces séparent les parties d'un terme. L'apostrophe bloque un faux son long (黒帯 = kuro-obi).
const KARATE = [
  { cat: "Au dōjō", mots: [
    "空手[からて]|karaté (« main vide »)", "空手道[からてどう]|karaté-dō, la voie du karaté", "道場[どうじょう]|dōjō, salle d'entraînement", "道着[どうぎ]|dōgi, l'habit d'entraînement", "帯[おび]|ceinture", "白帯[しろ'おび]|ceinture blanche", "黒帯[くろ'おび]|ceinture noire", "武道[ぶどう]|art martial, voie martiale", "鍛錬[たんれん]|entraînement rigoureux, forger le corps et l'esprit", "気合[きあい]|kiaï, le cri qui concentre l'énergie", "残心[ざんしん]|zanshin, rester vigilant après la technique", "間合[ま'あ]い|maai, la distance avec l'adversaire",
  ]},
  { cat: "Les formules à succès de Karaté Sportif", note: "Traductions libres, faites pour ce dictionnaire. Elles ne viennent pas du Groupe Karaté Sportif, et un Japonais n'emploierait pas forcément ces formules au dōjō.", mots: [
    "集中[しゅうちゅう]！|Donnez-moi un focus !", "黒帯[くろ'おび] の 集中[しゅうちゅう]！|Ceinture noire focus ! (la réponse des élèves)", "はい、先生[せんせい]！|Oui monsieur ! Oui madame !", "分[わ]かりました か。|Avez-vous compris ?", "準備[じゅんび] は いい です か。|Êtes-vous prêts ?",
    "努力[どりょく] と 練習[れんしゅう] が 成功[せいこう] を 生[う]む。|Effort + pratique = succès", "全力[ぜんりょく] ある のみ。|Rien de moins que le maximum", "常[つね] に 全力[ぜんりょく]！|Toujours au maximum", "より 高[たか]く、より 速[はや]く、より 強[つよ]く！|Plus haut, plus vite, plus fort !", "目[め] と 心[こころ] と 体[からだ] を 集中[しゅうちゅう] させる。|Concentrer les yeux, l'esprit et le corps", "上手[じょうず] に なる には 百回[ひゃっかい]。|Combien de répétitions pour être bon ? 100", "私[わたし] は できる！|Je suis capable ! (l'attitude du « je peux »)",
    "私[わたし] は 自分[じぶん] の 人生[じんせい] の ヒーロー です。|Je suis le héros de ma vie",
  ]},
  { cat: "Le crédo du karatéka", note: "Traductions libres, elles aussi.", mots: [
    "私[わたし] の 目標[もくひょう] は もっと いい 人[ひと] に なる こと です。|Mon but est de devenir une meilleure personne", "心[こころ] に 誠実[せいじつ] を。|Honnêteté dans mon cœur", "自分[じぶん] に 自信[じしん] を。|Confiance en moi", "仲間[なかま] と 共[とも] に 強[つよ]く。|Force avec les autres", "体[からだ] に 力[ちから] を。|Force dans mon corps", "黒帯[くろ'おび] の 卓越[たくえつ]|L'excellence de la ceinture noire",
  ]},
  { cat: "Les 9 pouvoirs des héros", note: "Traductions libres. 力[ちから] veut dire « pouvoir, force ».", mots: [
    "全力[ぜんりょく] を 尽[つ]くす 力[ちから]|1. Le pouvoir de faire son maximum", "集中[しゅうちゅう] の 力[ちから]|2. Le pouvoir de la concentration", "勝者[しょうしゃ] の 心構[こころがま]え|3. L'attitude gagnante", "自信[じしん] の 力[ちから]|4. Le pouvoir de la confiance", "自制[じせい] の 力[ちから]|5. Le pouvoir du contrôle", "忍耐[にんたい] の 力[ちから]|6. Le pouvoir de la persévérance", "尊敬[そんけい] の 力[ちから]|7. Le pouvoir du respect", "選[えら]ぶ 力[ちから]|8. Le pouvoir de choisir", "もっと いい 人[ひと] に なる 力[ちから]|9. Le pouvoir de devenir une meilleure personne",
    "自制[じせい]、自信[じしん]、集中[しゅうちゅう]|Les 3C : contrôle, confiance, concentration", "忍耐[にんたい]、回復力[かいふくりょく]、決意[けつい]|Les 3 clés : patience, résilience, détermination",
  ]},
  { cat: "Les formes du contrôle", note: "Traductions libres.", mots: [
    "止[や]めて！ 怒[おこ]りすぎて 話[はな]せません。|Contrôle de la colère : Arrête ! Je suis trop fâché pour parler.", "止[や]めて！ けんか は したく ありません。|Contrôle de la bagarre : Arrête ! Je ne veux pas me battre !", "止[や]めて！ ほっといて ください。 先生[せんせい] に 言[い]います。|Contrôle de l'intimidation : Arrête ! Laisse-moi tranquille ! Je vais le dire !",
  ]},
  { cat: "Les slogans du Club des Maîtres", note: "Traductions libres.", mots: [
    "規律[きりつ] で 自分[じぶん] を 鍛[きた]える。|Je suis discipliné pour me bâtir", "賢[かしこ]く、平和[へいわ] を 選[えら]ぶ。|Je suis sage et je choisis la paix", "強[つよ]いから、「いいえ」と 言[い]える。|Je suis fort et je suis capable de dire non", "私[わたし] は リーダー です。|Je suis un leader", "私[わたし] は 勝者[しょうしゃ] です。|Je suis gagnant", "私[わたし] は 前向[まえむ]き です。|Je suis positif", "全[すべ]て は 可能[かのう] です。|Tout est possible",
  ]},
  { cat: "Les personnes et les grades", mots: [
    "先生[せんせい]|sensei, professeur", "師範[しはん]|shihan, maître enseignant", "先輩[せんぱい]|senpai, élève plus ancien", "後輩[こうはい]|kōhai, élève plus récent", "級[きゅう]|kyū, grade sous la ceinture noire", "段[だん]|dan, degré de ceinture noire", "初段[しょだん]|shodan, 1er dan", "有段者[ゆうだんしゃ]|ceinture noire (détenteur d'un dan)", "審判[しんぱん]|arbitre",
  ]},
  { cat: "Le salut et les commandements", mots: [
    "礼[れい]|salut", "押忍[おす]|osu (se dit « oss »), salut et marque de respect", "正面[しょうめん] に 礼[れい]|saluez vers l'avant", "先生[せんせい] に 礼[れい]|saluez le professeur", "お互[たが]い に 礼[れい]|saluez-vous l'un l'autre", "正座[せいざ]|assis à genoux", "黙想[もくそう]|méditation en silence", "気[き]をつけ|garde-à-vous, attention", "用意[ようい]|prêt", "始[はじ]め|commencez", "止[や]め|arrêtez", "直[なお]れ|reprenez la position", "休[やす]め|repos", "回[まわ]れ|tournez",
  ]},
  { cat: "Compter au dōjō", mots: [
    "一[いち]|un", "二[に]|deux", "三[さん]|trois", "四[し]|quatre (forme habituelle au dōjō)", "五[ご]|cinq", "六[ろく]|six", "七[しち]|sept (forme habituelle au dōjō)", "八[はち]|huit", "九[く]|neuf (forme habituelle au dōjō)", "十[じゅう]|dix",
  ]},
  { cat: "Les grandes parties de l'entraînement", mots: [
    "基本[きほん]|kihon, les techniques de base", "型[かた]|kata, enchaînement codifié", "組手[くみて]|kumite, combat", "分解[ぶんかい]|bunkai, application d'un kata", "受[う]け身[み]|ukemi, bris de chute", "柔術[じゅうじゅつ]|jiu-jitsu",
  ]},
  { cat: "Les niveaux", mots: [
    "上段[じょうだん]|jōdan, niveau haut (tête)", "中段[ちゅうだん]|chūdan, niveau moyen (corps)", "下段[げだん]|gedan, niveau bas",
  ]},
  { cat: "Les positions (立ち)", mots: [
    "前屈[ぜんくつ] 立[だ]ち|zenkutsu-dachi, position avant", "後屈[こうくつ] 立[だ]ち|kōkutsu-dachi, position arrière", "騎馬[きば] 立[だ]ち|kiba-dachi, position du cavalier", "猫足[ねこあし] 立[だ]ち|nekoashi-dachi, position du chat", "平行[へいこう] 立[だ]ち|heikō-dachi, pieds parallèles", "結[むす]び 立[だ]ち|musubi-dachi, talons joints", "八字[はちじ] 立[だ]ち|hachiji-dachi, position naturelle ouverte", "自然体[しぜんたい]|shizentai, position naturelle",
  ]},
  { cat: "Les coups de poing (突き)", mots: [
    "突[つ]き|tsuki, coup de poing direct", "正拳[せいけん] 突[づ]き|seiken-zuki, direct du poing", "追[お]い 突[づ]き|oi-zuki, direct en avançant", "逆[ぎゃく] 突[づ]き|gyaku-zuki, direct du bras opposé", "刻[きざ]み 突[づ]き|kizami-zuki, direct du bras avant (jab)", "鉤[かぎ] 突[づ]き|kagi-zuki, crochet",
  ]},
  { cat: "Les frappes (打ち)", mots: [
    "打[う]ち|uchi, frappe", "裏拳[うらけん]|uraken, revers du poing (backfist)", "手刀[しゅとう]|shutō, tranchant de la main", "手刀[しゅとう] 打[う]ち|shutō-uchi, frappe du tranchant", "貫手[ぬきて]|nukite, pique des doigts", "猿臂[えんぴ] 打[う]ち|empi-uchi, coup de coude", "肘[ひじ]|coude", "膝[ひざ]|genou", "拳[こぶし]|poing",
  ]},
  { cat: "Les blocs (受け)", mots: [
    "受[う]け|uke, bloc", "下段[げだん] 払[ばら]い|gedan-barai, bloc vers le bas", "上[あ]げ 受[う]け|age-uke, bloc vers le haut", "外[そと] 受[う]け|soto-uke, bloc de l'extérieur vers l'intérieur", "内[うち] 受[う]け|uchi-uke, bloc de l'intérieur vers l'extérieur", "手刀[しゅとう] 受[う]け|shutō-uke, bloc du tranchant",
  ]},
  { cat: "Les coups de pied (蹴り)", mots: [
    "蹴[け]り|keri, coup de pied", "前[まえ] 蹴[げ]り|mae-geri, coup de pied avant", "回[まわ]し 蹴[げ]り|mawashi-geri, coup de pied en rond", "横[よこ] 蹴[げ]り|yoko-geri, coup de pied de côté", "後[うし]ろ 蹴[げ]り|ushiro-geri, coup de pied arrière", "膝[ひざ] 蹴[げ]り|hiza-geri, coup de genou", "飛[と]び 蹴[げ]り|tobi-geri, coup de pied sauté", "足刀[そくとう]|sokutō, tranchant du pied",
  ]},
  { cat: "Les katas", mots: [
    "ピンアン|Pinan (« paix et tranquillité »)", "ナイファンチ|Naifanchi", "バッサイ|Bassaï", "マツカゼ|Matsukaze (« vent dans les pins »)",
  ]},
  { cat: "Les armes", mots: [
    "武器[ぶき]|arme", "棒[ぼう]|bō, long bâton", "鎌[かま]|kama, faucille", "釵[さい]|sai, trident", "ヌンチャク|nunchaku", "トンファー|tonfa", "クボタン|kubotan", "木刀[ぼくとう]|bokutō, sabre de bois", "木剣[ぼっけん]|bokken, sabre de bois", "刀[かたな]|katana, sabre",
  ]},
  { cat: "En compétition", mots: [
    "勝負[しょうぶ]|shōbu, combat, match", "一本[いっぽん]|ippon, point complet", "技[わざ] あり|waza-ari, demi-point", "反則[はんそく]|hansoku, faute", "技[わざ]|waza, technique", "試合[しあい]|match, compétition",
  ]},
];
