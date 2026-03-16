import type { CardData } from '../types/game';

// ---------------------------------------------------------
// マスターデータとして全カードを定義
// ---------------------------------------------------------

export const CardsDb: Record<string, CardData> = {
    // 魔法カード
    aisatsu: {
        id: 'aisatsu',
        name: '挨拶',
        type: 'magic',
        cost: 3,
        abilityText: '場の予約状態のモンスター1体を召喚する。', // 仕様で「予約状態を召喚にする」と解釈
        abilityEffects: [
            { type: 'SUMMON_TARGET' }
        ],
        imageUrl: '/images/magics/aisatu.png',
        imageColor: 'bg-indigo-950'
    },
    mukachakka: {
        id: 'mukachakka',
        name: 'ムカチャッカファイヤー',
        type: 'magic',
        cost: 3,
        abilityText: '相手の場のモンスターすべてに3ダメージ。',
        abilityEffects: [
            { type: 'DAMAGE_ALL_ENEMY', amount: 3 }
        ],
        imageUrl: '/images/magics/mukachakka_faiya.png',
        imageColor: 'bg-red-950'
    },
    meisyu_no_yumiya: {
        id: 'meisyu_no_yumiya',
        name: '名手の弓矢',
        type: 'magic',
        cost: 1,
        abilityText: '敵のモンスターまたは能力者に3ダメージを与える。',
        abilityEffects: [
            { type: 'DAMAGE_TARGET', amount: 3 }
        ],
        imageUrl: '/images/magics/meisyu_no_yumiya.png',
        imageColor: 'bg-orange-800'
    },
    sekaizyu_no_chikara: {
        id: 'sekaizyu_no_chikara',
        name: '世界樹の力',
        type: 'magic',
        cost: 1,
        abilityText: '自身の雲タイプを持つクリーチャー全員の体力を+1する。その後、雲タイプのモンスターを1枚ドローする。',
        abilityEffects: [
            { type: 'BUFF_ALL_AFFILIATION', affiliationCondition: '雲', buffHp: 1 },
            { type: 'DRAW_CARD_WITH_AFFILIATION', affiliationCondition: '雲' }
        ],
        imageUrl: '/images/magics/sekaizyu_no_chikara.png',
        imageColor: 'bg-green-700'
    },
    danketu_nuko: {
        id: 'danketu_nuko',
        name: '団結ヌコ',
        type: 'magic',
        cost: 3,
        abilityText: '自身の雲タイプを持つモンスターランダム1体の攻撃力と体力を+1する。自身の場に雲タイプのモンスターが3体いるなら、自身のモンスター全員の攻撃力を+2、体力を+1する。',
        abilityEffects: [
            { type: 'DANKETSU_NUKO_BUFF' }
        ],
        imageUrl: '/images/magics/danketu_nuko.png',
        imageColor: 'bg-stone-500'
    },

    // モンスターカード
    beast_avatar: {
        id: 'beast_avatar',
        name: '獣の権化',
        type: 'monster',
        cost: 7,
        attack: 3,
        hp: 4,
        affiliation: '無し',
        role: '狩人',
        attackText: '無し',
        abilityText: '召喚時に「手下」を2体予約する。', // 仕様: このモンスターが召喚された時に、自分の場が空いているなら、空いている場全てに「手下」を予約する。
        attackEffects: [],
        abilityEffects: [
            // 空きスロット全て（最大2体）に特殊召喚する扱い
            { type: 'SPAWN_MONSTER', targetId: 'minion', amount: 2 }
        ],
        imageUrl: '/images/monsters/kemono_no_gonge.png',
        imageColor: 'bg-stone-900'
    },
    syabainu: {
        id: 'syabainu',
        name: 'しゃば犬',
        type: 'monster',
        cost: 3,
        attack: 3,
        hp: 3,
        affiliation: '雲',
        role: '狩人',
        attackText: '無し',
        abilityText: 'ターン終了時に正面の相手モンスターの攻撃力を-1する',
        attackEffects: [],
        abilityEffects: [],
        imageUrl: '/images/monsters/syabainu.png',
        imageColor: 'bg-blue-900'
    },
    nuko: {
        id: 'nuko',
        name: 'ヌコ',
        type: 'monster',
        cost: 5,
        attack: 3,
        hp: 5,
        affiliation: '雲',
        role: '狩人',
        attackText: '相手能力者にダメージを与えた時、「超・ヌコ」に変身する。',
        abilityText: '無し',
        attackEffects: [
            { type: 'TRANSFORM_INTO', targetId: 'chou_nuko' }
        ],
        abilityEffects: [],
        imageUrl: '/images/monsters/nuko.png',
        imageColor: 'bg-stone-500'
    },
    chou_nuko: {
        id: 'chou_nuko',
        name: '超・ヌコ',
        type: 'monster',
        cost: 2,
        attack: 2,
        hp: 3,
        affiliation: '雲',
        role: '狩人',
        attackText: 'このモンスターが攻撃する時に自分の場に雲タイプのモンスターが3体いれば、自分以外のモンスター全員の攻撃力を+2する。',
        abilityText: 'このモンスターに変身した時、自分以外の味方の雲タイプのモンスター全員の体力を+2する。',
        attackEffects: [
            { type: 'CONDITIONAL_BUFF_OTHER_ALLIES', affiliationCondition: '雲', conditionCount: 3, buffAttack: 2 }
        ],
        abilityEffects: [
            { type: 'BUFF_OTHER_ALLIES_STATS', affiliationCondition: '雲', buffHp: 2 }
        ],
        imageUrl: '/images/monsters_token/chou_nuko.png',
        imageColor: 'bg-yellow-600'
    },
    levelup_usagi: {
        id: 'levelup_usagi',
        name: 'レベルアップウサギ',
        type: 'monster',
        cost: 2,
        attack: 1,
        hp: 2,
        affiliation: '太陽',
        role: '狩人',
        attackText: '相手能力者にダメージを与えた時、ランダムな自身の他のモンスターのレベルを1あげる',
        abilityText: '無し',
        attackEffects: [
            { type: 'LEVEL_UP_RANDOM_ALLY' }
        ],
        abilityEffects: [],
        imageUrl: '/images/monsters/reberuappu_usagi.png',
        imageColor: 'bg-orange-900'
    },
    minion: {
        id: 'minion',
        name: '手下',
        type: 'monster',
        cost: 2,
        attack: 2,
        hp: 3,
        affiliation: '雲',
        role: '狩人',
        attackText: '無し',
        abilityText: '無し',
        attackEffects: [],
        abilityEffects: [],
        imageUrl: '/images/monsters_token/minion.png',
        imageColor: 'bg-black'
    },
    morino_nakamayobi: {
        id: 'morino_nakamayobi',
        name: '森の仲間呼び',
        type: 'monster',
        cost: 3,
        attack: 2,
        hp: 3,
        affiliation: '雲',
        role: '狩人',
        isTaunt: true,
        attackText: '相手能力者にダメージを与える時、狩人のモンスターを1枚ドローする。',
        abilityText: '相手モンスターはこのモンスターを無視して攻撃できない',
        attackEffects: [
            { type: 'DRAW_CARD_WITH_ROLE', roleCondition: '狩人', amount: 1 }
        ],
        abilityEffects: [],
        imageUrl: '/images/monsters/morino_nakamayobi.png',
        imageColor: 'bg-green-950'
    },
    hoshoku_no_zekketsu: {
        id: 'hoshoku_no_zekketsu',
        name: '捕食の絶傑',
        type: 'monster',
        cost: 6,
        attack: 4,
        hp: 6,
        affiliation: '雲',
        role: '狩人',
        isTaunt: true,
        attackText: '相手モンスターを倒した時、攻撃力と体力を+1する。',
        abilityText: '相手モンスターはこのモンスターを無視して攻撃できない',
        attackEffects: [
            { type: 'BUFF_SELF_STATS', buffAttack: 1, buffHp: 1 } // 条件はエンジン側で検知する
        ],
        abilityEffects: [],
        imageUrl: '/images/monsters/hoshoku_no_zekketsu.png',
        imageColor: 'bg-red-950'
    }
};

// ---------------------------------------------------------
// テスト用のユーティリティ
// （デッキや手札のIDリストから実体カードを生成するヘルパー）
// ---------------------------------------------------------
export const createCardInstance = (baseId: string, instanceIdSuffix: string): CardData | null => {
    const baseCard = CardsDb[baseId];
    if (!baseCard) return null;
    return {
        ...baseCard,
        id: `${baseId}_${instanceIdSuffix}` // 盤面に同名カードが存在できるようにIDを一意にする
    };
};

// ---------------------------------------------------------
// デッキ定義（テスト用・20枚）
// ---------------------------------------------------------

// デッキのカードIDリスト（baseId を羅列）
export const TestDeckPlayer: string[] = [
    'minion', 'minion', 'minion', 'minion',
    'morino_nakamayobi', 'morino_nakamayobi',
    'beast_avatar', 'beast_avatar',
    'hoshoku_no_zekketsu',
    'aisatsu', 'aisatsu',
    'mukachakka', 'mukachakka',
    'minion', 'minion',
    'morino_nakamayobi',
    'beast_avatar',
    'aisatsu',
    'mukachakka',
    'hoshoku_no_zekketsu',
];

export const TestDeckEnemy: string[] = [
    'minion', 'minion', 'minion', 'minion',
    'morino_nakamayobi', 'morino_nakamayobi',
    'hoshoku_no_zekketsu', 'hoshoku_no_zekketsu',
    'beast_avatar', 'beast_avatar',
    'aisatsu', 'aisatsu',
    'mukachakka', 'mukachakka',
    'minion', 'minion',
    'morino_nakamayobi',
    'beast_avatar',
    'mukachakka',
    'aisatsu',
];

// デッキIDリストからカードインスタンスの配列を生成（シャッフル付き）
export const buildDeck = (deckIds: string[]): CardData[] => {
    const cards = deckIds
        .map((baseId, i) => createCardInstance(baseId, `d${i}_${Date.now()}`))
        .filter((c): c is CardData => c !== null);
    // Fisher-Yates シャッフル
    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    return cards;
};
