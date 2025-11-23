import { GoogleGenAI, Type } from "@google/genai";
import { Pokemon, Move } from "../types";

// Initialize Gemini Client
// Note: process.env.API_KEY is assumed to be available.
// We add a safe check for 'process' to avoid crashes in strict browser environments where it's undefined.
let apiKey = '';
try {
  // @ts-ignore
  if (typeof process !== 'undefined' && process.env) {
    apiKey = process.env.API_KEY || '';
  }
} catch (e) {
  console.warn('API Key extraction failed, running without key (simulated mode).');
}

const ai = new GoogleGenAI({ apiKey });

// We use 'gemini-2.5-flash' for low latency responses which is crucial for games.
const MODEL_NAME = "gemini-2.5-flash";

export const generateBattleNarration = async (
  attacker: Pokemon,
  defender: Pokemon,
  move: Move,
  damage: number,
  isCritical: boolean
): Promise<string> => {
  if (!apiKey) {
    return `${attacker.name} 使用了 ${move.name}，造成了 ${damage} 点伤害！`;
  }

  try {
    const prompt = `
    请为一场宝可梦对战写一句简短、激烈、热血的中文解说。
    攻击方: ${attacker.name} (属性: ${attacker.type})
    招式: ${move.name}
    防守方: ${defender.name} (当前HP: ${defender.hp})
    伤害: ${damage}
    是否暴击: ${isCritical ? '是' : '否'}
    
    要求: 
    1. 只返回一句中文。
    2. 语气要像动画片里的解说员。
    3. 包含招式的视觉描述。
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });

    return response.text?.trim() || `${attacker.name} 施展了 ${move.name}！`;
  } catch (error) {
    console.error("Gemini API Error (Narration):", error);
    return `${attacker.name} 攻击了 ${defender.name}，造成 ${damage} 点伤害！`;
  }
};

interface OpponentDecision {
  moveIndex: number;
  banter: string;
}

export const getOpponentDecision = async (
  opponent: Pokemon,
  player: Pokemon
): Promise<OpponentDecision> => {
  // Fallback logic if API fails or no key
  const fallbackIndex = Math.floor(Math.random() * opponent.moves.length);
  if (!apiKey) {
    return {
      moveIndex: fallbackIndex,
      banter: `${opponent.name} 正在蓄力...`
    };
  }

  try {
    const movesList = opponent.moves.map((m, i) => `${i}: ${m.name} (威力: ${m.power}, 属性: ${m.type})`).join(', ');
    const prompt = `
    你正在扮演一只宝可梦进行对战。请做出决策。
    
    你的状态:
    - 名称: ${opponent.name}
    - 属性: ${opponent.type}
    - HP: ${opponent.hp} / ${opponent.maxHp}
    - 可用招式: ${movesList}
    
    对手状态:
    - 名称: ${player.name}
    - 属性: ${player.type}
    - HP: ${player.hp} / ${player.maxHp}
    
    请选择最好的招式索引（0-${opponent.moves.length - 1}），并说一句简短的中文挑衅或战斗宣言。
    
    请以 JSON 格式返回，不要使用 Markdown 代码块:
    { "moveIndex": number, "banter": "string" }
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            moveIndex: { type: Type.INTEGER },
            banter: { type: Type.STRING }
          }
        }
      }
    });

    const jsonText = response.text?.trim();
    if (jsonText) {
      const result = JSON.parse(jsonText) as OpponentDecision;
      // Validate index
      if (result.moveIndex >= 0 && result.moveIndex < opponent.moves.length) {
        return result;
      }
    }
    throw new Error("Invalid AI response");

  } catch (error) {
    console.error("Gemini API Error (AI Decision):", error);
    return {
      moveIndex: fallbackIndex,
      banter: "放马过来吧！"
    };
  }
};