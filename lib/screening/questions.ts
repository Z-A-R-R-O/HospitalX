/*
 * Copyright (c) 2026 Veyminore. All rights reserved.
 * 
 * This software is the confidential and proprietary information of Veyminore.
 * You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with Veyminore.
 */

import type { ScreeningQuestion, ScreeningCategory } from './types';
/**
 * Neurological Screening Question Bank
 * 
 * 5 categories, 15 questions total.
 * Each question scored 0–2 (No issue / Some difficulty / Significant difficulty).
 * Designed to be completed in under 3 minutes by a health worker with minimal training.
 * 
 * IMPORTANT: This is a screening tool, NOT a diagnostic instrument.
 * It identifies patterns that may warrant professional evaluation.
 */
// ——— Category 1: Orientation & Memory —————————————————————————————
const orientationMemory: ScreeningQuestion[] = [
  {
    id: 'om_01',
    category: 'orientation_memory',
    type: 'choice',
    text: 'What year is it currently?',
    instruction: 'Ask the patient what year it is. Accept the correct year only.',
    hindiText: 'αñàαñ¡αÑÇ αñòαÑîαñ¿ αñ╕αñ╛ αñ╕αñ╛αñ▓ αñÜαñ▓ αñ░αñ╣αñ╛ αñ╣αÑê?',
    hindiInstruction: 'αñ░αÑïαñùαÑÇ αñ╕αÑç αñ¬αÑéαñ¢αÑçαñé αñòαñ┐ αñàαñ¡αÑÇ αñòαÑîαñ¿ αñ╕αñ╛ αñ╕αñ╛αñ▓ αñ╣αÑêαÑñ αñòαÑçαñ╡αñ▓ αñ╕αñ╣αÑÇ αñëαññαÑìαññαñ░ αñ╕αÑìαñ╡αÑÇαñòαñ╛αñ░ αñòαñ░αÑçαñéαÑñ',
    options: [
      { score: 0, label: 'Correct', description: 'Answered the current year correctly' },
      { score: 1, label: 'Close / Uncertain', description: 'Off by one year or hesitated significantly' },
      { score: 2, label: 'Incorrect / Unable', description: 'Wrong answer or could not respond' },
    ],
    maxScore: 2,
  },
  {
    id: 'om_02',
    category: 'orientation_memory',
    type: 'choice',
    text: 'What village or town are we in right now?',
    instruction: 'Ask the patient where you are currently located. Accept the correct village/town name.',
    hindiText: 'αñ╣αñ« αñàαñ¡αÑÇ αñòαñ┐αñ╕ αñùαñ╛αñüαñ╡ αñ»αñ╛ αñ╢αñ╣αñ░ αñ«αÑçαñé αñ╣αÑêαñé?',
    hindiInstruction: 'αñ░αÑïαñùαÑÇ αñ╕αÑç αñ¬αÑéαñ¢αÑçαñé αñòαñ┐ αñåαñ¬ αñàαñ¡αÑÇ αñòαñ╣αñ╛αñü αñ╣αÑêαñéαÑñ αñ╕αñ╣αÑÇ αñùαñ╛αñüαñ╡/αñ╢αñ╣αñ░ αñòαñ╛ αñ¿αñ╛αñ« αñ╕αÑìαñ╡αÑÇαñòαñ╛αñ░ αñòαñ░αÑçαñéαÑñ',
    options: [
      { score: 0, label: 'Correct', description: 'Named the correct location' },
      { score: 1, label: 'Partially correct', description: 'Named a nearby place or the correct district' },
      { score: 2, label: 'Incorrect / Unable', description: 'Could not identify the location' },
    ],
    maxScore: 2,
  },
  {
    id: 'om_03',
    category: 'orientation_memory',
    type: 'choice',
    text: 'Please repeat these three words: Mango, Chair, River',
    instruction: 'Say "Mango, Chair, River" clearly. Ask the patient to repeat all three. You will ask them to recall these later.',
    hindiText: 'αñòαÑâαñ¬αñ»αñ╛ αñ»αÑç αññαÑÇαñ¿ αñ╢αñ¼αÑìαñª αñªαÑïαñ╣αñ░αñ╛αñÅαñü: αñåαñ«, αñòαÑüαñ░αÑìαñ╕αÑÇ, αñ¿αñªαÑÇ',
    hindiInstruction: '"αñåαñ«, αñòαÑüαñ░αÑìαñ╕αÑÇ, αñ¿αñªαÑÇ" αñ╕αÑìαñ¬αñ╖αÑìαñƒ αñ░αÑéαñ¬ αñ╕αÑç αñòαñ╣αÑçαñéαÑñ αñ░αÑïαñùαÑÇ αñ╕αÑç αññαÑÇαñ¿αÑïαñé αñ╢αñ¼αÑìαñª αñªαÑïαñ╣αñ░αñ╛αñ¿αÑç αñòαÑï αñòαñ╣αÑçαñéαÑñ',
    options: [
      { score: 0, label: 'All 3 correct', description: 'Repeated all three words correctly' },
      { score: 1, label: '1–2 correct', description: 'Missed one or two words' },
      { score: 2, label: '0 correct', description: 'Could not repeat any word' },
    ],
    maxScore: 2,
  },
];
// ——— Category 2: Speech & Language —————————————————————————————————
const speechLanguage: ScreeningQuestion[] = [
  {
    id: 'sl_01',
    category: 'speech_language',
    type: 'choice',
    text: 'Tell me about what you did this morning.',
    instruction: 'Ask the patient to describe their morning. Listen for: coherent sentences, word-finding pauses, mumbling, or confusion.',
    hindiText: 'αñåαñ£ αñ╕αÑüαñ¼αñ╣ αñåαñ¬αñ¿αÑç αñòαÑìαñ»αñ╛ αñòαñ┐αñ»αñ╛, αñ¼αññαñ╛αñçαñÅαÑñ',
    hindiInstruction: 'αñ░αÑïαñùαÑÇ αñ╕αÑç αñëαñ¿αñòαÑÇ αñ╕αÑüαñ¼αñ╣ αñòαñ╛ αñ╡αñ░αÑìαñúαñ¿ αñòαñ░αñ¿αÑç αñòαÑï αñòαñ╣αÑçαñéαÑñ αñºαÑìαñ»αñ╛αñ¿ αñªαÑçαñé: αñ╕αÑìαñ¬αñ╖αÑìαñƒ αñ╡αñ╛αñòαÑìαñ», αñ╢αñ¼αÑìαñª αñóαÑéαñéαñóαñ¿αÑç αñ«αÑçαñé αñ░αÑüαñòαñ╛αñ╡αñƒ, αñ¼αÑüαñªαñ¼αÑüαñªαñ╛αñ¿αñ╛αÑñ',
    options: [
      { score: 0, label: 'Clear & fluent', description: 'Spoke in clear, complete sentences' },
      { score: 1, label: 'Some difficulty', description: 'Occasional pauses, word-finding difficulty, or incomplete sentences' },
      { score: 2, label: 'Significant difficulty', description: 'Very unclear, fragmented speech, or unable to form sentences' },
    ],
    maxScore: 2,
  },
  {
    id: 'sl_02',
    category: 'speech_language',
    type: 'choice',
    text: 'Name as many animals as you can in 30 seconds.',
    instruction: 'Time the patient for 30 seconds. Count the number of unique animals named. Normal: 12+ animals.',
    hindiText: '30 αñ╕αÑçαñòαñéαñí αñ«αÑçαñé αñ£αñ┐αññαñ¿αÑç αñ£αñ╛αñ¿αñ╡αñ░αÑïαñé αñòαÑç αñ¿αñ╛αñ« αñ¼αññαñ╛ αñ╕αñòαññαÑç αñ╣αÑêαñé, αñ¼αññαñ╛αñçαñÅαÑñ',
    hindiInstruction: 'αñ░αÑïαñùαÑÇ αñòαÑï 30 αñ╕αÑçαñòαñéαñí αñòαñ╛ αñ╕αñ«αñ» αñªαÑçαñéαÑñ αñùαñ┐αñ¿αÑçαñé αñòαñ┐ αñòαñ┐αññαñ¿αÑç αñàαñ▓αñù-αñàαñ▓αñù αñ£αñ╛αñ¿αñ╡αñ░αÑïαñé αñòαÑç αñ¿αñ╛αñ« αñ¼αññαñ╛αñÅαÑñ αñ╕αñ╛αñ«αñ╛αñ¿αÑìαñ»: 12+ αñ£αñ╛αñ¿αñ╡αñ░αÑñ',
    options: [
      { score: 0, label: '10+ animals', description: 'Named 10 or more unique animals' },
      { score: 1, label: '5–9 animals', description: 'Named 5 to 9 animals' },
      { score: 2, label: 'Less than 5', description: 'Named fewer than 5 animals' },
    ],
    maxScore: 2,
    timeLimit: 30,
  },
  {
    id: 'sl_03',
    category: 'speech_language',
    type: 'observation',
    text: 'Observe the patient\'s voice quality during conversation.',
    instruction: 'During the conversation, observe: Is the voice unusually soft (hypophonia)? Is speech monotone? Is there slurring?',
    hindiText: 'αñ¼αñ╛αññαñÜαÑÇαññ αñòαÑç αñªαÑîαñ░αñ╛αñ¿ αñ░αÑïαñùαÑÇ αñòαÑÇ αñåαñ╡αñ╛αñ£αñ╝ αñòαÑÇ αñùαÑüαñúαñ╡αññαÑìαññαñ╛ αñªαÑçαñûαÑçαñéαÑñ',
    hindiInstruction: 'αñ¼αñ╛αññαñÜαÑÇαññ αñ«αÑçαñé αñªαÑçαñûαÑçαñé: αñòαÑìαñ»αñ╛ αñåαñ╡αñ╛αñ£αñ╝ αñàαñ╕αñ╛αñ«αñ╛αñ¿αÑìαñ» αñ░αÑéαñ¬ αñ╕αÑç αñºαÑÇαñ«αÑÇ αñ╣αÑê? αñòαÑìαñ»αñ╛ αñÅαñò αñ╣αÑÇ αñ╕αÑüαñ░ αñ«αÑçαñé αñ¼αÑïαñ▓αññαÑç αñ╣αÑêαñé? αñòαÑìαñ»αñ╛ αñ╢αñ¼αÑìαñª αñàαñ╕αÑìαñ¬αñ╖αÑìαñƒ αñ╣αÑêαñé?',
    options: [
      { score: 0, label: 'Normal volume & tone', description: 'Voice is clear, well-modulated' },
      { score: 1, label: 'Somewhat soft or flat', description: 'Noticeably softer than normal or monotone' },
      { score: 2, label: 'Very soft / slurred', description: 'Difficult to hear or understand' },
    ],
    maxScore: 2,
  },
];
// ——— Category 3: Motor Function ————————————————————————————————————
const motorFunction: ScreeningQuestion[] = [
  {
    id: 'mf_01',
    category: 'motor_function',
    type: 'timed',
    text: 'Tap your thumb and index finger together as fast as you can for 10 seconds.',
    instruction: 'Demonstrate the movement. Ask patient to repeat with each hand separately. Count taps and observe speed/rhythm changes.',
    hindiText: 'αñàαñ¬αñ¿αÑç αñàαñüαñùαÑéαñáαÑç αñöαñ░ αññαñ░αÑìαñ£αñ¿αÑÇ αñëαñéαñùαñ▓αÑÇ αñòαÑï 10 αñ╕αÑçαñòαñéαñí αññαñò αñ£αñ┐αññαñ¿αÑÇ αññαÑçαñ£αñ╝αÑÇ αñ╕αÑç αñ╣αÑï αñ╕αñòαÑç, αñƒαÑêαñ¬ αñòαñ░αÑçαñéαÑñ',
    hindiInstruction: 'αñùαññαñ┐ αñªαñ┐αñûαñ╛αñÅαñéαÑñ αñ░αÑïαñùαÑÇ αñ╕αÑç αñ¬αÑìαñ░αññαÑìαñ»αÑçαñò αñ╣αñ╛αñÑ αñ╕αÑç αñàαñ▓αñù-αñàαñ▓αñù αñªαÑïαñ╣αñ░αñ╛αñ¿αÑç αñòαÑï αñòαñ╣αÑçαñéαÑñ αñƒαÑêαñ¬ αñùαñ┐αñ¿αÑçαñé αñöαñ░ αñùαññαñ┐/αñ▓αñ» αñ«αÑçαñé αñ¼αñªαñ▓αñ╛αñ╡ αñªαÑçαñûαÑçαñéαÑñ',
    options: [
      { score: 0, label: 'Normal speed & rhythm', description: 'Fast, consistent tapping with both hands' },
      { score: 1, label: 'Slowed or irregular', description: 'Noticeably slower, irregular rhythm, or hesitant' },
      { score: 2, label: 'Very slow / Unable', description: 'Extremely slow, frequent stops, or unable to perform' },
    ],
    maxScore: 2,
    timeLimit: 10,
  },
  {
    id: 'mf_02',
    category: 'motor_function',
    type: 'observation',
    text: 'Ask the patient to stand up from a chair without using their hands.',
    instruction: 'If safe to do so, ask the patient to stand from a seated position without pushing off. Observe ease of movement.',
    hindiText: 'αñ░αÑïαñùαÑÇ αñ╕αÑç αñòαñ╣αÑçαñé αñòαñ┐ αñ╡αÑç αñ╣αñ╛αñÑαÑïαñé αñòαñ╛ αñ╕αñ╣αñ╛αñ░αñ╛ αñ▓αñ┐αñÅ αñ¼αñ┐αñ¿αñ╛ αñòαÑüαñ░αÑìαñ╕αÑÇ αñ╕αÑç αñûαñíαñ╝αÑç αñ╣αÑïαñéαÑñ',
    hindiInstruction: 'αñ»αñªαñ┐ αñ╕αÑüαñ░αñòαÑìαñ╖αñ┐αññ αñ╣αÑï, αññαÑï αñ░αÑïαñùαÑÇ αñ╕αÑç αñ¼αñ┐αñ¿αñ╛ αñ╕αñ╣αñ╛αñ░αÑç αñòαÑç αñûαñíαñ╝αÑç αñ╣αÑïαñ¿αÑç αñòαÑï αñòαñ╣αÑçαñéαÑñ αñùαññαñ┐ αñòαÑÇ αñ╕αñ╣αñ£αññαñ╛ αñªαÑçαñûαÑçαñéαÑñ',
    options: [
      { score: 0, label: 'Stands easily', description: 'Rose smoothly without difficulty' },
      { score: 1, label: 'Some difficulty', description: 'Needed one attempt with effort, or was slow' },
      { score: 2, label: 'Significant difficulty', description: 'Needed hands/support or multiple attempts' },
    ],
    maxScore: 2,
  },
  {
    id: 'mf_03',
    category: 'motor_function',
    type: 'observation',
    text: 'Observe the patient walking a short distance (5–10 steps).',
    instruction: 'Ask the patient to walk naturally for a short distance. Observe: shuffling, small steps, reduced arm swing, imbalance.',
    hindiText: 'αñ░αÑïαñùαÑÇ αñòαÑï αñÑαÑïαñíαñ╝αÑÇ αñªαÑéαñ░ (5-10 αñòαñªαñ«) αñÜαñ▓αññαÑç αñ╣αÑüαñÅ αñªαÑçαñûαÑçαñéαÑñ',
    hindiInstruction: 'αñ░αÑïαñùαÑÇ αñ╕αÑç αñ╕αÑìαñ╡αñ╛αñ¡αñ╛αñ╡αñ┐αñò αñ░αÑéαñ¬ αñ╕αÑç αñÑαÑïαñíαñ╝αñ╛ αñÜαñ▓αñ¿αÑç αñòαÑï αñòαñ╣αÑçαñéαÑñ αñªαÑçαñûαÑçαñé: αñ¬αÑêαñ░ αñÿαñ╕αÑÇαñƒαñ¿αñ╛, αñ¢αÑïαñƒαÑç αñòαñªαñ«, αñ¼αñ╛αñüαñ╣αÑïαñé αñòαñ╛ αñòαñ« αñ╣αñ┐αñ▓αñ¿αñ╛, αñàαñ╕αñéαññαÑüαñ▓αñ¿αÑñ',
    options: [
      { score: 0, label: 'Normal gait', description: 'Steady walk with normal stride and arm swing' },
      { score: 1, label: 'Mildly abnormal', description: 'Slightly small steps, reduced arm swing, or mild unsteadiness' },
      { score: 2, label: 'Clearly abnormal', description: 'Shuffling, freezing, significant unsteadiness, or needs support' },
    ],
    maxScore: 2,
  },
];
// ——— Category 4: Tremor & Coordination —————————————————————————————
const tremorCoordination: ScreeningQuestion[] = [
  {
    id: 'tc_01',
    category: 'tremor_coordination',
    type: 'observation',
    text: 'Hold both hands out straight in front of you.',
    instruction: 'Ask patient to extend both arms forward, palms down, and hold for 10 seconds. Look for tremor (shaking).',
    hindiText: 'αñªαÑïαñ¿αÑïαñé αñ╣αñ╛αñÑ αñ╕αñ╛αñ«αñ¿αÑç αñ╕αÑÇαñºαÑç αñ½αÑêαñ▓αñ╛αñòαñ░ αñ░αñûαÑçαñéαÑñ',
    hindiInstruction: 'αñ░αÑïαñùαÑÇ αñ╕αÑç αñªαÑïαñ¿αÑïαñé αñ╣αñ╛αñÑ αñåαñùαÑç αñ½αÑêαñ▓αñ╛αñòαñ░ 10 αñ╕αÑçαñòαñéαñí αññαñò αñ░αñûαñ¿αÑç αñòαÑï αñòαñ╣αÑçαñéαÑñ αñòαñéαñ¬αñ¿ (αñ╣αñ┐αñ▓αñ¿αñ╛) αñªαÑçαñûαÑçαñéαÑñ',
    options: [
      { score: 0, label: 'No tremor', description: 'Hands are steady with no visible shaking' },
      { score: 1, label: 'Mild tremor', description: 'Slight shaking visible in one or both hands' },
      { score: 2, label: 'Prominent tremor', description: 'Obvious shaking that is clearly visible' },
    ],
    maxScore: 2,
  },
  {
    id: 'tc_02',
    category: 'tremor_coordination',
    type: 'observation',
    text: 'Observe the patient\'s hands at rest (on their lap).',
    instruction: 'While the patient is sitting with hands resting on their lap, observe for resting tremor. This is a key distinguishing sign.',
    hindiText: 'αñ£αñ¼ αñ░αÑïαñùαÑÇ αñòαÑç αñ╣αñ╛αñÑ αñùαÑïαñª αñ«αÑçαñé αñ░αñûαÑç αñ╣αÑïαñé, αñëαñ¿αÑìαñ╣αÑçαñé αñªαÑçαñûαÑçαñéαÑñ',
    hindiInstruction: 'αñ£αñ¼ αñ░αÑïαñùαÑÇ αñ¼αÑêαñáαÑç αñ╣αÑïαñé αñöαñ░ αñ╣αñ╛αñÑ αñùαÑïαñª αñ«αÑçαñé αñ╣αÑïαñé, αñåαñ░αñ╛αñ« αñòαÑç αñ╕αñ«αñ» αñòαñéαñ¬αñ¿ αñªαÑçαñûαÑçαñéαÑñ αñ»αñ╣ αñÅαñò αñ«αñ╣αññαÑìαñ╡αñ¬αÑéαñ░αÑìαñú αñ╕αñéαñòαÑçαññ αñ╣αÑêαÑñ',
    options: [
      { score: 0, label: 'No resting tremor', description: 'Hands are still when at rest' },
      { score: 1, label: 'Intermittent tremor', description: 'Occasional shaking that comes and goes' },
      { score: 2, label: 'Persistent tremor', description: 'Continuous shaking even when relaxed' },
    ],
    maxScore: 2,
  },
  {
    id: 'tc_03',
    category: 'tremor_coordination',
    type: 'choice',
    text: 'Touch your nose, then touch my finger. Repeat 3 times.',
    instruction: 'Hold your finger about arm\'s length away. Ask patient to alternate touching their nose and your finger. Observe accuracy and smoothness.',
    hindiText: 'αñàαñ¬αñ¿αÑÇ αñ¿αñ╛αñò αñòαÑï αñ¢αÑüαñÅαñü, αñ½αñ┐αñ░ αñ«αÑçαñ░αÑÇ αñëαñéαñùαñ▓αÑÇ αñòαÑïαÑñ 3 αñ¼αñ╛αñ░ αñªαÑïαñ╣αñ░αñ╛αñÅαñüαÑñ',
    hindiInstruction: 'αñàαñ¬αñ¿αÑÇ αñëαñéαñùαñ▓αÑÇ αñ╣αñ╛αñÑ αñòαÑÇ αñªαÑéαñ░αÑÇ αñ¬αñ░ αñ░αñûαÑçαñéαÑñ αñ░αÑïαñùαÑÇ αñ╕αÑç αñ¼αñ╛αñ░αÑÇ-αñ¼αñ╛αñ░αÑÇ αñ╕αÑç αñ¿αñ╛αñò αñöαñ░ αñëαñéαñùαñ▓αÑÇ αñ¢αÑéαñ¿αÑç αñòαÑï αñòαñ╣αÑçαñéαÑñ αñ╕αñƒαÑÇαñòαññαñ╛ αñöαñ░ αñ╕αñ╣αñ£αññαñ╛ αñªαÑçαñûαÑçαñéαÑñ',
    options: [
      { score: 0, label: 'Accurate & smooth', description: 'Touches both targets accurately with smooth movement' },
      { score: 1, label: 'Slight inaccuracy', description: 'Misses slightly or movement is jerky' },
      { score: 2, label: 'Significant difficulty', description: 'Clearly misses targets or tremor worsens on reaching' },
    ],
    maxScore: 2,
  },
];
// ——— Category 5: Daily Impact ——————————————————————————————————————
const dailyImpact: ScreeningQuestion[] = [
  {
    id: 'di_01',
    category: 'daily_impact',
    type: 'choice',
    text: 'Do you have difficulty with daily tasks like buttoning clothes, eating, or writing?',
    instruction: 'Ask about specific activities of daily living. Listen for compensatory strategies (e.g., "my daughter helps me dress now").',
    hindiText: 'αñòαÑìαñ»αñ╛ αñåαñ¬αñòαÑï αñòαñ¬αñíαñ╝αÑç αñòαÑç αñ¼αñƒαñ¿ αñ▓αñùαñ╛αñ¿αÑç, αñûαñ╛αñ¿αÑç, αñ»αñ╛ αñ▓αñ┐αñûαñ¿αÑç αñ«αÑçαñé αñòαñáαñ┐αñ¿αñ╛αñê αñ╣αÑïαññαÑÇ αñ╣αÑê?',
    hindiInstruction: 'αñªαÑêαñ¿αñ┐αñò αñ£αÑÇαñ╡αñ¿ αñòαÑÇ αñ╡αñ┐αñ╢αñ┐αñ╖αÑìαñƒ αñùαññαñ┐αñ╡αñ┐αñºαñ┐αñ»αÑïαñé αñòαÑç αñ¼αñ╛αñ░αÑç αñ«αÑçαñé αñ¬αÑéαñ¢αÑçαñéαÑñ αñ╕αñ╣αñ╛αñ»αñò αñ░αñúαñ¿αÑÇαññαñ┐αñ»αñ╛αñü αñ╕αÑüαñ¿αÑçαñé (αñ£αÑêαñ╕αÑç "αñàαñ¼ αñ«αÑçαñ░αÑÇ αñ¼αÑçαñƒαÑÇ αñ«αÑüαñ¥αÑç αñòαñ¬αñíαñ╝αÑç αñ¬αñ╣αñ¿αñ¿αÑç αñ«αÑçαñé αñ«αñªαñª αñòαñ░αññαÑÇ αñ╣αÑê")αÑñ',
    options: [
      { score: 0, label: 'No difficulty', description: 'Manages all daily tasks independently' },
      { score: 1, label: 'Some difficulty', description: 'Struggles with fine motor tasks but manages' },
      { score: 2, label: 'Needs help', description: 'Requires assistance with daily activities' },
    ],
    maxScore: 2,
  },
  {
    id: 'di_02',
    category: 'daily_impact',
    type: 'choice',
    text: 'How long have you noticed these symptoms?',
    instruction: 'Ask about the timeline. Recent onset may indicate acute issues. Gradual progression over months/years is more concerning for neurodegenerative conditions.',
    hindiText: 'αñåαñ¬αñ¿αÑç αñçαñ¿ αñ▓αñòαÑìαñ╖αñúαÑïαñé αñòαÑï αñòαñ┐αññαñ¿αÑç αñ╕αñ«αñ» αñ╕αÑç αñ«αñ╣αñ╕αÑéαñ╕ αñòαñ┐αñ»αñ╛ αñ╣αÑê?',
    hindiInstruction: 'αñ╕αñ«αñ»-αñ╕αÑÇαñ«αñ╛ αñòαÑç αñ¼αñ╛αñ░αÑç αñ«αÑçαñé αñ¬αÑéαñ¢αÑçαñéαÑñ αñ╣αñ╛αñ▓ αñ╣αÑÇ αñ«αÑçαñé αñ╢αÑüαñ░αÑé αñ╣αÑüαñÅ αñ▓αñòαÑìαñ╖αñú αññαÑÇαñ╡αÑìαñ░ αñ╕αñ«αñ╕αÑìαñ»αñ╛ αñòαñ╛ αñ╕αñéαñòαÑçαññ αñ╣αÑï αñ╕αñòαññαÑç αñ╣αÑêαñéαÑñ αñ«αñ╣αÑÇαñ¿αÑïαñé/αñ╡αñ░αÑìαñ╖αÑïαñé αñ«αÑçαñé αñºαÑÇαñ░αÑç-αñºαÑÇαñ░αÑç αñ¼αñóαñ╝αñ¿αñ╛ αñàαñºαñ┐αñò αñÜαñ┐αñéαññαñ╛αñ£αñ¿αñò αñ╣αÑêαÑñ',
    options: [
      { score: 0, label: 'Less than 1 month', description: 'Recent onset, possibly acute' },
      { score: 1, label: '1–6 months', description: 'Several months of gradual change' },
      { score: 2, label: 'More than 6 months', description: 'Long-standing and progressive' },
    ],
    maxScore: 2,
  },
  {
    id: 'di_03',
    category: 'daily_impact',
    type: 'choice',
    text: 'Have these symptoms been getting worse over time?',
    instruction: 'Ask if the patient or family members have noticed a worsening trend. Progressive worsening warrants specialist review.',
    hindiText: 'αñòαÑìαñ»αñ╛ αñ»αÑç αñ▓αñòαÑìαñ╖αñú αñ╕αñ«αñ» αñòαÑç αñ╕αñ╛αñÑ αñ¼αñ┐αñùαñíαñ╝ αñ░αñ╣αÑç αñ╣αÑêαñé?',
    hindiInstruction: 'αñ¬αÑéαñ¢αÑçαñé αñòαñ┐ αñòαÑìαñ»αñ╛ αñ░αÑïαñùαÑÇ αñ»αñ╛ αñ¬αñ░αñ┐αñ╡αñ╛αñ░ αñòαÑç αñ╕αñªαñ╕αÑìαñ»αÑïαñé αñ¿αÑç αñ¼αñ┐αñùαñíαñ╝αññαÑç αñ░αÑüαñ¥αñ╛αñ¿ αñòαÑï αñªαÑçαñûαñ╛ αñ╣αÑêαÑñ αñ▓αñùαñ╛αññαñ╛αñ░ αñ¼αñ┐αñùαñíαñ╝αñ¿αñ╛ αñ╡αñ┐αñ╢αÑçαñ╖αñ£αÑìαñ₧ αñ╕αñ«αÑÇαñòαÑìαñ╖αñ╛ αñòαÑÇ αñåαñ╡αñ╢αÑìαñ»αñòαññαñ╛ αñ╣αÑêαÑñ',
    options: [
      { score: 0, label: 'Stable / Not worsening', description: 'No noticeable change over time' },
      { score: 1, label: 'Slowly worsening', description: 'Gradual decline noticed by patient or family' },
      { score: 2, label: 'Clearly worsening', description: 'Obvious and rapid decline in function' },
    ],
    maxScore: 2,
  },
];
// ——— Export full question bank ——————————————————————————————————————
export const SCREENING_QUESTIONS: ScreeningQuestion[] = [
  ...orientationMemory,
  ...speechLanguage,
  ...motorFunction,
  ...tremorCoordination,
  ...dailyImpact,
];
export const QUESTIONS_BY_CATEGORY: Record<ScreeningCategory, ScreeningQuestion[]> = {
  orientation_memory: orientationMemory,
  speech_language: speechLanguage,
  motor_function: motorFunction,
  tremor_coordination: tremorCoordination,
  daily_impact: dailyImpact,
};
export const CATEGORY_ORDER: ScreeningCategory[] = [
  'orientation_memory',
  'speech_language',
  'motor_function',
  'tremor_coordination',
  'daily_impact',
];
export const TOTAL_QUESTIONS = SCREENING_QUESTIONS.length; // 15
export const MAX_TOTAL_SCORE = SCREENING_QUESTIONS.reduce((sum, q) => sum + q.maxScore, 0); // 30
