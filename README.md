# Kids Eat Free

A static website displaying restaurants and venues where kids eat free. Designed with a **separated data architecture** that allows different cities/regions to use the same codebase with their own venue data.

**Live Site:** [Coming Soon]

## Features

- Filter venues by day of the week
- Filter by geographic area
- **Find venues near your current location (GPS)**
- **Search by radius (5km, 10km, 15km)**
- **Manual location entry (suburb/address)**
- Mobile-first responsive design
- Multiple days per venue support
- Multiple phone numbers per venue
- Flexible "extra details" links (Google Reviews, Facebook, Instagram, etc.)
- Verification date tracking with freshness indicators
- Membership requirement indicators
- PR-based contribution workflow
- Free hosting on GitHub Pages
- Zero infrastructure costs

## Architecture: App + Data Separation

This project uses a **separated architecture** where the website code and venue data can be maintained independently:

```
kids-eat-free/          # This repository (website code)
├── app/                # Next.js application
├── components/         # React components
├── lib/                # Utilities and types
└── data/               # Venue data (can be replaced)
    ├── metadata.json   # Region definitions
    ├── config.json     # Data configuration
    └── regions/
        └── act-canberra/
            ├── venues.json    # Venue data
            └── suburbs.json   # Location autocomplete data
```

### Benefits

1. **Multiple Cities**: Fork this repo and replace the `data/` folder with your city's data
2. **Separate Maintenance**: Data contributors don't need to touch the app code
3. **Easy Updates**: Update venue data without redeploying the entire app
4. **Data Repository**: Extract `data/` folder into its own repo for independent versioning

### Using External Data

You can use data from a separate repository in two ways:

#### Option 1: Replace data folder before build

```bash
rm -rf data
git clone https://github.com/your-org/your-data-repo.git data
bun run build
```

#### Option 2: Use the GitHub Action with external data

Trigger the "Sync Data and Deploy" workflow with your data repository URL.

#### Option 3: Repository dispatch from data repo

Add this to your data repository's GitHub Actions to auto-trigger site rebuilds:

```yaml
- name: Trigger site rebuild
  run: |
    curl -X POST \
      -H "Authorization: token ${{ secrets.SITE_REPO_TOKEN }}" \
      -H "Accept: application/vnd.github.v3+json" \
      https://api.github.com/repos/YOUR-ORG/kids-eat-free/dispatches \
      -d '{"event_type":"data-updated","client_payload":{"data_repo":"https://github.com/YOUR-ORG/your-data-repo"}}'
```

## Technology Stack

- **Next.js 14** - React framework with static export
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Bun** - Fast JavaScript runtime and package manager
- **JSON** - Simple data storage
- **GitHub Pages** - Free static hosting
- **GitHub Actions** - Automated deployment

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) runtime

### Installation

1. Clone the repository:
```bash
git clone https://github.com/saphid/kids-eat-free.git
cd kids-eat-free
```

2. Install dependencies:
```bash
bun install
```

3. Run the development server:
```bash
bun run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
bun run build
```

The static files will be generated in the `out/` directory.

## Adding New Venues

### Via GitHub Web Interface (Recommended)

1. Navigate to `data/regions/act-canberra/venues.json`
2. Click "Edit this file"
3. Add a new venue object to the `venues` array:
```json
{
  "id": "unique-venue-id",
  "name": "Venue Name",
  "area": "gungahlin",
  "address": "Full address",
  "latitude": -35.2767,
  "longitude": 149.1244,
  "suburb": "Suburb",
  "postcode": "2912",
  "days": ["tuesday", "wednesday"],
  "details": "Offer details and conditions",
  "membershipRequired": false,
  "membershipDetails": null,
  "website": "https://venue-website.com",
  "phone": ["+61-2-0000-0000"],
  "extraDetails": [
    {
      "type": "google_reviews",
      "label": "Google Reviews",
      "url": "https://google.com/maps/reviews-url",
      "icon": "star"
    }
  ],
  "verifiedDate": "2025-01-02",
  "active": true,
  "tags": ["cuisine-type", "family-friendly"]
}
```
4. Commit changes to a new branch
5. Create a pull request
6. Automated validation will run
7. Await review and approval

### Venue Fields

- **id** (required): Unique identifier (use `area-venue-name` format)
- **name** (required): Venue name
- **area** (required): Area slug (must exist in metadata.json)
- **address** (required): Full street address
- **latitude** (optional): Coordinate for nearby filtering
- **longitude** (optional): Coordinate for nearby filtering
- **suburb** (optional): Extracted suburb for faster search
- **postcode** (optional): Extracted postcode for faster search
- **days** (required): Array of days (e.g., `["tuesday", "wednesday"]`)
- **details** (required): Description of the offer
- **membershipRequired** (required): `true` or `false`
- **membershipDetails** (optional): Details if membership required
- **website** (required): Venue website URL
- **phone** (required): Array of phone numbers
- **extraDetails** (required): Array of additional links
- **verifiedDate** (required): ISO date string (YYYY-MM-DD)
- **active** (required): `true` or `false`
- **tags** (optional): Array of category tags

### Valid Day Values

```json
["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
```

### Extra Detail Types

- `google_reviews` - Google Reviews link
- `facebook` - Facebook page
- `instagram` - Instagram profile
- `tripadvisor` - TripAdvisor page
- `yelp` - Yelp listing
- `other` - Custom link

## Adding Coordinates to Venues

### Automatic Geocoding

Run the batch geocoding script:

```bash
bun run geocode-venues
```

This will:
1. Read all venue JSON files
2. Geocode each address using OpenStreetMap Nominatim
3. Add latitude, longitude, suburb, and postcode fields
4. Update the JSON files in place

**Note**: Nominatim has a rate limit of 1 request per second.

### Manual Geocoding

For individual venues, use https://geocode.maps.co/:

1. Enter the venue address
2. Copy the latitude and longitude
3. Add to the venue object

## Adding New Areas

Edit `data/metadata.json`:

```json
{
  "regions": {
    "act-canberra": {
      "areas": {
        "new-area": {
          "name": "new-area",
          "displayName": "New Area Display Name"
        }
      }
    }
  }
}
```

## Creating a Site for Your City

1. **Fork this repository**
2. **Replace the data folder** with your city's venue data:
   - Create `data/regions/your-city/venues.json`
   - Create `data/regions/your-city/suburbs.json`
   - Update `data/metadata.json` with your region
3. **Update imports** in `app/page.tsx` to load your region's data
4. **Configure GitHub Pages** for your fork
5. **Deploy!**

See `data/README.md` for detailed documentation on the data format.

## Development

### Scripts

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun start` - Start production server
- `bun run lint` - Run ESLint
- `bun run validate-data` - Validate JSON data files
- `bun run geocode-venues` - Add coordinates to venue addresses

### Project Structure

```
kids-eat-free/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── VenueCard.tsx      # Venue card component
│   ├── FilterBar.tsx      # Filter controls
│   └── VenueList.tsx      # Venue grid
├── lib/                   # Utilities
│   ├── types.ts           # TypeScript interfaces
│   ├── utils.ts           # Helper functions
│   ├── constants.ts       # Constants
│   ├── geocoding.ts       # Location utilities
│   └── data-loader.ts     # Data loading utilities
├── data/                  # Data directory (can be replaced)
│   ├── README.md          # Data documentation
│   ├── config.json        # Data repository config
│   ├── metadata.json      # Region definitions
│   ├── schema/            # Type definitions
│   └── regions/           # Per-region data
│       └── act-canberra/
│           ├── venues.json
│           └── suburbs.json
├── scripts/               # Build scripts
│   └── validate-data.js   # JSON validation
├── public/               # Static assets
│   └── robots.txt        # SEO configuration
└── .github/workflows/    # CI/CD
    ├── deploy.yml        # Main deployment
    └── sync-data.yml     # Sync from external data repo
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Make your changes
4. Run validation (`bun run validate-data`)
5. Commit your changes
6. Push to the branch
7. Open a Pull Request

### Review Guidelines

When reviewing PRs, check:
- [ ] No duplicate venue
- [ ] All required fields populated
- [ ] Days array contains valid day values
- [ ] At least one phone number provided
- [ ] Extra details URLs work (if provided)
- [ ] Website URL works
- [ ] JSON passes validation

## Deployment

This site uses GitHub Actions for automatic deployment to GitHub Pages.

### Automatic Deployment

- Push to `main` branch triggers build and deploy
- Pull requests trigger build-only validation
- Site is deployed to GitHub Pages from the `out/` directory

### Manual Deployment

1. Build the site: `bun run build`
2. The `out/` directory contains the static files
3. Upload to any static hosting service

## Performance

- Static HTML generation
- No server-side processing
- Minimal JavaScript (~100KB first load)
- Optimized for fast loading
- Mobile-first responsive design

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Icons by [Lucide](https://lucide.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

## Support

For issues, questions, or suggestions, please [open an issue](https://github.com/saphid/kids-eat-free/issues).

---

**Note:** Information about kids eat free deals may not be current. Please verify with venues before visiting.
