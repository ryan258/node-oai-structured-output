import readline from 'readline';

export async function selectTopic(topics) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  console.log('\nChoose a topic:');
  topics.forEach((topic, idx) => {
    console.log(`${idx + 1}. ${topic}`);
  });
  return new Promise((resolve) => {
    rl.question('Enter the number of your choice: ', (input) => {
      rl.close();
      const idx = parseInt(input.trim(), 10) - 1;
      if (idx >= 0 && idx < topics.length) {
        resolve(topics[idx]);
      } else {
        console.log('Invalid choice. Please try again.');
        resolve(selectTopic(topics));
      }
    });
  });
}
