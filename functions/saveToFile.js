import fs from 'fs';

export async function saveToFile(content) {
  const timestamp = new Date().toISOString().replace(/:/g, '-');
  const filename = `ai_positive_scenarios_${timestamp}.md`;
  const directory = './logs';

  // Create the directory if it doesn't exist
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }

  try {
    await fs.promises.writeFile(`${directory}/${filename}`, content);
    console.log(`File '${filename}' saved to '${directory}' directory! `);
  } catch (err) {
    console.error(`Error writing to file '${filename}':`, err);
  }
}
