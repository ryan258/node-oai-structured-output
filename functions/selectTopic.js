import readline from 'readline';

/**
 * Prompts the user to select a topic from a list.
 *
 * @param {string[]} topics - Array of topic strings to choose from.
 * @returns {Promise<string>} The selected topic.
 */
export async function selectTopic(topics) {
  // Use a while loop instead of recursion to avoid stack overflow on repeated invalid input
  while (true) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    console.log('\nChoose a topic:');
    topics.forEach((topic, idx) => {
      console.log(`${idx + 1}. ${topic}`);
    });

    const input = await new Promise((resolve) => {
      rl.question('Enter the number of your choice: ', (answer) => {
        rl.close();
        resolve(answer);
      });
    });

    const idx = parseInt(input.trim(), 10) - 1;
    if (idx >= 0 && idx < topics.length) {
      return topics[idx];
    }

    console.log('Invalid choice. Please try again.');
  }
}
