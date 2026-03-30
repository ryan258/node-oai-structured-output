import { jest } from '@jest/globals';
import request from 'supertest';

// Use unstable_mockModule for ESM mocking
jest.unstable_mockModule('../functions/generateTopics.js', () => ({
  generateTopics: jest.fn().mockResolvedValue(['Topic 1', 'Topic 2']),
}));
jest.unstable_mockModule('../functions/getUserInput.js', () => ({
  getUserInput: jest.fn().mockResolvedValue('Test Topic'),
}));
jest.unstable_mockModule('../functions/selectTopic.js', () => ({
  selectTopic: jest.fn().mockResolvedValue('Test Topic'),
}));
jest.unstable_mockModule('../functions/getStructuredOutput.js', () => ({
  getStructuredOutput: jest.fn().mockResolvedValue({
    title: "Test Scenario",
    description: "Test Description",
    items: ["Item 1", "Item 2"]
  }),
}));
jest.unstable_mockModule('../functions/generateFutureTimelines.js', () => ({
  generateFutureTimelines: jest.fn().mockResolvedValue({
    optimistic: "Optimistic view",
    pessimistic: "Pessimistic view",
    realistic: "Realistic view"
  }),
}));
jest.unstable_mockModule('../functions/generateInnovation.js', () => ({
  generateInnovation: jest.fn().mockResolvedValue({
    idea: "Test Innovation",
    potential: "High",
    challenges: "None"
  }),
}));
jest.unstable_mockModule('../functions/analyzeStakeholders.js', () => ({
  analyzeStakeholders: jest.fn().mockResolvedValue({
    stakeholders: [
      { name: "Stakeholder 1", role: "Role 1", description: "Description 1" }
    ]
  }),
}));
jest.unstable_mockModule('../functions/generateMarkdownForScenario.js', () => ({
  generateMarkdownForScenario: jest.fn().mockResolvedValue("# Test Scenario Markdown"),
}));
jest.unstable_mockModule('../functions/saveToFile.js', () => ({
  saveToFile: jest.fn().mockResolvedValue('./logs/test.md'),
}));
jest.unstable_mockModule('../functions/generateETA.js', () => ({
  generateETA: jest.fn().mockResolvedValue({ eta: "5 years" }),
}));
jest.unstable_mockModule('../functions/generateAnalogy.js', () => ({
  generateAnalogy: jest.fn().mockResolvedValue({
    event: "Historical Event",
    similarity: "Similar because...",
    lesson: "Lesson learned"
  }),
}));

// Dynamic import after mocks
const { app } = await import('../index.js');
const { AUTH_HEADER_NAME, MAX_TOPIC_LENGTH } = await import('../constants.js');

describe('API Integration Tests', () => {
  const ADMIN_KEY = 'test_admin_key';

  beforeAll(() => {
    process.env.ADMIN_API_KEY = ADMIN_KEY;
  });

  describe('GET /', () => {
    it('should return 200 and the index.html', async () => {
      const res = await request(app).get('/');
      expect(res.statusCode).toBe(200);
      expect(res.header['content-type']).toMatch(/text\/html/);
    });
  });

  describe('GET /api/scenarios', () => {
    it('should return 200 and an array', async () => {
      const res = await request(app).get('/api/scenarios');
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('GET /api/status', () => {
    it('should return 200 and status object', async () => {
      const res = await request(app).get('/api/status');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('isGenerating');
      expect(res.body).toHaveProperty('scenarioCount');
      expect(res.body).toHaveProperty('hasError');
    });
  });

  describe('POST /api/generate', () => {
    it('should return 401 if no API key is provided', async () => {
      const res = await request(app).post('/api/generate').send({ topic: 'AI' });
      expect(res.statusCode).toBe(401);
    });

    it('should return 401 if invalid API key is provided', async () => {
      const res = await request(app)
        .post('/api/generate')
        .set(AUTH_HEADER_NAME, 'wrong_key')
        .send({ topic: 'AI' });
      expect(res.statusCode).toBe(401);
    });

    it('should return 400 if topic is missing', async () => {
      const res = await request(app)
        .post('/api/generate')
        .set(AUTH_HEADER_NAME, ADMIN_KEY)
        .send({});
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toContain('Invalid request');
    });

    it('should return 400 if topic is empty', async () => {
      const res = await request(app)
        .post('/api/generate')
        .set(AUTH_HEADER_NAME, ADMIN_KEY)
        .send({ topic: '   ' });
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toContain('Topic cannot be empty');
    });

    it('should return 400 if topic exceeds max length', async () => {
      const longTopic = 'a'.repeat(MAX_TOPIC_LENGTH + 1);
      const res = await request(app)
        .post('/api/generate')
        .set(AUTH_HEADER_NAME, ADMIN_KEY)
        .send({ topic: longTopic });
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toContain(`${MAX_TOPIC_LENGTH} characters`);
    });

    it('should return 200 and start generation if valid', async () => {
      const res = await request(app)
        .post('/api/generate')
        .set(AUTH_HEADER_NAME, ADMIN_KEY)
        .send({ topic: 'Future of AI' });
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('processing');
    });
  });
});
