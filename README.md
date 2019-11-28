# oa_user_auth
Interesting interview take home challenge
To run it:
1. Create a data directory after cloning the repo so docker can use it
2. Create the env files. 
  .env.development.local in client dir, for example:
  ```
  REACT_APP_API_URL=http://127.0.0.1:7000
  ```

  .env in server dir needs to have:
  ```
  APP_URL=http://localhost:3000
  GITHUB_CLIENT_ID=changeit
  GITHUB_CLIENT_SECRET=changeit
  JWT_SECRET=changeit
  MONGO_HOSTNAME=mongodb
  MONGO_PORT=27017
  MONGO_DB=oauth-demo
  ```
3. run: `docker-compose up` to start backend, `npm start` in client dir to start frontend

