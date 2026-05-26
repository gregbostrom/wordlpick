import { WordStrength, setStrength } from "./wordStrength.ts";
import { wordStrengthMaster } from "./wordStrengthMaster.ts";
import { Mask, matchGreen, matchGray, matchYellow, maskToCanonical } from "./wordle.ts";

// Prompt function to get user input
function prompt(question: string): Promise<string> {
  const buf = new Uint8Array(1024);
  const stdin = Deno.stdin;
  const stdout = Deno.stdout;

  return new Promise((resolve) => {
    stdout.write(new TextEncoder().encode(question));
    stdin.read(buf).then((n) => {
      const answer = new TextDecoder().decode(buf.subarray(0, n)).trim();
      resolve(answer);
    });
  });
}

const wordStrengthList: WordStrength[][] = [[]];

async function main() {
  let g = 0; // g for guess (or wordle row)
  while (g < 6) {
    const word_mask = await prompt("Enter word mask (e.g. stare xxxyg): ");
    const m: Mask = maskToCanonical(word_mask.slice(0, 5), word_mask.slice(-5));
    console.log(m);

    wordStrengthList[g] = [];

    if (g === 0) {
      for (const ws of wordStrengthMaster) {
        if (
          matchGray(m.gray, ws.word) ||
          !matchYellow(m.yellow, ws.word) ||
          !matchGreen(m.green, ws.word)
        ) {
          continue;
        }
        ws.strength = 0; // reset
        wordStrengthList[g].push(ws);
      }
    } else {
      for (const ws of wordStrengthList[g - 1]) {
        if (
          matchGray(m.gray, ws.word) ||
          !matchYellow(m.yellow, ws.word) ||
          !matchGreen(m.green, ws.word)
        ) {
          continue;
        }
        ws.strength = 0; // reset
        wordStrengthList[g].push(ws);
      }
    }

    setStrength(wordStrengthList[g], m.green + m.yellow);

    console.log(wordStrengthList[g]);
    console.log(wordStrengthList[g].length);
    g += 1;
  }
}

main().catch((error) => console.error(error));
