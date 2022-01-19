## Reference Links

GraphQL API: https://api.spacex.land/graphql/

Example site: https://spacex.land/missions

## Requirements
- Responsive design
- Accessible design

## Feature Priority Order 
1. Statistics card
2. Table
3. Chart cards
4. Filtering and sorting for the table
5. Global filter
6. Animations
7. Dark mode


## Global Page Settings
- Filter by launch site

## Payload Stats Cards
- Statistics
    - Total number of payloads
    - Minimum, maximum and average payload mass
    - Total number of unique payload customers
- Pie chart comparing total payload counts by nationality
- Horizontal bar chart with top 5 missions ranked by descending payload mass

## Launch Table
- A filterable, sortable, paginated data table showing all launches.
- Has a full-screen viewing mode.

### Suggested query 
```
{
    launches {
        mission_name
        launch_date_utc
        launch_success
            rocket {
                rocket_name
                rocket_type
                second_stage {
                    payloads {
                    payload_mass_kg
                    }
                }
            }
            launch_site {
                site_name
                site_name_long
            }
            mission_id
    details
    }
}

```

## Filters
- Mission name: string
- Launch date before: date
- Launch date after: date
- Success: boolean
- Rocket: dropdown
- Launch site: dropdown
- Mission: dropdown

## Columns
- Mission name
- Launch date
- Launch success
- Rocket name
- Rocket type
- Total payload count
- Total mass of all payloads
- Launch site name (short form in cell, long form as a tooltip)
- Description (do not render directly into a table cell)
- Upcoming

## Hints
- Launches and missions have a many-to-many relationship.
- The mission name for a launch may contain multiple mission names joined by slashes.
- Not all launches have mission IDs to cross-reference to the missions dataset; the mission filter does not need to provide an option representing these.
- You can cross reference payloads with launch sites via missions.
- The application does not have to support a mobile viewing experience but it does need to be responsive.

</br>
</br>
</br>
</br>
</br>

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).
# Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.
