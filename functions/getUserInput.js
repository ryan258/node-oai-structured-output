import readline from 'readline';

export async function getUserInput() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(
      'Enter a scenario prompt (or press Enter for AI-generated topics): ',
      (input) => {
        rl.close();
        resolve(input.trim());
      }
    );
  });
}
