// チュニジマギアの基本的な型定義

export type CardType = 'monster' | 'magic';

// 所属 (Affiliation)
export type Affiliation = '雲' | '太陽' | '月' | '星' | '無し';

// ロール (Role)
export type Role = '守護者' | '剣士' | '狩人' | '回復者' | '魔術師' | '錬金術師' | '暗殺者' | '死霊術師' | '無し';

// 盤面上のカードの状態
export type BoardSummonState = 'reserve' | 'summon'; // reserve: 予約, summon: 召喚

// 効果（アビリティ）の種類を表す識別子
export type EffectType =
    | 'SUMMON_TARGET'         // 対象の予約状態カードを召喚する
    | 'DAMAGE_ALL_ENEMY'      // 敵の全モンスターにダメージ
    | 'DAMAGE_TARGET'         // 敵の特定のモンスターまたはプレイヤーにダメージ
    | 'FIXED_DAMAGE_TARGET'   // 敵の特定のモンスターまたはプレイヤーに固定ダメージ（防御力やシールド無視等）
    | 'SPAWN_MONSTER'         // 特定のモンスターを指定条件（空きスロット等）で特殊召喚（予約）する
    | 'DRAW_CARD_WITH_ROLE'   // デッキから指定ロールのカードをドローする
    | 'DRAW_CARD_WITH_AFFILIATION' // デッキから指定所属(Affiliation)のカードをドローする
    | 'BUFF_SELF_STATS'       // 自身のステータスを上げる
    | 'BUFF_ALL_ROLE'         // 場の指定ロールを持つ味方全てのステータスを上げる
    | 'BUFF_ALL_AFFILIATION'  // 場の指定所属(Affiliation)を持つ味方全てのステータスを上げる
    | 'LEVEL_UP_RANDOM_ALLY'  // ランダムな自身の他のモンスターのレベルを1上げる
    | 'TRANSFORM_INTO'        // 特定のIDのカードに変身する
    | 'CONDITIONAL_BUFF_OTHER_ALLIES' // 条件を満たす時、他の味方のステータスを上げる
    | 'BUFF_OTHER_ALLIES_STATS' // 特定の条件に合致する他の味方のステータスを上げる
    | 'DANKETSU_NUKO_BUFF'    // 団結ヌコ専用バフ効果
    | 'NONE'
    | 'LEVEL_UP_TARGET'
    | 'BUFF_TARGET_STATS'
    | 'DRAW_CARDS'
    | 'BUFF_HAND_COST'
    | 'LEVEL_UP_ALL_ALLIES'
    | 'HONOUR_DAMAGE_TARGET'
    | 'AUTO_LIFE_BOOST'
    | 'AUTO_MP_BOOST'
    | 'AUTO_MP_REGEN_BOOST'
    | 'DAMAGE_PLAYER'
    | 'BUFF_HAND_COST_BY_TYPE'
    | 'GAIN_MP'
    | 'SUMMON_ENEMY_TARGET'
    | 'DAMAGE_TARGET_BY_GRAVEYARD'
    | 'FIXED_DAMAGE_ALL_ENEMY'
    | 'INSTANT_KILL_RANDOM_ENEMY'
    | 'BUFF_TARGET_STATS_BY_TYPE'
    | 'GRANT_STEALTH_TARGET'
    | 'BUFF_ALL_ALLIES'
    | 'HEAL_PLAYER'
    | 'INSTANT_KILL_RANDOM_RESERVED_ENEMY'
    | 'RETURN_ENEMY_TO_HAND'
    | 'RANDOM_FIXED_DAMAGE_MULTIPLE'
    | 'PARALYZE_TARGET'
    | 'SUMMON_RANDOM_ENEMY_RESERVED'
    | 'DEBUFF_TARGET_STATS'
    | 'DEBUFF_ENEMY_HAND_COST'
    | 'MILL_ENEMY_DECK'
    | 'RESURRECT_RANDOM_ROLE'
    | 'DEBUFF_ALL_ENEMY_RESERVED_STATS'
    | 'DAMAGE_ALL_ENEMIES_AND_PLAYER'
    | 'DISCARD_RANDOM_ENEMY_HAND'
    | 'HEAL_ALL_ALLY_MONSTERS'
    | 'RETURN_ENEMY_TO_HAND_GIVE_MP'
    | 'SUMMON_ALL_ENEMY_RESERVED'
    | 'BURN_ENEMY_MP'
    | 'PARALYZE_RANDOM_ENEMY'
    | 'DRAW_AND_SET_ROLE_CONDITIONAL'
    | 'STEAL_MP'
    | 'SEAL_ENEMY_SKILL'
    | 'MOVE_ALLY_MONSTER'
    | 'RETURN_TO_RESERVE'
    | 'ADD_CARD_TO_HAND'
    | 'SHUFFLE_BOARD_AND_BUFF'
    | 'RANDOM_DAMAGE_MULTIPLE'
    | 'SPAWN_MONSTER_RESERVED'
    | 'DAMAGE_RANDOM_ALLY_AND_SPAWN'
    | 'DAMAGE_ALL_ALLIES_AND_SPAWN'
    | 'SPAWN_RANDOM_ROLE_RESERVED'
    | 'REVEAL_ENEMY_HAND_AND_RESERVED'
    | 'MUTATE_ENEMY_TYPE'
    | 'GRANT_IMMUNITY_AND_LEVEL_UP'
    | 'MAX_LEVEL_UP_ALL_ALLIES'
    | 'SET_TARGET_HP'
    | 'SUMMON_RANDOM_ENEMY_AND_DAMAGE';

export interface CardEffect {
    type: EffectType;
    amount?: number;       // ダメージ量や召喚数などのパラメータ
    targetId?: string;     // 対象となる特定のカードID（SPAWN用など）
    roleCondition?: Role;  // 条件付きドローのロール指定
    affiliationCondition?: Affiliation; // 対象属性の指定など
    conditionCount?: number; // 条件判定の必要数
    buffAttack?: number;   // 攻撃力バフ値
    buffHp?: number;       // 体力バフ値
    grantTaunt?: boolean;  // 挑発を付与するかどうか
    targetType?: Affiliation | Role; // 対象タイプ
    grantShield?: boolean; // シールド付与
    grantDoubleAction?: boolean; // 2回行動付与
    hitCount?: number; // 攻撃回数
    grantMagicTarget?: boolean; // マジックターゲット付与
    maxCostCondition?: number; // コスト条件（X以下）
    spawnTargetId?: string; // 対象となる生成カードID（SPAWN_MONSTER_RESERVED用など）
}

export interface PlayerCharacter {
    id: string;
    name: string;
    maxHp: number;
    defense: number;
    initialMp: number;
    mpRegen: number;
    equippedSkills: TunisianSkill[];
}

export type SkillCondition = {
    type: 'role' | 'affiliation';
    value: Role | Affiliation | string; // 実際の要件(Role, Affiliationなど)
    count: number; // 発動に必要な数
};

export interface TunisianSkill {
    id: string;
    name: string;
    description: string;
    cost: number;
    level: 1 | 2 | 3;
    conditions: SkillCondition[];
    effects: CardEffect[]; // 発動時の効果
}

export interface CardData {
    id: string;
    name: string;
    type: CardType;
    cost: number;
    attack?: number;
    hp?: number;

    // モンスター固有の属性
    affiliation?: Affiliation;
    role?: Role;
    isTaunt?: boolean; // 挑発（無視して攻撃できない）フラグ

    // テキスト情報
    abilityText?: string; // 能力テキスト（魔法カードの効果、またはモンスターの召喚時/常時テキスト）
    attackText?: string;  // 攻撃時テキスト（モンスター専用）

    // システム（自動処理）用の効果定義データ
    abilityEffects?: CardEffect[];
    attackEffects?: CardEffect[];

    imageUrl?: string;
    imageColor?: string; // Tailwind bg color class for placeholder

    // テキストの後方互換維持（旧プロパティ、移行後に削除可能）
    text?: string;
}

// 盤面スロットに配置されるカード情報（状態を含む）
export interface BoardCardData {
    card: CardData;
    state: BoardSummonState;
    level?: number; // レベルアップサモン用 (1〜3)
}

export type BoardSlot = BoardCardData | null;
