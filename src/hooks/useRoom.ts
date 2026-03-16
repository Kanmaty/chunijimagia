// ルーム管理フック（Firestore連携）
import { useState, useEffect, useCallback } from 'react';
import { db } from '../lib/firebase';
import {
    collection, doc, setDoc, getDoc, updateDoc,
    query, where, getDocs, onSnapshot, serverTimestamp, Timestamp
} from 'firebase/firestore';

export interface RoomPlayer {
    uid: string;
    name: string;
    characterId: string;
    deck: string[]; // カードのbaseId配列（20枚）
    skills: string[]; // 選択したスキルのID配列（3個）
    ready: boolean;
}

export interface RoomData {
    id: string;
    password: string;
    status: 'waiting' | 'deckbuilding' | 'playing' | 'finished';
    createdAt: Timestamp | null;
    player1: RoomPlayer | null;
    player2: RoomPlayer | null;
}

// 簡易的なUID生成（匿名ユーザー用）
const getOrCreateUid = (): string => {
    let uid = sessionStorage.getItem('chuniji_uid');
    if (!uid) {
        uid = `user_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        sessionStorage.setItem('chuniji_uid', uid);
    }
    return uid;
};

export const useRoom = () => {
    const [roomId, setRoomId] = useState<string | null>(null);
    const [roomData, setRoomData] = useState<RoomData | null>(null);
    const [myUid] = useState(getOrCreateUid);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // ルーム作成
    const createRoom = useCallback(async (password: string, playerName: string, characterId: string) => {
        setLoading(true);
        setError(null);
        try {
            const newRoomId = `room_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
            const roomRef = doc(db, 'rooms', newRoomId);

            const newRoom: Omit<RoomData, 'id'> = {
                password,
                status: 'waiting',
                createdAt: serverTimestamp() as Timestamp,
                player1: {
                    uid: myUid,
                    name: playerName,
                    characterId,
                    deck: [],
                    skills: [],
                    ready: false,
                },
                player2: null,
            };

            await setDoc(roomRef, newRoom);
            setRoomId(newRoomId);
            return newRoomId;
        } catch (e: any) {
            setError(e.message || 'ルーム作成に失敗しました');
            return null;
        } finally {
            setLoading(false);
        }
    }, [myUid]);

    // ルーム参加
    const joinRoom = useCallback(async (password: string, playerName: string, characterId: string) => {
        setLoading(true);
        setError(null);
        try {
            // 合言葉で waiting 状態のルームを検索
            const roomsRef = collection(db, 'rooms');
            const q = query(roomsRef, where('password', '==', password), where('status', '==', 'waiting'));
            const snapshot = await getDocs(q);

            if (snapshot.empty) {
                setError('合言葉が一致するルームが見つかりません');
                return null;
            }

            const roomDoc = snapshot.docs[0];
            const existingRoom = roomDoc.data();

            // 自分が作ったルームでないか確認
            if (existingRoom.player1?.uid === myUid) {
                setError('自分が作成したルームには参加できません');
                return null;
            }

            // player2 として参加 → ステータスをデッキ構築フェーズに
            await updateDoc(doc(db, 'rooms', roomDoc.id), {
                player2: {
                    uid: myUid,
                    name: playerName,
                    characterId,
                    deck: [],
                    skills: [],
                    ready: false,
                },
                status: 'deckbuilding',
            });

            setRoomId(roomDoc.id);
            return roomDoc.id;
        } catch (e: any) {
            setError(e.message || 'ルーム参加に失敗しました');
            return null;
        } finally {
            setLoading(false);
        }
    }, [myUid]);

    // デッキとスキルを保存
    const saveDeck = useCallback(async (deck: string[], skills: string[]) => {
        if (!roomId || !roomData) return;
        const isPlayer1 = roomData.player1?.uid === myUid;
        const playerKey = isPlayer1 ? 'player1' : 'player2';
        const playerData = isPlayer1 ? roomData.player1 : roomData.player2;

        if (!playerData) return;

        await updateDoc(doc(db, 'rooms', roomId), {
            [`${playerKey}.deck`]: deck,
            [`${playerKey}.skills`]: skills,
            [`${playerKey}.ready`]: true,
        });
    }, [roomId, roomData, myUid]);

    // ルーム状態をリアルタイム監視
    useEffect(() => {
        if (!roomId) return;

        const unsubscribe = onSnapshot(doc(db, 'rooms', roomId), (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.data() as Omit<RoomData, 'id'>;
                setRoomData({ id: roomId, ...data });

                // 両プレイヤーがready → playing に自動遷移（player1が初期化を担当）
                if (data.status === 'deckbuilding' && data.player1?.ready && data.player2?.ready) {
                    if (data.player1.uid === myUid) {
                        import('../data/characters').then(({ CharactersDb }) => {
                            import('../data/cards').then(({ CardsDb }) => {
                                // デッキ生成関数（ID配列からCardData配列へ）
                                const instantiateDeck = (ids: string[]) => ids.map(id => ({ ...CardsDb[id], id: `${id}_${Math.random().toString(36).slice(2, 6)}` }));

                                const p1FullDeck = instantiateDeck(data.player1!.deck);
                                const p2FullDeck = instantiateDeck(data.player2!.deck);

                                // デッキをシャッフル
                                p1FullDeck.sort(() => Math.random() - 0.5);
                                p2FullDeck.sort(() => Math.random() - 0.5);

                                // 初期手札4枚
                                const p1Hand = p1FullDeck.slice(0, 4);
                                const p1Deck = p1FullDeck.slice(4);
                                const p2Hand = p2FullDeck.slice(0, 4);
                                const p2Deck = p2FullDeck.slice(4);

                                const char1 = CharactersDb[data.player1!.characterId];
                                const char2 = CharactersDb[data.player2!.characterId];

                                const initialGameState = {
                                    currentTurn: 'player1',
                                    turnCount: 1,
                                    gameResult: null,
                                    discardPhaseTarget: null,
                                    pendingEffect: null,
                                    player1: {
                                        hp: char1.maxHp,
                                        cp: char1.initialMp + char1.mpRegen, // 先攻ターン開始時CP回復
                                        maxCp: 15,
                                        deckOutCount: 0,
                                        attackedThisTurn: [],
                                        usedSkillsThisTurn: [],
                                        slots: [null, null, null],
                                        hand: p1Hand,
                                        deck: p1Deck,
                                        characterId: char1.id,
                                        skills: data.player1!.skills,
                                    },
                                    player2: {
                                        hp: char2.maxHp,
                                        cp: char2.initialMp,
                                        maxCp: 15,
                                        deckOutCount: 0,
                                        attackedThisTurn: [],
                                        usedSkillsThisTurn: [],
                                        slots: [null, null, null],
                                        hand: p2Hand,
                                        deck: p2Deck,
                                        characterId: char2.id,
                                        skills: data.player2!.skills,
                                    }
                                };

                                updateDoc(doc(db, 'rooms', roomId), {
                                    status: 'playing',
                                    gameState: initialGameState
                                });
                            });
                        });
                    }
                }
            }
        });

        return () => unsubscribe();
    }, [roomId]);

    // 自分がどちらのプレイヤーかを判定
    const myPlayerKey = roomData?.player1?.uid === myUid ? 'player1' : 'player2';
    const opponentPlayerKey = myPlayerKey === 'player1' ? 'player2' : 'player1';

    return {
        roomId, setRoomId,
        roomData,
        myUid,
        myPlayerKey,
        opponentPlayerKey,
        error, loading,
        createRoom,
        joinRoom,
        saveDeck,
    };
};
