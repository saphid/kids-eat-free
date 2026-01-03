# Kids Eat Free - Data Repository

This folder contains the venue and location data for the Kids Eat Free website. It is designed to be extracted into its own repository, allowing different cities/regions to maintain their own data while using the same website codebase.

## Structure

```
data/
├── config.json           # Data repository configuration
├── metadata.json         # Global metadata and region definitions
├── schema/              # TypeScript type definitions (for reference)
│   └── types.ts
└── regions/
    └── {region-id}/     # One folder per region
        ├── venues.json  # Venue data for this region
        └── suburbs.json # Suburb/location autocomplete data
```

## Adding a New Region

1. Create a new folder under `regions/` with your region ID (e.g., `nsw-sydney`)
2. Create `venues.json` following the venue schema
3. Create `suburbs.json` with local suburb/location data
4. Add the region to `metadata.json`

## File Formats

### venues.json

```json
{
  "region": "region-id",
  "lastUpdated": "YYYY-MM-DD",
  "notes": "Optional notes about this data update",
  "venues": [
    {
      "id": "unique-venue-id",
      "name": "Venue Name",
      "area": "area-id",
      "address": "Full address",
      "latitude": -35.2794,
      "longitude": 149.1301,
      "suburb": "Suburb Name",
      "postcode": "2601",
      "days": ["monday", "tuesday"],
      "details": "Description of the kids eat free offer",
      "membershipRequired": false,
      "membershipDetails": null,
      "website": "https://venue-website.com",
      "phone": ["+61-2-1234-5678"],
      "extraDetails": [],
      "verifiedDate": "YYYY-MM-DD",
      "active": true,
      "tags": ["restaurant", "family-friendly"]
    }
  ]
}
```

### suburbs.json

```json
{
  "region": "region-id",
  "suburbs": [
    {
      "name": "Suburb Name",
      "displayName": "Suburb Name, STATE",
      "latitude": -35.2794,
      "longitude": 149.1301
    }
  ]
}
```

### metadata.json

Contains all region definitions including:
- Region display name and country
- Default map center coordinates
- Area definitions (for filtering)
- File paths for region data

## Using This Data

### Option 1: Local Data (Development)

The app can import data directly from this folder during development.

### Option 2: Remote Data (Production)

Set the `DATA_REPO_URL` environment variable to fetch data from a remote repository:

```bash
DATA_REPO_URL=https://raw.githubusercontent.com/username/kids-eat-free-data/main
```

### Option 3: Git Submodule

Add this data repo as a git submodule in your app repository:

```bash
git submodule add https://github.com/username/kids-eat-free-data.git data
```

## Creating a City-Specific Site

To create a Kids Eat Free site for your city:

1. Fork the data repository
2. Update/replace the region data with your city's venues
3. Fork the app repository
4. Configure the app to use your data repository
5. Deploy to GitHub Pages

## Contributing

When adding or updating venue data:

1. Verify the information directly with the venue
2. Include the `verifiedDate` field with today's date
3. Ensure coordinates are accurate
4. Test URLs are accessible
5. Submit a pull request with your changes

## License

This data is provided under CC-BY-4.0 license. You are free to use, share, and adapt the data with attribution.
