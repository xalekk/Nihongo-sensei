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
  { cat: "Le dōjō-kun de la JKA", note: "Texte japonais officiel de la Japan Karate Association, récité en chœur à la fin du cours dans certains dōjō. Il varie selon les écoles. Chaque ligne commence par 一 (hitotsu) à la récitation. Orthographe de 養う modernisée.", mots: [
    "一[ひとつ]、 人格[じんかく] の 完成[かんせい] に 努[つと]むる 事[こと]|S'efforcer de parfaire son caractère", "一[ひとつ]、 誠[まこと] の 道[みち] を 守[まも]る 事[こと]|Rester sur la voie de la sincérité", "一[ひとつ]、 努力[どりょく] の 精神[せいしん] を 養[やしな]う 事[こと]|Cultiver l'esprit d'effort", "一[ひとつ]、 礼儀[れいぎ] を 重[おも]んずる 事[こと]|Accorder de l'importance à la politesse", "一[ひとつ]、 血気[けっき] の 勇[ゆう] を 戒[いまし]むる 事[こと]|Se garder du courage impulsif",
  ]},
  { cat: "Le dōjō-kun du Kyokushin", note: "Les 7 articles récités dans cette école. Les traductions sont simplifiées.", mots: [
    "吾々[われわれ] は 心身[しんしん] を 錬磨[れんま] し 確固[かっこ] 不抜[ふばつ] の 心技[しんぎ] を 極[きわ]める こと|Entraîner le corps et l'esprit pour une volonté inébranlable", "吾々[われわれ] は 武[ぶ] の 真髄[しんずい] を 極[きわ]め 機[き] に 発[はっ]し 感[かん] に 敏[びん] なる こと|Chercher l'essence des arts martiaux et rester vif", "吾々[われわれ] は 質実[しつじつ] 剛健[ごうけん] を 以[もっ]て 克己[こっき] の 精神[せいしん] を 涵養[かんよう] する こと|Cultiver la maîtrise de soi, avec sobriété et vigueur", "吾々[われわれ] は 礼節[れいせつ] を 重[おも]んじ 長上[ちょうじょう] を 敬[けい]し 粗暴[そぼう] の 振[ふ]る 舞[ま]い を 慎[つつし]む こと|Respecter la politesse et les aînés, éviter la violence", "吾々[われわれ] は 神仏[しんぶつ] を 尊[とうと]び 謙譲[けんじょう] の 美徳[びとく] を 忘[わす]れざる こと|Honorer ses principes et ne jamais oublier l'humilité", "吾々[われわれ] は 智性[ちせい] と 体力[たいりょく] と を 向上[こうじょう] させ 事[こと] に 臨[のぞ]んで 過[あやま]たざる こと|Développer intelligence et force, et agir avec justesse", "吾々[われわれ] は 生涯[しょうがい] の 修行[しゅぎょう] を 空手[からて] の 道[みち] に 通[つう]じ 極真[きょくしん] の 道[みち] を 全[まっと]う する こと|Accomplir toute sa vie la voie du Kyokushin par le karaté",
  ]},
  { cat: "Les 20 préceptes de Funakoshi", note: "Le 松濤二十訓, attribué à Gichin Funakoshi. Texte de référence, souvent cité, mais pas récité à chaque cours. Orthographe parfois modernisée.", mots: [
    "空手道[からてどう] は 礼[れい] に 始[はじ]まり 礼[れい] に 終[おわ]る 事[こと] を 忘[わす]るな|1. Le karaté-dō commence et finit par le salut, ne l'oublie pas", "空手[からて] に 先手[せんて] なし|2. En karaté, on n'attaque pas le premier", "空手[からて] は 義[ぎ] の 補[たす]け|3. Le karaté est au service de la justice", "先[ま]づ 自己[じこ] を 知[し]れ 而[しこう]して 他[た] を 知[し]れ|4. Connais-toi d'abord, puis connais les autres", "技術[ぎじゅつ] より 心術[しんじゅつ]|5. L'esprit avant la technique", "心[こころ] は 放[はな]たん 事[こと] を 要[よう]す|6. Il faut libérer son esprit", "禍[わざわい] は 懈怠[けたい] に 生[しょう]ず|7. Le malheur naît de la négligence", "道場[どうじょう] のみ の 空手[からて] と 思[おも']うな|8. Le karaté ne s'arrête pas au dōjō", "空手[からて] の 修業[しゅぎょう] は 一生[いっしょう] である|9. La pratique du karaté dure toute la vie", "凡[あら]ゆる もの を 空手化[からてか] せよ 其処[そこ] に 妙味[みょうみ] あり|10. Applique le karaté à toute chose, c'est là qu'est sa beauté", "空手[からて] は 湯[ゆ] の 如[ごと]し 絶[た]えず 熱度[ねつど] を 与[あた]えざれば 元[もと] の 水[みず] に 還[かえ]る|11. Le karaté est comme l'eau chaude : sans chaleur constante, elle redevient de l'eau ordinaire", "勝[か]つ 考[かんがえ] は 持[も]つな 負[ま]けぬ 考[かんがえ] は 必要[ひつよう]|12. Ne pense pas à gagner, pense à ne pas perdre", "敵[てき] に 因[よ]って 転化[てんか] せよ|13. Adapte-toi à ton adversaire", "戦[いくさ] は 虚実[きょじつ] の 操縦[そうじゅう] 如何[いかん] に 在[あ]り|14. Le combat dépend de la façon de manier le vide et le plein", "人[ひと] の 手足[てあし] を 剣[けん] と 思[おも]え|15. Considère les mains et les pieds comme des sabres", "男子[だんし] 門[もん] を 出[い]づれば 百万[ひゃくまん] の 敵[てき] あり|16. Passé le seuil, on fait face à un million d'ennemis", "構[かまえ] は 初心者[しょしんしゃ] に 後[あと] は 自然体[しぜんたい]|17. Les postures sont pour les débutants, ensuite on se tient naturellement", "形[かた] は 正[ただ]しく 実戦[じっせん] は 別物[べつもの]|18. Fais les katas avec exactitude, le vrai combat est autre chose", "力[ちから] の 強弱[きょうじゃく] 体[たい] の 伸縮[しんしゅく] 技[わざ] の 緩急[かんきゅう] を 忘[わす]るな|19. N'oublie pas : force et douceur, étirement et contraction, vite et lent", "常[つね] に 思念[しねん] 工夫[くふう] せよ|20. Réfléchis et cherche sans cesse",
  ]},
  { cat: "Les valeurs et les grandes expressions", note: "On les trouve dans la charte de la fédération japonaise et dans la tradition des arts martiaux.", mots: [
    "礼[れい] に 始[はじ]まり 礼[れい] に 終[お]わる|Commencer et finir par le salut", "心技体[しんぎたい]|Esprit, technique, corps", "心技[しんぎ] 一如[いちにょ]|L'esprit et la technique ne font qu'un", "克己[こっき]|Se vaincre soi-même", "礼節[れいせつ]|Politesse, bienséance", "礼儀[れいぎ]|Politesse, bonnes manières", "正義感[せいぎかん]|Sens de la justice", "道徳心[どうとくしん]|Sens moral", "勇気[ゆうき]|Courage", "節度[せつど]|Mesure, modération", "思[おも']いやり|Bienveillance", "敬愛[けいあい]|Affection respectueuse", "無我[むが]|Esprit libre de l'ego", "徒手[としゅ] 空拳[くうけん]|Se battre à mains nues", "守破離[しゅはり]|Shu-ha-ri : suivre, dépasser, s'affranchir du modèle", "千日[せんにち] の 稽古[けいこ] を 鍛[たん] と し 万日[まんにち] の 稽古[けいこ] を 錬[れん] と す|Mille jours de pratique forgent, dix mille raffinent (Musashi, l'origine du mot tanren)", "一生[いっしょう] 懸命[けんめい]|De toutes ses forces", "初心[しょしん] 忘[わす]るべからず|N'oublie jamais l'esprit du débutant", "極[き]め|Kime, la finition nette de la technique",
  ]},
  { cat: "Switch, côté et déplacements", note: "« スイッチ » s'emploie surtout en kickboxing et en boxe. Dans un cours traditionnel, on entendra plutôt « changer de jambe » ou « changer de garde ».", mots: [
    "スイッチ|switch", "ダブル スイッチ|double switch", "足[あし] を 替[か]えて|changer de jambe", "構[かま]え を 替[か]えて|changer de garde", "反対[はんたい]|l'autre côté", "反対側[はんたいがわ]|le côté opposé", "逆[ぎゃく]|l'inverse, de l'autre côté", "左右[さゆう] 交代[こうたい]|changer de côté (gauche et droite)", "交代[こうたい]|on change, à ton tour", "もう 片方[かたほう]|l'autre (jambe, bras)", "右[みぎ] から|en commençant par la droite", "左[ひだり] から|en commençant par la gauche", "構[かま]え|kamae, garde, position de combat", "右[みぎ] 構[がま]え|garde à droite", "左[ひだり] 構[がま]え|garde à gauche", "前[まえ] へ|en avant", "後[うし]ろ へ|vers l'arrière", "下[さ]がって|reculez", "回[まわ]って|tournez", "運足[うんそく]|unsoku, les déplacements", "歩[あゆ]み 足[あし]|ayumi-ashi, pas normal", "送[おく]り 足[あし]|okuri-ashi, pas glissé", "継[つ]ぎ 足[あし]|tsugi-ashi, pas rapproché", "体[たい] 捌[さば]き|tai-sabaki, esquive du corps", "足[あし] 払[ばら]い|ashi-barai, balayage", "軸足[じくあし]|jambe d'appui", "前足[まえあし]|jambe avant", "後[うし]ろ 足[あし]|jambe arrière", "引[ひ]き手[て]|hikite, la main qui revient à la hanche",
  ]},
  { cat: "Les consignes du cours", mots: [
    "集合[しゅうごう]|rassemblement", "整列[せいれつ]|en rang", "起立[きりつ]|debout", "座[すわ]って|assoyez-vous", "立[た]って|levez-vous", "号令[ごうれい]|le commandement, le compte", "もう 一度[いちど]|encore une fois", "もう 一回[いっかい]|encore une fois (courant)", "続[つづ]けて|continuez", "ゆっくり|lentement", "速[はや]く|plus vite", "強[つよ]く|plus fort", "高[たか]く|plus haut", "低[ひく]く|plus bas", "二人組[ふたりぐみ]|en équipes de deux", "相手[あいて]|partenaire, adversaire", "前[まえ] を 見[み]て|regardez devant", "目線[めせん]|le regard", "声[こえ] を 出[だ]して|donnez de la voix", "大[おお]きな 声[こえ] で|d'une voix forte", "気合[きあい] を 入[い]れて|mettez de l'énergie", "集中[しゅうちゅう] して|concentrez-vous", "力[ちから] を 抜[ぬ]いて|relâchez, sans crisper", "休憩[きゅうけい]|pause", "水分[すいぶん] 補給[ほきゅう]|pause pour boire", "稽古[けいこ]|l'entraînement au dōjō", "準備[じゅんび] 運動[うんどう]|l'échauffement", "整理[せいり] 運動[うんどう]|le retour au calme", "ストレッチ|étirements", "腕立[うでた]て 伏[ふ]せ|pompes", "腹筋[ふっきん]|redressements assis", "背筋[はいきん]|extensions du dos", "スクワット|squats", "掃除[そうじ]|le ménage du dōjō",
  ]},
  { cat: "Saluer et encourager", mots: [
    "お願[ねが]いします|s'il vous plaît (en début de cours ou avant de travailler avec un partenaire)", "ありがとう ございました|merci beaucoup (à la fin)", "失礼[しつれい] します|excusez-moi (en entrant ou en sortant)", "お疲[つか]れ様[さま] でした|merci pour votre travail", "はい！|oui !", "神前[しんぜん] に 礼[れい]|saluez vers l'autel", "道場[どうじょう] に 礼[れい]|saluez le dōjō", "立礼[りつれい]|salut debout", "座礼[ざれい]|salut à genoux", "頑張[がんば]って|lâche pas, bon courage", "頑張[がんば]ります|je vais faire de mon mieux", "ファイト|allez ! (encouragement)", "いい ね|c'est bien", "よし|bon, c'est ça", "そう|oui, comme ça", "もっと|encore plus", "よく できました|bien joué", "最後[さいご] まで|jusqu'au bout", "諦[あきら]めない|ne pas abandonner",
  ]},
  { cat: "Boxe et kickboxing", note: "Au Japon, ces techniques se disent souvent avec des mots venus de l'anglais.", mots: [
    "ジャブ|jab", "ストレート|direct", "フック|crochet", "アッパー|uppercut", "ワンツー|jab-direct (un-deux)", "コンビネーション|combinaison", "フェイント|feinte", "ガード|garde", "ブロック|bloc", "ウィービング|weave", "ダッキング|esquive vers le bas", "スリッピング|slip", "ステップ|pas, déplacement", "クリンチ|clinch", "ロー キック|low kick", "ミドル キック|kick au corps", "ハイ キック|kick à la tête", "シャドー|shadow", "ラウンド|ronde", "スパーリング|combat d'entraînement",
  ]},
  { cat: "Le corps", mots: [
    "頭[あたま]|tête", "顔[かお]|visage", "首[くび]|cou", "肩[かた]|épaule", "腕[うで]|bras", "手首[てくび]|poignet", "胸[むね]|poitrine", "腹[はら]|ventre", "背中[せなか]|dos", "腰[こし]|hanches, bas du dos", "太[ふと]もも|cuisse", "脛[すね]|tibia", "足首[あしくび]|cheville", "踵[かかと]|talon", "爪先[つまさき]|orteils, pointe du pied", "背足[はいそく]|dessus du pied", "上足底[じょうそくてい]|koshi, plante à la base des orteils",
  ]},
  { cat: "L'école, le matériel et les graduations", mots: [
    "指導員[しどういん]|instructeur", "館長[かんちょう]|directeur de l'école", "門下生[もんかせい]|élève du dōjō", "師弟[してい]|maître et élève", "少年部[しょうねんぶ]|le groupe des enfants", "審査[しんさ]|passage de grade, graduation", "昇級[しょうきゅう]|monter de kyū", "昇段[しょうだん]|monter de dan", "大会[たいかい]|tournoi", "防具[ぼうぐ]|protections", "ミット|mitaine, cible", "サンドバッグ|sac de frappe", "グローブ|gants", "マウスピース|protecteur buccal", "ヘッドギア|casque", "試割[ためしわ]り|cassage",
  ]},
  { cat: "Les personnes et les grades", mots: [
    "先生[せんせい]|sensei, professeur", "師範[しはん]|shihan, maître enseignant", "先輩[せんぱい]|senpai, élève plus ancien", "後輩[こうはい]|kōhai, élève plus récent", "級[きゅう]|kyū, grade sous la ceinture noire", "段[だん]|dan, degré de ceinture noire", "初段[しょだん]|shodan, 1er dan", "有段者[ゆうだんしゃ]|ceinture noire (détenteur d'un dan)", "審判[しんぱん]|arbitre",
  ]},
  { cat: "Le salut et les commandements", mots: [
    "礼[れい]|salut", "押忍[おす]|osu (se dit « oss »), salut très familier du dōjō : à éviter avec une personne plus âgée ou haut placée, et à Okinawa suis l'usage du dōjō", "正面[しょうめん] に 礼[れい]|saluez vers l'avant", "先生[せんせい] に 礼[れい]|saluez le professeur", "お互[たが]い に 礼[れい]|saluez-vous l'un l'autre", "正座[せいざ]|assis à genoux", "黙想[もくそう]|méditation en silence", "気[き]をつけ|garde-à-vous, attention", "用意[ようい]|prêt", "始[はじ]め|commencez", "止[や]め|arrêtez", "直[なお]れ|reprenez la position", "休[やす]め|repos", "回[まわ]れ|tournez",
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
    "勝負[しょうぶ]|shōbu, combat, match", "一本[いっぽん]|ippon, point complet", "技[わざ] あり|waza-ari, demi-point", "反則[はんそく]|hansoku, faute", "続行[ぞっこう]|zokkō, continuez le combat", "有効[ゆうこう]|yūkō, point", "場外[じょうがい]|jōgai, sortie de surface", "技[わざ]|waza, technique", "試合[しあい]|match, compétition",
  ]},
];
