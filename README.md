# flask-rq
> demo Redis queue with workers

 - use `flask run` to start.
 - Requires redis-server to be running, as well as `rq worker` to be running in the app directory.
 - `export OBJC_DISABLE_INITIALIZE_FORK_SAFETY=YES` may need to be set before running `rq worker` see https://github.com/rq/rq/issues/1418


# node-cache
> demo resis cache

 - use `node server.js` to start. Remeber to npm install.
 - requires redis-server to be running
 - use my-postman (npm run start) or postman to test cache
