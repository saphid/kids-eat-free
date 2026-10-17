#!/usr/bin/env node
/**
 * Batch geocoding script for venue addresses
 * Adds latitude, longitude, suburb, and postcode to venue data
 */

const fs = require('fs');
const path = require('path');

// Geocoding functions (inline version of lib/geocoding.ts)
async function geocodeAddress(address) {
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&countrycodes=au&limit=1`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'KidsEatFree/1.0 (canberra-kids-eat-free@example.com)',
      },
    });

    if (!response.ok) {
      console.error('  ❌ Geocoding request failed:', response.status);
      return null;
    }

    const data = await response.json();

    if (data.length === 0) {
      console.error('  ❌ No results found');
      return null;
    }

    const result = data[0];
    const addressParts = extractAddressParts(result.display_name);

    return {
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon),
      suburb: addressParts.suburb,
      postcode: addressParts.postcode,
    };
  } catch (error) {
    console.error('  ❌ Geocoding error:', error.message);
    return null;
  }
}

function extractAddressParts(address) {
  const parts = {};

  // Australian postcode pattern: 4 digits
  const postcodeMatch = address.match(/\b(\d{4})\b/);
  if (postcodeMatch) {
    parts.postcode = postcodeMatch[1];
  }

  // Try to extract suburb
  const suburbMatch = address.match(/([^,]+)\s+(?:ACT|NSW|VIC|QLD|SA|WA|TAS|NT)\s+\d{4}/);
  if (suburbMatch) {
    parts.suburb = suburbMatch[1].trim();
  }

  return parts;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function geocodeVenues() {
  const dataDir = path.join(__dirname, '../data');
  const metadataPath = path.join(dataDir, 'metadata.json');
  
  // Load metadata to get region file paths
  const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));

  console.log('📍 Starting venue geocoding...\n');

  let totalUpdated = 0;
  let totalSkipped = 0;
  let totalFailed = 0;

  // Process each region defined in metadata
  for (const [regionId, regionConfig] of Object.entries(metadata.regions)) {
    const venueFilePath = path.join(dataDir, regionConfig.files.venues);
    
    if (!fs.existsSync(venueFilePath)) {
      console.log(`⚠️ Skipping ${regionId}: venue file not found`);
      continue;
    }

    const data = JSON.parse(fs.readFileSync(venueFilePath, 'utf8'));

    console.log(`\n📂 Processing ${regionId}...`);
    console.log(`   File: ${regionConfig.files.venues}`);
    console.log(`   Venues: ${data.venues.length}`);

    let updatedCount = 0;
    let skippedCount = 0;
    let failedCount = 0;

    for (const venue of data.venues) {
      // Skip if already geocoded
      if (venue.latitude && venue.longitude) {
        console.log(`  ⊘ ${venue.name}: already has coordinates`);
        skippedCount++;
        continue;
      }

      console.log(`  📍 ${venue.name}`);
      console.log(`     Address: ${venue.address}`);

      const result = await geocodeAddress(venue.address);

      if (result) {
        venue.latitude = result.latitude;
        venue.longitude = result.longitude;
        venue.suburb = result.suburb;
        venue.postcode = result.postcode;

        updatedCount++;
        console.log(`     ✅ ${result.latitude}, ${result.longitude}`);
        if (result.suburb) console.log(`        Suburb: ${result.suburb}`);
        if (result.postcode) console.log(`        Postcode: ${result.postcode}`);
      } else {
        failedCount++;
      }

      // Rate limiting: Nominatim requires max 1 request per second
      await sleep(1100);
    }

    // Write updated data back to file
    fs.writeFileSync(venueFilePath, JSON.stringify(data, null, 2));

    console.log(`\n   📊 Results:`);
    console.log(`      ✅ Updated: ${updatedCount}`);
    console.log(`      ⊘ Skipped: ${skippedCount}`);
    console.log(`      ❌ Failed: ${failedCount}`);

    totalUpdated += updatedCount;
    totalSkipped += skippedCount;
    totalFailed += failedCount;
  }

  console.log('\n' + '='.repeat(50));
  console.log('✅ Geocoding complete!');
  console.log('📊 Total Statistics:');
  console.log(`   ✅ Updated: ${totalUpdated}`);
  console.log(`   ⊘ Skipped: ${totalSkipped}`);
  console.log(`   ❌ Failed: ${totalFailed}`);
  console.log('='.repeat(50));
}

// Run the script
geocodeVenues().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
