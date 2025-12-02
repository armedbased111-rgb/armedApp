#!/bin/bash

# Couleurs pour l'affichage
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:3000"
TIMESTAMP=$(date +%s)
TEST_EMAIL="test-reset-$TIMESTAMP@example.com"
TEST_PASSWORD="oldpassword123"
NEW_PASSWORD="newpassword456"

echo -e "${BLUE}=== Test de Réinitialisation de Mot de Passe ===${NC}\n"

# 1. Créer un utilisateur de test
echo -e "${GREEN}1. Création d'un utilisateur de test...${NC}"
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASSWORD\",\"name\":\"Test Reset\"}")

echo "$REGISTER_RESPONSE" | jq '.'

USER_ID=$(echo "$REGISTER_RESPONSE" | jq -r '.user.id')
if [ "$USER_ID" == "null" ]; then
  echo -e "${RED}❌ Échec de l'inscription${NC}"
  exit 1
fi

echo -e "${GREEN}✅ Utilisateur créé: $TEST_EMAIL${NC}\n"
sleep 1

# 2. Vérifier qu'on peut se connecter avec l'ancien mot de passe
echo -e "${GREEN}2. Vérification de la connexion avec l'ancien mot de passe...${NC}"
LOGIN_OLD=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASSWORD\"}")

if echo "$LOGIN_OLD" | jq -e '.access_token' | grep -q "null"; then
  echo -e "${RED}❌ Échec de connexion avec l'ancien mot de passe${NC}"
  exit 1
fi

echo -e "${GREEN}✅ Connexion réussie avec l'ancien mot de passe${NC}\n"
sleep 1

# 3. Demander une réinitialisation de mot de passe
echo -e "${GREEN}3. Demande de réinitialisation de mot de passe...${NC}"
FORGOT_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/forgot-password" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$TEST_EMAIL\"}")

echo "$FORGOT_RESPONSE" | jq '.'

RESET_TOKEN=$(echo "$FORGOT_RESPONSE" | jq -r '.token')

if [ "$RESET_TOKEN" == "null" ] || [ -z "$RESET_TOKEN" ]; then
  echo -e "${RED}❌ Pas de token de reset dans la réponse${NC}"
  exit 1
fi

echo -e "${GREEN}✅ Token de reset obtenu: ${RESET_TOKEN:0:20}...${NC}\n"
sleep 1

# 4. Réinitialiser le mot de passe avec le token
echo -e "${GREEN}4. Réinitialisation du mot de passe avec le token...${NC}"
RESET_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/reset-password" \
  -H "Content-Type: application/json" \
  -d "{\"token\":\"$RESET_TOKEN\",\"newPassword\":\"$NEW_PASSWORD\"}")

echo "$RESET_RESPONSE" | jq '.'

if echo "$RESET_RESPONSE" | jq -e '.message' | grep -q "reset successfully"; then
  echo -e "${GREEN}✅ Mot de passe réinitialisé avec succès${NC}\n"
else
  echo -e "${RED}❌ Erreur lors de la réinitialisation${NC}"
  exit 1
fi
sleep 1

# 5. Vérifier qu'on ne peut plus se connecter avec l'ancien mot de passe
echo -e "${GREEN}5. Vérification : l'ancien mot de passe ne fonctionne plus...${NC}"
LOGIN_OLD_FAIL=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASSWORD\"}")

if echo "$LOGIN_OLD_FAIL" | jq -e '.access_token' | grep -q "null"; then
  echo -e "${GREEN}✅ L'ancien mot de passe ne fonctionne plus (comme attendu)${NC}\n"
else
  echo -e "${RED}❌ L'ancien mot de passe fonctionne encore (problème !)${NC}"
  exit 1
fi
sleep 1

# 6. Vérifier qu'on peut se connecter avec le nouveau mot de passe
echo -e "${GREEN}6. Vérification : connexion avec le nouveau mot de passe...${NC}"
LOGIN_NEW=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"$NEW_PASSWORD\"}")

echo "$LOGIN_NEW" | jq '.'

if echo "$LOGIN_NEW" | jq -e '.access_token' | grep -q "null"; then
  echo -e "${RED}❌ Échec de connexion avec le nouveau mot de passe${NC}"
  exit 1
fi

echo -e "${GREEN}✅ Connexion réussie avec le nouveau mot de passe${NC}\n"
sleep 1

# 7. Test : Essayer de réutiliser le même token (doit échouer)
echo -e "${GREEN}7. Test : Réutiliser le même token (doit échouer)...${NC}"
RESET_AGAIN=$(curl -s -X POST "$BASE_URL/auth/reset-password" \
  -H "Content-Type: application/json" \
  -d "{\"token\":\"$RESET_TOKEN\",\"newPassword\":\"anotherpassword\"}")

echo "$RESET_AGAIN" | jq '.'

if echo "$RESET_AGAIN" | jq -e '.message' | grep -q "Invalid\|expired"; then
  echo -e "${GREEN}✅ Erreur attendue : token invalide ou expiré${NC}\n"
else
  echo -e "${YELLOW}⚠️  Réponse inattendue${NC}\n"
fi
sleep 1

# 8. Test : Demander un reset pour un email inexistant (ne doit pas leak)
echo -e "${GREEN}8. Test : Demander un reset pour un email inexistant...${NC}"
FORGOT_INVALID=$(curl -s -X POST "$BASE_URL/auth/forgot-password" \
  -H "Content-Type: application/json" \
  -d '{"email":"nonexistent@example.com"}')

echo "$FORGOT_INVALID" | jq '.'

if echo "$FORGOT_INVALID" | jq -e '.message' | grep -q "sent\|registered"; then
  echo -e "${GREEN}✅ Message générique retourné (pas de leak d'information)${NC}\n"
else
  echo -e "${YELLOW}⚠️  Réponse inattendue${NC}\n"
fi

echo -e "${BLUE}=== Tests terminés ===${NC}"

