// Test script to verify API routes
const BASE_URL = 'http://localhost:3000';

async function runTests() {
  console.log('🧪 Starting API Verification Tests...\n');

  // Test 1: Fetch walks
  console.log('1. Testing GET /api/walks...');
  const walksRes = await fetch(`${BASE_URL}/api/walks`);
  const walks = await walksRes.json();
  console.log(`   Status: ${walksRes.status}, Walks retrieved: ${walks.length}`);
  if (!Array.isArray(walks)) throw new Error('Walks response should be an array');

  // Test 2: Fetch past walks
  console.log('2. Testing GET /api/walks/past...');
  const pastRes = await fetch(`${BASE_URL}/api/walks/past`);
  const pastWalks = await pastRes.json();
  console.log(`   Status: ${pastRes.status}, Past walks retrieved: ${pastWalks.length}`);
  if (!Array.isArray(pastWalks)) throw new Error('Past walks response should be an array');

  // Test 3: Fetch birds
  console.log('3. Testing GET /api/birds...');
  const birdsRes = await fetch(`${BASE_URL}/api/birds`);
  const birds = await birdsRes.json();
  console.log(`   Status: ${birdsRes.status}, Birds retrieved: ${birds.length}`);
  if (!Array.isArray(birds)) throw new Error('Birds response should be an array');

  // Test 4: Fetch members
  console.log('4. Testing GET /api/members...');
  const membersRes = await fetch(`${BASE_URL}/api/members`);
  const members = await membersRes.json();
  console.log(`   Status: ${membersRes.status}, Members retrieved: ${members.length}`);
  if (!Array.isArray(members)) throw new Error('Members response should be an array');

  // Test 5: Unauthorized POST should fail
  console.log('5. Testing unauthorized POST /api/walks (should return 401)...');
  const unauthPost = await fetch(`${BASE_URL}/api/walks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: 'Hacker Walk',
      datetime: new Date().toISOString(),
      location: 'Nowhere',
    }),
  });
  console.log(`   Status: ${unauthPost.status} (Expected 401: ${unauthPost.status === 401})`);
  if (unauthPost.status !== 401) throw new Error('Unauthorized POST was not blocked');

  // Test 6: Invalid admin login
  console.log('6. Testing invalid login credentials...');
  const badLogin = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'wrongpassword' }),
  });
  console.log(`   Status: ${badLogin.status} (Expected 401: ${badLogin.status === 401})`);
  if (badLogin.status !== 401) throw new Error('Invalid credentials were accepted');

  // Test 7: Valid admin login
  console.log('7. Testing valid login credentials from the configured database user...');
  const goodLogin = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: process.env.TEST_ADMIN_USERNAME, password: process.env.TEST_ADMIN_PASSWORD }),
  });
  console.log(`   Status: ${goodLogin.status} (Expected 200: ${goodLogin.status === 200})`);
  if (goodLogin.status !== 200) throw new Error('Valid login failed');

  const cookieHeader = goodLogin.headers.get('set-cookie');
  if (!cookieHeader) throw new Error('Login did not return session cookie');
  const authCookie = cookieHeader.split(';')[0];
  console.log(`   Auth Cookie received: ${authCookie.slice(0, 30)}...`);

  // Test 8: Admin check with cookie
  console.log('8. Testing GET /api/auth/check with cookie...');
  const checkRes = await fetch(`${BASE_URL}/api/auth/check`, {
    headers: { Cookie: authCookie },
  });
  const checkData = await checkRes.json();
  console.log(`   Admin status: ${checkData.isAdmin} (Expected true)`);
  if (!checkData.isAdmin) throw new Error('Cookie verification failed');

  // Test 9: Authorized walk addition
  console.log('9. Testing authorized POST /api/walks...');
  const newWalkRes = await fetch(`${BASE_URL}/api/walks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: authCookie,
    },
    body: JSON.stringify({
      title: 'Kansal Wetlands Special',
      datetime: '2026-05-10T06:00:00.000Z',
      location: 'Kansal Checkpost',
      duration: '4 hours',
      desc: 'Early morning bird photography walk focusing on wetlands and riverine species.',
    }),
  });
  const newWalk = await newWalkRes.json();
  console.log(`   Created Walk ID: ${newWalk.id}, Title: "${newWalk.title}"`);
  if (newWalkRes.status !== 201) throw new Error('Authorized walk addition failed');

  // Test 10: Authorized bird sighting addition
  console.log('10. Testing authorized POST /api/birds...');
  const newBirdRes = await fetch(`${BASE_URL}/api/birds`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: authCookie,
    },
    body: JSON.stringify({
      name: 'Black Francolin',
      latin: 'Francolinus francolinus',
      location: 'Dhanas Grasslands',
      emoji: '🌾',
      spotter: 'Test Member',
      week: 'This week',
    }),
  });
  const newBird = await newBirdRes.json();
  console.log(`   Created Bird ID: ${newBird.id}, Name: "${newBird.name}"`);
  if (newBirdRes.status !== 201) throw new Error('Authorized bird sighting addition failed');

  // Test 11: Authorized member addition
  console.log('11. Testing authorized POST /api/members...');
  const newMemberRes = await fetch(`${BASE_URL}/api/members`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: authCookie,
    },
    body: JSON.stringify({
      name: 'Harman Preet',
      role: 'Bird Guide',
      year: 2025,
      specialty: 'Grassland Species',
    }),
  });
  const newMember = await newMemberRes.json();
  console.log(`   Created Member ID: ${newMember.id}, Name: "${newMember.name}"`);
  if (newMemberRes.status !== 201) throw new Error('Authorized member addition failed');

  console.log('\n🎉 ALL 11 API TESTS PASSED SUCCESSFULLY! ✅\n');
}

runTests().catch(err => {
  console.error('\n❌ Test Error:', err);
  process.exit(1);
});
