#!/usr/bin/env bash
# Aplica as migrações num PostgreSQL de teste (com simulação do schema auth do Supabase) e roda os testes SQL.
# Uso: PGHOST=/var/run/postgresql PGPORT=5433 PGUSER=postgres scripts/testar-sql.sh
set -euo pipefail
cd "$(dirname "$0")/.."
P="psql -v ON_ERROR_STOP=1 -q"
$P -c "drop database if exists medliga_teste" -c "create database medliga_teste" >/dev/null 2>&1
$P -d medliga_teste -f supabase/tests/shim_auth.sql
for m in supabase/migrations/*.sql; do $P -d medliga_teste -f "$m"; done
$P -d medliga_teste -c "grant select on all tables in schema public to authenticated, anon"
node --experimental-strip-types scripts/gerar-seed.ts >/dev/null
$P -d medliga_teste -f supabase/seed.sql
$P -d medliga_teste -f supabase/tests/teste_funcoes.sql | grep -E "PASSARAM|FALHOU"
