import readline from 'readline';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Use import.meta.url for reliable path resolution in ESM
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Prompts the user to select a demo topic from categorized options.
 *
 * @returns {Promise<string>} The selected demo topic.
 */
export async function selectDemo() {
  const demosPath = path.join(__dirname, '..', 'demos.json');
  const demos = JSON.parse(fs.readFileSync(demosPath, 'utf-8'));
  const categories = Object.keys(demos);

  // Use while loops instead of recursion to avoid stack overflow
  while (true) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    console.log('\n--- Demo Mode: Select a Category ---');
    categories.forEach((cat, idx) => {
      console.log(`${idx + 1}. ${cat}`);
    });

    const catInput = await new Promise((resolve) => {
      rl.question('\nEnter category number: ', (input) => {
        resolve(input);
      });
    });

    const catIdx = parseInt(catInput.trim(), 10) - 1;
    if (catIdx < 0 || catIdx >= categories.length) {
      console.log('Invalid category. Please try again.');
      rl.close();
      continue;
    }

    const selectedCategory = categories[catIdx];
    const topics = demos[selectedCategory];

    console.log(`\n--- ${selectedCategory} ---`);
    topics.forEach((topic, idx) => {
      console.log(`${idx + 1}. ${topic}`);
    });

    const topicInput = await new Promise((resolve) => {
      rl.question('\nEnter topic number: ', (input) => {
        rl.close();
        resolve(input);
      });
    });

    const topicIdx = parseInt(topicInput.trim(), 10) - 1;
    if (topicIdx >= 0 && topicIdx < topics.length) {
      return topics[topicIdx];
    }

    console.log('Invalid topic. Please try again.');
  }
}
