# Experiences Marketplace API

A backend for an "Experiences" marketplace where Hosts can create experiences and Users can book them. Built with Node.js, Express, TypeScript, and PostgreSQL (Drizzle ORM).

##  Setup & Installation

### Prerequisites
- Node.js (v18+)
- PostgreSQL Database
- TypeScript (installed globally or via npx)

### 1. Clone & Install
\`\`\`bash
git clone <repo-url>
cd backend-assignment
npm install
\`\`\`

### 2. Environment Configuration
Create a \`.env\` file in the root directory:
\`\`\`bash
PORT=3000
DATABASE_URL="postgres://user:password@localhost:5432/experiences_db"
JWT_SECRET="your-secret-key-change-me"
\`\`\`

### 3. Database Setup
Ensure your PostgreSQL server is running. Then run migrations and seed data:
\`\`\`bash
# Generate migrations
npm run db:generate

# Push schema to database
npm run db:push

# (Optional) Seed database with initial data
npm run db:seed
\`\`\`

### 4. Run the Server
\`\`\`bash
# Development Mode (Hot Reload)
npm run dev

# Build & Start Production
npm run build
npm start
\`\`\`

## 🧪 Testing

### Automated Testing
Run the comprehensive test script to verify the full user flow (Host Signup -> Create/Publish -> User Signup -> Book):
\`\`\`bash
chmod +x test-api.sh
./test-api.sh
\`\`\`

### Manual Testing
Use the \`api.http\` file with the **REST Client** extension (VS Code) or similar tools to manually send requests directly from your editor.

## 📚 API Guidelines & Examples

### Authentication (Auth)
#### Signup (User/Host)
\`\`\`bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{ "email": "host@test.com", "password": "password123", "role": "host" }'
\`\`\`

#### Login
\`\`\`bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{ "email": "host@test.com", "password": "password123" }'
# Response: { "token": "eyJhbG...", "user": { ... } }
\`\`\`

> **Note:** For subsequent requests, use the returned token in the Authorization header: `Authorization: Bearer <TOKEN>`

### Experiences
#### Create Experience (Host/Admin Only)
\`\`\`bash
curl -X POST http://localhost:3000/api/experiences \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Sunset Kayaking",
    "description": "Paddle through the sunset.",
    "location": "Miami, FL",
    "price": 50,
    "start_time": "2025-12-01T18:00:00Z"
  }'
\`\`\`

#### Publish Experience (Owner/Admin Only)
\`\`\`bash
curl -X PATCH http://localhost:3000/api/experiences/<EXPERIENCE_ID>/publish \
  -H "Authorization: Bearer <TOKEN>"
\`\`\`

#### Block Experience (Admin Only)
\`\`\`bash
curl -X PATCH http://localhost:3000/api/experiences/<EXPERIENCE_ID>/block \
  -H "Authorization: Bearer <TOKEN>"
\`\`\`

#### List Published Experiences (Public)
\`\`\`bash
curl "http://localhost:3000/api/experiences?location=Miami,FL&sort=desc"
\`\`\`

### Bookings
#### Book an Experience (User Only)
\`\`\`bash
curl -X POST http://localhost:3000/api/experiences/<EXPERIENCE_ID>/book \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{ "seats": 2 }'
\`\`\`

### Observability
#### Health Check
\`\`\`bash
curl http://localhost:3000/api/health
# Response: { "status": "ok", "database": "connected", ... }
\`\`\`

## 🔒 RBAC Rules Implemented

- **Users**:
  - Can **Sign up** and **Login**.
  - Can **View** published experiences.
  - Can **Book** experiences (cannot book if role is Host calling their own experience).
  - Can **view** their own bookings.

- **Hosts**:
  - All User permissions.
  - Can **Create** experiences (starts as `draft`).
  - Can **Publish** their *own* experiences.
  - Can **View bookings** for their experiences.
  - **Cannot** book their own experiences.

- **Admins**:
  - Can **Create**, **Publish**, and **Block** ANY experience.
  - Can **Cancel** ANY booking.
  - Can view ALL bookings.
