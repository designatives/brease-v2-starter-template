# Brease starter (Next.js)

A small website — Home, About, Contact — whose content is edited in [Brease](https://brease.io).

## Start a site from it

1. In Brease, create a site and choose **Start from scratch** in the GitHub step. It opens GitHub with this template; create the repository.
2. Connect Vercel in the next step. Brease creates the Vercel project and writes every setting the site needs.
3. Brease imports the first content from `brease-seed/`, and you can edit the site in the Brease editor.

No coding needed. Developers: see `BREASE.md` for the structure and content model.

## Run locally

```sh
pnpm install
cp .env.example .env.local   # BREASE_TOKEN (and BREASE_API_URL for a local Brease)
pnpm dev
```
