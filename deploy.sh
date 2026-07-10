#!/usr/bin/env bash
# Push site/ to the gh-pages branch on GitHub.
# GitHub Pages will serve it at www.aisloperator.com.
#
# First-time setup:
#   1. Create a GitHub repo and add it as origin:
#        git remote add origin git@github.com:aisloperator/aisloperator-website.git
#   2. In GitHub repo Settings → Pages → Source, choose "Deploy from branch",
#      branch: gh-pages, folder: / (root).
#   3. Under Pages → Custom domain, enter:  www.aisloperator.com
#   4. Point your DNS CNAME record:  www  →  aisloperator.github.io
#
# Then just run:  ./deploy.sh

set -euo pipefail

REMOTE="origin"
BRANCH="gh-pages"
SITE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/site" && pwd)"
DRY_RUN=false

for arg in "$@"; do
  case "$arg" in
    --dry-run) DRY_RUN=true ;;
    *) echo "Unknown flag: $arg"; exit 1 ;;
  esac
done

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
[[ -d "$SITE_DIR" ]]       || die "site/ directory not found."
REMOTE_URL=$(git remote get-url "$REMOTE" 2>/dev/null) \
  || die "No '$REMOTE' remote. Run: git remote add origin <your-github-repo-url>"

echo
echo "${BOLD}AI Sloperator — deploy to GitHub Pages${RESET}"
echo "  source  : $SITE_DIR"
echo "  remote  : $REMOTE_URL"
echo "  branch  : $BRANCH"
$DRY_RUN && warn "DRY RUN — nothing will be pushed"
echo

if $DRY_RUN; then
  log "Would copy site/ and force-push to ${BRANCH}."
  ok "Dry run complete."
  echo
  exit 0
fi

# ── build a clean deploy snapshot in a temp dir ───────────────────────────────
TMPDIR=$(mktemp -d)
trap 'rm -rf "$TMPDIR"' EXIT

log "Copying site/…"
cp -r "$SITE_DIR/." "$TMPDIR/"

log "Committing…"
cd "$TMPDIR"
git init -q
git checkout -q -b "$BRANCH"
# Use repo's git identity if set, fall back to a neutral default
git config user.name  "$(git -C "$OLDPWD" config user.name  2>/dev/null || echo 'deploy')"
git config user.email "$(git -C "$OLDPWD" config user.email 2>/dev/null || echo 'deploy@localhost')"
git add -A
git commit -q -m "deploy $(date -u '+%Y-%m-%d %H:%M UTC')"

log "Pushing to ${REMOTE}/${BRANCH}…"
git push --force --quiet "$REMOTE_URL" "$BRANCH"

echo
ok "${BOLD}Done.${RESET}  https://www.aisloperator.com"
echo "   It may take a minute for GitHub Pages to update."
echo
