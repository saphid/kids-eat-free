#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const regionsDir = path.join(__dirname, '../lib/data/regions');
const metadataPath = path.join(__dirname, '../lib/data/regions/metadata.json');

try {
  const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
  const regionFiles = fs.readdirSync(regionsDir).filter(f => f.endsWith('.json') && f !== 'metadata.json');

  let errors = [];

  regionFiles.forEach(file => {
    const filePath = path.join(regionsDir, file);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    if (!data.region || !data.venues || !Array.isArray(data.venues)) {
      errors.push(`${file}: Missing required fields (region, venues array)`);
      return;
    }

    data.venues.forEach((venue, index) => {
      const required = ['id', 'name', 'area', 'days', 'details', 'website', 'phone'];
      required.forEach(field => {
        if (!venue[field]) {
          errors.push(`${file}: Venue ${index + 1} missing field: ${field}`);
        }
      });

      if (!Array.isArray(venue.days)) {
        errors.push(`${file}: Venue ${index + 1} 'days' must be an array`);
      } else if (venue.days.length === 0) {
        errors.push(`${file}: Venue ${index + 1} 'days' array is empty`);
      } else {
        const validDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        venue.days.forEach(day => {
          if (!validDays.includes(day)) {
            errors.push(`${file}: Venue ${index + 1} has invalid day: ${day}`);
          }
        });
      }

      if (!Array.isArray(venue.phone)) {
        errors.push(`${file}: Venue ${index + 1} 'phone' must be an array`);
      } else if (venue.phone.length === 0) {
        errors.push(`${file}: Venue ${index + 1} 'phone' array is empty`);
      }

      if (!Array.isArray(venue.extraDetails)) {
        errors.push(`${file}: Venue ${index + 1} 'extraDetails' must be an array`);
      }
    });
  });

  if (errors.length > 0) {
    console.error('❌ Validation errors:');
    errors.forEach(err => console.error(`  - ${err}`));
    process.exit(1);
  }

  console.log('✅ All JSON data is valid!');
} catch (error) {
  console.error('❌ Validation failed:', error.message);
  process.exit(1);
}
