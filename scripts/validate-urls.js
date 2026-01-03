#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the venue data
const venueDataPath = path.join(__dirname, '../lib/data/regions/act-canberra.json');
const venueData = JSON.parse(fs.readFileSync(venueDataPath, 'utf-8'));

// Function to validate a URL
async function validateUrl(url) {
  try {
    const response = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });

    return {
      url,
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      redirected: response.redirected,
      finalUrl: response.url
    };
  } catch (error) {
    return {
      url,
      error: error.message,
      ok: false
    };
  }
}

// Main validation function
async function validateAllUrls() {
  console.log('Validating venue website URLs...\n');

  const results = [];
  let successCount = 0;
  let failCount = 0;

  for (const venue of venueData.venues) {
    process.stdout.write(`Checking: ${venue.name}... `);

    const result = await validateUrl(venue.website);

    if (result.ok) {
      console.log(`✓ OK (${result.status})`);
      successCount++;
    } else {
      console.log(`✗ FAILED`);
      if (result.error) {
        console.log(`  Error: ${result.error}`);
      } else {
        console.log(`  Status: ${result.status} ${result.statusText}`);
      }
      failCount++;
    }

    results.push({
      venue: venue.name,
      venueId: venue.id,
      url: venue.website,
      ...result
    });

    // Small delay to be respectful to servers
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n' + '='.repeat(60));
  console.log(`\nValidation Summary:`);
  console.log(`Total venues: ${venueData.venues.length}`);
  console.log(`Successful: ${successCount}`);
  console.log(`Failed: ${failCount}`);

  // Save detailed results to file
  const outputPath = path.join(__dirname, '../.context/url-validation-results.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`\nDetailed results saved to: ${outputPath}`);

  // List all failed URLs
  if (failCount > 0) {
    console.log('\n' + '='.repeat(60));
    console.log('\nFailed URLs:');
    const failed = results.filter(r => !r.ok);
    failed.forEach(r => {
      console.log(`\n${r.venue}:`);
      console.log(`  URL: ${r.url}`);
      if (r.error) {
        console.log(`  Error: ${r.error}`);
      } else {
        console.log(`  Status: ${r.status} ${r.statusText}`);
      }
    });
  }

  return { successCount, failCount, results };
}

// Run the validation
validateAllUrls().catch(console.error);
