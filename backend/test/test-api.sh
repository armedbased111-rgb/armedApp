#!/bin/bash

API_URL="http://localhost:3000"
EMAIL="test@example.com"
PASSWORD="password123"

echo "=== Test API ==="

# Login
echo -e "\n1. Login"
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")

TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "❌ Login failed"
  echo "$LOGIN_RESPONSE"
  exit 1
fi

echo "✓ Token: ${TOKEN:0:50}..."

# Create Project
echo -e "\n2. Create Project"
PROJECT_RESPONSE=$(curl -s -X POST "$API_URL/projects" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"Mon Projet","description":"Test","dawType":"ableton"}')

PROJECT_ID=$(echo "$PROJECT_RESPONSE" | grep -o '"id":"[^"]*"' | cut -d'"' -f4)

if [ -z "$PROJECT_ID" ]; then
  echo "❌ Project creation failed"
  echo "$PROJECT_RESPONSE"
  exit 1
fi

echo "✓ Project ID: $PROJECT_ID"

# List Projects
echo -e "\n3. List Projects"
curl -s -X GET "$API_URL/projects" \
  -H "Authorization: Bearer $TOKEN"

# Create Track
echo -e "\n\n4. Create Track"
TRACK_RESPONSE=$(curl -s -X POST "$API_URL/tracks" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"name\":\"Track 1\",\"projectId\":\"$PROJECT_ID\",\"filename\":\"track1.wav\",\"filePath\":\"/storage/track1.wav\"}")

echo "$TRACK_RESPONSE"

echo -e "\n=== Done ==="