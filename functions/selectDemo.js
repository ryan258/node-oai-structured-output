import readline from 'readline';
import fs from 'fs';
import path from 'path';

export async function selectDemo() {
    const demosPath = path.join(process.cwd(), 'demos.json');
    const demos = JSON.parse(fs.readFileSync(demosPath, 'utf-8'));
    const categories = Object.keys(demos);

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
        return await selectDemo();
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
    } else {
        console.log('Invalid topic. Please try again.');
        return await selectDemo(); // Note: This restarts from category selection, which is fine
    }
}
