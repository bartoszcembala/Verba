#!/usr/bin/env bash

set -Eeuo pipefail

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$SCRIPT_DIR/backend"
FRONTEND_DIR="$SCRIPT_DIR/frontend"
BACKEND_PID=""
FRONTEND_PID=""

cleanup_on_error() {
    local exit_code=$?
    echo ""
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${RED}✗ Verba setup failed.${NC}"
    echo -e "${YELLOW}Fix the error above and run ./setup.sh again.${NC}"
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    exit "$exit_code"
}

cleanup_servers() {
    local exit_code=$?
    trap - EXIT INT TERM

    echo ""
    echo -e "${YELLOW}Stopping Verba services...${NC}"

    if [[ -n "$FRONTEND_PID" ]] && kill -0 "$FRONTEND_PID" 2>/dev/null; then
        kill "$FRONTEND_PID" 2>/dev/null || true
    fi

    if [[ -n "$BACKEND_PID" ]] && kill -0 "$BACKEND_PID" 2>/dev/null; then
        kill "$BACKEND_PID" 2>/dev/null || true
    fi

    [[ -n "$FRONTEND_PID" ]] && wait "$FRONTEND_PID" 2>/dev/null || true
    [[ -n "$BACKEND_PID" ]] && wait "$BACKEND_PID" 2>/dev/null || true

    echo -e "${GREEN}✓ Verba services stopped.${NC}"
    exit "$exit_code"
}

handle_shutdown() {
    exit 0
}

trap cleanup_on_error ERR

version_ge() {
    printf '%s\n%s\n' "$2" "$1" | sort -V -C
}

replace_env_value() {
    local file="$1"
    local key="$2"
    local value="$3"

    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s|^${key}=.*|${key}=${value}|" "$file"
    else
        sed -i "s|^${key}=.*|${key}=${value}|" "$file"
    fi
}

cd "$SCRIPT_DIR"

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}             Verba Development Environment Setup           ${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo -e "${GREEN}[1/8]${NC} Checking prerequisites..."
for command_name in node npm docker openssl; do
    if ! command -v "$command_name" > /dev/null 2>&1; then
        echo -e "  ${RED}✗${NC} $command_name is not installed"
        exit 1
    fi
done

if ! docker info > /dev/null 2>&1; then
    echo -e "  ${RED}✗${NC} Docker is not running"
    echo "    Start Docker Desktop and run ./setup.sh again."
    exit 1
fi

NODE_VERSION="$(node --version | sed 's/^v//')"
if ! version_ge "$NODE_VERSION" "20.0.0"; then
    echo -e "  ${RED}✗${NC} Node.js 20 or newer is required (current: $NODE_VERSION)"
    exit 1
fi
echo -e "  ${GREEN}✓${NC} Node.js $NODE_VERSION"
echo -e "  ${GREEN}✓${NC} npm $(npm --version)"
echo -e "  ${GREEN}✓${NC} Docker is running"
echo ""

echo -e "${GREEN}[2/8]${NC} Setting up environment files..."
if [[ ! -f "$BACKEND_DIR/.env" ]]; then
    cp "$BACKEND_DIR/.env.example" "$BACKEND_DIR/.env"
    JWT_SECRET="$(openssl rand -hex 32)"
    replace_env_value "$BACKEND_DIR/.env" "JWT_SECRET" "$JWT_SECRET"
    echo -e "  ${GREEN}✓${NC} Created backend/.env with a generated JWT secret"
else
    echo -e "  ${GREEN}✓${NC} backend/.env already exists (preserved)"
fi

if [[ ! -f "$FRONTEND_DIR/.env.development" ]]; then
    cp "$FRONTEND_DIR/.env.example" "$FRONTEND_DIR/.env.development"
    echo -e "  ${GREEN}✓${NC} Created frontend/.env.development"
else
    echo -e "  ${GREEN}✓${NC} frontend/.env.development already exists (preserved)"
fi
echo ""

echo -e "${GREEN}[3/8]${NC} Installing dependencies..."
echo "  → Installing backend packages"
npm ci --prefix "$BACKEND_DIR"
echo "  → Installing frontend packages"
npm ci --prefix "$FRONTEND_DIR"
echo -e "  ${GREEN}✓${NC} Dependencies installed"
echo ""

echo -e "${GREEN}[4/8]${NC} Starting PostgreSQL..."
docker compose --project-directory "$BACKEND_DIR" up -d postgres

MAX_RETRIES=30
for attempt in $(seq 1 "$MAX_RETRIES"); do
    if docker compose --project-directory "$BACKEND_DIR" exec -T postgres pg_isready -U postgres -d verba > /dev/null 2>&1; then
        echo -e "  ${GREEN}✓${NC} PostgreSQL is ready on localhost:5433"
        break
    fi

    if [[ "$attempt" -eq "$MAX_RETRIES" ]]; then
        echo -e "  ${RED}✗${NC} PostgreSQL did not become ready"
        exit 1
    fi

    echo "    Waiting for PostgreSQL ($attempt/$MAX_RETRIES)..."
    sleep 1
done
echo ""

echo -e "${GREEN}[5/8]${NC} Applying database migrations..."
npm run db:migrate --prefix "$BACKEND_DIR"
echo -e "  ${GREEN}✓${NC} Database migrations applied"
echo ""

echo -e "${GREEN}[6/8]${NC} Building applications..."
npm run typecheck --prefix "$BACKEND_DIR"
npm run build --prefix "$BACKEND_DIR"
npm run typecheck --prefix "$FRONTEND_DIR"
npm run build --prefix "$FRONTEND_DIR"
echo -e "  ${GREEN}✓${NC} Backend and frontend builds passed"
echo ""

echo -e "${GREEN}[7/8]${NC} Verifying services..."
if ! docker compose --project-directory "$BACKEND_DIR" ps --status running --services | grep -qx "postgres"; then
    echo -e "  ${RED}✗${NC} PostgreSQL container is not running"
    exit 1
fi
echo -e "  ${GREEN}✓${NC} PostgreSQL container is running"
echo ""

trap - ERR

echo -e "${GREEN}[8/8]${NC} Starting backend and frontend..."

(
    cd "$BACKEND_DIR"
    exec npm run start:dev
) &
BACKEND_PID=$!

(
    cd "$FRONTEND_DIR"
    exec npm run dev
) &
FRONTEND_PID=$!

trap cleanup_servers EXIT
trap handle_shutdown INT TERM

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✓ Verba is running!${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "Frontend:   ${BLUE}http://localhost:5173${NC}"
echo -e "API:        ${BLUE}http://localhost:5001/api${NC}"
echo -e "PostgreSQL: ${BLUE}localhost:5433${NC}"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop the frontend and backend.${NC}"

while kill -0 "$BACKEND_PID" 2>/dev/null && kill -0 "$FRONTEND_PID" 2>/dev/null; do
    sleep 1
done

SERVER_NAME="Backend"
SERVER_PID="$BACKEND_PID"

if kill -0 "$BACKEND_PID" 2>/dev/null; then
    SERVER_NAME="Frontend"
    SERVER_PID="$FRONTEND_PID"
fi

set +e
wait "$SERVER_PID"
SERVER_EXIT_CODE=$?
set -e

if [[ "$SERVER_EXIT_CODE" -eq 0 ]]; then
    SERVER_EXIT_CODE=1
fi

echo ""
echo -e "${RED}✗ ${SERVER_NAME} stopped unexpectedly (exit code ${SERVER_EXIT_CODE}).${NC}"
exit "$SERVER_EXIT_CODE"
