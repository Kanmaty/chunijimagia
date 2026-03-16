import type { PlayerCharacter } from '../types/game';

export const CharactersDb: Record<string, PlayerCharacter> = {
    alpha: {
        id: 'alpha',
        name: 'Alpha',
        maxHp: 28,
        defense: 0,
        initialMp: 2,
        mpRegen: 4,
        equippedSkills: [
            {
                id: 'alpha_skill_1',
                name: '斬',
                description: '敵の特定のモンスターまたはプレイヤーに防御力を無視して2ダメージを与える。',
                cost: 1, level: 1,
                conditions: [{ type: 'affiliation', value: '星', count: 1 }],
                effects: [{ type: 'FIXED_DAMAGE_TARGET', amount: 2 }]
            },
            {
                id: 'alpha_skill_2',
                name: '一網打尽',
                description: '敵モンスター全体に2ダメージを与える。',
                cost: 0, level: 2,
                conditions: [
                    { type: 'affiliation', value: '月', count: 1 },
                    { type: 'affiliation', value: '星', count: 1 }
                ],
                effects: [{ type: 'DAMAGE_ALL_ENEMY', amount: 2 }]
            },
            {
                id: 'alpha_skill_3',
                name: '絶斬',
                description: '敵の特定のモンスターまたはプレイヤーに防御力を無視して5ダメージを与える。',
                cost: 0, level: 3,
                conditions: [
                    { type: 'affiliation', value: '月', count: 1 },
                    { type: 'affiliation', value: '星', count: 1 },
                    { type: 'role', value: '錬金術師', count: 1 }
                ],
                effects: [{ type: 'FIXED_DAMAGE_TARGET', amount: 5 }]
            }
        ]
    },
    delta: {
        id: 'delta',
        name: 'Delta',
        maxHp: 25,
        defense: 1,
        initialMp: 1,
        mpRegen: 5,
        equippedSkills: [
            {
                id: 'delta_skill_1',
                name: 'じゃれつく！',
                description: '敵1体に3ダメージを与える。',
                cost: 1, level: 1,
                conditions: [{ type: 'role', value: '狩人', count: 1 }],
                effects: [{ type: 'DAMAGE_TARGET', amount: 3 }]
            },
            {
                id: 'delta_skill_2',
                name: 'あたーーく！',
                description: '敵1体に固定4ダメージを与える。',
                cost: 0, level: 2,
                conditions: [
                    { type: 'affiliation', value: '雲', count: 1 },
                    { type: 'role', value: '守護者', count: 1 },
                    { type: 'role', value: '狩人', count: 1 }
                ],
                effects: [{ type: 'FIXED_DAMAGE_TARGET', amount: 4 }]
            },
            {
                id: 'delta_skill_3',
                name: '一致団結',
                description: '自分の場の狩人モンスター全員の体力を+2、攻撃力を+1する。',
                cost: 1, level: 3,
                conditions: [{ type: 'role', value: '狩人', count: 3 }],
                effects: [{ type: 'BUFF_ALL_ROLE', roleCondition: '狩人', buffAttack: 1, buffHp: 2 }]
            }
        ]
    },



    mille: {
        id: 'mille',
        name: 'ミラ',
        maxHp: 24,
        defense: 1,
        initialMp: 1,
        mpRegen: 4,
        equippedSkills: [
            {
                id: 'mille_skill_1',
                name: 'ピンポイント',
                description: '対象に3ダメージを与える。',
                cost: 1,
                level: 1,
                conditions: [{ type: 'role', value: '回復者', count: 1 }],
                effects: [{ type: 'DAMAGE_TARGET', amount: 3 }]
            },
            {
                id: 'mille_skill_2',
                name: 'リペア',
                description: '自身のモンスター1体をレベルアップさせる。',
                cost: 2,
                level: 1,
                conditions: [{ type: 'role', value: '錬金術師', count: 1 }],
                effects: [{ type: 'LEVEL_UP_TARGET' }]
            },
            {
                id: 'mille_skill_3',
                name: 'ブースト',
                description: '自身の予約中のモンスター1体を召喚し、攻撃力を+1する。',
                cost: 3,
                level: 1,
                conditions: [{ type: 'affiliation', value: '星', count: 1 }],
                effects: [
                    { type: 'SUMMON_TARGET' },
                    { type: 'BUFF_TARGET_STATS', buffAttack: 1 }
                ]
            },
            {
                id: 'mille_skill_4',
                name: 'オーバークロック',
                description: '自身のモンスター1体の攻撃力を+2する。',
                cost: 1,
                level: 2,
                conditions: [
                    { type: 'role', value: '回復者', count: 1 },
                    { type: 'affiliation', value: '星', count: 1 }
                ],
                effects: [{ type: 'BUFF_TARGET_STATS', buffAttack: 2 }]
            },
            {
                id: 'mille_skill_5',
                name: 'タイムリミット',
                description: 'カードを2枚ドローする。自身のターン終了時まで、手札のモンスターのコストが-1される。',
                cost: 1,
                level: 2,
                conditions: [
                    { type: 'affiliation', value: '月', count: 1 },
                    { type: 'affiliation', value: '星', count: 1 }
                ],
                effects: [
                    { type: 'DRAW_CARDS', amount: 2 },
                    { type: 'BUFF_HAND_COST', amount: -1 }
                ]
            },
            {
                id: 'mille_skill_6',
                name: 'チュニジバースト',
                description: '味方モンスター全体をレベルアップさせる。相手能力者に、7ダメージを与える。',
                cost: 7,
                level: 2,
                conditions: [
                    { type: 'role', value: '回復者', count: 1 },
                    { type: 'affiliation', value: '星', count: 2 }
                ],
                effects: [
                    { type: 'LEVEL_UP_ALL_ALLIES' },
                    { type: 'HONOUR_DAMAGE_TARGET', amount: 7 }
                ]
            },
            {
                id: 'mille_skill_7',
                name: 'ステロイド',
                description: '自身の初期ライフが+6される。',
                cost: 0,
                level: 3,
                conditions: [],
                effects: [{ type: 'AUTO_LIFE_BOOST', amount: 6 }]
            },
            {
                id: 'mille_skill_8',
                name: 'スタートダッシュ',
                description: '自身の初期CPが+4される。',
                cost: 0,
                level: 3,
                conditions: [],
                effects: [{ type: 'AUTO_MP_BOOST', amount: 4 }]
            },
            {
                id: 'mille_skill_9',
                name: 'ドーピング',
                description: '自身のCP回復量が+1される。',
                cost: 0,
                level: 3,
                conditions: [],
                effects: [{ type: 'AUTO_MP_REGEN_BOOST', amount: 1 }]
            }
        ]
    },
    zeta: {
        id: 'zeta',
        name: 'ゼータ',
        maxHp: 30,
        defense: 0,
        initialMp: 3,
        mpRegen: 4,
        equippedSkills: [
            {
                id: 'zeta_skill_1',
                name: '捨て身の一撃',
                description: 'あなたは、固定2ダメージを受ける。敵1体に、4ダメージを与える。',
                cost: 3,
                level: 1,
                conditions: [{ type: 'role', value: '剣士', count: 1 }],
                effects: [
                    { type: 'DAMAGE_PLAYER', amount: 2 },
                    { type: 'DAMAGE_TARGET', amount: 4 }
                ]
            },
            {
                id: 'zeta_skill_2',
                name: 'ドラゴンフュージョン',
                description: 'あなたのターン終了時まで、あなたの手札の剣士タイプのコストが-1される。あなたはMPを1得る',
                cost: 0,
                level: 1,
                conditions: [{ type: 'role', value: '剣士', count: 1 }],
                effects: [
                    { type: 'BUFF_HAND_COST_BY_TYPE', targetType: '剣士', amount: -1 },
                    { type: 'GAIN_MP', amount: 1 }
                ]
            },
            {
                id: 'zeta_skill_3',
                name: '一喝',
                description: '味方クリーチャー1体に、固定1ダメージを与え、このターンの間、攻撃力+2を付与する。',
                cost: 1,
                level: 1,
                conditions: [{ type: 'role', value: '守護者', count: 1 }],
                effects: [
                    { type: 'FIXED_DAMAGE_TARGET', amount: 1 },
                    { type: 'BUFF_TARGET_STATS', buffAttack: 2 }
                ]
            },
            {
                id: 'zeta_skill_4',
                name: '決死の一撃',
                description: 'あなたは、固定3ダメージを受ける。敵1体に、5ダメージを与える。',
                cost: 0,
                level: 2,
                conditions: [{ type: 'role', value: '剣士', count: 2 }],
                effects: [
                    { type: 'DAMAGE_PLAYER', amount: 3 },
                    { type: 'DAMAGE_TARGET', amount: 5 }
                ]
            },
            {
                id: 'zeta_skill_5',
                name: 'ドラゴンビート',
                description: 'あなたは、固定1ダメージを受ける。味方の剣士タイプ全体に、このターンの間、攻撃力+2を付与する。',
                cost: 1,
                level: 2,
                conditions: [
                    { type: 'role', value: '剣士', count: 2 },
                    { type: 'role', value: '守護者', count: 1 }
                ],
                effects: [
                    { type: 'DAMAGE_PLAYER', amount: 1 },
                    { type: 'BUFF_ALL_ROLE', roleCondition: '剣士', buffAttack: 2 }
                ]
            },
            {
                id: 'zeta_skill_6',
                name: '煽動',
                description: 'セット中の敵クリーチャー1体をサモンする。',
                cost: 1,
                level: 2,
                conditions: [
                    { type: 'affiliation', value: '月', count: 1 },
                    { type: 'role', value: '守護者', count: 1 }
                ],
                effects: [{ type: 'SUMMON_ENEMY_TARGET' }]
            },
            {
                id: 'zeta_skill_7',
                name: 'ブラッディブロウ',
                description: 'あなたは、固定1ダメージを受ける。敵1体に、6ダメージを与える。',
                cost: 0,
                level: 3,
                conditions: [{ type: 'role', value: '剣士', count: 3 }],
                effects: [
                    { type: 'DAMAGE_PLAYER', amount: 1 },
                    { type: 'DAMAGE_TARGET', amount: 6 }
                ]
            },
            {
                id: 'zeta_skill_8',
                name: 'ドラゴンソウル',
                description: '味方の剣士タイプ全体に、ライフ+1と攻撃力+1を付与する。あなたはMPを1得る。',
                cost: 0,
                level: 3,
                conditions: [
                    { type: 'affiliation', value: '月', count: 1 },
                    { type: 'role', value: '剣士', count: 3 }
                ],
                effects: [
                    { type: 'BUFF_ALL_ROLE', roleCondition: '剣士', buffHp: 1, buffAttack: 1 },
                    { type: 'GAIN_MP', amount: 1 }
                ]
            },
            {
                id: 'zeta_skill_9',
                name: 'レイジオブスペード',
                description: '敵1体に、あなたの墓地にある月タイプの枚数分のダメージを与える。あなたはMPを1得る。',
                cost: 0,
                level: 3,
                conditions: [
                    { type: 'affiliation', value: '月', count: 1 },
                    { type: 'role', value: '剣士', count: 3 }
                ],
                effects: [
                    { type: 'DAMAGE_TARGET_BY_GRAVEYARD', targetType: '月' },
                    { type: 'GAIN_MP', amount: 1 }
                ]
            }
        ]
    },
    karin: {
        id: 'karin',
        name: 'カリン（神道 花梨）',
        maxHp: 28,
        defense: 1,
        initialMp: 2,
        mpRegen: 4,
        equippedSkills: [
            {
                id: 'karin_skill_1',
                name: '裂断斬り',
                description: '敵1体に、2ダメージを与える。',
                cost: 0,
                level: 1,
                conditions: [{ type: 'role', value: '守護者', count: 1 }],
                effects: [{ type: 'DAMAGE_TARGET', amount: 2 }]
            },
            {
                id: 'karin_skill_2',
                name: '兜割り',
                description: '敵1体に、固定2ダメージを与える。',
                cost: 1,
                level: 1,
                conditions: [{ type: 'role', value: '守護者', count: 1 }],
                effects: [{ type: 'FIXED_DAMAGE_TARGET', amount: 2 }]
            },
            {
                id: 'karin_skill_3',
                name: '気合溜め',
                description: 'あなたはＭＰを1得る。',
                cost: 0,
                level: 1,
                conditions: [{ type: 'role', value: '守護者', count: 1 }],
                effects: [{ type: 'GAIN_MP', amount: 1 }]
            },
            {
                id: 'karin_skill_4',
                name: '月閃',
                description: '敵クリーチャー全体に、固定2ダメージを与える。',
                cost: 0,
                level: 2,
                conditions: [
                    { type: 'affiliation', value: '月', count: 1 },
                    { type: 'role', value: '守護者', count: 1 }
                ],
                effects: [{ type: 'FIXED_DAMAGE_ALL_ENEMY', amount: 2 }]
            },
            {
                id: 'karin_skill_5',
                name: '介錯',
                description: 'ランダムな敵クリーチャー1体を、即死させる。',
                cost: 1,
                level: 2,
                conditions: [
                    { type: 'affiliation', value: '雲', count: 1 },
                    { type: 'role', value: '守護者', count: 2 }
                ],
                effects: [{ type: 'INSTANT_KILL_RANDOM_ENEMY' }]
            },
            {
                id: 'karin_skill_6',
                name: '鋼の刃',
                description: '敵1体に、固定4ダメージを与える。',
                cost: 0,
                level: 2,
                conditions: [
                    { type: 'affiliation', value: '雲', count: 1 },
                    { type: 'role', value: '守護者', count: 2 }
                ],
                effects: [{ type: 'FIXED_DAMAGE_TARGET', amount: 4 }]
            },
            {
                id: 'karin_skill_7',
                name: '五月雨斬り',
                description: '敵1体に、4ダメージを与え、敵クリーチャー全体に1ダメージを与える。あなたはＭＰを2得る。',
                cost: 0,
                level: 3,
                conditions: [
                    { type: 'affiliation', value: '月', count: 1 },
                    { type: 'role', value: '守護者', count: 3 }
                ],
                effects: [
                    { type: 'DAMAGE_TARGET', amount: 4 },
                    { type: 'DAMAGE_ALL_ENEMY', amount: 1 },
                    { type: 'GAIN_MP', amount: 2 }
                ]
            },
            {
                id: 'karin_skill_8',
                name: '剣の精神',
                description: '味方の守護者タイプ全体に、攻撃力+2を付与する。',
                cost: 1,
                level: 3,
                conditions: [
                    { type: 'affiliation', value: '雲', count: 1 },
                    { type: 'role', value: '守護者', count: 3 }
                ],
                effects: [{ type: 'BUFF_ALL_ROLE', roleCondition: '守護者', buffAttack: 2 }]
            },
            {
                id: 'karin_skill_9',
                name: '月光斬',
                description: '敵1体に、固定5ダメージを与える。',
                cost: 0,
                level: 3,
                conditions: [
                    { type: 'affiliation', value: '月', count: 1 },
                    { type: 'role', value: '守護者', count: 2 }
                ],
                effects: [{ type: 'FIXED_DAMAGE_TARGET', amount: 5 }]
            }
        ]
    },
    elena: {
        id: 'elena',
        name: 'エレナ・ブリリアント',
        maxHp: 18,
        defense: 2,
        initialMp: 1,
        mpRegen: 5,
        equippedSkills: [
            {
                id: 'elena_skill_1',
                name: 'パラソルアタック',
                description: '敵1体に、2ダメージを与える。',
                cost: 0,
                level: 1,
                conditions: [{ type: 'role', value: '暗殺者', count: 1 }],
                effects: [{ type: 'DAMAGE_TARGET', amount: 2 }]
            },
            {
                id: 'elena_skill_2',
                name: 'ウェイクアップ',
                description: 'セット中のクリーチャー1体をサモンする。',
                cost: 4,
                level: 1,
                conditions: [{ type: 'affiliation', value: '雲', count: 1 }],
                effects: [{ type: 'SUMMON_TARGET' }]
            },
            {
                id: 'elena_skill_3',
                name: '小悪魔キッス',
                description: '味方の星タイプのクリーチャー1体に、このターンの間、攻撃力+2を付与する。',
                cost: 2,
                level: 1,
                conditions: [
                    { type: 'affiliation', value: '雲', count: 1 },
                    { type: 'role', value: '暗殺者', count: 1 }
                ],
                effects: [{ type: 'BUFF_TARGET_STATS_BY_TYPE', targetType: '星', buffAttack: 2 }]
            },
            {
                id: 'elena_skill_4',
                name: '光の壁',
                description: '味方クリーチャー1体に、ライフ+2と挑発を付与する。',
                cost: 1,
                level: 2,
                conditions: [
                    { type: 'affiliation', value: '雲', count: 1 },
                    { type: 'role', value: '暗殺者', count: 2 }
                ],
                effects: [{ type: 'BUFF_TARGET_STATS', buffHp: 2, grantTaunt: true }]
            },
            {
                id: 'elena_skill_5',
                name: '闇のヴェール',
                description: '味方クリーチャー1体に、ステルスを付与する。',
                cost: 0,
                level: 2,
                conditions: [
                    { type: 'affiliation', value: '月', count: 1 },
                    { type: 'role', value: '暗殺者', count: 1 }
                ],
                effects: [{ type: 'GRANT_STEALTH_TARGET' }]
            },
            {
                id: 'elena_skill_6',
                name: '力の契約',
                description: '味方クリーチャー全体に、攻撃力+1を付与する。',
                cost: 2,
                level: 2,
                conditions: [
                    { type: 'affiliation', value: '雲', count: 1 },
                    { type: 'role', value: '暗殺者', count: 2 }
                ],
                effects: [{ type: 'BUFF_ALL_ALLIES', buffAttack: 1 }]
            },
            {
                id: 'elena_skill_7',
                name: 'アニマルレギオン',
                description: '味方の狩人タイプ全体に、ライフ+2と挑発を付与する。',
                cost: 1,
                level: 3,
                conditions: [
                    { type: 'affiliation', value: '雲', count: 1 },
                    { type: 'role', value: '暗殺者', count: 3 }
                ],
                effects: [{ type: 'BUFF_ALL_ROLE', roleCondition: '狩人', buffHp: 2, grantTaunt: true }]
            },
            {
                id: 'elena_skill_8',
                name: '断罪',
                description: '敵全体に、固定3ダメージを与える。',
                cost: 0,
                level: 3,
                conditions: [
                    { type: 'affiliation', value: '月', count: 1 },
                    { type: 'role', value: '暗殺者', count: 3 }
                ],
                effects: [{ type: 'FIXED_DAMAGE_ALL_ENEMY', amount: 3 }]
            },
            {
                id: 'elena_skill_9',
                name: '悪魔の微笑み',
                description: '味方の暗殺者タイプ全体に、攻撃力+2を付与する。',
                cost: 1,
                level: 3,
                conditions: [
                    { type: 'affiliation', value: '雲', count: 1 },
                    { type: 'affiliation', value: '月', count: 1 },
                    { type: 'role', value: '暗殺者', count: 3 }
                ],
                effects: [{ type: 'BUFF_ALL_ROLE', roleCondition: '暗殺者', buffAttack: 2 }]
            }
        ],
    },
    raizer: {
        id: 'raizer',
        name: 'ライザー',
        maxHp: 30,
        defense: 0,
        initialMp: 3,
        mpRegen: 4,
        equippedSkills: [
            { id: 'raizer_skill_1', name: 'ナイフアタック', description: '敵1体に、3ダメージを与える。', cost: 1, level: 1, conditions: [{ type: 'role', value: '狩人', count: 1 }], effects: [{ type: 'DAMAGE_TARGET', amount: 3 }] },
            { id: 'raizer_skill_2', name: '防御指示', description: '味方の錬金術師タイプ1体に、シールドを付与する。', cost: 0, level: 1, conditions: [{ type: 'role', value: '錬金術師', count: 1 }], effects: [{ type: 'BUFF_TARGET_STATS', targetType: '錬金術師', grantShield: true }] },
            { id: 'raizer_skill_3', name: '攻撃指示', description: '味方クリーチャー1体に、ライフ+1と攻撃力+1を付与する。', cost: 0, level: 1, conditions: [{ type: 'role', value: '狩人', count: 1 }], effects: [{ type: 'BUFF_TARGET_STATS', buffHp: 1, buffAttack: 1 }] },
            { id: 'raizer_skill_4', name: '遠吠え', description: 'セット中のクリーチャー1体をサモンし、その持ち主のターン終了時まで、攻撃力+1を付与する。', cost: 2, level: 2, conditions: [{ type: 'role', value: '狩人', count: 2 }], effects: [{ type: 'SUMMON_TARGET' }, { type: 'BUFF_TARGET_STATS', buffAttack: 1 }] },
            { id: 'raizer_skill_5', name: '大暴れ', description: 'あなたは固定1ダメージを受ける。敵クリーチャー全体に、固定2ダメージを与える。', cost: 0, level: 2, conditions: [{ type: 'affiliation', value: '月', count: 1 }], effects: [{ type: 'DAMAGE_PLAYER', amount: 1 }, { type: 'FIXED_DAMAGE_ALL_ENEMY', amount: 2 }] },
            { id: 'raizer_skill_6', name: '補給物資', description: 'カードを2枚ドローする。あなたはMPを1得る。', cost: 0, level: 2, conditions: [{ type: 'role', value: '錬金術師', count: 1 }], effects: [{ type: 'DRAW_CARDS', amount: 2 }, { type: 'GAIN_MP', amount: 1 }] },
            { id: 'raizer_skill_7', name: 'ビーストコンバット', description: '敵1体に、固定5ダメージを与える。あなたはMPを2得る。', cost: 0, level: 3, conditions: [{ type: 'affiliation', value: '月', count: 1 }, { type: 'role', value: '狩人', count: 2 }], effects: [{ type: 'FIXED_DAMAGE_TARGET', amount: 5 }, { type: 'GAIN_MP', amount: 2 }] },
            { id: 'raizer_skill_8', name: 'ソウルイーター', description: '敵全体に、3ダメージを与える。あなたはライフを1回復し、MPを1得る。', cost: 0, level: 3, conditions: [{ type: 'affiliation', value: '月', count: 2 }], effects: [{ type: 'DAMAGE_ALL_ENEMIES_AND_PLAYER', amount: 3 }, { type: 'HEAL_PLAYER', amount: 1 }, { type: 'GAIN_MP', amount: 1 }] },
            { id: 'raizer_skill_9', name: 'ワイルドファング', description: '相手能力者に、固定4ダメージを与える。相手能力者は、相手のターン終了時まで、スキルを使用できなくなる。', cost: 0, level: 3, conditions: [{ type: 'role', value: '錬金術師', count: 2 }], effects: [{ type: 'HONOUR_DAMAGE_TARGET', amount: 4 }, { type: 'SEAL_ENEMY_SKILL' }] }
        ]
    },
    leo: {
        id: 'leo',
        name: 'レオ',
        maxHp: 24,
        defense: 1,
        initialMp: 3,
        mpRegen: 4,
        equippedSkills: [
            { id: 'leo_skill_1', name: '襲撃', description: '敵1体に、3ダメージを与える。', cost: 1, level: 1, conditions: [{ type: 'role', value: '守護者', count: 1 }], effects: [{ type: 'DAMAGE_TARGET', amount: 3 }] },
            { id: 'leo_skill_2', name: '恫喝', description: '相手のMPを1奪う。', cost: 0, level: 1, conditions: [{ type: 'role', value: '守護者', count: 1 }], effects: [{ type: 'STEAL_MP', amount: 1 }] },
            { id: 'leo_skill_3', name: 'ライフアップ', description: '自動発動 あなたの初期ライフが+3される。', cost: 0, level: 1, conditions: [], effects: [{ type: 'AUTO_LIFE_BOOST', amount: 3 }] },
            { id: 'leo_skill_4', name: 'うたたね', description: 'あなたのライフを1回復し、MPを1得る。', cost: 0, level: 2, conditions: [{ type: 'affiliation', value: '月', count: 1 }, { type: 'role', value: '回復者', count: 1 }], effects: [{ type: 'HEAL_PLAYER', amount: 1 }, { type: 'GAIN_MP', amount: 1 }] },
            { id: 'leo_skill_5', name: '暗殺', description: 'セット中の敵クリーチャー1体をランダムに即死させる。', cost: 4, level: 2, conditions: [{ type: 'role', value: '守護者', count: 3 }], effects: [{ type: 'INSTANT_KILL_RANDOM_RESERVED_ENEMY' }] },
            { id: 'leo_skill_6', name: '退場命令', description: '敵クリーチャー1体を持ち主の手札に戻す。', cost: 2, level: 2, conditions: [{ type: 'affiliation', value: '月', count: 2 }, { type: 'role', value: '回復者', count: 1 }], effects: [{ type: 'RETURN_ENEMY_TO_HAND' }] },
            { id: 'leo_skill_7', name: 'デスペラード', description: 'ランダムな敵に、固定1ダメージを合計4回与える。あなたはMPを2得る。', cost: 0, level: 3, conditions: [{ type: 'affiliation', value: '月', count: 1 }, { type: 'role', value: '守護者', count: 2 }], effects: [{ type: 'RANDOM_FIXED_DAMAGE_MULTIPLE', amount: 1, hitCount: 4 }, { type: 'GAIN_MP', amount: 2 }] },
            { id: 'leo_skill_8', name: 'ナイトメアリンク', description: '敵1体に、固定6ダメージを与える。', cost: 2, level: 3, conditions: [{ type: 'affiliation', value: '月', count: 1 }, { type: 'role', value: '守護者', count: 2 }], effects: [{ type: 'FIXED_DAMAGE_TARGET', amount: 6 }] },
            { id: 'leo_skill_9', name: '覚醒', description: '味方の回復者タイプ全体に、攻撃力+2を付与する。', cost: 1, level: 3, conditions: [{ type: 'affiliation', value: '月', count: 1 }, { type: 'role', value: '守護者', count: 2 }], effects: [{ type: 'BUFF_ALL_ROLE', roleCondition: '回復者', buffAttack: 2 }] }
        ]
    },
    sally: {
        id: 'sally',
        name: 'サリー',
        maxHp: 28,
        defense: 1,
        initialMp: 2,
        mpRegen: 4,
        equippedSkills: [
            { id: 'sally_skill_1', name: '星の祈り', description: '味方クリーチャー1体に、ライフ+1と攻撃力+1を付与する。', cost: 0, level: 1, conditions: [{ type: 'role', value: '守護者', count: 1 }], effects: [{ type: 'BUFF_TARGET_STATS', buffHp: 1, buffAttack: 1 }] },
            { id: 'sally_skill_2', name: '剣の舞', description: '敵クリーチャー全体に、2ダメージを与える。', cost: 1, level: 1, conditions: [{ type: 'role', value: '守護者', count: 1 }], effects: [{ type: 'DAMAGE_ALL_ENEMY', amount: 2 }] },
            { id: 'sally_skill_3', name: 'パラライズ', description: '敵クリーチャー1体を、相手のターン終了時まで、麻痺状態にする。', cost: 0, level: 1, conditions: [{ type: 'affiliation', value: '月', count: 1 }], effects: [{ type: 'PARALYZE_TARGET' }] },
            { id: 'sally_skill_4', name: '奇跡の舞', description: '味方クリーチャー全体をレベルアップさせる。', cost: 3, level: 2, conditions: [{ type: 'role', value: '守護者', count: 2 }], effects: [{ type: 'LEVEL_UP_ALL_ALLIES' }] },
            { id: 'sally_skill_5', name: 'テンプテーション', description: 'セット中の敵クリーチャー1体をランダムにサモンし、攻撃力-1を付与する。', cost: 1, level: 2, conditions: [{ type: 'affiliation', value: '月', count: 1 }, { type: 'role', value: '守護者', count: 2 }], effects: [{ type: 'SUMMON_RANDOM_ENEMY_RESERVED' }, { type: 'DEBUFF_TARGET_STATS', buffAttack: -1 }] },
            { id: 'sally_skill_6', name: '幻惑の光', description: '相手は、相手のターン終了時まで、相手の手札の全カードのコストが+1される。あなたの手札のクリーチャーのコストが-1される。', cost: 0, level: 2, conditions: [{ type: 'affiliation', value: '月', count: 1 }, { type: 'role', value: '守護者', count: 1 }], effects: [{ type: 'DEBUFF_ENEMY_HAND_COST', amount: 1 }, { type: 'BUFF_HAND_COST', amount: -1 }] },
            { id: 'sally_skill_7', name: '死星活性', description: '敵クリーチャー全体に、固定2ダメージを与え、相手のデッキ内のカードを上から1枚消滅させる。', cost: 1, level: 3, conditions: [{ type: 'affiliation', value: '月', count: 1 }, { type: 'role', value: '守護者', count: 3 }], effects: [{ type: 'FIXED_DAMAGE_ALL_ENEMY', amount: 2 }, { type: 'MILL_ENEMY_DECK', amount: 1 }] },
            { id: 'sally_skill_8', name: '刃の乱舞', description: '敵全体に、固定2ダメージを与え、あなたはMPを3得る。味方クリーチャー全体に、ライフ+1と攻撃力+1を付与する。', cost: 0, level: 3, conditions: [{ type: 'affiliation', value: '月', count: 1 }, { type: 'role', value: '守護者', count: 2 }], effects: [{ type: 'FIXED_DAMAGE_ALL_ENEMY', amount: 2 }, { type: 'GAIN_MP', amount: 3 }, { type: 'BUFF_ALL_ALLIES', buffHp: 1, buffAttack: 1 }] },
            { id: 'sally_skill_9', name: '星空煌光', description: '味方の未行動のクリーチャー全体に、2回行動を付与する。', cost: 5, level: 3, conditions: [{ type: 'affiliation', value: '月', count: 1 }, { type: 'role', value: '守護者', count: 2 }], effects: [{ type: 'BUFF_ALL_ALLIES', grantDoubleAction: true }] }
        ]
    },
    shikigami: {
        id: 'shikigami',
        name: 'シキガミ（四季神 葵）',
        maxHp: 29,
        defense: 0,
        initialMp: 4,
        mpRegen: 4,
        equippedSkills: [
            { id: 'shikigami_skill_1', name: '死霊復活', description: '死亡した味方の死霊術師タイプ1体を空いている場にランダムに蘇生する。', cost: 5, level: 1, conditions: [{ type: 'role', value: '死霊術師', count: 1 }], effects: [{ type: 'RESURRECT_RANDOM_ROLE', roleCondition: '死霊術師' }] },
            { id: 'shikigami_skill_2', name: '黒の波動', description: '敵1体に、2ダメージを与える。', cost: 0, level: 1, conditions: [{ type: 'role', value: '死霊術師', count: 1 }], effects: [{ type: 'DAMAGE_TARGET', amount: 2 }] },
            { id: 'shikigami_skill_3', name: 'ネガティブネットワーク', description: 'セット中の敵クリーチャー全体に、攻撃力-1を付与する。', cost: 0, level: 1, conditions: [{ type: 'affiliation', value: '月', count: 1 }], effects: [{ type: 'DEBUFF_ALL_ENEMY_RESERVED_STATS', buffAttack: -1 }] },
            { id: 'shikigami_skill_4', name: 'ブラックマジック', description: '相手のターン終了時まで、相手の手札のクリーチャーのコストが+2される。', cost: 0, level: 2, conditions: [{ type: 'affiliation', value: '月', count: 1 }, { type: 'role', value: '死霊術師', count: 1 }], effects: [{ type: 'DEBUFF_ENEMY_HAND_COST', amount: 2 }] },
            { id: 'shikigami_skill_5', name: '闇の波動', description: '敵全体に、3ダメージを与える。', cost: 1, level: 2, conditions: [{ type: 'affiliation', value: '月', count: 1 }, { type: 'role', value: '死霊術師', count: 1 }], effects: [{ type: 'DAMAGE_ALL_ENEMIES_AND_PLAYER', amount: 3 }] },
            { id: 'shikigami_skill_6', name: 'アンデッドコール', description: '死霊術師タイプのカードを1枚ドローする。あなたはMPを1得る。', cost: 0, level: 2, conditions: [{ type: 'affiliation', value: '月', count: 1 }, { type: 'role', value: '死霊術師', count: 1 }], effects: [{ type: 'DRAW_CARD_WITH_ROLE', roleCondition: '死霊術師' }, { type: 'GAIN_MP', amount: 1 }] },
            { id: 'shikigami_skill_7', name: 'ディストラクション', description: '相手のデッキ内のカードを上から2枚消滅させる。あなたのライフを2回復する。', cost: 0, level: 3, conditions: [{ type: 'affiliation', value: '月', count: 1 }, { type: 'role', value: '死霊術師', count: 2 }], effects: [{ type: 'MILL_ENEMY_DECK', amount: 2 }, { type: 'HEAL_PLAYER', amount: 2 }] },
            { id: 'shikigami_skill_8', name: '怨嗟の波動', description: '敵全体に、2ダメージを与え、味方の死霊術師タイプ全体に、このターンの間、攻撃力+2を付与する。', cost: 0, level: 3, conditions: [{ type: 'affiliation', value: '月', count: 1 }, { type: 'role', value: '死霊術師', count: 2 }], effects: [{ type: 'DAMAGE_ALL_ENEMIES_AND_PLAYER', amount: 2 }, { type: 'BUFF_ALL_ROLE', roleCondition: '死霊術師', buffAttack: 2 }] },
            { id: 'shikigami_skill_9', name: 'テラーウイルス', description: '相手の手札をランダムに1枚消滅させる。', cost: 2, level: 3, conditions: [{ type: 'affiliation', value: '月', count: 1 }, { type: 'role', value: '死霊術師', count: 2 }], effects: [{ type: 'DISCARD_RANDOM_ENEMY_HAND', amount: 1 }] }
        ],
    },
    honoka: {
        id: 'honoka',
        name: 'ホノカ（神道 ほのか）',
        maxHp: 19,
        defense: 2,
        initialMp: 4,
        mpRegen: 4,
        equippedSkills: [
            { id: 'honoka_skill_1', name: '火炎符', description: '敵1体に、2ダメージを与える。', cost: 0, level: 1, conditions: [{ type: 'affiliation', value: '星', count: 1 }], effects: [{ type: 'DAMAGE_TARGET', amount: 2 }] },
            { id: 'honoka_skill_2', name: '護身符', description: '味方の守護者タイプ1体に、シールドを付与する。', cost: 0, level: 1, conditions: [{ type: 'affiliation', value: '星', count: 1 }], effects: [{ type: 'BUFF_TARGET_STATS', targetType: '守護者', grantShield: true }] },
            { id: 'honoka_skill_3', name: '活命の法', description: '味方全体のライフを1回復する。', cost: 0, level: 1, conditions: [{ type: 'affiliation', value: '星', count: 1 }], effects: [{ type: 'HEAL_ALL_ALLY_MONSTERS', amount: 1 }] },
            { id: 'honoka_skill_4', name: '祈祷', description: 'カードを1枚ドローする。あなたの手札のクリーチャーのコストが-2される。', cost: 0, level: 2, conditions: [{ type: 'affiliation', value: '星', count: 2 }], effects: [{ type: 'DRAW_CARDS', amount: 1 }, { type: 'BUFF_HAND_COST', amount: -2 }] },
            { id: 'honoka_skill_5', name: '召喚阻止', description: 'セット中の敵クリーチャー1体を相手の手札に戻す。相手はそのクリーチャーの召喚コスト分のMPを得る。', cost: 2, level: 2, conditions: [{ type: 'affiliation', value: '星', count: 3 }], effects: [{ type: 'RETURN_ENEMY_TO_HAND_GIVE_MP' }] },
            { id: 'honoka_skill_6', name: '召雷符', description: '敵1体に、固定3ダメージを与える。', cost: 0, level: 2, conditions: [{ type: 'affiliation', value: '星', count: 2 }], effects: [{ type: 'FIXED_DAMAGE_TARGET', amount: 3 }] },
            { id: 'honoka_skill_7', name: '暴嵐符', description: 'セット中の敵クリーチャー全員をサモンし、敵全体に、固定2ダメージを与える。', cost: 2, level: 3, conditions: [{ type: 'affiliation', value: '星', count: 4 }], effects: [{ type: 'SUMMON_ALL_ENEMY_RESERVED' }, { type: 'FIXED_DAMAGE_ALL_ENEMY', amount: 2 }] },
            { id: 'honoka_skill_8', name: '金剛符', description: '味方クリーチャー全体に、シールドを付与する。味方の雲タイプ全体に、攻撃力＋1を付与する。', cost: 0, level: 3, conditions: [{ type: 'affiliation', value: '星', count: 3 }], effects: [{ type: 'BUFF_ALL_ALLIES', grantShield: true }, { type: 'BUFF_ALL_AFFILIATION', affiliationCondition: '雲', buffAttack: 1 }] },
            { id: 'honoka_skill_9', name: '退魔の波動', description: '敵1体に、固定5ダメージを与える。', cost: 0, level: 3, conditions: [{ type: 'affiliation', value: '星', count: 3 }], effects: [{ type: 'FIXED_DAMAGE_TARGET', amount: 5 }] }
        ]
    },
    leeria: {
        id: 'leeria',
        name: 'リーリア',
        maxHp: 24,
        defense: 1,
        initialMp: 4,
        mpRegen: 4,
        equippedSkills: [
            { id: 'leeria_skill_1', name: '風の刃', description: '敵1体に、固定2ダメージを与える。', cost: 1, level: 1, conditions: [{ type: 'role', value: '守護者', count: 1 }], effects: [{ type: 'FIXED_DAMAGE_TARGET', amount: 2 }] },
            { id: 'leeria_skill_2', name: '平手打ち', description: '敵1体に、2ダメージを与える。', cost: 0, level: 1, conditions: [{ type: 'role', value: '守護者', count: 1 }], effects: [{ type: 'DAMAGE_TARGET', amount: 2 }] },
            { id: 'leeria_skill_3', name: '風の加護', description: 'あなたはMPを1得る。', cost: 0, level: 1, conditions: [{ type: 'role', value: '魔術師', count: 1 }], effects: [{ type: 'GAIN_MP', amount: 1 }] },
            { id: 'leeria_skill_4', name: '豊穣の守り', description: '味方クリーチャー1体に、ライフ+1とシールドを付与する。', cost: 0, level: 2, conditions: [{ type: 'role', value: '守護者', count: 1 }, { type: 'role', value: '魔術師', count: 1 }], effects: [{ type: 'BUFF_TARGET_STATS', buffHp: 1, grantShield: true }] },
            { id: 'leeria_skill_5', name: '清廉の調べ', description: '味方クリーチャー全体に、ライフ+2を付与する。', cost: 1, level: 2, conditions: [{ type: 'role', value: '守護者', count: 2 }, { type: 'role', value: '魔術師', count: 1 }], effects: [{ type: 'BUFF_ALL_ALLIES', buffHp: 2 }] },
            { id: 'leeria_skill_6', name: '乙女の祈り', description: 'カードを2枚ドローする。味方全体のライフを1回復する。', cost: 0, level: 2, conditions: [{ type: 'role', value: '守護者', count: 2 }], effects: [{ type: 'DRAW_CARDS', amount: 2 }, { type: 'HEAL_ALL_ALLY_MONSTERS', amount: 1 }] },
            { id: 'leeria_skill_7', name: '大地の波動', description: '敵全体に、固定1ダメージを与え、味方クリーチャー全体に、攻撃力+2を付与する。', cost: 2, level: 3, conditions: [{ type: 'role', value: '守護者', count: 3 }, { type: 'role', value: '魔術師', count: 1 }], effects: [{ type: 'FIXED_DAMAGE_ALL_ENEMY', amount: 1 }, { type: 'BUFF_ALL_ALLIES', buffAttack: 2 }] },
            { id: 'leeria_skill_8', name: '怒りの暴風', description: '敵全体に、固定4ダメージを与える。あなたはMPを2得る。', cost: 0, level: 3, conditions: [{ type: 'role', value: '守護者', count: 3 }], effects: [{ type: 'FIXED_DAMAGE_ALL_ENEMY', amount: 4 }, { type: 'GAIN_MP', amount: 2 }] },
            { id: 'leeria_skill_9', name: '生命の息吹', description: '味方クリーチャー全体に、ライフ+1と攻撃力+1を付与する。', cost: 0, level: 3, conditions: [{ type: 'role', value: '守護者', count: 3 }, { type: 'role', value: '魔術師', count: 1 }], effects: [{ type: 'BUFF_ALL_ALLIES', buffHp: 1, buffAttack: 1 }] }
        ]
    },
    gameira: {
        id: 'gameira',
        name: 'ガメイラ',
        maxHp: 20,
        defense: 2,
        initialMp: 3,
        mpRegen: 4,
        equippedSkills: [
            { id: 'gameira_skill_1', name: '竜の爪', description: '敵1体に、3ダメージを与える。', cost: 1, level: 1, conditions: [{ type: 'role', value: '剣士', count: 1 }], effects: [{ type: 'DAMAGE_TARGET', amount: 3 }] },
            { id: 'gameira_skill_2', name: 'フレア', description: '敵1体に、7ダメージを与える。', cost: 7, level: 1, conditions: [{ type: 'role', value: '剣士', count: 1 }], effects: [{ type: 'DAMAGE_TARGET', amount: 7 }] },
            { id: 'gameira_skill_3', name: '号令', description: 'セット中のクリーチャー1体をサモンする。', cost: 2, level: 1, conditions: [{ type: 'role', value: '剣士', count: 1 }], effects: [{ type: 'SUMMON_TARGET' }] },
            { id: 'gameira_skill_4', name: 'ドラゴンアイ', description: '相手能力者は、相手のターン終了時まで、スキルを使用できなくなる。', cost: 1, level: 2, conditions: [{ type: 'role', value: '剣士', count: 2 }], effects: [{ type: 'SEAL_ENEMY_SKILL' }] },
            { id: 'gameira_skill_5', name: 'ドラゴンオーラ', description: '相手のターン終了時まで、相手の手札の全カードのコストが+1される。あなたの手札の剣士タイプのコストが-1される。', cost: 0, level: 2, conditions: [{ type: 'role', value: '剣士', count: 2 }], effects: [{ type: 'DEBUFF_ENEMY_HAND_COST', amount: 1 }, { type: 'BUFF_HAND_COST_BY_TYPE', targetType: '剣士', amount: -1 }] },
            { id: 'gameira_skill_6', name: '招集', description: '剣士タイプのカードを1枚ドローする。狩人タイプのカードを1枚ドローする。あなたの手札のクリーチャーのコストが-1される。', cost: 0, level: 2, conditions: [{ type: 'role', value: '剣士', count: 2 }], effects: [{ type: 'DRAW_CARD_WITH_ROLE', roleCondition: '剣士' }, { type: 'DRAW_CARD_WITH_ROLE', roleCondition: '狩人' }, { type: 'BUFF_HAND_COST', amount: -1 }] },
            { id: 'gameira_skill_7', name: 'ドラゴンブレス', description: '敵全体に、6ダメージを与える。相手はMPを3失う。', cost: 0, level: 3, conditions: [{ type: 'role', value: '剣士', count: 3 }], effects: [{ type: 'DAMAGE_ALL_ENEMY', amount: 6 }, { type: 'BURN_ENEMY_MP', amount: 3 }] },
            { id: 'gameira_skill_8', name: '女王のおたけび', description: '味方クリーチャー全体に、ライフ+1と攻撃力+2を付与する。', cost: 2, level: 3, conditions: [{ type: 'role', value: '剣士', count: 4 }], effects: [{ type: 'BUFF_ALL_ALLIES', buffHp: 1, buffAttack: 2 }] },
            { id: 'gameira_skill_9', name: 'レイジオブドラゴン', description: '敵1体に、あなたの墓地にある剣士タイプの枚数分のダメージを与える。あなたはMPを2得る。', cost: 1, level: 3, conditions: [{ type: 'role', value: '剣士', count: 3 }], effects: [{ type: 'DAMAGE_TARGET_BY_GRAVEYARD', targetType: '剣士' }, { type: 'GAIN_MP', amount: 2 }] }
        ]
    },
    ruruna: {
        id: 'ruruna',
        name: 'ルルナ',
        maxHp: 25,
        defense: 1,
        initialMp: 1,
        mpRegen: 5,
        equippedSkills: [
            { id: 'ruruna_skill_1', name: 'ひっかき', description: '敵1体に、3ダメージを与える。', cost: 1, level: 1, conditions: [{ type: 'role', value: '狩人', count: 1 }], effects: [{ type: 'DAMAGE_TARGET', amount: 3 }] },
            { id: 'ruruna_skill_2', name: '獣の絆', description: '味方の狩人タイプ1体に、攻撃力+1、ライフ+1とマジックターゲットを付与する。', cost: 1, level: 1, conditions: [{ type: 'role', value: '狩人', count: 1 }], effects: [{ type: 'BUFF_TARGET_STATS', targetType: '狩人', buffAttack: 1, buffHp: 1, grantMagicTarget: true }] },
            { id: 'ruruna_skill_3', name: 'おすわり！', description: '味方クリーチャー1体に、ステルスを付与する。', cost: 1, level: 1, conditions: [{ type: 'role', value: '狩人', count: 1 }], effects: [{ type: 'GRANT_STEALTH_TARGET' }] },
            { id: 'ruruna_skill_4', name: '獣の呼び声', description: 'カードを1枚ドローし、そのカードがコスト4以下の狩人タイプだった場合、セットする。', cost: 1, level: 2, conditions: [{ type: 'role', value: '狩人', count: 3 }], effects: [{ type: 'DRAW_AND_SET_ROLE_CONDITIONAL', roleCondition: '狩人', maxCostCondition: 4 }] },
            { id: 'ruruna_skill_5', name: 'レオファング', description: '敵1体に、固定4ダメージを与える。', cost: 0, level: 2, conditions: [{ type: 'role', value: '狩人', count: 3 }], effects: [{ type: 'FIXED_DAMAGE_TARGET', amount: 4 }] },
            { id: 'ruruna_skill_6', name: '森からの刺客', description: 'セット中の敵クリーチャー1体をサモンし、1ダメージを与える。', cost: 3, level: 2, conditions: [{ type: 'role', value: '狩人', count: 3 }], effects: [{ type: 'SUMMON_ENEMY_TARGET' }, { type: 'DAMAGE_TARGET', amount: 1 }] },
            { id: 'ruruna_skill_7', name: '野生の力', description: '味方の狩人タイプ全体に、ライフ+2と攻撃力+1を付与する。', cost: 1, level: 3, conditions: [{ type: 'role', value: '狩人', count: 3 }], effects: [{ type: 'BUFF_ALL_ROLE', roleCondition: '狩人', buffHp: 2, buffAttack: 1 }] },
            { id: 'ruruna_skill_8', name: 'にゃるてぃめっとふぁんぐ', description: '相手能力者に固定5ダメージを与え、ランダムな敵クリーチャー1体を相手のターン終了時まで麻痺状態にする。', cost: 3, level: 3, conditions: [{ type: 'role', value: '狩人', count: 3 }], effects: [{ type: 'HONOUR_DAMAGE_TARGET', amount: 5 }, { type: 'PARALYZE_RANDOM_ENEMY' }] },
            { id: 'ruruna_skill_9', name: 'じゃれつく', description: '味方の月タイプ全体に挑発を付与する。味方の雲タイプ全体に攻撃力+2を付与する。', cost: 1, level: 3, conditions: [{ type: 'role', value: '狩人', count: 3 }, { type: 'affiliation', value: '雲', count: 1 }], effects: [{ type: 'BUFF_ALL_AFFILIATION', affiliationCondition: '月', grantTaunt: true }, { type: 'BUFF_ALL_AFFILIATION', affiliationCondition: '雲', buffAttack: 2 }] }
        ]
    }
};
