# A Scalable AI Travel Planner Application

Video for project setup: https://www.youtube.com/watch?v=P43DW3HUUH8&t=2293s
Example of how project will be structured: https://github.com/machadop1407/MERN-Recipe-App


### How to run
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

### Common Errors & Cautions
Have to install npm & node.js by going to their website. 

To install all dependencies in package.json
```
npm install
```
To install a package:
```
npm add <package_name>
```
