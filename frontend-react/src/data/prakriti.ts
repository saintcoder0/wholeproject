/* ═══════════════════════════════════════════════════════
   OJAS — prakriti.ts
   Questions data, dosha data
═══════════════════════════════════════════════════════ */

import { ICONS } from './icons';

export interface Option {
  t: string;
  d: 'v' | 'p' | 'k';
}

export interface Question {
  icon: string;
  cat: string;
  text: string;
  fact: string;
  opts: Option[];
}

export interface DoshaInfo {
  name: string;
  label: string;
  icon: string;
  element: string;
  color: string;
  themeClass: string;
  bgClass: string;
  nameClass: string;
  traitClass: string;
  classical: string;
  desc: string;
  traits: string[];
  why: string;
  imbalance: string[];
  foods: {
    principle: string;
    prefer: string[];
    avoid: string[];
  };
  lifestyle: {
    principle: string;
    prefer: string[];
    avoid: string[];
  };
  exercise: {
    principle: string;
    prefer: string[];
    avoid: string[];
  };
  rhythm: {
    time: string;
    action: string;
  }[];
  herbs: {
    icon: string;
    name: string;
    sanskrit: string;
    use: string;
  }[];
  seasons: {
    icon: string;
    name: string;
    tip: string;
    active: boolean;
  }[];
}

export const QUESTIONS_EN: Question[] = [
  {
    icon: ICONS.frame, cat: 'Body · Frame',
    text: 'Your natural body type?',
    fact: '📜 Charaka: Vata = laghu (light), Pitta = madhyama (medium), Kapha = sthula (solid). Frame is the most reliable physical Prakriti marker.',
    opts: [
      { t: 'Lean and light — bones visible, hard to gain weight',          d: 'v' },
      { t: 'Medium and proportional — athletic when active, easy to tone', d: 'p' },
      { t: 'Broad and sturdy — soft build, gain easily, hard to lose',     d: 'k' },
    ],
  },
  {
    icon: ICONS.eyes, cat: 'Body · Eyes',
    text: 'Describe your eyes honestly:',
    fact: '📜 Sushruta: Vata eyes are small and restless, Pitta eyes are sharp with a reddish tinge, Kapha eyes are large, white and beautifully lustrous.',
    opts: [
      { t: 'Small, alert, constantly moving — sometimes dry or nervous',           d: 'v' },
      { t: 'Medium, penetrating, intense — light-sensitive, slight reddish tinge', d: 'p' },
      { t: 'Large, calm, beautiful — thick lashes, very white, slow-moving',       d: 'k' },
    ],
  },
  {
    icon: ICONS.skin, cat: 'Body · Skin',
    text: 'Your skin on a normal day:',
    fact: '📜 Skin texture is one of the most reliable Prakriti signs: Vata = ruksha (dry/rough), Pitta = ushna (warm/sensitive), Kapha = snigdha (smooth/moist).',
    opts: [
      { t: 'Dry, thin, rough — chaps easily, prone to cracking or flaking',         d: 'v' },
      { t: 'Warm, oily or sensitive — prone to redness, freckles or breakouts',     d: 'p' },
      { t: 'Smooth, thick, cool and moist — glows naturally, rarely dry',           d: 'k' },
    ],
  },
  {
    icon: ICONS.temp, cat: 'Body · Temperature',
    text: 'You are usually…',
    fact: '📜 Vata = sheeta (cold-natured). Pitta = ushna (heat-natured). Kapha = sheeta but denser — tolerates cold better than Vata.',
    opts: [
      { t: 'Always cold — cold hands and feet, hate wind, love warmth',                   d: 'v' },
      { t: 'Always warm — uncomfortable in heat, love cool air, sweat easily',            d: 'p' },
      { t: 'Comfortable in most temperatures — not very bothered by either extreme',      d: 'k' },
    ],
  },
  {
    icon: ICONS.energy, cat: 'Body · Energy',
    text: 'Your natural energy pattern:',
    fact: '📜 Vata energy is "vishama" (variable) — bursts and crashes. Pitta is "tikshna" (intense and directed). Kapha is "sthira" (slow to start but highly enduring).',
    opts: [
      { t: 'Bursts of energy then sudden crashes — inconsistent throughout the day', d: 'v' },
      { t: 'Intense and focused when motivated, depleted by heat or stress',          d: 'p' },
      { t: 'Slow to warm up, but once going — remarkable stamina',                    d: 'k' },
    ],
  },
  {
    icon: ICONS.joints, cat: 'Body · Joints & Teeth',
    text: 'Your joints and teeth:',
    fact: '📜 Sushruta: Vata joints are "chala" (unstable/clicking), Pitta teeth are yellowish and moderate, Kapha teeth are "drudha" (strong, white, firmly set).',
    opts: [
      { t: 'Joints crack or pop — teeth irregular or prone to gaps',      d: 'v' },
      { t: 'Joints flexible — teeth moderate, slightly yellowish',         d: 'p' },
      { t: 'Joints solid and well-padded — teeth strong, white, set firm', d: 'k' },
    ],
  },
  {
    icon: ICONS.hunger, cat: 'Digestion · Hunger',
    text: 'Your appetite on a typical day:',
    fact: '📜 Agni (digestive fire) is Prakriti\'s fingerprint: Vata = vishama agni (irregular), Pitta = tikshna agni (sharp), Kapha = manda agni (slow and gentle).',
    opts: [
      { t: 'Irregular — sometimes ravenous, sometimes no appetite at all', d: 'v' },
      { t: 'Strong and sharp — irritable if a meal is delayed',            d: 'p' },
      { t: 'Low but steady — can easily skip a meal without distress',     d: 'k' },
    ],
  },
  {
    icon: ICONS.sleep, cat: 'Digestion · Sleep',
    text: 'How you naturally sleep:',
    fact: '📜 Sleep reveals dosha: Vata = light and broken, Pitta = moderate and purposeful, Kapha = deep and prolonged. The heaviest sleepers are always Kapha.',
    opts: [
      { t: 'Light and broken — vivid dreams, easily disturbed by any sound',         d: 'v' },
      { t: 'Quick to fall asleep, don\'t need much — wake alert but irritable if disturbed', d: 'p' },
      { t: 'Deep, heavy and long — very hard to wake, feel groggy for a while',      d: 'k' },
    ],
  },
  {
    icon: ICONS.sweat, cat: 'Digestion · Sweat',
    text: 'How you sweat:',
    fact: '📜 Sushruta lists profuse sweating and strong odour as clear Pitta Prakriti signs — "svedano" and "durgandha".',
    opts: [
      { t: 'Barely sweat — skin stays dry even in moderate heat',          d: 'v' },
      { t: 'Sweat heavily and quickly — strong, sharp body odour',         d: 'p' },
      { t: 'Sweat moderately — mild or pleasant smell',                    d: 'k' },
    ],
  },
  {
    icon: ICONS.voice, cat: 'Digestion · Voice',
    text: 'How people describe your voice and speech:',
    fact: '📜 Voice is a direct dosha marker: Vata = parusha (rough/fast), Pitta = madhura (clear/sharp), Kapha = mridhu (deep/slow/melodious).',
    opts: [
      { t: 'Fast and enthusiastic — voice can be hoarse or trail off',          d: 'v' },
      { t: 'Clear, precise, direct — people find you convincing and articulate', d: 'p' },
      { t: 'Slow, calm, resonant — deep voice, measured words',                 d: 'k' },
    ],
  },
  {
    icon: ICONS.weather, cat: 'Digestion · Weather',
    text: 'Which weather genuinely suits you best?',
    fact: '📜 Law of opposites: Vata (cold/dry) thrives in warm/humid, Pitta (hot) in cool/dry, Kapha (cold/heavy) in warm/dry stimulating environments.',
    opts: [
      { t: 'Warm and humid — wind, cold and dryness drain me',             d: 'v' },
      { t: 'Cool and ventilated — heat and humidity exhaust me',           d: 'p' },
      { t: 'Warm and dry — cold and damp make me sluggish',                d: 'k' },
    ],
  },
  {
    icon: ICONS.digestion, cat: 'Digestion · Digestion',
    text: 'Your bowels on a regular basis:',
    fact: '📜 Bowel character is among Charaka\'s most reliable Prakriti signs — Vata dries, Pitta loosens, Kapha slows and bulks.',
    opts: [
      { t: 'Irregular, dry or hard — constipation is a recurring theme',       d: 'v' },
      { t: 'Regular but loose or urgent — tendency toward soft stools',        d: 'p' },
      { t: 'Regular, bulky, well-formed — slow but reliable',                  d: 'k' },
    ],
  },
  {
    icon: ICONS.learning, cat: 'Mind · Learning',
    text: 'How you learn and remember things:',
    fact: '📜 Charaka: Vata = grahi (quick in, quick out), Pitta = medhavi (sharp and retentive), Kapha = chiragrahi (slow but never forgets once learned).',
    opts: [
      { t: 'Grasp things fast but forget equally fast — strong short-term memory', d: 'v' },
      { t: 'Analytical and sharp — absorb and retain facts well',                  d: 'p' },
      { t: 'Slow to understand fully, but once learned — it\'s permanent',          d: 'k' },
    ],
  },
  {
    icon: ICONS.decisions, cat: 'Mind · Decisions',
    text: 'How you make important decisions:',
    fact: '📜 Vata = chanchala (fickle). Pitta = nipunamati (decisive). Kapha = drudha vaira (deliberate, lasting commitments that rarely waver).',
    opts: [
      { t: 'Quickly and impulsively — change my mind frequently',                 d: 'v' },
      { t: 'Fast analysis then commit — rarely look back once decided',           d: 'p' },
      { t: 'Very slowly and carefully — deliberate long, but then stay firm',     d: 'k' },
    ],
  },
  {
    icon: ICONS.stress, cat: 'Mind · Stress',
    text: 'Under pressure, you typically:',
    fact: '📜 Charaka links anxiety/fear to Vata, anger/irritability to Pitta, depression/withdrawal to Kapha as primary stress responses.',
    opts: [
      { t: 'Get anxious, scattered and overwhelmed — mind won\'t stop racing', d: 'v' },
      { t: 'Get intense, irritable or critical — feel an urge to attack the problem', d: 'p' },
      { t: 'Withdraw, go quiet, get heavy — hard to find motivation to face it', d: 'k' },
    ],
  },
  {
    icon: ICONS.social, cat: 'Mind · Relationships',
    text: 'Your natural social style:',
    fact: '📜 Kapha types are "krutajna" (loyal, grateful). Pitta types are assertive with deep but demanding bonds. Vata types have many connections but lighter bonds.',
    opts: [
      { t: 'Enthusiastic and social with many connections — bonds can be light',  d: 'v' },
      { t: 'Confident and direct — few deep relationships, high standards',       d: 'p' },
      { t: 'Warm, deeply loyal, forgiving — small inner circle, bonds that last', d: 'k' },
    ],
  },
  {
    icon: ICONS.money, cat: 'Mind · Money',
    text: 'Your relationship with money and goals:',
    fact: '📜 Charaka: Vata = alpa dhan (poor at saving), Pitta = madhya dhana (ambitious earner), Kapha = bahu dhana (slow steady accumulator).',
    opts: [
      { t: 'Impulsive spender — money flows in and out; many goals, scattered execution', d: 'v' },
      { t: 'Ambitious and focused — clear financial goals, disciplined when motivated',   d: 'p' },
      { t: 'Patient saver — accumulates steadily, holds onto resources',                   d: 'k' },
    ],
  },
  {
    icon: ICONS.mornings, cat: 'Mind · Mornings',
    text: 'You before 9am:',
    fact: '📜 Morning behaviour reflects dosha cycles: Vata peaks at dawn (3–7 AM) — restless. Pitta 10–2. Kapha 6–10 — the hardest time to leave bed.',
    opts: [
      { t: 'Already awake and thinking — mind active at dawn, sometimes before alarm', d: 'v' },
      { t: 'Awake and ready quickly — purposeful morning person',                      d: 'p' },
      { t: 'Extremely reluctant to leave bed — need time and usually tea or coffee',   d: 'k' },
    ],
  },
];

export const DOSHA_EN: Record<string, DoshaInfo> = {
  v: {
    name: 'Vata', label: 'Vata Prakriti', icon: ICONS.vata,
    element: 'Ākāsha (Ether) + Vāyu (Air)',
    color: '#2e6e96', themeClass: 'res-theme--vata',
    bgClass: 'res-bg--vata', nameClass: 'res-name--vata', traitClass: 'trait--vata',
    classical: 'Charaka Samhita (CS. Sūtrasthāna 20) defines Vata Prakriti by the Gunas: Ruksha (rough), Laghu (light), Chala (mobile), Bahu (abundant), Shighra (swift), Sheeta (cold), Parusha (coarse), Vishada (clear). These qualities manifest in every aspect of the person — body, digestion, mind and behaviour.',
    desc: 'Vata is the dosha of movement and communication — governing all nerve impulses, circulation, respiration, and creative expression. You are a naturally dynamic, quick, and imaginative person driven by the energy of Air and Ether.',
    traits: ['Creative', 'Quick Mind', 'Adaptable', 'Enthusiastic', 'Expressive', 'Sensitive', 'Intuitive'],
    why: 'Your responses across all three domains consistently reflect the core Vata qualities of lightness (laghu), mobility (chala), roughness (ruksha) and coldness (sheeta). Your thin or light frame with prominent joints, dry skin, small/quick eyes, irregular digestion, variable bowel habits, light sleep and tendency toward anxiety under stress are the most classically reliable physical signs of Vata Prakriti as described in Charaka and Sushruta Samhita. Your quick grasp but short-term memory, rapid speech, impulsive decision-making and many lighter social connections further confirm this.',
    imbalance: ['Anxiety, worry, restlessness or insomnia', 'Constipation, bloating, gas and irregular digestion', 'Dry skin, chapped lips, cracking joints', 'Cold hands and feet; poor circulation', 'Scattered focus, forgetfulness, feeling overwhelmed', 'Underweight or difficulty maintaining weight', 'Muscle spasms, twitches or nervous tension'],
    foods: {
      principle: 'Vata is balanced by opposite qualities: warm, oily, heavy, moist and grounding foods. Favour sweet (madhura), sour (amla) and salty (lavana) tastes.',
      prefer: ['Warm cooked grains: rice, wheat, oats, quinoa', 'Root vegetables: sweet potato, carrot, beetroot', 'Healthy fats: ghee, sesame oil, olive oil', 'Warming spices: ginger, cumin, cinnamon, asafoetida', 'Mung dal and red lentils (well-spiced, cooked soft)', 'Warm golden milk with ghee at bedtime', 'Sweet ripe fruits: mangoes, bananas, dates, figs', 'Soups, stews and khichdi — especially in winter'],
      avoid: ['Raw salads, cold or dry foods', 'Popcorn, crackers, dry cereal, chips', 'Cold drinks and ice cream', 'Most beans unless well-soaked and spiced', 'Fasting or skipping meals', 'Refined and processed foods'],
    },
    lifestyle: {
      principle: 'Vata is pacified by routine, warmth and stability. Dinacharya (daily routine) is the single most important Vata practice.',
      prefer: ['Strict daily routine — same wake, meal and sleep times', 'Warm sesame oil Abhyanga (self-massage) every morning', 'Early bedtime — by 10 PM; minimum 7–8 hours sleep', 'Gentle yoga, pranayama and meditation daily', 'Warm, quiet, uncluttered living spaces'],
      avoid: ['Erratic schedules, irregular meals or late nights', 'Excessive travel, screen time or sensory stimulation', 'Prolonged fasting or undereating', 'Exposure to cold, dry, windy weather without protection', 'Overcommitting or spreading attention too thin'],
    },
    exercise: {
      principle: 'Vata types need grounding, warming and low-impact movement. Consistency matters more than intensity.',
      prefer: ['Hatha yoga, restorative yoga or Yin yoga', 'Slow, mindful walking in nature', 'Swimming in warm water', 'Tai Chi, Qigong or gentle dance', 'Pranayama — Nadi Shodhana and Bhramari'],
      avoid: ['HIIT and high-intensity training', 'Long distance running or extreme endurance', 'Erratic or irregular workout schedules', 'Cold-weather outdoor exercise', 'Exercising when fatigued'],
    },
    rhythm: [
      { time: '6–7 AM',  action: 'Wake before sunrise. Warm water with lemon. Abhyanga oil massage.' },
      { time: '7–9 AM',  action: 'Gentle yoga or walking. Warm nourishing breakfast.' },
      { time: '12–1 PM', action: 'Largest meal of the day. Warm cooked food. Eat mindfully, seated.' },
      { time: '5–6 PM',  action: 'Light herbal tea or snack. Avoid heavy exercise.' },
      { time: '7–8 PM',  action: 'Light warm dinner. No screens after 9 PM.' },
      { time: '10 PM',   action: 'In bed by 10 PM. Gentle reading or meditation.' },
    ],
    herbs: [
      { icon: ICONS.kapha, name: 'Ashwagandha',  sanskrit: 'Withania somnifera',      use: 'The premier Vata tonic — builds ojas (vital essence), calms the nervous system and grounds scattered Vata energy. Especially powerful at bedtime.' },
      { icon: ICONS.tea, name: 'Shatavari',    sanskrit: 'Asparagus racemosus',     use: 'Deeply nourishing and moistening — counters the dryness of Vata. Supports reproductive health and all building (brumhana) therapies.' },
      { icon: ICONS.herb, name: 'Bala',         sanskrit: 'Sida cordifolia',         use: 'Strengthens muscles, nerves and the heart. Gives stamina and endurance to Vata types prone to depletion.' },
      { icon: ICONS.season, name: 'Haritaki',     sanskrit: 'Terminalia chebula',      use: 'The "king of medicines" for Vata. Gently lubricates and relieves constipation, the most common Vata complaint.' },
      { icon: ICONS.flower, name: 'Brahmi',       sanskrit: 'Bacopa monnieri',         use: 'Calms and clarifies the mind. Reduces anxiety and mental restlessness — the hallmarks of excess Vata in the nervous system.' },
      { icon: ICONS.potion, name: 'Sesame',       sanskrit: 'Sesamum indicum',         use: 'Used internally and externally. Warm sesame oil Abhyanga is the single most effective daily Vata-pacifying practice in Ayurveda.' },
    ],
    seasons: [
      { icon: ICONS.season, name: 'Autumn',      tip: 'Vata peaks in autumn — the most critical season. Eat warm oily foods, keep strictly warm, follow routine.', active: true },
      { icon: ICONS.winter, name: 'Winter',      tip: 'Vata continues high. Warm baths, nourishing foods and early bedtimes are essential protection.', active: false },
      { icon: ICONS.flower, name: 'Spring',      tip: 'Vata naturally calms. Use spring to build strength and nourishment for the rest of the year.', active: false },
      { icon: ICONS.summer, name: 'Summer',      tip: 'Vata is generally comfortable in warmth. Avoid overheating and stay hydrated.', active: false },
    ],
  },
  p: {
    name: 'Pitta', label: 'Pitta Prakriti', icon: ICONS.pitta,
    element: 'Agni (Fire) + Jala (Water)',
    color: '#b04020', themeClass: 'res-theme--pitta',
    bgClass: 'res-bg--pitta', nameClass: 'res-name--pitta', traitClass: 'trait--pitta',
    classical: 'Charaka Samhita describes Pitta Prakriti by the Gunas: Ushna (hot), Tikshna (sharp), Drava (liquid), Visra (fleshy smell), Amla (sour), and Katu (pungent). These qualities govern transformation and digestion.',
    desc: 'Pitta is the dosha of transformation, heat, and metabolism — dominating digestion, body temperature, visual perception, and intellect. You are naturally intense, highly focused, and driven.',
    traits: ['Sharp Mind', 'Ambitious', 'Courageous', 'Focused', 'Confident', 'Direct', 'Passionate'],
    why: 'Your responses indicate strong Pitta qualities: heat (ushna), sharpness (tikshna), and intensity. Your medium athletic build, strong digestion, excellent focus, and tendency towards irritability when hungry or stressed are classical signs of Pitta dominance.',
    imbalance: ['Acid reflux, heartburn, or ulcers', 'Skin rashes, acne, or inflammation', 'Irritability, anger, or impatience', 'Excessive body heat and sweating', 'Burnout from overworking', 'Perfectionism and harsh criticism', 'Early graying or thinning hair'],
    foods: {
      principle: 'Pitta is balanced by cooling, dry, and heavy foods. Favour sweet (madhura), bitter (tikta), and astringent (kashaya) tastes.',
      prefer: ['Cooling grains: basmati rice, barley, oats', 'Ghee, coconut oil, sunflower oil', 'Sweet and astringent fruits: apples, berries, melons', 'Cooling spices: fennel, coriander, cardamom, mint', 'Green leafy vegetables, cucumber, zucchini', 'Moderate dairy, especially cool milk and fresh paneer', 'Soothing teas like peppermint or licorice', 'Ample hydration with cool (not ice) water'],
      avoid: ['Hot, spicy foods: chilies, cayenne, raw garlic', 'Sour foods: vinegar, fermented foods, sour cream', 'Salty and fried foods', 'Caffeine, alcohol, and excessive red meat', 'Eating while angry or stressed', 'Midnight snacking']
    },
    lifestyle: {
      principle: 'Pitta requires moderation, cooling environments, and surrender. Avoiding excess heat and competitiveness is crucial.',
      prefer: ['Regular mealtimes, especially lunch at noon', 'Spending time in nature, near water or forests', 'Cooling self-massage with coconut or sunflower oil', 'Moderate, non-competitive activities', 'Cultivating patience and work-life balance'],
      avoid: ['Overworking or excessive ambition', 'Direct exposure to midday sun', 'Heated arguments or high-stress environments', 'Skipping meals, especially lunch', 'Hot saunas or excessively hot showers']
    },
    exercise: {
      principle: 'Pitta types benefit from cooling, moderate-intensity workouts that do not overheat the body or fuel competitiveness.',
      prefer: ['Swimming in cool water', 'Brisk walking in nature during early morning or evening', 'Cycling in cool weather', 'Moderate yoga with emphasis on twists and forward bends', 'Winter sports'],
      avoid: ['Exercising during the hottest part of the day', 'Intense competitive sports', 'Hot yoga or exercising in heated rooms', 'Pushing past physical limits', 'Exercising when angry or stressed']
    },
    rhythm: [
      { time: '6–7 AM',  action: 'Wake up. Cool water splash on eyes. Coconut oil pulling.' },
      { time: '7–8 AM',  action: 'Moderate exercise. Cooling breakfast like oats or sweet fruit.' },
      { time: '12–1 PM', action: 'Largest meal of the day. Digestion is strongest now.' },
      { time: '5–6 PM',  action: 'Wind down from work. Brief walk in evening air.' },
      { time: '7–8 PM',  action: 'Moderate dinner. Avoid spicy or heavy foods.' },
      { time: '10–11 PM',action: 'Sleep by 10:30 PM to avoid the Pitta "second wind".' }
    ],
    herbs: [
      { icon: ICONS.flower, name: 'Shatavari', sanskrit: 'Asparagus racemosus', use: 'Cooling and nourishing tonic that soothes Pitta heat in the digestive and reproductive systems.' },
      { icon: ICONS.herb, name: 'Brahmi', sanskrit: 'Bacopa monnieri', use: 'Cools an overheated mind, reduces irritability, and supports calm focus and memory.' },
      { icon: ICONS.potion, name: 'Amalaki', sanskrit: 'Emblica officinalis', use: 'The best rejuvenative for Pitta. Rich in Vitamin C, it clears excess heat from the GI tract.' },
      { icon: ICONS.tea, name: 'Fennel', sanskrit: 'Foeniculum vulgare', use: 'A cooling digestive spice that relieves acid reflux without aggravating Pitta heat.' },
      { icon: ICONS.flower, name: 'Rose', sanskrit: 'Rosa damascena', use: 'Cooling and pacifying for Pitta emotions. Used in teas, jams (gulkand), and skin water.' },
      { icon: ICONS.flower, name: 'Triphala', sanskrit: 'Three fruits', use: 'A gentle bowel tonic that prevents Pitta-type diarrhea or loose stools.' }
    ],
    seasons: [
      { icon: ICONS.summer, name: 'Summer', tip: 'Pitta peaks in summer. Stay cool, avoid midday sun, and eat sweet, cooling foods.', active: true },
      { icon: ICONS.season, name: 'Autumn', tip: 'Pitta naturally calms. Focus on grounding and gentle detoxing.', active: false },
      { icon: ICONS.winter, name: 'Winter', tip: 'Pitta is generally comfortable in winter cold. Enjoy hearty, warming but not overly spicy meals.', active: false },
      { icon: ICONS.flower, name: 'Spring', tip: 'A neutral season for Pitta. Maintain steady routines.', active: false }
    ]
  },
  k: {
    name: 'Kapha', label: 'Kapha Prakriti', icon: ICONS.kapha,
    element: 'Prithvi (Earth) + Jala (Water)',
    color: '#2a6840', themeClass: 'res-theme--kapha',
    bgClass: 'res-bg--kapha', nameClass: 'res-name--kapha', traitClass: 'trait--kapha',
    classical: 'Charaka describes Kapha Prakriti by the Gunas: Guru (heavy), Manda (slow), Hima (cold), Snigdha (oily/unctuous), Slaksha (smooth), Sandra (dense), and Mridu (soft).',
    desc: 'Kapha is the dosha of structure, stability, and lubrication. It forms the body’s physical mass and provides endurance, immunity, and emotional calmness.',
    traits: ['Calm', 'Loyal', 'Patient', 'Strong', 'Enduring', 'Nurturing', 'Steady'],
    why: 'Your responses strongly reflect Kapha qualities: heaviness (guru), stability (sthira), and slowness (manda). Your sturdy build, steady but slow digestion, deep sleep, and calm, unruffled nature under stress are definitive physical and mental signs of Kapha dominance.',
    imbalance: ['Lethargy, sluggishness, or depression', 'Weight gain and difficulty losing it', 'Excess mucus, congestion, or sinus issues', 'Slow digestion and feeling heavy after meals', 'Water retention and swelling', 'Attachment, possessiveness, or stubbornness', 'Excessive sleeping or difficulty waking up'],
    foods: {
      principle: 'Kapha is balanced by light, warm, and dry foods. Favour pungent (katu), bitter (tikta), and astringent (kashaya) tastes.',
      prefer: ['Lighter grains: quinoa, millet, buckwheat, barley', 'Plenty of cooked vegetables, especially bitter and leafy greens', 'Warming, stimulating spices: black pepper, ginger, cayenne, mustard', 'Legumes and beans (well cooked)', 'Light fruits: apples, pears, berries', 'Astringent teas like green tea or ginger tea', 'Honey (in moderation, never cooked)', 'Warm water and stimulating herbal infusions'],
      avoid: ['Heavy, oily foods: deep-fried dishes, excess fats/oils', 'Dairy products, especially cold milk and cheese', 'Sweet, watery fruits like melons or bananas', 'Cold drinks and iced foods', 'Excess salt and refined sugar', 'Overeating or snacking between meals']
    },
    lifestyle: {
      principle: 'Kapha needs stimulation, warmth, and vigorous activity. Variety and breaking routines are helpful.',
      prefer: ['Waking up early, before sunrise (by 6 AM)', 'Vigorous daily exercise to induce sweating', 'Warm, dry environments', 'Seeking new experiences and breaking routine', 'Dry brushing (Garshana) to stimulate lymphatic flow'],
      avoid: ['Daytime sleeping or lounging', 'Cold, damp environments', 'Overeating or eating when not truly hungry', 'Sedentary jobs without movement breaks', 'Clinging to old, unhelpful habits']
    },
    exercise: {
      principle: 'Kapha types have excellent stamina and benefit from vigorous, prolonged, and heat-inducing workouts.',
      prefer: ['Aerobics, running, or brisk jogging', 'Vigorous Vinyasa or Ashtanga yoga', 'Circuit training and heavy weightlifting', 'Dancing, martial arts, or competitive sports', 'Exercising in the morning to shake off heaviness'],
      avoid: ['Sedentary routines', 'Exclusively slow, restorative exercises', 'Inconsistent workout schedules', 'Exercising immediately after heavy meals', 'Avoiding sweat']
    },
    rhythm: [
      { time: '5–6 AM',  action: 'Wake up early. Warm water with ginger and honey. Dry brushing.' },
      { time: '6–7 AM',  action: 'Vigorous exercise until sweating. Warm shower.' },
      { time: '8–9 AM',  action: 'Light breakfast (e.g., stewed apples) or skip if not hungry.' },
      { time: '12–1 PM', action: 'Largest meal. Spiced, warm foods.' },
      { time: '6–7 PM',  action: 'Light, early dinner like soup or steamed vegetables.' },
      { time: '10–11 PM',action: 'Sleep by 10:30 PM. Ensure active day for deep rest.' }
    ],
    herbs: [
      { icon: ICONS.herb, name: 'Tulsi', sanskrit: 'Ocimum sanctum', use: 'Holy Basil is warming and light, excellent for clearing Kapha from the lungs and respiratory tract.' },
      { icon: ICONS.potion, name: 'Trikatu', sanskrit: 'Ginger, pepper, pippali', use: 'A strong pungent formula that kindles digestive fire (agni) and burns away Kapha stagnation.' },
      { icon: ICONS.flower, name: 'Guggulu', sanskrit: 'Commiphora mukul', use: 'Scrapes away deep-seated Kapha, fat, and toxins from the tissues (medas dhatu).' },
      { icon: ICONS.tea, name: 'Ginger', sanskrit: 'Zingiber officinale', use: 'The universal medicine. Warms the body, stimulates digestion, and clears mucus.' },
      { icon: ICONS.herb, name: 'Bibhitaki', sanskrit: 'Terminalia bellirica', use: 'A part of Triphala that specifically drives Kapha out of the system.' },
      { icon: ICONS.potion, name: 'Honey', sanskrit: 'Madhu', use: 'Raw honey is the only sweetener that reduces Kapha, owing to its heating and scraping properties.' }
    ],
    seasons: [
      { icon: ICONS.flower, name: 'Spring', tip: 'Kapha peaks in spring. The best time for detox, vigorous exercise, and a light diet.', active: true },
      { icon: ICONS.summer, name: 'Summer', tip: 'Heat naturally reduces Kapha. Stay active but avoid extreme dry heat.', active: false },
      { icon: ICONS.season, name: 'Autumn', tip: 'A neutral season. Watch out for Vata aggravation while keeping Kapha checked.', active: false },
      { icon: ICONS.winter, name: 'Winter', tip: 'Cold and dampness can increase Kapha. Eat warm, spicy meals and stay active.', active: false }
    ]
  }
};
