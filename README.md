# zappy
zappy is a simple tool that listens on a slack channel and based on a specific message retrieves tweets from a twitter account.

Used Technologies:
1- Node.js
2- Angular7
3- MongoDB

# Running Zappy
1- clone the repo
  # in case of runing backend and frontend separately:
     - Navigate to inside backend and run "npm install" to install project dependencies
     - Navigate to inside frontend and run "npm install" to install project dependencies
     - Run both of frontend and backend using "npm start"
  # in case of runing docker image
      - run docker compose up, this should take care of everthing (notice that you should have mongo docker image and node docker image)
      
2- open your browser on localhost:4200 to access zappy front end
3- open your browser, navigate to https://zappyheadquarters.slack.com and join the workspace (it's named as "Zappy")
4- after joining you can send messages and if your message contains the word "go", Fiction Fone tweets on twitter shall be displayed on the awesome zappy frontend at localhost:4200
5- you may run test cases by just running this command "npm run test" and this is supposed to take care of running unit tests.

      
