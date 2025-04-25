import { z } from 'zod';

export const ScenarioSchema = z.object({
  title: z.string(),
  description: z.string(),
  items: z.array(z.string()),
});

export const ETASchema = z.object({
  eta: z.string(),
});

export const AnalogySchema = z.object({
  event: z.string(),
  similarity: z.string(),
  lesson: z.string(),
});

export const StakeholderSchema = z.object({
  name: z.string(),
  role: z.string(),
  description: z.string(),
});

export const StakeholdersSchema = z.object({
  stakeholders: z.array(StakeholderSchema),
});

export const InnovationSchema = z.object({
  idea: z.string(),
  potential: z.string(),
  challenges: z.string(),
});

export const FutureTimelinesSchema = z.object({
  optimistic: z.string(),
  pessimistic: z.string(),
  realistic: z.string(),
  wildcard: z.string().optional(),
});

// Add other schemas as needed
