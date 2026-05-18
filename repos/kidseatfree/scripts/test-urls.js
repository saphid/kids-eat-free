const fs = require('fs');

const data = JSON.parse(fs.readFileSync('/Users/alexsouthwell/conductor/workspaces/kids-eat-free/daegu/lib/data/regions/act-canberra.json', 'utf8'));

let total = 0;
let errors = [];

data.venues.forEach(venue => {
  venue.extraDetails?.forEach(detail => {
    total++;
    const url = detail.url;

    // Check for common issues
    if (url === 'https://www.google.com/maps/place' ||
        url === 'https://www.google.com/maps/place/' ||
        url === 'https://facebook.com' ||
        url === 'https://instagram.com') {
      errors.push(`${venue.name} (${detail.type}): Incomplete URL - ${url}`);
    }

    // Check for proper URL format
    if (!url.startsWith('https://')) {
      errors.push(`${venue.name} (${detail.type}): Not using HTTPS - ${url}`);
    }
  });
});

console.log(`Total extra details URLs checked: ${total}`);
console.log(`Total URLs with issues: ${errors.length}`);

if (errors.length > 0) {
  console.log('\nIssues found:');
  errors.forEach(e => console.log('  ❌', e));
} else {
  console.log('\n✅ All URLs are properly formatted!');
}
