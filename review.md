# Code Review Notes

Personal code review and architecture notes for the AI Scenarios Generator.

## Project Overview

A Node.js application that generates optimistic AI future scenarios using OpenAI/OpenRouter APIs. Features structured output validation with Zod, an Express API backend, and a Vue.js frontend dashboard.

**Purpose:** Personal exploration of:
- AI-generated structured content
- Schema validation with Zod
- Async performance patterns
- Security best practices
- ESM testing patterns

---

## Architecture

### Backend (`index.js`)
- Express server with security middleware (Helmet, CORS, rate limiting)
- Authentication via `x-admin-key` header
- Background scenario generation
- In-memory storage (no persistence yet)

### Frontend (`index.html`)
- Single-file Vue.js 3 app
- CDN-loaded dependencies (Vue, Tailwind)
- Fetches from `/api/scenarios`
- Basic error handling

### Functions Module (`/functions/`)
Well-modularized AI operations:
- `openaiClient.js` - API client configuration
- `getStructuredOutput.js` - Structured AI responses
- `schemas.js` - Zod validation schemas
- Individual generators for ETA, analogies, stakeholders, etc.

---

## Current State Assessment

### Strengths ✅
1. **Clean modularization** - Functions well-separated by concern
2. **Schema validation** - Zod ensures type safety
3. **Security basics** - Helmet, CORS, rate limiting, authentication
4. **Performance** - Parallelized API calls (5x improvement)
5. **Non-blocking** - Server starts immediately
6. **Testing foundation** - Jest + Supertest configured
7. **Documentation** - Comprehensive README and setup guides

### Weaknesses 🔴
1. **No persistence** - All data in memory, lost on restart
2. **No caching** - Every run makes fresh (expensive) API calls
3. **Limited testing** - ~30% coverage, needs expansion
4. **Console logging** - No structured logging framework
5. **Global state** - `allScenariosData` and `isGenerating` are global
6. **No TypeScript** - Would benefit from type safety given Zod usage
7. **CDN dependencies** - Frontend should use bundled assets

---

## Security Analysis

### Implemented ✅
- Helmet.js security headers
- CORS with configurable origins
- Rate limiting (100 req/15min)
- API key authentication
- Input validation (type, length, sanitization)
- XSS/injection protection

### Missing ⚠️
- HTTPS enforcement
- Explicit request size limits
- Content Security Policy
- Audit logging
- Session management

**Overall:** Good for a personal project, needs hardening for production.

---

## Performance Notes

### Current Metrics
- Item processing: 3-5s (was 15-20s) ✅
- Total generation: 40-60s (was 3-4 min) ✅
- Server startup: <1s (was 60-90s) ✅

### Bottlenecks
- No caching - API calls on every generation
- Sequential scenario processing (could parallelize)
- In-memory storage limits scalability

### Future Optimizations
- Add Redis/file-based caching
- Parallelize scenario generation
- Add database persistence
- Implement request queuing

---

## Code Quality

### Good Practices
- ES6 modules throughout
- Async/await (no callbacks)
- Promise.all() for parallelization
- Proper error handling with try/catch/finally
- Clear function naming
- Separation of concerns

### Improvements Needed
- Extract magic strings/numbers to constants
- Add ESLint + Prettier
- Expand test coverage (aim for 80%)
- Add structured logging (Winston/Pino)
- Consider TypeScript migration
- Document API with Swagger

---

## Testing Status

### Current Coverage (~30%)
- 7 integration tests for API endpoints
- Authentication tests
- Input validation tests
- Basic happy path coverage

### Gaps
- No edge case tests (length validation, concurrent requests)
- No security header tests
- No rate limiting tests
- No unit tests for individual functions
- No mock for generation flow

### Next Steps
1. Add edge case tests
2. Test security headers
3. Test rate limiting behavior
4. Unit test each function in `/functions/`
5. Add coverage reporting

---

## Known Issues

1. **server.log file** - Created but not used (remove or implement)
2. **Flag management complexity** - `isGenerating` set in multiple places
3. **Error exposure** - Full stack traces sent to client
4. **.env.example** - Could use more detailed comments
5. **No status endpoint** - Can't check generation progress

---

## Future Roadmap

### High Priority
- [ ] Expand test coverage to 80%
- [ ] Add structured logging
- [ ] Implement status endpoint for progress
- [ ] Add caching layer

### Medium Priority
- [ ] Database persistence (SQLite)
- [ ] Proper error handling pattern
- [ ] Extract constants
- [ ] API documentation (Swagger)

### Low Priority
- [ ] TypeScript migration
- [ ] Frontend build process (Vite)
- [ ] Docker containerization
- [ ] API versioning

### Future Ideas
- WebSocket for real-time updates
- Export functionality (PDF, JSON)
- Scenario history/comparison
- Multi-model comparison
- Custom prompt templates

---

## Lessons Learned

### What Worked Well
1. **Zod validation** - Caught many issues, great DX
2. **Parallelization** - Massive performance win (5x)
3. **Modular functions** - Easy to test and maintain
4. **OpenRouter** - Access to multiple models is powerful

### Challenges
1. **ESM mocking** - Required `jest.unstable_mockModule`
2. **Testing async flows** - Needed careful mock setup
3. **State management** - Global state limits scalability
4. **Performance optimization** - Sequential vs parallel not obvious at first

### Next Time
- Start with TypeScript from the beginning
- Set up testing framework earlier
- Use structured logging from day one
- Consider database from the start
- Plan for caching early

---

## Personal Notes

This project has been a great learning experience for working with AI APIs and structured outputs. The Zod integration is particularly elegant - it ensures type safety without TypeScript and provides clear error messages.

The performance improvements from parallelization were dramatic and show the importance of profiling and understanding async patterns. The security additions (Helmet, rate limiting, authentication) were straightforward but important to understand for any web API.

Testing ESM modules required learning about `jest.unstable_mockModule`, but the result is a solid foundation for expansion. The documentation effort (README, roadmap, setup guides) pays dividends when returning to the project after time away.

Overall: A successful exploration of AI-powered content generation with solid engineering practices. Room for growth, but a strong foundation to build on.

---

**Last Updated:** December 1, 2025
