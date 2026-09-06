# Automatic Modern Billionaire Results

The scheduled GitHub Action imports official Modern Billionaire winning and machine numbers into the existing Supabase `results` table.

## Required GitHub secrets

Open the repository and go to **Settings → Secrets and variables → Actions → New repository secret**.

Add these two secrets:

1. `SUPABASE_URL` — the Supabase project URL.
2. `SUPABASE_SECRET_KEY` — the Supabase secret key from **Supabase → Project Settings → API Keys**.

If the project only displays legacy keys, add the `service_role` key as `SUPABASE_SERVICE_ROLE_KEY` instead. The importer supports either key type.

Never place the service-role key in a website JavaScript file or commit it to GitHub.

## Normal operation

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
