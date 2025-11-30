#!/bin/bash

# Token du compte hidn (qui va liker/commenter)
TOKEN_HIDN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImhpZG5AZ21haWwuY29tIiwic3ViIjoiMzk0MDY3ZjgtNWEwNy00ZTBiLThkZGEtYmI1ZjM3MzkzZWU1IiwiaWF0IjoxNzY0MjA0NTY2LCJleHAiOjE3NjQ4MDkzNjZ9.PLGjGVZidlmPeiE1gCuBIHj0tcOLUzq39cVgjhSgRyQ"

# Token du compte zxran (propriétaire de la track, qui recevra les notifications)
TOKEN_ZXRAN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Inp4cmFuQGdtYWlsLmNvbSIsInN1YiI6ImM0ZTRiNzJjLTQ5MDktNDEwZi1hODE3LWNlZGRmODQxOTE5NiIsImlhdCI6MTc2NDIwMzg2MCwiZXhwIjoxNzY0ODA4NjYwfQ.lyh_wYKI2zNFsPv5YEfhHGYz5IqZusRsxcxDDRex6e8"

TRACK_ID="05c44cfa-2cd9-4d69-a9b6-e301905a6869"

echo "🔍 Test des notifications avec deux comptes"
echo "============================================"
echo ""
echo "Compte HIDN va liker/commenter la track de ZXRAN"
echo "ZXRAN devrait recevoir les notifications"
echo ""

echo "1️⃣  Vérification des notifications de ZXRAN avant..."
curl -s -X GET "http://localhost:3000/notifications?limit=50&offset=0" \
  -H "Authorization: Bearer $TOKEN_ZXRAN" | jq '.notifications | length'

echo ""
echo "2️⃣  HIDN like la track de ZXRAN..."
LIKE_RESPONSE=$(curl -s -X POST "http://localhost:3000/likes/$TRACK_ID" \
  -H "Authorization: Bearer $TOKEN_HIDN" \
  -H "Content-Type: application/json")
echo "$LIKE_RESPONSE" | jq '.'

echo ""
echo "3️⃣  HIDN commente la track de ZXRAN..."
COMMENT_RESPONSE=$(curl -s -X POST "http://localhost:3000/comments" \
  -H "Authorization: Bearer $TOKEN_HIDN" \
  -H "Content-Type: application/json" \
  -d "{\"trackId\": \"$TRACK_ID\", \"content\": \"Super track de zxran !\"}")
echo "$COMMENT_RESPONSE" | jq '.'

echo ""
echo "4️⃣  Attente de 1 seconde..."
sleep 1

echo ""
echo "5️⃣  Vérification des notifications de ZXRAN après..."
curl -s -X GET "http://localhost:3000/notifications?limit=50&offset=0" \
  -H "Authorization: Bearer $TOKEN_ZXRAN" | jq '.notifications[] | {type: .type, actor: .actor.name, read: .read}'

echo ""
echo "6️⃣  Compteur de non lues de ZXRAN..."
curl -s -X GET "http://localhost:3000/notifications/unread-count" \
  -H "Authorization: Bearer $TOKEN_ZXRAN" | jq '.'

echo ""
echo "✅ Test terminé ! Vérifie les logs du serveur backend."

