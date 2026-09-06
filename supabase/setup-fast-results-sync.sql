-- Run this once in Supabase Dashboard > SQL Editor after deploying the function.
-- It schedules the official Modern Billionaire importer every two minutes and
-- enables browser live updates for the public.results table.

create extension if not exists pg_cron with schema pg_catalog;
create extension if not exists pg_net with schema extensions;

do $$
begin
  if not exists (
    select 1 from vault.secrets where name = 'jols_project_url'
  ) then
    perform vault.create_secret(
      'https://iedgznzmmfkdhgmkghwt.supabase.co',
      'jols_project_url'
    );
  end if;

  if not exists (
    select 1 from vault.secrets where name = 'jols_publishable_key'
  ) then
    perform vault.create_secret(
      'sb_publishable_2ISlJFC6phcU5o60zOs1sg_ADZODm4l',
      'jols_publishable_key'
    );
  end if;
end
$$;

do $$
begin
  if exists (
    select 1 from cron.job where jobname = 'sync-modern-results-every-two-minutes'
  ) then
    perform cron.unschedule('sync-modern-results-every-two-minutes');
  end if;
end
$$;

select cron.schedule(
  'sync-modern-results-every-two-minutes',
  '*/2 * * * *',
  $$
  select net.http_post(
    url := (
      select decrypted_secret
      from vault.decrypted_secrets
      where name = 'jols_project_url'
      limit 1
    ) || '/functions/v1/sync-modern-results',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'apikey', (
        select decrypted_secret
        from vault.decrypted_secrets
        where name = 'jols_publishable_key'
        limit 1
      )
    ),
    body := jsonb_build_object('scheduled_at', now())
  );
  $$
);

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'results'
  ) then
    alter publication supabase_realtime add table public.results;
  end if;
end
$$;
