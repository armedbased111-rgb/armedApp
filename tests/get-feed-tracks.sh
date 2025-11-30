#!/bin/bash

TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Inp4cmFuQGdtYWlsLmNvbSIsInN1YiI6ImM0ZTRiNzJjLTQ5MDktNDEwZi1hODE3LWNlZGRmODQxOTE5NiIsImlhdCI6MTc2NDIwMzg2MCwiZXhwIjoxNzY0ODA4NjYwfQ.lyh_wYKI2zNFsPv5YEfhHGYz5IqZusRsxcxDDRex6e8"

echo "📋 Récupération des tracks du feed..."
echo ""
RESPONSE=$(curl -s -X GET "http://localhost:3000/feed?limit=10" \
  -H "Authorization: Bearer $TOKEN")

echo "$RESPONSE" | jq '.tracks[] | {id: .id, name: .name, projectId: .projectId, owner: .project.user.name, ownerId: .project.user.id}'

