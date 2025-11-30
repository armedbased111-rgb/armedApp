#!/bin/bash

# Couleurs pour l'affichage
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:3000"

echo -e "${BLUE}=== Test de Validation d'Email ===${NC}\n"

# 1. Inscription (génère un token de vérification)
echo -e "${GREEN}1. Inscription d'un nouvel utilisateur...${NC}"
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"test-verify-'$(date +%s)'@example.com","password":"test123","name":"Test Verify"}')

echo "$REGISTER_RESPONSE" | jq '.'

VERIFICATION_TOKEN=$(echo "$REGISTER_RESPONSE" | jq -r '.verificationToken')

if [ "$VERIFICATION_TOKEN" == "null" ] || [ -z "$VERIFICATION_TOKEN" ]; then
  echo -e "${RED}❌ Pas de token de vérification dans la réponse${NC}"
  exit 1
fi

echo -e "${GREEN}✅ Token de vérification obtenu: ${VERIFICATION_TOKEN:0:20}...${NC}\n"
sleep 1

# 2. Vérifier l'email avec le token
echo -e "${GREEN}2. Vérification de l'email avec le token...${NC}"
VERIFY_RESPONSE=$(curl -s -X GET "$BASE_URL/auth/verify-email/$VERIFICATION_TOKEN")

echo "$VERIFY_RESPONSE" | jq '.'

if echo "$VERIFY_RESPONSE" | jq -e '.message' | grep -q "verified successfully"; then
  echo -e "${GREEN}✅ Email vérifié avec succès${NC}\n"
else
  echo -e "${RED}❌ Erreur lors de la vérification${NC}"
  exit 1
fi
sleep 1

# 3. Essayer de vérifier à nouveau (doit échouer)
echo -e "${GREEN}3. Tentative de vérification à nouveau (doit échouer)...${NC}"
VERIFY_AGAIN=$(curl -s -X GET "$BASE_URL/auth/verify-email/$VERIFICATION_TOKEN")

echo "$VERIFY_AGAIN" | jq '.'

if echo "$VERIFY_AGAIN" | jq -e '.message' | grep -q "already verified"; then
  echo -e "${GREEN}✅ Erreur attendue : email déjà vérifié${NC}\n"
else
  echo -e "${YELLOW}⚠️  Réponse inattendue${NC}\n"
fi
sleep 1

# 4. Test : Renvoyer le token de vérification
echo -e "${GREEN}4. Test : Inscription d'un autre utilisateur pour tester resend...${NC}"
REGISTER2_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"test-resend-'$(date +%s)'@example.com","password":"test123","name":"Test Resend"}')

EMAIL2=$(echo "$REGISTER2_RESPONSE" | jq -r '.user.email')
echo -e "${BLUE}Email: $EMAIL2${NC}\n"
sleep 1

# 5. Demander un nouveau token de vérification
echo -e "${GREEN}5. Demander un nouveau token de vérification...${NC}"
RESEND_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/resend-verification" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL2\"}")

echo "$RESEND_RESPONSE" | jq '.'

NEW_TOKEN=$(echo "$RESEND_RESPONSE" | jq -r '.token')

if [ "$NEW_TOKEN" != "null" ] && [ ! -z "$NEW_TOKEN" ]; then
  echo -e "${GREEN}✅ Nouveau token obtenu: ${NEW_TOKEN:0:20}...${NC}\n"
  sleep 1
  
  # 6. Vérifier avec le nouveau token
  echo -e "${GREEN}6. Vérification avec le nouveau token...${NC}"
  VERIFY_NEW=$(curl -s -X GET "$BASE_URL/auth/verify-email/$NEW_TOKEN")
  echo "$VERIFY_NEW" | jq '.'
  
  if echo "$VERIFY_NEW" | jq -e '.message' | grep -q "verified successfully"; then
    echo -e "${GREEN}✅ Email vérifié avec le nouveau token${NC}\n"
  fi
else
  echo -e "${RED}❌ Pas de nouveau token dans la réponse${NC}\n"
fi

# 7. Test : Essayer de renvoyer pour un email déjà vérifié (doit échouer)
echo -e "${GREEN}7. Test : Renvoyer pour un email déjà vérifié (doit échouer)...${NC}"
EMAIL1=$(echo "$REGISTER_RESPONSE" | jq -r '.user.email')
RESEND_VERIFIED=$(curl -s -X POST "$BASE_URL/auth/resend-verification" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL1\"}")

echo "$RESEND_VERIFIED" | jq '.'

if echo "$RESEND_VERIFIED" | jq -e '.message' | grep -q "already verified"; then
  echo -e "${GREEN}✅ Erreur attendue : email déjà vérifié${NC}\n"
fi

echo -e "${BLUE}=== Tests terminés ===${NC}"

