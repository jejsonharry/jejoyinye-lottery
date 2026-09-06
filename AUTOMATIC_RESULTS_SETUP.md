# Automatic Modern Billionaire Results

The primary updater is the Supabase Edge Function in `supabase/functions/sync-modern-results`. Supabase Cron calls it every two minutes and the website listens for database changes, so an open results page updates shortly after a new result is imported.

The scheduled GitHub Action still runs every ten minutes as an independent backup.

## One-time fast updater setup

1. Create a Supabase personal access token from **Supabase Dashboard → Account → Access Tokens**.
2. In GitHub, open **Settings → Secrets and variables → Actions → New repository secret** and save it as `SUPABASE_ACCESS_TOKEN`.
3. Open **Actions → Deploy Supabase Results Function → Run workflow** and wait for the deployment to finish successfully.
4. In Supabase, open **SQL Editor**, paste all of `supabase/setup-fast-results-sync.sql`, and select **Run**.

The SQL enables `pg_cron`, `pg_net`, and Realtime for `public.results`, then schedules `sync-modern-results` every two minutes. It is safe to run the setup SQL again if the schedule needs to be repaired.

## Required GitHub secrets

Open the repository and go to **Settings → Secrets and variables → Actions → New repository secret**.

Add these two secrets:

1. `SUPABASE_URL` — the Supabase project URL.
2. `SUPABASE_SECRET_KEY` — the Supabase secret key from **Supabase → Project Settings → API Keys**.

If the project only displays legacy keys, add the `service_role` key as `SUPABASE_SERVICE_ROLE_KEY` instead. The importer supports either key type.

Never place the service-role key in a website JavaScript file or commit it to GitHub.

## Backup operation

The workflow runs every ten minutes and checks both today and yesterday in Nigeria time. Existing results are updated when the official numbers change; unchanged results are skipped, so repeated workflow runs do not create duplicates.

Manual result publishing in the admin dashboard remains available as a backup.

## Initial historical import

Open **Actions → Import Modern Billionaire Results → Run workflow** and import one year at a time:

- `2023-01-01` to `2023-12-31`
- `2024-01-01` to `2024-12-31`
- `2025-01-01` to `2025-12-31`
- `2026-01-01` to the current date

Each game/date is checked before it is inserted, so an historical run can safely be repeated.

## Game mapping

The official merchant identifiers are mapped to the JOLS names: Powerball, Awoof, Biggest Bet, Gold Rush, Lucky Dollar, Blessing, Owo Time, Modern Bingo, Bonus Cash, Hero, Golden and Queen.
