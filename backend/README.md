# API Backend

Simple Express API.

Quick start

```bash
cd backend
npm install
# development
npm run dev
# production
npm start
```

Environment

Create a `.env` file with any environment variables (e.g. `PORT`).

Files

- `server.js` - entrypoint
- `package.json` - dependencies and scripts# API Backend

Simple Express API.

Quick start:

```bash
cd backend
npm install
npm start
```

The server listens on `process.env.PORT` or `5000`.


<!-- 
reg 
login get jwt as "fklasdflksd"
now go to url POST http://localhost:5000/services and in headers after bearer put jwt and in body put like 
{
  "name": "Example API",
  "description": "Test API",
  "endpoint": "/api/example"
}
then you will get response
as {
  "id": 1,
  "name": "Example API",
  "description": "Test API",
  "endpoint": "/api/example",
  "createdAt": "2026-05-14T11:39:44.416Z"
}

then go to url POST /services/1/request
Headers Authorization: Bearer JWT_TOKEN
and body need id 
and the res will come {
  "id": 1,
  "userId": 1,
  "serviceId": 1,
  "approved": false,
  "createdAt": "2026-05-14T11:45:04.879Z"
}

then PATCH /services/1/approve
Headers
Authorization: Bearer JWT_TOKEN
Body
{
  "userId": 1
}
and get res {
  "count": 1
}

Generate API Key
POST
POST /apikeys
Headers
Authorization: Bearer JWT_TOKEN
Output
{
  "apiKey": "sk_abc123xyz"
}
🧭 FULL FLOW (From Start to API Call)
1. Register → get user
2. Login → get JWT token
3. Create Service (admin)
4. Request Service (user)
5. Approve Service (admin)
6. Generate API Key
7. Call API using API Key
8. Check logs
⚙️ Base URL
http://localhost:5000
🧪 STEP 1 — Register User
POST
POST /auth/register
Body (JSON)
{
  "email": "user1@test.com",
  "password": "123456"
}
Output
{
  "id": 1,
  "email": "user1@test.com"
}
🧪 STEP 2 — Login
POST
POST /auth/login
Body
{
  "email": "user1@test.com",
  "password": "123456"
}
Output
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

👉 Save this as:

JWT_TOKEN
🧪 STEP 3 — Create Service (Admin)

⚠️ For now you can use same user (later make admin role)

POST
POST /services
Headers
Authorization: Bearer JWT_TOKEN
Body
{
  "name": "Example API",
  "description": "Test API",
  "endpoint": "/api/example"
}
Output
{
  "id": 1,
  "name": "Example API"
}
🧪 STEP 4 — Request Service
POST
POST /services/1/request
Headers
Authorization: Bearer JWT_TOKEN
Output
{
  "userId": 1,
  "serviceId": 1,
  "approved": false
}
🧪 STEP 5 — Approve Service
PATCH
PATCH /services/1/approve
Headers
Authorization: Bearer JWT_TOKEN
Body
{
  "userId": 1
}
Output
{
  "count": 1
}
🧪 STEP 6 — Generate API Key
POST
POST /apikeys
Headers
Authorization: Bearer JWT_TOKEN
Output
{
  "apiKey": "sk_abc123xyz"
}

👉 Save this as:

API_KEY
🧪 STEP 7 — Call API (FINAL TEST)
GET
GET /api/example
Headers
Authorization: Bearer API_KEY
Output
{
  "message": "Success"
}

👉 Save this as: API_KEY
see when you add any schema in prisma then don't forgot to do this npx prisma db push -->