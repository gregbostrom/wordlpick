import { assertEquals } from "jsr:@std/assert";
import { matchGreen, matchGray, matchYellow, maskToCanonical } from "./wordle.ts";
import { wordStrengthMaster } from "./wordStrengthMaster.ts";

// --- matchGreen ---

Deno.test("matchGreen: all wildcards accepts any word", () => {
  assertEquals(matchGreen(".....", "brain"), true);
});

Deno.test("matchGreen: correct letter at correct position", () => {
  assertEquals(matchGreen(".r...", "brain"), true);  // r is at index 1
});

Deno.test("matchGreen: wrong letter at required position", () => {
  assertEquals(matchGreen(".r...", "stale"), false); // t is at index 1, not r
});

Deno.test("matchGreen: full word match", () => {
  assertEquals(matchGreen("brain", "brain"), true);
  assertEquals(matchGreen("brain", "drain"), false);
});

// --- matchGray ---

Deno.test("matchGray: no gray letters always passes", () => {
  assertEquals(matchGray(".....", "brain"), false);
});

Deno.test("matchGray: word contains a gray letter", () => {
  assertEquals(matchGray("..ose", "arose"), true);  // 'o' is in arose
});

Deno.test("matchGray: word contains none of the gray letters", () => {
  assertEquals(matchGray("..ose", "brain"), false); // b,r,a,i,n — none of o,s,e
});

// --- matchYellow ---

Deno.test("matchYellow: all wildcards always passes", () => {
  assertEquals(matchYellow(".....", "brain"), true);
});

Deno.test("matchYellow: letter in word but not at yellow position", () => {
  assertEquals(matchYellow("a....", "trail"), true);  // 'a' in trail at index 2, not 0
});

Deno.test("matchYellow: letter at same position as yellow — reject", () => {
  assertEquals(matchYellow("a....", "arose"), false); // 'a' is at index 0 in arose
});

Deno.test("matchYellow: letter not in word at all — reject", () => {
  assertEquals(matchYellow("a....", "crisp"), false); // no 'a' in crisp
});

// --- maskToCanonical ---

Deno.test("maskToCanonical: arose ygxxx", () => {
  assertEquals(maskToCanonical("arose", "ygxxx"), {
    gray:   "..ose",
    yellow: "a....",
    green:  ".r...",
  });
});

Deno.test("maskToCanonical: trail xgggx", () => {
  assertEquals(maskToCanonical("trail", "xgggx"), {
    gray:   "t...l",
    yellow: ".....",
    green:  ".rai.",
  });
});

Deno.test("maskToCanonical: brain ggggg", () => {
  assertEquals(maskToCanonical("brain", "ggggg"), {
    gray:   ".....",
    yellow: ".....",
    green:  "brain",
  });
});

// --- integration: replay the game arose → trail → brain ---

function applyMask(
  candidates: { word: string; strength: number }[],
  word: string,
  mask: string,
) {
  const m = maskToCanonical(word, mask);
  return candidates.filter(
    (ws) =>
      !matchGray(m.gray, ws.word) &&
      matchYellow(m.yellow, ws.word) &&
      matchGreen(m.green, ws.word),
  );
}

Deno.test("integration: arose→trail narrows candidates correctly", () => {
  let candidates = [...wordStrengthMaster];
  candidates = applyMask(candidates, "arose", "ygxxx");
  candidates = applyMask(candidates, "trail", "xgggx");
  const words = candidates.map((ws) => ws.word);

  // our answer is still a valid candidate
  assertEquals(words.includes("brain"), true);

  // guessed words and obvious eliminations are gone
  assertEquals(words.includes("arose"), false);
  assertEquals(words.includes("trail"), false);
  assertEquals(words.includes("stale"), false); // has e

  // all survivors match pattern _rai_ with no o/s/e/t/l
  for (const w of words) {
    assertEquals(w[1], "r");
    assertEquals(w[2], "a");
    assertEquals(w[3], "i");
    assertEquals("osetl".split("").some((c) => w.includes(c)), false);
  }

  assertEquals(words.length, 9);
});
