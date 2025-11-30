#!/bin/bash

# Couleurs pour l'affichage
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:3000"

echo -e "${BLUE}=== Test des Sessions Utilisateur ===${NC}\n"

# 1. Login pour obtenir les tokens
echo -e "${GREEN}1. Login...${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"zxran@gmail.com","password":"cokedanslasdb"}')

echo "$LOGIN_RESPONSE" | jq '.'

ACCESS_TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.access_token')
REFRESH_TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.refresh_token')

if [ "$ACCESS_TOKEN" == "null" ]; then
  echo -e "${RED}❌ Login échoué${NC}"
  exit 1
fi

echo -e "${GREEN}✅ Access Token obtenu${NC}\n"
sleep 1

# 2. Login une 2ème fois pour créer une autre session
echo -e "${GREEN}2. Login une 2ème fois (création 2ème session)...${NC}"
LOGIN2_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"zxran@gmail.com","password":"cokedanslasdb"}')

echo "$LOGIN2_RESPONSE" | jq '.'
ACCESS_TOKEN2=$(echo "$LOGIN2_RESPONSE" | jq -r '.access_token')
echo -e "${GREEN}✅ 2ème session créée${NC}\n"
sleep 1

# 3. Lister les sessions
echo -e "${GREEN}3. Liste des sessions actives...${NC}"
SESSIONS_RESPONSE=$(curl -s -X GET "$BASE_URL/auth/sessions" \
  -H "Authorization: Bearer $ACCESS_TOKEN")

echo "$SESSIONS_RESPONSE" | jq '.'

# Récupérer l'ID de la première session
SESSION_ID=$(echo "$SESSIONS_RESPONSE" | jq -r '.[0].id')
echo -e "${BLUE}ID de la première session: $SESSION_ID${NC}\n"
sleep 1

# 4. Révoquer une session spécifique
if [ "$SESSION_ID" != "null" ]; then
  echo -e "${GREEN}4. Révocation de la première session...${NC}"
  REVOKE_RESPONSE=$(curl -s -X DELETE "$BASE_URL/auth/sessions/$SESSION_ID" \
    -H "Authorization: Bearer $ACCESS_TOKEN2")
  
  echo "$REVOKE_RESPONSE" | jq '.'
  echo -e "${GREEN}✅ Session révoquée${NC}\n"
  sleep 1
fi

# 5. Vérifier la liste après révocation
echo -e "${GREEN}5. Liste des sessions après révocation...${NC}"
SESSIONS_AFTER=$(curl -s -X GET "$BASE_URL/auth/sessions" \
  -H "Authorization: Bearer $ACCESS_TOKEN2")

echo "$SESSIONS_AFTER" | jq '.'
sleep 1

# 6. Créer 2 nouvelles sessions pour tester "révoquer toutes sauf une"
echo -e "\n${GREEN}6. Création de 2 nouvelles sessions...${NC}"
curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"zxran@gmail.com","password":"cokedanslasdb"}' > /dev/null

curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"zxran@gmail.com","password":"cokedanslasdb"}' > /dev/null

echo -e "${GREEN}✅ 2 sessions créées${NC}\n"
sleep 1

# 7. Lister toutes les sessions
echo -e "${GREEN}7. Liste de toutes les sessions...${NC}"
ALL_SESSIONS=$(curl -s -X GET "$BASE_URL/auth/sessions" \
  -H "Authorization: Bearer $ACCESS_TOKEN2")

echo "$ALL_SESSIONS" | jq '.'

CURRENT_SESSION_ID=$(echo "$ALL_SESSIONS" | jq -r '.[0].id')
echo -e "${BLUE}Session à garder: $CURRENT_SESSION_ID${NC}\n"
sleep 1

# 8. Révoquer toutes les autres sessions
echo -e "${GREEN}8. Révocation de toutes les autres sessions...${NC}"
REVOKE_ALL_RESPONSE=$(curl -s -X DELETE "$BASE_URL/auth/sessions" \
  -H "Authorization: Bearer $ACCESS_TOKEN2" \
  -H "Content-Type: application/json" \
  -d "{\"currentSessionId\":\"$CURRENT_SESSION_ID\"}")

echo "$REVOKE_ALL_RESPONSE" | jq '.'
echo -e "${GREEN}✅ Toutes les autres sessions révoquées${NC}\n"
sleep 1

# 9. Vérifier qu'il ne reste qu'une session
echo -e "${GREEN}9. Vérification finale - doit rester 1 seule session...${NC}"
FINAL_SESSIONS=$(curl -s -X GET "$BASE_URL/auth/sessions" \
  -H "Authorization: Bearer $ACCESS_TOKEN2")

echo "$FINAL_SESSIONS" | jq '.'

SESSION_COUNT=$(echo "$FINAL_SESSIONS" | jq 'length')
if [ "$SESSION_COUNT" == "1" ]; then
  echo -e "${GREEN}✅ Test réussi ! Il reste bien 1 seule session${NC}"
else
  echo -e "${RED}❌ Erreur : il reste $SESSION_COUNT sessions${NC}"
fi

echo -e "\n${BLUE}=== Tests terminés ===${NC}"

