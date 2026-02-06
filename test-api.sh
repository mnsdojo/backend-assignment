#!/bin/bash

# Configuration
API_URL="http://localhost:3000/api"
HOST_EMAIL="host_$(date +%s)@test.com"
USER_EMAIL="user_$(date +%s)@test.com"
PASSWORD="password123"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

log() {
  echo -e "${GREEN}[TEST]${NC} $1"
}

error() {
  echo -e "${RED}[ERROR]${NC} $1"
}

# Helper to extract JSON field using node
get_json_value() {
  echo "$1" | node -e "console.log(JSON.parse(fs.readFileSync(0, 'utf-8')).$2 || '')"
}

# 1. Health Check
log "Checking Health..."
HEALTH_STATUS=$(curl -s "$API_URL/health" | node -e "console.log(JSON.parse(fs.readFileSync(0, 'utf-8')).status)")
if [ "$HEALTH_STATUS" != "ok" ]; then
  error "Health check failed!"
  exit 1
fi
log "Health check passed!"

# 2. Host Flow
log "Registering Host ($HOST_EMAIL)..."
curl -s -X POST "$API_URL/auth/signup" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$HOST_EMAIL\", \"password\": \"$PASSWORD\", \"role\": \"host\"}" > /dev/null

log "Logging in Host..."
HOST_RES=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$HOST_EMAIL\", \"password\": \"$PASSWORD\"}")

HOST_TOKEN=$(echo "$HOST_RES" | node -e "console.log(JSON.parse(fs.readFileSync(0, 'utf-8')).token)")

if [ "$HOST_TOKEN" == "undefined" ]; then
  error "Host login failed!"
  echo "Response: $HOST_RES"
  exit 1
fi
log "Host logged in successfully!"

log "Creating Experience..."
EXP_RES=$(curl -s -X POST "$API_URL/experiences" \
  -H "Authorization: Bearer $HOST_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Automated Test Experience",
    "description": "Created via test script.",
    "location": "Test City",
    "price": 100,
    "start_time": "2025-01-01T10:00:00Z"
  }')

EXP_ID=$(echo "$EXP_RES" | node -e "console.log(JSON.parse(fs.readFileSync(0, 'utf-8')).experience.id)")

if [ "$EXP_ID" == "undefined" ]; then
  error "Create experience failed!"
  echo "Response: $EXP_RES"
  exit 1
fi
log "Experience created with ID: $EXP_ID"

log "Publishing Experience..."
PUB_RES=$(curl -s -X PATCH "$API_URL/experiences/$EXP_ID/publish" \
  -H "Authorization: Bearer $HOST_TOKEN")

PUB_STATUS=$(echo "$PUB_RES" | node -e "console.log(JSON.parse(fs.readFileSync(0, 'utf-8')).experience.status)")
if [ "$PUB_STATUS" != "published" ]; then
   error "Publish experience failed!"
   echo "Response: $PUB_RES"
   exit 1
fi
log "Experience published!"

# 3. User Flow
log "Registering User ($USER_EMAIL)..."
curl -s -X POST "$API_URL/auth/signup" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$USER_EMAIL\", \"password\": \"$PASSWORD\", \"role\": \"user\"}" > /dev/null

log "Logging in User..."
USER_RES=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$USER_EMAIL\", \"password\": \"$PASSWORD\"}")

USER_TOKEN=$(echo "$USER_RES" | node -e "console.log(JSON.parse(fs.readFileSync(0, 'utf-8')).token)")

log "Booking Experience..."
BOOK_RES=$(curl -s -X POST "$API_URL/experiences/$EXP_ID/book" \
  -H "Authorization: Bearer $USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ "seats": 2 }')

BOOK_STATUS=$(echo "$BOOK_RES" | node -e "console.log(JSON.parse(fs.readFileSync(0, 'utf-8')).booking.experience.title ? 'success' : 'fail')")

if [ "$BOOK_STATUS" != "success" ]; then
  error "Booking failed!"
  echo "Response: $BOOK_RES"
  exit 1
fi
log "Booking confirmed!"

log "All tests passed successfully! 🚀"
