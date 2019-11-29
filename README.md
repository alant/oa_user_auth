# oa_user_auth
Interesting interview take home challenge
To run it:
1. Create a data directory within the project after cloning the repo so docker can use it
  ```
  mkdir data
  ```
2. Create the env files. 
  .env.development.local in client dir, note that react requires envionrment var to start with REACT_APP_ to be able to access it. for example:

  ```
  REACT_APP_APP_URL=https://127.0.0.1:3000
  ```

  .env in server dir needs to have:
  ```
  APP_URL=http://localhost:3000
  APP_URL2=http://127.0.0.1:3000
  APP_URL3=https://127.0.0.1:3000
  GITHUB_CLIENT_ID=changeit
  GITHUB_CLIENT_SECRET=changeit
  JWT_SECRET=changeit
  MONGO_HOSTNAME=mongodb
  MONGO_PORT=27017
  MONGO_DB=oauth-demo
  ```
3. Now that the client run on https, you'll need to have your computer trust the localhost certificate. [Detailed steps can be found here](https://medium.com/@danielgwilson/https-and-create-react-app-3a30ed31c904). 
4. run: `docker-compose up` to start both frontend and backend. open browser, go to https://127.0.0.1:3000

