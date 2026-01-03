const fs = require('fs');
const { execSync } = require('child_process');

const data = JSON.parse(fs.readFileSync('/Users/alexsouthwell/conductor/workspaces/kids-eat-free/daegu/lib/data/regions/act-canberra.json', 'utf8'));

// Test a sample of URLs from each type
const samples = {
  google_reviews: [],
  facebook: [],
  instagram: [],
  other: []
};

data.venues.forEach(venue => {
  venue.extraDetails?.forEach(detail => {
    if (samples[detail.type] && samples[detail.type].length < 3) {
      samples[detail.type].push({
        venue: venue.name,
        url: detail.url
      });
    }
  });
});

console.log('Testing URL reachability...\n');

let totalTested = 0;
let totalPassed = 0;

Object.entries(samples).forEach(([type, urls]) => {
  if (urls.length === 0) return;

  console.log(`${type.toUpperCase()}:`);
  urls.forEach(({ venue, url }) => {
    totalTested++;
    try {
      const cmd = `curl -s -o /dev/null -w "%{http_code}" "${url}"`;
      const status = execSync(cmd, { encoding: 'utf8' }).trim();
      const passed = status === '200' || status === '301' || status === '302';
      if (passed) totalPassed++;
      console.log(`  ${passed ? '✅' : '❌'} ${venue}: ${status}`);
    } catch (error) {
      console.log(`  ❌ ${venue}: ERROR - ${error.message}`);
    }
  });
  console.log('');
});

console.log(`\nSummary: ${totalPassed}/${totalTested} URLs reachable`);
