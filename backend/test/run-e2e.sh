#!/usr/bin/env bash

set -Eeuo pipefail

BACKEND_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
E2E_DATABASE_URL="${TEST_DATABASE_URL:-}"
STARTED_LOCAL_DATABASE=false

cleanup() {
    if [[ "$STARTED_LOCAL_DATABASE" == "true" ]]; then
        docker compose --project-directory "$BACKEND_DIR" stop postgres-test > /dev/null
    fi
}

trap cleanup EXIT

cd "$BACKEND_DIR"

if [[ -z "${TEST_DATABASE_URL:-}" ]]; then
    command -v docker > /dev/null 2>&1 || {
        echo "Docker is required when TEST_DATABASE_URL is not set."
        exit 1
    }

    docker info > /dev/null 2>&1 || {
        echo "Docker is not running."
        exit 1
    }

    docker compose --project-directory "$BACKEND_DIR" up -d postgres-test
    STARTED_LOCAL_DATABASE=true

    TEST_DATABASE_ADDRESS="$(docker compose --project-directory "$BACKEND_DIR" port postgres-test 5432)"
    TEST_DATABASE_PORT="${TEST_DATABASE_ADDRESS##*:}"
    E2E_DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:${TEST_DATABASE_PORT}/verba_test"

    for attempt in $(seq 1 30); do
        if docker compose --project-directory "$BACKEND_DIR" exec -T postgres-test \
            pg_isready -U postgres -d verba_test > /dev/null 2>&1; then
            break
        fi

        if [[ "$attempt" -eq 30 ]]; then
            echo "Test PostgreSQL did not become ready."
            exit 1
        fi

        sleep 1
    done
fi

DATABASE_URL="$E2E_DATABASE_URL" npm run db:migrate

./node_modules/.bin/tsc --project test/tsconfig.e2e.json

DATABASE_URL="$E2E_DATABASE_URL" \
JWT_SECRET="e2e-only-secret-with-at-least-32-characters" \
JWT_EXPIRES_IN="1h" \
COOKIE_SECURE="false" \
NODE_ENV="test" \
node --test --test-concurrency=1 .e2e-dist/test/app.e2e-spec.js
