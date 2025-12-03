import fs from 'fs';

/**
 * Saves the generated content to a file in the logs directory.
 *
 * @param {string} content - The content to save.
 * @param {string} [prefix='ai_positive_scenarios'] - The prefix for the filename.
 * @returns {Promise<string>} A promise that resolves to the absolute path of the saved file.
 */
export async function saveToFile(content, prefix = 'ai_positive_scenarios') {
  const timestamp = new Date().toISOString().replace(/:/g, '-');
  const filename = `${prefix}_${timestamp}.md`;
  const directory = './logs';

  // Create the directory if it doesn't exist
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }

  try {
    await fs.promises.writeFile(`${directory}/${filename}`, content);
    console.log(`File '${filename}' saved to '${directory}' directory! `);
    return `${directory}/${filename}`;
  } catch (err) {
    console.error(`Error writing to file '${filename}':`, err);
  }
}
