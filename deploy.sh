#!/usr/bin/env bash
# Commit any changes to docs/ and push to main.
# GitHub Pages will serve docs/ at www.aisloperator.com.
#
# One-time GitHub setup:
#   1. Push this repo to GitHub and add it as origin.
#   2. Repo Settings → Pages → Source: "Deploy from a branch",
#      branch: main, folder: /docs.
#   3. Under Pages → Custom domain, enter: www.aisloperator.com
#   4. At your DNS registrar, add a CNAME record: www → aisloperator.github.io

set -euo pipefail

REMOTE="origin"
BRANCH="main"
DOCS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/docs" && pwd)"

# ── colours ───────────────────────────────────────────────────────────────────
if [[ -t 1 ]]; then
  BOLD=$'\e[1m' GREEN=$'\e[32m' CYAN=$'\e[36m' YELLOW=$'\e[33m' RED=$'\e[31m' RESET=$'\e[0m'
else
  BOLD='' GREEN='' CYAN='' YELLOW='' RED='' RESET=''
fi
log()  { echo "${CYAN}▶${RESET} $*"; }
ok()   { echo "${GREEN}✔${RESET} $*"; }
warn() { echo "${YELLOW}⚠${RESET} $*"; }
die()  { echo "${RED}✖${RESET} $*" >&2; exit 1; }

# ── preflight ─────────────────────────────────────────────────────────────────
command -v git &>/dev/null || die "git not found."
[[ -d "$DOCS_DIR" ]]       || die "docs/ directory not found."
git remote get-url "$REMOTE" &>/dev/null \
  || die "No '$REMOTE' remote. Run: git remote add origin <your-github-repo-url>"

echo
echo "${BOLD}AI Sloperator — deploy to GitHub Pages${RESET}"

# ── stage, commit, push ───────────────────────────────────────────────────────
log "Staging docs/…"
git add "$DOCS_DIR"

if git diff --cached --quiet; then
  warn "No changes to deploy."
  echo
  exit 0
fi

log "Committing…"
git commit -m "deploy $(date -u '+%Y-%m-%d %H:%M UTC')"

log "Pushing to ${REMOTE}/${BRANCH}…"
git push "$REMOTE" "$BRANCH"

echo
ok "${BOLD}Done.${RESET}  https://www.aisloperator.com"
echo "   It may take a minute for GitHub Pages to update."
echo
