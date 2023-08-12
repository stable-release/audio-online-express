# Audio Online Express Web Service

## To Start
Run:
```
npm run start
```
Run production:
set NODE_ENV to "production"

## Installation

```
npm i express knex pg dotenv --save
```

```
npm i nodemon --save-dev
```

Add PostgreSQL server URL to .env
```
cp .env.sample .env
```
`.env` file:
```
DEVELOPMENT_DATABASE_URL="<postgres:URL>"
```