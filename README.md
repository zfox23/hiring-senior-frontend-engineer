# The Assignment
The goal of this project is to build a one-screen dashboard consisting of a few components. We've created a design for this dashboard, and your job is to implement it. This repo is a starting point, with some of the scaffolding in place to get you started. You're expected to use the following technologies in your solution:
- React
- Next
- Apollo GraphQL
- TailwindCSS

In addition, your solution won't be viewed on a mobile device but it does need to be responsive. 

## Dataset
You'll use a publicly available GraphQL endpoint with data from SpaceX launches, found here: https://api.spacex.land/graphql/. 

## The Design
Figma link: 
Design system link: 

## Components & Features
1. Summary statistic cards
    - 3 cards arrayed across the top of the page, showing the total payload, average payload, and number of customers
2. Table of launches
    - Paginated table of launch data
    - Page size is constant
    - Columns: mission name, launch date, launch success (outcome), rocket name, payload mass, site name, mission ID
3. Launches by nationality
    - Pie chart by nationality
    - Legend with count for each country
4. Top missions by payload mass
    - 5 missions with the greatest total payload mass
5. Server-side filtering and sorting for table
    - All columns should be sortable, with an indicator of sorting direction (if a sort is applied)
    - Search bar that filters results based on mission name
    - Filtering and sorting should happen server side
6. Launch site filter
    - Global filter that applies to the summary cards, nationality launch card, payload mission card, and table
7. Animations
    - Table is expandable to be full screen. Animation is demonstrated in prototype at Figma link.
8. Dark mode
    - Global setting can toggle UI theme from light mode to dark mode. Colors and animation are demonstrated in prototype at Figma link.

Note: you aren't expected to finish every component. Like with real assignments, you may have to make tradeoffs and compromises to deliver a product on time. You should be prepared to discuss the decisions that were made throughout the development process.

## Hints
- Launches and missions have a many-to-many relationship.
- The mission name for a launch may contain multiple mission names joined by slashes.
- Not all launches have mission IDs to cross-reference to the missions dataset; the mission filter does not need to provide an option representing these.
- You can cross reference payloads with launch sites via missions.

## Deadline & Submission
You have a week to complete this assignment. It shouldn't take that long, but we're giving you enough time to get familiar with the project. To begin your work, you should fork this repo. When you're ready to submit, share the repo with us and provide instructions to run your assignment.

## Scoring Rubric
We'll be assessing the final product on a number of criteria, primarily focusing on: the accuracy of the UI compared to the design, the functionality of the interactive components, the code quality, and the performance of the GraphQL queries.

## Getting Started
This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

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
