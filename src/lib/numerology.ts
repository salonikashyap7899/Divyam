// Pythagorean numerology
const LETTER_VALUES: Record<string, number> = {
  a:1,j:1,s:1, b:2,k:2,t:2, c:3,l:3,u:3, d:4,m:4,v:4,
  e:5,n:5,w:5, f:6,o:6,x:6, g:7,p:7,y:7, h:8,q:8,z:8, i:9,r:9,
};
const VOWELS = new Set(["a","e","i","o","u"]);

const reduce = (n: number, keepMaster = true): number => {
  while (n > 9) {
    if (keepMaster && (n === 11 || n === 22 || n === 33)) return n;
    n = String(n).split("").reduce((s, c) => s + Number(c), 0);
  }
  return n;
};

const sumLetters = (s: string, filter?: (c: string) => boolean) => {
  return s.toLowerCase().replace(/[^a-z]/g, "").split("")
    .filter(c => !filter || filter(c))
    .reduce((sum, c) => sum + (LETTER_VALUES[c] || 0), 0);
};

export interface NumerologyInput { fullName: string; dob: string; mobile?: string; }
export interface NumerologyResult {
  lifePath: number;
  expression: number;
  soulUrge: number;
  personality: number;
  birthday: number;
  personalYear: number;
  meanings: Record<string, string>;
}

const MEANINGS: Record<number, string> = {
  1: "Leader. Independent, original, pioneering. Walk your own path.",
  2: "Diplomat. Sensitive, cooperative, intuitive. Strength in partnership.",
  3: "Communicator. Expressive, creative, joyful. Share your voice.",
  4: "Builder. Disciplined, grounded, practical. Stability through effort.",
  5: "Explorer. Curious, free, adaptable. Growth through experience.",
  6: "Nurturer. Responsible, harmonious, caring. Beauty and family.",
  7: "Seeker. Analytical, spiritual, introspective. Truth through study.",
  8: "Achiever. Ambitious, executive, abundant. Mastery through balance.",
  9: "Humanitarian. Compassionate, wise, generous. Service to the whole.",
  11: "Master Intuitive. A high-frequency 2 — illuminate others.",
  22: "Master Builder. A high-frequency 4 — manifest at scale.",
  33: "Master Teacher. A high-frequency 6 — heal through love.",
};

export function calculateNumerology(input: NumerologyInput): NumerologyResult {
  const lifePath = reduce(input.dob.replace(/[^0-9]/g, "").split("").reduce((s,c)=>s+Number(c),0));
  const expression = reduce(sumLetters(input.fullName));
  const soulUrge = reduce(sumLetters(input.fullName, c => VOWELS.has(c)));
  const personality = reduce(sumLetters(input.fullName, c => !VOWELS.has(c)));
  const day = Number(input.dob.split("-")[2] || "0");
  const birthday = reduce(day);
  const today = new Date();
  const [, m, d] = input.dob.split("-").map(Number);
  const personalYear = reduce((m + d + (today.getFullYear())).toString().split("").reduce((s,c)=>s+Number(c),0));

  const pickMeaning = (n: number) => MEANINGS[n] || MEANINGS[reduce(n, false)];
  return {
    lifePath, expression, soulUrge, personality, birthday, personalYear,
    meanings: {
      lifePath: pickMeaning(lifePath),
      expression: pickMeaning(expression),
      soulUrge: pickMeaning(soulUrge),
      personality: pickMeaning(personality),
      birthday: pickMeaning(birthday),
      personalYear: pickMeaning(personalYear),
    },
  };
}
