// wordle.ts — pure filter functions, extracted for testability

export interface Mask {
  gray: string;
  yellow: string;
  green: string;
}

// returns true if word matches all green (confirmed) positions
export function matchGreen(green: string, word: string): boolean {
  for (let i = 0; i < 5; i++) {
    if (green[i] !== "." && green[i] !== word[i]) return false;
  }
  return true;
}

// returns true if word contains any gray (eliminated) letter
export function matchGray(gray: string, word: string): boolean {
  for (const c of gray) {
    if (c !== "." && word.includes(c)) return true;
  }
  return false;
}

// returns true if all yellow letters are in the word but NOT at their yellow position
export function matchYellow(yellow: string, word: string): boolean {
  let i = -1;
  for (const c of yellow) {
    i += 1;
    if (c === ".") continue;
    if (!word.includes(c)) return false;
    if (c === word[i]) return false;
  }
  return true;
}

// converts a guessed word + mask string (e.g. "arose", "ygxxx") into a Mask
export function maskToCanonical(word: string, mask: string): Mask {
  const maskChars = mask.split("");
  const m: Mask = { gray: ".....", yellow: ".....", green: "....." };
  let i = -1;
  for (const c of word) {
    i += 1;
    let chars: string[];
    switch (maskChars[i]) {
      case "x":
        chars = m.gray.split(""); chars[i] = c; m.gray = chars.join(""); break;
      case "y":
        chars = m.yellow.split(""); chars[i] = c; m.yellow = chars.join(""); break;
      case "g":
        chars = m.green.split(""); chars[i] = c; m.green = chars.join(""); break;
    }
  }
  return m;
}
