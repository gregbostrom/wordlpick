// main.ts

//import { words } from "./words.ts";
import { WordStrength, initStrength, setStrength } from "./wordStrength.ts";
import { wordStrengthMaster } from "./wordStrengthMaster.ts";

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

// matchGreen returns true if word matches green letters
function matchGreen(green: string, word: string): boolean {
  for (var i = 0; i < 5; i++) {
    var g = green[i];
    var w = word[i];
    if (g === "." || g === w) {
      continue;
    }
    return false;
  }
  return true;
}

// matchGrey returns true if any grey character found in word
function matchGray(gray: string, word: string): boolean {
  for (const c of gray) {
    if (c === ".") {
      continue;
    }
    if (word.includes(c)) {
      return true;
    }
  }
  return false;
}

// matchYellow returns true if all yellow chars found in word
function matchYellow(yellow: string, word: string): boolean {
  let i = -1;
  for (const c of yellow) {
    i += 1;
    if (c === ".") {
      continue;
    }
    if (!word.includes(c)) {
      return false;
    }
    if (c === word[i]) {
      return false;
    }
  }
  return true;
}

// const gray0 = "..ons";
// const yellow0 = "a....";
// const green0 = ".e...";

// const wordStrengthList: WordStrength[][] = [[]];
// wordStrengthList[0] = [];

// for (const ws of wordStrengthMaster) {
//   if (
//     matchGray(gray0, ws.word) ||
//     !matchYellow(yellow0, ws.word) ||
//     !matchGreen(green0, ws.word)
//   ) {
//     continue;
//   }
//   ws.strength = 0; // reset
//   wordStrengthList[0].push(ws);
// }

// setStrength(wordStrengthList[0], green0 + yellow0);

// console.log(wordStrengthList[0]);
// console.log(wordStrengthList[0].length);

// const gray1 = "r..l.";
// const yellow1 = "..a.m";
// const green1 = ".e...";

// wordStrengthList[1] = [];

// for (const ws of wordStrengthList[0]) {
//   if (
//     matchGray(gray1, ws.word) ||
//     !matchYellow(yellow1, ws.word) ||
//     !matchGreen(green1, ws.word)
//   ) {
//     continue;
//   }
//   ws.strength = 0; // reset
//   wordStrengthList[1].push(ws);
// }

// setStrength(wordStrengthList[1], green1 + yellow1);

// console.log(wordStrengthList[1]);
// console.log(wordStrengthList[1].length);

// const gray2 = "..di.";
// const yellow2 = ".....";
// const green2 = "me..a";

// wordStrengthList[2] = [];

// for (const ws of wordStrengthList[1]) {
//   if (
//     matchGray(gray2, ws.word) ||
//     !matchYellow(yellow2, ws.word) ||
//     !matchGreen(green2, ws.word)
//   ) {
//     continue;
//   }
//   ws.strength = 0; // reset
//   wordStrengthList[2].push(ws);
// }

// setStrength(wordStrengthList[2], green2 + yellow2);

// console.log(wordStrengthList[2]);
// console.log(wordStrengthList[2].length);

// const gray3 = "gh...";
// const yellow3 = ".....";
// const green3 = "..ost";

// wordStrengthList[4] = [];

// for (const ws of wordStrengthList[3]) {
//   if (
//     matchGray(gray3, ws.word) ||
//     !matchYellow(yellow3, ws.word) ||
//     !matchGreen(green3, ws.word)
//   ) {
//     continue;
//   }
//   ws.strength = 0; // reset
//   wordStrengthList[4].push(ws);
// }

// setStrength(wordStrengthList[4], green2 + yellow2);

// console.log(wordStrengthList[4]);
// console.log(wordStrengthList[4].length);

interface Mask {
  gray: string;
  yellow: string;
  green: string;
}

function maskToCanical(word: string, mask: string): Mask {
  const maskChars = mask.split("");
  let m: Mask = { gray: ".....", yellow: ".....", green: "....." };

  let i = -1;
  for (const c of word) {
    i += 1;
    var chars: string[];

    switch (maskChars[i]) {
      case "x":
        chars = m.gray.split("");
        chars[i] = c;
        m.gray = chars.join("");
        break;
      case "y":
        chars = m.yellow.split("");
        chars[i] = c;
        m.yellow = chars.join("");
        break;
      case "g":
        chars = m.green.split("");
        chars[i] = c;
        m.green = chars.join("");
        break;
      default:
        break;
    }
  }
  return m;
}

const wordStrengthList: WordStrength[][] = [[]];

// Main function
async function main() {
  let g = 0; // g for guess (or wordle row)
  while (g < 6) {
    const word_mask = await prompt("Enter word mask (e.g. stare xxxyg): ");
    const m: Mask = maskToCanical(word_mask.slice(0, 5), word_mask.slice(-5));
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

// Run the main function
main().catch((error) => console.error(error));
