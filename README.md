# A Scalable AI Travel Planner Application

Video for project setup: https://www.youtube.com/watch?v=P43DW3HUUH8&t=2293s
Example of how project will be structured: https://github.com/machadop1407/MERN-Recipe-App

## Project Overview
Our AI Travel Planner is an app that uses AI to generate trip ideas and travel itineraries for users. When given a destination or trip idea (ex: "I want a beach retreat."), the travel planner generates an itinerary, recommends food spots, hotels, popular attractions, offers cultural insights, etc. The app should be customizable for those with different budgets, trip lengths, preferred activities, etc.<br/>
<br/>
We found that this app could be useful for those who need help planning a vacation quickly, for those who find the process of planning a trip manually tiresome and difficult, or for travel companies/agents selling trips to customers.<br/>
<br/>
The AI Travel Planner can cut down on time spent planning, and remove the stress of the meticulous planning process. Many current travel planning aids do not offer the luxuries of adjusting recommendations/itineraries based on budget sizes, trip lengths, and preferred activities. In addition, we would like to assist users in their preparation for these trips, recommending auxiliary items, clothing, documents, and necessary vaccinations (based on the trip destination).

## Installation
Have to install npm & node.js by going to their website. (node v22.13.1)

To install all dependencies in package.json:
```
npm install
```
To install a package:
```
npm add <package_name>
```

## How to run
**To run frontend**:
cd into frontend & run:
```
npm start
```
Frontend runs on port 3000. http://localhost:3000/
App.tsx is where we load in the page.tsx's stuff. It is also where we have differnet routes/urls to different pages. 

**To run backend**:
cd into backend & run:
```
npm start
```
Backend runs on port 3001. 
src/index.ts is where we connect to database and start express server. It is also where we handle requests from the frontend, this is where we handle our app api endpoints. We have to create more files to api endpoints but for now we can handle them in index.ts

## Contribution
Our branching strategy is based on features and bugfixes. We want to keep things as separate as possible so that we can see clearly what is being worked on, and to ensure that there are minimal problems (for example, merge conflicts) in the process of creating our travel planner.  return

**To create a feature or bugfix branch:**
```
git checkout -b feature/<feature-name>
```
OR
```
git checkout -b bugfix/<bugfix-name>
```

When contributing to a branch, make sure that any installed packages are documented in this README.md file or added to package.json. This will ensure that no other contributors are missing necessary packages.  return
**"Dependencies"** are required for an app to run, and should be installed like this:
```
npm install <package_name> --save
```
**"Dev Dependencies"** are required only for development and testing, and should be installed like this:
```
npm install --save-dev <package_name>
```
Once the packages have been added to package.json, other contributors can install them automatically by running **npm install**

Once a branch is ready to be implemented, submit a pull request with a detailed description of the feature or bugfix. Once the pull request has been created, the team can review and approve/deny it.

**Side note for contribution:**
Comment as much as possible. We all work collaboratively on this project, so it is important that everyone can read and understand one another's code.
