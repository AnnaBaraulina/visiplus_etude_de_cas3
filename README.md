## Node.js Approfondissement – Articles API

### Overview
Continuation of the Oktogone training project to manage user-created articles. This iteration adds publication status, CRUD endpoints secured by JWT, role-based permissions, real-time Socket.IO events, a public listing endpoint, automated tests, deployment settings, and the database UML requested in the brief.

### Features
- Article schema enhanced with `status` enum (`draft` | `published`) and timestamps.
- Authenticated creation of articles; update/delete restricted to **admin** users.
- Real-time notifications on article create/update/delete via Socket.IO.
- Public endpoint `GET /api/users/:userId/articles` that returns the user (without password) and all of their articles.
- Jest unit tests covering article creation, update, and deletion logic.
- PM2 configuration for clustered deployment (3 instances, 200 MB memory cap, error logging).

### Prerequisites
- Node.js ≥ 16
- MongoDB running locally on `mongodb://localhost:27017/myapp` (or update `config/index.js`)
- npm

### Installation & Setup
```bash
git clone <your-fork-url>
cd Nodejs-Approfondissement
npm install
```

### Running the App
```bash
npm run serve
```
Starts the Express + Socket.IO server on `http://localhost:3000`. The bundled demo client is available at the root path and uses Socket.IO to display realtime events.

### Testing
```bash
npm test
```
Runs Jest suites (`tests/articles.spec.js`, `tests/users.spec.js`). The tests mock MongoDB via `mockingoose` and simulate authenticated requests.

### Authentication & Roles
- Obtain a JWT by POSTing to `/login` with email/password (see `api/users/users.controller.js`).
- Include the token as `x-access-token` header on protected routes.
- `role: "admin"` is required for article update/delete; both `admin` and `member` may create.

### API Quick Reference
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/login` | – | Returns JWT for valid credentials |
| GET | `/api/users` | JWT | List users (password omitted) |
| GET | `/api/users/:id` | JWT | Fetch single user |
| POST | `/api/users` | JWT | Create user, emits `user:create` |
| PUT | `/api/users/:id` | JWT | Update user |
| DELETE | `/api/users/:id` | JWT | Delete user, emits `user:delete` |
| POST | `/api/articles` | JWT | Create article, stores connected user, emits `article:create` |
| PUT | `/api/articles/:id` | JWT + admin role | Update article, emits `article:update` |
| DELETE | `/api/articles/:id` | JWT + admin role | Delete article, emits `article:delete` |
| GET | `/api/users/:userId/articles` | Public | User info (sans password) + populated articles |

### Socket.IO Events
```text
article:create   -> Broadcast on new article (payload: populated article)
article:update   -> Broadcast on update (payload: updated article)
article:delete   -> Broadcast on delete (payload: { id })
```
In the browser console (`http://localhost:3000/`):
```js
socket.on("article:create", console.log);
socket.on("article:update", console.log);
socket.on("article:delete", console.log);
```

### UML Diagram
![UML Diagram](docs/database-uml.png)


### Deployment (PM2)
`ecosystem.config.js` configures clustered deployment as required:
- 3 instances (`instances: 3`, `exec_mode: "cluster"`)
- Memory restart threshold at 200 MB (`max_memory_restart`)
- Error logs stored in `logs/err.log`

Launch command:
```bash
pm2 start ecosystem.config.js --only app --env production
```

### Manual Verification Checklist
1. **Login** as admin and member via `/login`; ensure tokens are issued.
2. **Create Article** with any authenticated user – article must reference `req.user` and emit `article:create`.
3. **Update/Delete Article** with an admin token – succeeds and emits events.
4. Attempt update/delete with a member token – receives 401 “Admin role required”.
5. Hit `/api/users/:userId/articles` without a token – returns user (no password) plus populated articles.
6. Observe Socket.IO events in the browser console.

### Notes
- `middlewares/auth.js` now loads the full user document and attaches it to `req.user` in compliance with the brief.
- Log files under `logs/*.log` are ignored by Git; keep the directory for PM2.
- Adjust MongoDB URI or JWT secret via `config/index.js` or environment variables as needed.

Submit this repository URL (GitHub/GitLab) per the assignment instructions.

