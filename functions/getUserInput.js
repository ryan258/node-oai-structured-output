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
        // More comprehensive sanitization
        const sanitizedInput = input
          .replace(/[<>]/g, '')           // Remove HTML tags
          .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
          .trim()
          .substring(0, 500);              // Limit length
        resolve(sanitizedInput);
      }
    );
  });
}
