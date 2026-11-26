#!/bin/sh
set -eu

credential_file="/tmp/asisti-postgres-credential.json"
workflow_file="/opt/asisti/workflows/AsisTI - Captura y gestión de contactos.json"

# Create a decrypted credential document for n8n's CLI. Keeping the ID stable
# lets the imported workflow resolve the credential on every startup.
node -e '
const fs = require("fs");
const credential = [{
  id: "qItugGSnFBi98qJH",
  name: "Postgres account",
  type: "postgres",
  data: {
    host: "postgres-asisti",
    database: "asisti",
    user: "asisti_user",
    password: process.env.POSTGRES_PASSWORD || "asisti_local_dev",
    port: 5432,
    ssl: "disable",
    allowUnauthorizedCerts: false
  }
}];
fs.writeFileSync(process.argv[1], JSON.stringify(credential));
' "$credential_file"

n8n import:credentials --input="$credential_file" --decrypted
n8n import:workflow --input="$workflow_file" --overwrite
n8n publish:workflow --id=gfSvfqh9JCCUgc5Z
rm -f "$credential_file"

exec n8n start
