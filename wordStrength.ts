// wordStength.ts

export interface WordStrength {
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

// Will pimary match at least one char in target
function matchOneIgnore(
  primary: string,
  target: string,
  ignore: string
): boolean {
  // ignore self
  if (primary === target) {
    return false;
  }

  for (const p of primary) {
    for (const t of target) {
      if (p === t) {
        if (ignore.includes(p)) {
          continue;
        }
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

// deterine the strength of the word in the list
// strength is how many words can it eliminate from the list
// ignore is a string of characters to ignore
function computeStrengthIgnore(
  word: string,
  wslist: WordStrength[],
  ignore: string
): number {
  let strength = 0;

  // Check ever word in the list
  for (const ws of wslist) {
    if (matchOneIgnore(word, ws.word, ignore)) {
      strength += 1;
    }
  }
  return strength;
}

// given a list, init the strength and then sort
export function initStrength(wsl: WordStrength[]) {
  for (var i = 0; i < wsl.length; i++) {
    wsl[i].strength = computeStrength(wsl[i].word, wsl);
  }
  wsl.sort((a, b) => b.strength - a.strength);
}

//
export function setStrength(wsl: WordStrength[], greenyellow: string) {
  const ignore = greenyellow.split(".").join("");
  for (var i = 0; i < wsl.length; i++) {
    wsl[i].strength = computeStrengthIgnore(wsl[i].word, wsl, ignore);
  }
  wsl.sort((a, b) => b.strength - a.strength);
}
