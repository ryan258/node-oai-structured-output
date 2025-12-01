# Project Roadmap: Fixes and Enhancements

## Critical Bugs (Fix Immediately)

### 1. Incorrect Scenario Count in Output
**Location:** `index.js:139`
**Issue:** Hardcoded text says "TWO distinct scenarios" but code generates 3-5 scenarios
**Fix:** Update the text to dynamically reflect actual scenario count or make it generic
**Priority:** High

### 2. Recursive Function Missing Await
**Location:** `functions/selectTopic.js:20`
**Issue:** Recursive call to `selectTopic()` is not awaited, could cause promise chain issues
**Fix:** Add `await` before the recursive call
**Priority:** High

### 3. Port Number Mismatch
**Location:** `index.js:22` vs README.md
**Issue:** Default port is 3003 in code but README says 4000
**Fix:** Align both to use the same default (recommend 4000 as per .env.example)
**Priority:** Medium

### 4. Documentation Code Error
**Location:** `README.md:82`
**Issue:** Example code has syntax error: `default const` should be `const`
**Fix:** Remove the word "default"
**Priority:** Medium

### 5. Variable Name Mismatch
**Location:** `functions/generateMarkdownForScenario.js:5`
**Issue:** Function parameter is `timelines` but should be consistent with data structure `futureTimelines`
**Fix:** Rename parameter or fix the destructuring
**Priority:** Low

## Security Issues

### 6. Missing API Key Validation
**Issue:** No validation that OPENAI_API_KEY exists before making API calls
**Impact:** Application crashes with unhelpful error if key is missing
**Fix:** Add validation in openaiClient.js that checks for API key and provides clear error message
**Priority:** High

### 7. No Input Sanitization
**Issue:** User input from readline is not sanitized or validated
**Impact:** Potential injection vulnerabilities
**Fix:** Add input validation and sanitization for user prompts
**Priority:** High

### 8. Missing CORS Configuration
**Issue:** No CORS headers configured on Express server
**Impact:** Cannot access API from different origins
**Fix:** Add CORS middleware with appropriate configuration
**Priority:** Medium

### 9. No Rate Limiting
**Issue:** API endpoints have no rate limiting
**Impact:** Vulnerable to abuse, could rack up OpenAI costs
**Fix:** Implement rate limiting middleware
**Priority:** Medium

### 10. Exposed API Costs
**Issue:** Public API endpoint triggers expensive AI operations
**Impact:** Anyone can trigger costly API calls
**Fix:** Add authentication or move generation to authenticated endpoint
**Priority:** High

## Error Handling

### 11. Graceful Degradation Missing
**Issue:** If scenario generation fails, server still starts with empty data
**Impact:** Poor user experience - blank page with no explanation
**Fix:** Add proper error states and user messaging
**Priority:** High

### 12. No Frontend Error Handling
**Location:** `index.html:77-85`
**Issue:** Fetch call has catch but only logs to console
**Impact:** User sees "Loading..." forever on error
**Fix:** Display error message to user
**Priority:** High

### 13. Inconsistent Error Handling
**Issue:** Some functions have try/catch, others don't; no consistent error handling strategy
**Fix:** Implement consistent error handling across all async functions
**Priority:** Medium

## Performance Issues

### 14. Sequential API Calls
**Location:** `index.js:95-109`
**Issue:** All AI analyses run sequentially for each item
**Impact:** Very slow - 5 API calls per item done one at a time
**Fix:** Parallelize independent API calls using Promise.all()
**Priority:** High
**Estimated Impact:** 5x faster scenario generation

### 15. Blocking Server Startup
**Location:** `index.js:161-163`
**Issue:** Express server only starts after all scenario generation completes
**Impact:** Long wait time before server is accessible
**Fix:** Start server first, generate scenarios in background, add loading state to UI
**Priority:** High

### 16. No Caching
**Issue:** Every run makes fresh API calls, no caching of results
**Impact:** Unnecessary API costs and latency
**Fix:** Implement caching layer (file-based or Redis)
**Priority:** Medium

### 17. No Request Queuing
**Issue:** If multiple scenarios are generated, all API calls happen simultaneously
**Impact:** Could hit rate limits, overwhelm API
**Fix:** Implement request queue with concurrency control
**Priority:** Low

## Code Quality

### 18. No TypeScript
**Issue:** Project uses JavaScript without type safety
**Impact:** Runtime errors, harder to maintain
**Fix:** Migrate to TypeScript
**Priority:** Medium
**Effort:** High

### 19. No Tests
**Issue:** Zero test coverage
**Impact:** Cannot verify changes don't break functionality
**Fix:** Add unit tests (Jest) and integration tests
**Priority:** High

### 20. Commented Out Code
**Locations:** `index.js:4`, `index.html:10`
**Issue:** Unused commented code left in files
**Fix:** Remove or uncomment with explanation
**Priority:** Low

### 21. Magic Strings and Numbers
**Issue:** Hardcoded values scattered throughout (model names, port numbers, prompts)
**Fix:** Extract to constants or configuration files
**Priority:** Medium

### 22. No Logging Framework
**Issue:** Using console.log everywhere
**Impact:** No log levels, difficult to filter in production
**Fix:** Implement proper logging (Winston, Pino)
**Priority:** Low

### 23. Global Mutable State
**Location:** `index.js:23`
**Issue:** `allScenariosData` is global mutable array
**Impact:** Not thread-safe, hard to test
**Fix:** Encapsulate in a proper data store or service
**Priority:** Medium

## Architecture Improvements

### 24. Tight Coupling
**Issue:** Server and data generation are tightly coupled in main function
**Impact:** Cannot test independently, hard to modify
**Fix:** Separate concerns - create ScenarioService, separate routes
**Priority:** Medium

### 25. No API Versioning
**Issue:** API endpoint `/api/scenarios` has no version
**Impact:** Breaking changes will break clients
**Fix:** Add versioning: `/api/v1/scenarios`
**Priority:** Low

### 26. No Database
**Issue:** All data in memory, lost on restart
**Impact:** Cannot persist scenarios, review history
**Fix:** Add SQLite or PostgreSQL for persistence
**Priority:** Medium

### 27. Monolithic Structure
**Issue:** Everything in single process
**Impact:** Hard to scale, deploy, maintain
**Fix:** Consider separating frontend/backend, containerization
**Priority:** Low

## Missing Features

### 28. No Regeneration Capability
**Issue:** Must restart entire server to generate new scenarios
**Impact:** Poor developer experience
**Fix:** Add POST endpoint to trigger new scenario generation
**Priority:** High

### 29. No Export Functionality
**Issue:** Generated markdown saved to logs/ but not accessible from UI
**Impact:** Users cannot easily save/share results
**Fix:** Add export button in UI (download as MD, PDF, JSON)
**Priority:** Medium

### 30. No Progress Indicators
**Issue:** During generation, no feedback on progress
**Impact:** User doesn't know if it's working or frozen
**Fix:** Add WebSocket or SSE for real-time progress updates
**Priority:** Medium

### 31. No Scenario History
**Issue:** Cannot view previously generated scenarios
**Impact:** Lost work, no comparison capability
**Fix:** Add database and history view in UI
**Priority:** Low

### 32. No Configuration UI
**Issue:** All configuration via .env file and code
**Impact:** Non-technical users cannot customize
**Fix:** Add admin panel for configuration
**Priority:** Low

## Documentation

### 33. Incomplete .env.example
**Issue:** No comments explaining what each variable does
**Fix:** Add comprehensive comments for each environment variable
**Priority:** Medium

### 34. No API Documentation
**Issue:** No docs for API endpoints
**Fix:** Add OpenAPI/Swagger documentation
**Priority:** Low

### 35. No Contributing Guide
**Issue:** No CONTRIBUTING.md for potential contributors
**Fix:** Add contribution guidelines
**Priority:** Low

### 36. No Changelog
**Issue:** No CHANGELOG.md tracking changes
**Fix:** Add changelog following Keep a Changelog format
**Priority:** Low

## Dependencies

### 37. Outdated Tailwind CSS
**Location:** `index.html:6`
**Issue:** Using Tailwind CSS 2.2.19 (current is 3.x)
**Impact:** Missing features, potential security issues
**Fix:** Upgrade to Tailwind CSS 3.x
**Priority:** Low

### 38. CDN Dependencies in Production
**Issue:** Vue.js and Tailwind loaded from CDN
**Impact:** External dependency, no version lock, slower load
**Fix:** Use npm packages and build step (Vite)
**Priority:** Medium

### 39. No Dependency Scanning
**Issue:** No automated security scanning of dependencies
**Fix:** Add npm audit to CI/CD, use Dependabot
**Priority:** Medium

## Implementation Roadmap

### Phase 1: Critical Fixes (Week 1)
- [x] Fix API key validation (#6)
- [x] Fix input sanitization (#7)
- [x] Fix scenario count text (#1)
- [x] Fix port mismatch (#3)
- [x] Fix recursive await (#2)
- [x] Add frontend error handling (#12)
- [ ] Implement graceful degradation (#11)

### Phase 2: Performance (Week 2)
- [ ] Parallelize API calls (#14)
- [ ] Non-blocking server startup (#15)
- [ ] Add loading/progress indicators (#30)
- [ ] Implement basic caching (#16)

### Phase 3: Security & Reliability (Week 3)
- [ ] Add CORS configuration (#8)
- [ ] Implement rate limiting (#9)
- [ ] Add authentication (#10)
- [ ] Consistent error handling (#13)
- [ ] Add basic tests (#19)

### Phase 4: Features (Week 4)
- [ ] Add regeneration endpoint (#28)
- [ ] Add export functionality (#29)
- [ ] Improve documentation (#33, #34)
- [ ] Add request queuing (#17)

### Phase 5: Architecture (Future)
- [ ] Add database (#26)
- [ ] Migrate to TypeScript (#18)
- [ ] Add logging framework (#22)
- [ ] Refactor to service architecture (#24)
- [ ] Add scenario history (#31)
- [ ] Upgrade dependencies (#37, #38)
- [ ] Add proper build process (#38)

## Metrics for Success

- **Performance:** Scenario generation time reduced by 70% (via parallelization)
- **Reliability:** 100% uptime, graceful error handling
- **Security:** Zero high/critical security vulnerabilities
- **Code Quality:** 80%+ test coverage
- **User Experience:** Progress feedback, error messages, export capability
