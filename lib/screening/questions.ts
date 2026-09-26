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

// ─── Category 1: Orientation & Memory ─────────────────────────────
const orientationMemory: ScreeningQuestion[] = [
  {
    id: 'om_01',
    category: 'orientation_memory',
    type: 'choice',
    text: 'What year is it currently?',
    instruction: 'Ask the patient what year it is. Accept the correct year only.',
    hindiText: 'अभी कौन सा साल चल रहा है?',
    hindiInstruction: 'रोगी से पूछें कि अभी कौन सा साल है। केवल सही उत्तर स्वीकार करें।',
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
    hindiText: 'हम अभी किस गाँव या शहर में हैं?',
    hindiInstruction: 'रोगी से पूछें कि आप अभी कहाँ हैं। सही गाँव/शहर का नाम स्वीकार करें।',
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
    hindiText: 'कृपया ये तीन शब्द दोहराएँ: आम, कुर्सी, नदी',
    hindiInstruction: '"आम, कुर्सी, नदी" स्पष्ट रूप से कहें। रोगी से तीनों शब्द दोहराने को कहें।',
    options: [
      { score: 0, label: 'All 3 correct', description: 'Repeated all three words correctly' },
      { score: 1, label: '1–2 correct', description: 'Missed one or two words' },
      { score: 2, label: '0 correct', description: 'Could not repeat any word' },
    ],
    maxScore: 2,
  },
];

// ─── Category 2: Speech & Language ─────────────────────────────────
const speechLanguage: ScreeningQuestion[] = [
  {
    id: 'sl_01',
    category: 'speech_language',
    type: 'choice',
    text: 'Tell me about what you did this morning.',
    instruction: 'Ask the patient to describe their morning. Listen for: coherent sentences, word-finding pauses, mumbling, or confusion.',
    hindiText: 'आज सुबह आपने क्या किया, बताइए।',
    hindiInstruction: 'रोगी से उनकी सुबह का वर्णन करने को कहें। ध्यान दें: स्पष्ट वाक्य, शब्द ढूंढने में रुकावट, बुदबुदाना।',
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
    hindiText: '30 सेकंड में जितने जानवरों के नाम बता सकते हैं, बताइए।',
    hindiInstruction: 'रोगी को 30 सेकंड का समय दें। गिनें कि कितने अलग-अलग जानवरों के नाम बताए। सामान्य: 12+ जानवर।',
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
    hindiText: 'बातचीत के दौरान रोगी की आवाज़ की गुणवत्ता देखें।',
    hindiInstruction: 'बातचीत में देखें: क्या आवाज़ असामान्य रूप से धीमी है? क्या एक ही सुर में बोलते हैं? क्या शब्द अस्पष्ट हैं?',
    options: [
      { score: 0, label: 'Normal volume & tone', description: 'Voice is clear, well-modulated' },
      { score: 1, label: 'Somewhat soft or flat', description: 'Noticeably softer than normal or monotone' },
      { score: 2, label: 'Very soft / slurred', description: 'Difficult to hear or understand' },
    ],
    maxScore: 2,
  },
];

// ─── Category 3: Motor Function ────────────────────────────────────
const motorFunction: ScreeningQuestion[] = [
  {
    id: 'mf_01',
    category: 'motor_function',
    type: 'timed',
    text: 'Tap your thumb and index finger together as fast as you can for 10 seconds.',
    instruction: 'Demonstrate the movement. Ask patient to repeat with each hand separately. Count taps and observe speed/rhythm changes.',
    hindiText: 'अपने अँगूठे और तर्जनी उंगली को 10 सेकंड तक जितनी तेज़ी से हो सके, टैप करें।',
    hindiInstruction: 'गति दिखाएं। रोगी से प्रत्येक हाथ से अलग-अलग दोहराने को कहें। टैप गिनें और गति/लय में बदलाव देखें।',
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
    hindiText: 'रोगी से कहें कि वे हाथों का सहारा लिए बिना कुर्सी से खड़े हों।',
    hindiInstruction: 'यदि सुरक्षित हो, तो रोगी से बिना सहारे के खड़े होने को कहें। गति की सहजता देखें।',
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
    hindiText: 'रोगी को थोड़ी दूर (5-10 कदम) चलते हुए देखें।',
    hindiInstruction: 'रोगी से स्वाभाविक रूप से थोड़ा चलने को कहें। देखें: पैर घसीटना, छोटे कदम, बाँहों का कम हिलना, असंतुलन।',
    options: [
      { score: 0, label: 'Normal gait', description: 'Steady walk with normal stride and arm swing' },
      { score: 1, label: 'Mildly abnormal', description: 'Slightly small steps, reduced arm swing, or mild unsteadiness' },
      { score: 2, label: 'Clearly abnormal', description: 'Shuffling, freezing, significant unsteadiness, or needs support' },
    ],
    maxScore: 2,
  },
];

// ─── Category 4: Tremor & Coordination ─────────────────────────────
const tremorCoordination: ScreeningQuestion[] = [
  {
    id: 'tc_01',
    category: 'tremor_coordination',
    type: 'observation',
    text: 'Hold both hands out straight in front of you.',
    instruction: 'Ask patient to extend both arms forward, palms down, and hold for 10 seconds. Look for tremor (shaking).',
    hindiText: 'दोनों हाथ सामने सीधे फैलाकर रखें।',
    hindiInstruction: 'रोगी से दोनों हाथ आगे फैलाकर 10 सेकंड तक रखने को कहें। कंपन (हिलना) देखें।',
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
    hindiText: 'जब रोगी के हाथ गोद में रखे हों, उन्हें देखें।',
    hindiInstruction: 'जब रोगी बैठे हों और हाथ गोद में हों, आराम के समय कंपन देखें। यह एक महत्वपूर्ण संकेत है।',
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
    hindiText: 'अपनी नाक को छुएँ, फिर मेरी उंगली को। 3 बार दोहराएँ।',
    hindiInstruction: 'अपनी उंगली हाथ की दूरी पर रखें। रोगी से बारी-बारी से नाक और उंगली छूने को कहें। सटीकता और सहजता देखें।',
    options: [
      { score: 0, label: 'Accurate & smooth', description: 'Touches both targets accurately with smooth movement' },
      { score: 1, label: 'Slight inaccuracy', description: 'Misses slightly or movement is jerky' },
      { score: 2, label: 'Significant difficulty', description: 'Clearly misses targets or tremor worsens on reaching' },
    ],
    maxScore: 2,
  },
];

// ─── Category 5: Daily Impact ──────────────────────────────────────
const dailyImpact: ScreeningQuestion[] = [
  {
    id: 'di_01',
    category: 'daily_impact',
    type: 'choice',
    text: 'Do you have difficulty with daily tasks like buttoning clothes, eating, or writing?',
    instruction: 'Ask about specific activities of daily living. Listen for compensatory strategies (e.g., "my daughter helps me dress now").',
    hindiText: 'क्या आपको कपड़े के बटन लगाने, खाने, या लिखने में कठिनाई होती है?',
    hindiInstruction: 'दैनिक जीवन की विशिष्ट गतिविधियों के बारे में पूछें। सहायक रणनीतियाँ सुनें (जैसे "अब मेरी बेटी मुझे कपड़े पहनने में मदद करती है")।',
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
    hindiText: 'आपने इन लक्षणों को कितने समय से महसूस किया है?',
    hindiInstruction: 'समय-सीमा के बारे में पूछें। हाल ही में शुरू हुए लक्षण तीव्र समस्या का संकेत हो सकते हैं। महीनों/वर्षों में धीरे-धीरे बढ़ना अधिक चिंताजनक है।',
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
    hindiText: 'क्या ये लक्षण समय के साथ बिगड़ रहे हैं?',
    hindiInstruction: 'पूछें कि क्या रोगी या परिवार के सदस्यों ने बिगड़ते रुझान को देखा है। लगातार बिगड़ना विशेषज्ञ समीक्षा की आवश्यकता है।',
    options: [
      { score: 0, label: 'Stable / Not worsening', description: 'No noticeable change over time' },
      { score: 1, label: 'Slowly worsening', description: 'Gradual decline noticed by patient or family' },
      { score: 2, label: 'Clearly worsening', description: 'Obvious and rapid decline in function' },
    ],
    maxScore: 2,
  },
];

// ─── Export full question bank ──────────────────────────────────────

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
