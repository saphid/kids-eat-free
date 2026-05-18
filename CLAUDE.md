# Kids Eat Free

Static website listing Canberra restaurants where kids eat free, filterable by day, area, and location radius.

Status: Maintenance

## Repos
| Repo | Branch | Purpose |
|------|--------|---------|
| kidseatfree | main | Static site source |

## Key Info
- Tech: Next.js 14, TypeScript, Tailwind, Bun, GitHub Pages
- Filters: day of week, geographic area (Gungahlin, Belconnen, City, Tuggeranong, Woden, Queanbeyan)
- Location features: GPS-based radius search (5/10/15km), manual suburb/address entry
- Data: JSON venue list with coordinates and verification dates
- Extensible to other regions

## Key Artifacts
| File | Purpose |
|------|---------|
| notes/README.md | Feature list, filter options, GPS/radius search details |

## Principles
1. State the invariant before you code — the fix shape falls out of it.
2. Look for existing primitives before building new ones.
3. Write the dumbest version that works; require a reason to add any layer.
4. A trivial change shouldn't need a cascade of CI fixes — that's a shape problem, not a CI problem.
5. Match process weight to problem size; don't orchestrate a one-shot fix.
6. Before shipping, ask explicitly: "is there a simpler version?"
