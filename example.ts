// example.ts

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

// Main function
async function main() {
  const name = await prompt("Enter word and map (ex stare xxyyg): ");
  console.log(`Hello, ${name}!`);
}

// Run the main function
main().catch((error) => console.error(error));
