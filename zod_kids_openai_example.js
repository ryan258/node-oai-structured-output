// zod_kids_openai_example.js
// Zod for Kids: Lesson 2 - Using Zod to check answers from OpenAI!
// This example asks OpenAI for a fun animal fact, then checks the answer with Zod.

import { z } from 'zod';
import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

// 1. Make a rule for the answer we want
const FactSchema = z.object({
  animal: z.string(),
  fact: z.string(),
  habitat: z.string(),
  diet: z.string(),
  lifespan: z.string(),
});

// 2. Set up OpenAI
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function askOpenAIForAnimalFact(animal) {
  // 3. Ask OpenAI for a fact about an animal
  const prompt = `Tell me a fun fact about a ${animal}. Format your answer as JSON like this: { "animal": "animal name", "fact": "fun fact about the animal", "habitat": "where it lives", "diet": "what it eats", "lifespan": "how long it lives" }`;
  const response = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: prompt },
    ],
    temperature: 0.5,
    max_tokens: 150,
  });

  // 4. Try to parse the answer as JSON
  let data;
  let content = response.choices[0].message.content.trim();
  // Remove code block markers if present
  if (content.startsWith('```')) {
    content = content.replace(/^```[a-zA-Z]*\n?/, '').replace(/```$/, '').trim();
  }
  try {
    data = JSON.parse(content);
  } catch (e) {
    console.error('OpenAI did not return valid JSON:', response.choices[0].message.content);
    return;
  }

  // 5. Use Zod to check the answer!
  const result = FactSchema.safeParse(data);
  if (result.success) {
    console.log('Yay! OpenAI gave us a good fact:', result.data);
  } else {
    console.error('Oops! The fact was not in the right format:', result.error.errors);
  }
}

// 6. Try it with your favorite animal!
askOpenAIForAnimalFact('penguin');
