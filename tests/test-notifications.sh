#!/bin/bash

# Token et IDs
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Inp4cmFuQGdtYWlsLmNvbSIsInN1YiI6ImM0ZTRiNzJjLTQ5MDktNDEwZi1hODE3LWNlZGRmODQxOTE5NiIsImlhdCI6MTc2NDIwMzMxOSwiZXhwIjoxNzY0ODA4MTE5fQ.A-NUuyXWmtO7SOYHEb6Mx62I0eTzLwSMlyTxB14nNao"
TRACK_ID="05c44cfa-2cd9-4d69-a9b6-e301905a6869"
USER_ID="394067f8-5a07-4e0b-8dda-bb5f37393ee5"

echo "🔍 Test des notifications"
echo "=========================="

echo -e "\n1️⃣  Vérification des notifications existantes..."
curl -s -X GET "http://localhost:3000/notifications?limit=50&offset=0" \
  -H "Authorization: Bearer $TOKEN" | jq '.'

echo -e "\n2️⃣  Compteur de non lues..."
curl -s -X GET "http://localhost:3000/notifications/unread-count" \
  -H "Authorization: Bearer $TOKEN" | jq '.'

echo -e "\n3️⃣  Test LIKE..."
LIKE_RESPONSE=$(curl -s -X POST "http://localhost:3000/likes/$TRACK_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json")
echo "$LIKE_RESPONSE" | jq '.'

echo -e "\n4️⃣  Test COMMENT..."
COMMENT_RESPONSE=$(curl -s -X POST "http://localhost:3000/comments" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"trackId\": \"$TRACK_ID\", \"content\": \"Test notification comment\"}")
echo "$COMMENT_RESPONSE" | jq '.'

echo -e "\n5️⃣  Test FOLLOW..."
FOLLOW_RESPONSE=$(curl -s -X POST "http://localhost:3000/follows/$USER_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json")
echo "$FOLLOW_RESPONSE" | jq '.'

echo -e "\n6️⃣  Vérification des notifications après actions..."
sleep 1
curl -s -X GET "http://localhost:3000/notifications?limit=50&offset=0" \
  -H "Authorization: Bearer $TOKEN" | jq '.notifications | length'

echo -e "\n✅ Test terminé. Vérifie les logs du serveur backend pour voir si les notifications sont créées."

