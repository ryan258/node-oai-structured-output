// zod_example.js
// Illustrates how to use Zod for structured outputs in Node.js

import { z } from 'zod';

// 1. Define a Zod schema for your output structure
const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  isActive: z.boolean().default(true),
});

// 2. Example data (could come from anywhere, e.g., API, user input)
const exampleData = {
  id: 1,
  name: 'Alice',
  email: 'alice@example.com',
};

const invalidData = {
  id: 'not-a-number',
  name: 'Bob',
  email: 'not-an-email',
};

// 3. Parse and validate data using the schema
try {
  const user = UserSchema.parse(exampleData);
  console.log('Valid user:', user);
} catch (e) {
  console.error('Validation failed for exampleData:', e.errors);
}

try {
  const user = UserSchema.parse(invalidData);
  console.log('Valid user:', user);
} catch (e) {
  console.error('Validation failed for invalidData:', e.errors);
}

// 4. Safe parsing (does not throw)
const result = UserSchema.safeParse(exampleData);
if (result.success) {
  console.log('Safe parse succeeded:', result.data);
} else {
  console.error('Safe parse failed:', result.error.errors);
}

// 5. Schema introspection (optional)
console.log('UserSchema shape:', UserSchema.shape);
