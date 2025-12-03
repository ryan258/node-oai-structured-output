import { generateScenarios } from '../index.js';
import fs from 'fs';
import path from 'path';

async function runMetagameDemos() {
    console.log('--- Starting Metagame X-Ray Demos Test ---');

    const demosPath = path.join(process.cwd(), 'demos.json');
    const demos = JSON.parse(fs.readFileSync(demosPath, 'utf-8'));
    const metagameTopics = demos['Metagame X-Ray'];

    if (!metagameTopics || metagameTopics.length === 0) {
        console.error('No Metagame X-Ray topics found!');
        process.exit(1);
    }

    console.log(`Found ${metagameTopics.length} topics.`);

    for (const [index, topic] of metagameTopics.entries()) {
        console.log(`\n[${index + 1}/${metagameTopics.length}] Running: "${topic}"`);
        try {
            await generateScenarios(topic);
            console.log(`✅ Completed: "${topic}"`);
        } catch (error) {
            console.error(`❌ Failed: "${topic}"`, error);
        }

        // Optional: Add a small delay to be nice to the API
        if (index < metagameTopics.length - 1) {
            console.log('Waiting 2 seconds...');
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }

    console.log('\n--- All Metagame Demos Completed ---');
    process.exit(0);
}

runMetagameDemos();
