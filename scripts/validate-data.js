#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../data');
const metadataPath = path.join(dataDir, 'metadata.json');

try {
  const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
  
  let errors = [];
  let venueCount = 0;
  let regionCount = 0;

  // Validate each region defined in metadata
  Object.entries(metadata.regions).forEach(([regionId, regionConfig]) => {
    regionCount++;
    
    // Check if venue file exists
    const venueFilePath = path.join(dataDir, regionConfig.files.venues);
    if (!fs.existsSync(venueFilePath)) {
      errors.push(`Region ${regionId}: Venue file not found at ${regionConfig.files.venues}`);
      return;
    }

    // Check if suburb file exists
    const suburbFilePath = path.join(dataDir, regionConfig.files.suburbs);
    if (!fs.existsSync(suburbFilePath)) {
      errors.push(`Region ${regionId}: Suburb file not found at ${regionConfig.files.suburbs}`);
    }

    // Validate venue data
    const venueData = JSON.parse(fs.readFileSync(venueFilePath, 'utf8'));
    
    if (!venueData.region || !venueData.venues || !Array.isArray(venueData.venues)) {
      errors.push(`Region ${regionId}: Missing required fields (region, venues array)`);
      return;
    }

    if (venueData.region !== regionId) {
      errors.push(`Region ${regionId}: Venue file region "${venueData.region}" doesn't match expected "${regionId}"`);
    }

    venueData.venues.forEach((venue, index) => {
      venueCount++;
      const required = ['id', 'name', 'area', 'days', 'details', 'website', 'phone'];
      required.forEach(field => {
        if (!venue[field]) {
          errors.push(`Region ${regionId}: Venue ${index + 1} (${venue.name || 'unnamed'}) missing field: ${field}`);
        }
      });

      if (!Array.isArray(venue.days)) {
        errors.push(`Region ${regionId}: Venue ${index + 1} (${venue.name}) 'days' must be an array`);
      } else if (venue.days.length === 0) {
        errors.push(`Region ${regionId}: Venue ${index + 1} (${venue.name}) 'days' array is empty`);
      } else {
        const validDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        venue.days.forEach(day => {
          if (!validDays.includes(day)) {
            errors.push(`Region ${regionId}: Venue ${index + 1} (${venue.name}) has invalid day: ${day}`);
          }
        });
      }

      if (!Array.isArray(venue.phone)) {
        errors.push(`Region ${regionId}: Venue ${index + 1} (${venue.name}) 'phone' must be an array`);
      } else if (venue.phone.length === 0) {
        errors.push(`Region ${regionId}: Venue ${index + 1} (${venue.name}) 'phone' array is empty`);
      }

      if (!Array.isArray(venue.extraDetails)) {
        errors.push(`Region ${regionId}: Venue ${index + 1} (${venue.name}) 'extraDetails' must be an array`);
      }
    });

    // Validate suburb data if file exists
    if (fs.existsSync(suburbFilePath)) {
      const suburbData = JSON.parse(fs.readFileSync(suburbFilePath, 'utf8'));
      
      if (!suburbData.suburbs || !Array.isArray(suburbData.suburbs)) {
        errors.push(`Region ${regionId}: Suburb file missing 'suburbs' array`);
      } else {
        suburbData.suburbs.forEach((suburb, index) => {
          if (!suburb.name || !suburb.displayName || suburb.latitude === undefined || suburb.longitude === undefined) {
            errors.push(`Region ${regionId}: Suburb ${index + 1} missing required fields (name, displayName, latitude, longitude)`);
          }
        });
      }
    }
  });

  if (errors.length > 0) {
    console.error('❌ Validation errors:');
    errors.forEach(err => console.error(`  - ${err}`));
    process.exit(1);
  }

  console.log(`✅ All data is valid!`);
  console.log(`   - ${regionCount} region(s) validated`);
  console.log(`   - ${venueCount} venue(s) validated`);
} catch (error) {
  console.error('❌ Validation failed:', error.message);
  process.exit(1);
}
