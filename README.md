# oa_user_auth
Interesting interview take home challenge. So far it supports github and facebook login. Frontend uses Reactjs (semantic ui, hooks, context for state management). Backend uses Nodejs, express and Mongodb. The project is containerized. However, if you want to start each component separately, feel free to do so.

## To run it:
1. Create a data directory within the project after cloning the repo so docker can use it
  ```
  mkdir data
  ```
2. Create the env files

  .env.development.local in client dir, note that react requires envionrment var to start with REACT_APP_ to be able to access it. for example:

  ```
  REACT_APP_APP_URL=https://localhost:3000
  ```

  .env in server dir, you need to replace "changeit" below with your actual credentials on corresponding oauth provider platform:
  ```
  APP_URL=https://localhost:3000
  MONGO_HOSTNAME=mongodb
  MONGO_PORT=27017
  MONGO_DB=oauth-demo
  JWT_SECRET=changeit
  GITHUB_CLIENT_ID=changeit
  GITHUB_CLIENT_SECRET=changeit
  FACEBOOK_APP_ID=changeit
  FACEBOOK_APP_SECRET=changeit
  ```
3. Now that the client run on https, you'll need to have your computer trust the localhost certificate. [Detailed steps can be found here](https://medium.com/@danielgwilson/https-and-create-react-app-3a30ed31c904). 
4. run: `docker-compose up` to start both frontend and backend. open browser, go to https://localhost:3000

## design choices
* I'm using email address as unique identifier for user data model for simplicity
* For state management, I used hooks and context instead of the familiar React, Redux. Resulting in much less boiler plate code. 