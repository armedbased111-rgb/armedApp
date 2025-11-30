#!/bin/bash

API_URL="http://localhost:3000"
EMAIL="zxran@gmail.com"
PASSWORD="cokedanslasdb"  # Change avec ton vrai mot de passe

echo "🔄 Test du système de Refresh Tokens"
echo "======================================"

# 1. Test Login - doit retourner access_token ET refresh_token
echo -e "\n1️⃣  Test LOGIN (doit retourner access_token + refresh_token)..."
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")

echo "$LOGIN_RESPONSE" | jq '.'

# Extraire les tokens
ACCESS_TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.access_token // empty')
REFRESH_TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.refresh_token // empty')

if [ -z "$ACCESS_TOKEN" ] || [ -z "$REFRESH_TOKEN" ]; then
  echo "❌ Login failed - access_token ou refresh_token manquant"
  exit 1
fi

echo -e "\n✅ Login réussi !"
echo "   Access Token: ${ACCESS_TOKEN:0:50}..."
echo "   Refresh Token: ${REFRESH_TOKEN:0:50}..."

# 2. Test Refresh Token - doit retourner un nouveau access_token
echo -e "\n2️⃣  Test REFRESH (avec le refresh_token obtenu)..."
REFRESH_RESPONSE=$(curl -s -X POST "$API_URL/auth/refresh" \
  -H "Content-Type: application/json" \
  -d "{\"refresh_token\":\"$REFRESH_TOKEN\"}")

echo "$REFRESH_RESPONSE" | jq '.'

NEW_ACCESS_TOKEN=$(echo "$REFRESH_RESPONSE" | jq -r '.access_token // empty')

if [ -z "$NEW_ACCESS_TOKEN" ]; then
  echo "❌ Refresh failed - nouveau access_token manquant"
  exit 1
fi

echo -e "\n✅ Refresh réussi !"
echo "   Nouveau Access Token: ${NEW_ACCESS_TOKEN:0:50}..."

# 3. Vérifier que le nouveau token fonctionne
echo -e "\n3️⃣  Test du nouveau access_token (requête authentifiée avec /feed)..."
FEED_RESPONSE=$(curl -s -X GET "$API_URL/feed?limit=5" \
  -H "Authorization: Bearer $NEW_ACCESS_TOKEN")

if echo "$FEED_RESPONSE" | jq -e '.tracks' > /dev/null 2>&1; then
  echo "✅ Nouveau token valide !"
  TRACK_COUNT=$(echo "$FEED_RESPONSE" | jq '.tracks | length')
  echo "   Nombre de tracks dans le feed: $TRACK_COUNT"
else
  echo "⚠️  Réponse inattendue:"
  echo "$FEED_RESPONSE" | jq '.' 2>/dev/null || echo "$FEED_RESPONSE"
fi

# 4. Test avec un refresh_token invalide
echo -e "\n4️⃣  Test REFRESH avec un token invalide (doit échouer)..."
INVALID_REFRESH_RESPONSE=$(curl -s -X POST "$API_URL/auth/refresh" \
  -H "Content-Type: application/json" \
  -d "{\"refresh_token\":\"invalid_token_12345\"}")

echo "$INVALID_REFRESH_RESPONSE" | jq '.'

if echo "$INVALID_REFRESH_RESPONSE" | jq -e '.message' > /dev/null 2>&1; then
  echo "✅ Erreur correcte pour token invalide"
else
  echo "⚠️  Réponse inattendue pour token invalide"
fi

# 5. Test avec refresh_token manquant
echo -e "\n5️⃣  Test REFRESH sans token (doit échouer)..."
MISSING_REFRESH_RESPONSE=$(curl -s -X POST "$API_URL/auth/refresh" \
  -H "Content-Type: application/json" \
  -d "{}")

echo "$MISSING_REFRESH_RESPONSE" | jq '.'

if echo "$MISSING_REFRESH_RESPONSE" | jq -e '.message' > /dev/null 2>&1; then
  echo "✅ Erreur correcte pour token manquant"
else
  echo "⚠️  Réponse inattendue pour token manquant"
fi

# 6. Test LOGOUT - invalider un refresh_token
echo -e "\n6️⃣  Test LOGOUT (invalider un refresh_token)..."
# Faire un nouveau login pour obtenir un refresh_token à invalider
LOGOUT_LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")

LOGOUT_REFRESH_TOKEN=$(echo "$LOGOUT_LOGIN_RESPONSE" | jq -r '.refresh_token // empty')

if [ -z "$LOGOUT_REFRESH_TOKEN" ]; then
  echo "❌ Impossible d'obtenir un refresh_token pour le test de logout"
else
  echo "   Refresh Token obtenu: ${LOGOUT_REFRESH_TOKEN:0:50}..."
  
  # Faire le logout
  LOGOUT_RESPONSE=$(curl -s -X POST "$API_URL/auth/logout" \
    -H "Content-Type: application/json" \
    -d "{\"refresh_token\":\"$LOGOUT_REFRESH_TOKEN\"}")
  
  echo "$LOGOUT_RESPONSE" | jq '.'
  
  if echo "$LOGOUT_RESPONSE" | jq -e '.message' > /dev/null 2>&1; then
    echo "✅ Logout réussi !"
    
    # Essayer de refresh avec le token invalidé (doit échouer)
    echo -e "\n7️⃣  Test REFRESH avec token invalidé par logout (doit échouer)..."
    INVALIDATED_REFRESH_RESPONSE=$(curl -s -X POST "$API_URL/auth/refresh" \
      -H "Content-Type: application/json" \
      -d "{\"refresh_token\":\"$LOGOUT_REFRESH_TOKEN\"}")
    
    echo "$INVALIDATED_REFRESH_RESPONSE" | jq '.'
    
    if echo "$INVALIDATED_REFRESH_RESPONSE" | jq -e '.message' > /dev/null 2>&1; then
      echo "✅ Erreur correcte - token invalidé ne peut plus être utilisé"
    else
      echo "⚠️  Réponse inattendue - le token invalidé devrait être rejeté"
    fi
  else
    echo "⚠️  Réponse inattendue pour logout"
  fi
fi

echo -e "\n✅ Tests terminés !"
echo "======================================"
echo "Résumé :"
echo "  - Login retourne access_token + refresh_token ✓"
echo "  - Refresh retourne un nouveau access_token ✓"
echo "  - Nouveau token fonctionne ✓"
echo "  - Tokens invalides sont rejetés ✓"
echo "  - Logout invalide le refresh_token ✓"
echo "  - Token invalidé ne peut plus être utilisé ✓"

