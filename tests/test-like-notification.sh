#!/bin/bash

# Token HIDN (qui like)
TOKEN_HIDN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImhpZG5AZ21haWwuY29tIiwic3ViIjoiMzk0MDY3ZjgtNWEwNy00ZTBiLThkZGEtYmI1ZjM3MzkzZWU1IiwiaWF0IjoxNzY0MjA0NTY2LCJleHAiOjE3NjQ4MDkzNjZ9.PLGjGVZidlmPeiE1gCuBIHj0tcOLUzq39cVgjhSgRyQ"

# Token ZXRAN (propriétaire)
TOKEN_ZXRAN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Inp4cmFuQGdtYWlsLmNvbSIsInN1YiI6ImM0ZTRiNzJjLTQ5MDktNDEwZi1hODE3LWNlZGRmODQxOTE5NiIsImlhdCI6MTc2NDIwNTA3NywiZXhwIjoxNzY0ODA5ODc3fQ.sVtOomDs76JUGHkOZtaX5F-JPBIZHZrx4C6BNaa--Pg"

TRACK_ID="05c44cfa-2cd9-4d69-a9b6-e301905a6869"

echo "🔍 Test création notification LIKE"
echo "==================================="
echo ""

echo "1️⃣  HIDN unlike d'abord (pour pouvoir reliker)..."
curl -s -X DELETE "http://localhost:3000/likes/$TRACK_ID" \
  -H "Authorization: Bearer $TOKEN_HIDN" | jq '.'

echo ""
echo "2️⃣  HIDN like la track de ZXRAN..."
LIKE_RESPONSE=$(curl -s -X POST "http://localhost:3000/likes/$TRACK_ID" \
  -H "Authorization: Bearer $TOKEN_HIDN" \
  -H "Content-Type: application/json")
echo "$LIKE_RESPONSE" | jq '.'

echo ""
echo "3️⃣  Attente de 2 secondes..."
sleep 2

echo ""
echo "4️⃣  Vérification des notifications de ZXRAN..."
curl -s -X GET "http://localhost:3000/notifications?limit=50&offset=0" \
  -H "Authorization: Bearer $TOKEN_ZXRAN" | jq '.notifications[] | {type: .type, actor: .actor.name, createdAt: .createdAt, read: .read}'

echo ""
echo "5️⃣  Compteur de non lues..."
curl -s -X GET "http://localhost:3000/notifications/unread-count" \
  -H "Authorization: Bearer $TOKEN_ZXRAN" | jq '.'

echo ""
echo "✅ Test terminé !"

