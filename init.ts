// init.ts
// create the WordStrength.ts file

import { words } from "./words.ts";

interface WordStrength {
  word: string;
  strength: number;
}

// Will pimary match at least one char in target
function matchOne(primary: string, target: string): boolean {
  // ignore self
  if (primary === target) {
    return false;
  }

  for (const p of primary) {
    for (const t of target) {
      if (p === t) {
        return true;
      }
    }
  }
  return false;
}

// deterine the strength of the word in the list
// strength is how many words can it eliminate from the list
function computeStrength(word: string, wslist: WordStrength[]): number {
  let strength = 0;

  // Check ever word in the list
  for (const ws of wslist) {
    if (matchOne(word, ws.word)) {
      strength += 1;
    }
  }
  return strength;
}

// given a list, init the strength
function initStrength(wsl: WordStrength[]) {
  for (var i = 0; i < wsl.length; i++) {
    wsl[i].strength = computeStrength(wsl[i].word, wsl);
  }
}

const ws: WordStrength[] = [];

for (const word of words) {
  const wordPlusStrength: WordStrength = {
    word: word,
    strength: 0,
  };
  ws.push(wordPlusStrength);
}

initStrength(ws);
ws.sort((a, b) => b.strength - a.strength);

let s = `
export interface WordStrength {
  word: string;
  strength: number;
}

export const wordStrength: WordStrength[] = [
`;

for (const w of ws) {
  s +=
    '  { word: "' + w.word + '", strength: ' + w.strength.toString() + " },\n";
}
s += "];";

await Deno.writeTextFile("./wordstrengthlist0.ts", s);

console.log("All good!!");
