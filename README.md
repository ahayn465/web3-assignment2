# Getting application up and running for dev

1. git stash, git pull
2. cd into the root dir
3. npm install
2. go into mongo and drop employees table 'mongo > use employees > db.dropDatabase()' the previous commands in that order will do so.
3. cd into server > routes
4. open api.js in web browser and uncomment line 48, and run seedDB()
5. go back dirs and run the following, 'node server.js' (Be sure the table is empty or you will just be appending to dirty data) you will know its done when the magic starts happening!
6. crtl+c or cmd+c to stop the server process
7. go back to 'server > routes' and re-comment line 48 so we do not keep loading the DB with the same data everytime we turn on the server.
8. go back to server dir, run the follow to start the server 'node server.js' it will now be servering at localhost:7000
9. open a new terminal tab, go back into the root dir of the project, run the following to start the client 'npm start' it will now be server at localhost:8000
10. For development purposes on the client side, the only directories/files pertitnent to future development are: 
- app > js > main > controllers > DashCtrl.js 
- app > js > main > services > DataServices.js (All the services should be working fines, feel free to take a peek at the auth and data services and questions if you would like to.)
- app > js > main > templates dash.tpl.html/login.tpl.html


# Dont waste time getting stuck on stuff just ask me. 

