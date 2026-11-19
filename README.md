# AI Sloperator Website

Source for the static website at https://www.aisloperator.com/.

Created by [AI Sloperator](https://www.aisloperator.com/) with Claude Code.

Portions Copyright.  No license is given.

## Layout

- `docs/` — the site itself (`index.html`, `style.css`, images). GitHub Pages
  serves this folder as-is; there is no build step.
- `deploy.sh` — optional helper script for publishing (see below).

## Deploying

The site is hosted by GitHub Pages from the `docs/` folder of the `main`
branch. **Any push to `main` that changes `docs/` deploys the site.** A plain
commit and push is enough, and the script isn't needed:

```sh
git add docs/
git commit -m "Describe the change"
git push origin main
```

GitHub Pages usually takes a minute or so to update after the push.

### `deploy.sh`

`deploy.sh` is a convenience wrapper around that same commit and push. It:

1. Checks that `git` is installed, `docs/` exists and an `origin` remote is
   set up.
2. Stages everything under `docs/`.
3. Exits with "No changes to deploy" if nothing is staged.
4. Otherwise commits with a timestamped message, such as
   `deploy 2026-11-19 14:05 UTC`.
5. Pushes to `origin/main`.

The script stages all of `docs/` and uses a generic commit message. To get a
descriptive message, commit by hand instead.

### One-time GitHub Pages setup

These steps are only needed when setting up hosting from scratch:

1. In the repo's Settings → Pages, set Source to "Deploy from a branch",
   with branch `main` and folder `/docs`.
2. Under Pages → Custom domain, enter `www.aisloperator.com`.
3. At the DNS registrar, add a CNAME record: `www` → `aisloperator.github.io`.
