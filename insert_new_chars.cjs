const fs = require('fs');
const path = require('path');

const gameTsPath = path.join(process.cwd(), 'src/types/game.ts');
const charsTsPath = path.join(process.cwd(), 'src/data/characters.ts');

// --- Update src/types/game.ts regarding hitCount and STEAL_MP ---
let gameTsContent = fs.readFileSync(gameTsPath, 'utf8');

if (!gameTsContent.includes('STEAL_MP')) {
    gameTsContent = gameTsContent.replace(
        /\| 'DISCARD_RANDOM_ENEMY_HAND';/,
        `| 'DISCARD_RANDOM_ENEMY_HAND'\n    | 'STEAL_MP'\n    | 'SEAL_ENEMY_SKILL';`
    );
}

if (!gameTsContent.includes('hitCount?: number;')) {
    gameTsContent = gameTsContent.replace(
        /grantDoubleAction\?: boolean; \/\/ 2回行動付与/,
        `grantDoubleAction?: boolean; // 2回行動付与\n    hitCount?: number; // 攻撃回数`
    );
}
fs.writeFileSync(gameTsPath, gameTsContent);

// --- Update src/data/characters.ts ---
let charsContent = fs.readFileSync(charsTsPath, 'utf8');

const newCharacters = `    ,
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
        ]
    }`;

charsContent = charsContent.replace(/\s*}\n};\n*$/, newCharacters + '\n};\n');
fs.writeFileSync(charsTsPath, charsContent);
