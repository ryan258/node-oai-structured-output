// zod_kids_example.js
// A super simple Zod example for kids!
// This program checks if a "pet" has the right information.

import { z } from 'zod';

// 1. Make a "pet" rule: Every pet needs a name (word) and age (number)
const PetSchema = z.object({
  name: z.string(),    // name must be a word
  age: z.number(),     // age must be a number
});

// 2. Try some pets!
const goodPet = { name: 'Fluffy', age: 3 };
const badPet = { name: 'Rex', age: 'old' }; // age is a word, not a number!

// 3. Check the good pet
try {
  const pet = PetSchema.parse(goodPet);
  console.log('Yay! This pet is OK:', pet);
} catch (e) {
  console.error('Oops! Something is wrong with the good pet:', e.errors);
}

// 4. Check the bad pet
try {
  const pet = PetSchema.parse(badPet);
  console.log('Yay! This pet is OK:', pet);
} catch (e) {
  console.error('Oops! Something is wrong with the bad pet:', e.errors);
}

// 5. Try safe checking (won't crash)
const result = PetSchema.safeParse(badPet);
if (result.success) {
  console.log('Safe check: Pet is OK:', result.data);
} else {
  console.error('Safe check: Pet has a problem:', result.error.errors);
}
