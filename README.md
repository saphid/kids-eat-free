# Kids Eat Free Canberra

A static, mobile-friendly directory of Canberra venues where kids eat free.

Live site: https://saphid.github.io/kids-eat-free/

## Features

- Filter venues by day of the week.
- Filter by Canberra area.
- Search near your current location or a manually entered suburb/address.
- Sort nearby results by distance.
- Track verification dates, membership requirements, phone numbers, and useful venue links.
- Store venue data in simple JSON files so updates can be reviewed in pull requests.

## Stack

- Next.js 14 static export
- TypeScript
- Tailwind CSS
- Bun
- GitHub Pages

## Development

```bash
git clone https://github.com/saphid/kids-eat-free.git
cd kids-eat-free
bun install
bun run dev
```

Open http://localhost:3000.

## Validate and build

```bash
bun run validate-data
bun run build
```

For the GitHub Pages base path locally:

```bash
NEXT_PUBLIC_BASE_PATH=/kids-eat-free bun run build
```

## Venue data

Canberra venues live in:

```text
lib/data/regions/act-canberra.json
```

Region metadata lives in:

```text
lib/data/regions/metadata.json
```

A venue record includes:

- `id`, `name`, `area`, and `address`
- optional `latitude`, `longitude`, `suburb`, and `postcode` for nearby search
- `days`, `details`, membership fields, website, phone, and extra links
- `verifiedDate`, `active`, and optional tags

Required day values:

```json
["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
```

## Geocoding venues

Batch geocode venues with OpenStreetMap Nominatim:

```bash
bun run geocode-venues
```

Nominatim is rate limited, so large batches can take a few minutes. Review the JSON diff before committing generated coordinates.

## Updating offers

1. Confirm the offer on the venue website or another reliable source.
2. Update the matching venue JSON record.
3. Refresh `verifiedDate`.
4. Run `bun run validate-data` and `bun run build`.
5. Open a pull request.
