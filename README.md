# Audio Online Express Web Service
```
npm run knex:production
```
```
npm run development
```

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
PRODUCTION_DATABASE_URL="<postgres:URL>"
ARGON_SECRET="<SECRET>"
ARGON_TIME=<TIME_COST>
ARGON_MEM=<MEMORY_COST>
ARGON_PAR=<PARALLELISM>
NODEMAILER_HOST="<MAIL_HOST>"
NODEMAILER_EMAIL="<SMTP_EMAIL>"
NODEMAILER_KEY="<SMTP_KEY>"
CODE_LENGTH=<VERIFICATION_CODE_LENGTH>
ALG="<JWS_ALG>"
```