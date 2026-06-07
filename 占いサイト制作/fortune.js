// 五格判定ロジック
// 天格：姓の総画数
// 地格：名の総画数
// 人格：姓の最後の字 + 名の最初の字
// 外格：姓の最初の字 + 名の最後の字（1文字の場合は霊数1を加算）
// 総格：姓名すべての総画数

// ===== 熊崎式 81数理 吉凶表（各流派の主要説を統合） =====
// ※ 姓名判断には複数の流派があり、数字によっては見解が異なります。
//   本サイトは熊崎健翁式を基本としつつ、吉元式・五格式の知見も参考にしています。
const RANK_TABLE = {
  大吉: [1,3,5,6,8,11,13,15,16,21,23,24,25,29,31,32,33,35,37,39,41,45,47,48,52,57,58,61,63,65,67,68,81],
  吉:   [7,17,18,26,27,30,36,38,42,43,51,53,55,59,62,66,69,71,72,73,75,77],
  中吉: [28,44,46,49,50,54,56,64,70,74,76,78,79,80],
  末吉: [2,10,12,22,34,40,60],
  凶:   [4,9,14,19,20],
};

// 各数字の固有名・象意・詳細解説
const NUM_DETAIL = {
  1:  { name:'太極数',  omen:'元始・最高吉', desc:'万物の元始。強い独立心とリーダーシップに恵まれ、一代で名を成す吉数。自力で道を切り開く力を持つ。' },
  2:  { name:'分離数',  omen:'変動・孤独',   desc:'陰陽が分かれる数。変化が多く心身が不安定になりやすい。協調を心がければ安定を得られる。' },
  3:  { name:'明朗数',  omen:'智謀・繁栄',   desc:'明朗活発で機知に富む。才能と運気に恵まれ、社会的に成功しやすい吉数。表現力と創造力が光る。' },
  4:  { name:'不遇数',  omen:'苦難・障害',   desc:'努力が報われにくく苦労が多い。忍耐を積み重ねることで晩年に好転する可能性を持つ。' },
  5:  { name:'陰陽数',  omen:'万能・健康',   desc:'陰陽が調和した最高の吉数の一つ。活力・健康・財運を兼ね備え、多方面で才能を発揮できる。' },
  6:  { name:'安全数',  omen:'福徳・安定',   desc:'天徳・地徳を合わせ持つ吉数。家庭運・財運・対人運に恵まれ、穏やかで幸福な人生を歩む。' },
  7:  { name:'剛毅数',  omen:'独立・強運',   desc:'剛健で独立心が旺盛。困難に負けない強さを持ち、逆境から這い上がる力がある吉数。' },
  8:  { name:'発展数',  omen:'蓄財・成功',   desc:'努力が着実に実る発展の吉数。地道な積み重ねで大きな成功と財を築くことができる。' },
  9:  { name:'窮迫数',  omen:'苦難・失敗',   desc:'苦労と障害が伴いやすい凶数。強い意志と謙虚さで運命を切り開く努力が必要。' },
  10: { name:'空虚数',  omen:'浮沈・停滞',   desc:'運気が定まらず空回りしやすい。内面を磨き精神的な安定を得ることで運勢が好転する。' },
  11: { name:'頭領数',  omen:'平和・向上',   desc:'穏やかな中に強い向上心と指導力を持つ吉数。人望を集め、着実に地位と幸福を築く。' },
  12: { name:'薄弱数',  omen:'意志薄弱・苦労', desc:'優しさの反面、意志が薄く流されやすい傾向。強い精神力を養うことが開運の鍵。' },
  13: { name:'知謀数',  omen:'博識・才智',   desc:'鋭い知性と洞察力を持つ吉数。学問・芸術・技術に才能を発揮し、多くの人に認められる。' },
  14: { name:'孤独数',  omen:'薄幸・浮沈',   desc:'才能はあるが孤立しやすく、苦労が伴う。人との繋がりを大切にすることで運気が開ける。' },
  15: { name:'福寿数',  omen:'人徳・大吉',   desc:'人徳と福寿を兼ね備えた最高の吉数の一つ。人望が厚く、自然と多くの支援者が集まる。' },
  16: { name:'徳望数',  omen:'成功・威厳',   desc:'威厳と人徳を持ち、リーダーとして大成する吉数。晩年にかけて運気が高まり名声を得る。' },
  17: { name:'突破数',  omen:'剛健・権威',   desc:'強い意志と実行力で困難を突破する吉数。目標に向かってまっすぐ進む力を持つ。' },
  18: { name:'有望数',  omen:'発展・有望',   desc:'才能と行動力が実を結ぶ発展の吉数。若い頃から頭角を現し、社会的に成功しやすい。' },
  19: { name:'障害数',  omen:'苦労・障害',   desc:'才能はあるが障害が多く、思い通りにならないことが続く。粘り強い努力で道が開ける。' },
  20: { name:'空虚数',  omen:'虚無・空虚',   desc:'努力が空回りし、なかなか実を結ばない凶数。精神的な充実と人との絆を大切にすることが重要。' },
  21: { name:'頭首数',  omen:'独立・権威',   desc:'強いリーダーシップと独立心を持つ大吉数。自ら道を切り開き、一代で大きな成功を収める。' },
  22: { name:'薄弱数',  omen:'散漫・変動',   desc:'努力が安定しにくく浮き沈みが多い。集中力を高め一点突破することで道が開ける。' },
  23: { name:'隆昌数',  omen:'功名・大吉',   desc:'功名と発展を示す大吉数。若くして才能が開花し、社会的成功と名声を得やすい。' },
  24: { name:'蓄財数',  omen:'財運・大吉',   desc:'財運と人徳に恵まれた大吉数。人との縁が豊かで、多くの支援を受けながら財を築く。' },
  25: { name:'健康数',  omen:'安全・長寿',   desc:'心身の健康と安全を示す吉数。積極的な行動力と強い精神力を持ち、着実に成功する。' },
  26: { name:'英雄数',  omen:'英雄・波乱',   desc:'傑出した才能と行動力を持つが、波乱も多い。強い意志で逆境を乗り越えると大きな成功を得る。' },
  27: { name:'中断数',  omen:'名誉・相克',   desc:'才能はあるが中途で挫折しやすい。忍耐と継続が最大の力となり、晩年に大成する可能性を秘める。' },
  28: { name:'波乱数',  omen:'変動・苦難',   desc:'運気の浮き沈みが激しく苦労が多い。強い意志と柔軟性を持って環境に対応すれば道が開ける。' },
  29: { name:'知謀数',  omen:'成功・財運',   desc:'優れた知性と先見の明で成功を掴む大吉数。戦略的な思考と行動力で財運・地位を築く。' },
  30: { name:'吉凶数',  omen:'波乱・吉凶',  desc:'吉凶が混在する数。果断な行動力があれば大成功するが、優柔不断だと失敗しやすい。' },
  31: { name:'隆昌数',  omen:'人徳・大吉',   desc:'徳望と包容力で多くの人を引き寄せる大吉数。着実に地位と名声を築き、晩年は豊かに輝く。' },
  32: { name:'幸運数',  omen:'幸運・財運',   desc:'幸運と財運に恵まれた最高の吉数の一つ。人との縁が豊かで、思わぬところから幸運が訪れる。' },
  33: { name:'旭日数',  omen:'隆盛・最吉',   desc:'旭日昇天のごとく運気が高まる最高吉数。輝かしい才能と強運で、時代に名を刻む存在となる。' },
  34: { name:'破壊数',  omen:'災難・苦難',   desc:'努力が実りにくく、思わぬ苦難に見舞われやすい。誠実さと謙虚さで開運を図ることが重要。' },
  35: { name:'温厚数',  omen:'平和・文芸',   desc:'温かく穏やかな人柄で、文芸・芸術分野で才能を発揮する吉数。周囲に慕われ幸福な人生を歩む。' },
  36: { name:'英雄数',  omen:'義侠・波乱',   desc:'義侠心が強く人望があるが、波乱に富む人生になりやすい。強さと優しさのバランスが吉を呼ぶ。' },
  37: { name:'功名数',  omen:'誠実・名誉',   desc:'誠実さと才能で名誉を勝ち取る吉数。正直で義理を重んじる性格が人からの信頼を集める。' },
  38: { name:'有能数',  omen:'技芸・名声',   desc:'特定の分野で卓越した才能を持つ。専門性を磨くことで名声を得るが、財運は波がある。' },
  39: { name:'富貴数',  omen:'富貴・大吉',   desc:'富と地位を兼ね備えた大吉数。強い運気と才能で社会的に大成し、豊かで充実した人生を歩む。' },
  40: { name:'無常数',  omen:'浮沈・変動',   desc:'運気の変動が激しく定まりにくい。精神的な安定と人との繋がりを大切にすることが大切。' },
  41: { name:'最高数',  omen:'最高吉・名誉',  desc:'最高の大吉数の一つ。卓越した才能と強運で社会的に大成し、後世にまで名を残す存在となる。' },
  42: { name:'苦労数',  omen:'変動・苦労',   desc:'才能はあるが苦労が伴う。変化を恐れず挑戦し続けることで、後半の人生で大きく花開く。' },
  43: { name:'散財数',  omen:'変動・才能',   desc:'才能はあるが散漫になりやすく財が安定しない。一点に力を集中することが開運の鍵。' },
  44: { name:'変動数',  omen:'苦難・変動',   desc:'環境の変化が多く落ち着きにくい。地に足のついた生き方を心がけることで安定が生まれる。' },
  45: { name:'大安数',  omen:'智謀・大吉',   desc:'卓越した知恵と大きな器を持つ大吉数。晩年にかけて運気が高まり、大きな成功を手にする。' },
  46: { name:'苦難数',  omen:'変動・辛苦',   desc:'努力が実りにくく、苦難に遭いやすい。前向きな精神と粘り強さがあれば、逆境を乗り越えられる。' },
  47: { name:'開運数',  omen:'福寿・大吉',   desc:'後半の人生で運気が大きく開ける吉数。誠実な努力の積み重ねが晩年の大きな幸運につながる。' },
  48: { name:'智謀数',  omen:'知恵・成功',   desc:'深い知恵と冷静な判断力で成功を掴む大吉数。人生の後半にかけて運気が高まり名声を得る。' },
  49: { name:'混合数',  omen:'吉凶混合',     desc:'吉凶が半々の数。運気の波があるが、誠実さと努力で吉の方向に導くことができる。' },
  50: { name:'混合数',  omen:'吉凶混合',     desc:'多彩な運気を持つが定まりにくい。強い意志で一つの道を極めることが成功への近道。' },
  51: { name:'吉凶数',  omen:'変化・反転',   desc:'吉凶が混在する数だが、誠実な努力と前向きな精神で吉の方向へ向かうことができる。' },
  52: { name:'先見数',  omen:'先見・成功',   desc:'先見の明と強い精神力で困難を乗り越える大吉数。独創的な才能が独自の成功への道を開く。' },
  53: { name:'外吉数',  omen:'外吉内凶',     desc:'外見は恵まれているが内面に苦労が多い。精神的な充実を大切にすることで総合的な幸福を得る。' },
  54: { name:'浮沈数',  omen:'苦労・変動',   desc:'運気の浮き沈みが大きく苦労が伴う。地道な努力の積み重ねと柔軟な適応力が人生の鍵。' },
  55: { name:'不安数',  omen:'変動・不安',   desc:'精神的な不安定さを抱えやすいが、芸術的な感受性と独自の世界観が才能の源となる。' },
  56: { name:'不足数',  omen:'苦労・不満',   desc:'努力が十分な結果として現れにくく不満が生じやすい。謙虚さと感謝の心が開運の鍵。' },
  57: { name:'吉運数',  omen:'吉運・発展',   desc:'着実な努力が実る発展の吉数。誠実に道を歩むことで、後半の人生に大きな吉運が開ける。' },
  58: { name:'吉運数',  omen:'大成・発展',   desc:'晩年にかけて大きく運気が開ける吉数。若い頃の努力と人との縁が実り、充実した人生を歩む。' },
  59: { name:'晩成数',  omen:'晩成・吉運',   desc:'晩年にかけて運気が好転する吉数。若い頃の苦労が肥やしとなり、人生後半に大きく花開く。' },
  60: { name:'動揺数',  omen:'不安・変動',   desc:'精神的・物質的に不安定になりやすい。信念を持って一つの道を歩むことが安定への道。' },
  61: { name:'幸運数',  omen:'幸運・福寿',   desc:'大きな幸運と福寿に恵まれた最高の吉数の一つ。人望と運気が高まり、晩年に向けて大成する。' },
  62: { name:'衰退数',  omen:'衰退・苦労',   desc:'運気が下り坂になりやすく苦労が多い。前向きな姿勢と人との繋がりを大切にすることが大事。' },
  63: { name:'大吉数',  omen:'大吉・福寿',   desc:'幸福と長寿を示す大吉数。人徳と運気に恵まれ、穏やかで充実した幸福な人生を歩む。' },
  64: { name:'衰退数',  omen:'衰退・苦難',   desc:'努力が報われにくく試練が多い。誠実さと粘り強さで逆境を乗り越えることが大切。' },
  65: { name:'福寿数',  omen:'福寿・大吉',   desc:'福と長寿を示す大吉数。穏やかな人柄と誠実さで多くの人に慕われ、幸福な晩年を迎える。' },
  66: { name:'混合数',  omen:'吉凶混合',     desc:'吉凶が入り混じるが、誠実に生きることで吉の方向へ向かいやすい安定した数。' },
  67: { name:'吉運数',  omen:'大吉・発展',   desc:'着実な発展と幸福を示す大吉数。地道な努力と人との縁が豊かな実りをもたらす。' },
  68: { name:'大吉数',  omen:'大吉・財運',   desc:'財運と人徳に恵まれた大吉数。穏やかで誠実な人柄が多くの人に信頼され、大きな成功を収める。' },
  69: { name:'吉凶数',  omen:'変化・吉運',   desc:'変化の中に吉運を秘める数。柔軟な対応と前向きな精神で変化を吉に転じる力を持つ。' },
  70: { name:'空虚数',  omen:'虚無・不安',   desc:'精神的な充実を求めにくく空虚感を感じやすい。内面を豊かにする活動が開運につながる。' },
  71: { name:'晩成数',  omen:'晩成・吉',     desc:'晩年に向けて運気が向上する吉数。若い頃の誠実な積み重ねが後半の人生で大きく実を結ぶ。' },
  72: { name:'変動数',  omen:'変動・吉運',   desc:'変化の中に吉運を持つ数。環境の変化に柔軟に対応することで大きな成功を掴める。' },
  73: { name:'安定数',  omen:'安定・平和',   desc:'穏やかで安定した運気を持つ。平和な日常の中に幸福を見出し、着実な歩みを続けられる。' },
  74: { name:'苦労数',  omen:'苦労・変動',   desc:'努力が報われにくく苦労が多い。誠実な積み重ねと人への感謝が幸運を引き寄せる鍵。' },
  75: { name:'吉運数',  omen:'吉運・安定',   desc:'穏やかな吉運を持つ安定した数。人との縁を大切にしながら着実に幸福を積み重ねる。' },
  76: { name:'変動数',  omen:'吉凶混合',     desc:'吉凶が混在するが、前向きな精神と誠実な努力で吉を引き寄せることができる。' },
  77: { name:'吉運数',  omen:'吉運・才能',   desc:'才能と吉運を持つ数。専門性を磨くことで独自の輝きを放ち、多くの人に認められる。' },
  78: { name:'混合数',  omen:'吉凶混合',     desc:'多様な才能を持つが定まりにくい。一つのことを深めることで大きな花が開く数。' },
  79: { name:'変動数',  omen:'変動・晩成',   desc:'波乱を経て晩年に安定する数。若い頃の苦労が人間力を高め、後半の人生で大きく輝く。' },
  80: { name:'苦労数',  omen:'苦労・晩成',   desc:'苦労が多いが晩年に好転する可能性を持つ。忍耐と努力の積み重ねが最終的な幸福につながる。' },
  81: { name:'還元数',  omen:'最高吉・還元',  desc:'1に戻る最高の完成数。最高の吉運を持ち、徳と才能で多くの人に慕われ偉大な足跡を残す。' },
};

function getRank(num) {
  const n = ((num - 1) % 81) + 1; // 81以上は循環
  for (const [rank, nums] of Object.entries(RANK_TABLE)) {
    if (nums.includes(n)) return rank;
  }
  return '凶';
}

const RANK_SCORE = { '大吉': 5, '吉': 4, '中吉': 3, '末吉': 2, '凶': 1 };
const RANK_PCT   = { '大吉': 100, '吉': 80, '中吉': 60, '末吉': 40, '凶': 20 };

const GOGYO_MEANINGS = {
  天格: { label: '天格（先祖運）', desc: '先祖から受け継いだ運気。変えることのできない宿命的な運勢を示す。' },
  地格: { label: '地格（基礎運）', desc: '幼少期から青年期にかけての基礎的な運気。性格や才能の素地を表す。' },
  人格: { label: '人格（主運）', desc: '一生を通じて最も影響力を持つ主要な運勢。性格・社会運・仕事運を司る。' },
  外格: { label: '外格（社会運）', desc: '対人関係・社会での立場・周囲からの評価を示す。' },
  総格: { label: '総格（総合運）', desc: '姓名全体が示す晩年の運勢。一生の総まとめとなる運気。' },
};

const DESCRIPTIONS = {
  大吉: [
    'あなたの名前は強運を秘めています。周囲の人を惹きつけるカリスマ性と、困難を乗り越える強靭な意志を持ちます。努力が実を結びやすく、人生において大きな成功を収める可能性があります。',
    '運気に恵まれた名前です。才能と運が重なり、あなたの人生を豊かに彩るでしょう。周囲からの信頼も厚く、自然とリーダーシップを発揮できる素質があります。',
    '輝かしい運命を持つ名前です。強い精神力と豊かな感受性を兼ね備え、芸術や学問でも秀でた才能を発揮できるでしょう。',
  ],
  吉: [
    '安定した運気を持つ名前です。着実に努力を積み重ねることで、望む結果を得られるでしょう。周囲との調和を大切にし、穏やかで充実した人生を歩めます。',
    '堅実な幸運に恵まれた名前です。急激な変化は少ないものの、コツコツと積み上げた努力が長期的な成功につながります。信頼できる人間関係に恵まれるでしょう。',
    '温かく恵まれた運気です。人情味あふれる性格で、多くの人から愛されるでしょう。家庭運・仕事運ともに安定しています。',
  ],
  中吉: [
    '波のある運気を持つ名前です。高い目標を持ち、粘り強く取り組むことで運勢が開けます。慎重さと行動力のバランスを意識することが大切です。',
    '可能性を秘めた運気です。時に困難に直面することもありますが、そこから得る経験が大きな成長につながります。柔軟な発想を活かすことで道が開けます。',
    'バランスの良い運気です。才能はありますが、それを活かすには周囲との協調と謙虚さが鍵となります。',
  ],
  末吉: [
    '運気の変動が大きい名前です。しかし逆境を乗り越えるたびに強くなれる運勢でもあります。慎重に行動し、信頼できる人のアドバイスを大切にしましょう。',
    '山あり谷ありの人生ですが、困難の先に光があります。忍耐力を養い、着実に一歩ずつ前進することが開運の鍵です。',
  ],
  凶: [
    '試練の多い運気ですが、それだけ魂の成長も大きい名前です。困難を恐れず、ポジティブな心を保つことで運命は変えられます。吉方位や開運行動を意識しましょう。',
    '苦難が伴う運気ですが、粘り強さと誠実さで運命を切り開けます。周囲の人との絆を大切に、焦らず着実に歩むことが大切です。',
  ],
};

const LUCKY_COLORS = ['深紫', '金色', '深紺', '翡翠色', '珊瑚色', '藍色', '朱色', '銀色', '群青', '若草色'];
const LUCKY_NUMBERS = [1,2,3,4,5,6,7,8,9,11,12,13,15,16,21,23,24,25];
const LUCKY_DIRECTIONS = ['北', '北東', '東', '南東', '南', '南西', '西', '北西'];
const LUCKY_ELEMENTS = ['木', '火', '土', '金', '水'];

function pickLucky(seed) {
  const h = (seed * 2654435761) >>> 0;
  return {
    color:     LUCKY_COLORS[(h >>> 0)  % LUCKY_COLORS.length],
    number:    LUCKY_NUMBERS[(h >>> 4)  % LUCKY_NUMBERS.length],
    direction: LUCKY_DIRECTIONS[(h >>> 8)  % LUCKY_DIRECTIONS.length],
    element:   LUCKY_ELEMENTS[(h >>> 12) % LUCKY_ELEMENTS.length],
  };
}

function getDesc(rank, seed) {
  const arr = DESCRIPTIONS[rank] || DESCRIPTIONS['中吉'];
  return arr[seed % arr.length];
}

// UI
const btn = document.getElementById('fortuneBtn');
const resetBtn = document.getElementById('resetBtn');
const resultSection = document.getElementById('result');

// ── ローディングオーバーレイ制御 ──
const loOverlay  = document.getElementById('loadingOverlay');
const loCharaWrap = document.getElementById('loCharaWrap');
const loText     = document.getElementById('loText');

function showLoading(msg) {
  if (!loOverlay) return;
  if (loText) loText.textContent = msg || '運命を読み解いています';
  loCharaWrap?.classList.remove('jump-out');
  loOverlay.classList.add('active');
}

function hideLoading() {
  if (!loOverlay) return;
  // ジャンプして消えるアニメーション
  loCharaWrap?.classList.add('jump-out');
  setTimeout(() => {
    loOverlay.classList.remove('active');
    loCharaWrap?.classList.remove('jump-out');
  }, 700);
}

btn.addEventListener('click', async () => {
  const lastName  = document.getElementById('lastName').value.trim();
  const firstName = document.getElementById('firstName').value.trim();

  if (!lastName && !firstName) {
    alert('お名前を入力してください。');
    return;
  }

  const manualLast  = parseInt(document.getElementById('lastStroke').value) || null;
  const manualFirst = parseInt(document.getElementById('firstStroke').value) || null;

  // --- ① 未知漢字を事前にAPIで取得 ---
  const preCheckLast  = getTotalStrokes(lastName);
  const preCheckFirst = getTotalStrokes(firstName);
  const allUnknown = [...preCheckLast.unknown, ...preCheckFirst.unknown];

  const warnEl = document.getElementById('unknownWarning');

  // ローディングオーバーレイを表示
  showLoading(allUnknown.length > 0 ? `「${allUnknown.join('、')}」の画数を調べています…` : '運命を読み解いています');
  btn.disabled = true;

  if (allUnknown.length > 0) {
    if (warnEl) {
      warnEl.textContent = `「${allUnknown.join('、')}」の画数をAPIで取得中…`;
      warnEl.style.display = 'block';
    }
    await fetchUnknownStrokes(allUnknown);
  }

  // 計算演出のため少し待機（最低0.8秒はアニメーションを見せる）
  await new Promise(r => setTimeout(r, 800));

  btn.disabled = false;

  // --- ② 再計算（APIキャッシュ反映済み）---
  const lastInfo  = getTotalStrokes(lastName);
  const firstInfo = getTotalStrokes(firstName);

  let lastTotal  = manualLast  ?? lastInfo.total;
  let firstTotal = manualFirst ?? firstInfo.total;

  // まだ不明な文字が残っている場合のみ警告
  const stillUnknown = [...lastInfo.unknown, ...firstInfo.unknown];
  if (warnEl) {
    if (stillUnknown.length > 0) {
      warnEl.textContent = `※「${stillUnknown.join('、')}」の画数が取得できませんでした（0画として計算）。手動入力欄で正確な画数を指定できます。`;
      warnEl.style.display = 'block';
    } else {
      warnEl.style.display = 'none';
    }
  }

  // 五格計算
  // 人格：姓末尾 + 名先頭
  const lastChars  = [...lastName];
  const firstChars = [...firstName];

  // 個別画数配列
  const lastStrokesArr  = lastChars.map(c => getStrokeCount(c) ?? '?');
  const firstStrokesArr = firstChars.map(c => getStrokeCount(c) ?? '?');

  const ninKakuLast  = lastName  ? (manualLast  ? Math.round(manualLast  / lastChars.length)  : (getStrokeCount(lastChars[lastChars.length - 1])   ?? Math.round(lastTotal  / Math.max(lastChars.length, 1))))  : 0;
  const ninKakuFirst = firstName ? (manualFirst ? Math.round(manualFirst / firstChars.length) : (getStrokeCount(firstChars[0]) ?? Math.round(firstTotal / Math.max(firstChars.length, 1)))) : 0;

  // 外格：姓先頭 + 名末尾（1文字の場合 +1）
  const gaiLast  = lastName  ? (lastChars.length  === 1 ? (getStrokeCount(lastChars[0])  ?? lastTotal)  + 1 : (getStrokeCount(lastChars[0])  ?? Math.round(lastTotal  / lastChars.length)))  : 1;
  const gaiFirst = firstName ? (firstChars.length === 1 ? (getStrokeCount(firstChars[firstChars.length-1]) ?? firstTotal) + 1 : (getStrokeCount(firstChars[firstChars.length-1]) ?? Math.round(firstTotal / firstChars.length))) : 1;

  const tenKaku  = lastTotal;
  const chiKaku  = firstTotal;
  const ninKaku  = ninKakuLast + ninKakuFirst;
  const gaiKaku  = gaiLast + gaiFirst;
  const soKaku   = lastTotal + firstTotal;

  const gogyo = [
    { key: '天格', val: tenKaku },
    { key: '地格', val: chiKaku },
    { key: '人格', val: ninKaku },
    { key: '外格', val: gaiKaku },
    { key: '総格', val: soKaku  },
  ];

  // ランク
  gogyo.forEach(g => { g.rank = getRank(g.val); });

  // 総合ランク（重み：人格40%, 総格30%, 地格15%, 外格10%, 天格5%）
  const weightedScore =
    RANK_SCORE[gogyo[2].rank] * 0.40 +
    RANK_SCORE[gogyo[4].rank] * 0.30 +
    RANK_SCORE[gogyo[1].rank] * 0.15 +
    RANK_SCORE[gogyo[3].rank] * 0.10 +
    RANK_SCORE[gogyo[0].rank] * 0.05;

  const overallRank = weightedScore >= 4.5 ? '大吉'
                    : weightedScore >= 3.5 ? '吉'
                    : weightedScore >= 2.5 ? '中吉'
                    : weightedScore >= 1.5 ? '末吉' : '凶';

  const seed = soKaku + ninKaku * 31;
  const lucky = pickLucky(seed);
  const desc  = getDesc(overallRank, seed);

  // 人格数の詳細説明
  const ninKey = ((ninKaku - 1) % 81) + 1;
  const ninFortune = NUMBER_FORTUNE[ninKaku] || NUMBER_FORTUNE[ninKey] || null;

  // 苗字の由来
  const myojiData = MYOJI_ORIGINS[lastName] || (lastName ? generateGenericOrigin(lastName) : null);

  // 有名人（総格に近い画数）
  const famousExact = FAMOUS_BY_TOTAL[soKaku] || [];
  const famousNear  = soKaku > 1
    ? (FAMOUS_BY_TOTAL[soKaku - 1] || FAMOUS_BY_TOTAL[soKaku + 1] || [])
    : [];
  const famousList  = famousExact.length > 0 ? famousExact : famousNear;
  const famousLabel = famousExact.length > 0
    ? `総画数 ${soKaku} 画と同じ有名人`
    : `総画数 ${soKaku} 画に近い有名人`;

  // 相性の良い人格数から名前例
  const compatData = COMPATIBLE_NINGAKU[ninKaku] || COMPATIBLE_NINGAKU[((ninKaku - 1) % 81) + 1];

  // --- 描画 ---
  const rankColors = { '大吉':'#f1c40f','吉':'#2ecc71','中吉':'#3498db','末吉':'#e67e22','凶':'#e74c3c' };

  document.getElementById('nameDisplay').style.display = 'none'; // ダイアグラムで表示するため非表示

  // ── 名前ダイアグラム ──
  // 各文字の役割（外格・人格に使われる文字を特定）
  const mkCharHtml = (chars, strokes, isSurname) => chars.map((c, i) => {
    const n = chars.length;
    const roles = [];
    if (isSurname) {
      if (n === 1) { roles.push('gaikaku'); roles.push('ninkaku'); }
      else { if (i === 0) roles.push('gaikaku'); if (i === n - 1) roles.push('ninkaku'); }
    } else {
      if (n === 1) { roles.push('ninkaku'); roles.push('gaikaku'); }
      else { if (i === 0) roles.push('ninkaku'); if (i === n - 1) roles.push('gaikaku'); }
    }
    const dots = roles.map(r =>
      `<span class="role-dot dot-${r}">${r === 'gaikaku' ? '外' : '人'}</span>`
    ).join('');
    return `<div class="ndc">
      <span class="ndc-k">${c}</span>
      <span class="ndc-s">${strokes[i]}</span>
      <div class="ndc-roles">${dots}</div>
    </div>`;
  }).join('');

  // 計算式テキスト
  const nL = lastChars.length, nF = firstChars.length;
  const surParts   = lastChars.map((c, i) => `${c}(${lastStrokesArr[i]})`);
  const firstParts = firstChars.map((c, i) => `${c}(${firstStrokesArr[i]})`);
  const formulaFor = lbl => {
    if (lbl === '天格') return surParts.join('+');
    if (lbl === '地格') return firstParts.join('+');
    if (lbl === '人格') return `${lastChars[nL-1]}(${lastStrokesArr[nL-1]})+${firstChars[0]}(${firstStrokesArr[0]})`;
    if (lbl === '外格') {
      const s = `${lastChars[0]}(${lastStrokesArr[0]})`;
      const f = `${firstChars[nF-1]}(${firstStrokesArr[nF-1]})`;
      return (nL === 1 || nF === 1) ? `${s}+${f}+1` : `${s}+${f}`;
    }
    if (lbl === '総格') return `${surParts.join('+')}+${firstParts.join('+')}`;
    return '';
  };

  const diagChipHtml = (lbl, num, rank) => {
    const nd = NUM_DETAIL[((num - 1) % 81) + 1];
    return `<div class="nd-chip rank-chip-${rank}">
      <span class="kc-lbl">${lbl}</span>
      <span class="kc-num">${num}</span>
      <div class="kc-foot">
        <span class="kc-rnk">${rank}</span>
        ${nd ? `<span class="kc-omen">${nd.omen}</span>` : ''}
      </div>
      <span class="kc-formula">${formulaFor(lbl)}</span>
    </div>`;
  };

  document.getElementById('strokesGrid').innerHTML = `
  <div class="name-diagram">

    <!-- 左ブラケット：外格・人格 -->
    <div class="nd-lb">
      ${diagChipHtml('外格', gaiKaku, gogyo[3].rank)}
      <div class="nd-lb-mid-line"></div>
      ${diagChipHtml('人格', ninKaku, gogyo[2].rank)}
    </div>

    <!-- 中央：名前文字 -->
    <div class="nd-nm">
      <div class="nd-nm-label">姓</div>
      <div class="nd-nm-row nd-nm-sur">${mkCharHtml(lastChars, lastStrokesArr, true)}</div>
      <div class="nd-nm-sep">
        <span class="nd-nm-sub">${lastTotal}画</span>
        <span class="nd-nm-total-label">合計 ${soKaku} 画</span>
        <span class="nd-nm-sub">${firstTotal}画</span>
      </div>
      <div class="nd-nm-row nd-nm-first">${mkCharHtml(firstChars, firstStrokesArr, false)}</div>
      <div class="nd-nm-label">名</div>
    </div>

    <!-- 右ブラケット：天格・総格・地格（アーム付き） -->
    <div class="nd-rb-outer">
      <div class="nd-rb-spine"></div>
      <div class="nd-rb-arms">
        <div class="nd-rb-pad"></div>
        <div class="nd-rb-sur-arm">
          <div class="nd-arm-h"></div>
          ${diagChipHtml('天格', tenKaku, gogyo[0].rank)}
        </div>
        <div class="nd-rb-sep-arm">
          <div class="nd-arm-h nd-arm-mid-h"></div>
          ${diagChipHtml('総格', soKaku, gogyo[4].rank)}
        </div>
        <div class="nd-rb-first-arm">
          <div class="nd-arm-h"></div>
          ${diagChipHtml('地格', chiKaku, gogyo[1].rank)}
        </div>
        <div class="nd-rb-pad"></div>
      </div>
    </div>

  </div>
  <div class="nd-legend">
    <span class="legend-item"><span class="dot-gaikaku legend-dot">外</span>外格に使われる文字</span>
    <span class="legend-item"><span class="dot-ninkaku legend-dot">人</span>人格に使われる文字</span>
  </div>
  `;

  // ── 五格カード ──
  document.getElementById('gogyoGrid').innerHTML = gogyo.map(g => {
    const nd = NUM_DETAIL[((g.val - 1) % 81) + 1];
    return `
    <div class="gogyo-card">
      <div class="gc-header rank-card-${g.rank}">
        <div class="gc-title-area">
          <span class="gc-kaku-name">${GOGYO_MEANINGS[g.key].label}</span>
          ${nd ? `<span class="gc-sym-name">【${nd.name}】</span>` : ''}
        </div>
        <div class="gc-num-area">
          <span class="gc-val">${g.val}</span>
          <span class="gc-rank-badge rank-${g.rank}">${g.rank}</span>
          ${nd ? `<span class="gc-omen">${nd.omen}</span>` : ''}
        </div>
      </div>
      <div class="gc-body">
        <p class="gc-role">${GOGYO_MEANINGS[g.key].desc}</p>
        ${nd ? `<p class="gc-num-desc">${nd.desc}</p>` : ''}
      </div>
    </div>`;
  }).join('');

  // 総合
  document.getElementById('overallResult').innerHTML = `
    <div class="overall-rank" style="color:${rankColors[overallRank]}">${overallRank}</div>
    <div class="overall-score">総合スコア：${(weightedScore / 5 * 100).toFixed(0)}点</div>
    <div class="overall-desc">${desc}</div>
  `;

  // 人格数 詳細解説
  const ninDetailEl = document.getElementById('ninDetailSection');
  if (ninFortune) {
    ninDetailEl.style.display = 'block';
    ninDetailEl.innerHTML = `
      <h3>人格数 ${ninKaku} ─「${ninFortune.title}」</h3>
      <div class="nin-grid">
        <div class="nin-item"><div class="nin-icon">🌟</div><div class="nin-label">性格・特徴</div><div class="nin-text">${ninFortune.personality}</div></div>
        <div class="nin-item"><div class="nin-icon">💼</div><div class="nin-label">仕事・才能</div><div class="nin-text">${ninFortune.work}</div></div>
        <div class="nin-item"><div class="nin-icon">💕</div><div class="nin-label">恋愛・対人</div><div class="nin-text">${ninFortune.love}</div></div>
        <div class="nin-item nin-caution"><div class="nin-icon">⚠️</div><div class="nin-label">注意点</div><div class="nin-text">${ninFortune.caution}</div></div>
      </div>
    `;
  } else {
    ninDetailEl.style.display = 'none';
  }

  // 苗字の由来
  const meaningEl = document.getElementById('meaningSection');
  if (myojiData) {
    meaningEl.style.display = 'block';
    meaningEl.innerHTML = `
      <h3>「${lastName}」という苗字の由来と歴史</h3>
      <div class="myoji-card">
        <div class="myoji-header">
          <span class="myoji-kanji">${lastName}</span>
          <span class="myoji-reading">（${myojiData.reading}）</span>
        </div>
        <div class="myoji-section-block">
          <div class="myoji-section-title">📜 由来・起源</div>
          <div class="myoji-text">${myojiData.origin}</div>
        </div>
        <div class="myoji-section-block">
          <div class="myoji-section-title">🏯 歴史・著名な人物</div>
          <div class="myoji-text">${myojiData.history}</div>
        </div>
        <div class="myoji-section-block myoji-energy-block">
          <div class="myoji-section-title">✨ 家系に宿るエネルギー</div>
          <div class="myoji-text">${myojiData.energy}</div>
        </div>
        <div class="myoji-distribution">
          <span class="myoji-dist-label">分布</span>
          <span class="myoji-dist-value">${myojiData.distribution}</span>
        </div>
        <div class="myoji-pref-section">
          <div class="myoji-section-title">📍 この苗字が多い都道府県</div>
          ${myojiData.prefectures ? `
          <div class="myoji-pref-list">
            ${myojiData.prefectures.map(p => `
              <div class="myoji-pref-item">
                <span class="myoji-pref-rank">${p.rank}位</span>
                <span class="myoji-pref-bar-wrap">
                  <span class="myoji-pref-bar" style="width:${Math.round(100 - (p.rank - 1) * 13)}%"></span>
                </span>
                <span class="myoji-pref-name">${p.name}</span>
              </div>
            `).join('')}
          </div>` : `
          <div class="myoji-pref-unknown">
            <p class="myoji-pref-unknown-text">「${lastName}」の詳細な地域分布データは、外部の苗字専門サービスでご確認いただけます。</p>
            <a class="myoji-pref-link"
               href="https://myoji-yurai.net/searchResult.htm?myojiKanji=${encodeURIComponent(lastName)}"
               target="_blank" rel="noopener noreferrer">
              🔍 「${lastName}」の分布を名字由来netで調べる
            </a>
          </div>`}
        </div>
      </div>
    `;
  } else {
    meaningEl.style.display = 'none';
  }

  // 同じ画数の有名人
  const famousEl = document.getElementById('famousSection');
  if (famousList.length > 0) {
    famousEl.style.display = 'block';
    famousEl.innerHTML = `
      <h3>${famousLabel}</h3>
      <div class="famous-list">
        ${famousList.map(f => `<div class="famous-item">✦ ${f}</div>`).join('')}
      </div>
      <p class="famous-note">同じ画数の魂を持つ著名人たちと、あなたは共通のエネルギーを秘めています。</p>
    `;
  } else {
    famousEl.style.display = 'none';
  }

  // 相性のいい名前
  const compatEl = document.getElementById('compatSection');
  if (compatData) {
    const exampleNames = compatData.names.slice(0, 6);
    compatEl.style.display = 'block';
    compatEl.innerHTML = `
      <h3>相性のいい人格数・名前の例</h3>
      <p class="compat-desc">あなたの人格数 <strong>${ninKaku}</strong> と相性が良い人格数は <strong>${compatData.good.slice(0,8).join('・')}</strong> などです。</p>
      <div class="compat-names">
        ${exampleNames.map(n => `<span class="compat-name-chip">${n}</span>`).join('')}
      </div>
      <p class="compat-note">※ 相性はあくまで参考です。画数が同じでも漢字の選び方で印象が大きく変わります。</p>
    `;
  } else {
    compatEl.style.display = 'none';
  }

  // ラッキー
  document.getElementById('luckySection').innerHTML = `
    <div class="lucky-item"><div class="lucky-label">ラッキーカラー</div><div class="lucky-value">${lucky.color}</div></div>
    <div class="lucky-item"><div class="lucky-label">ラッキーナンバー</div><div class="lucky-value">${lucky.number}</div></div>
    <div class="lucky-item"><div class="lucky-label">ラッキー方角</div><div class="lucky-value">${lucky.direction}</div></div>
    <div class="lucky-item"><div class="lucky-label">守護の五行</div><div class="lucky-value">${lucky.element}</div></div>
  `;

  // ローディングを隠してから結果を表示
  hideLoading();
  setTimeout(() => {
    resultSection.style.display = 'block';
    resultSection.scrollIntoView({ behavior: 'smooth' });
  }, 750);
});

resetBtn.addEventListener('click', () => {
  resultSection.style.display = 'none';
  document.getElementById('lastName').value = '';
  document.getElementById('firstName').value = '';
  document.getElementById('lastStroke').value = '';
  document.getElementById('firstStroke').value = '';
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
