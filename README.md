# Kids Eat Free Canberra

A static website displaying restaurants and venues in Canberra where kids eat free. Filterable by day and location, with easy extensibility to other regions.

**Live Site:** [Coming Soon]

## Features

- Filter venues by day of the week
- Filter by geographic area (Gungahlin, Belconnen, City, Tuggeranong, Woden, Queanbeyan)
- Mobile-first responsive design
- Multiple days per venue support
- Multiple phone numbers per venue
- Flexible "extra details" links (Google Reviews, Facebook, Instagram, etc.)
- Verification date tracking with freshness indicators
- Membership requirement indicators
- PR-based contribution workflow
- Free hosting on GitHub Pages
- Zero infrastructure costs

## Technology Stack

- **Next.js 14** - React framework with static export
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **JSON** - Simple data storage
- **GitHub Pages** - Free static hosting
- **GitHub Actions** - Automated deployment

## Getting Started

### Prerequisites

- Node.js 20 or later
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/daegu.git
cd daegu
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
```

The static files will be generated in the `out/` directory.

## Adding New Venues

### Via GitHub Web Interface (Recommended)

1. Navigate to `lib/data/regions/act-canberra.json`
2. Click "Edit this file"
3. Add a new venue object to the `venues` array:
```json
{
  "id": "unique-venue-id",
  "name": "Venue Name",
  "area": "gungahlin",
  "address": "Full address",
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

## Adding New Areas

Edit `lib/data/regions/metadata.json`:

```json
{
  "regions": {
    "act-canberra": {
      "name": "Canberra, ACT",
      "country": "Australia",
      "priority": 1,
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

## Adding New Regions/States

1. Create a new file: `lib/data/regions/nsw-sydney.json`
2. Add region metadata to `lib/data/regions/metadata.json`:
```json
{
  "regions": {
    "nsw-sydney": {
      "name": "Sydney, NSW",
      "country": "Australia",
      "priority": 2,
      "areas": {
        "cbd": {"name": "cbd", "displayName": "Sydney CBD"},
        "bondi": {"name": "bondi", "displayName": "Bondi"}
      }
    }
  }
}
```

3. Update the main page component to load the new region data

## Development

### Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run validate-data` - Validate JSON data files

### Project Structure

```
daegu/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── VenueCard.tsx      # Venue card component
│   ├── FilterBar.tsx      # Filter controls
│   └── VenueList.tsx      # Venue grid
├── lib/                   # Utilities and data
│   ├── types.ts           # TypeScript interfaces
│   ├── utils.ts           # Helper functions
│   ├── constants.ts       # Constants
│   └── data/regions/      # Data files
│       ├── metadata.json  # Region configuration
│       └── act-canberra.json  # Venue data
├── scripts/               # Build scripts
│   └── validate-data.js   # JSON validation
└── public/               # Static assets
    └── robots.txt        # SEO configuration
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Make your changes
4. Run tests (`npm run validate-data`)
5. Commit your changes (`git commit -m 'Add some feature'`)
6. Push to the branch (`git push origin feature/your-feature`)
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
- Pull requests trigger build-only
- Site is deployed to GitHub Pages from the `out/` directory

### Manual Deployment

1. Build the site: `npm run build`
2. The `out/` directory contains the static files
3. Upload to any static hosting service

## Performance

- Static HTML generation
- No server-side processing
- Minimal JavaScript (~92KB first load)
- Optimized for fast loading
- Mobile-first responsive design

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Icons by [Lucide](https://lucide.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

## Support

For issues, questions, or suggestions, please [open an issue](https://github.com/yourusername/daegu/issues).

---

**Note:** Information about kids eat free deals may not be current. Please verify with venues before visiting.
