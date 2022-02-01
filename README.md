# Zach's README Section
Hello, Harmeet and Maddie and other folks on the Cylera team! This is my submission project for the Senior Frontend Engineer position.

The top section of this README file will be dedicated to project running instructions, a development log, questions I had, and assumptions I made during development. This will help all of us as we move through the interview process.

## How to Run This Project
1.

## Development Log
1. Read through the assignment fully, identifying key points and noting potential challenges or complications:
    - ⭐ One-screen dashboard; not multiple screens
    - ⭐ I have a starting point with respect to the technologies used and a project scaffold; I'm not starting from scratch.
        - I will stick with the general directory structure and technology configuration supplied to me, unless it's necessary for me to change any of those elements.
    - ❗ I am familiar with React. I haven't personally used Next (I've used Express), Apollo GraphQL (manages local/remote data with GraphQL), or TailwindCSS (I've used plain CSS/Sass/`styled-components`)
        - I'm going to need to become familiar with the basics of these unfamiliar technologies early. That won't be a problem, but I won't learn expert-level syntax in time for this project. I know the basics will do just fine to accomplish my goals.
    - ⭐ The design must be responsive to different screen sizes, but I won't be judged by the appearance of this dashboard on a mobile device.
    - ❗ The GraphQL endpoint I'm using to populate the dashboard is not owned or controlled by Cylera, but rather SpaceX.
    - ❗ I'm very familiar with Figma, but I don't know what Sympli is.
        - Upon creating a Sympli account and following the "design system link" below, it appears as though the Figma link offers a more detailed mockup versus the Sympli document. However, the Sympli document does allow me to download various assets the Cylera team integrated into the mockup, such as a "search" icon, "cog" icon, and "scale" icon. I'll download those assets now in vector format for use later.
            - Yikes, nevermind: the "vector" format supplied by Sympli is `.pdf`, which is unusable in this context, and I don't want to convert them. I'll use the `.png` assets provided by Sympli instead, but the `1x` versions of those assets won't scale nicely, and I'm not going to put the time in to figure out how to make use of the scaled bitmap assets in this app. If this were a real app, I'd talk to the designer, who could hopefully supply me with `.svg` assets.
            - Another problem with using `.png`s here is that the dark-to-light mode color transitions won't apply to these images, so they'll flicker in place as the dark/light mode transition occurs. Doesn't look great, but I'm not going to worry about that now.
            - I'm going to use Tailwind's `@heroicons` package for some of the iconography that I can't easily extract from the design documents.
    - ⭐ Cylera provided me with both a near-pixel-perfect design document _and_ textual descriptions of the various components contained within that document. Nice. As I'm developing, I'll be able to reference both documents to build each component to spec, making sure to note questions and assumptions about each component in the "Questions and Assumptions" section of this document below.
    - ❗I wish I had access to the full Figma document rather than just the prototype. If I had access to the document, I'd better be able to determine things like typefaces used, font sizes, exact colors, etc. I'll do my best.
        - Using [WhatTheFont](https://www.myfonts.com/WhatTheFont), I determined that the typeface used throughout the mockup is probably Proxima Nova - which isn't free. I'll use Metropolis, a free close alternative.
        - Using PowerToys' color picker, I determined the various colors used throughout the mockup and integrated those hex colors into Tailwind's theme.
    - ❗ I'm "not expected to finish every component." I should be mindful about which components will give me the biggest wins, and which components will be easy to knock out if I make the right architectural decisions early.
        - "Dark mode" comes to mind as an example of a feature that will be easy to knock out if I architect this application correctly. In my cursory look at Tailwind's documentation, it appears as though dark mode is _very_ straightforward to implement, if I correctly use Tailwind's features.
    - ❗ I don't know how to use any of the "Hints" yet, upon first read. Perhaps those will come in handy later.
2. Run the project as-is, just to make sure the project works as provided to me directly by Cylera.
    - The project instructions don't tell me which version of NodeJS I should have installed, nor do they tell me to run `npm i` first to install project dependencies. I will make sure to include those details in my "How to Run This Project" section before submission.
    - The project as-is does not give me much by way of a starting point. None of the existing code is documented, nor is its purpose clear as it pertains to the project. How am I supposed to use what's here, if at all?
        - What is the purpose of `/styles/Home.module.css`?
3. Begin with the page header: the main page wrapper, the header, the page title, the "settings" button, and the "launch site" dropdown. Write this initial code with the goal of making it _easy_ to implement the dark theme later.
    - There's a Tailwind Labs project called "Headless UI": "Completely unstyled, fully accessible UI components,  designed to integrate beautifully with Tailwind CSS." Sounds like exactly what I need for UI elements like the dropdown menu, toggle switch, etc. I'm going to use it.
    - I'm changing the label for the dark mode toggle from "Light / Dark Theme" to "Dark Mode", since the job of the switch is to inform the user whether the state associated with the label is "on" or "off". Using a "Light / Dark Theme" label doesn't inform the user what will happen when the state of the switch is on _or_ off. 
    - I made some slight changes to the cog dropdown transition; I think it looks/feels better than the mockup. Subjective!
    - I'm going to use Popper JS (as recommended by Tailwind) for reliable placement of the cog dropdown menu so I don't have to figure that out myself.
    - I had to recolor the white `cog.png` icon exported from Sympli to `#0981c3` for one of the states of the cog button.
    - I had to make the following change to `tailwind.config.js` to use separate dark- and light-mode background images for the cog icon:
        ```
        variants: {
            extend: { backgroundImage: ['dark'] },
        },
        ```
    - I had to add some strange wrappers and logic to the Listbox component in order to avoid animation jank. It's nice and smooth now, though!
    - I took some design liberties with the launch site filter dropdown, since there wasn't much by way of direction there in the mockups.

## Questions and Assumptions
- ❓ There are no project requirements here pertaining to browser compatibility. On which browsers does this application need to run without bugs?
    - Assumption: It's OK for me to _just pick a browser_ and make sure it works there, as long as I make a note of which browser I'm using.
        - For this project, I'm using **Google Chrome v97.0.4692.99 on Windows 11**. I will make little to no effort to validate that this Dashboard works on other browsers.
- ❓ There are no project requirements here pertaining to user accessibility.
    - Assumption: Don't think too hard about accessibility.
        - Note: 😞
- ❓ Why does the project scaffolding include a link to an "About" page when this application is explicitly a one-page app?
    - I'm going to remove `about.tsx` from the project entirely.
- ❓ Why does the Figma design for this application include a "Logout" button? What is that button supposed to actually do?
    - In my implmentation, I'm going to remove the "Logout" button entirely from the UI, since it doesn't serve any known purpose.
- ❓ Neither the spec below nor the mockup discuss app failure states.
    - Assumption: I'm going to focus mainly on the "golden path" and not spend much time on app failure states.
- ❓ Should this application show data about past launches, or should it include data about future launches as well?
    - Assumption: This application will only show data about past launches.
- ❓ Regarding the "summary statistic cards" at the top of the page:
    - Are the values displayed relative to _all_ missions? Launches? All _successful_ missions? How are these numbers calculated?
        - In reading the "Components & Features" section below: "6. Launch site filter: Global filter that applies to the summary cards, nationality launch card, payload mission card, and table". This answers some of my questions about how these numbers are calculated.
        - Assumption: The values displayed will be relative to all previous launches until the user adds a "launch site" filter, at which point the values displayed will be relative to all previous launches at that launch site only.
    - What should these cards do when hovered? When clicked? The chevron UI element indicates to me that they're meant to do something, but neither the written spec nor the Figma prototype answers this question.
        - Assumption: These cards shouldn't do anything special when clicked or hovered.
    - The background colors of these cards change when I hover over the "cog" button.
        - Assumption: This is a bug.
- ❓ Regarding the "Launch Site" "dropdown" at the top right of the page:
    - I'm guessing that this UI element is the way users switch between launch sites, which affects _all_ of the other data visible on the page. That's a very important UI element. What does it look like when a user clicks on that element? How does it behave? These questions are not answered by the prototype, so I'll have to make some assumptions on my own.
        - I believe that the "currently selected launch site" should be displayed somewhere on the page, besides just being the only site listed in the lower data table when a user has selected a launch site for filtering.
- ❓ Regarding the "Top 5 Missions" component:
    - What is the purpose of the "(?)" UI element? What should it show or do upon hover? Upon tap/click?
    - What is the scale of the black bar to the right of the "Payload Mass" numeric value?
        - Assumption: 0% === "0kg", 100% === "max payload mass for the top 5 missions shown"
            - This means that the top mission will always show a full "black bar."
- ❓ Regarding the "SpaceX Launch Data" table at the bottom of the page:
    - Is the data in the _mocked_ table meant to represent real, valid data?
        - Assumption: No, this mock is just for visual treatment. Reason for assumption: Two missions in the table with the same name, date, rocket, mass, site, and ID have different outcomes.


-----

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
Figma link: https://www.figma.com/proto/4YRep3EnjvbRhlgJnZ4fMl/Tailwind-Figma-UI?node-id=2633%3A44067&scaling=min-zoom&page-id=2632%3A42983&starting-point-node-id=2633%3A44067

Design system link: https://app.sympli.io/p/b7af245c13a878803bead2bfc9b2fcf7e4d75002b9:61eecfbd516143575ba7a12b

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
