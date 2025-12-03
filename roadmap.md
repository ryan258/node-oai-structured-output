# Development Roadmap

Personal project tracking for AI Scenarios Generator.

## Progress Summary

**Last Updated:** December 2, 2025

### Current Status
- **Completed:** 9 tasks ✅
- **In Progress:** 0 tasks 🔄
- **Backlog:** 30 tasks 📋
- **Total Tracked:** 39

### Recent Wins
- ✅ Fixed all 5 critical bugs
- ✅ Added authentication & security middleware
- ✅ Implemented comprehensive input validation
- ✅ Added test framework (Jest + Supertest)
- ✅ Parallelized API calls (5x performance boost)
- 🎉 **Bonus:** OpenRouter integration (100+ AI models)

---

## Completed Tasks ✅

### Critical Bugs (5/5 Fixed)
1. ✅ Dynamic scenario count (was hardcoded)
2. ✅ Recursive await bug in topic selection
3. ✅ Port standardization (now 4000 everywhere)
4. ✅ README syntax error fixed
5. ✅ Variable naming consistency

### Security & Authentication (4/4 Fixed)
6. ✅ API key validation with clear errors
7. ✅ Input sanitization (XSS, injection protection)
8. ✅ CORS configuration
9. ✅ Rate limiting (100 req/15min)

### Performance (2/2 Fixed)
14. ✅ Parallelized API calls (5x faster)
15. ✅ Non-blocking server startup

### User Experience (1/1 Fixed)
12. ✅ Frontend error handling

### API Features (1/1 Complete)
13. ✅ POST `/api/generate` endpoint for triggering scenarios

---

## Active Backlog 📋

### High Priority

#### Testing
- [ ] Expand test coverage to 80%
  - Add edge case tests (length validation, concurrent requests)
  - Add security header tests
  - Add rate limiting tests

#### Error Handling
- [ ] Graceful degradation when generation fails
- [ ] Consistent error handling pattern across functions

#### Features
- [ ] Status endpoint for checking generation progress (`/api/status`)
- [ ] WebSocket or SSE for real-time progress updates

### Medium Priority

#### Performance
- [ ] Caching layer (Redis or file-based)
- [ ] Database persistence (SQLite to start)
- [ ] Request queuing for concurrent operations

#### Code Quality
- [ ] Structured logging (Winston/Pino)
- [ ] Extract magic numbers/strings to constants
- [ ] ESLint + Prettier setup
- [ ] Encapsulate global state

#### Documentation
- [ ] API endpoint documentation (Swagger)
- [ ] Architecture diagram

### Low Priority

#### Architecture
- [ ] TypeScript migration
- [ ] API versioning (`/api/v1/...`)
- [ ] Separate frontend/backend
- [ ] Docker containerization

#### Features
- [ ] Export functionality (PDF, JSON)
- [ ] Scenario history/browsing
- [ ] Custom prompts via UI

---

## Implementation Plan

### Phase 1: Foundation ✅ (Complete)
- [x] Fix critical bugs
- [x] Add security middleware
- [x] Add authentication
- [x] Add input validation
- [x] Parallelize API calls
- [x] Non-blocking startup
- [x] Test framework

### Phase 2: Testing & Quality (Next)
- [ ] Expand test coverage
- [ ] Add structured logging
- [ ] Error handling patterns
- [ ] Code style tools

### Phase 3: Features (In Progress)
- [x] Generation API endpoint
- [ ] Progress tracking endpoint
- [ ] Caching layer
- [ ] Database persistence

### Phase 4: Polish (Later)
- [ ] Export functionality
- [ ] API documentation
- [ ] Monitoring/observability
- [ ] Docker setup

### Phase 5: Future Ideas
- [ ] TypeScript migration
- [ ] Frontend rebuild (Vite + Vue 3)
- [ ] Multi-user support
- [ ] Cloud deployment

---

## Performance Metrics

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Item Processing | 15-20s | 3-5s | **5x faster** |
| Total Generation | 3-4 min | 40-60s | **4x faster** |
| Server Startup | 60-90s | <1s | **90x faster** |
| Test Coverage | 0% | ~30% | Started |

---

## Recent Changelog

### December 1, 2025 - Major Security & Performance Update

#### Security Improvements ✅
- Added Helmet.js for security headers
- Implemented CORS with configurable origins
- Added express-rate-limit (100 req/15min)
- Fixed authentication bypass vulnerability
- Added comprehensive input validation
- Fixed race condition in concurrent requests

#### Performance Improvements ✅
- Parallelized API calls using Promise.all() - **5x faster**
- Non-blocking server startup - **90x faster**
- Reduced total generation time from 3-4 min to 40-60s

#### Testing ✅
- Added Jest + Supertest framework
- Created 7 integration tests for API endpoints
- Configured ESM module mocking
- Added test environment setup

#### Code Quality ✅
- Removed commented code
- Improved async/await patterns
- Enhanced error handling with finally blocks
- Better separation of concerns

#### Documentation ✅
- Enhanced .env.example with inline docs
- Created comprehensive roadmap
- Added OpenRouter setup guide
- Updated README

#### Dependencies Added
```json
{
  "jest": "^30.2.0",
  "supertest": "^7.1.4",
  "cors": "^2.8.5",
  "express-rate-limit": "^8.2.1",
  "helmet": "^8.1.0"
}
```

**Total Changes:** +5,628 lines / -538 lines across 8 files

---

## Notes

### Known Issues
- Server.log file created but not used (should remove or implement logging)
- isGenerating flag management could be simplified
- .env.example could use more detailed comments
- Need more test coverage for edge cases

### Future Considerations
- Consider WebSocket for real-time updates instead of polling
- Might want to add Redis for caching if this scales
- TypeScript would be beneficial given the Zod usage
- Could benefit from a proper frontend build process

### Ideas to Explore
- Generate scenarios based on current events/trends
- Allow users to rate/favorite scenarios
- Compare scenarios across different AI models
- Time-based tracking of predictions vs reality
- Community sharing of interesting scenarios

---

## 🎯 Demo Use Cases: 20 Exceptional Topics

Topics designed to generate surprising insights, challenge assumptions, and explore unexplored territory. These aren't the obvious "AI + X" narratives—they're thought experiments that could actually happen.

### 💰 Hidden Markets & Arbitrage (4)
1. **The Death of Credentials: Skills-First Hiring at Global Scale**
   - _Why:_ Destroys entire industries (education, HR), creates new ones, provably happening now
2. **AI-Powered Micro-Factories: Etsy Sellers Competing with Nike**
   - _Why:_ Democratized manufacturing, supply chain disruption, local production renaissance
3. **Predictive Litigation: AI That Tells You What Laws Will Pass in 5 Years**
   - _Why:_ Policy arbitrage, regulatory foresight as a service, shapes lobbying
4. **Synthetic Influencers Replacing Celebrity Endorsements**
   - _Why:_ Already happening, reveals authenticity crisis, billion-dollar marketing shift

### 🧠 Second-Order Societal Effects (4)
5. **When Rural Areas Become More Valuable Than Cities (Remote Work 2.0)**
   - _Why:_ Real estate paradigm flip, reverses urbanization, community rebirth
6. **The Great Unbundling: Universities Lose Their Monopoly on Social Capital**
   - _Why:_ Network effects disrupted, credentialing vs. learning split
7. **AI Therapists Create a Mental Health Literacy Boom**
   - _Why:_ Democratizes self-awareness, changes parenting/relationships, reduces stigma
8. **Algorithmic Dating Causes Society to Rethink What "Love" Means**
   - _Why:_ Philosophical crisis, cultural evolution, questions free will

### 🔬 Weird Science & Edge Cases (4)
9. **Computational Biology Discovers Emotions Are Contagious Like Viruses**
   - _Why:_ Reframes mental health, social networks as epidemiology, new interventions
10. **AI Finds Patterns in "Junk DNA" That Rewrite Evolution Theory**
    - _Why:_ Paradigm-shifting science, challenges dogma, medical breakthroughs
11. **Crowd-Sourced Drug Discovery: TikTok Users Find Cancer Cure**
    - _Why:_ Democratized science, citizen researchers, institutional disruption
12. **AI Detects Pre-Crime Patterns (But Used for Prevention, Not Punishment)**
    - _Why:_ Minority Report but ethical, intervention vs. incarceration

### 🎭 Cultural & Creative Disruption (4)
13. **AI Resurrects Dead Artists to Collaborate with Living Ones**
    - _Why:_ Copyright nightmare, creative renaissance, questions authorship/originality
14. **Hyper-Personalized Religion: AI Spiritual Advisors for 8 Billion People**
    - _Why:_ Disrupts organized religion, personal meaning-making, philosophy of belief
15. **Real-Time Fact-Checking Makes Lying Obsolete (The Post-Deception Era)**
    - _Why:_ Truth as infrastructure, death of propaganda, political realignment
16. **AI-Generated Nostalgia: Personalized "Memories" of Childhoods You Never Had**
    - _Why:_ Memory manipulation, therapeutic applications, identity questions

### 🌌 Existential & Philosophical (4)
17. **The Turing Test Reverses: Humans Prove They're NOT AI**
    - _Why:_ Identity crisis, bot detection everywhere, CAPTCHA dystopia becomes real
18. **AI Solves the Fermi Paradox by Finding Alien Civilizations in Our Data**
    - _Why:_ Recontextualizes everything, hidden signals in plain sight, cosmic implications
19. **Consciousness Uploading Creates a "Death Optional" Society**
    - _Why:_ Ultimate disruption, inheritance law chaos, meaning of mortality
20. **AI Discovers We're Living in a Simulation (And It Doesn't Matter)**
    - _Why:_ Philosophical bomb, apathy vs. action, reveals what humans truly value

### 💡 What Makes These Better
- **Non-Obvious:** Not the standard futurist talking points
- **Second-Order Thinking:** Explores ripple effects, not just direct applications
- **Controversy Built-In:** Each challenges existing power structures or beliefs
- **Concrete & Specific:** Actionable insights, not vague aspirations
- **Spans Disciplines:** Forces unusual connections (biology + social networks, religion + personalization)
- **Actually Possible:** Grounded in real trends, not sci-fi fantasy

---

## 🎮 Metagame X-Ray: 10 Demos That Expose How The World Really Works

Topics that reveal the hidden games, power structures, and strategic layers beneath surface-level reality. These expose the mechanisms that insiders know but rarely discuss.

### The List

1. **AI Exposes the College Admissions Metagame: How Legacy, Donations & Connections Actually Work**
   - _Reveals:_ The real sorting algorithm isn't merit—it's network access and wealth signaling
   - _Impact:_ Destroys the meritocracy myth, forces transparency, creates counter-institutions

2. **The Great Reputational Arbitrage: How AI Makes "Status" Tradeable Like Currency**
   - _Reveals:_ Social capital is the ultimate currency, but it's currently illiquid and opaque
   - _Impact:_ LinkedIn meets prediction markets, status becomes financialized, new class hierarchies

3. **Regulatory Capture Becomes Visible: AI Maps Every Lobbyist-to-Law Connection**
   - _Reveals:_ Which corporations write which laws, the true cost of legislation, bought politicians
   - _Impact:_ Sunlight as disinfectant, voter outrage, possible democratic renewal

4. **The Attention Economy's Dark Patterns: AI Reveals What Apps Are Really Optimizing For**
   - _Reveals:_ Apps don't optimize for user benefit—they optimize for addiction and data extraction
   - _Impact:_ Consumer backlash, regulation, ethical design movement

5. **AI Decodes Luxury Goods: The Markup Metagame of Signaling vs. Quality**
   - _Reveals:_ $10k handbags cost $100 to make; you're buying the signal, not the bag
   - _Impact:_ Luxury industry crisis, shift to "quiet luxury," new signaling mechanisms

6. **The Talent Allocation Tragedy: AI Shows Where Top Minds Actually Go vs. Where They're Needed**
   - _Reveals:_ Best engineers build ad platforms, not cure cancer; misaligned incentives everywhere
   - _Impact:_ Brain drain becomes visible, mission-driven recruiting boom, prestige realignment

7. **Insurance as Legalized Information Asymmetry: AI Prices Risk Perfectly, Destroys the Model**
   - _Reveals:_ Insurance only works when companies know more than customers; AI breaks this
   - _Impact:_ Death of traditional insurance, rise of risk pools, regulatory chaos

8. **The Media Narrative Machine: AI Traces How Stories Propagate Through Influence Networks**
   - _Reveals:_ Who sets the agenda, which outlets copy which, the echo chamber topology
   - _Impact:_ Media literacy explosion, trust collapse accelerates, new verification systems

9. **The "Meritocracy" of VC Funding: AI Shows Pattern-Matching Bias in Startup Investment**
   - _Reveals:_ VCs fund "Stanford dropout building X for Y" not "best idea"—it's all signaling
   - _Impact:_ Alternative funding models, geographic diversification, bias becomes undeniable

10. **The Coordination Tax: AI Calculates the True Cost of Bureaucracy, Meetings, and Red Tape**
    - _Reveals:_ Organizations spend 40-60% of time on coordination overhead, not value creation
    - _Impact:_ Organizational redesign, async-first movement, productivity revolution

### 🎯 Why These Are Metagame X-Rays

- **Expose Asymmetries:** Reveal information/power imbalances that benefit insiders
- **Challenge Sacred Cows:** Attack narratives that powerful institutions depend on
- **Make Invisible Visible:** Quantify things everyone "knows" but can't prove
- **Force Honesty:** Create data that's too clear to ignore or spin
- **Redistribute Power:** Give outsiders the knowledge insiders have
- **Second-Order Chaos:** Revealing the metagame changes the game itself

### 💰 Profit & Insight Potential

Each of these could be:
- **A Business:** Build the tool that does this analysis
- **A Report:** Sell the insights to those who need them
- **A Movement:** Rally people around the revealed truth
- **A Threat:** Disrupt the incumbents who benefit from opacity

---

## 🏛️ Political Metagame X-Ray: 10 Demos That Expose Power Structures

Topics that x-ray politicians, parties, media, and international relations. These reveal the actual playbooks, not the civics class version.

### The List

11. **The Politician Time Audit: AI Tracks Where Elected Officials Actually Spend Their Hours**
    - _Reveals:_ 70% fundraising, 20% party politics, 10% governing; constituent service is theater
    - _Impact:_ Public outrage, campaign finance reform pressure, exposing the real job description

12. **The Revolving Door Database: AI Maps Government-to-Lobbying Career Paths in Real-Time**
    - _Reveals:_ Regulatory capture isn't a bug, it's the career path; who regulates who they'll work for
    - _Impact:_ Cooling-off period enforcement, corruption becomes undeniable, systemic change demands

13. **Legislative Ghostwriting Exposed: AI Matches Bill Language to Lobbyist Template Libraries**
    - _Reveals:_ Corporations literally write laws word-for-word, legislators just file them
    - _Impact:_ "Who really wrote this?" becomes standard question, legislative transparency revolution

14. **The Primary Gatekeeping Machine: How Parties Filter Out Threats Before Voters See Them**
    - _Reveals:_ Party apparatus kills insurgent candidates pre-primary via funding/endorsements/media blackout
    - _Impact:_ Primary reform movements, rank-choice voting surge, party power erodes

15. **News Outlet Ownership → Editorial Slant: AI Maps Corporate Parents to Coverage Bias**
    - _Reveals:_ Sinclair/Fox/CNN parent company interests directly predict coverage; journalism is PR
    - _Impact:_ Media literacy explosion, cord-cutting accelerates, decentralized news rises

16. **The Outrage Optimization Algorithm: What Stories News Chooses to Amplify (And Why)**
    - _Reveals:_ Coverage decisions optimize for engagement/ad revenue, not importance; manufactured controversy
    - _Impact:_ Audience backlash, ethical journalism branding, algorithmic transparency demands

17. **Access Journalism's Quid Pro Quo: AI Tracks Which Reporters Get Leaks (And What They Give Up)**
    - _Reveals:_ "Exclusive access" = stenography for sources; journalists trade integrity for scoops
    - _Impact:_ Source-journalist relationship scrutiny, anonymous vs. access journalism divide

18. **The Soft Power Network: AI Maps Cultural Influence Operations Across Countries**
    - _Reveals:_ Confucius Institutes, think tank funding, university donations = influence ops, not charity
    - _Impact:_ Foreign influence transparency, academic independence questions, geopolitical awareness

19. **Economic Hitman Playbook Decoded: IMF/World Bank Loan Conditions → Resource Extraction**
    - _Reveals:_ "Development aid" = debt trap diplomacy; austerity measures benefit creditors, not countries
    - _Impact:_ Global South revolt, alternative development models, BRICS/non-Western institutions rise

20. **The Sanctions Metagame: Who Really Pays for Economic Warfare (Hint: Not Elites)**
    - _Reveals:_ Sanctions hurt populations, enrich connected oligarchs, rarely achieve stated goals
    - _Impact:_ Humanitarian cost visibility, policy effectiveness scrutiny, alternative pressure mechanisms

### 🎯 Why These Are Political X-Rays

- **Expose The Real Game:** Civics class vs. actual power dynamics
- **Follow The Money:** Who funds who, who owes who, who profits
- **Reveal Incentives:** Why actors behave as they do (not their stated reasons)
- **Map The Networks:** Power isn't positions, it's relationships
- **Question Narratives:** Official story vs. operational reality
- **Democratize Intel:** Give citizens what investigative journalists/insiders know

### 🔥 Impact Potential

These demos could:
- **Fuel Reform Movements:** Give activists data-driven ammunition
- **Create Accountability Tools:** Watchdog orgs powered by AI
- **Shift Public Consciousness:** Make the invisible visible at scale
- **Threaten Institutions:** Opacity is power; transparency is revolution
- **Generate Controversy:** Each one pisses off powerful people (feature, not bug)
- **Build Counter-Power:** Knowledge redistribution is power redistribution
