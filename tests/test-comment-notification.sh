#!/bin/bash

# Token HIDN (qui commente)
TOKEN_HIDN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImhpZG5AZ21haWwuY29tIiwic3ViIjoiMzk0MDY3ZjgtNWEwNy00ZTBiLThkZGEtYmI1ZjM3MzkzZWU1IiwiaWF0IjoxNzY0MjA0NTY2LCJleHAiOjE3NjQ4MDkzNjZ9.PLGjGVZidlmPeiE1gCuBIHj0tcOLUzq39cVgjhSgRyQ"

# Token ZXRAN (propriétaire)
TOKEN_ZXRAN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Inp4cmFuQGdtYWlsLmNvbSIsInN1YiI6ImM0ZTRiNzJjLTQ5MDktNDEwZi1hODE3LWNlZGRmODQxOTE5NiIsImlhdCI6MTc2NDIwMzg2MCwiZXhwIjoxNzY0ODA4NjYwfQ.lyh_wYKI2zNFsPv5YEfhHGYz5IqZusRsxcxDDRex6e8"

TRACK_ID="05c44cfa-2cd9-4d69-a9b6-e301905a6869"

echo "🔍 Test création notification COMMENT"
echo "======================================"
echo ""

echo "1️⃣  HIDN crée un nouveau commentaire..."
COMMENT_RESPONSE=$(curl -s -X POST "http://localhost:3000/comments" \
  -H "Authorization: Bearer $TOKEN_HIDN" \
  -H "Content-Type: application/json" \
  -d "{\"trackId\": \"$TRACK_ID\", \"content\": \"Test notification $(date +%s)\"}")
echo "$COMMENT_RESPONSE" | jq '.'

echo ""
echo "2️⃣  Attente de 2 secondes pour laisser le temps à la notification d'être créée..."
sleep 2

echo ""
echo "3️⃣  Vérification des notifications de ZXRAN..."
curl -s -X GET "http://localhost:3000/notifications?limit=50&offset=0" \
  -H "Authorization: Bearer $TOKEN_ZXRAN" | jq '.notifications[] | {type: .type, actor: .actor.name, createdAt: .createdAt, read: .read}'

echo ""
echo "4️⃣  Compteur de non lues..."
curl -s -X GET "http://localhost:3000/notifications/unread-count" \
  -H "Authorization: Bearer $TOKEN_ZXRAN" | jq '.'

echo ""
echo "✅ Vérifie les logs du serveur backend pour voir les messages de création de notification."

