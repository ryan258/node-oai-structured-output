import http from 'http';
import { DEFAULT_PORT, AUTH_HEADER_NAME } from './constants.js';

const PORT = process.env.PORT || DEFAULT_PORT;
const BASE_URL = `http://localhost:${PORT}`;

function makeRequest(path, options = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request(`${BASE_URL}${path}`, options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, headers: res.headers, body: data }));
    });
    req.on('error', reject);
    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

async function test() {
  console.log('Testing Security Features...');

  try {
    // 1. Test Server Availability (Non-blocking startup)
    console.log('1. Testing Server Availability...');
    try {
      const res = await makeRequest('/');
      console.log(`   Status: ${res.statusCode} (Expected 200)`);
      if (res.statusCode === 200) console.log('   ✅ Server is up and responsive');
      else console.log('   ❌ Server failed to respond correctly');
    } catch (e) {
      console.log('   ❌ Server not reachable. Is it running?');
    }

    // 2. Test Security Headers (Helmet)
    console.log('\n2. Testing Security Headers...');
    const resHeaders = await makeRequest('/');
    if (resHeaders.headers['x-dns-prefetch-control']) {
      console.log('   ✅ Helmet headers detected (x-dns-prefetch-control)');
    } else {
      console.log('   ❌ Helmet headers missing');
    }

    // 3. Test Rate Limiting
    console.log('\n3. Testing Rate Limiting (Checking headers)...');
    const resRate = await makeRequest('/api/scenarios');
    if (resRate.headers['x-ratelimit-limit']) {
      console.log(`   ✅ Rate limit headers detected (Limit: ${resRate.headers['x-ratelimit-limit']})`);
    } else {
      console.log('   ❌ Rate limit headers missing');
    }

    // 4. Test Auth on Protected Route
    console.log('\n4. Testing Authentication on /api/generate...');

    // No Key
    const resNoKey = await makeRequest('/api/generate', { method: 'POST' });
    console.log(`   No Key: Status ${resNoKey.statusCode} (Expected 401)`);
    if (resNoKey.statusCode !== 401) console.log('   Body:', resNoKey.body);

    // With Key (Mock - this should match ADMIN_API_KEY in .env)
    const resWithKey = await makeRequest('/api/generate', {
      method: 'POST',
      headers: { [AUTH_HEADER_NAME]: 'secret123', 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic: 'Test Topic' })
    });
    console.log(`   With Key: Status ${resWithKey.statusCode}`);
    if (resWithKey.statusCode !== 200) console.log('   Body:', resWithKey.body);

    // 5. Test Status Endpoint
    console.log('\n5. Testing Status Endpoint...');
    const resStatus = await makeRequest('/api/status');
    console.log(`   Status: ${resStatus.statusCode} (Expected 200)`);
    if (resStatus.statusCode === 200) {
      const status = JSON.parse(resStatus.body);
      console.log(`   ✅ Status endpoint responding: isGenerating=${status.isGenerating}, scenarioCount=${status.scenarioCount}`);
    }

  } catch (error) {
    console.error('Test failed:', error);
  }
}

test();
