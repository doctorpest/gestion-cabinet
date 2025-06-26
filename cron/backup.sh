#!/bin/bash

export PGPASSWORD="mdpcabinet"

DB_USER="doctorpest"
DB_NAME="gestion_cabinet"
BACKUP_DIR="/backups"
DATE=$(date +'%Y-%m-%d_%H-%M-%S')

mkdir -p $BACKUP_DIR
pg_dump -U $DB_USER -d $DB_NAME > "$BACKUP_DIR/backup_$DATE.sql"
