#!/bin/bash

DB_NAME="gestion_cabinet"
DB_USER="doctorpest"
BACKUP_DIR="/backups"

echo "📦 Vérification de l'état de la base..."

IS_EMPTY=$(psql -U $DB_USER -d $DB_NAME -tAc "SELECT COUNT(*) FROM pg_tables WHERE schemaname='public';")

if [ "$IS_EMPTY" -eq 0 ]; then
  echo "🛠 Base vide. Tentative de restauration..."
  LATEST_BACKUP=$(ls -t $BACKUP_DIR/*.sql 2>/dev/null | head -n 1)

  if [ -f "$LATEST_BACKUP" ]; then
    echo "✅ Restauration depuis $LATEST_BACKUP"
    psql -U $DB_USER -d $DB_NAME < "$LATEST_BACKUP"
  else
    echo "⚠️ Aucun backup trouvé. Aucune restauration possible."
  fi
else
  echo "✅ La base contient déjà des données. Pas de restauration nécessaire."
fi
