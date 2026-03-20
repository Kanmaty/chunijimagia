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
                description: '敵1体に3ダメージを与える。',
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
        name: 'ベータ',
        maxHp: 30,
        defense: 0,
        initialMp: 3,
        mpRegen: 4,
        equippedSkills: [
            {
                id: 'zeta_skill_1',
                name: '返り血',
                description: '自身に固定2ダメージを与え、敵1体に4ダメージを与える。',
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
                name: '鼓舞',
                description: 'ターン終了時まで、手札の剣士タイプのコストが-1され、CPを1得る',
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
                name: '懺悔',
                description: '自身のモンスター1体に固定1ダメージを与え、ターン終了まで攻撃力を+2する。',
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
                name: '切腹',
                description: '自身に固定3ダメージを与え、敵1体に5ダメージを与える。',
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
                name: '特攻',
                description: '自身に固定1ダメージを与え、ターン終了まで自身の剣士タイプ全体の攻撃力を+2する。',
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
                name: '揺動',
                description: '予約中の敵のモンスター1体を召喚する。',
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
                name: '腹切りFUJIYAMA',
                description: '自身に固定1ダメージを与え、敵1体に6ダメージを与える。',
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
                name: '武将の心得',
                description: '自身の剣士タイプ全体の体力と攻撃力を+1する。CPを1得る。',
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
                name: '鎮魂歌',
                description: '敵1体に自身の墓地にある月タイプの枚数分のダメージを与える。CPを1得る。',
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
        name: 'カイン',
        maxHp: 28,
        defense: 1,
        initialMp: 2,
        mpRegen: 4,
        equippedSkills: [
            {
                id: 'karin_skill_1',
                name: '手刀',
                description: '敵1体に2ダメージを与える。',
                cost: 0,
                level: 1,
                conditions: [{ type: 'role', value: '守護者', count: 1 }],
                effects: [{ type: 'DAMAGE_TARGET', amount: 2 }]
            },
            {
                id: 'karin_skill_2',
                name: '串刺し',
                description: '敵1体に固定2ダメージを与える。',
                cost: 1,
                level: 1,
                conditions: [{ type: 'role', value: '守護者', count: 1 }],
                effects: [{ type: 'FIXED_DAMAGE_TARGET', amount: 2 }]
            },
            {
                id: 'karin_skill_3',
                name: '集中',
                description: 'CPを1得る。',
                cost: 0,
                level: 1,
                conditions: [{ type: 'role', value: '守護者', count: 1 }],
                effects: [{ type: 'GAIN_MP', amount: 1 }]
            },
            {
                id: 'karin_skill_4',
                name: '抜刀',
                description: '敵モンスター全体に固定2ダメージを与える。',
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
                name: '電光石火',
                description: 'ランダムな敵モンスター1体を破壊する。',
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
                name: '斬撃',
                description: '敵1体に固定4ダメージを与える。',
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
                name: '大回転斬り',
                description: '敵1体に4ダメージを与え、敵モンスター全体に1ダメージを与える。CPを2得る。',
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
                name: '勝負',
                description: '自身の守護者タイプ全体の攻撃力を+2する。',
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
                name: '居合切り',
                description: '敵1体に固定5ダメージを与える。',
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
        name: 'イェレナ',
        maxHp: 18,
        defense: 2,
        initialMp: 1,
        mpRegen: 5,
        equippedSkills: [
            {
                id: 'elena_skill_1',
                name: '毒針',
                description: '敵1体に2ダメージを与える。',
                cost: 0,
                level: 1,
                conditions: [{ type: 'role', value: '暗殺者', count: 1 }],
                effects: [{ type: 'DAMAGE_TARGET', amount: 2 }]
            },
            {
                id: 'elena_skill_2',
                name: 'トリック',
                description: '場の予約中のモンスター1体を召喚する。',
                cost: 4,
                level: 1,
                conditions: [{ type: 'affiliation', value: '雲', count: 1 }],
                effects: [{ type: 'SUMMON_TARGET' }]
            },
            {
                id: 'elena_skill_3',
                name: '媚薬',
                description: 'ターン終了まで、自身の星タイプのモンスター1体の攻撃力を+2する。',
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
                name: 'クスリ',
                description: '自身のモンスター1体のライフを+2し、挑発を付与する。',
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
                name: '闇堕ち薬',
                description: '味方のモンスター1体に潜伏を付与する。',
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
                name: 'バイブス',
                description: '味方モンスター全体の攻撃力を+1する。',
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
                name: 'tウイルス',
                description: '自身の狩人タイプ全体の体力を+2し、挑発を付与する。',
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
                name: '刺激ガス',
                description: '敵全体に固定3ダメージを与える。',
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
                name: 'MDMA',
                description: '自身の暗殺者タイプ全体の攻撃力を+2する。',
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
        name: 'ナイサー',
        maxHp: 30,
        defense: 0,
        initialMp: 3,
        mpRegen: 4,
        equippedSkills: [
            { id: 'raizer_skill_1', name: 'パンチ', description: '敵1体に3ダメージを与える。', cost: 1, level: 1, conditions: [{ type: 'role', value: '狩人', count: 1 }], effects: [{ type: 'DAMAGE_TARGET', amount: 3 }] },
            { id: 'raizer_skill_2', name: 'ブロック', description: '自身の錬金術師タイプ1体に盾を付与する。', cost: 0, level: 1, conditions: [{ type: 'role', value: '錬金術師', count: 1 }], effects: [{ type: 'BUFF_TARGET_STATS', targetType: '錬金術師', grantShield: true }] },
            { id: 'raizer_skill_3', name: 'ファイティンググローブ', description: '自身のモンスター1体のライフと攻撃力を+1する。', cost: 0, level: 1, conditions: [{ type: 'role', value: '狩人', count: 1 }], effects: [{ type: 'BUFF_TARGET_STATS', buffHp: 1, buffAttack: 1 }] },
            { id: 'raizer_skill_4', name: '掴み', description: '場の予約中のモンスター1体を召喚し、相手のターン終了時まで、攻撃力を+1する。', cost: 2, level: 2, conditions: [{ type: 'role', value: '狩人', count: 2 }], effects: [{ type: 'SUMMON_TARGET' }, { type: 'BUFF_TARGET_STATS', buffAttack: 1 }] },
            { id: 'raizer_skill_5', name: '逆鱗', description: '自身に固定1ダメージを与え、相手モンスター全体に固定2ダメージを与える。', cost: 0, level: 2, conditions: [{ type: 'affiliation', value: '月', count: 1 }], effects: [{ type: 'DAMAGE_PLAYER', amount: 1 }, { type: 'FIXED_DAMAGE_ALL_ENEMY', amount: 2 }] },
            { id: 'raizer_skill_6', name: '給水', description: 'カードを2枚ドローする。CPを1得る。', cost: 0, level: 2, conditions: [{ type: 'role', value: '錬金術師', count: 1 }], effects: [{ type: 'DRAW_CARDS', amount: 2 }, { type: 'GAIN_MP', amount: 1 }] },
            { id: 'raizer_skill_7', name: '叩き割り', description: '相手1体に固定5ダメージを与える。CPを2得る。', cost: 0, level: 3, conditions: [{ type: 'affiliation', value: '月', count: 1 }, { type: 'role', value: '狩人', count: 2 }], effects: [{ type: 'FIXED_DAMAGE_TARGET', amount: 5 }, { type: 'GAIN_MP', amount: 2 }] },
            { id: 'raizer_skill_8', name: '精力吸い', description: '相手全体に3ダメージを与える。自身の体力を1回復する。CPを1得る。', cost: 0, level: 3, conditions: [{ type: 'affiliation', value: '月', count: 2 }], effects: [{ type: 'DAMAGE_ALL_ENEMIES_AND_PLAYER', amount: 3 }, { type: 'HEAL_PLAYER', amount: 1 }, { type: 'GAIN_MP', amount: 1 }] },
            { id: 'raizer_skill_9', name: 'タイマン', description: '相手能力者に固定4ダメージを与える。相手能力者は相手のターン終了時まで、チュニジアンスキルを使用できなくなる。', cost: 0, level: 3, conditions: [{ type: 'role', value: '錬金術師', count: 2 }], effects: [{ type: 'HONOUR_DAMAGE_TARGET', amount: 4 }, { type: 'SEAL_ENEMY_SKILL' }] }
        ]
    },
    leo: {
        id: 'leo',
        name: 'テオ',
        maxHp: 24,
        defense: 1,
        initialMp: 3,
        mpRegen: 4,
        equippedSkills: [
            { id: 'leo_skill_1', name: 'ナイフ', description: '相手1体に3ダメージを与える。', cost: 1, level: 1, conditions: [{ type: 'role', value: '守護者', count: 1 }], effects: [{ type: 'DAMAGE_TARGET', amount: 3 }] },
            { id: 'leo_skill_2', name: '奪取', description: '相手のCPを1奪う。', cost: 0, level: 1, conditions: [{ type: 'role', value: '守護者', count: 1 }], effects: [{ type: 'STEAL_MP', amount: 1 }] },
            { id: 'leo_skill_3', name: '強心臓', description: '自身の初期体力を+3する。', cost: 0, level: 1, conditions: [], effects: [{ type: 'AUTO_LIFE_BOOST', amount: 3 }] },
            { id: 'leo_skill_4', name: '有給', description: '自身の体力を1回復する。CPを1得る。', cost: 0, level: 2, conditions: [{ type: 'affiliation', value: '月', count: 1 }, { type: 'role', value: '回復者', count: 1 }], effects: [{ type: 'HEAL_PLAYER', amount: 1 }, { type: 'GAIN_MP', amount: 1 }] },
            { id: 'leo_skill_5', name: '暗殺', description: '予約状態のランダムな相手モンスター1体を破壊する。', cost: 4, level: 2, conditions: [{ type: 'role', value: '守護者', count: 3 }], effects: [{ type: 'INSTANT_KILL_RANDOM_RESERVED_ENEMY' }] },
            { id: 'leo_skill_6', name: '通報', description: 'ランダムな相手モンスター1体を手札に戻す。', cost: 2, level: 2, conditions: [{ type: 'affiliation', value: '月', count: 2 }, { type: 'role', value: '回復者', count: 1 }], effects: [{ type: 'RETURN_ENEMY_TO_HAND' }] },
            { id: 'leo_skill_7', name: '乱射', description: 'ランダムな相手に固定1ダメージを4回与える。CPを2得る。', cost: 0, level: 3, conditions: [{ type: 'affiliation', value: '月', count: 1 }, { type: 'role', value: '守護者', count: 2 }], effects: [{ type: 'RANDOM_FIXED_DAMAGE_MULTIPLE', amount: 1, hitCount: 4 }, { type: 'GAIN_MP', amount: 2 }] },
            { id: 'leo_skill_8', name: 'スナイプ', description: '相手1体に固定6ダメージを与える。', cost: 2, level: 3, conditions: [{ type: 'affiliation', value: '月', count: 1 }, { type: 'role', value: '守護者', count: 2 }], effects: [{ type: 'FIXED_DAMAGE_TARGET', amount: 6 }] },
            { id: 'leo_skill_9', name: '賄賂', description: '自身の回復者タイプ全体の攻撃力を+2する。', cost: 1, level: 3, conditions: [{ type: 'affiliation', value: '月', count: 1 }, { type: 'role', value: '守護者', count: 2 }], effects: [{ type: 'BUFF_ALL_ROLE', roleCondition: '回復者', buffAttack: 2 }] }
        ]
    },
    sally: {
        id: 'sally',
        name: 'カリー',
        maxHp: 28,
        defense: 1,
        initialMp: 2,
        mpRegen: 4,
        equippedSkills: [
            { id: 'sally_skill_1', name: '着付け', description: '自身のモンスター1体の体力と攻撃力を+1する。', cost: 0, level: 1, conditions: [{ type: 'role', value: '守護者', count: 1 }], effects: [{ type: 'BUFF_TARGET_STATS', buffHp: 1, buffAttack: 1 }] },
            { id: 'sally_skill_2', name: '花吹雪', description: '敵モンスター全体に2ダメージを与える。', cost: 1, level: 1, conditions: [{ type: 'role', value: '守護者', count: 1 }], effects: [{ type: 'DAMAGE_ALL_ENEMY', amount: 2 }] },
            { id: 'sally_skill_3', name: '誘惑', description: '相手のターン終了まで、敵クリーチャー1体を麻痺状態にする。', cost: 0, level: 1, conditions: [{ type: 'affiliation', value: '月', count: 1 }], effects: [{ type: 'PARALYZE_TARGET' }] },
            { id: 'sally_skill_4', name: '叱咤激励', description: '味方のクリーチャー全体をレベルアップさせる。', cost: 3, level: 2, conditions: [{ type: 'role', value: '守護者', count: 2 }], effects: [{ type: 'LEVEL_UP_ALL_ALLIES' }] },
            { id: 'sally_skill_5', name: '酔拳', description: 'セット中の敵クリーチャー1体をランダムに召喚し、攻撃力を-1する。', cost: 1, level: 2, conditions: [{ type: 'affiliation', value: '月', count: 1 }, { type: 'role', value: '守護者', count: 2 }], effects: [{ type: 'SUMMON_RANDOM_ENEMY_RESERVED' }, { type: 'DEBUFF_TARGET_STATS', buffAttack: -1 }] },
            { id: 'sally_skill_6', name: '繁忙', description: '相手のターン終了時まで、相手の手札の全カードのコストを+1し、自身の手札のクリーチャーのコストを-1する。', cost: 0, level: 2, conditions: [{ type: 'affiliation', value: '月', count: 1 }, { type: 'role', value: '守護者', count: 1 }], effects: [{ type: 'DEBUFF_ENEMY_HAND_COST', amount: 1 }, { type: 'BUFF_HAND_COST', amount: -1 }] },
            { id: 'sally_skill_7', name: '狂乱', description: '敵クリーチャー全体に、固定2ダメージを与える。相手のデッキからランダムにカードを1枚墓地に送る。', cost: 1, level: 3, conditions: [{ type: 'affiliation', value: '月', count: 1 }, { type: 'role', value: '守護者', count: 3 }], effects: [{ type: 'FIXED_DAMAGE_ALL_ENEMY', amount: 2 }, { type: 'MILL_ENEMY_DECK', amount: 1 }] },
            { id: 'sally_skill_8', name: '大宴', description: '敵全体に固定2ダメージを与える。CPを3得る。自身のクリーチャー全体の体力と攻撃力を+1する。', cost: 0, level: 3, conditions: [{ type: 'affiliation', value: '月', count: 1 }, { type: 'role', value: '守護者', count: 2 }], effects: [{ type: 'FIXED_DAMAGE_ALL_ENEMY', amount: 2 }, { type: 'GAIN_MP', amount: 3 }, { type: 'BUFF_ALL_ALLIES', buffHp: 1, buffAttack: 1 }] },
            { id: 'sally_skill_9', name: '稽古', description: '自身のクリーチャー全体に2回行動を付与する。', cost: 5, level: 3, conditions: [{ type: 'affiliation', value: '月', count: 1 }, { type: 'role', value: '守護者', count: 2 }], effects: [{ type: 'BUFF_ALL_ALLIES', grantDoubleAction: true }] }
        ]
    },
    shikigami: {
        id: 'shikigami',
        name: 'シキダミ',
        maxHp: 29,
        defense: 0,
        initialMp: 4,
        mpRegen: 4,
        equippedSkills: [
            { id: 'shikigami_skill_1', name: '死者蘇生', description: '墓地の死霊術師タイプ1体を空いている場にランダムに復活させる。', cost: 5, level: 1, conditions: [{ type: 'role', value: '死霊術師', count: 1 }], effects: [{ type: 'RESURRECT_RANDOM_ROLE', roleCondition: '死霊術師' }] },
            { id: 'shikigami_skill_2', name: 'シャドーボール', description: '敵1体に2ダメージを与える。', cost: 0, level: 1, conditions: [{ type: 'role', value: '死霊術師', count: 1 }], effects: [{ type: 'DAMAGE_TARGET', amount: 2 }] },
            { id: 'shikigami_skill_3', name: '盛り下げる', description: 'セット中の敵クリーチャー全体の攻撃力を-1する。', cost: 0, level: 1, conditions: [{ type: 'affiliation', value: '月', count: 1 }], effects: [{ type: 'DEBUFF_ALL_ENEMY_RESERVED_STATS', buffAttack: -1 }] },
            { id: 'shikigami_skill_4', name: 'プラスウルトラ', description: '相手のターン終了時まで、相手の手札のクリーチャーのコストが+2される。', cost: 0, level: 2, conditions: [{ type: 'affiliation', value: '月', count: 1 }, { type: 'role', value: '死霊術師', count: 1 }], effects: [{ type: 'DEBUFF_ENEMY_HAND_COST', amount: 2 }] },
            { id: 'shikigami_skill_5', name: '黒霧', description: '敵全体に3ダメージを与える。', cost: 1, level: 2, conditions: [{ type: 'affiliation', value: '月', count: 1 }, { type: 'role', value: '死霊術師', count: 1 }], effects: [{ type: 'DAMAGE_ALL_ENEMIES_AND_PLAYER', amount: 3 }] },
            { id: 'shikigami_skill_6', name: 'ディスティニードロー', description: '死霊術師タイプのモンスターを1枚ドローする。CPを1得る。', cost: 0, level: 2, conditions: [{ type: 'affiliation', value: '月', count: 1 }, { type: 'role', value: '死霊術師', count: 1 }], effects: [{ type: 'DRAW_CARD_WITH_ROLE', roleCondition: '死霊術師' }, { type: 'GAIN_MP', amount: 1 }] },
            { id: 'shikigami_skill_7', name: '拉致問題', description: '相手のデッキからランダムにカードを2枚墓地に送る。自身の体力を2回復する。', cost: 0, level: 3, conditions: [{ type: 'affiliation', value: '月', count: 1 }, { type: 'role', value: '死霊術師', count: 2 }], effects: [{ type: 'MILL_ENEMY_DECK', amount: 2 }, { type: 'HEAL_PLAYER', amount: 2 }] },
            { id: 'shikigami_skill_8', name: '無茶苦茶', description: '敵全体に2ダメージを与える。ターン終了まで、自身の死霊術師タイプ全体の攻撃力を+2する。', cost: 0, level: 3, conditions: [{ type: 'affiliation', value: '月', count: 1 }, { type: 'role', value: '死霊術師', count: 2 }], effects: [{ type: 'DAMAGE_ALL_ENEMIES_AND_PLAYER', amount: 2 }, { type: 'BUFF_ALL_ROLE', roleCondition: '死霊術師', buffAttack: 2 }] },
            { id: 'shikigami_skill_9', name: 'ババ抜き', description: '相手の手札をランダムに1枚墓地に送る。', cost: 2, level: 3, conditions: [{ type: 'affiliation', value: '月', count: 1 }, { type: 'role', value: '死霊術師', count: 2 }], effects: [{ type: 'DISCARD_RANDOM_ENEMY_HAND', amount: 1 }] }
        ],
    },
    honoka: {
        id: 'honoka',
        name: 'ホソカ',
        maxHp: 19,
        defense: 2,
        initialMp: 4,
        mpRegen: 4,
        equippedSkills: [
            { id: 'honoka_skill_1', name: 'キラキラリン', description: '敵1体に2ダメージを与える。', cost: 0, level: 1, conditions: [{ type: 'affiliation', value: '星', count: 1 }], effects: [{ type: 'DAMAGE_TARGET', amount: 2 }] },
            { id: 'honoka_skill_2', name: '社会的法律のベール', description: '自身の守護者タイプ1体にシールドを付与する。', cost: 0, level: 1, conditions: [{ type: 'affiliation', value: '星', count: 1 }], effects: [{ type: 'BUFF_TARGET_STATS', targetType: '守護者', grantShield: true }] },
            { id: 'honoka_skill_3', name: '目の保養', description: '自身全体の体力を1回復する。', cost: 0, level: 1, conditions: [{ type: 'affiliation', value: '星', count: 1 }], effects: [{ type: 'HEAL_ALL_ALLY_MONSTERS', amount: 1 }] },
            { id: 'honoka_skill_4', name: 'パパ活', description: 'カードを1枚ドローする。手札のクリーチャーのコストが-2される。', cost: 0, level: 2, conditions: [{ type: 'affiliation', value: '星', count: 2 }], effects: [{ type: 'DRAW_CARDS', amount: 1 }, { type: 'BUFF_HAND_COST', amount: -2 }] },
            { id: 'honoka_skill_5', name: '門限', description: 'セット中の敵クリーチャー1体を相手の手札に戻す。相手はそのクリーチャーのコスト分のCPを得る。', cost: 2, level: 2, conditions: [{ type: 'affiliation', value: '星', count: 3 }], effects: [{ type: 'RETURN_ENEMY_TO_HAND_GIVE_MP' }] },
            { id: 'honoka_skill_6', name: 'シールコレクション', description: '敵1体に固定3ダメージを与える。', cost: 0, level: 2, conditions: [{ type: 'affiliation', value: '星', count: 2 }], effects: [{ type: 'FIXED_DAMAGE_TARGET', amount: 3 }] },
            { id: 'honoka_skill_7', name: '魅惑の一撃', description: 'セット中の敵クリーチャー全員をサモンし、敵全体に固定2ダメージを与える。', cost: 2, level: 3, conditions: [{ type: 'affiliation', value: '星', count: 4 }], effects: [{ type: 'SUMMON_ALL_ENEMY_RESERVED' }, { type: 'FIXED_DAMAGE_ALL_ENEMY', amount: 2 }] },
            { id: 'honoka_skill_8', name: '頑張れ♪', description: '味方クリーチャー全体にシールドを付与する。味方の雲タイプ全体の攻撃力を+1をする。', cost: 0, level: 3, conditions: [{ type: 'affiliation', value: '星', count: 3 }], effects: [{ type: 'BUFF_ALL_ALLIES', grantShield: true }, { type: 'BUFF_ALL_AFFILIATION', affiliationCondition: '雲', buffAttack: 1 }] },
            { id: 'honoka_skill_9', name: '盛り髪', description: '敵1体に固定5ダメージを与える。', cost: 0, level: 3, conditions: [{ type: 'affiliation', value: '星', count: 3 }], effects: [{ type: 'FIXED_DAMAGE_TARGET', amount: 5 }] }
        ]
    },
    leeria: {
        id: 'leeria',
        name: 'リーシア',
        maxHp: 24,
        defense: 1,
        initialMp: 4,
        mpRegen: 4,
        equippedSkills: [
            { id: 'leeria_skill_1', name: '桑で殴る', description: '敵1体に固定2ダメージを与える。', cost: 1, level: 1, conditions: [{ type: 'role', value: '守護者', count: 1 }], effects: [{ type: 'FIXED_DAMAGE_TARGET', amount: 2 }] },
            { id: 'leeria_skill_2', name: 'スコップで殴る', description: '敵1体に2ダメージを与える。', cost: 0, level: 1, conditions: [{ type: 'role', value: '守護者', count: 1 }], effects: [{ type: 'DAMAGE_TARGET', amount: 2 }] },
            { id: 'leeria_skill_3', name: '耕す', description: 'CPを1得る。', cost: 0, level: 1, conditions: [{ type: 'role', value: '魔術師', count: 1 }], effects: [{ type: 'GAIN_MP', amount: 1 }] },
            { id: 'leeria_skill_4', name: '採れたてフレッシュ', description: '味方クリーチャー1体の体力を+1し、シールドを付与する。', cost: 0, level: 2, conditions: [{ type: 'role', value: '守護者', count: 1 }, { type: 'role', value: '魔術師', count: 1 }], effects: [{ type: 'BUFF_TARGET_STATS', buffHp: 1, grantShield: true }] },
            { id: 'leeria_skill_5', name: '豊作の恩恵', description: '味方クリーチャー全体の体力を+2する。', cost: 1, level: 2, conditions: [{ type: 'role', value: '守護者', count: 2 }, { type: 'role', value: '魔術師', count: 1 }], effects: [{ type: 'BUFF_ALL_ALLIES', buffHp: 2 }] },
            { id: 'leeria_skill_6', name: '豊作祈願', description: 'カードを2枚ドローする。味方全体の体力を1回復する。', cost: 0, level: 2, conditions: [{ type: 'role', value: '守護者', count: 2 }], effects: [{ type: 'DRAW_CARDS', amount: 2 }, { type: 'HEAL_ALL_ALLY_MONSTERS', amount: 1 }] },
            { id: 'leeria_skill_7', name: '農家ズ', description: '敵全体に固定1ダメージを与える。味方クリーチャー全体の攻撃力を+2する。', cost: 2, level: 3, conditions: [{ type: 'role', value: '守護者', count: 3 }, { type: 'role', value: '魔術師', count: 1 }], effects: [{ type: 'FIXED_DAMAGE_ALL_ENEMY', amount: 1 }, { type: 'BUFF_ALL_ALLIES', buffAttack: 2 }] },
            { id: 'leeria_skill_8', name: '大量収穫', description: '敵全体に固定4ダメージを与える。CPを2得る。', cost: 0, level: 3, conditions: [{ type: 'role', value: '守護者', count: 3 }], effects: [{ type: 'FIXED_DAMAGE_ALL_ENEMY', amount: 4 }, { type: 'GAIN_MP', amount: 2 }] },
            { id: 'leeria_skill_9', name: '', description: '味方クリーチャー全体に、ライフ+1と攻撃力+1を付与する。', cost: 0, level: 3, conditions: [{ type: 'role', value: '守護者', count: 3 }, { type: 'role', value: '魔術師', count: 1 }], effects: [{ type: 'BUFF_ALL_ALLIES', buffHp: 1, buffAttack: 1 }] }
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
