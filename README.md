# Zappy

Zappy is a simple tool to retrieve tweets from a twitter account based on specific message sent on a slack channel so it integrates with twitter and slack APIs

## How to Run?
1- clone project

    # To run each of the two projects separately 

        - navigate to inside backend and run "npm install" then run "npm start"

        - navigate to inside front and run "npm install" then run "npm start"

    # To run project as docker image 

        - build both frontend and backend docker images using the command "docker build -t frontend" for frontend project and "docker build -t backend" for the backend project.

        - then you can run docker compose up to have an up and running docker image
2- open your browser and navigate to "zappyheadquarters.slack.com" you may ask for permission to jion the workspace and permission will be granted.

3- you can open zappy awesome app through navigating to "localhost:4200" in your browser

4- once you start send messages on slack, if your messages contains the word "go" you will see that zappy has retrieved tweets from "Fiction Fone" twitter account and posted them to frontend.

5- you can run backend unit test by running "npm run test" command after navigating to the backend

## Used Technologies
Node.JS

Angular

MongoDB


